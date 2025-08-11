package com.swomb.qbox.common;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.swomb.qbox.common.model.VendorSetting;
import com.swomb.qbox.common.util.Constants;
import com.swomb.qbox.common.util.HttpConstants;
import com.swomb.qbox.common.util.ResponseConstants;
import com.swomb.qbox.crypto.Crypto;

 
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.core.http.HttpHeaders;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.RoutingContext;
import io.vertx.reactivex.ext.web.client.WebClient;
import io.vertx.reactivex.ext.web.handler.CorsHandler;

public class AppRestAPIBaseVerticle extends AbstractVerticle {

	protected String CONTENT_TYPE = HttpConstants.CONTENT_TYPE_APPLICATION_JSON;
	protected String ACCESS_CONTROL_ALLOW_ORIGIN = HttpConstants.ACCESS_CONTROL_ALLOW_ORIGIN_ALL;
	protected String FILE_UPLOAD_LOCATION = "/tmp";
	Logger log = LoggerFactory.getLogger(AppRestAPIBaseVerticle.class.getName());
	
	private static final String EMAIL_FROM = "dev.swomb@gmail.com";
	private static final String PASSWORD = "grcpmbblzoqkalvj";

	protected WebClient client;
	
	   @Override
	    public void start() throws Exception {
	        // Initialize WebClient
	        client = WebClient.create(vertx);

	        // Proceed with your additional logic
	        super.start();
	    }

	/**
	 * Enable CORS support.
	 *
	 * @param router router instance
	 */
	protected void enableCorsSupport(Router router) {
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

	protected JsonObject errorJSON(String msg) {

		JsonObject errorObj = new JsonObject();

		errorObj.put(ResponseConstants.JSON_KEY_ERROR_MSG, ResponseConstants.INTERNAL_SERVER_ERROR_MSG);
		errorObj.put(ResponseConstants.JSON_KEY_ERROR, msg);
		errorObj.put(ResponseConstants.JSON_KEY_RESPONSE_STATUS, 500);
		errorObj.put(ResponseConstants.JSON_KEY_IS_SUCCESS, false);

		return errorObj;
	}

	protected JsonObject successGetHandler(JsonArray jsonArray) {

		JsonObject successObj = new JsonObject();

		successObj.put(ResponseConstants.JSON_KEY_RESPONSE_DATA, jsonArray);
		successObj.put(ResponseConstants.JSON_KEY_IS_SUCCESS, true);
		successObj.put(ResponseConstants.JSON_KEY_RESPONSE_STATUS, 200);

		return successObj;
	}

	protected JsonObject succesPostHandler(Object jsonObject) {

		JsonObject successObj = new JsonObject();

		successObj.put(ResponseConstants.JSON_KEY_RESPONSE_DATA, jsonObject);
		successObj.put(ResponseConstants.JSON_KEY_IS_SUCCESS, true);
		successObj.put(ResponseConstants.JSON_KEY_RESPONSE_STATUS, 201);

		return successObj;
	}

	protected JsonObject succesPutHandler(JsonObject jsonObject) {

		JsonObject successObj = new JsonObject();

		successObj.put(ResponseConstants.JSON_KEY_RESPONSE_DATA, jsonObject);
		successObj.put(ResponseConstants.JSON_KEY_IS_SUCCESS, true);
		successObj.put(ResponseConstants.JSON_KEY_RESPONSE_STATUS, 204);

		return successObj;
	}

	protected JsonObject succesDeleteHandler(JsonObject jsonObject) {

		JsonObject successObj = new JsonObject();

		successObj.put(ResponseConstants.JSON_KEY_RESPONSE_DATA, jsonObject);
		successObj.put(ResponseConstants.JSON_KEY_IS_SUCCESS, true);
		successObj.put(ResponseConstants.JSON_KEY_RESPONSE_STATUS, 204);

		return successObj;
	}

	protected void exceptionMailing(long referenceNumber, String requestBody) {

	}

	protected void processSuccessResponse(RoutingContext routingContext, JsonObject object, String methodName) {
		log.info(methodName + " success");
		routingContext.response().putHeader(HttpHeaders.CONTENT_TYPE, CONTENT_TYPE)
				.putHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_ALLOW_ORIGIN)
				.setStatusMessage("Success").end(Json.encodePrettily(object));
	}

	protected void processErrorResponse(RoutingContext routingContext, String errorMessage, String methodName) {
		log.info(methodName + " failure");
		log.error(methodName + " failure");
		routingContext.response().putHeader(HttpHeaders.CONTENT_TYPE, CONTENT_TYPE)
				.putHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_ALLOW_ORIGIN)
				.setStatusMessage("Failure").end(Json.encodePrettily(errorJSON(errorMessage)));
	}

	protected void processException(Exception e, RoutingContext routingContext, String methodName) {
		long referenceNumber = new Random().nextLong();
		log.error("Exception Occurred in " + methodName + " method : " + referenceNumber);
		exceptionMailing(referenceNumber, routingContext.getBodyAsString());
		e.printStackTrace();
		processErrorResponse(routingContext, ResponseConstants.INTERNAL_SERVER_ERROR_MSG, methodName);
	}

	protected void processDbEbRequest(RoutingContext routingContext, JsonObject data, String methodAddress,
			String sqlQuery) {
		log.info(methodAddress + " started");
		if (data != null) {
			vertx.eventBus()
					.rxRequest(methodAddress, new JsonObject().put(Constants.QUERY, sqlQuery).put(Constants.DATA, data)).timeout(10000,  TimeUnit.MILLISECONDS)
					.subscribe(response -> {
						JsonObject responseBody = (JsonObject) response.body();
						processSuccessResponse(routingContext, responseBody, methodAddress);
					}, err -> {
						processErrorResponse(routingContext, err.getMessage(), methodAddress);
					});
		} else {
			processErrorResponse(routingContext, ResponseConstants.INPUT_ERROR_MSG, methodAddress);
		}
	}


	protected void processEbRequest(RoutingContext routingContext, JsonObject data, String methodAddress) {
		log.info(methodAddress + " started");
		if (data != null) {
			vertx.eventBus()
					.rxRequest(methodAddress, new JsonObject().put(Constants.DATA, data)).timeout(10000,  TimeUnit.MILLISECONDS)
					.subscribe(response -> {
						JsonObject responseBody = (JsonObject) response.body();
						processSuccessResponse(routingContext, responseBody, methodAddress);
					}, err -> {
						processErrorResponse(routingContext, err.getMessage(), methodAddress);
					});
		} else {
			processErrorResponse(routingContext, ResponseConstants.INPUT_ERROR_MSG, methodAddress);
		}
	}
	
	

	protected void processWebClientPostRequest(JsonObject data, int port, String host, String path, boolean ssl,
			Handler<AsyncResult<JsonObject>> wcHandler) {

		log.info("processWebClientPostRequest started");


		log.info("port : " + port);
		log.info("host : " + host);
		log.info("path : " + path);
		log.info("ssl : " + ssl);
		log.info("payload :" + data.encodePrettily());


		client.post(port, host, path).ssl(ssl).timeout(10000).putHeader("Content-Type", "application/json").timeout(10000).sendJsonObject(data,
				webClientHandler -> {
					if (webClientHandler.succeeded()) {
						if (webClientHandler.result() != null) {
							wcHandler.handle(Future.succeededFuture(webClientHandler.result().bodyAsJsonObject()));
						} else {
							wcHandler.handle(Future.failedFuture(webClientHandler.cause()));
						}
					} else {
						wcHandler.handle(Future.failedFuture(webClientHandler.cause()));
					}
				});
	}
	

	protected void processWebClientGetRequest(int port, String host, String path, boolean ssl,
			Handler<AsyncResult<JsonObject>> wcHandler) {

		log.info("processWebClientGetRequest started");

		log.info("port : " + port);
		log.info("host : " + host);
		log.info("path : " + path);
		log.info("ssl : " + ssl);

		client.get(port, host, path).ssl(ssl).timeout(10000).putHeader("Content-Type", "application/json").send(
				webClientHandler -> {
					if (webClientHandler.succeeded()) {
						if (webClientHandler.result() != null) {
							wcHandler.handle(Future.succeededFuture(webClientHandler.result().bodyAsJsonObject()));
						} else {
							wcHandler.handle(Future.failedFuture(webClientHandler.cause()));
						}
					} else {
						wcHandler.handle(Future.failedFuture(webClientHandler.cause()));
					}
				});
	}
	

	protected void processWebClientDeleteRequest(int port, String host, String path, boolean ssl,
			Handler<AsyncResult<JsonObject>> wcHandler) {

		log.info("processWebClientGetRequest started");

		log.info("port : " + port);
		log.info("host : " + host);
		log.info("path : " + path);
		log.info("ssl : " + ssl);

		client.delete(port, host, path).ssl(ssl).timeout(10000).putHeader("Content-Type", "application/json").send(
				webClientHandler -> {
					if (webClientHandler.succeeded()) {
						if (webClientHandler.result() != null) {
							wcHandler.handle(Future.succeededFuture(webClientHandler.result().bodyAsJsonObject()));
						} else {
							wcHandler.handle(Future.failedFuture(webClientHandler.cause()));
						}
					} else {
						wcHandler.handle(Future.failedFuture(webClientHandler.cause()));
					}
				});
	}
	
	public void sendMail(String message, String toEmail, String attachment, String template) throws Exception {
		log.debug("Send Mail Started");
		Properties prop = new Properties();
		prop.put("mail.smtp.host", "smtp.gmail.com");
		prop.put("mail.smtp.starttls.enable", "true");
		prop.put("mail.smtp.auth", "true");
		prop.put("mail.smtp.port", "587");

		Session session = Session.getDefaultInstance(prop, new javax.mail.Authenticator() {
			protected javax.mail.PasswordAuthentication getPasswordAuthentication() {
				return new javax.mail.PasswordAuthentication(EMAIL_FROM, PASSWORD);
			}
		});
		vertx.executeBlocking(future -> {

			try {

				Message msg = new MimeMessage(session);

				// from
				msg.setFrom(new InternetAddress(EMAIL_FROM, "SWOMB"));

				// to
				System.out.println(toEmail);
				msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));

				// subject
				msg.setSubject("SWOMB");

				System.out.println(message);
				msg.setText(message);
				if (template != null) {
					msg.setContent(template, "text/html; charset=utf-8");
				}
				Transport.send(msg);
				future.complete("Email sent successfully");
			} catch (AddressException e) {
				future.fail(e);
			} catch (MessagingException e) {
				future.fail(e);
			} catch (UnsupportedEncodingException e) {
				future.fail(e);
			}
		}, result -> {
			if (result.succeeded()) {
				System.out.println(result.result());
			} else {
				System.out.println("Failed to send email: " + result.cause().getMessage());
			}
		});
	}
	
	protected static Map<String , JsonObject> deploymentConfigMap;
	protected static Map<Long , JsonObject> deployentCryptoMap;	
	
};