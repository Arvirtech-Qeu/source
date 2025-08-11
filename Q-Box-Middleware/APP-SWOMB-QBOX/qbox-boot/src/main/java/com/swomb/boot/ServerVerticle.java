package com.swomb.boot;

import java.util.HashMap;
import java.util.Map;

import com.swomb.qbox.common.AppRestAPIBaseVerticle;
import com.swomb.qbox.common.util.AddressConstants;
import com.swomb.qbox.crypto.Crypto;
import com.swomb.qbox.crypto.CryptoDataEntity;
import com.swomb.qbox.crypto.CryptoEngine;

import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.json.schema.SchemaRouterOptions;
import io.vertx.reactivex.core.http.HttpServer;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.handler.BodyHandler;
import io.vertx.reactivex.ext.web.handler.StaticHandler;
import io.vertx.reactivex.json.schema.Schema;
import io.vertx.reactivex.json.schema.SchemaParser;
import io.vertx.reactivex.json.schema.SchemaRouter;

public class ServerVerticle extends AppRestAPIBaseVerticle {

	Logger log = LoggerFactory.getLogger(MainVerticle.class.getName());

	private HttpServer httpServer;

	SchemaParser schemaParser;
	Schema schema;

	@Override
	public void start() throws Exception {
		// TODO Auto-generated method stub
		super.start();

		log.info("SVPOU Server Verticle Started");

		SchemaRouter schemaRouter = SchemaRouter.create(vertx, new SchemaRouterOptions());
		schemaParser = SchemaParser.createDraft201909SchemaParser(schemaRouter);

		final Router router = Router.router(vertx);
		enableCorsSupport(router);

		router.route("/assets/*").handler(StaticHandler.create("assets"));
		router.route(AddressConstants.API_PREFIX + "*").handler(BodyHandler.create());

		HashMap<Long, CryptoEngine> deploymentCryptoMap = Crypto.getDeploymentCryptoHub();

		router.get(AddressConstants.API_PREFIX + AddressConstants.SERVICE_HEALTH).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				data.put("service", "success");
				data.put("config", "success");
				processSuccessResponse(routingContext, data, AddressConstants.SERVICE_HEALTH);
			} catch (Exception e) {
				processException(e, routingContext, AddressConstants.SERVICE_HEALTH);
			}
		});

		router.post(AddressConstants.API_PREFIX + AddressConstants.GET_DEPLOYMENT_CRYPTO_DATA)
				.handler(routingContext -> {
					try {

						JsonObject returnObject = new JsonObject();

						if (getDeployentCryptoMap() != null) {

							JsonArray array = new JsonArray();

							for (Map.Entry<Long, JsonObject> entry : getDeployentCryptoMap().entrySet()) {
								array.add(entry.getValue());
							}

							returnObject.put("data", array);
							routingContext.response().end(returnObject.encodePrettily());
						} else
						{
							returnObject = new JsonObject();
							routingContext.response().end(returnObject.encodePrettily());
						}

						
					} catch (Exception e) {
						processException(e, routingContext, AddressConstants.GET_DEPLOYMENT_CRYPTO_DATA);
					}
				});

		router.post(AddressConstants.API_PREFIX + AddressConstants.SYNC_DEPLOYMENT_CRYPTO_DATA)
				.handler(routingContext -> {

					Long deploymentSno = 0L;

					try {
						JsonObject obj = routingContext.getBodyAsJson();

						JsonArray cryptoArray = obj.getJsonArray("data");

						for (Object object : cryptoArray) {

							JsonObject jSon = (JsonObject) object;
							deploymentSno = jSon.getLong("deploymentSno");
							getDeployentCryptoMap().put(jSon.getLong("deploymentSno"), jSon);
						}

						log.info(obj.getJsonArray("data"));

						if (cryptoArray != null) {
							cryptoArray.forEach(cryptoDataObject -> {
								try {
									CryptoDataEntity dataEntity = new CryptoDataEntity((JsonObject) cryptoDataObject);
									CryptoEngine engine = new CryptoEngine(dataEntity);
									deploymentCryptoMap.put(0L, engine);

									/*
									 * System.out.println("9000-"+Crypto.encryptData( "9000"));
									 * System.out.println("9001-"+Crypto.encryptData( "9001"));
									 * System.out.println("9002-"+Crypto.encryptData( "9002"));
									 * System.out.println("9003-"+Crypto.encryptData( "9003"));
									 * System.out.println("9002-"+Crypto.encryptData( "9004"));
									 * System.out.println("9002-"+Crypto.encryptData( "9005"));
									 * System.out.println("9002-"+Crypto.encryptData( "9006"));
									 * System.out.println("9002-"+Crypto.encryptData( "9007"));
									 * System.out.println("9002-"+Crypto.encryptData( "9008"));
									 * System.out.println("9002-"+Crypto.encryptData( "9009"));
									 * System.out.println("9002-"+Crypto.encryptData( "9010"));
									 * System.out.println("9002-"+Crypto.encryptData( "9011"));
									 * System.out.println("9002-"+Crypto.encryptData( "9012"));
									 * System.out.println("9002-"+Crypto.encryptData( "9013"));
									 * System.out.println("5432-"+Crypto.encryptData( "5432"));
									 * System.out.println("qbox_db-"+Crypto.encryptData( "qbox_db"));
									 * System.out.println("qbox_admin-"+Crypto.encryptData( "qbox_admin"));
									 * System.out.println("qbox@123-"+Crypto.encryptData( "qbox@123"));
									 * System.out.println("20000-"+Crypto.encryptData( "20000"));
									 * System.out.println("localhost-"+Crypto.encryptData( "localhost"));
									 */

								} catch (Exception e) {
									// TODO Auto-generated catch block
									e.printStackTrace();
								}
							});
						}

						if (cryptoArray != null) {
							routingContext.response().end("{\"status\":\"success\"}");
						} else {
							routingContext.response().end("{\"status\":\"failure\"}");
						}
					} catch (Exception e) {
						processException(e, routingContext, AddressConstants.SYNC_DEPLOYMENT_CRYPTO_DATA);
					}
				});

		router.post(AddressConstants.API_PREFIX + AddressConstants.SYNC_DEPLOYMENT_CONFIG).handler(routingContext -> {
			try {
				JsonObject requestObject = routingContext.getBodyAsJson();
				
				System.out.println(requestObject.encodePrettily());
				
				
				JsonArray configArray = requestObject.getJsonArray("data");
				JsonArray keysArray = requestObject.getJsonArray("keys");
				for (int i = 0; i < keysArray.size(); i++) {
					JsonObject innerKeysObject = (JsonObject) keysArray.getValue(i);

					for (int j = 0; j < configArray.size(); j++) {
						JsonObject innerConfigsObject = (JsonObject) configArray.getValue(j);

						if (innerConfigsObject.containsKey(innerKeysObject.getString("key"))) {
							storeConfigInCache("env"+innerKeysObject.getString("key"),
									innerConfigsObject.getJsonObject(innerKeysObject.getString("key")));
						}
					}
				}
				routingContext.response().end("{\"status\":\"success\"}");

			} catch (Exception e) {
				processException(e, routingContext, AddressConstants.SYNC_DEPLOYMENT_CONFIG);
			}
		});

		router.get(AddressConstants.API_PREFIX + AddressConstants.GET_DEPLOYMENT_CONFIG).handler(routingContext -> {
			try {

				JsonObject configObject = new JsonObject();
				String configKey = "env" + (routingContext.request().getParam("deploymentSno"))+ (routingContext.request().getParam("serviceSno"));

				if (getConfigfromCache().get(configKey) != null) {
					configObject = deploymentConfigMap.get(configKey);
				}

				routingContext.response().end(configObject.encodePrettily());
			} catch (Exception e) {
				processException(e, routingContext, AddressConstants.GET_DEPLOYMENT_CONFIG);
			}
		});

		String serverIP = "localhost";

		this.httpServer = vertx.createHttpServer();
		int portNo = 8899;
		if (this.httpServer != null && portNo > 0) {
			this.httpServer.requestHandler(router).requestStream().toFlowable().subscribe();
			this.httpServer.rxListen(portNo, serverIP);
			this.httpServer.requestHandler(router).rxListen(portNo).subscribe();
		}

		log.info("Server Verticle Deployed");
	}

	public void storeConfigInCache(String key, JsonObject value) {
		
		if (deploymentConfigMap != null) {
			deploymentConfigMap.put(key, value);
		} else {
			deploymentConfigMap = new HashMap<String, JsonObject>();
			deploymentConfigMap.put(key, value);
		}
	}

	public static Map<String, JsonObject> getConfigfromCache() {
		if (deploymentConfigMap == null) {
			deploymentConfigMap = new HashMap<String, JsonObject>();
		}
		return deploymentConfigMap;
	}

	public static Map<Long, JsonObject> getDeployentCryptoMap() {
		if (deployentCryptoMap == null) {
			deployentCryptoMap = new HashMap<Long, JsonObject>();
		}
		return deployentCryptoMap;
	}

}
