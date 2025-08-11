package com.swomb.qbox.cron;

import org.json.simple.JSONArray;

import com.swomb.qbox.DBManagerVerticle;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonObject;

public class CronVerticle extends DBManagerVerticle {

	Logger log = LoggerFactory.getLogger(CronVerticle.class.getName());

	public static JSONArray schemaList = new JSONArray();

	@SuppressWarnings("unchecked")
	public void start() throws Exception {
		log.info("DbCronVerticle started");
		super.start();

		schemaList = new JSONArray();

		executeSchemaQuery(schemaHandler -> {
			schemaList = schemaHandler.result();
		});

		vertx.setPeriodic(1000, handler -> {

			schemaList.forEach(schema -> {
				JsonObject obj = new JsonObject(schema.toString());
				executeAutoSleepPushQuery(obj.getString("vendor_schema"), autoSleepHandler -> {
					if (autoSleepHandler.succeeded()) {
					} else {
						log.info("Cron Failing");
					}
				});
			});
		});
		
		vertx.setPeriodic(100000, handler -> {
			executeSchemaQuery(schemaHandler -> {
				schemaList = schemaHandler.result();
			});
		});
	}

	private void executeSchemaQuery(Handler<AsyncResult<JSONArray>> handler) {

		String query = " Select vendor_schema from schema_master.vendor_schema;";

		runQuery(query, resultHandler -> {
			if (resultHandler.succeeded()) {
				handler.handle(Future.succeededFuture(resultHandler.result()));
			} else {
				log.info("Failure: " + resultHandler.cause().getMessage());
				handler.handle(Future.failedFuture(resultHandler.cause()));
			}
		});
	}

	private void executeAutoSleepPushQuery(String schemaName, Handler<AsyncResult<JSONArray>> handler) {

		
		String query = "update " + schemaName
				+ ".digital_id set status=false, awake_expiry_time = null where awake_expiry_time < current_timestamp ";

		log.info("query : "+query);
		
		runQuery(query, resultHandler -> {
			if (resultHandler.succeeded()) {
				handler.handle(Future.succeededFuture(resultHandler.result()));
			} else {
				log.info("Failure: " + resultHandler.cause().getMessage());
				handler.handle(Future.failedFuture(resultHandler.cause()));
			}
		});
	}

}