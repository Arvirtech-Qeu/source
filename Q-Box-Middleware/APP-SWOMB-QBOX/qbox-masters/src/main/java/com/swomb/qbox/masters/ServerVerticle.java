package com.swomb.qbox.masters;

import java.util.HashSet;
import java.util.Set;

import com.swomb.qbox.common.AppRestAPIBaseVerticle;
import com.swomb.qbox.masters.util.MastersAddressConstants;
import com.swomb.qbox.common.util.Constants;
import com.swomb.qbox.common.util.HttpConstants;
import com.swomb.qbox.masters.util.SqlQueries;
import com.swomb.qbox.process.PreProcessor;
import com.swomb.qbox.process.builder.PreProcessBuilder;

import io.vertx.core.http.HttpMethod;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonObject;
import io.vertx.json.schema.SchemaRouterOptions;
import io.vertx.reactivex.core.http.HttpServer;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.handler.BodyHandler;
import io.vertx.reactivex.ext.web.handler.CorsHandler;
import io.vertx.reactivex.ext.web.handler.StaticHandler;
import io.vertx.reactivex.json.schema.Schema;
import io.vertx.reactivex.json.schema.SchemaParser;
import io.vertx.reactivex.json.schema.SchemaRouter;

public class ServerVerticle extends AppRestAPIBaseVerticle {

	Logger log = LoggerFactory.getLogger(MainVerticle.class.getName());

	private HttpServer httpServer;

	SchemaParser schemaParser;
	Schema schema;

	public static String DB_SCHEMA = Constants.DEFAULT_SCHEMA;

	@Override
	public void start() throws Exception {
		// TODO Auto-generated method stub

		Router router = Router.router(vertx);

		Set<String> allowHeaders = new HashSet<>();
		allowHeaders.add(HttpConstants.HTTP_HEADER_X_REQUESTED_WITH);
		allowHeaders.add(HttpConstants.HTTP_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN);
		allowHeaders.add(HttpConstants.HTTP_HEADER_ORIGIN);
		allowHeaders.add(HttpConstants.HTTP_HEADER_CONTENT_TYPE);
		allowHeaders.add(HttpConstants.HTTP_HEADER_ACCEPT);
		allowHeaders.add(HttpConstants.HTTP_HEADER_AUTHORIZATION);
		Set<HttpMethod> allowMethods = new HashSet<>();
		allowMethods.add(HttpMethod.GET);
		allowMethods.add(HttpMethod.PUT);
		allowMethods.add(HttpMethod.OPTIONS);
		allowMethods.add(HttpMethod.POST);
		allowMethods.add(HttpMethod.DELETE);
		allowMethods.add(HttpMethod.PATCH);

		CorsHandler corsHandler = CorsHandler.create("*").allowedHeader("*").allowedMethods(allowMethods);

		router.route().handler(corsHandler);

		SchemaRouter schemaRouter = SchemaRouter.create(vertx, new SchemaRouterOptions());
		schemaParser = SchemaParser.createDraft201909SchemaParser(schemaRouter);

		router.route("/assets/*").handler(StaticHandler.create("assets"));
		router.route(MastersAddressConstants.API_PREFIX + "*").handler(BodyHandler.create());

		router.get(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SERVICE_HEALTH)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								PreProcessor.doProcess(data,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.SERVICE_HEALTH)),
								MastersAddressConstants.SERVICE_HEALTH, SqlQueries.SERVICE_HEALTH);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SERVICE_HEALTH);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_ADDRESS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.SEARCH_ADDRESS)),
								MastersAddressConstants.SEARCH_ADDRESS, SqlQueries.SEARCH_ADDRESS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_ADDRESS);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_ADDRESS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.CREATE_ADDRESS)),
								MastersAddressConstants.CREATE_ADDRESS, SqlQueries.CREATE_ADDRESS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_ADDRESS);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_ADDRESS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.EDIT_ADDRESS)),
								MastersAddressConstants.EDIT_ADDRESS, SqlQueries.EDIT_ADDRESS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_ADDRESS);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_ADDRESS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.DELETE_ADDRESS)),
								MastersAddressConstants.DELETE_ADDRESS, SqlQueries.DELETE_ADDRESS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_ADDRESS);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_AREA)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.SEARCH_AREA)),
								MastersAddressConstants.SEARCH_AREA, SqlQueries.SEARCH_AREA);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_AREA);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_AREA)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.CREATE_AREA)),
								MastersAddressConstants.CREATE_AREA, SqlQueries.CREATE_AREA);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_AREA);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_AREA).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(MastersAddressConstants.EDIT_AREA)),
						MastersAddressConstants.EDIT_AREA, SqlQueries.EDIT_AREA);
			} catch (Exception e) {
				processException(e, routingContext, MastersAddressConstants.EDIT_AREA);
			}
		});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_AREA)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.DELETE_AREA)),
								MastersAddressConstants.DELETE_AREA, SqlQueries.DELETE_AREA);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_AREA);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_CITY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.SEARCH_CITY)),
								MastersAddressConstants.SEARCH_CITY, SqlQueries.SEARCH_CITY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_CITY);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_CITY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.CREATE_CITY)),
								MastersAddressConstants.CREATE_CITY, SqlQueries.CREATE_CITY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_CITY);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_CITY).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(MastersAddressConstants.EDIT_CITY)),
						MastersAddressConstants.EDIT_CITY, SqlQueries.EDIT_CITY);
			} catch (Exception e) {
				processException(e, routingContext, MastersAddressConstants.EDIT_CITY);
			}
		});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_CITY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.DELETE_CITY)),
								MastersAddressConstants.DELETE_CITY, SqlQueries.DELETE_CITY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_CITY);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_CODES_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.SEARCH_CODES_DTL)),
								MastersAddressConstants.SEARCH_CODES_DTL, SqlQueries.SEARCH_CODES_DTL);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_CODES_DTL);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_CODES_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.CREATE_CODES_DTL)),
								MastersAddressConstants.CREATE_CODES_DTL, SqlQueries.CREATE_CODES_DTL);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_CODES_DTL);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_CODES_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.EDIT_CODES_DTL)),
								MastersAddressConstants.EDIT_CODES_DTL, SqlQueries.EDIT_CODES_DTL);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_CODES_DTL);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_CODES_DTL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.DELETE_CODES_DTL)),
								MastersAddressConstants.DELETE_CODES_DTL, SqlQueries.DELETE_CODES_DTL);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_CODES_DTL);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_CODES_HDR)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.SEARCH_CODES_HDR)),
								MastersAddressConstants.SEARCH_CODES_HDR, SqlQueries.SEARCH_CODES_HDR);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_CODES_HDR);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_CODES_HDR)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.CREATE_CODES_HDR)),
								MastersAddressConstants.CREATE_CODES_HDR, SqlQueries.CREATE_CODES_HDR);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_CODES_HDR);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_CODES_HDR)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.EDIT_CODES_HDR)),
								MastersAddressConstants.EDIT_CODES_HDR, SqlQueries.EDIT_CODES_HDR);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_CODES_HDR);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_CODES_HDR)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.DELETE_CODES_HDR)),
								MastersAddressConstants.DELETE_CODES_HDR, SqlQueries.DELETE_CODES_HDR);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_CODES_HDR);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_COUNTRY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.SEARCH_COUNTRY)),
								MastersAddressConstants.SEARCH_COUNTRY, SqlQueries.SEARCH_COUNTRY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_COUNTRY);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_COUNTRY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.CREATE_COUNTRY)),
								MastersAddressConstants.CREATE_COUNTRY, SqlQueries.CREATE_COUNTRY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_COUNTRY);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_COUNTRY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.EDIT_COUNTRY)),
								MastersAddressConstants.EDIT_COUNTRY, SqlQueries.EDIT_COUNTRY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_COUNTRY);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_COUNTRY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.DELETE_COUNTRY)),
								MastersAddressConstants.DELETE_COUNTRY, SqlQueries.DELETE_COUNTRY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_COUNTRY);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.SEARCH_DELIVERY_PARTNER)),
								MastersAddressConstants.SEARCH_DELIVERY_PARTNER, SqlQueries.SEARCH_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_DELIVERY_PARTNER);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.CREATE_DELIVERY_PARTNER)),
								MastersAddressConstants.CREATE_DELIVERY_PARTNER, SqlQueries.CREATE_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_DELIVERY_PARTNER);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.EDIT_DELIVERY_PARTNER)),
								MastersAddressConstants.EDIT_DELIVERY_PARTNER, SqlQueries.EDIT_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_DELIVERY_PARTNER);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_DELIVERY_PARTNER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.DELETE_DELIVERY_PARTNER)),
								MastersAddressConstants.DELETE_DELIVERY_PARTNER, SqlQueries.DELETE_DELIVERY_PARTNER);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_DELIVERY_PARTNER);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.SEARCH_FOOD_SKU)),
								MastersAddressConstants.SEARCH_FOOD_SKU, SqlQueries.SEARCH_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_FOOD_SKU);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.CREATE_FOOD_SKU)),
								MastersAddressConstants.CREATE_FOOD_SKU, SqlQueries.CREATE_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_FOOD_SKU);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.EDIT_FOOD_SKU)),
								MastersAddressConstants.EDIT_FOOD_SKU, SqlQueries.EDIT_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_FOOD_SKU);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.DELETE_FOOD_SKU)),
								MastersAddressConstants.DELETE_FOOD_SKU, SqlQueries.DELETE_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_FOOD_SKU);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_PARTNER_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.SEARCH_PARTNER_FOOD_SKU)),
								MastersAddressConstants.SEARCH_PARTNER_FOOD_SKU, SqlQueries.SEARCH_PARTNER_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_PARTNER_FOOD_SKU);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_PARTNER_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.CREATE_PARTNER_FOOD_SKU)),
								MastersAddressConstants.CREATE_PARTNER_FOOD_SKU, SqlQueries.CREATE_PARTNER_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_PARTNER_FOOD_SKU);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_PARTNER_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.EDIT_PARTNER_FOOD_SKU)),
								MastersAddressConstants.EDIT_PARTNER_FOOD_SKU, SqlQueries.EDIT_PARTNER_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_PARTNER_FOOD_SKU);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_PARTNER_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.DELETE_PARTNER_FOOD_SKU)),
								MastersAddressConstants.DELETE_PARTNER_FOOD_SKU, SqlQueries.DELETE_PARTNER_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_PARTNER_FOOD_SKU);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_RESTAURANT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.SEARCH_RESTAURANT)),
								MastersAddressConstants.SEARCH_RESTAURANT, SqlQueries.SEARCH_RESTAURANT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_RESTAURANT);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_RESTAURANT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.CREATE_RESTAURANT)),
								MastersAddressConstants.CREATE_RESTAURANT, SqlQueries.CREATE_RESTAURANT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_RESTAURANT);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_RESTAURANT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.EDIT_RESTAURANT)),
								MastersAddressConstants.EDIT_RESTAURANT, SqlQueries.EDIT_RESTAURANT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_RESTAURANT);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_RESTAURANT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.DELETE_RESTAURANT)),
								MastersAddressConstants.DELETE_RESTAURANT, SqlQueries.DELETE_RESTAURANT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_RESTAURANT);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_RESTAURANT_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.SEARCH_RESTAURANT_FOOD_SKU)),
								MastersAddressConstants.SEARCH_RESTAURANT_FOOD_SKU,
								SqlQueries.SEARCH_RESTAURANT_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_RESTAURANT_FOOD_SKU);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_RESTAURANT_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.CREATE_RESTAURANT_FOOD_SKU)),
								MastersAddressConstants.CREATE_RESTAURANT_FOOD_SKU,
								SqlQueries.CREATE_RESTAURANT_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_RESTAURANT_FOOD_SKU);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_RESTAURANT_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.EDIT_RESTAURANT_FOOD_SKU)),
								MastersAddressConstants.EDIT_RESTAURANT_FOOD_SKU, SqlQueries.EDIT_RESTAURANT_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_RESTAURANT_FOOD_SKU);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_RESTAURANT_FOOD_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.DELETE_RESTAURANT_FOOD_SKU)),
								MastersAddressConstants.DELETE_RESTAURANT_FOOD_SKU,
								SqlQueries.DELETE_RESTAURANT_FOOD_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_RESTAURANT_FOOD_SKU);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_STATE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.SEARCH_STATE)),
								MastersAddressConstants.SEARCH_STATE, SqlQueries.SEARCH_STATE);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_STATE);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_STATE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.CREATE_STATE)),
								MastersAddressConstants.CREATE_STATE, SqlQueries.CREATE_STATE);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_STATE);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_STATE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(MastersAddressConstants.EDIT_STATE)),
						MastersAddressConstants.EDIT_STATE, SqlQueries.EDIT_STATE);
			} catch (Exception e) {
				processException(e, routingContext, MastersAddressConstants.EDIT_STATE);
			}
		});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_STATE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.DELETE_STATE)),
								MastersAddressConstants.DELETE_STATE, SqlQueries.DELETE_STATE);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_STATE);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_ENUM).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						PreProcessor.doProcess(inputJson,
								PreProcessBuilder.getPreProcessList(MastersAddressConstants.GET_ENUM)),
						MastersAddressConstants.GET_ENUM, SqlQueries.GET_ENUM);
			} catch (Exception e) {
				processException(e, routingContext, MastersAddressConstants.GET_ENUM);
			}
		});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_ETL_JOB)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.SEARCH_ETL_JOB)),
								MastersAddressConstants.SEARCH_ETL_JOB, SqlQueries.SEARCH_ETL_JOB);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_ETL_JOB);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_ETL_TABLE_COLUMN)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.SEARCH_ETL_TABLE_COLUMN)),
								MastersAddressConstants.SEARCH_ETL_TABLE_COLUMN, SqlQueries.SEARCH_ETL_TABLE_COLUMN);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_ETL_TABLE_COLUMN);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_ORDER_ETL_HDR)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.SEARCH_ORDER_ETL_HDR)),
								MastersAddressConstants.SEARCH_ORDER_ETL_HDR, SqlQueries.SEARCH_ORDER_ETL_HDR);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_ORDER_ETL_HDR);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_ETL_TABLE_COLUMN)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.CREATE_ETL_TABLE_COLUMN)),
								MastersAddressConstants.CREATE_ETL_TABLE_COLUMN, SqlQueries.CREATE_ETL_TABLE_COLUMN);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_ETL_TABLE_COLUMN);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_ETL_TABLE_COLUMN)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.EDIT_ETL_TABLE_COLUMN)),
								MastersAddressConstants.EDIT_ETL_TABLE_COLUMN, SqlQueries.EDIT_ETL_TABLE_COLUMN);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_ETL_TABLE_COLUMN);
					}
				});
		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_ORDER_ETL_HDR)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.EDIT_ORDER_ETL_HDR)),
								MastersAddressConstants.EDIT_ORDER_ETL_HDR, SqlQueries.EDIT_ORDER_ETL_HDR);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_ORDER_ETL_HDR);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_ETL_TABLE_COLUMN)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.DELETE_ETL_TABLE_COLUMN)),
								MastersAddressConstants.DELETE_ETL_TABLE_COLUMN, SqlQueries.DELETE_ETL_TABLE_COLUMN);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_ETL_TABLE_COLUMN);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_ORDER_ETL_HDR)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.DELETE_ORDER_ETL_HDR)),
								MastersAddressConstants.DELETE_ORDER_ETL_HDR, SqlQueries.DELETE_ORDER_ETL_HDR);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_ORDER_ETL_HDR);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_BOX_CELL_INVENTORY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_BOX_CELL_INVENTORY)),
								MastersAddressConstants.GET_BOX_CELL_INVENTORY, SqlQueries.GET_BOX_CELL_INVENTORY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_BOX_CELL_INVENTORY);
					}
				});

		router.post(
				MastersAddressConstants.API_PREFIX + MastersAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_HISTORY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_HISTORY)),
								MastersAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_HISTORY,
								SqlQueries.PARTNER_CHANNEL_INWARD_DELIVERY_HISTORY);
					} catch (Exception e) {
						processException(e, routingContext,
								MastersAddressConstants.PARTNER_CHANNEL_INWARD_DELIVERY_HISTORY);
					}
				});

		router.post(
				MastersAddressConstants.API_PREFIX + MastersAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY_HISTORY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY_HISTORY)),
								MastersAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY_HISTORY,
								SqlQueries.PARTNER_CHANNEL_OUTWARD_DELIVERY_HISTORY);
					} catch (Exception e) {
						processException(e, routingContext,
								MastersAddressConstants.PARTNER_CHANNEL_OUTWARD_DELIVERY_HISTORY);
					}
				});
		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_ORDER_ETL_HDR)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.CREATE_ORDER_ETL_HDR)),
								MastersAddressConstants.CREATE_ORDER_ETL_HDR, SqlQueries.CREATE_ORDER_ETL_HDR);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_ORDER_ETL_HDR);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_PARTNER_ORDER_DASHBOARD_DETAILS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_PARTNER_ORDER_DASHBOARD_DETAILS)),
								MastersAddressConstants.GET_PARTNER_ORDER_DASHBOARD_DETAILS,
								SqlQueries.GET_PARTNER_ORDER_DASHBOARD_DETAILS);
					} catch (Exception e) {
						processException(e, routingContext,
								MastersAddressConstants.GET_PARTNER_ORDER_DASHBOARD_DETAILS);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_SKU_DASHBOARD_COUNTS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_SKU_DASHBOARD_COUNTS)),
								MastersAddressConstants.GET_SKU_DASHBOARD_COUNTS, SqlQueries.GET_SKU_DASHBOARD_COUNTS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_SKU_DASHBOARD_COUNTS);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_HOTBOX_COUNT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.GET_HOTBOX_COUNT)),
								MastersAddressConstants.GET_HOTBOX_COUNT, SqlQueries.GET_HOTBOX_COUNT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_HOTBOX_COUNT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_SALES_REPORT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.GET_SALES_REPORT)),
								MastersAddressConstants.GET_SALES_REPORT, SqlQueries.GET_SALES_REPORT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_SALES_REPORT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_PURCHASE_REPORT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_PURCHASE_REPORT)),
								MastersAddressConstants.GET_PURCHASE_REPORT, SqlQueries.GET_PURCHASE_REPORT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_PURCHASE_REPORT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DAILY_BEST_SELLER_REPORT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_DAILY_BEST_SELLER_REPORT)),
								MastersAddressConstants.GET_DAILY_BEST_SELLER_REPORT,
								SqlQueries.GET_DAILY_BEST_SELLER_REPORT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DAILY_BEST_SELLER_REPORT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DAILY_GOODS_RETURNED_REPORT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_DAILY_GOODS_RETURNED_REPORT)),
								MastersAddressConstants.GET_DAILY_GOODS_RETURNED_REPORT,
								SqlQueries.GET_DAILY_GOODS_RETURNED_REPORT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DAILY_GOODS_RETURNED_REPORT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DAILY_ITEMS_RETURNED_REPORT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_DAILY_ITEMS_RETURNED_REPORT)),
								MastersAddressConstants.GET_DAILY_ITEMS_RETURNED_REPORT,
								SqlQueries.GET_DAILY_ITEMS_RETURNED_REPORT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DAILY_ITEMS_RETURNED_REPORT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DAILY_PURCHASE_REPORT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_DAILY_PURCHASE_REPORT)),
								MastersAddressConstants.GET_DAILY_PURCHASE_REPORT,
								SqlQueries.GET_DAILY_PURCHASE_REPORT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DAILY_PURCHASE_REPORT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DAILY_SALES_REPORT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_DAILY_SALES_REPORT)),
								MastersAddressConstants.GET_DAILY_SALES_REPORT, SqlQueries.GET_DAILY_SALES_REPORT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DAILY_SALES_REPORT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DAILY_STOCKS_IN_HAND_REPORT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_DAILY_STOCKS_IN_HAND_REPORT)),
								MastersAddressConstants.GET_DAILY_STOCKS_IN_HAND_REPORT,
								SqlQueries.GET_DAILY_STOCKS_IN_HAND_REPORT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DAILY_STOCKS_IN_HAND_REPORT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_BOX_CELL_INVENTORY_V2)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_BOX_CELL_INVENTORY_V2)),
								MastersAddressConstants.GET_BOX_CELL_INVENTORY_V2,
								SqlQueries.GET_BOX_CELL_INVENTORY_V2);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_BOX_CELL_INVENTORY_V2);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_HOTBOX_COUNT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.GET_HOTBOX_COUNT)),
								MastersAddressConstants.GET_HOTBOX_COUNT, SqlQueries.GET_HOTBOX_COUNT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_HOTBOX_COUNT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_SALES_REPORT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.GET_SALES_REPORT)),
								MastersAddressConstants.GET_SALES_REPORT, SqlQueries.GET_SALES_REPORT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_SALES_REPORT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_HOTBOX_COUNT_V2)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_HOTBOX_COUNT_V2)),
								MastersAddressConstants.GET_HOTBOX_COUNT_V2, SqlQueries.GET_HOTBOX_COUNT_V2);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_HOTBOX_COUNT_V2);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_ENTITY_INFRA_PROPERTIES_V2)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_ENTITY_INFRA_PROPERTIES_V2)),
								MastersAddressConstants.GET_ENTITY_INFRA_PROPERTIES_V2,
								SqlQueries.GET_ENTITY_INFRA_PROPERTIES_V2);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_ENTITY_INFRA_PROPERTIES_V2);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_REJECTED_SKU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.GET_REJECTED_SKU)),
								MastersAddressConstants.GET_REJECTED_SKU, SqlQueries.GET_REJECTED_SKU);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_REJECTED_SKU);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_UNALLOCATED_FOOD_ORDERS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_UNALLOCATED_FOOD_ORDERS)),
								MastersAddressConstants.GET_UNALLOCATED_FOOD_ORDERS,
								SqlQueries.GET_UNALLOCATED_FOOD_ORDERS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_UNALLOCATED_FOOD_ORDERS);
					}
				});

		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.UPDATE_PROFILE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						mediaUpload(inputJson.getJsonObject("profileImage"), result -> {
							if (result.succeeded()) {
								inputJson.remove("profileImage");
								inputJson.put("profileImage", result.result().getInteger("mediaSno"));
								processDbEbRequest(routingContext,
										PreProcessor.doProcess(inputJson,
												PreProcessBuilder
														.getPreProcessList(MastersAddressConstants.UPDATE_PROFILE)),
										MastersAddressConstants.UPDATE_PROFILE, SqlQueries.UPDATE_PROFILE);
							}
						});
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.UPDATE_PROFILE);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_MOST_SOLD_COUNTS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_MOST_SOLD_COUNTS)),
								MastersAddressConstants.GET_MOST_SOLD_COUNTS, SqlQueries.GET_MOST_SOLD_COUNTS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_MOST_SOLD_COUNTS);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_INWARD_ORDER_DETAILS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_INWARD_ORDER_DETAILS)),
								MastersAddressConstants.GET_INWARD_ORDER_DETAILS, SqlQueries.GET_INWARD_ORDER_DETAILS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_INWARD_ORDER_DETAILS);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_UNSOLD_SKU_LUNCH_COUNTS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_UNSOLD_SKU_LUNCH_COUNTS)),
								MastersAddressConstants.GET_UNSOLD_SKU_LUNCH_COUNTS,
								SqlQueries.GET_UNSOLD_SKU_LUNCH_COUNTS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_UNSOLD_SKU_LUNCH_COUNTS);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_UNSOLD_SKU_DINNER_COUNTS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_UNSOLD_SKU_DINNER_COUNTS)),
								MastersAddressConstants.GET_UNSOLD_SKU_DINNER_COUNTS,
								SqlQueries.GET_UNSOLD_SKU_DINNER_COUNTS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_UNSOLD_SKU_DINNER_COUNTS);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_CONSOLIDATED_DATA)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_CONSOLIDATED_DATA)),
								MastersAddressConstants.GET_CONSOLIDATED_DATA, SqlQueries.GET_CONSOLIDATED_DATA);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_CONSOLIDATED_DATA);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DAILY_STOCK_REPORT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_DAILY_STOCK_REPORT)),
								MastersAddressConstants.GET_DAILY_STOCK_REPORT, SqlQueries.GET_DAILY_STOCK_REPORT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DAILY_STOCK_REPORT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_BEST_SELLING_FOOD)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_BEST_SELLING_FOOD)),
								MastersAddressConstants.GET_BEST_SELLING_FOOD, SqlQueries.GET_BEST_SELLING_FOOD);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_BEST_SELLING_FOOD);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY)),
								MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY,
								SqlQueries.GET_DASHBOARD_QBOX_ENTITY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GENERATE_ORDER_FILE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GENERATE_ORDER_FILE)),
								MastersAddressConstants.GENERATE_ORDER_FILE, SqlQueries.GENERATE_ORDER_FILE);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GENERATE_ORDER_FILE);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_SALES_SKU_INVENTORY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_SALES_SKU_INVENTORY)),
								MastersAddressConstants.GET_SALES_SKU_INVENTORY, SqlQueries.GET_SALES_SKU_INVENTORY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_SALES_SKU_INVENTORY);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DASHBOARD_STOCK_SUMMARY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_DASHBOARD_STOCK_SUMMARY)),
								MastersAddressConstants.GET_DASHBOARD_STOCK_SUMMARY,
								SqlQueries.GET_DASHBOARD_STOCK_SUMMARY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DASHBOARD_STOCK_SUMMARY);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_HOTBOX_SUMMARY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_HOTBOX_SUMMARY)),
								MastersAddressConstants.GET_HOTBOX_SUMMARY, SqlQueries.GET_HOTBOX_SUMMARY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_HOTBOX_SUMMARY);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_INWARD_ORDER_DETAILS_V2)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_INWARD_ORDER_DETAILS_V2)),
								MastersAddressConstants.GET_INWARD_ORDER_DETAILS_V2,
								SqlQueries.GET_INWARD_ORDER_DETAILS_V2);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_INWARD_ORDER_DETAILS_V2);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_HOTBOX_COUNT_V3)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_HOTBOX_COUNT_V3)),
								MastersAddressConstants.GET_HOTBOX_COUNT_V3, SqlQueries.GET_HOTBOX_COUNT_V3);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_HOTBOX_COUNT_V3);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DAILY_STOCK_REPORT_V2)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_DAILY_STOCK_REPORT_V2)),
								MastersAddressConstants.GET_DAILY_STOCK_REPORT_V2,
								SqlQueries.GET_DAILY_STOCK_REPORT_V2);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DAILY_STOCK_REPORT_V2);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_ENTITY_LOADER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.GET_ENTITY_LOADER)),
								MastersAddressConstants.GET_ENTITY_LOADER, SqlQueries.GET_ENTITY_LOADER);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_ENTITY_LOADER);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DETAILED_INWARD_ORDERS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_DETAILED_INWARD_ORDERS)),
								MastersAddressConstants.GET_DETAILED_INWARD_ORDERS,
								SqlQueries.GET_DETAILED_INWARD_ORDERS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DETAILED_INWARD_ORDERS);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY_BY_AUTH_USER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY_BY_AUTH_USER)),
								MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY_BY_AUTH_USER,
								SqlQueries.GET_DASHBOARD_QBOX_ENTITY_BY_AUTH_USER);
					} catch (Exception e) {
						processException(e, routingContext,
								MastersAddressConstants.GET_DASHBOARD_QBOX_ENTITY_BY_AUTH_USER);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_SUPERVISORS_BY_ENTITIES)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(
												MastersAddressConstants.GET_SUPERVISORS_BY_ENTITIES)),
								MastersAddressConstants.GET_SUPERVISORS_BY_ENTITIES,
								SqlQueries.GET_SUPERVISORS_BY_ENTITIES);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_SUPERVISORS_BY_ENTITIES);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_ATTENDANCE_RECORD)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.CREATE_ATTENDANCE_RECORD)),
								MastersAddressConstants.CREATE_ATTENDANCE_RECORD, SqlQueries.CREATE_ATTENDANCE_RECORD);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_ATTENDANCE_RECORD);
					}
				});

		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.UPDATE_ATTENDANCE_RECORD)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.UPDATE_ATTENDANCE_RECORD)),
								MastersAddressConstants.UPDATE_ATTENDANCE_RECORD, SqlQueries.UPDATE_ATTENDANCE_RECORD);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.UPDATE_ATTENDANCE_RECORD);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_TODAY_ATTENDANCE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_TODAY_ATTENDANCE)),
								MastersAddressConstants.GET_TODAY_ATTENDANCE, SqlQueries.GET_TODAY_ATTENDANCE);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_TODAY_ATTENDANCE);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_ATTENDANCE_SUMMARY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_ATTENDANCE_SUMMARY)),
								MastersAddressConstants.GET_ATTENDANCE_SUMMARY, SqlQueries.GET_ATTENDANCE_SUMMARY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_ATTENDANCE_SUMMARY);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_USER_BY_ID)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.DELETE_USER_BY_ID)),
								MastersAddressConstants.DELETE_USER_BY_ID, SqlQueries.DELETE_USER_BY_ID);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_USER_BY_ID);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_SKU_SALES_REPORT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_SKU_SALES_REPORT)),
								MastersAddressConstants.GET_SKU_SALES_REPORT, SqlQueries.GET_SKU_SALES_REPORT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_SKU_SALES_REPORT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_FULL_PURCHASE_ORDER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.SEARCH_FULL_PURCHASE_ORDER)),
								MastersAddressConstants.SEARCH_FULL_PURCHASE_ORDER,
								SqlQueries.SEARCH_FULL_PURCHASE_ORDER);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_FULL_PURCHASE_ORDER);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_SKU_IN_QBOX_INVENTORY)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_SKU_IN_QBOX_INVENTORY)),
								MastersAddressConstants.GET_SKU_IN_QBOX_INVENTORY,
								SqlQueries.GET_SKU_IN_QBOX_INVENTORY);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_SKU_IN_QBOX_INVENTORY);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_ENTITY_INFRA_DETAILS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_ENTITY_INFRA_DETAILS)),
								MastersAddressConstants.GET_ENTITY_INFRA_DETAILS, SqlQueries.GET_ENTITY_INFRA_DETAILS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_ENTITY_INFRA_DETAILS);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_LOW_STOCK_TRIGGER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.CREATE_LOW_STOCK_TRIGGER)),
								MastersAddressConstants.CREATE_LOW_STOCK_TRIGGER, SqlQueries.CREATE_LOW_STOCK_TRIGGER);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_LOW_STOCK_TRIGGER);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.SEARCH_LOW_STOCK_TRIGGER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.SEARCH_LOW_STOCK_TRIGGER)),
								MastersAddressConstants.SEARCH_LOW_STOCK_TRIGGER, SqlQueries.SEARCH_LOW_STOCK_TRIGGER);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.SEARCH_LOW_STOCK_TRIGGER);
					}
				});

		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.EDIT_LOW_STOCK_TRIGGER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.EDIT_LOW_STOCK_TRIGGER)),
								MastersAddressConstants.EDIT_LOW_STOCK_TRIGGER, SqlQueries.EDIT_LOW_STOCK_TRIGGER);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.EDIT_LOW_STOCK_TRIGGER);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_LOW_STOCK_TRIGGER)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.DELETE_LOW_STOCK_TRIGGER)),
								MastersAddressConstants.DELETE_LOW_STOCK_TRIGGER, SqlQueries.DELETE_LOW_STOCK_TRIGGER);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_LOW_STOCK_TRIGGER);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CONFIRM_SKU_REJECT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.CONFIRM_SKU_REJECT)),
								MastersAddressConstants.CONFIRM_SKU_REJECT, SqlQueries.CONFIRM_SKU_REJECT);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CONFIRM_SKU_REJECT);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.CREATE_REJECT_REASON)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.CREATE_REJECT_REASON)),
								MastersAddressConstants.CREATE_REJECT_REASON, SqlQueries.CREATE_REJECT_REASON);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.CREATE_REJECT_REASON);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_REJECT_REASON)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(MastersAddressConstants.GET_REJECT_REASON)),
								MastersAddressConstants.GET_REJECT_REASON, SqlQueries.GET_REJECT_REASON);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_REJECT_REASON);
					}
				});

		router.put(MastersAddressConstants.API_PREFIX + MastersAddressConstants.UPDATE_REJECT_REASON)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.UPDATE_REJECT_REASON)),
								MastersAddressConstants.UPDATE_REJECT_REASON, SqlQueries.UPDATE_REJECT_REASON);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.UPDATE_REJECT_REASON);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.DELETE_REJECT_REASON)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.DELETE_REJECT_REASON)),
								MastersAddressConstants.DELETE_REJECT_REASON, SqlQueries.DELETE_REJECT_REASON);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.DELETE_REJECT_REASON);
					}
				});

		router.post(MastersAddressConstants.API_PREFIX + MastersAddressConstants.GET_DASHBOARD_ANALYTICS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder
												.getPreProcessList(MastersAddressConstants.GET_DASHBOARD_ANALYTICS)),
								MastersAddressConstants.GET_DASHBOARD_ANALYTICS, SqlQueries.GET_DASHBOARD_ANALYTICS);
					} catch (Exception e) {
						processException(e, routingContext, MastersAddressConstants.GET_DASHBOARD_ANALYTICS);
					}
				});

		super.start();

		this.httpServer = vertx.createHttpServer();
		int portNo = 8911;// Integer.parseInt(config().getString(ConfigConstants.MICRO_SERVICE_PORT));
		if (this.httpServer != null && portNo > 0) {
			this.httpServer.requestHandler(router).requestStream().toFlowable().subscribe();
			this.httpServer.rxListen(portNo);
			this.httpServer.requestHandler(router).rxListen(portNo).subscribe();
			log.info("ServerVerticle Started");
		}
	}
	
	public void mediaUpload(JsonObject jsonObject, Handler<AsyncResult<JsonObject>> mediaHandler) {
		if (jsonObject != null) {
			processWebClientPostRequest(jsonObject, 8915, "localhost", "/api/v1/media/insert_media", false, result -> {
				if (result.succeeded()) {
					mediaHandler.handle(Future.succeededFuture(result.result()));
				} else {
					mediaHandler.handle(Future.failedFuture(result.cause()));
				}
			});
		} else {
			mediaHandler.handle(Future.succeededFuture(new JsonObject().put("mediaSno", null)));
		}
	}

	public void multiMediaUpload(JsonObject jsonObject, Handler<AsyncResult<JsonObject>> mediaHandler) {
		if (jsonObject != null) {
			processWebClientPostRequest(jsonObject, 8915, "localhost", "/api/v1/media/insert_media", false, result -> {
				if (result.succeeded()) {
					mediaHandler.handle(Future.succeededFuture(result.result()));
				} else {
					mediaHandler.handle(Future.failedFuture(result.cause()));
				}
			});
		} else {
			mediaHandler.handle(Future.succeededFuture(new JsonObject().put("mediaSno", null)));
		}
	}
	

	public void sendSms(JsonObject data) {
		log.info("sendSms started");
		vertx.eventBus().send("send_sms", data);
	}

	public void sendPublish(JsonObject data) {
		log.info("sendPublish started");
		vertx.eventBus().send("publish_msg", data);
	}

	public void sendNotification(JsonObject data) {
		log.info("sendNotification started");
		vertx.eventBus().send("send_notification", data);
	}
	
	 
}
