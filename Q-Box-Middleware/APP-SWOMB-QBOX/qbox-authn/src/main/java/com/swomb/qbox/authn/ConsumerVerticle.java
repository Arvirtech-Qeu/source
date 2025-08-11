package com.swomb.qbox.authn;

import com.swomb.qbox.DBManagerVerticle;
import com.swomb.qbox.crypto.Crypto;
import com.swomb.qbox.util.AuthnAddressConstants;
import com.swomb.qbox.common.model.ApiDetail;
import com.swomb.qbox.common.util.ConfigConstants;
import com.swomb.qbox.common.util.Constants;

import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.WebClientOptions;
import io.vertx.reactivex.core.eventbus.MessageConsumer;
import io.vertx.reactivex.ext.web.client.WebClient;

public class ConsumerVerticle extends DBManagerVerticle {

	private MessageConsumer<JsonObject> consumer;

	private static ApiDetail notificationApiDetail;
	private static ApiDetail sinleMediaApiDetail;
	private static ApiDetail multipleMediaApiDetail;
	private static ApiDetail emailApiDetail;

	private static Logger log = LoggerFactory.getLogger(ConsumerVerticle.class);

	public void start() throws Exception {

		log.info("ConsumerVerticle started");

//		sinleMediaApiDetail = new ApiDetail(Crypto.decryptData(config().getString(ConfigConstants.MEDIA_SERVICE_HOST)),
//				Integer.parseInt(Crypto.decryptData(config().getString(ConfigConstants.MEDIA_SERVICE_PORT))),
//				config().getString(ConfigConstants.MEDIA_SERVICE_ENDPOINT_ONE),
//				config().getBoolean(ConfigConstants.MEDIA_SERVICE_SSL), null);
//
//		multipleMediaApiDetail = new ApiDetail(
//				Crypto.decryptData(config().getString(ConfigConstants.MEDIA_SERVICE_HOST)),
//				Integer.parseInt(Crypto.decryptData(config().getString(ConfigConstants.MEDIA_SERVICE_PORT))),
//				config().getString(ConfigConstants.MEDIA_SERVICE_ENDPOINT_TWO),
//				config().getBoolean(ConfigConstants.MEDIA_SERVICE_SSL), null);
//
//		notificationApiDetail = new ApiDetail(
//				Crypto.decryptData(config().getString(ConfigConstants.NOTIFICATION_SERVICE_HOST)),
//				Integer.parseInt(Crypto.decryptData(config().getString(ConfigConstants.NOTIFICATION_SERVICE_PORT))),
//				config().getString(ConfigConstants.NOTIFICATION_SERVICE_ENDPOINT),
//				config().getBoolean(ConfigConstants.NOTIFICATION_SERVICE_SSL), null);
//
//		emailApiDetail = new ApiDetail(Crypto.decryptData(config().getString(ConfigConstants.EMAIL_SERVICE_HOST)),
//				Integer.parseInt(Crypto.decryptData(config().getString(ConfigConstants.EMAIL_SERVICE_PORT))),
//				config().getString(ConfigConstants.EMAIL_SERVICE_ENDPOINT),
//				config().getBoolean(ConfigConstants.EMAIL_SERVICE_SSL), null);

		WebClientOptions wcOptions = new WebClientOptions();
		wcOptions.setVerifyHost(false).setTrustAll(true);
		client = WebClient.create(vertx, wcOptions);

		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_API_KEY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_API_KEY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_API_KEY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_API_KEY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_API_KEY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_API_KEY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_API_KEY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_API_KEY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_API_KEY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_API_KEY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_API_KEY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_API_KEY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_API_KEY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_API_KEY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_API_KEY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_API_KEY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_API_KEY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_API_KEY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_APP_USER_SETTINGS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_APP_USER_SETTINGS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_APP_USER_SETTINGS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_APP_USER_SETTINGS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_APP_USER_SETTINGS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_APP_USER_SETTINGS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_APP_USER_SETTINGS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_APP_USER_SETTINGS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_APP_USER_SETTINGS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_APP_USER_SETTINGS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_APP_USER_SETTINGS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_APP_USER_SETTINGS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_APP_USER_SETTINGS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_APP_USER_SETTINGS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_APP_USER_SETTINGS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_APP_USER_SETTINGS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_APP_USER_SETTINGS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_APP_USER_SETTINGS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_AUDIT_TRAIL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_AUDIT_TRAIL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_AUDIT_TRAIL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_AUDIT_TRAIL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_AUDIT_TRAIL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_AUDIT_TRAIL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_AUDIT_TRAIL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_AUDIT_TRAIL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_AUDIT_TRAIL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_AUDIT_TRAIL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_AUDIT_TRAIL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_AUDIT_TRAIL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_AUDIT_TRAIL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_AUDIT_TRAIL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_AUDIT_TRAIL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_AUDIT_TRAIL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_AUDIT_TRAIL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_AUDIT_TRAIL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_ATTEMPT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_AUTH_ATTEMPT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_ATTEMPT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_ATTEMPT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_AUTH_ATTEMPT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_ATTEMPT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_AUTH_ATTEMPT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_AUTH_ATTEMPT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_AUTH_ATTEMPT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_AUTH_ATTEMPT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_AUTH_ATTEMPT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_AUTH_ATTEMPT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_AUTH_ATTEMPT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_AUTH_ATTEMPT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_AUTH_ATTEMPT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_AUTH_ATTEMPT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_AUTH_ATTEMPT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_AUTH_ATTEMPT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_AUTH_PASSWORD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_AUTH_PASSWORD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_AUTH_PASSWORD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_AUTH_PASSWORD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_AUTH_PASSWORD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_AUTH_PASSWORD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_AUTH_PASSWORD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_AUTH_PASSWORD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_AUTH_PASSWORD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD_HIST
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD_HIST
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_AUTH_PASSWORD_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_AUTH_PASSWORD_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_AUTH_PASSWORD_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_AUTH_PASSWORD_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_AUTH_PASSWORD_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_AUTH_PASSWORD_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_AUTH_PASSWORD_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_AUTH_PASSWORD_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_AUTH_PASSWORD_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_AUTH_STATUS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_AUTH_STATUS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_AUTH_STATUS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_AUTH_STATUS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_AUTH_STATUS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_AUTH_STATUS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_AUTH_STATUS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_AUTH_STATUS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_AUTH_STATUS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_AUTH_STATUS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_AUTH_STATUS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_AUTH_STATUS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS_LOG);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS_LOG, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS_LOG + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS_LOG);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS_LOG, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS_LOG + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_AUTH_STATUS_LOG);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_AUTH_STATUS_LOG, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_AUTH_STATUS_LOG + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_AUTH_STATUS_LOG);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_AUTH_STATUS_LOG, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_AUTH_STATUS_LOG + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_AUTH_STATUS_LOG);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_AUTH_STATUS_LOG, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_AUTH_STATUS_LOG + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_AUTH_STATUS_LOG);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_AUTH_STATUS_LOG, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_AUTH_STATUS_LOG + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_AUTH_USER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_AUTH_USER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_AUTH_USER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_AUTH_USER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_AUTH_USER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_AUTH_USER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_AUTH_USER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_AUTH_USER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_AUTH_USER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_AUTH_USER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_AUTH_USER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_AUTH_USER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER_ROLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER_ROLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_AUTH_USER_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_AUTH_USER_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_AUTH_USER_ROLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_AUTH_USER_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_AUTH_USER_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_AUTH_USER_ROLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_AUTH_USER_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_AUTH_USER_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_AUTH_USER_ROLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_AUTH_USER_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_AUTH_USER_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_AUTH_USER_ROLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_DB_TABLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_DB_TABLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_DB_TABLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_DB_TABLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_DB_TABLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_DB_TABLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_DB_TABLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_DB_TABLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_DB_TABLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_DB_TABLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_DB_TABLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_DB_TABLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_DB_TABLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_DB_TABLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_DB_TABLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_DB_TABLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_DB_TABLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_DB_TABLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_MENU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_MENU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_MENU + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.GET_ALL_MENU + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_MENU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_MENU + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_MENU_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_MENU_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_MENU_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_MENU_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_MENU_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_MENU_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_MENU_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_MENU_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_MENU_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_MENU_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_MENU_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_MENU_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_MENU_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_MENU_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_MENU_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_MENU_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_MENU_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_MENU_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_METRIC);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_METRIC, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_METRIC + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_METRIC);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_METRIC, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_METRIC + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_METRIC);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_METRIC, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.CREATE_METRIC + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_METRIC);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_METRIC, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_METRIC + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_METRIC);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_METRIC, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_METRIC + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_METRIC);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_METRIC, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.UPDATE_METRIC + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_MODULE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_MODULE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_MODULE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_MODULE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_MODULE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_MODULE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_MODULE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_MODULE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.CREATE_MODULE + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_MODULE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_MODULE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_MODULE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_MODULE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_MODULE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_MODULE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_MODULE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_MODULE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.UPDATE_MODULE + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_MODULE_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_MODULE_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_MODULE_MENU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_MODULE_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_MODULE_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_MODULE_MENU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_MODULE_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_MODULE_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_MODULE_MENU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_MODULE_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_MODULE_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_MODULE_MENU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_MODULE_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_MODULE_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_MODULE_MENU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_MODULE_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_MODULE_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_MODULE_MENU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_ADDON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_ADDON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_ADDON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_ADDON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_ADDON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_ADDON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_PERMISSION_ADDON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_PERMISSION_ADDON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_PERMISSION_ADDON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_PERMISSION_ADDON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_PERMISSION_ADDON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_PERMISSION_ADDON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_PERMISSION_ADDON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_PERMISSION_ADDON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_PERMISSION_ADDON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_PERMISSION_ADDON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_PERMISSION_ADDON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_PERMISSION_ADDON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_SERVICE_API
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_SERVICE_API
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_PERMISSION_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_PERMISSION_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_PERMISSION_SERVICE_API + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_PERMISSION_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_PERMISSION_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_PERMISSION_SERVICE_API + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_PERMISSION_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_PERMISSION_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_PERMISSION_SERVICE_API
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_PERMISSION_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_PERMISSION_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_PERMISSION_SERVICE_API + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_POLICY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_POLICY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_POLICY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_POLICY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_POLICY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_POLICY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_POLICY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_POLICY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.CREATE_POLICY + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_POLICY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_POLICY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_POLICY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_POLICY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_POLICY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_POLICY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_POLICY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_POLICY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.UPDATE_POLICY + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_REASON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_REASON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_REASON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_REASON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_REASON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_REASON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_REASON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_REASON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.CREATE_REASON + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_REASON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_REASON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_REASON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_REASON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_REASON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_REASON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_REASON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_REASON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.UPDATE_REASON + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_RECORD_ACTION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_RECORD_ACTION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_RECORD_ACTION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_RECORD_ACTION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_RECORD_ACTION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_RECORD_ACTION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_RECORD_ACTION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_RECORD_ACTION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_RECORD_ACTION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_RECORD_ACTION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_RECORD_ACTION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_RECORD_ACTION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_RECORD_ACTION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_RECORD_ACTION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_RECORD_ACTION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_RECORD_ACTION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_RECORD_ACTION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_RECORD_ACTION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_REGISTERATION_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_REGISTERATION_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_REGISTERATION_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_REGISTERATION_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_REGISTERATION_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_REGISTERATION_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_REGISTERATION_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_REGISTERATION_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_REGISTERATION_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_REGISTERATION_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_REGISTERATION_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_REGISTERATION_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_REGISTERATION_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_REGISTERATION_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_REGISTERATION_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_REGISTERATION_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_REGISTERATION_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_REGISTERATION_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_REGITRATION_ID_TYPE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_REGITRATION_ID_TYPE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_REGITRATION_ID_TYPE
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_REGITRATION_ID_TYPE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_REGITRATION_ID_TYPE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_REGITRATION_ID_TYPE
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_REGITRATION_ID_TYPE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_REGITRATION_ID_TYPE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_REGITRATION_ID_TYPE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_REGITRATION_ID_TYPE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_REGITRATION_ID_TYPE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_REGITRATION_ID_TYPE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_REGITRATION_ID_TYPE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_REGITRATION_ID_TYPE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_REGITRATION_ID_TYPE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_REGITRATION_ID_TYPE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_REGITRATION_ID_TYPE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_REGITRATION_ID_TYPE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_RESET_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_RESET_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_RESET_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_RESET_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_RESET_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_RESET_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_RESET_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_RESET_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_RESET_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_RESET_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_RESET_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_RESET_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_RESET_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_RESET_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_RESET_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_RESET_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_RESET_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_RESET_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_ROLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_ROLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_ROLE + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.GET_ALL_ROLE + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_ROLE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_ROLE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_ROLE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_ROLE + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_ROLE_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_ROLE_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_ROLE_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_ROLE_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_ROLE_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_ROLE_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_ROLE_PERMISSION);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_ROLE_PERMISSION, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_ROLE_PERMISSION + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION_HIST
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION_HIST
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_ROLE_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_ROLE_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_ROLE_PERMISSION_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_ROLE_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_ROLE_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_ROLE_PERMISSION_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_ROLE_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_ROLE_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_ROLE_PERMISSION_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_SERVICE_API + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_SERVICE_API + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_SERVICE_API + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_SERVICE_API + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_SERVICE_API + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_SERVICE_API);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_SERVICE_API, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_SERVICE_API + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_SESSION_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_SESSION_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_SESSION_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_SESSION_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_SESSION_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_SESSION_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_SESSION_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_SESSION_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_SESSION_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_SESSION_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_SESSION_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_SESSION_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_SESSION_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_SESSION_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_SESSION_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_SESSION_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_SESSION_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_SESSION_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_SESSION_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_SESSION_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_SESSION_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_SESSION_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_SESSION_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_SESSION_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_SIGNIN_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_SIGNIN_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_SIGNIN_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_SIGNIN_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_SIGNIN_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_SIGNIN_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_SIGNIN_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_SIGNIN_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_SIGNIN_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_SIGNIN_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_SIGNIN_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_SIGNIN_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_SIGNIN_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_SIGNIN_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_SIGNIN_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_SIGNIN_INFO_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_SIGNIN_INFO_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_SIGNIN_INFO_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_TOKENS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_TOKENS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_TOKENS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_TOKENS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_TOKENS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_TOKENS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_TOKENS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_TOKENS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.CREATE_TOKENS + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_TOKENS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_TOKENS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_TOKENS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_TOKENS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_TOKENS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_TOKENS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_TOKENS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_TOKENS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.UPDATE_TOKENS + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_USER_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_USER_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_USER_PERMISSION_HIST
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_USER_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_USER_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_USER_PERMISSION_HIST
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_USER_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_USER_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_USER_PERMISSION_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_USER_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_USER_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_USER_PERMISSION_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_USER_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_USER_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_USER_PERMISSION_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_USER_PERMISSION_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_USER_PERMISSION_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_USER_PERMISSION_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_SEARCH_USER_ROLE_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_SEARCH_USER_ROLE_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_SEARCH_USER_ROLE_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CUSTOM_UPDATE_USER_ROLE_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CUSTOM_UPDATE_USER_ROLE_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CUSTOM_UPDATE_USER_ROLE_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_USER_ROLE_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_USER_ROLE_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_USER_ROLE_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_USER_ROLE_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_USER_ROLE_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_ALL_USER_ROLE_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_BY_ID_USER_ROLE_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_BY_ID_USER_ROLE_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_BY_ID_USER_ROLE_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.UPDATE_USER_ROLE_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.UPDATE_USER_ROLE_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.UPDATE_USER_ROLE_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_DB_TABLE_BY_ID);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_DB_TABLE_BY_ID, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_DB_TABLE_BY_ID + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.IS_UNIQUE_MODULE_NAME_EXISTS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.IS_UNIQUE_MODULE_NAME_EXISTS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.IS_UNIQUE_MODULE_NAME_EXISTS + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.IS_UNIQUE_DB_TABLE_NAME_EXISTS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.IS_UNIQUE_DB_TABLE_NAME_EXISTS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.IS_UNIQUE_DB_TABLE_NAME_EXISTS + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_PERMISSIONS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_PERMISSIONS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.GET_ALL_PERMISSIONS + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_MAP_UNMAP_ROLE_PERMISSION_BY_ROLE_ID);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_MAP_UNMAP_ROLE_PERMISSION_BY_ROLE_ID, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.GET_MAP_UNMAP_ROLE_PERMISSION_BY_ROLE_ID + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_MAP_UNMAP_ROLE_PERMISSIONS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_MAP_UNMAP_ROLE_PERMISSIONS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_MAP_UNMAP_ROLE_PERMISSIONS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_MAP_UNMAP_MODULE_MENU_BY_MODULE_ID);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_MAP_UNMAP_MODULE_MENU_BY_MODULE_ID, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.GET_MAP_UNMAP_MODULE_MENU_BY_MODULE_ID + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_MAP_UNMAP_MODULE_MENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_MAP_UNMAP_MODULE_MENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_MAP_UNMAP_MODULE_MENU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.IS_UNIQUE_MENU_NAME_EXISTS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.IS_UNIQUE_MENU_NAME_EXISTS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.IS_UNIQUE_MENU_NAME_EXISTS + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.IS_UNIQUE_SERVICE_API_URL_EXISTS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.IS_UNIQUE_SERVICE_API_URL_EXISTS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.IS_UNIQUE_SERVICE_API_URL_EXISTS + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.IS_UNIQUE_PERMISSION_NAME_EXISTS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.IS_UNIQUE_PERMISSION_NAME_EXISTS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.IS_UNIQUE_PERMISSION_NAME_EXISTS + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.IS_UNIQUE_ROLE_NAME_EXISTS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.IS_UNIQUE_ROLE_NAME_EXISTS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.IS_UNIQUE_ROLE_NAME_EXISTS + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_DASHBOARD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_DASHBOARD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.GET_DASHBOARD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.AUTH_USER_REGISTER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.AUTH_USER_REGISTER, handler -> {
						if (handler.succeeded()) {
							JsonObject result = succesPostHandler(handler.result());
		                    if (result != null) {
		                        // Extract `data` object from the result
		                        JsonObject data = result.getJsonObject("data");
		                        if (data != null) {
		                            // Extract `userData` and `otpData`
		                            JsonObject userData = data.getJsonObject("userData");
		                            JsonObject otpData = data.getJsonObject("otpData");

		                            if (userData != null && otpData != null) {
		                                // Extract email (authUserName) and OTP (otpCode)
		                                String authUserName = userData.getString("authUserName");
		                                String otpCode = otpData.getString("otpCode");

		                                // Send mail if both email and OTP are present
		                                if (authUserName != null && otpCode != null) {
		                                    JsonObject mail = new JsonObject();
		                                    mail.put("toEmail", authUserName);
		                                    mail.put("otp", otpCode);
		                                    vertx.eventBus().send("send_mail", mail);
		                                }
		                            }
		                        }
		                    }
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.AUTH_USER_REGISTER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
//		consumer.handler(message -> {
//		    JsonObject inData = message.body().getJsonObject(Constants.DATA);
//		    runQuery(message.body().getString(Constants.QUERY), inData,
//		            AuthnAddressConstants.AUTH_USER_REGISTER, handler -> {
//		                if (handler.succeeded()) {
//		                    JsonObject result = succesPostHandler(handler.result());
//		                    System.out.println("Success Response: " + result);
//
//		                    if (result != null) {
//		                        // Extract authUserName and otpCode from the result
//		                        JsonObject userData = result.getJsonObject("userData");
//		                        JsonObject otpData = result.getJsonObject("otpData");
//		                        if (userData != null && otpData != null) {
//		                            String authUserName = userData.getString("authUserName");
//		                            String otpCode = otpData.getString("otpCode");
//
//		                            // Send mail if authUserName and otpCode are present
//		                            if (authUserName != null && otpCode != null) {
//		                                JsonObject mail = new JsonObject();
//		                                mail.put("toEmail", authUserName);
//		                                mail.put("otp", otpCode);
//		                                vertx.eventBus().send("send_mail", mail);
//		                            }
//		                        }
//		                    }
//		                    message.reply(succesPostHandler(handler.result()));
//		                } else {
//		                    log.error("ConsumerVerticle " + AuthnAddressConstants.AUTH_USER_REGISTER + " error "
//		                            + handler.cause());
//		                    message.reply(errorJSON(handler.cause().toString()));
//		                }
//		            });
//		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.VERIFY_OTP);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.VERIFY_OTP, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.VERIFY_OTP + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.SET_AUTH_USER_PASSWORD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.SET_AUTH_USER_PASSWORD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.SET_AUTH_USER_PASSWORD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.LOGIN);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.LOGIN, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.LOGIN + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_MENU_SUBMENU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_MENU_SUBMENU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.GET_ALL_MENU_SUBMENU + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_MAPPED_UNMAPPED_ENTITIES_FOR_LOADER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_MAPPED_UNMAPPED_ENTITIES_FOR_LOADER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.GET_MAPPED_UNMAPPED_ENTITIES_FOR_LOADER + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_ALL_LOADER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_ALL_LOADER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.GET_ALL_LOADER + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.CREATE_USER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.CREATE_USER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.CREATE_USER + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_AUTH_USER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_AUTH_USER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.GET_AUTH_USER + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.GET_USER_BY_QBOX_ENTITY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.GET_USER_BY_QBOX_ENTITY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.GET_USER_BY_QBOX_ENTITY + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.DELETE_USER_BY_ID);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.DELETE_USER_BY_ID, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + AuthnAddressConstants.DELETE_USER_BY_ID + " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(AuthnAddressConstants.VERIFY_EMAIL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					AuthnAddressConstants.VERIFY_EMAIL, handler -> {
						if (handler.succeeded()) {
							JsonObject result = succesPostHandler(handler.result());
		                    if (result != null) {
		                        // Extract `data` object from the result
		                        JsonObject data = result.getJsonObject("data");
		                        if (data != null) {
		                            // Extract `userData` and `otpData`
		                            JsonObject otpData = data.getJsonObject("otpData");

		                            if ( otpData != null) {
		                                // Extract email (authUserName) and OTP (otpCode)
		                                String authUserName = data.getString("authUserName");
		                                String otpCode = otpData.getString("otpCode");

		                                // Send mail if both email and OTP are present
		                                if (authUserName != null && otpCode != null) {
		                                    JsonObject mail = new JsonObject();
		                                    mail.put("toEmail", authUserName);
		                                    mail.put("otp", otpCode);
		                                    vertx.eventBus().send("send_mail", mail);
		                                }
		                            }
		                        }
		                    }
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + AuthnAddressConstants.VERIFY_EMAIL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
				
		consumer = vertx.eventBus().consumer("send_mail");
		consumer.handler(message -> {
		    JsonObject email = message.body();
		    System.out.println("email: " + email);
		    try {
		        String template = "";
		        if (email.getString("password") != null) {
		            // Account Credentials Email Template
		            template = "<!DOCTYPE html>"
		                + "<html lang=\"en\">"
		                + "<head>"
		                + "    <meta charset=\"UTF-8\">"
		                + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
		                + "    <title>Your Account Credentials</title>"
		                + "    <style>"
		                + "        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; }"
		                + "        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; }"
		                + "        .header { text-align: center; padding-bottom: 30px; border-bottom: 2px solid #f0f0f0; }"
		                + "        .logo { font-size: 28px; font-weight: bold; color: #2c5282; text-decoration: none; }"
		                + "        .content { padding: 30px 0; }"
		                + "        .credentials-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }"
		                + "        .warning { color: #c53030; font-weight: 600; margin: 20px 0; }"
		                + "        .footer { text-align: center; font-size: 14px; color: #718096; border-top: 2px solid #f0f0f0; padding-top: 30px; }"
		                + "    </style>"
		                + "</head>"
		                + "<body>"
		                + "    <div class=\"container\">"
		                + "        <div class=\"header\">"
		                + "            <div class=\"logo\">SWOMB</div>"
		                + "        </div>"
		                + "        <div class=\"content\">"
		                + "            <h2>Welcome to SWOMB</h2>"
		                + "            <p>Hello,</p>"
		                + "            <p>Your account has been successfully created in our Identity Access Management system. Below are your login credentials:</p>"
		                + "            <div class=\"credentials-box\">"
		                + "                <p><strong>Email:</strong> " + email.getString("toEmail") + "</p>"
		                + "                <p><strong>Temporary Password:</strong> " + email.getString("password") + "</p>"
		                + "            </div>"
		                + "            <p class=\"warning\">⚠️ For security reasons, please change your password immediately after your first login.</p>"
		                + "            <p>If you didn't request this account, please contact our IT support team immediately.</p>"
		                + "        </div>"
		                + "        <div class=\"footer\">"
		                + "            <p>This is an automated message. Please do not reply to this email.</p>"
		                + "            <p>&copy; 2024 SWOMB - Identity Access Management</p>"
		                + "        </div>"
		                + "    </div>"
		                + "</body>"
		                + "</html>";
		        } else {
		            // OTP Verification Email Template
		            template = "<!DOCTYPE html>"
		                + "<html lang=\"en\">"
		                + "<head>"
		                + "    <meta charset=\"UTF-8\">"
		                + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
		                + "    <title>Verification Code</title>"
		                + "    <style>"
		                + "        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; }"
		                + "        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; }"
		                + "        .header { text-align: left; padding-bottom: 30px; border-bottom: 2px solid #f0f0f0; }"
		                + "        .logo { font-size: 28px; font-weight: bold; color: #f7c800; text-decoration: none; }"
		                + "        .content { padding: 30px 0; text-align: center; }"
		                + "        .otp-code { background-color: #00466a; color: #ffffff; font-size: 32px; font-weight: bold; "
		                + "                    padding: 15px 40px; border-radius: 8px; margin: 30px 0; display: inline-block; letter-spacing: 5px; }"
		                + "        .warning { color: #c53030; font-weight: 600; margin: 20px 0; font-size: 14px; }"
		                + "        .footer { text-align: center; font-size: 14px; color: #718096; border-top: 2px solid #f0f0f0; padding-top: 30px; }"
		                + "    </style>"
		                + "</head>"
		                + "<body>"
		                + "    <div class=\"container\">"
		                + "        <div class=\"header\">"
		                + "            <div class=\"logo\">SWOMB</div>"
		                + "        </div>"
		                + "        <div class=\"content\">"
		                + "            <h2>Verify Your Identity</h2>"
		                + "            <p>Hello,</p>"
		                + "            <p>Thank you for choosing SWOMB. Use this OTP to complete your Sign Up procedures and verify your account.</p>"
		                + "            <div class=\"otp-code\">" + email.getString("otp") + "</div>"
		                + "            <p class=\"warning\">Never share this OTP with anyone. Our team will never ask for your OTP.</p>"
		                + "            <p style=\"font-size:15px;\">Regards,<br />Team SWOMB</p>"
		                + "        </div>"
		                + "        <div class=\"footer\">"
		                + "            <p>This is an automated message. Please do not reply to this email.</p>"
		                + "            <p>&copy; 2024 SWOMB - Identity Access Management</p>"
		                + "        </div>"
		                + "    </div>"
		                + "</body>"
		                + "</html>";
		        }

		        sendMail("", email.getString("toEmail"), "", template);
		    } catch (Exception e) {
		        e.printStackTrace();
		    }
		});
		
		
		super.start();
	}

}
