package com.swomb.qbox.fileupload;

import com.swomb.qbox.common.AppRestAPIBaseVerticle;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;

public class MainVerticle extends AppRestAPIBaseVerticle {

	Logger log = LoggerFactory.getLogger(MainVerticle.class.getName());

	public void start() throws Exception {

		super.start();

		DeploymentOptions options = new DeploymentOptions();
		
//		String applicationModule = config().getString("module");
//		
//		ConfigStoreOptions httpStore = new ConfigStoreOptions().setType("http")
//				.setConfig(new JsonObject().put("host", config().getString("host"))
//						.put("port", config().getInteger("port")).put("ssl", config().getBoolean("ssl"))
//						.put("verifyHost", false).put("trustAll", true)
//						.put("path",
//								config().getString("path") + "?module=" + applicationModule));
//
//		ConfigRetrieverOptions configOptions = new ConfigRetrieverOptions().addStore(httpStore);
//		configOptions.setScanPeriod(365 * 24 * 60 * 60 * 1000);
//
//		ConfigRetriever retriever = ConfigRetriever.create(vertx, configOptions);
//
//		retriever.getConfig(ar -> {
//			if (ar.failed()) {
//				log.error("Error in Configuration Loading");
//				log.info(ar.cause());
//			} else {
//				log.info("Configuration Loading Success");
//				JsonObject configObject = ar.result();
//				options.setConfig(configObject.getJsonObject(applicationModule));
//				try {
//						HashMap<Long, CryptoEngine> vendorCryptoMap = Crypto.getVendorCryptoHub();
//						CryptoDataEntity dataEntity = new CryptoDataEntity(configObject.getJsonObject("crypto"));
//						CryptoEngine engine = new CryptoEngine(dataEntity);
//						vendorCryptoMap.put(0L, engine);
//
//						options.setInstances(Runtime.getRuntime().availableProcessors());
//						vertx.rxDeployVerticle(ServerVerticle.class.getName(), options).subscribe();
//
//					log.info("MainVerticle started");
//
//				} catch (Exception e) {
//					e.printStackTrace();
//				}
//			}
//		});
		
		try {

			options.setInstances(Runtime.getRuntime().availableProcessors());
			vertx.rxDeployVerticle(ServerVerticle.class.getName(), options).subscribe();
			log.info("MainVerticle started");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
