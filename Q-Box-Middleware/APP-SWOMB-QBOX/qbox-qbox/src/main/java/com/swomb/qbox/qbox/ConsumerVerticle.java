package com.swomb.qbox.qbox;

import com.swomb.qbox.DBManagerVerticle;
import com.swomb.qbox.common.util.Constants;
import com.swomb.qbox.qbox.util.QboxAddressConstants;

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

		consumer = vertx.eventBus().consumer(QboxAddressConstants.VERIFY_INWARD_DELIVERY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.VERIFY_INWARD_DELIVERY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.VERIFY_INWARD_DELIVERY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});


		consumer = vertx.eventBus().consumer(QboxAddressConstants.INTERNAL_INVENTORY_MOVEMENT);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.INTERNAL_INVENTORY_MOVEMENT, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.INTERNAL_INVENTORY_MOVEMENT + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.GET_CROSSED_STAGES_INFO);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.GET_CROSSED_STAGES_INFO, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.GET_CROSSED_STAGES_INFO + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});



		consumer = vertx.eventBus().consumer(QboxAddressConstants.ACCEPT_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.ACCEPT_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.ACCEPT_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});



		consumer = vertx.eventBus().consumer(QboxAddressConstants.REJECT_SKU);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.REJECT_SKU, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.REJECT_SKU + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.GET_QBOX_CURRENT_STATUS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.GET_QBOX_CURRENT_STATUS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.GET_QBOX_CURRENT_STATUS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.LOAD_SKU_IN_QBOX);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.LOAD_SKU_IN_QBOX, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.LOAD_SKU_IN_QBOX + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.UNLOAD_SKU_FROM_QBOX_TO_HOTBOX);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.UNLOAD_SKU_FROM_QBOX_TO_HOTBOX, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.UNLOAD_SKU_FROM_QBOX_TO_HOTBOX + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.PARTNER_CHANNEL_INWARD_ORDER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.PARTNER_CHANNEL_INWARD_ORDER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.PARTNER_CHANNEL_INWARD_ORDER
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_LIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_LIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_LIST
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_ORDER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_ORDER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_ORDER
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.SERVICE_HEALTH);
		consumer.handler(message -> {
			JsonObject inData = message.body().getJsonObject(Constants.DATA);
			log.info("inData : \n" + inData.encodePrettily());
			String dbQuery = message.body().getString(Constants.QUERY);
			runQuery(dbQuery, inData, QboxAddressConstants.SERVICE_HEALTH, handler -> {
				log.info(handler.succeeded());
				if (handler.succeeded()) {
					message.reply(handler.result());
				} else {
					log.error("ConsumerVerticle " + QboxAddressConstants.SERVICE_HEALTH + " error " + handler.cause());
					message.reply(errorJSON(handler.cause().toString()));
				}
			});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_BOX_CELL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_BOX_CELL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_BOX_CELL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_BOX_CELL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_BOX_CELL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_BOX_CELL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_BOX_CELL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_BOX_CELL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_BOX_CELL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_BOX_CELL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_BOX_CELL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_BOX_CELL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_BOX_CELL_FOOD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_BOX_CELL_FOOD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_BOX_CELL_FOOD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_BOX_CELL_FOOD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_BOX_CELL_FOOD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_BOX_CELL_FOOD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_BOX_CELL_FOOD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_BOX_CELL_FOOD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_BOX_CELL_FOOD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_BOX_CELL_FOOD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_BOX_CELL_FOOD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_BOX_CELL_FOOD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_BOX_CELL_FOOD_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_BOX_CELL_FOOD_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_BOX_CELL_FOOD_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_BOX_CELL_FOOD_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_BOX_CELL_FOOD_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_BOX_CELL_FOOD_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_BOX_CELL_FOOD_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_BOX_CELL_FOOD_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_BOX_CELL_FOOD_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_BOX_CELL_FOOD_HIST);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_BOX_CELL_FOOD_HIST, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_BOX_CELL_FOOD_HIST + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_CODES_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_CODES_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_CODES_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_CODES_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_CODES_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_CODES_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_CODES_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_CODES_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_CODES_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_CODES_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_CODES_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_CODES_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_CODES_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_CODES_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_CODES_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_CODES_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_CODES_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_CODES_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_CODES_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_CODES_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_CODES_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_CODES_HDR);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_CODES_HDR, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_CODES_HDR + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_DELIVERY_PARTNER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_DELIVERY_PARTNER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_DELIVERY_PARTNER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_DELIVERY_PARTNER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_ENTITY_INFRA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_ENTITY_INFRA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_ENTITY_INFRA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_ENTITY_INFRA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_ENTITY_INFRA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_ENTITY_INFRA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_ENTITY_INFRA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_ENTITY_INFRA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_ENTITY_INFRA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_ENTITY_INFRA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_ENTITY_INFRA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_ENTITY_INFRA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_ENTITY_INFRA_PROPERTY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_ENTITY_INFRA_PROPERTY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_ENTITY_INFRA_PROPERTY
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_ENTITY_INFRA_PROPERTY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_ENTITY_INFRA_PROPERTY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_ENTITY_INFRA_PROPERTY
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_ENTITY_INFRA_PROPERTY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_ENTITY_INFRA_PROPERTY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_ENTITY_INFRA_PROPERTY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_ENTITY_INFRA_PROPERTY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_ENTITY_INFRA_PROPERTY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_ENTITY_INFRA_PROPERTY
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_INFRA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_INFRA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_INFRA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_INFRA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_INFRA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_INFRA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_INFRA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_INFRA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_INFRA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_INFRA);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_INFRA, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_INFRA + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_INFRA_PROPERTY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_INFRA_PROPERTY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_INFRA_PROPERTY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_INFRA_PROPERTY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_INFRA_PROPERTY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_INFRA_PROPERTY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_INFRA_PROPERTY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_INFRA_PROPERTY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_INFRA_PROPERTY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_INFRA_PROPERTY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_INFRA_PROPERTY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_INFRA_PROPERTY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_PURCHASE_ORDER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_PURCHASE_ORDER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_PURCHASE_ORDER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});

		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_PURCHASE_ORDER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_PURCHASE_ORDER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_PURCHASE_ORDER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_PURCHASE_ORDER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_PURCHASE_ORDER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_PURCHASE_ORDER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_PURCHASE_ORDER_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_PURCHASE_ORDER_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_PURCHASE_ORDER_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_PURCHASE_ORDER_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_PURCHASE_ORDER_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_PURCHASE_ORDER_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_PURCHASE_ORDER_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_PURCHASE_ORDER_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_PURCHASE_ORDER_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_PURCHASE_ORDER_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_PURCHASE_ORDER_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_PURCHASE_ORDER_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_QBOX_ENTITY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_QBOX_ENTITY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_QBOX_ENTITY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_QBOX_ENTITY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_QBOX_ENTITY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_QBOX_ENTITY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_QBOX_ENTITY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_QBOX_ENTITY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_QBOX_ENTITY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_QBOX_ENTITY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_QBOX_ENTITY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_QBOX_ENTITY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_QBOX_ENTITY_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_QBOX_ENTITY_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_QBOX_ENTITY_DELIVERY_PARTNER
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_QBOX_ENTITY_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_QBOX_ENTITY_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_QBOX_ENTITY_DELIVERY_PARTNER
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_QBOX_ENTITY_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_QBOX_ENTITY_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_QBOX_ENTITY_DELIVERY_PARTNER
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_QBOX_ENTITY_DELIVERY_PARTNER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_QBOX_ENTITY_DELIVERY_PARTNER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_QBOX_ENTITY_DELIVERY_PARTNER
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_SALES_ORDER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_SALES_ORDER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_SALES_ORDER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_SALES_ORDER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_SALES_ORDER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_SALES_ORDER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_SALES_ORDER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_SALES_ORDER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_SALES_ORDER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_SALES_ORDER);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_SALES_ORDER, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_SALES_ORDER + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_SALES_ORDER_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_SALES_ORDER_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_SALES_ORDER_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_SALES_ORDER_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_SALES_ORDER_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_SALES_ORDER_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_SALES_ORDER_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_SALES_ORDER_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_SALES_ORDER_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_SALES_ORDER_DTL);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_SALES_ORDER_DTL, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_SALES_ORDER_DTL + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_SKU_INVENTORY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_SKU_INVENTORY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_SKU_INVENTORY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_SKU_INVENTORY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_SKU_INVENTORY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_SKU_INVENTORY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_SKU_INVENTORY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_SKU_INVENTORY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_SKU_INVENTORY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_SKU_INVENTORY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_SKU_INVENTORY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_SKU_INVENTORY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SEARCH_SKU_TRACE_WF);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SEARCH_SKU_TRACE_WF, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SEARCH_SKU_TRACE_WF + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.CREATE_SKU_TRACE_WF);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.CREATE_SKU_TRACE_WF, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.CREATE_SKU_TRACE_WF + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.EDIT_SKU_TRACE_WF);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.EDIT_SKU_TRACE_WF, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.EDIT_SKU_TRACE_WF + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_SKU_TRACE_WF);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_SKU_TRACE_WF, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_SKU_TRACE_WF + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.SAVE_ENTITY_INFRASTRUCTURE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.SAVE_ENTITY_INFRASTRUCTURE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.SAVE_ENTITY_INFRASTRUCTURE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.GET_ENTITY_INFRA_PROPERTIES);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.GET_ENTITY_INFRA_PROPERTIES, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.GET_ENTITY_INFRA_PROPERTIES + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		consumer = vertx.eventBus().consumer(QboxAddressConstants.UPDATE_ENTITY_INFRASTRUCTURE);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.UPDATE_ENTITY_INFRASTRUCTURE, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.UPDATE_ENTITY_INFRASTRUCTURE + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(QboxAddressConstants.UPLOAD_ORDER_CSV);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.UPLOAD_ORDER_CSV, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.UPLOAD_ORDER_CSV
									+ " error " + handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(QboxAddressConstants.GET_PURCHASE_ORDERS_DASHBOARD);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.GET_PURCHASE_ORDERS_DASHBOARD, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.GET_PURCHASE_ORDERS_DASHBOARD + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS_V2);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS_V2, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.GET_HOTBOX_CURRENT_STATUS_V2 + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(QboxAddressConstants.DELETE_ENTITY_INFRA_BY_ID);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.DELETE_ENTITY_INFRA_BY_ID, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.DELETE_ENTITY_INFRA_BY_ID + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		consumer = vertx.eventBus().consumer(QboxAddressConstants.PROCESS_ORDER_DELIVERY);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					QboxAddressConstants.PROCESS_ORDER_DELIVERY, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
							

						} else {
							log.error("ConsumerVerticle " + QboxAddressConstants.PROCESS_ORDER_DELIVERY + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		super.start();
	}
}
