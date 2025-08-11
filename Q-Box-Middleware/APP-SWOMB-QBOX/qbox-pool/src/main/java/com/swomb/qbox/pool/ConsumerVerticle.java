package com.swomb.qbox.pool;

import com.swomb.qbox.DBManagerVerticle;
import com.swomb.qbox.common.util.Constants;
import com.swomb.qbox.pool.util.MastersAddressConstants;

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

		consumer = vertx.eventBus().consumer(MastersAddressConstants.PROCESS_ETL_JOB_V4);
		consumer.handler(message -> {
			runQuery(message.body().getString(Constants.QUERY), message.body().getJsonObject(Constants.DATA),
					MastersAddressConstants.PROCESS_ETL_JOB_V4, handler -> {
						if (handler.succeeded()) {
							message.reply(succesPostHandler(handler.result()));
						} else {
							log.error("ConsumerVerticle " + MastersAddressConstants.PROCESS_ETL_JOB_V4 + " error "
									+ handler.cause());
							message.reply(errorJSON(handler.cause().toString()));
						}
					});
		});
		
		super.start();
	}
}
