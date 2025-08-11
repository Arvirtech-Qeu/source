package com.swomb.qbox.media;

import com.swomb.qbox.DBManagerVerticle;
import com.swomb.qbox.common.util.Constants;
import com.swomb.qbox.media.util.MediaAddressConstants;

import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.WebClientOptions;
import io.vertx.reactivex.core.eventbus.MessageConsumer;
import io.vertx.reactivex.ext.web.client.WebClient;

public class ConsumerVerticle extends DBManagerVerticle {

	private MessageConsumer<JsonObject> consumer;

	private static Logger log = LoggerFactory.getLogger(ConsumerVerticle.class);

	public void start() throws Exception {

		log.info("ConsumerVerticle started");

		WebClientOptions wcOptions = new WebClientOptions();
		wcOptions.setVerifyHost(false).setTrustAll(true);
		client = WebClient.create(vertx, wcOptions);

		consumer = vertx.eventBus().consumer(MediaAddressConstants.SERVICE_HEALTH);
		consumer.handler(message -> {
			JsonObject inData = message.body().getJsonObject(Constants.DATA);
			log.info("inData : \n" + inData.encodePrettily());
			String dbQuery = message.body().getString(Constants.QUERY);
			runQuery(dbQuery, inData, MediaAddressConstants.SERVICE_HEALTH, handler -> {
				log.info(handler.succeeded());
				if (handler.succeeded()) {
					message.reply(handler.result());
				} else {
					log.error("ConsumerVerticle " + MediaAddressConstants.SERVICE_HEALTH + " error " + handler.cause());
					message.reply(errorJSON(handler.cause().toString()));
				}
			});
		});

		consumer = vertx.eventBus().consumer(MediaAddressConstants.INSERT_MEDIA);
		consumer.handler(message -> {
			JsonObject inData = message.body().getJsonObject(Constants.DATA);
			log.info("inData : \n" + inData.encodePrettily());
			String dbQuery = message.body().getString(Constants.QUERY);
			runQuery(dbQuery, inData, MediaAddressConstants.INSERT_MEDIA, handler -> {
				log.info(handler.succeeded());
				if (handler.succeeded()) {
					message.reply(handler.result());
				} else {
					log.error("ConsumerVerticle " + MediaAddressConstants.INSERT_MEDIA + " error " + handler.cause());
					message.reply(errorJSON(handler.cause().toString()));
				}
			});
		});

		consumer = vertx.eventBus().consumer(MediaAddressConstants.INSERT_MULTI_MEDIA);
		consumer.handler(message -> {
			JsonObject inData = message.body().getJsonObject(Constants.DATA);
			log.info("inData : \n" + inData.encodePrettily());
			String dbQuery = message.body().getString(Constants.QUERY);
			runQuery(dbQuery, inData, MediaAddressConstants.INSERT_MULTI_MEDIA, handler -> {
				log.info(handler.succeeded());
				if (handler.succeeded()) {
					message.reply(handler.result());
				} else {
					log.error("ConsumerVerticle " + MediaAddressConstants.INSERT_MULTI_MEDIA + " error " + handler.cause());
					message.reply(errorJSON(handler.cause().toString()));
				}
			});
		});

		consumer = vertx.eventBus().consumer(MediaAddressConstants.UPDATE_VIDEO_PROGRESS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MediaAddressConstants.UPDATE_VIDEO_PROGRESS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPutHandler((JsonObject) handler.result()));
						} else {
							log.error("ConsumerVerticle " + MediaAddressConstants.UPDATE_VIDEO_PROGRESS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MediaAddressConstants.UPDATE_WATCHED_VIDEO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MediaAddressConstants.UPDATE_WATCHED_VIDEO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPutHandler((JsonObject) handler.result()));
						} else {
							log.error("ConsumerVerticle " + MediaAddressConstants.UPDATE_WATCHED_VIDEO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		super.start();
	}
}
