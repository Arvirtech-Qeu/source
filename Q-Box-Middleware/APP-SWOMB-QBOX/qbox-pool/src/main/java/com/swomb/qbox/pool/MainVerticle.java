package com.swomb.qbox.pool;

import com.swomb.qbox.DBManagerVerticle;
import com.swomb.qbox.common.AppRestAPIBaseVerticle;
import com.swomb.qbox.common.util.ConfigConstants;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;

public class MainVerticle extends AppRestAPIBaseVerticle {

	Logger log = LoggerFactory.getLogger(MainVerticle.class.getName());

	public void start() throws Exception {

		super.start();
		DeploymentOptions options = new DeploymentOptions();
//		WebClientOptions wcOptions = new WebClientOptions();
//		wcOptions.setVerifyHost(false).setTrustAll(true);
//		client = WebClient.create(vertx, wcOptions);
//		DeploymentOptions options = new DeploymentOptions();
//
//		ConfigStoreOptions httpStore = new ConfigStoreOptions().setType("http")
//				.setConfig(new JsonObject().put("host", config().getString("host"))
//						.put("port", config().getInteger("port")).put("ssl", config().getBoolean("ssl"))
//						.put("verifyHost", false).put("trustAll", true).put("path",
//								config().getString("path") + "?envSno=" + config().getInteger("envSno")
//										+ "&serviceSno=" + config().getInteger("serviceSno") + "&microServiceSno="
//										+ config().getInteger("microServiceSno")));
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
//				options.setConfig(configObject);
//				CryptoEngine cryptoEngine = null;
		try {

			options.setInstances(1);

			vertx.rxDeployVerticle(DBManagerVerticle.class.getName(), options).subscribe();
			vertx.rxDeployVerticle(ServerVerticle.class.getName(), options).subscribe();
			vertx.rxDeployVerticle(ConsumerVerticle.class.getName(), options).subscribe();

			log.info("MainVerticle started");

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	// });
	// }
}
