package com.swomb.qbox.fileupload;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.ByteBuffer;
import java.security.InvalidKeyException;
import java.util.HashMap;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import org.apache.tika.detect.DefaultDetector;
import org.apache.tika.io.TikaInputStream;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.mime.MediaType;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
import com.azure.storage.blob.BlobAsyncClient;
import com.azure.storage.blob.BlobContainerAsyncClient;
import com.azure.storage.blob.BlobServiceAsyncClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.models.ParallelTransferOptions;
import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.StorageException;
import com.microsoft.azure.storage.blob.BlobContainerPermissions;
import com.microsoft.azure.storage.blob.BlobContainerPublicAccessType;
import com.microsoft.azure.storage.blob.CloudBlobClient;
import com.microsoft.azure.storage.blob.CloudBlobContainer;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.WebClientOptions;
import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.core.buffer.Buffer;
import io.vertx.reactivex.core.http.HttpServer;
import io.vertx.reactivex.core.http.ServerWebSocket;
import reactor.core.publisher.Flux;

import io.vertx.reactivex.ext.web.client.WebClient;
import io.vertx.reactivex.ext.web.client.HttpResponse;
import io.vertx.reactivex.ext.web.codec.BodyCodec;


public class ServerVerticle extends AbstractVerticle {

	private String storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=qeuboxblob;AccountKey=oBhYsoZKLINLnZKFp0AG1xbuQBCQa1DGXIg9NR7biKDtPv6WHJu1REwMpwUojqc9+d6cIMY0nB+5+AStpp8dlg==;EndpointSuffix=core.windows.net";
	private String containerName = "quebox";

//	private final String storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=swomblms;AccountKey=mS/6N9Hy9Z53e6f49WgiAqFkzpDQ0U5kaNTu99DXxffRlEzpZntrGLv5Uryf+mq7JmJkssS8bfTc+ASt5eT4sw==;EndpointSuffix=core.windows.net";

	Buffer frameData = Buffer.buffer(); // string

	JsonArray mediaList = new JsonArray();
//	    internals01
	String currentFileId = null;

	Logger log = LoggerFactory.getLogger(MainVerticle.class.getName());

	@Override
	public void start() throws Exception {
		// TODO Auto-generated method stub
		super.start();

		log.info("ServerVerticle Started");

		HttpServerOptions serverOptions = new HttpServerOptions().setMaxWebSocketFrameSize(10 * 1024 * 1024);
		HttpServer server = vertx.createHttpServer(serverOptions);

		createContainer();
		server.webSocketHandler(webSocket -> {
		    String path = webSocket.path();
		    try {
		        if ("/api/v1/file_upload".equals(path)) {
		            handleWebSocket(webSocket);
		        } else if ("/api/v1/get_purchase_orders_dashboard".equals(path)) {
		            handleLiveDashboard(webSocket);
		        } else {
		            webSocket.reject(); // Reject invalid WebSocket connections
		        }
		    } catch (Exception e) {
		        e.printStackTrace();
		    }
		});


		Integer port = 8916;
//				Integer.parseInt(Crypto.decryptData(config().getString(ConfigConstants.MICRO_SERVICE_PORT)));
		System.out.println("port " + port);
		System.out.println(port);
		server.listen(port, result -> {
			if (result.succeeded()) {
				log.info("Server started on port" + port);
			} else {
				System.err.println("Server failed to start");
			}
		});
	}

	private void createContainer() {
//		System.out.println("createContainer");
		vertx.executeBlocking(future -> {
			getBlobContainerPermissions(blobContainerPermissions -> {
				if (blobContainerPermissions.succeeded()) {
					BlobContainerPermissions containerPermisson = blobContainerPermissions.result();
					try {
						getBlobClientReference(storageConnectionString, resClient -> {
							if (resClient.succeeded()) {
								try {
									createContainer(resClient.result(), containerName, resContainer -> {
										if (resContainer.succeeded()) {
											CloudBlobContainer blobContainer = resContainer.result();
											try {
												blobContainer.uploadPermissions(containerPermisson);
											} catch (StorageException e1) {
												// TODO Auto-generated catch block
												e1.printStackTrace();
											}

										}
									});
								} catch (InvalidKeyException | StorageException | RuntimeException | IOException
										| URISyntaxException e) {
									// TODO Auto-generated catch block
									e.printStackTrace();
								}
							}
						});
					} catch (InvalidKeyException | RuntimeException | IOException | URISyntaxException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			});
		}, (Handler<AsyncResult<Void>>) event ->
		{
			event.cause();
		});
	}

	private void handleWebSocket(ServerWebSocket webSocket) throws Exception {
		System.out.println("HAI"+webSocket.path());
		if (webSocket.path().equals("/api/v1/file_upload")) {
			mediaList = new JsonArray();
			HashMap<Integer, Buffer> bufferData = new HashMap<>();
			AtomicInteger fileCount = new AtomicInteger(0);
			AtomicInteger fileId = new AtomicInteger(0);
			log.info("file-upload");
			webSocket.frameHandler(frame -> {
				if (frame.isText()) {
					fileCount.getAndAdd(Integer.parseInt(frame.textData()));
				} else if (frame.isBinary()) {
					bufferData.put(fileId.addAndGet(1), frame.binaryData());
				} else if (!frame.isClose()) {
					frameData = bufferData.get(fileId.get());
					bufferData.put(fileId.get(), frameData.appendBuffer(frame.binaryData()));
				}
				if (!frame.isClose() && frame.isFinal() && fileCount.get() == bufferData.size()) {
					vertx.executeBlocking(blockingCode -> {
						try {
							BlobServiceAsyncClient blobServiceAsyncClient = new BlobServiceClientBuilder()
									.connectionString(storageConnectionString).buildAsyncClient();
							BlobContainerAsyncClient containerAsyncClient = blobServiceAsyncClient
									.getBlobContainerAsyncClient(containerName);

							log.info("uploading please wait");
							// Parse message
							for (int i = 0; i < bufferData.size(); i++) {

								String fileFormat = identifyFileFormat(bufferData.get(i + 1));
								String fileName = "file_" + UUID.randomUUID() + "." + fileFormat;
								// Convert Base64 file data to byte array
								byte[] fileBytes = bufferData.get(i + 1).getBytes();
								ByteBuffer byteBuffer = ByteBuffer.wrap(fileBytes);

								// Configure parallelTransferOptions
								ParallelTransferOptions parallelTransferOptions = new ParallelTransferOptions()
										.setBlockSizeLong((long) 4 * 1024 * 1024).setMaxConcurrency(5);

								BlobAsyncClient blobAsyncClient = containerAsyncClient.getBlobAsyncClient(fileName);
								blobAsyncClient.upload(Flux.just(byteBuffer), parallelTransferOptions).block();
								BlobHttpHeaders headers = new BlobHttpHeaders().setContentType(fileFormat);
								blobAsyncClient.setHttpHeaders(headers).block();
								String mimeType = bufferData.get(i) != null ? detectFileFormat(bufferData.get(i))
										: "image/png";
								vertx.executeBlocking(promise -> {
									try {
										log.info(mimeType);
										if (mimeType.startsWith("video/")) {
											log.info("It's a video.");
											promise.complete();
										} else {
											promise.complete();
										}
									} catch (Exception e) {
										webSocket.writeTextMessage("Error uploading files");
									}
								}, result -> {
									log.info("result");
									mediaList.add(new JsonObject().put("mediaUrl", blobAsyncClient.getBlobUrl())
											.put("contentType", fileFormat).put("mediaType", fileFormat)
											.put("thumbnailUrl", null).put("mediaSize", fileBytes.length)
											.put("isUploaded", true).put("azureId", fileName)
											.put("documentType", fileFormat));
									if (mediaList.size() == bufferData.size()) {
										blockingCode.complete();
									}
								});
							}

						} catch (Exception e) {
							webSocket.writeTextMessage("Error uploading files");
							e.printStackTrace();
						}

					}, result -> {
						log.info(result.succeeded());
						if (result.succeeded()) {
							log.info(mediaList.toString());
							bufferData.clear();
							fileCount.set(0);
							fileId.set(0);
							webSocket.writeTextMessage(mediaList.toString());
						} else {
							webSocket.writeTextMessage("File upload failed");
						}
					});
				}

			});
			webSocket.closeHandler(v -> {
				log.info("closeHandler");
				webSocket.writeTextMessage("File upload failed");
			});
		}
	}
	
	private void handleLiveDashboard(ServerWebSocket webSocket) {
	    log.info("Client connected to Live Dashboard WebSocket: " + webSocket.remoteAddress());

	    WebClient webClient = WebClient.create(vertx, new WebClientOptions().setKeepAlive(true));

	    long timerId = vertx.setPeriodic(5000, id -> {
	        JsonObject requestJson = new JsonObject().put("filter", "latest");

	        String apiHost = "192.168.1.23";
	        int apiPort = 8912;
	        String apiPath = "/api/v1/masters/get_purchase_orders_dashboard"; // Double-check this path

	        log.info("Sending request to: http://" + apiHost + ":" + apiPort + apiPath);

	        webClient.post(apiPort, apiHost, apiPath)
	                .sendJsonObject(requestJson, asyncResult -> {
	                	
	                    if (asyncResult.succeeded()) {
	                        HttpResponse<Buffer> response = asyncResult.result();
	                        System.out.println("response" + response.statusCode());
	                        // Check if the API returned 404
	                        if (response.statusCode() == 404) {
	                            log.error("❌ API returned 404 - Endpoint not found! Check URL: " + apiPath);
	                            return;
	                        }

	                        // Check Content-Type before parsing
	                        String contentType = response.getHeader("Content-Type");
	                        if (contentType == null || !contentType.contains("application/json")) {
	                            log.error("❌ Unexpected response type: " + contentType);
	                            log.error("Response body: " + response.bodyAsString());
	                            return;
	                        }

	                        try {
	                            JsonObject liveData = response.bodyAsJsonObject();
	                            System.out.println("liveData" + liveData);
	                            liveData.put("timestamp", System.currentTimeMillis());

	                            if (!webSocket.isClosed()) {
	                                webSocket.writeTextMessage(liveData.encode());
	                            } else {
	                                log.warn("WebSocket is closed, cannot send data");
	                            }
	                        } catch (Exception e) {
	                            log.error("❌ Failed to parse JSON response", e);
	                            log.error("Raw response: " + response.bodyAsString());
	                        }
	                    } else {
	                        log.error("❌ Failed to fetch dashboard data", asyncResult.cause());
	                    }
	                });
	    });

	    webSocket.closeHandler(v -> {
	        log.info("Client disconnected from Live Dashboard");
	        vertx.cancelTimer(timerId); // Stop periodic updates
	        webClient.close(); // Close WebClient
	    });
	}




	public static String detectFileFormat(Buffer buffer) throws Exception {
		try {
			InputStream inputStream = new ByteArrayInputStream(buffer.getBytes());
			Parser parser = new AutoDetectParser();
			BodyContentHandler handler = new BodyContentHandler();
			Metadata metadata = new Metadata();
			ParseContext context = new ParseContext();

			parser.parse(inputStream, handler, metadata, context);

			return metadata.get(Metadata.CONTENT_TYPE);
		} catch (Exception e) {
			e.printStackTrace();
			return null; // Unable to detect the format
		}
	}

	public static String identifyFileFormat(Buffer buffer) throws Exception {
		if (isPNGFormat(buffer)) {
			return "PNG";
		} else if (isJPEGFormat(buffer)) {
			return "JPEG";
		} else if (isGIFFormat(buffer)) {
			return "GIF";
		} else if (isPDFFormat(buffer)) {
			return "application/pdf";
		} else {
			return detectVideoFormat(buffer);
		}

	}

	private static boolean isPNGFormat(Buffer buffer) {
		// PNG format signature: 89 50 4E 47 0D 0A 1A 0A
		byte[] pngSignature = { (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };
		return checkMagicNumber(buffer, pngSignature);
	}

	private static boolean isJPEGFormat(Buffer buffer) {
		// JPEG format signature: FF D8 FF
		byte[] jpegSignature = { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF };
		return checkMagicNumber(buffer, jpegSignature);
	}

	private static boolean isGIFFormat(Buffer buffer) {
		// GIF format signature: 47 49 46 38 (37 or 39) 61
		byte[] gifSignature87a = { 0x47, 0x49, 0x46, 0x38, 0x37, 0x61 };
		byte[] gifSignature89a = { 0x47, 0x49, 0x46, 0x38, 0x39, 0x61 };
		return checkMagicNumber(buffer, gifSignature87a) || checkMagicNumber(buffer, gifSignature89a);
	}

	public static boolean isPDFFormat(Buffer buffer) {
		byte[] pdfHeader = "%PDF-".getBytes();
		byte[] bufferBytes = buffer.getBytes();
		if (bufferBytes.length < pdfHeader.length) {
			return false;
		}
		for (int i = 0; i < pdfHeader.length; i++) {
			if (pdfHeader[i] != bufferBytes[i]) {
				return false;
			}
		}
		return true;
	}

	private static String detectVideoFormat(Buffer buffer) {
		try (TikaInputStream stream = TikaInputStream.get(buffer.getBytes())) {
			DefaultDetector detector = new DefaultDetector();
			Metadata metadata = new Metadata();
			MediaType mediaType = detector.detect(stream, metadata);

			// You can print mediaType.toString() to see the detected MIME type
			return mediaType.getSubtype();
		} catch (Exception e) {
			return "Unknown";
		}
	}

	private static boolean checkMagicNumber(Buffer buffer, byte[] magicNumber) {
		if (buffer.length() < magicNumber.length) {
			return false;
		}

		for (int i = 0; i < magicNumber.length; i++) {
			if (buffer.getByte(i) != magicNumber[i]) {
				return false;
			}
		}

		return true;
	}

	public static void getBlobContainerPermissions(Handler<AsyncResult<BlobContainerPermissions>> handler) {
		BlobContainerPermissions blobContainerPermissions = new BlobContainerPermissions();
		blobContainerPermissions.setPublicAccess(BlobContainerPublicAccessType.CONTAINER);
		handler.handle(Future.succeededFuture(blobContainerPermissions));
	}

	public static void getBlobClientReference(String storageReference, Handler<AsyncResult<CloudBlobClient>> handler)
			throws RuntimeException, IOException, IllegalArgumentException, URISyntaxException, InvalidKeyException {

		CloudStorageAccount storageAccount;
		try {
			storageAccount = CloudStorageAccount.parse(storageReference);
			handler.handle(Future.succeededFuture(storageAccount.createCloudBlobClient()));
		} catch (IllegalArgumentException | URISyntaxException e) {
			throw e;
		} catch (InvalidKeyException e) {
			throw e;
		}

	}

	private static void createContainer(CloudBlobClient blobClient, String containerName,
			Handler<AsyncResult<CloudBlobContainer>> handler) throws StorageException, RuntimeException, IOException,
			InvalidKeyException, IllegalArgumentException, URISyntaxException, IllegalStateException {

		// Create a new container
		CloudBlobContainer container = blobClient.getContainerReference(containerName);
		try {
			if (container.createIfNotExists() == false) {
				
			}
		} catch (StorageException s) {
			if (s.getCause() instanceof java.net.ConnectException) {
//				(
//						"Caught connection exception from the client. If running with the default configuration please make sure you have started the storage emulator.");
			}
			throw s;
		}

		handler.handle(Future.succeededFuture(container));
	}

}
