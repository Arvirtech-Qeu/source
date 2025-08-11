package com.swomb.qbox.pool;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import com.swomb.qbox.common.AppRestAPIBaseVerticle;
import com.swomb.qbox.common.util.Constants;
import com.swomb.qbox.common.util.HttpConstants;
import com.swomb.qbox.pool.util.SqlQueries;
import com.swomb.qbox.pool.util.MastersAddressConstants;
import com.swomb.qbox.process.PreProcessor;
import com.swomb.qbox.process.builder.PreProcessBuilder;

import io.vertx.core.file.FileSystemException;
import io.vertx.core.file.OpenOptions;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.json.schema.SchemaRouterOptions;
import io.vertx.reactivex.core.buffer.Buffer;
import io.vertx.reactivex.core.file.AsyncFile;
import io.vertx.reactivex.core.http.HttpServer;
import io.vertx.reactivex.ext.web.FileUpload;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.handler.BodyHandler;
import io.vertx.reactivex.ext.web.handler.CorsHandler;
import io.vertx.reactivex.ext.web.handler.StaticHandler;
import io.vertx.reactivex.json.schema.Schema;
import io.vertx.reactivex.json.schema.SchemaParser;
import io.vertx.reactivex.json.schema.SchemaRouter;

public class ServerVerticle extends AppRestAPIBaseVerticle {

	Logger log = LoggerFactory.getLogger(MainVerticle.class.getName());

	private HttpServer httpServer;

	SchemaParser schemaParser;
	Schema schema;

	public static String DB_SCHEMA = Constants.DEFAULT_SCHEMA;

	@Override
	public void start() throws Exception {
		// TODO Auto-generated method stub

		Router router = Router.router(vertx);

		Set<String> allowHeaders = new HashSet<>();
		allowHeaders.add(HttpConstants.HTTP_HEADER_X_REQUESTED_WITH);
		allowHeaders.add(HttpConstants.HTTP_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN);
		allowHeaders.add(HttpConstants.HTTP_HEADER_ORIGIN);
		allowHeaders.add(HttpConstants.HTTP_HEADER_CONTENT_TYPE);
		allowHeaders.add(HttpConstants.HTTP_HEADER_ACCEPT);
		allowHeaders.add(HttpConstants.HTTP_HEADER_AUTHORIZATION);
		Set<HttpMethod> allowMethods = new HashSet<>();
		allowMethods.add(HttpMethod.GET);
		allowMethods.add(HttpMethod.PUT);
		allowMethods.add(HttpMethod.OPTIONS);
		allowMethods.add(HttpMethod.POST);
		allowMethods.add(HttpMethod.DELETE);
		allowMethods.add(HttpMethod.PATCH);

		CorsHandler corsHandler = CorsHandler.create("*").allowedHeader("*").allowedMethods(allowMethods);

		router.route().handler(corsHandler);

		SchemaRouter schemaRouter = SchemaRouter.create(vertx, new SchemaRouterOptions());
		schemaParser = SchemaParser.createDraft201909SchemaParser(schemaRouter);

		router.route("/assets/*").handler(StaticHandler.create("assets"));
		router.route(MastersAddressConstants.API_PREFIX + "*").handler(BodyHandler.create());

		vertx.setPeriodic(10000, id -> {
			System.out.println("Pool job executed: " + System.currentTimeMillis());
			try {
				check_new_order();
			} catch (FileSystemException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		});

		router.post("/api/v1/pool/upload_order_csv").handler(routingContext -> {
			try {
				Set<FileUpload> fileUploads = routingContext.fileUploads();
				for (FileUpload fileUpload : fileUploads) {
					String uploadedFileName = fileUpload.uploadedFileName();
					String originalFileName = fileUpload.fileName();

					// Create directory
					String folderPath = "uploads/";
					File folder = new File(folderPath);
					if (!folder.exists()) {
						folder.mkdirs();
					}

					// Move file to target folder with new name
					File uploadedFile = new File(uploadedFileName);
					File destinationFile = new File(folderPath + "/" + originalFileName);

					if (uploadedFile.renameTo(destinationFile)) {
						log.info("File successfully moved and renamed to: " + originalFileName);
						routingContext.response().setStatusCode(200).end(new JsonObject().put("status", "success")
								.put("path", folderPath).put("filename", originalFileName).encode());
					} else {
						throw new IOException("Failed to move file: " + originalFileName);
					}
				}
			} catch (Exception e) {
				log.error("Error processing file upload: ", e);
				routingContext.response().setStatusCode(500)
						.end(new JsonObject().put("status", "error").put("message", e.getMessage()).encode());
			}
		});

		super.start();

		this.httpServer = vertx.createHttpServer();
		int portNo = 8913; // Integer.parseInt(config().getString(ConfigConstants.MICRO_SERVICE_PORT));
		if (this.httpServer != null && portNo > 0) {
			this.httpServer.requestHandler(router).requestStream().toFlowable().subscribe();
			this.httpServer.rxListen(portNo);
			this.httpServer.requestHandler(router).rxListen(portNo).subscribe();
			log.info("ServerVerticle Started");
		}
	}

	private void check_new_order() throws FileSystemException,Exception {
		String folderPath = "uploads/";
		File folder = new File(folderPath);

		// Check if folder exists
		if (!folder.exists()) {
			log.info("No folder found: " + folderPath);
			return;
		}

		// Get all files in the directory
		File[] files = folder.listFiles();
		if (files == null || files.length == 0) {
			log.info("No files found in folder: " + folderPath);
			return;
		}

		for (File file : files) {
			if (file.isFile() && file.getName().endsWith(".csv")) {
				vertx.fileSystem().open(file.getAbsolutePath(), new OpenOptions(), asyncResult -> {
					if (asyncResult.succeeded()) {
						AsyncFile asyncFile = asyncResult.result();
						Buffer totalBuffer = Buffer.buffer();

						// Set up the data handler to accumulate the chunks
						asyncFile.handler(buffer -> {
							totalBuffer.appendBuffer(buffer);
						});

						// Set up the end handler to process the complete file
						asyncFile.endHandler(v -> {
							try {
								// Convert CSV to JSON
								String csvContent = totalBuffer.toString();
								JsonArray jsonArray = convertCsvToJson(csvContent);

								// Close the file
								asyncFile.close(closeResult -> {
									if (closeResult.succeeded())  {
										// Process the JSON data
										try {
											processJsonData(jsonArray, file);
										} catch (Exception e) {
											// TODO Auto-generated catch block
											e.printStackTrace();
										}
									} else {
										log.error("Error closing file: " + file.getName(), closeResult.cause());
									}
								});
							} catch (Exception e) {
								log.error("Error processing file: " + file.getName(), e);
								asyncFile.close();
							}
						});

						// Handle any errors during file reading
						asyncFile.exceptionHandler(throwable -> {
							log.error("Error reading file: " + file.getName(), throwable);
							asyncFile.close();
						});

					} else {
						log.error("Failed to open file: " + file.getName(), asyncResult.cause());
					}
				});
			}
		}
	}

	private void processJsonData(JsonArray jsonArray, File file) throws Exception {
		String originalFileName = file.getName();
		// Create a JSON object with metadata and data
		JsonObject payload = new JsonObject().put("filename", originalFileName).put("processed_by", originalFileName)
				.put("timestamp", System.currentTimeMillis()).put("records", jsonArray);

		sendToRemoteServer(payload, file);
	}

	private void sendToRemoteServer(JsonObject payload, File file) throws Exception {
		log.info("sendToRemoteServer");
		log.info(payload);
		vertx.eventBus()
				.rxRequest(MastersAddressConstants.PROCESS_ETL_JOB_V4, new JsonObject()
						.put(Constants.QUERY, SqlQueries.PROCESS_ETL_JOB_V4).put(Constants.DATA, payload))
				.timeout(10000, TimeUnit.MILLISECONDS).subscribe(response -> {
					JsonObject responseBody = (JsonObject) response.body();
					if (responseBody.getInteger("status").equals(201)) {
						log.error("successfully created : " + responseBody.getJsonObject("data").getString("message"));
						// Move the processed CSV file
						moveProcessedFile(file);
					} else if (responseBody.getInteger("status").equals(500)) {
						log.error("Failed : " + responseBody.getString("errorMsg"));
					} else {
						log.error("sendToRemoteServer");
					}
				}, err -> {
					log.error("Failed : " + err.getMessage());
				});
	}

	private void moveProcessedFile(File file) throws FileSystemException {
		String processedPath = "processed/";

		File folder = new File(processedPath);
		if (!folder.exists()) {
			folder.mkdirs();
		}
		try {
	        // Get file extension and base name
	        String fileExtension = file.getName().substring(file.getName().lastIndexOf("."));
	        String baseFileName = file.getName().substring(0, file.getName().lastIndexOf("."));
	     // Create new filename with timestamp
	        String timestamp = LocalDateTime.now(ZoneOffset.UTC)
	            .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
	        String newFileName = baseFileName + "_" + timestamp + fileExtension;
	        
	        
			// Move file to processed directory
			vertx.fileSystem().move(file.getAbsolutePath(), processedPath + newFileName, moveResult -> {
				if (moveResult.succeeded()) {
					log.info("Moved processed file: " + file.getName() + " to processed folder");
				} else {
					log.error("Failed to move processed file: " + file.getName(), moveResult.cause());
				}
			});
		} catch (Exception e) {
			// TODO: handle exception
			log.info("This File Already Moved : " + file.getName());
		}
	}

	private JsonArray convertCsvToJson(String csvContent) {
		JsonArray jsonArray = new JsonArray();
		String[] lines = csvContent.split("\n");

		if (lines.length < 2) {
			return jsonArray;
		}

		// Get headers from first line
		String[] headers = lines[0].trim().split(",");

		// Process data lines
		for (int i = 1; i < lines.length; i++) {
			String line = lines[i].trim();
			if (!line.isEmpty()) {
				String[] values = line.split(",");
				JsonObject jsonObject = new JsonObject();

				// Map CSV values to JSON properties
				for (int j = 0; j < headers.length && j < values.length; j++) {
					String value = values[j].trim();
					// Try to parse numbers if possible
					try {
						if (value.contains(".")) {
							jsonObject.put(headers[j].trim(), Double.parseDouble(value));
						} else {
							jsonObject.put(headers[j].trim(), Integer.parseInt(value));
						}
					} catch (NumberFormatException e) {
						// If not a number, store as string
						jsonObject.put(headers[j].trim(), value);
					}
				}
				jsonArray.add(jsonObject);
			}
		}

		return jsonArray;
	}

	public void sendSms(JsonObject data) {
		log.info("sendSms started");
		vertx.eventBus().send("send_sms", data);
	}

	public void sendPublish(JsonObject data) {
		log.info("sendPublish started");
		vertx.eventBus().send("publish_msg", data);
	}

	public void sendNotification(JsonObject data) {
		log.info("sendNotification started");
		vertx.eventBus().send("send_notification", data);
	}

}
