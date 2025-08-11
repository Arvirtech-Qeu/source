package com.swomb.qbox.qbox;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

//import com.hazelcast.internal.json.JsonArray;
import com.swomb.qbox.common.AppRestAPIBaseVerticle;
import com.swomb.qbox.common.util.ConfigConstants;
import com.swomb.qbox.common.util.Constants;
import com.swomb.qbox.common.util.HttpConstants;
import com.swomb.qbox.process.PreProcessor;
import com.swomb.qbox.process.builder.PreProcessBuilder;
import com.swomb.qbox.qbox.util.QboxAddressConstants;
import com.swomb.qbox.qbox.util.SqlQueries;

import io.vertx.core.http.HttpMethod;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonObject;
import io.vertx.json.schema.SchemaRouterOptions;
import io.vertx.reactivex.core.http.HttpServer;
import io.vertx.reactivex.ext.web.FileUpload;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.handler.BodyHandler;
import io.vertx.reactivex.ext.web.handler.CorsHandler;
import io.vertx.reactivex.ext.web.handler.StaticHandler;
import io.vertx.reactivex.json.schema.Schema;
import io.vertx.reactivex.json.schema.SchemaParser;
import io.vertx.reactivex.json.schema.SchemaRouter;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;

import java.io.File;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.Set;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

public class ServerVerticle extends AppRestAPIBaseVerticle {

	Logger log = LoggerFactory.getLogger(MainVerticle.class.getName());

	private HttpServer httpServer;

	SchemaParser schemaParser;
	Schema schema;

	public static String DB_SCHEMA = Constants.DEFAULT_SCHEMA;

	@Override
	public void start() throws Exception {
		// TODO Auto-generated method stub
		super.start();

		// DB_SCHEMA =
		// Crypto.decryptData(config().getString(ConfigConstants.DB_SCHEMA_KEY));
		// CONTENT_TYPE = config().getString(ConfigConstants.REQUEST_CONTENT_TYPE);
		// ACCESS_CONTROL_ALLOW_ORIGIN =
		// config().getString(ConfigConstants.REQUEST_ACCESS_CONTROL_ALLOW_ORIGIN);

		SchemaRouter schemaRouter = SchemaRouter.create(vertx, new SchemaRouterOptions());
		schemaParser = SchemaParser.createDraft201909SchemaParser(schemaRouter);

		final Router router = Router.router(vertx);
		enableCorsSupport(router);

		router.route("/assets/*").handler(StaticHandler.create("assets"));
		router.route(QboxAddressConstants.API_PREFIX + "*").handler(BodyHandler.create());

		router.get(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SERVICE_HEALTH).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						PreProcessor.doProcess(data,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.SERVICE_HEALTH)),
						QboxAddressConstants.SERVICE_HEALTH, SqlQueries.SERVICE_HEALTH);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.SERVICE_HEALTH);
			}
		});

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.VERIFY_INWARD_DELIVERY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.VERIFY_INWARD_DELIVERY)),
								QboxAddressConstants.VERIFY_INWARD_DELIVERY, SqlQueries.VERIFY_INWARD_DELIVERY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.VERIFY_INWARD_DELIVERY);
					}
				});

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.GET_CROSSED_STAGES_INFO)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.GET_CROSSED_STAGES_INFO)),
								QboxAddressConstants.GET_CROSSED_STAGES_INFO, SqlQueries.GET_CROSSED_STAGES_INFO);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.GET_CROSSED_STAGES_INFO);
					}
				});

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.ACCEPT_SKU).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.ACCEPT_SKU)),
						QboxAddressConstants.ACCEPT_SKU, SqlQueries.ACCEPT_SKU);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.ACCEPT_SKU);
			}
		});

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.REJECT_SKU).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
//				log.info("Input Request : " + inputJson.encodePrettily());
				multiMediaUpload(inputJson.getJsonObject("images"), result -> {
					if (result.succeeded()) {
						inputJson.remove("images");
						inputJson.put("images", result.result().getInteger("mediaSno"));
						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.REJECT_SKU)),
								QboxAddressConstants.REJECT_SKU, SqlQueries.REJECT_SKU);
					}
				});
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.REJECT_SKU);
			}
		});

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.GET_QBOX_CURRENT_STATUS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.GET_QBOX_CURRENT_STATUS)),
								QboxAddressConstants.GET_QBOX_CURRENT_STATUS, SqlQueries.GET_QBOX_CURRENT_STATUS);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.GET_QBOX_CURRENT_STATUS);
					}
				});

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS)),
								QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS, SqlQueries.GET_HOTBOX_CURRENT_STATUS);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS);
					}
				});

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.INTERNAL_INVENTORY_MOVEMENT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.INTERNAL_INVENTORY_MOVEMENT)),
								QboxAddressConstants.INTERNAL_INVENTORY_MOVEMENT,
								SqlQueries.INTERNAL_INVENTORY_MOVEMENT);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.INTERNAL_INVENTORY_MOVEMENT);
					}
				});

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.LOAD_SKU_IN_QBOX).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.LOAD_SKU_IN_QBOX)),
						QboxAddressConstants.LOAD_SKU_IN_QBOX, SqlQueries.LOAD_SKU_IN_QBOX);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.LOAD_SKU_IN_QBOX);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.UNLOAD_SKU_FROM_QBOX_TO_HOTBOX)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												QboxAddressConstants.UNLOAD_SKU_FROM_QBOX_TO_HOTBOX)),
								QboxAddressConstants.UNLOAD_SKU_FROM_QBOX_TO_HOTBOX,
								SqlQueries.UNLOAD_SKU_FROM_QBOX_TO_HOTBOX);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.UNLOAD_SKU_FROM_QBOX_TO_HOTBOX);
					}
				});

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.PARTNER_CHANNEL_INWARD_ORDER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.PARTNER_CHANNEL_INWARD_ORDER)),
								QboxAddressConstants.PARTNER_CHANNEL_INWARD_ORDER,
								SqlQueries.PARTNER_CHANNEL_INWARD_ORDER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.PARTNER_CHANNEL_INWARD_ORDER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY)),
								QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY,
								SqlQueries.PARTNER_CHANNEL_INWARD_DELIVERY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY);
					}
				});

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_LIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_LIST)),
								QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_LIST,
								SqlQueries.PARTNER_CHANNEL_INWARD_DELIVERY_LIST);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_LIST);
					}
				});

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_ORDER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_ORDER)),
								QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_ORDER,
								SqlQueries.PARTNER_CHANNEL_OUTWARD_ORDER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_ORDER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY)),
								QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY,
								SqlQueries.PARTNER_CHANNEL_OUTWARD_DELIVERY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY);
					}
				});

		// API ENTRIES
		// =================================================
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_BOX_CELL).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.SEARCH_BOX_CELL)),
						QboxAddressConstants.SEARCH_BOX_CELL, SqlQueries.SEARCH_BOX_CELL);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.SEARCH_BOX_CELL);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_BOX_CELL).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.CREATE_BOX_CELL)),
						QboxAddressConstants.CREATE_BOX_CELL, SqlQueries.CREATE_BOX_CELL);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.CREATE_BOX_CELL);
			}
		});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_BOX_CELL).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_BOX_CELL)),
						QboxAddressConstants.EDIT_BOX_CELL, SqlQueries.EDIT_BOX_CELL);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.EDIT_BOX_CELL);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_BOX_CELL).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.DELETE_BOX_CELL)),
						QboxAddressConstants.DELETE_BOX_CELL, SqlQueries.DELETE_BOX_CELL);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.DELETE_BOX_CELL);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_BOX_CELL_FOOD)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.SEARCH_BOX_CELL_FOOD)),
								QboxAddressConstants.SEARCH_BOX_CELL_FOOD, SqlQueries.SEARCH_BOX_CELL_FOOD);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_BOX_CELL_FOOD);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_BOX_CELL_FOOD)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.CREATE_BOX_CELL_FOOD)),
								QboxAddressConstants.CREATE_BOX_CELL_FOOD, SqlQueries.CREATE_BOX_CELL_FOOD);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_BOX_CELL_FOOD);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_BOX_CELL_FOOD)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_BOX_CELL_FOOD)),
								QboxAddressConstants.EDIT_BOX_CELL_FOOD, SqlQueries.EDIT_BOX_CELL_FOOD);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.EDIT_BOX_CELL_FOOD);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_BOX_CELL_FOOD)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.DELETE_BOX_CELL_FOOD)),
								QboxAddressConstants.DELETE_BOX_CELL_FOOD, SqlQueries.DELETE_BOX_CELL_FOOD);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_BOX_CELL_FOOD);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_BOX_CELL_FOOD_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.SEARCH_BOX_CELL_FOOD_HIST)),
								QboxAddressConstants.SEARCH_BOX_CELL_FOOD_HIST, SqlQueries.SEARCH_BOX_CELL_FOOD_HIST);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_BOX_CELL_FOOD_HIST);
					}
				});
		
		router.post("/api/v1/masters/upload_order_csv").handler(routingContext -> {
		    try {
		        Set<FileUpload> fileUploads = routingContext.fileUploads();
		        for (FileUpload fileUpload : fileUploads) {
		            String uploadedFileName = fileUpload.uploadedFileName();
		            String uploadedFileNameWithoutPath = fileUpload.fileName();
		            log.info("Uploaded File: " + uploadedFileNameWithoutPath);

		            // Create directory
		            String folderPath = "uploads/" + LocalDate.now();
		            File folder = new File(folderPath);
		            if (!folder.exists()) {
		                folder.mkdirs();
		            }

		            // Move file to target folder
		            File uploadedFile = new File(uploadedFileName);
		            uploadedFile.renameTo(new File(folderPath + "/" + uploadedFileNameWithoutPath));

		            routingContext.response()
		                .setStatusCode(200)
		                .end(new JsonObject().put("status", "success").put("path", folderPath).encode());
		        }
		    } catch (Exception e) {
		        log.error("Error processing file upload: ", e);
		        routingContext.response()
		            .setStatusCode(500)
		            .end(new JsonObject().put("status", "error").put("message", e.getMessage()).encode());
		    }
		});

//		router.post("/api/v1/masters/upload_order_csv").handler(routingContext -> {
//		    try {
//		        // Get uploaded files from the request
//		        Set<FileUpload> fileUploads = routingContext.fileUploads();
//		        if (fileUploads.isEmpty()) {
//		            routingContext.response()
//		                .setStatusCode(400)
//		                .putHeader("Content-Type", "application/json")
//		                .end(new JsonObject().put("status", "error").put("message", "No file uploaded").encode());
//		            return;
//		        }
//
//		        for (FileUpload fileUpload : fileUploads) {
//		            // Get the uploaded file path
//		            String uploadedFilePath = fileUpload.uploadedFileName();
//		            String originalFileName = fileUpload.fileName(); // Original file name from the client
//		            String targetFolder = "uploads/" + LocalDate.now(); // Target folder path
//
//		            // Ensure the target folder exists
//		            File folder = new File(targetFolder);
//		            if (!folder.exists()) {
//		                folder.mkdirs();
//		            }
//
//		            // Move the file to the target folder
//		            String targetFilePath = targetFolder + "/" + originalFileName;
//		            File uploadedFile = new File(uploadedFilePath);
//		            File targetFile = new File(targetFilePath);
//		            uploadedFile.renameTo(targetFile);
//
//		            // Process the moved file (targetFilePath)
//		            List<String> lines = Files.readAllLines(Paths.get(targetFilePath));
//
//		            // Extract the header (first line)
//		            String headerLine = lines.get(0);
//		            String[] headers = headerLine.split(",");
//
//		            // Convert the remaining lines to JSON
//		            JsonArray jsonArray = new JsonArray();
//		            for (int i = 1; i < lines.size(); i++) {
//		                String[] values = lines.get(i).split(",");
//		                JsonObject jsonObject = new JsonObject();
//		                for (int j = 0; j < headers.length; j++) {
//		                    jsonObject.put(headers[j].trim(), values[j].trim());
//		                }
//		                jsonArray.add(jsonObject);
//		            }
//
//		            // Send JSON response back to the client
//		            routingContext.response()
//		                .setStatusCode(200)
//		                .putHeader("Content-Type", "application/json")
//		                .end(new JsonObject()
//		                    .put("status", "success")
//		                    .put("data", jsonArray)
//		                    .encodePrettily());
//		        }
//		    } catch (Exception e) {
//		        // Handle errors
//		        e.printStackTrace();
//		        routingContext.response()
//		            .setStatusCode(500)
//		            .putHeader("Content-Type", "application/json")
//		            .end(new JsonObject()
//		                .put("status", "error")
//		                .put("message", e.getMessage())
//		                .encode());
//		    }
//		});
		

		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_BOX_CELL_FOOD_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.CREATE_BOX_CELL_FOOD_HIST)),
								QboxAddressConstants.CREATE_BOX_CELL_FOOD_HIST, SqlQueries.CREATE_BOX_CELL_FOOD_HIST);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_BOX_CELL_FOOD_HIST);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_BOX_CELL_FOOD_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.EDIT_BOX_CELL_FOOD_HIST)),
								QboxAddressConstants.EDIT_BOX_CELL_FOOD_HIST, SqlQueries.EDIT_BOX_CELL_FOOD_HIST);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.EDIT_BOX_CELL_FOOD_HIST);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_BOX_CELL_FOOD_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.DELETE_BOX_CELL_FOOD_HIST)),
								QboxAddressConstants.DELETE_BOX_CELL_FOOD_HIST, SqlQueries.DELETE_BOX_CELL_FOOD_HIST);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_BOX_CELL_FOOD_HIST);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_CODES_DTL).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.SEARCH_CODES_DTL)),
						QboxAddressConstants.SEARCH_CODES_DTL, SqlQueries.SEARCH_CODES_DTL);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.SEARCH_CODES_DTL);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_CODES_DTL).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.CREATE_CODES_DTL)),
						QboxAddressConstants.CREATE_CODES_DTL, SqlQueries.CREATE_CODES_DTL);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.CREATE_CODES_DTL);
			}
		});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_CODES_DTL).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_CODES_DTL)),
						QboxAddressConstants.EDIT_CODES_DTL, SqlQueries.EDIT_CODES_DTL);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.EDIT_CODES_DTL);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_CODES_DTL).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.DELETE_CODES_DTL)),
						QboxAddressConstants.DELETE_CODES_DTL, SqlQueries.DELETE_CODES_DTL);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.DELETE_CODES_DTL);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_CODES_HDR).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.SEARCH_CODES_HDR)),
						QboxAddressConstants.SEARCH_CODES_HDR, SqlQueries.SEARCH_CODES_HDR);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.SEARCH_CODES_HDR);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_CODES_HDR).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.CREATE_CODES_HDR)),
						QboxAddressConstants.CREATE_CODES_HDR, SqlQueries.CREATE_CODES_HDR);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.CREATE_CODES_HDR);
			}
		});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_CODES_HDR).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_CODES_HDR)),
						QboxAddressConstants.EDIT_CODES_HDR, SqlQueries.EDIT_CODES_HDR);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.EDIT_CODES_HDR);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_CODES_HDR).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.DELETE_CODES_HDR)),
						QboxAddressConstants.DELETE_CODES_HDR, SqlQueries.DELETE_CODES_HDR);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.DELETE_CODES_HDR);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.SEARCH_DELIVERY_PARTNER)),
								QboxAddressConstants.SEARCH_DELIVERY_PARTNER, SqlQueries.SEARCH_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_DELIVERY_PARTNER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.CREATE_DELIVERY_PARTNER)),
								QboxAddressConstants.CREATE_DELIVERY_PARTNER, SqlQueries.CREATE_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_DELIVERY_PARTNER);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.EDIT_DELIVERY_PARTNER)),
								QboxAddressConstants.EDIT_DELIVERY_PARTNER, SqlQueries.EDIT_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.EDIT_DELIVERY_PARTNER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.DELETE_DELIVERY_PARTNER)),
								QboxAddressConstants.DELETE_DELIVERY_PARTNER, SqlQueries.DELETE_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_DELIVERY_PARTNER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_ENTITY_INFRA)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.SEARCH_ENTITY_INFRA)),
								QboxAddressConstants.SEARCH_ENTITY_INFRA, SqlQueries.SEARCH_ENTITY_INFRA);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_ENTITY_INFRA);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_ENTITY_INFRA)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.CREATE_ENTITY_INFRA)),
								QboxAddressConstants.CREATE_ENTITY_INFRA, SqlQueries.CREATE_ENTITY_INFRA);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_ENTITY_INFRA);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_ENTITY_INFRA).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_ENTITY_INFRA)),
						QboxAddressConstants.EDIT_ENTITY_INFRA, SqlQueries.EDIT_ENTITY_INFRA);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.EDIT_ENTITY_INFRA);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_ENTITY_INFRA)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.DELETE_ENTITY_INFRA)),
								QboxAddressConstants.DELETE_ENTITY_INFRA, SqlQueries.DELETE_ENTITY_INFRA);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_ENTITY_INFRA);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_ENTITY_INFRA_PROPERTY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.SEARCH_ENTITY_INFRA_PROPERTY)),
								QboxAddressConstants.SEARCH_ENTITY_INFRA_PROPERTY,
								SqlQueries.SEARCH_ENTITY_INFRA_PROPERTY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_ENTITY_INFRA_PROPERTY);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_ENTITY_INFRA_PROPERTY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.CREATE_ENTITY_INFRA_PROPERTY)),
								QboxAddressConstants.CREATE_ENTITY_INFRA_PROPERTY,
								SqlQueries.CREATE_ENTITY_INFRA_PROPERTY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_ENTITY_INFRA_PROPERTY);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_ENTITY_INFRA_PROPERTY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.EDIT_ENTITY_INFRA_PROPERTY)),
								QboxAddressConstants.EDIT_ENTITY_INFRA_PROPERTY, SqlQueries.EDIT_ENTITY_INFRA_PROPERTY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.EDIT_ENTITY_INFRA_PROPERTY);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_ENTITY_INFRA_PROPERTY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.DELETE_ENTITY_INFRA_PROPERTY)),
								QboxAddressConstants.DELETE_ENTITY_INFRA_PROPERTY,
								SqlQueries.DELETE_ENTITY_INFRA_PROPERTY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_ENTITY_INFRA_PROPERTY);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_INFRA).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.SEARCH_INFRA)),
						QboxAddressConstants.SEARCH_INFRA, SqlQueries.SEARCH_INFRA);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.SEARCH_INFRA);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_INFRA).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.CREATE_INFRA)),
						QboxAddressConstants.CREATE_INFRA, SqlQueries.CREATE_INFRA);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.CREATE_INFRA);
			}
		});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_INFRA).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_INFRA)),
						QboxAddressConstants.EDIT_INFRA, SqlQueries.EDIT_INFRA);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.EDIT_INFRA);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_INFRA).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.DELETE_INFRA)),
						QboxAddressConstants.DELETE_INFRA, SqlQueries.DELETE_INFRA);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.DELETE_INFRA);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_INFRA_PROPERTY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.SEARCH_INFRA_PROPERTY)),
								QboxAddressConstants.SEARCH_INFRA_PROPERTY, SqlQueries.SEARCH_INFRA_PROPERTY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_INFRA_PROPERTY);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_INFRA_PROPERTY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.CREATE_INFRA_PROPERTY)),
								QboxAddressConstants.CREATE_INFRA_PROPERTY, SqlQueries.CREATE_INFRA_PROPERTY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_INFRA_PROPERTY);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_INFRA_PROPERTY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_INFRA_PROPERTY)),
								QboxAddressConstants.EDIT_INFRA_PROPERTY, SqlQueries.EDIT_INFRA_PROPERTY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.EDIT_INFRA_PROPERTY);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_INFRA_PROPERTY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.DELETE_INFRA_PROPERTY)),
								QboxAddressConstants.DELETE_INFRA_PROPERTY, SqlQueries.DELETE_INFRA_PROPERTY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_INFRA_PROPERTY);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_PURCHASE_ORDER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.SEARCH_PURCHASE_ORDER)),
								QboxAddressConstants.SEARCH_PURCHASE_ORDER, SqlQueries.SEARCH_PURCHASE_ORDER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_PURCHASE_ORDER);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_PURCHASE_ORDER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_PURCHASE_ORDER)),
								QboxAddressConstants.EDIT_PURCHASE_ORDER, SqlQueries.EDIT_PURCHASE_ORDER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.EDIT_PURCHASE_ORDER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_PURCHASE_ORDER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.DELETE_PURCHASE_ORDER)),
								QboxAddressConstants.DELETE_PURCHASE_ORDER, SqlQueries.DELETE_PURCHASE_ORDER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_PURCHASE_ORDER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_PURCHASE_ORDER_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.SEARCH_PURCHASE_ORDER_DTL)),
								QboxAddressConstants.SEARCH_PURCHASE_ORDER_DTL, SqlQueries.SEARCH_PURCHASE_ORDER_DTL);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_PURCHASE_ORDER_DTL);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_PURCHASE_ORDER_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.CREATE_PURCHASE_ORDER_DTL)),
								QboxAddressConstants.CREATE_PURCHASE_ORDER_DTL, SqlQueries.CREATE_PURCHASE_ORDER_DTL);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_PURCHASE_ORDER_DTL);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_PURCHASE_ORDER_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.EDIT_PURCHASE_ORDER_DTL)),
								QboxAddressConstants.EDIT_PURCHASE_ORDER_DTL, SqlQueries.EDIT_PURCHASE_ORDER_DTL);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.EDIT_PURCHASE_ORDER_DTL);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_PURCHASE_ORDER_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.DELETE_PURCHASE_ORDER_DTL)),
								QboxAddressConstants.DELETE_PURCHASE_ORDER_DTL, SqlQueries.DELETE_PURCHASE_ORDER_DTL);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_PURCHASE_ORDER_DTL);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_QBOX_ENTITY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.SEARCH_QBOX_ENTITY)),
								QboxAddressConstants.SEARCH_QBOX_ENTITY, SqlQueries.SEARCH_QBOX_ENTITY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_QBOX_ENTITY);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_QBOX_ENTITY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.CREATE_QBOX_ENTITY)),
								QboxAddressConstants.CREATE_QBOX_ENTITY, SqlQueries.CREATE_QBOX_ENTITY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_QBOX_ENTITY);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_QBOX_ENTITY).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_QBOX_ENTITY)),
						QboxAddressConstants.EDIT_QBOX_ENTITY, SqlQueries.EDIT_QBOX_ENTITY);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.EDIT_QBOX_ENTITY);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_QBOX_ENTITY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.DELETE_QBOX_ENTITY)),
								QboxAddressConstants.DELETE_QBOX_ENTITY, SqlQueries.DELETE_QBOX_ENTITY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_QBOX_ENTITY);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_QBOX_ENTITY_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												QboxAddressConstants.SEARCH_QBOX_ENTITY_DELIVERY_PARTNER)),
								QboxAddressConstants.SEARCH_QBOX_ENTITY_DELIVERY_PARTNER,
								SqlQueries.SEARCH_QBOX_ENTITY_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_QBOX_ENTITY_DELIVERY_PARTNER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_QBOX_ENTITY_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												QboxAddressConstants.CREATE_QBOX_ENTITY_DELIVERY_PARTNER)),
								QboxAddressConstants.CREATE_QBOX_ENTITY_DELIVERY_PARTNER,
								SqlQueries.CREATE_QBOX_ENTITY_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_QBOX_ENTITY_DELIVERY_PARTNER);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_QBOX_ENTITY_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												QboxAddressConstants.EDIT_QBOX_ENTITY_DELIVERY_PARTNER)),
								QboxAddressConstants.EDIT_QBOX_ENTITY_DELIVERY_PARTNER,
								SqlQueries.EDIT_QBOX_ENTITY_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.EDIT_QBOX_ENTITY_DELIVERY_PARTNER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_QBOX_ENTITY_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												QboxAddressConstants.DELETE_QBOX_ENTITY_DELIVERY_PARTNER)),
								QboxAddressConstants.DELETE_QBOX_ENTITY_DELIVERY_PARTNER,
								SqlQueries.DELETE_QBOX_ENTITY_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_QBOX_ENTITY_DELIVERY_PARTNER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_SALES_ORDER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.SEARCH_SALES_ORDER)),
								QboxAddressConstants.SEARCH_SALES_ORDER, SqlQueries.SEARCH_SALES_ORDER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_SALES_ORDER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_SALES_ORDER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.CREATE_SALES_ORDER)),
								QboxAddressConstants.CREATE_SALES_ORDER, SqlQueries.CREATE_SALES_ORDER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_SALES_ORDER);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_SALES_ORDER).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_SALES_ORDER)),
						QboxAddressConstants.EDIT_SALES_ORDER, SqlQueries.EDIT_SALES_ORDER);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.EDIT_SALES_ORDER);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_SALES_ORDER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.DELETE_SALES_ORDER)),
								QboxAddressConstants.DELETE_SALES_ORDER, SqlQueries.DELETE_SALES_ORDER);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_SALES_ORDER);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_SALES_ORDER_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.SEARCH_SALES_ORDER_DTL)),
								QboxAddressConstants.SEARCH_SALES_ORDER_DTL, SqlQueries.SEARCH_SALES_ORDER_DTL);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_SALES_ORDER_DTL);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_SALES_ORDER_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.CREATE_SALES_ORDER_DTL)),
								QboxAddressConstants.CREATE_SALES_ORDER_DTL, SqlQueries.CREATE_SALES_ORDER_DTL);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_SALES_ORDER_DTL);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_SALES_ORDER_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_SALES_ORDER_DTL)),
								QboxAddressConstants.EDIT_SALES_ORDER_DTL, SqlQueries.EDIT_SALES_ORDER_DTL);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.EDIT_SALES_ORDER_DTL);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_SALES_ORDER_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(QboxAddressConstants.DELETE_SALES_ORDER_DTL)),
								QboxAddressConstants.DELETE_SALES_ORDER_DTL, SqlQueries.DELETE_SALES_ORDER_DTL);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_SALES_ORDER_DTL);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_SKU_INVENTORY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.SEARCH_SKU_INVENTORY)),
								QboxAddressConstants.SEARCH_SKU_INVENTORY, SqlQueries.SEARCH_SKU_INVENTORY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_SKU_INVENTORY);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_SKU_INVENTORY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.CREATE_SKU_INVENTORY)),
								QboxAddressConstants.CREATE_SKU_INVENTORY, SqlQueries.CREATE_SKU_INVENTORY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_SKU_INVENTORY);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_SKU_INVENTORY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_SKU_INVENTORY)),
								QboxAddressConstants.EDIT_SKU_INVENTORY, SqlQueries.EDIT_SKU_INVENTORY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.EDIT_SKU_INVENTORY);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_SKU_INVENTORY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.DELETE_SKU_INVENTORY)),
								QboxAddressConstants.DELETE_SKU_INVENTORY, SqlQueries.DELETE_SKU_INVENTORY);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_SKU_INVENTORY);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SEARCH_SKU_TRACE_WF)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.SEARCH_SKU_TRACE_WF)),
								QboxAddressConstants.SEARCH_SKU_TRACE_WF, SqlQueries.SEARCH_SKU_TRACE_WF);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.SEARCH_SKU_TRACE_WF);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.CREATE_SKU_TRACE_WF)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.CREATE_SKU_TRACE_WF)),
								QboxAddressConstants.CREATE_SKU_TRACE_WF, SqlQueries.CREATE_SKU_TRACE_WF);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.CREATE_SKU_TRACE_WF);
					}
				});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.EDIT_SKU_TRACE_WF).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.EDIT_SKU_TRACE_WF)),
						QboxAddressConstants.EDIT_SKU_TRACE_WF, SqlQueries.EDIT_SKU_TRACE_WF);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.EDIT_SKU_TRACE_WF);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_SKU_TRACE_WF)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(QboxAddressConstants.DELETE_SKU_TRACE_WF)),
								QboxAddressConstants.DELETE_SKU_TRACE_WF, SqlQueries.DELETE_SKU_TRACE_WF);
					} catch (Exception e) {
						processException(e, routingContext, QboxAddressConstants.DELETE_SKU_TRACE_WF);
					}
				});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.SAVE_ENTITY_INFRASTRUCTURE)
		.handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.SAVE_ENTITY_INFRASTRUCTURE)),
						QboxAddressConstants.SAVE_ENTITY_INFRASTRUCTURE, SqlQueries.SAVE_ENTITY_INFRASTRUCTURE);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.SAVE_ENTITY_INFRASTRUCTURE);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.GET_ENTITY_INFRA_PROPERTIES)
		.handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.GET_ENTITY_INFRA_PROPERTIES)),
						QboxAddressConstants.GET_ENTITY_INFRA_PROPERTIES, SqlQueries.GET_ENTITY_INFRA_PROPERTIES);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.GET_ENTITY_INFRA_PROPERTIES);
			}
		});
		router.put(QboxAddressConstants.API_PREFIX + QboxAddressConstants.UPDATE_ENTITY_INFRASTRUCTURE)
		.handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.UPDATE_ENTITY_INFRASTRUCTURE)),
						QboxAddressConstants.UPDATE_ENTITY_INFRASTRUCTURE, SqlQueries.UPDATE_ENTITY_INFRASTRUCTURE);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.UPDATE_ENTITY_INFRASTRUCTURE);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.GET_PURCHASE_ORDERS_DASHBOARD)
		.handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.GET_PURCHASE_ORDERS_DASHBOARD)),
						QboxAddressConstants.GET_PURCHASE_ORDERS_DASHBOARD, SqlQueries.GET_PURCHASE_ORDERS_DASHBOARD);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.GET_PURCHASE_ORDERS_DASHBOARD);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS_V2)
		.handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder
										.getPreProcessList(QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS_V2)),
						QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS_V2, SqlQueries.GET_HOTBOX_CURRENT_STATUS_V2);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS_V2);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.DELETE_ENTITY_INFRA_BY_ID).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.DELETE_ENTITY_INFRA_BY_ID)),
						QboxAddressConstants.DELETE_ENTITY_INFRA_BY_ID, SqlQueries.DELETE_ENTITY_INFRA_BY_ID);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.DELETE_ENTITY_INFRA_BY_ID);
			}
		});
		router.post(QboxAddressConstants.API_PREFIX + QboxAddressConstants.PROCESS_ORDER_DELIVERY).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(QboxAddressConstants.PROCESS_ORDER_DELIVERY)),
						QboxAddressConstants.PROCESS_ORDER_DELIVERY, SqlQueries.PROCESS_ORDER_DELIVERY);
			} catch (Exception e) {
				processException(e, routingContext, QboxAddressConstants.PROCESS_ORDER_DELIVERY);
			}
		});
		
		

		this.httpServer = vertx.createHttpServer();
		int portNo = 8912;// Integer.parseInt(config().getString(ConfigConstants.MICRO_SERVICE_PORT));
		if (this.httpServer != null && portNo > 0) {
			this.httpServer.requestHandler(router).requestStream().toFlowable().subscribe();
			this.httpServer.rxListen(portNo);
			this.httpServer.requestHandler(router).rxListen(portNo).subscribe();
			log.info("ServerVerticle Started");
		}
	}
	
	public void mediaUpload(JsonObject jsonObject, Handler<AsyncResult<JsonObject>> mediaHandler) {
		if (jsonObject != null) {
			processWebClientPostRequest(jsonObject, 8915, "localhost", "/api/v1/media/insert_media", false, result -> {
				if (result.succeeded()) {
					mediaHandler.handle(Future.succeededFuture(result.result()));
				} else {
					mediaHandler.handle(Future.failedFuture(result.cause()));
				}
			});
		} else {
			mediaHandler.handle(Future.succeededFuture(new JsonObject().put("mediaSno", null)));
		}
	}

	public void multiMediaUpload(JsonObject jsonObject, Handler<AsyncResult<JsonObject>> mediaHandler) {
		if (jsonObject != null) {
			processWebClientPostRequest(jsonObject, 8915, "localhost", "/api/v1/media/insert_media", false, result -> {
				if (result.succeeded()) {
					mediaHandler.handle(Future.succeededFuture(result.result()));
				} else {
					mediaHandler.handle(Future.failedFuture(result.cause()));
				}
			});
		} else {
			mediaHandler.handle(Future.succeededFuture(new JsonObject().put("mediaSno", null)));
		}
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

	public void enableCorsSupport(Router router) {
		Set<String> allowHeaders = new HashSet<>();
		allowHeaders.add(HttpConstants.HTTP_HEADER_X_REQUESTED_WITH);
		allowHeaders.add(HttpConstants.HTTP_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN);
		allowHeaders.add(HttpConstants.HTTP_HEADER_ORIGIN);
		allowHeaders.add(HttpConstants.HTTP_HEADER_CONTENT_TYPE);
		allowHeaders.add(HttpConstants.HTTP_HEADER_ACCEPT);
		allowHeaders.add("Authorization");
		Set<HttpMethod> allowMethods = new HashSet<>();
		allowMethods.add(HttpMethod.GET);
		allowMethods.add(HttpMethod.PUT);
		allowMethods.add(HttpMethod.OPTIONS);
		allowMethods.add(HttpMethod.POST);
		allowMethods.add(HttpMethod.DELETE);
		allowMethods.add(HttpMethod.PATCH);

		router.route().handler(CorsHandler.create(HttpConstants.ACCESS_CONTROL_ALLOW_ORIGIN_ALL)
				.allowedHeaders(allowHeaders).allowedMethods(allowMethods));
	}
}
