package com.swomb.qbox.masters;

import com.swomb.qbox.DBManagerVerticle;
import com.swomb.qbox.common.util.Constants;
import com.swomb.qbox.masters.util.MastersAddressConstants;

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

		consumer = vertx.eventBus().consumer(MastersAddressConstants.SERVICE_HEALTH);
		consumer.handler(message -> {
			JsonObject inData = message.body().getJsonObject(Constants.DATA);
			log.info("inData : \n" + inData.encodePrettily());
			String dbQuery = message.body().getString(Constants.QUERY);
			runQuery(dbQuery, inData, MastersAddressConstants.SERVICE_HEALTH, handler -> {
				log.info(handler.succeeded());
				if (handler.succeeded()) {
					message.reply(handler.result());
				} else {
					log.error(
							"ConsumerVerticle " + MastersAddressConstants.SERVICE_HEALTH + " error " + handler.cause());
					message.reply(errorJSON(handler.cause().toString()));
				}
			});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_ADDRESS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_ADDRESS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_ADDRESS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_ADDRESS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_ADDRESS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_ADDRESS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_ADDRESS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_ADDRESS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_ADDRESS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_ADDRESS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_ADDRESS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_ADDRESS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_AREA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_AREA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_AREA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_AREA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_AREA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_AREA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_AREA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_AREA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_AREA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_AREA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_AREA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_AREA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_CITY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_CITY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_CITY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_CITY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_CITY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_CITY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_CITY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_CITY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_CITY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_CITY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_CITY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_CITY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_CODES_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_CODES_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_CODES_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_CODES_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_CODES_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_CODES_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_CODES_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_CODES_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_CODES_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_CODES_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_CODES_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_CODES_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_CODES_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_CODES_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_CODES_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_CODES_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_CODES_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_CODES_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_CODES_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_CODES_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_CODES_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_CODES_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_CODES_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_CODES_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_COUNTRY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_COUNTRY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_COUNTRY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_COUNTRY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_COUNTRY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_COUNTRY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_COUNTRY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_COUNTRY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_COUNTRY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_COUNTRY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_COUNTRY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_COUNTRY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_DELIVERY_PARTNER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_DELIVERY_PARTNER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_DELIVERY_PARTNER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_DELIVERY_PARTNER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_FOOD_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_FOOD_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_FOOD_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_FOOD_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_PARTNER_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_PARTNER_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_PARTNER_FOOD_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_PARTNER_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_PARTNER_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_PARTNER_FOOD_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_PARTNER_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_PARTNER_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_PARTNER_FOOD_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_PARTNER_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_PARTNER_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_PARTNER_FOOD_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_RESTAURANT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_RESTAURANT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_RESTAURANT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_RESTAURANT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_RESTAURANT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_RESTAURANT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_RESTAURANT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_RESTAURANT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_RESTAURANT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_RESTAURANT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_RESTAURANT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_RESTAURANT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_RESTAURANT_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_RESTAURANT_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_RESTAURANT_FOOD_SKU
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_RESTAURANT_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_RESTAURANT_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_RESTAURANT_FOOD_SKU
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_RESTAURANT_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_RESTAURANT_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_RESTAURANT_FOOD_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_RESTAURANT_FOOD_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_RESTAURANT_FOOD_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_RESTAURANT_FOOD_SKU
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_STATE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_STATE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_STATE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_STATE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_STATE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_STATE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_STATE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_STATE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_STATE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_STATE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_STATE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_STATE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_SKU_DASHBOARD_COUNTS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_SKU_DASHBOARD_COUNTS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_SKU_DASHBOARD_COUNTS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_ENUM);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_ENUM, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_ENUM + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_ETL_JOB);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_ETL_JOB, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_ETL_JOB + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_ETL_TABLE_COLUMN);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_ETL_TABLE_COLUMN, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_ETL_TABLE_COLUMN + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_ETL_TABLE_COLUMN);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_ETL_TABLE_COLUMN, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_ETL_TABLE_COLUMN + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_ORDER_ETL_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_ORDER_ETL_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_ORDER_ETL_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_ETL_TABLE_COLUMN);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_ETL_TABLE_COLUMN, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_ETL_TABLE_COLUMN + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_ORDER_ETL_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_ORDER_ETL_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_ORDER_ETL_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_ETL_TABLE_COLUMN);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_ETL_TABLE_COLUMN, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_ETL_TABLE_COLUMN + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_ORDER_ETL_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_ORDER_ETL_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_ORDER_ETL_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_ETL_TABLE_COLUMN);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_ETL_TABLE_COLUMN, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_ETL_TABLE_COLUMN + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_ORDER_ETL_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_ORDER_ETL_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_ORDER_ETL_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_BOX_CELL_INVENTORY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_BOX_CELL_INVENTORY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_BOX_CELL_INVENTORY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_HISTORY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_HISTORY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle "
									+ MastersAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_HISTORY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_PARTNER_ORDER_DASHBOARD_DETAILS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_PARTNER_ORDER_DASHBOARD_DETAILS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_PARTNER_ORDER_DASHBOARD_DETAILS
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY_HISTORY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY_HISTORY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle "
									+ MastersAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY_HISTORY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_HOTBOX_COUNT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_HOTBOX_COUNT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_HOTBOX_COUNT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DAILY_ITEMS_RETURNED_REPORT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DAILY_ITEMS_RETURNED_REPORT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DAILY_ITEMS_RETURNED_REPORT
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_PURCHASE_REPORT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_PURCHASE_REPORT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_PURCHASE_REPORT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DAILY_GOODS_RETURNED_REPORT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DAILY_GOODS_RETURNED_REPORT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DAILY_GOODS_RETURNED_REPORT
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DAILY_STOCKS_IN_HAND_REPORT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DAILY_STOCKS_IN_HAND_REPORT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DAILY_STOCKS_IN_HAND_REPORT
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DAILY_SALES_REPORT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DAILY_SALES_REPORT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DAILY_SALES_REPORT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DAILY_STOCKS_IN_HAND_REPORT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DAILY_STOCKS_IN_HAND_REPORT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DAILY_STOCKS_IN_HAND_REPORT
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DAILY_BEST_SELLER_REPORT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DAILY_BEST_SELLER_REPORT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DAILY_BEST_SELLER_REPORT
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DAILY_PURCHASE_REPORT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DAILY_PURCHASE_REPORT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DAILY_PURCHASE_REPORT
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_SALES_REPORT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_SALES_REPORT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_SALES_REPORT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_BOX_CELL_INVENTORY_V2);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_BOX_CELL_INVENTORY_V2, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_BOX_CELL_INVENTORY_V2
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_HOTBOX_COUNT_V2);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_HOTBOX_COUNT_V2, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_HOTBOX_COUNT_V2 + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_ENTITY_INFRA_PROPERTIES_V2);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_ENTITY_INFRA_PROPERTIES_V2, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_ENTITY_INFRA_PROPERTIES_V2
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_REJECTED_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_REJECTED_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_REJECTED_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_UNALLOCATED_FOOD_ORDERS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_UNALLOCATED_FOOD_ORDERS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_UNALLOCATED_FOOD_ORDERS
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.UPDATE_PROFILE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.UPDATE_PROFILE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.UPDATE_PROFILE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_MOST_SOLD_COUNTS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_MOST_SOLD_COUNTS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_MOST_SOLD_COUNTS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_INWARD_ORDER_DETAILS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_INWARD_ORDER_DETAILS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_INWARD_ORDER_DETAILS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_UNSOLD_SKU_LUNCH_COUNTS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_UNSOLD_SKU_LUNCH_COUNTS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_UNSOLD_SKU_LUNCH_COUNTS
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_UNSOLD_SKU_DINNER_COUNTS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_UNSOLD_SKU_DINNER_COUNTS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_UNSOLD_SKU_DINNER_COUNTS
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_CONSOLIDATED_DATA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_CONSOLIDATED_DATA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_CONSOLIDATED_DATA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DAILY_STOCK_REPORT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DAILY_STOCK_REPORT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DAILY_STOCK_REPORT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_BEST_SELLING_FOOD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_BEST_SELLING_FOOD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_BEST_SELLING_FOOD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GENERATE_ORDER_FILE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GENERATE_ORDER_FILE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GENERATE_ORDER_FILE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_SALES_SKU_INVENTORY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_SALES_SKU_INVENTORY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_SALES_SKU_INVENTORY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DASHBOARD_STOCK_SUMMARY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DASHBOARD_STOCK_SUMMARY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DASHBOARD_STOCK_SUMMARY
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_HOTBOX_SUMMARY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_HOTBOX_SUMMARY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_HOTBOX_SUMMARY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_INWARD_ORDER_DETAILS_V2);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_INWARD_ORDER_DETAILS_V2, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_INWARD_ORDER_DETAILS_V2
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_HOTBOX_COUNT_V3);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_HOTBOX_COUNT_V3, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_HOTBOX_COUNT_V3 + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DAILY_STOCK_REPORT_V2);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DAILY_STOCK_REPORT_V2, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DAILY_STOCK_REPORT_V2
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_ENTITY_LOADER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_ENTITY_LOADER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_ENTITY_LOADER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DETAILED_INWARD_ORDERS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DETAILED_INWARD_ORDERS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DETAILED_INWARD_ORDERS
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY_BY_AUTH_USER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY_BY_AUTH_USER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error(
									"ConsumerVerticle " + MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY_BY_AUTH_USER
											+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_SUPERVISORS_BY_ENTITIES);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_SUPERVISORS_BY_ENTITIES, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_SUPERVISORS_BY_ENTITIES
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_ATTENDANCE_RECORD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_ATTENDANCE_RECORD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_ATTENDANCE_RECORD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.UPDATE_ATTENDANCE_RECORD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.UPDATE_ATTENDANCE_RECORD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.UPDATE_ATTENDANCE_RECORD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_TODAY_ATTENDANCE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_TODAY_ATTENDANCE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_TODAY_ATTENDANCE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_ATTENDANCE_SUMMARY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_ATTENDANCE_SUMMARY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_ATTENDANCE_SUMMARY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_USER_BY_ID);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_USER_BY_ID, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_USER_BY_ID + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_SKU_SALES_REPORT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_SKU_SALES_REPORT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_SKU_SALES_REPORT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_FULL_PURCHASE_ORDER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_FULL_PURCHASE_ORDER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_FULL_PURCHASE_ORDER
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_SKU_IN_QBOX_INVENTORY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_SKU_IN_QBOX_INVENTORY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_SKU_IN_QBOX_INVENTORY
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_ENTITY_INFRA_DETAILS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_ENTITY_INFRA_DETAILS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_ENTITY_INFRA_DETAILS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_LOW_STOCK_TRIGGER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_LOW_STOCK_TRIGGER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_LOW_STOCK_TRIGGER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.EDIT_LOW_STOCK_TRIGGER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.EDIT_LOW_STOCK_TRIGGER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.EDIT_LOW_STOCK_TRIGGER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.SEARCH_LOW_STOCK_TRIGGER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.SEARCH_LOW_STOCK_TRIGGER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.SEARCH_LOW_STOCK_TRIGGER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_LOW_STOCK_TRIGGER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_LOW_STOCK_TRIGGER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_LOW_STOCK_TRIGGER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.CONFIRM_SKU_REJECT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CONFIRM_SKU_REJECT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CONFIRM_SKU_REJECT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.CREATE_REJECT_REASON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.CREATE_REJECT_REASON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.CREATE_REJECT_REASON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_REJECT_REASON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_REJECT_REASON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_REJECT_REASON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.UPDATE_REJECT_REASON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.UPDATE_REJECT_REASON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.UPDATE_REJECT_REASON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.DELETE_REJECT_REASON);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.DELETE_REJECT_REASON, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.DELETE_REJECT_REASON + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(MastersAddressConstants.GET_DASHBOARD_ANALYTICS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.GET_DASHBOARD_ANALYTICS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));

						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.GET_DASHBOARD_ANALYTICS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		super.start();
	}
}
