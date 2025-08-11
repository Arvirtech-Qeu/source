package com.swomb.qbox.media;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

import com.swomb.qbox.common.util.ConfigConstants;
import com.swomb.qbox.crypto.Crypto;
import com.swomb.qbox.media.process.MediaPreProcessBuilder;
import com.swomb.qbox.media.process.MediaPreProcessor;
import com.swomb.qbox.media.util.MediaAddressConstants;
import com.swomb.qbox.media.util.MediaSqlQueries;
import com.swomb.qbox.process.utils.RequestProcessRule;

import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.json.schema.SchemaRouterOptions;
import io.vertx.reactivex.core.MultiMap;
import io.vertx.reactivex.core.buffer.Buffer;
import io.vertx.reactivex.core.http.HttpServer;
import io.vertx.reactivex.core.http.HttpServerRequest;
import io.vertx.reactivex.core.http.HttpServerResponse;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.RoutingContext;
import io.vertx.reactivex.ext.web.handler.BodyHandler;
import io.vertx.reactivex.ext.web.handler.StaticHandler;
import io.vertx.reactivex.json.schema.Schema;
import io.vertx.reactivex.json.schema.SchemaParser;
import io.vertx.reactivex.json.schema.SchemaRouter;

public class ServerVerticle extends com.swomb.qbox.common.AppRestAPIBaseVerticle {

	Logger log = LoggerFactory.getLogger(MainVerticle.class.getName());

	private HttpServer httpServer;

	SchemaParser schemaParser;
	Schema schema;

//	public static String DB_SCHEMA = Constants.DEFAULT_SCHEMA;
	
	public static String DB_SCHEMA = "media";
	public static String ffmpegPath = "/usr/bin/ffmpeg";
	public static String urlPoint = "https://swomblms.blob.core.windows.net/lms/";
	
	@Override
	public void start() throws Exception {
		// TODO Auto-generated method stub
		super.start();

//		DB_SCHEMA = Crypto.decryptData(config().getString(ConfigConstants.DB_SCHEMA_KEY));
		CONTENT_TYPE = config().getString(ConfigConstants.REQUEST_CONTENT_TYPE);
		ACCESS_CONTROL_ALLOW_ORIGIN = config().getString(ConfigConstants.REQUEST_ACCESS_CONTROL_ALLOW_ORIGIN);

		log.info("ServerVerticle Started");

		SchemaRouter schemaRouter = SchemaRouter.create(vertx, new SchemaRouterOptions());
		schemaParser = SchemaParser.createDraft201909SchemaParser(schemaRouter);

		final Router router = Router.router(vertx);
		enableCorsSupport(router);

		router.route("/assets/*").handler(StaticHandler.create("assets"));
		router.route("/api/*").handler(BodyHandler.create());
		
		router.route(MediaAddressConstants.MEDIA_API_PREFIX + MediaAddressConstants.VIDEO).handler(this::serveVideo);

		
		router.get(MediaAddressConstants.MEDIA_API_PREFIX + MediaAddressConstants.SERVICE_HEALTH).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						MediaPreProcessor.doProcess(data,
								MediaPreProcessBuilder.getPreProcessList(MediaAddressConstants.SERVICE_HEALTH)),
						MediaAddressConstants.SERVICE_HEALTH, MediaSqlQueries.SERVICE_HEALTH);
			} catch (Exception e) {
				processException(e, routingContext, MediaAddressConstants.SERVICE_HEALTH);
			}
		});

		router.post(MediaAddressConstants.MEDIA_API_PREFIX  + MediaAddressConstants.INSERT_MEDIA).handler(routingContext -> {
			JsonObject data = routingContext.getBodyAsJson();
			log.info("media............................");
			try {
				processDbEbRequest(routingContext,
						MediaPreProcessor.doProcess(data,
								MediaPreProcessBuilder.getPreProcessList(MediaAddressConstants.INSERT_MEDIA)),
						MediaAddressConstants.INSERT_MEDIA, MediaSqlQueries.INSERT_MEDIA);
			} catch (Exception e) {
				e.printStackTrace();
				processException(e, routingContext, MediaAddressConstants.INSERT_MEDIA);
			}
		});
		
		router.post(MediaAddressConstants.MEDIA_API_PREFIX  + MediaAddressConstants.INSERT_MULTI_MEDIA).handler(routingContext -> {
			log.info("media............................");
			try {
				JsonObject data = routingContext.getBodyAsJson();
				processDbEbRequest(routingContext,
						MediaPreProcessor.doProcess(data,
								MediaPreProcessBuilder.getPreProcessList(MediaAddressConstants.INSERT_MULTI_MEDIA)),
						MediaAddressConstants.INSERT_MULTI_MEDIA, MediaSqlQueries.INSERT_MULTI_MEDIA);
			} catch (Exception e) {
				e.printStackTrace();
				processException(e, routingContext, MediaAddressConstants.INSERT_MULTI_MEDIA);
			}
		});
		
		router.get(MediaAddressConstants.MEDIA_API_PREFIX + MediaAddressConstants.GET_VIDEO_DURATION).handler(routingContext -> {
			try {
				vertx.executeBlocking(blockingCode -> {
					JsonObject data = new JsonObject();
					String inputUrl = urlPoint + routingContext.request().getParam("fileName");
					data.put("duration", getVideoDuration(inputUrl, ffmpegPath));
					routingContext.response().setStatusMessage("Success").end(Json.encodePrettily(data));
				});
			} catch (Exception e) {
				processException(e, routingContext, MediaAddressConstants.GET_VIDEO_DURATION);
			}
		});
		
		router.put(MediaAddressConstants.MEDIA_API_PREFIX + MediaAddressConstants.UPDATE_VIDEO_PROGRESS).handler(routingContext -> {
			try {
				JsonObject data = routingContext.getBodyAsJson();

				ArrayList<RequestProcessRule> preProcessList = MediaPreProcessBuilder
						.getPreProcessList(MediaAddressConstants.UPDATE_VIDEO_PROGRESS);
				JsonObject processedData = MediaPreProcessor.doProcess(data, preProcessList);
				processDbEbRequest(routingContext, processedData, MediaAddressConstants.UPDATE_VIDEO_PROGRESS,
						MediaSqlQueries.UPDATE_VIDEO_PROGRESS);

			} catch (Exception e) {
				processException(e, routingContext, MediaAddressConstants.UPDATE_VIDEO_PROGRESS);
			}
		});
		
		router.put(MediaAddressConstants.MEDIA_API_PREFIX + MediaAddressConstants.UPDATE_WATCHED_VIDEO).handler(routingContext -> {
			try {
				JsonObject data = routingContext.getBodyAsJson();

				ArrayList<RequestProcessRule> preProcessList = MediaPreProcessBuilder
						.getPreProcessList(MediaAddressConstants.UPDATE_WATCHED_VIDEO);
				JsonObject processedData = MediaPreProcessor.doProcess(data, preProcessList);
				processDbEbRequest(routingContext, processedData, MediaAddressConstants.UPDATE_WATCHED_VIDEO,
						MediaSqlQueries.UPDATE_WATCHED_VIDEO);

			} catch (Exception e) {
				processException(e, routingContext, MediaAddressConstants.UPDATE_WATCHED_VIDEO);
			}
		});
		

		this.httpServer = vertx.createHttpServer();
		int portNo = 8915;
//		Integer.parseInt(Crypto.decryptData(config().getString(ConfigConstants.MICRO_SERVICE_PORT)));	
		if (this.httpServer != null && portNo > 0) {
			this.httpServer.requestHandler(router).requestStream().toFlowable().subscribe();
			this.httpServer.rxListen(portNo);
			this.httpServer.requestHandler(router).rxListen(portNo).subscribe();
			log.info("ServerVerticle Started");
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
	
	private void serveVideo(RoutingContext routingContext) {
		vertx.executeBlocking(blockingCode -> {
			HttpServerRequest request = routingContext.request();
			HttpServerResponse response = routingContext.response();
			try {
				MultiMap params = request.params();

				if (!params.contains("startTime") || !params.contains("endTime") || !params.contains("fileName")) {
					response.setStatusCode(400).end("Required parameters are missing");
					return;
				}

				String inputUrl = urlPoint + request.getParam("fileName");
				log.info(inputUrl + "LOGGING");

				int startTime = Integer.parseInt(request.getParam("startTime"));
				int endTime = Integer.parseInt(request.getParam("endTime"));

				log.info(startTime);
				log.info(endTime);

				String outputFormat = "mp4";

				response.putHeader("Content-Type", "video/mp4");
				response.setChunked(true);

				ProcessBuilder processBuilder = new ProcessBuilder(ffmpegPath, "-i", inputUrl, "-ss",
						String.valueOf(startTime), "-t", String.valueOf(endTime - startTime), "-c:v", "copy", "-c:a",
						"copy", "-movflags", "frag_keyframe+empty_moov", "-f", outputFormat, "pipe:");

				try {
					Process process = processBuilder.start();
					try (InputStream ffmpegOutput = process.getInputStream();
							ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

						byte[] buffer = new byte[1024];
						int bytesRead;
						while ((bytesRead = ffmpegOutput.read(buffer)) != -1) {
							outputStream.write(buffer, 0, bytesRead);
						}
						byte[] videoData = outputStream.toByteArray();
						response.putHeader("Content-Length", String.valueOf(videoData.length));
						response.write(Buffer.buffer(videoData));
						response.end();
					}
				} catch (IOException e) {
					e.printStackTrace();
					response.setStatusCode(500).end("Error serving video");
				}

			} catch (NumberFormatException e) {
				e.printStackTrace();
				response.setStatusCode(400).end("Invalid parameter format");
			} catch (Exception e) {
				e.printStackTrace();
				response.setStatusCode(500).end("Error serving video");
			}
		});
	}
	
	private long getVideoDuration(String inputUrl, String ffmpegPath) {
		ProcessBuilder processBuilder = new ProcessBuilder(ffmpegPath, "-i", inputUrl, "-vcodec", "-c", "copy",
				"-acodec", "copy", "-f", "null", "-");
		log.info("getVideoDuration");
		try {
			Process process = processBuilder.start();
			String durationOutput = readProcessOutput(process);
			String[] lines = durationOutput.split("\n");
			for (String line : lines) {
				if (line.trim().startsWith("Duration:")) {
					String[] durationParts = line.trim().split(",")[0].split(":");
					int hours = Integer.parseInt(durationParts[1].trim());
					int minutes = Integer.parseInt(durationParts[2].trim());
					float seconds = Float.parseFloat(durationParts[3].trim());
					return hours * 3600 + minutes * 60 + (long) seconds;
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return 0;
	}

	private String readProcessOutput(Process process) throws IOException {
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
			StringBuilder output = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line).append("\n");
			}
			return output.toString();
		}
	}
}
