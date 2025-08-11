package com.swomb.boot;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.reactivex.core.AbstractVerticle;

public class MainVerticle extends AbstractVerticle {

	Logger log = LoggerFactory.getLogger(MainVerticle.class.getName());

	public void start() throws Exception {

		super.start();
		
		DeploymentOptions options = new DeploymentOptions();
		options.setConfig(config());
		//options.setInstances(Runtime.getRuntime().availableProcessors()).setConfig(config());
		vertx.rxDeployVerticle(ServerVerticle.class.getName(), options).subscribe();
	}
}
