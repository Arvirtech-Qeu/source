package com.swomb.qbox.cron;

import java.util.HashMap;

import com.swomb.qbox.DBManagerVerticle;
import com.swomb.qbox.common.AppRestAPIBaseVerticle;
import com.swomb.qbox.common.util.ConfigConstants;
import com.swomb.qbox.crypto.Crypto;
import com.swomb.qbox.crypto.CryptoDataEntity;
import com.swomb.qbox.crypto.CryptoEngine;

import io.vertx.config.ConfigRetrieverOptions;
import io.vertx.config.ConfigStoreOptions;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.WebClientOptions;
import io.vertx.reactivex.config.ConfigRetriever;
import io.vertx.reactivex.ext.web.client.WebClient;

public class MainVerticle extends AppRestAPIBaseVerticle {

	Logger log = LoggerFactory.getLogger(MainVerticle.class.getName());

	public static String DEPLOYMENT_TYPE = "s";
	public static Long VENDOR_SNO;
	
	public void start() throws Exception {

		super.start();

		WebClientOptions wcOptions = new WebClientOptions();

		wcOptions.setVerifyHost(false).setTrustAll(true);
		client = WebClient.create(vertx, wcOptions);
		DeploymentOptions options = new DeploymentOptions();
		
		
		String uri = config().getString("path") + "?envSno=" + config().getInteger("envSno")
				+ "&serviceSno=" + config().getInteger("serviceSno") + "&microServiceSno="
				+ config().getInteger("microServiceSno");
		
		processWebClientGetRequest(config().getInteger("port"),
				config().getString("host"), uri, config().getBoolean("ssl"),
				wcHandler -> {
					JsonObject configObject = wcHandler.result();
					System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"+configObject.encodePrettily());
				});
		

		ConfigStoreOptions httpStore = new ConfigStoreOptions().setType("http")
				.setConfig(new JsonObject().put("host", config().getString("host"))
						.put("verifyHost", false).put("trustAll", true)
						.put("port", config().getInteger("port")).put("ssl", config().getBoolean("ssl")).put("path",
								config().getString("path") + "?envSno=" + config().getInteger("envSno")
										+ "&serviceSno=" + config().getInteger("serviceSno") + "&microServiceSno="
										+ config().getInteger("microServiceSno")));

		ConfigRetrieverOptions configOptions = new ConfigRetrieverOptions().addStore(httpStore);
		configOptions.setScanPeriod(365 * 24 * 60 * 60 * 1000);

		ConfigRetriever retriever = ConfigRetriever.create(vertx, configOptions);

		retriever.getConfig(ar -> {
			if (ar.failed()) {
				log.error("Error in Configuration Loading");
				log.info(ar.cause());
			} else {
				JsonObject configObject = ar.result();
				options.setConfig(configObject);
			//	CryptoEngine cryptoEngine = null;
				try {
//					CryptoDataEntity cryptoEntity = new CryptoDataEntity(0L,
//							configObject.getString(ConfigConstants.KEYSTORE_FILE_NAME_KEY), "",
//							configObject.getString(ConfigConstants.MASTER_KEY_FILE_NAME_KEY),
//							configObject.getString(ConfigConstants.FILE_KEY_PASSWORD_KEY),
//							configObject.getString(ConfigConstants.FILE_KEY_ALIAS_NAME_KEY),
//							configObject.getString(ConfigConstants.CRYPTOGRAPHY_ALGORITHM_KEY),
//							configObject.getString(ConfigConstants.KEYSTORE_TYPE_KEY));
//
//					cryptoEngine = new CryptoEngine(cryptoEntity);

					HashMap<Long, CryptoEngine> deploymentCryptoMap = Crypto.getDeploymentCryptoHub();

					DEPLOYMENT_TYPE = config().getString("deploymentType");
					VENDOR_SNO = config().getLong("clientSno");
					
					log.info("DEPLOYMENT_TYPE : "+DEPLOYMENT_TYPE);
					log.info("VENDOR_SNO : "+VENDOR_SNO);
					
					
					// deploymentCryptoMap.put(0L, cryptoEngine);

					JsonObject cryptoRequestObject = new JsonObject();
					
					if(DEPLOYMENT_TYPE!=null && DEPLOYMENT_TYPE.equals("o") && VENDOR_SNO!=null) {
						cryptoRequestObject.put("cryptoDataSno", VENDOR_SNO);
					}

					processWebClientPostRequest(cryptoRequestObject, config().getInteger("port"),
							config().getString("host"), "/api/get_crypto_list", config().getBoolean("ssl"),
							wcHandler -> {

								if (wcHandler.succeeded()) {

									JsonArray cryptoArray = wcHandler.result().getJsonArray("data");

									if (cryptoArray != null) {
										cryptoArray.forEach(cryptoDataObject -> {
											try {
												CryptoDataEntity dataEntity = new CryptoDataEntity(
														(JsonObject) cryptoDataObject);
												CryptoEngine engine = new CryptoEngine(dataEntity);
												deploymentCryptoMap.put(dataEntity.getDeploymentSno(), engine);

											} catch (Exception e) {
												// TODO Auto-generated catch block
												e.printStackTrace();
											}
										});

										// options.setInstances(Runtime.getRuntime().availableProcessors()).setConfig(config);

										vertx.rxDeployVerticle(DBManagerVerticle.class.getName(),
												options.setConfig(options.getConfig())).subscribe();
										vertx.rxDeployVerticle(CronVerticle.class.getName(),
												options.setConfig(options.getConfig())).subscribe();

										log.info("MainVerticle started");
									} else {
										log.error("MainVerticle fetch_crypto_list NULL " + " error " + wcHandler.cause());
									}
								} else {
									log.error("MainVerticle fetch_crypto_list " + " error " + wcHandler.cause());
								}
							});

				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		});
	}
}
