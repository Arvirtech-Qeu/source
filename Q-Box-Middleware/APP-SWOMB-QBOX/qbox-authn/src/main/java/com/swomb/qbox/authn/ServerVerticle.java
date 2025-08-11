package com.swomb.qbox.authn;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.swomb.qbox.authn.process.AuthnPreProcessBuilder;
import com.swomb.qbox.authn.process.AuthnPreProcessor;
import com.swomb.qbox.common.AppRestAPIBaseVerticle;
import com.swomb.qbox.common.model.ApiDetail;
import com.swomb.qbox.common.util.ConfigConstants;
import com.swomb.qbox.crypto.Crypto;
import com.swomb.qbox.process.PreProcessor;
import com.swomb.qbox.process.builder.PreProcessBuilder;
import com.swomb.qbox.process.utils.RequestProcessRule;
import com.swomb.qbox.util.AuthnAddressConstants;
import com.swomb.qbox.util.AuthnSqlQueries;


import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.core.http.HttpServer;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.handler.BodyHandler;
import io.vertx.reactivex.ext.web.handler.StaticHandler;
import io.vertx.reactivex.json.schema.Schema;
import io.vertx.reactivex.json.schema.SchemaParser;

public class ServerVerticle extends AppRestAPIBaseVerticle {

	Logger log = LoggerFactory.getLogger(MainVerticle.class.getName());

	private HttpServer httpServer;

	SchemaParser schemaParser;
	Schema schema;

	public static String DB_SCHEMA = "authn";

	private static final String EMAIL_REGEX = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$";
	private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

	private static ApiDetail singlMediaApiDetail;

	private static ApiDetail multiMediaApiDetail;

	@Override
	public void start() throws Exception {
		// TODO Auto-generated method stub
		super.start();

		final Router router = Router.router(vertx);
		enableCorsSupport(router);

		router.route("/assets/*").handler(StaticHandler.create("assets"));

		router.route(AuthnAddressConstants.AUTH_API_PREFIX + "*").handler(BodyHandler.create());

		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_API_KEY).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_API_KEY)),
						AuthnAddressConstants.CUSTOM_SEARCH_API_KEY, AuthnSqlQueries.CUSTOM_SEARCH_API_KEY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_API_KEY);
			}
		});
		
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_API_KEY).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_API_KEY)),
						AuthnAddressConstants.CUSTOM_UPDATE_API_KEY, AuthnSqlQueries.CUSTOM_UPDATE_API_KEY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_API_KEY);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_API_KEY).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_API_KEY)),
						AuthnAddressConstants.CREATE_API_KEY, AuthnSqlQueries.CREATE_API_KEY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_API_KEY);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_API_KEY).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_API_KEY)),
						AuthnAddressConstants.GET_ALL_API_KEY, AuthnSqlQueries.GET_ALL_API_KEY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_API_KEY);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_API_KEY).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_API_KEY)),
						AuthnAddressConstants.GET_BY_ID_API_KEY, AuthnSqlQueries.GET_BY_ID_API_KEY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_API_KEY);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_API_KEY).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_API_KEY)),
						AuthnAddressConstants.UPDATE_API_KEY, AuthnSqlQueries.UPDATE_API_KEY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_API_KEY);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_APP_USER_SETTINGS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_APP_USER_SETTINGS)),
								AuthnAddressConstants.CUSTOM_SEARCH_APP_USER_SETTINGS,
								AuthnSqlQueries.CUSTOM_SEARCH_APP_USER_SETTINGS);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_APP_USER_SETTINGS);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_APP_USER_SETTINGS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_APP_USER_SETTINGS)),
								AuthnAddressConstants.CUSTOM_UPDATE_APP_USER_SETTINGS,
								AuthnSqlQueries.CUSTOM_UPDATE_APP_USER_SETTINGS);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_APP_USER_SETTINGS);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_APP_USER_SETTINGS).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_APP_USER_SETTINGS)),
						AuthnAddressConstants.CREATE_APP_USER_SETTINGS, AuthnSqlQueries.CREATE_APP_USER_SETTINGS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_APP_USER_SETTINGS);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_APP_USER_SETTINGS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_APP_USER_SETTINGS)),
						AuthnAddressConstants.GET_ALL_APP_USER_SETTINGS, AuthnSqlQueries.GET_ALL_APP_USER_SETTINGS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_APP_USER_SETTINGS);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_APP_USER_SETTINGS)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_BY_ID_APP_USER_SETTINGS)),
								AuthnAddressConstants.GET_BY_ID_APP_USER_SETTINGS, AuthnSqlQueries.GET_BY_ID_APP_USER_SETTINGS);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_APP_USER_SETTINGS);
					}
				});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_APP_USER_SETTINGS).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_APP_USER_SETTINGS)),
						AuthnAddressConstants.UPDATE_APP_USER_SETTINGS, AuthnSqlQueries.UPDATE_APP_USER_SETTINGS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_APP_USER_SETTINGS);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_AUDIT_TRAIL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_AUDIT_TRAIL)),
								AuthnAddressConstants.CUSTOM_SEARCH_AUDIT_TRAIL, AuthnSqlQueries.CUSTOM_SEARCH_AUDIT_TRAIL);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_AUDIT_TRAIL);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_AUDIT_TRAIL)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_AUDIT_TRAIL)),
								AuthnAddressConstants.CUSTOM_UPDATE_AUDIT_TRAIL, AuthnSqlQueries.CUSTOM_UPDATE_AUDIT_TRAIL);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_AUDIT_TRAIL);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_AUDIT_TRAIL).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_AUDIT_TRAIL)),
						AuthnAddressConstants.CREATE_AUDIT_TRAIL, AuthnSqlQueries.CREATE_AUDIT_TRAIL);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_AUDIT_TRAIL);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_AUDIT_TRAIL).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_AUDIT_TRAIL)),
						AuthnAddressConstants.GET_ALL_AUDIT_TRAIL, AuthnSqlQueries.GET_ALL_AUDIT_TRAIL);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_AUDIT_TRAIL);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_AUDIT_TRAIL).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_AUDIT_TRAIL)),
						AuthnAddressConstants.GET_BY_ID_AUDIT_TRAIL, AuthnSqlQueries.GET_BY_ID_AUDIT_TRAIL);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_AUDIT_TRAIL);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_AUDIT_TRAIL).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_AUDIT_TRAIL)),
						AuthnAddressConstants.UPDATE_AUDIT_TRAIL, AuthnSqlQueries.UPDATE_AUDIT_TRAIL);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_AUDIT_TRAIL);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_ATTEMPT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_ATTEMPT)),
								AuthnAddressConstants.CUSTOM_SEARCH_AUTH_ATTEMPT, AuthnSqlQueries.CUSTOM_SEARCH_AUTH_ATTEMPT);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_AUTH_ATTEMPT);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_ATTEMPT)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_ATTEMPT)),
								AuthnAddressConstants.CUSTOM_UPDATE_AUTH_ATTEMPT, AuthnSqlQueries.CUSTOM_UPDATE_AUTH_ATTEMPT);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_AUTH_ATTEMPT);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_AUTH_ATTEMPT).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_AUTH_ATTEMPT)),
						AuthnAddressConstants.CREATE_AUTH_ATTEMPT, AuthnSqlQueries.CREATE_AUTH_ATTEMPT);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_AUTH_ATTEMPT);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_AUTH_ATTEMPT).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_AUTH_ATTEMPT)),
						AuthnAddressConstants.GET_ALL_AUTH_ATTEMPT, AuthnSqlQueries.GET_ALL_AUTH_ATTEMPT);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_AUTH_ATTEMPT);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_AUTH_ATTEMPT).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_AUTH_ATTEMPT)),
						AuthnAddressConstants.GET_BY_ID_AUTH_ATTEMPT, AuthnSqlQueries.GET_BY_ID_AUTH_ATTEMPT);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_AUTH_ATTEMPT);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_AUTH_ATTEMPT).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_AUTH_ATTEMPT)),
						AuthnAddressConstants.UPDATE_AUTH_ATTEMPT, AuthnSqlQueries.UPDATE_AUTH_ATTEMPT);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_AUTH_ATTEMPT);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD)),
								AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD, AuthnSqlQueries.CUSTOM_SEARCH_AUTH_PASSWORD);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD)),
								AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD, AuthnSqlQueries.CUSTOM_UPDATE_AUTH_PASSWORD);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_AUTH_PASSWORD).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_AUTH_PASSWORD)),
						AuthnAddressConstants.CREATE_AUTH_PASSWORD, AuthnSqlQueries.CREATE_AUTH_PASSWORD);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_AUTH_PASSWORD);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_AUTH_PASSWORD).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_AUTH_PASSWORD)),
						AuthnAddressConstants.GET_ALL_AUTH_PASSWORD, AuthnSqlQueries.GET_ALL_AUTH_PASSWORD);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_AUTH_PASSWORD);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD)),
						AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD, AuthnSqlQueries.GET_BY_ID_AUTH_PASSWORD);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_AUTH_PASSWORD).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_AUTH_PASSWORD)),
						AuthnAddressConstants.UPDATE_AUTH_PASSWORD, AuthnSqlQueries.UPDATE_AUTH_PASSWORD);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_AUTH_PASSWORD);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD_HIST)),
								AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD_HIST,
								AuthnSqlQueries.CUSTOM_SEARCH_AUTH_PASSWORD_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_AUTH_PASSWORD_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD_HIST)),
								AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD_HIST,
								AuthnSqlQueries.CUSTOM_UPDATE_AUTH_PASSWORD_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_AUTH_PASSWORD_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_AUTH_PASSWORD_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CREATE_AUTH_PASSWORD_HIST)),
								AuthnAddressConstants.CREATE_AUTH_PASSWORD_HIST, AuthnSqlQueries.CREATE_AUTH_PASSWORD_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CREATE_AUTH_PASSWORD_HIST);
					}
				});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_AUTH_PASSWORD_HIST)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_ALL_AUTH_PASSWORD_HIST)),
								AuthnAddressConstants.GET_ALL_AUTH_PASSWORD_HIST, AuthnSqlQueries.GET_ALL_AUTH_PASSWORD_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_ALL_AUTH_PASSWORD_HIST);
					}
				});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD_HIST)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD_HIST)),
								AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD_HIST, AuthnSqlQueries.GET_BY_ID_AUTH_PASSWORD_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_AUTH_PASSWORD_HIST);
					}
				});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_AUTH_PASSWORD_HIST).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_AUTH_PASSWORD_HIST)),
						AuthnAddressConstants.UPDATE_AUTH_PASSWORD_HIST, AuthnSqlQueries.UPDATE_AUTH_PASSWORD_HIST);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_AUTH_PASSWORD_HIST);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS)),
								AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS, AuthnSqlQueries.CUSTOM_SEARCH_AUTH_STATUS);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS)),
								AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS, AuthnSqlQueries.CUSTOM_UPDATE_AUTH_STATUS);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_AUTH_STATUS).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_AUTH_STATUS)),
						AuthnAddressConstants.CREATE_AUTH_STATUS, AuthnSqlQueries.CREATE_AUTH_STATUS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_AUTH_STATUS);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_AUTH_STATUS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_AUTH_STATUS)),
						AuthnAddressConstants.GET_ALL_AUTH_STATUS, AuthnSqlQueries.GET_ALL_AUTH_STATUS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_AUTH_STATUS);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_AUTH_STATUS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_AUTH_STATUS)),
						AuthnAddressConstants.GET_BY_ID_AUTH_STATUS, AuthnSqlQueries.GET_BY_ID_AUTH_STATUS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_AUTH_STATUS);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_AUTH_STATUS).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_AUTH_STATUS)),
						AuthnAddressConstants.UPDATE_AUTH_STATUS, AuthnSqlQueries.UPDATE_AUTH_STATUS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_AUTH_STATUS);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS_LOG)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS_LOG)),
								AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS_LOG,
								AuthnSqlQueries.CUSTOM_SEARCH_AUTH_STATUS_LOG);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_AUTH_STATUS_LOG);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS_LOG)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS_LOG)),
								AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS_LOG,
								AuthnSqlQueries.CUSTOM_UPDATE_AUTH_STATUS_LOG);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_AUTH_STATUS_LOG);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_AUTH_STATUS_LOG).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_AUTH_STATUS_LOG)),
						AuthnAddressConstants.CREATE_AUTH_STATUS_LOG, AuthnSqlQueries.CREATE_AUTH_STATUS_LOG);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_AUTH_STATUS_LOG);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_AUTH_STATUS_LOG).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_AUTH_STATUS_LOG)),
						AuthnAddressConstants.GET_ALL_AUTH_STATUS_LOG, AuthnSqlQueries.GET_ALL_AUTH_STATUS_LOG);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_AUTH_STATUS_LOG);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_AUTH_STATUS_LOG).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_AUTH_STATUS_LOG)),
						AuthnAddressConstants.GET_BY_ID_AUTH_STATUS_LOG, AuthnSqlQueries.GET_BY_ID_AUTH_STATUS_LOG);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_AUTH_STATUS_LOG);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_AUTH_STATUS_LOG).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_AUTH_STATUS_LOG)),
						AuthnAddressConstants.UPDATE_AUTH_STATUS_LOG, AuthnSqlQueries.UPDATE_AUTH_STATUS_LOG);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_AUTH_STATUS_LOG);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER)),
						AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER, AuthnSqlQueries.CUSTOM_SEARCH_AUTH_USER);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER)),
						AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER, AuthnSqlQueries.CUSTOM_UPDATE_AUTH_USER);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_AUTH_USER).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_AUTH_USER)),
						AuthnAddressConstants.CREATE_AUTH_USER, AuthnSqlQueries.CREATE_AUTH_USER);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_AUTH_USER);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_AUTH_USER).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_AUTH_USER)),
						AuthnAddressConstants.GET_ALL_AUTH_USER, AuthnSqlQueries.GET_ALL_AUTH_USER);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_AUTH_USER);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_AUTH_USER).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_AUTH_USER)),
						AuthnAddressConstants.GET_BY_ID_AUTH_USER, AuthnSqlQueries.GET_BY_ID_AUTH_USER);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_AUTH_USER);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_AUTH_USER).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_AUTH_USER)),
						AuthnAddressConstants.UPDATE_AUTH_USER, AuthnSqlQueries.UPDATE_AUTH_USER);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_AUTH_USER);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER_ROLE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER_ROLE)),
								AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER_ROLE, AuthnSqlQueries.CUSTOM_SEARCH_AUTH_USER_ROLE);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_AUTH_USER_ROLE);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER_ROLE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER_ROLE)),
								AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER_ROLE, AuthnSqlQueries.CUSTOM_UPDATE_AUTH_USER_ROLE);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_AUTH_USER_ROLE);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_AUTH_USER_ROLE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_AUTH_USER_ROLE)),
						AuthnAddressConstants.CREATE_AUTH_USER_ROLE, AuthnSqlQueries.CREATE_AUTH_USER_ROLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_AUTH_USER_ROLE);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_AUTH_USER_ROLE).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_AUTH_USER_ROLE)),
						AuthnAddressConstants.GET_ALL_AUTH_USER_ROLE, AuthnSqlQueries.GET_ALL_AUTH_USER_ROLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_AUTH_USER_ROLE);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_AUTH_USER_ROLE).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_AUTH_USER_ROLE)),
						AuthnAddressConstants.GET_BY_ID_AUTH_USER_ROLE, AuthnSqlQueries.GET_BY_ID_AUTH_USER_ROLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_AUTH_USER_ROLE);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_AUTH_USER_ROLE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_AUTH_USER_ROLE)),
						AuthnAddressConstants.UPDATE_AUTH_USER_ROLE, AuthnSqlQueries.UPDATE_AUTH_USER_ROLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_AUTH_USER_ROLE);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_DB_TABLE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_DB_TABLE)),
						AuthnAddressConstants.CUSTOM_SEARCH_DB_TABLE, AuthnSqlQueries.CUSTOM_SEARCH_DB_TABLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_DB_TABLE);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_DB_TABLE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_DB_TABLE)),
						AuthnAddressConstants.CUSTOM_UPDATE_DB_TABLE, AuthnSqlQueries.CUSTOM_UPDATE_DB_TABLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_DB_TABLE);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_DB_TABLE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_DB_TABLE)),
						AuthnAddressConstants.CREATE_DB_TABLE, AuthnSqlQueries.CREATE_DB_TABLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_DB_TABLE);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_DB_TABLE).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_DB_TABLE)),
						AuthnAddressConstants.GET_ALL_DB_TABLE, AuthnSqlQueries.GET_ALL_DB_TABLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_DB_TABLE);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_DB_TABLE_BY_ID).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("dbTableId", routingContext.request().getParam("dbTableId"));
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_DB_TABLE_BY_ID)),
						AuthnAddressConstants.GET_DB_TABLE_BY_ID, AuthnSqlQueries.GET_DB_TABLE_BY_ID);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_DB_TABLE_BY_ID);
			}
		});
		
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_DB_TABLE).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_DB_TABLE)),
						AuthnAddressConstants.GET_BY_ID_DB_TABLE, AuthnSqlQueries.GET_BY_ID_DB_TABLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_DB_TABLE);
			}
		});
		
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_DB_TABLE).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_DB_TABLE)),
						AuthnAddressConstants.GET_BY_ID_DB_TABLE, AuthnSqlQueries.GET_BY_ID_DB_TABLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_DB_TABLE);
			}
		});
		
		
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_DB_TABLE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_DB_TABLE)),
						AuthnAddressConstants.UPDATE_DB_TABLE, AuthnSqlQueries.UPDATE_DB_TABLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_DB_TABLE);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_MENU).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_MENU)),
						AuthnAddressConstants.CUSTOM_SEARCH_MENU, AuthnSqlQueries.CUSTOM_SEARCH_MENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_MENU);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_MENU).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_MENU)),
						AuthnAddressConstants.CUSTOM_UPDATE_MENU, AuthnSqlQueries.CUSTOM_UPDATE_MENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_MENU);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_MENU).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_MENU)),
						AuthnAddressConstants.CREATE_MENU, AuthnSqlQueries.CREATE_MENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_MENU);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_MENU).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_MENU)),
						AuthnAddressConstants.GET_ALL_MENU, AuthnSqlQueries.GET_ALL_MENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_MENU);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_MENU).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_MENU)),
						AuthnAddressConstants.GET_BY_ID_MENU, AuthnSqlQueries.GET_BY_ID_MENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_MENU);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_MENU).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_MENU)),
						AuthnAddressConstants.UPDATE_MENU, AuthnSqlQueries.UPDATE_MENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_MENU);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_MENU_PERMISSION)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_MENU_PERMISSION)),
								AuthnAddressConstants.CUSTOM_SEARCH_MENU_PERMISSION,
								AuthnSqlQueries.CUSTOM_SEARCH_MENU_PERMISSION);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_MENU_PERMISSION);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_MENU_PERMISSION)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_MENU_PERMISSION)),
								AuthnAddressConstants.CUSTOM_UPDATE_MENU_PERMISSION,
								AuthnSqlQueries.CUSTOM_UPDATE_MENU_PERMISSION);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_MENU_PERMISSION);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_MENU_PERMISSION).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_MENU_PERMISSION)),
						AuthnAddressConstants.CREATE_MENU_PERMISSION, AuthnSqlQueries.CREATE_MENU_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_MENU_PERMISSION);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_MENU_PERMISSION).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_MENU_PERMISSION)),
						AuthnAddressConstants.GET_ALL_MENU_PERMISSION, AuthnSqlQueries.GET_ALL_MENU_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_MENU_PERMISSION);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_MENU_PERMISSION).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_MENU_PERMISSION)),
						AuthnAddressConstants.GET_BY_ID_MENU_PERMISSION, AuthnSqlQueries.GET_BY_ID_MENU_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_MENU_PERMISSION);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_MENU_PERMISSION).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_MENU_PERMISSION)),
						AuthnAddressConstants.UPDATE_MENU_PERMISSION, AuthnSqlQueries.UPDATE_MENU_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_MENU_PERMISSION);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_METRIC).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_METRIC)),
						AuthnAddressConstants.CUSTOM_SEARCH_METRIC, AuthnSqlQueries.CUSTOM_SEARCH_METRIC);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_METRIC);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_METRIC).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_METRIC)),
						AuthnAddressConstants.CUSTOM_UPDATE_METRIC, AuthnSqlQueries.CUSTOM_UPDATE_METRIC);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_METRIC);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_METRIC).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_METRIC)),
						AuthnAddressConstants.CREATE_METRIC, AuthnSqlQueries.CREATE_METRIC);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_METRIC);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_METRIC).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_METRIC)),
						AuthnAddressConstants.GET_ALL_METRIC, AuthnSqlQueries.GET_ALL_METRIC);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_METRIC);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_METRIC).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_METRIC)),
						AuthnAddressConstants.GET_BY_ID_METRIC, AuthnSqlQueries.GET_BY_ID_METRIC);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_METRIC);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_METRIC).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_METRIC)),
						AuthnAddressConstants.UPDATE_METRIC, AuthnSqlQueries.UPDATE_METRIC);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_METRIC);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_MODULE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_MODULE)),
						AuthnAddressConstants.CUSTOM_SEARCH_MODULE, AuthnSqlQueries.CUSTOM_SEARCH_MODULE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_MODULE);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_MODULE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_MODULE)),
						AuthnAddressConstants.CUSTOM_UPDATE_MODULE, AuthnSqlQueries.CUSTOM_UPDATE_MODULE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_MODULE);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_MODULE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_MODULE)),
						AuthnAddressConstants.CREATE_MODULE, AuthnSqlQueries.CREATE_MODULE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_MODULE);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_MODULE).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_MODULE)),
						AuthnAddressConstants.GET_ALL_MODULE, AuthnSqlQueries.GET_ALL_MODULE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_MODULE);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_MODULE).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_MODULE)),
						AuthnAddressConstants.GET_BY_ID_MODULE, AuthnSqlQueries.GET_BY_ID_MODULE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_MODULE);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_MODULE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_MODULE)),
						AuthnAddressConstants.UPDATE_MODULE, AuthnSqlQueries.UPDATE_MODULE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_MODULE);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_MODULE_MENU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_MODULE_MENU)),
								AuthnAddressConstants.CUSTOM_SEARCH_MODULE_MENU, AuthnSqlQueries.CUSTOM_SEARCH_MODULE_MENU);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_MODULE_MENU);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_MODULE_MENU)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_MODULE_MENU)),
								AuthnAddressConstants.CUSTOM_UPDATE_MODULE_MENU, AuthnSqlQueries.CUSTOM_UPDATE_MODULE_MENU);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_MODULE_MENU);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_MODULE_MENU).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_MODULE_MENU)),
						AuthnAddressConstants.CREATE_MODULE_MENU, AuthnSqlQueries.CREATE_MODULE_MENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_MODULE_MENU);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_MODULE_MENU).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_MODULE_MENU)),
						AuthnAddressConstants.GET_ALL_MODULE_MENU, AuthnSqlQueries.GET_ALL_MODULE_MENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_MODULE_MENU);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_MODULE_MENU).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_MODULE_MENU)),
						AuthnAddressConstants.GET_BY_ID_MODULE_MENU, AuthnSqlQueries.GET_BY_ID_MODULE_MENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_MODULE_MENU);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_MODULE_MENU).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_MODULE_MENU)),
						AuthnAddressConstants.UPDATE_MODULE_MENU, AuthnSqlQueries.UPDATE_MODULE_MENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_MODULE_MENU);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION)),
						AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION, AuthnSqlQueries.CUSTOM_SEARCH_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION)),
						AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION, AuthnSqlQueries.CUSTOM_UPDATE_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_PERMISSION).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_PERMISSION)),
						AuthnAddressConstants.CREATE_PERMISSION, AuthnSqlQueries.CREATE_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_PERMISSION);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_PERMISSION).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_PERMISSION)),
						AuthnAddressConstants.GET_ALL_PERMISSION, AuthnSqlQueries.GET_ALL_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_PERMISSION);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_PERMISSION).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_PERMISSION)),
						AuthnAddressConstants.GET_BY_ID_PERMISSION, AuthnSqlQueries.GET_BY_ID_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_PERMISSION);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_PERMISSION).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_PERMISSION)),
						AuthnAddressConstants.UPDATE_PERMISSION, AuthnSqlQueries.UPDATE_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_PERMISSION);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_ADDON)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_ADDON)),
								AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_ADDON,
								AuthnSqlQueries.CUSTOM_SEARCH_PERMISSION_ADDON);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_ADDON);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_ADDON)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_ADDON)),
								AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_ADDON,
								AuthnSqlQueries.CUSTOM_UPDATE_PERMISSION_ADDON);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_ADDON);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_PERMISSION_ADDON).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_PERMISSION_ADDON)),
						AuthnAddressConstants.CREATE_PERMISSION_ADDON, AuthnSqlQueries.CREATE_PERMISSION_ADDON);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_PERMISSION_ADDON);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_PERMISSION_ADDON).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_PERMISSION_ADDON)),
						AuthnAddressConstants.GET_ALL_PERMISSION_ADDON, AuthnSqlQueries.GET_ALL_PERMISSION_ADDON);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_PERMISSION_ADDON);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_PERMISSION_ADDON)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_BY_ID_PERMISSION_ADDON)),
								AuthnAddressConstants.GET_BY_ID_PERMISSION_ADDON, AuthnSqlQueries.GET_BY_ID_PERMISSION_ADDON);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_PERMISSION_ADDON);
					}
				});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_PERMISSION_ADDON).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_PERMISSION_ADDON)),
						AuthnAddressConstants.UPDATE_PERMISSION_ADDON, AuthnSqlQueries.UPDATE_PERMISSION_ADDON);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_PERMISSION_ADDON);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_SERVICE_API)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder.getPreProcessList(
												AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_SERVICE_API)),
								AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_SERVICE_API,
								AuthnSqlQueries.CUSTOM_SEARCH_PERMISSION_SERVICE_API);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_PERMISSION_SERVICE_API);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_SERVICE_API)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder.getPreProcessList(
												AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_SERVICE_API)),
								AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_SERVICE_API,
								AuthnSqlQueries.CUSTOM_UPDATE_PERMISSION_SERVICE_API);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_PERMISSION_SERVICE_API);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_PERMISSION_SERVICE_API)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CREATE_PERMISSION_SERVICE_API)),
								AuthnAddressConstants.CREATE_PERMISSION_SERVICE_API,
								AuthnSqlQueries.CREATE_PERMISSION_SERVICE_API);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CREATE_PERMISSION_SERVICE_API);
					}
				});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_PERMISSION_SERVICE_API)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_ALL_PERMISSION_SERVICE_API)),
								AuthnAddressConstants.GET_ALL_PERMISSION_SERVICE_API,
								AuthnSqlQueries.GET_ALL_PERMISSION_SERVICE_API);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_ALL_PERMISSION_SERVICE_API);
					}
				});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_PERMISSION_SERVICE_API)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_BY_ID_PERMISSION_SERVICE_API)),
								AuthnAddressConstants.GET_BY_ID_PERMISSION_SERVICE_API,
								AuthnSqlQueries.GET_BY_ID_PERMISSION_SERVICE_API);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_PERMISSION_SERVICE_API);
					}
				});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_PERMISSION_SERVICE_API)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.UPDATE_PERMISSION_SERVICE_API)),
								AuthnAddressConstants.UPDATE_PERMISSION_SERVICE_API,
								AuthnSqlQueries.UPDATE_PERMISSION_SERVICE_API);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.UPDATE_PERMISSION_SERVICE_API);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_POLICY).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_POLICY)),
						AuthnAddressConstants.CUSTOM_SEARCH_POLICY, AuthnSqlQueries.CUSTOM_SEARCH_POLICY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_POLICY);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_POLICY).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_POLICY)),
						AuthnAddressConstants.CUSTOM_UPDATE_POLICY, AuthnSqlQueries.CUSTOM_UPDATE_POLICY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_POLICY);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_POLICY).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_POLICY)),
						AuthnAddressConstants.CREATE_POLICY, AuthnSqlQueries.CREATE_POLICY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_POLICY);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_POLICY).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_POLICY)),
						AuthnAddressConstants.GET_ALL_POLICY, AuthnSqlQueries.GET_ALL_POLICY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_POLICY);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_POLICY).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_POLICY)),
						AuthnAddressConstants.GET_BY_ID_POLICY, AuthnSqlQueries.GET_BY_ID_POLICY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_POLICY);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_POLICY).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_POLICY)),
						AuthnAddressConstants.UPDATE_POLICY, AuthnSqlQueries.UPDATE_POLICY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_POLICY);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_REASON).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_REASON)),
						AuthnAddressConstants.CUSTOM_SEARCH_REASON, AuthnSqlQueries.CUSTOM_SEARCH_REASON);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_REASON);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_REASON).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_REASON)),
						AuthnAddressConstants.CUSTOM_UPDATE_REASON, AuthnSqlQueries.CUSTOM_UPDATE_REASON);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_REASON);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_REASON).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_REASON)),
						AuthnAddressConstants.CREATE_REASON, AuthnSqlQueries.CREATE_REASON);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_REASON);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_REASON).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_REASON)),
						AuthnAddressConstants.GET_ALL_REASON, AuthnSqlQueries.GET_ALL_REASON);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_REASON);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_REASON).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_REASON)),
						AuthnAddressConstants.GET_BY_ID_REASON, AuthnSqlQueries.GET_BY_ID_REASON);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_REASON);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_REASON).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_REASON)),
						AuthnAddressConstants.UPDATE_REASON, AuthnSqlQueries.UPDATE_REASON);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_REASON);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_RECORD_ACTION)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_RECORD_ACTION)),
								AuthnAddressConstants.CUSTOM_SEARCH_RECORD_ACTION, AuthnSqlQueries.CUSTOM_SEARCH_RECORD_ACTION);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_RECORD_ACTION);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_RECORD_ACTION)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_RECORD_ACTION)),
								AuthnAddressConstants.CUSTOM_UPDATE_RECORD_ACTION, AuthnSqlQueries.CUSTOM_UPDATE_RECORD_ACTION);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_RECORD_ACTION);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_RECORD_ACTION).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_RECORD_ACTION)),
						AuthnAddressConstants.CREATE_RECORD_ACTION, AuthnSqlQueries.CREATE_RECORD_ACTION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_RECORD_ACTION);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_RECORD_ACTION).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_RECORD_ACTION)),
						AuthnAddressConstants.GET_ALL_RECORD_ACTION, AuthnSqlQueries.GET_ALL_RECORD_ACTION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_RECORD_ACTION);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_RECORD_ACTION).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_RECORD_ACTION)),
						AuthnAddressConstants.GET_BY_ID_RECORD_ACTION, AuthnSqlQueries.GET_BY_ID_RECORD_ACTION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_RECORD_ACTION);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_RECORD_ACTION).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_RECORD_ACTION)),
						AuthnAddressConstants.UPDATE_RECORD_ACTION, AuthnSqlQueries.UPDATE_RECORD_ACTION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_RECORD_ACTION);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_REGISTERATION_OTP)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_REGISTERATION_OTP)),
								AuthnAddressConstants.CUSTOM_SEARCH_REGISTERATION_OTP,
								AuthnSqlQueries.CUSTOM_SEARCH_REGISTERATION_OTP);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_REGISTERATION_OTP);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_REGISTERATION_OTP)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_REGISTERATION_OTP)),
								AuthnAddressConstants.CUSTOM_UPDATE_REGISTERATION_OTP,
								AuthnSqlQueries.CUSTOM_UPDATE_REGISTERATION_OTP);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_REGISTERATION_OTP);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_REGISTERATION_OTP).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_REGISTERATION_OTP)),
						AuthnAddressConstants.CREATE_REGISTERATION_OTP, AuthnSqlQueries.CREATE_REGISTERATION_OTP);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_REGISTERATION_OTP);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_REGISTERATION_OTP).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_REGISTERATION_OTP)),
						AuthnAddressConstants.GET_ALL_REGISTERATION_OTP, AuthnSqlQueries.GET_ALL_REGISTERATION_OTP);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_REGISTERATION_OTP);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_REGISTERATION_OTP)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_BY_ID_REGISTERATION_OTP)),
								AuthnAddressConstants.GET_BY_ID_REGISTERATION_OTP, AuthnSqlQueries.GET_BY_ID_REGISTERATION_OTP);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_REGISTERATION_OTP);
					}
				});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_REGISTERATION_OTP).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_REGISTERATION_OTP)),
						AuthnAddressConstants.UPDATE_REGISTERATION_OTP, AuthnSqlQueries.UPDATE_REGISTERATION_OTP);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_REGISTERATION_OTP);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_REGITRATION_ID_TYPE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_REGITRATION_ID_TYPE)),
								AuthnAddressConstants.CUSTOM_SEARCH_REGITRATION_ID_TYPE,
								AuthnSqlQueries.CUSTOM_SEARCH_REGITRATION_ID_TYPE);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_REGITRATION_ID_TYPE);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_REGITRATION_ID_TYPE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_REGITRATION_ID_TYPE)),
								AuthnAddressConstants.CUSTOM_UPDATE_REGITRATION_ID_TYPE,
								AuthnSqlQueries.CUSTOM_UPDATE_REGITRATION_ID_TYPE);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_REGITRATION_ID_TYPE);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_REGITRATION_ID_TYPE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CREATE_REGITRATION_ID_TYPE)),
								AuthnAddressConstants.CREATE_REGITRATION_ID_TYPE, AuthnSqlQueries.CREATE_REGITRATION_ID_TYPE);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CREATE_REGITRATION_ID_TYPE);
					}
				});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_REGITRATION_ID_TYPE)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_ALL_REGITRATION_ID_TYPE)),
								AuthnAddressConstants.GET_ALL_REGITRATION_ID_TYPE, AuthnSqlQueries.GET_ALL_REGITRATION_ID_TYPE);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_ALL_REGITRATION_ID_TYPE);
					}
				});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_REGITRATION_ID_TYPE)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_BY_ID_REGITRATION_ID_TYPE)),
								AuthnAddressConstants.GET_BY_ID_REGITRATION_ID_TYPE,
								AuthnSqlQueries.GET_BY_ID_REGITRATION_ID_TYPE);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_REGITRATION_ID_TYPE);
					}
				});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_REGITRATION_ID_TYPE)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.UPDATE_REGITRATION_ID_TYPE)),
								AuthnAddressConstants.UPDATE_REGITRATION_ID_TYPE, AuthnSqlQueries.UPDATE_REGITRATION_ID_TYPE);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.UPDATE_REGITRATION_ID_TYPE);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_RESET_OTP).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_RESET_OTP)),
						AuthnAddressConstants.CUSTOM_SEARCH_RESET_OTP, AuthnSqlQueries.CUSTOM_SEARCH_RESET_OTP);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_RESET_OTP);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_RESET_OTP).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_RESET_OTP)),
						AuthnAddressConstants.CUSTOM_UPDATE_RESET_OTP, AuthnSqlQueries.CUSTOM_UPDATE_RESET_OTP);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_RESET_OTP);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_RESET_OTP).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_RESET_OTP)),
						AuthnAddressConstants.CREATE_RESET_OTP, AuthnSqlQueries.CREATE_RESET_OTP);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_RESET_OTP);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_RESET_OTP).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_RESET_OTP)),
						AuthnAddressConstants.GET_ALL_RESET_OTP, AuthnSqlQueries.GET_ALL_RESET_OTP);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_RESET_OTP);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_RESET_OTP).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_RESET_OTP)),
						AuthnAddressConstants.GET_BY_ID_RESET_OTP, AuthnSqlQueries.GET_BY_ID_RESET_OTP);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_RESET_OTP);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_RESET_OTP).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_RESET_OTP)),
						AuthnAddressConstants.UPDATE_RESET_OTP, AuthnSqlQueries.UPDATE_RESET_OTP);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_RESET_OTP);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_ROLE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_ROLE)),
						AuthnAddressConstants.CUSTOM_SEARCH_ROLE, AuthnSqlQueries.CUSTOM_SEARCH_ROLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_ROLE);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_ROLE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_ROLE)),
						AuthnAddressConstants.CUSTOM_UPDATE_ROLE, AuthnSqlQueries.CUSTOM_UPDATE_ROLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_ROLE);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_ROLE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_ROLE)),
						AuthnAddressConstants.CREATE_ROLE, AuthnSqlQueries.CREATE_ROLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_ROLE);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_ROLE).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_ROLE)),
						AuthnAddressConstants.GET_ALL_ROLE, AuthnSqlQueries.GET_ALL_ROLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_ROLE);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_ROLE).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_ROLE)),
						AuthnAddressConstants.GET_BY_ID_ROLE, AuthnSqlQueries.GET_BY_ID_ROLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_ROLE);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_ROLE).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_ROLE)),
						AuthnAddressConstants.UPDATE_ROLE, AuthnSqlQueries.UPDATE_ROLE);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_ROLE);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION)),
								AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION,
								AuthnSqlQueries.CUSTOM_SEARCH_ROLE_PERMISSION);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION)),
								AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION,
								AuthnSqlQueries.CUSTOM_UPDATE_ROLE_PERMISSION);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_ROLE_PERMISSION).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_ROLE_PERMISSION)),
						AuthnAddressConstants.CREATE_ROLE_PERMISSION, AuthnSqlQueries.CREATE_ROLE_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_ROLE_PERMISSION);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_ROLE_PERMISSION).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_ROLE_PERMISSION)),
						AuthnAddressConstants.GET_ALL_ROLE_PERMISSION, AuthnSqlQueries.GET_ALL_ROLE_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_ROLE_PERMISSION);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION)),
						AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION, AuthnSqlQueries.GET_BY_ID_ROLE_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_ROLE_PERMISSION).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_ROLE_PERMISSION)),
						AuthnAddressConstants.UPDATE_ROLE_PERMISSION, AuthnSqlQueries.UPDATE_ROLE_PERMISSION);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_ROLE_PERMISSION);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder.getPreProcessList(
												AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION_HIST)),
								AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION_HIST,
								AuthnSqlQueries.CUSTOM_SEARCH_ROLE_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_ROLE_PERMISSION_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder.getPreProcessList(
												AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION_HIST)),
								AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION_HIST,
								AuthnSqlQueries.CUSTOM_UPDATE_ROLE_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_ROLE_PERMISSION_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_ROLE_PERMISSION_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CREATE_ROLE_PERMISSION_HIST)),
								AuthnAddressConstants.CREATE_ROLE_PERMISSION_HIST, AuthnSqlQueries.CREATE_ROLE_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CREATE_ROLE_PERMISSION_HIST);
					}
				});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_ROLE_PERMISSION_HIST)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_ALL_ROLE_PERMISSION_HIST)),
								AuthnAddressConstants.GET_ALL_ROLE_PERMISSION_HIST, AuthnSqlQueries.GET_ALL_ROLE_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_ALL_ROLE_PERMISSION_HIST);
					}
				});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION_HIST)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION_HIST)),
								AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION_HIST,
								AuthnSqlQueries.GET_BY_ID_ROLE_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_ROLE_PERMISSION_HIST);
					}
				});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_ROLE_PERMISSION_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.UPDATE_ROLE_PERMISSION_HIST)),
								AuthnAddressConstants.UPDATE_ROLE_PERMISSION_HIST, AuthnSqlQueries.UPDATE_ROLE_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.UPDATE_ROLE_PERMISSION_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_SERVICE_API)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_SERVICE_API)),
								AuthnAddressConstants.CUSTOM_SEARCH_SERVICE_API, AuthnSqlQueries.CUSTOM_SEARCH_SERVICE_API);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_SERVICE_API);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_SERVICE_API)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_SERVICE_API)),
								AuthnAddressConstants.CUSTOM_UPDATE_SERVICE_API, AuthnSqlQueries.CUSTOM_UPDATE_SERVICE_API);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_SERVICE_API);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_SERVICE_API).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_SERVICE_API)),
						AuthnAddressConstants.CREATE_SERVICE_API, AuthnSqlQueries.CREATE_SERVICE_API);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_SERVICE_API);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_SERVICE_API).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_SERVICE_API)),
						AuthnAddressConstants.GET_ALL_SERVICE_API, AuthnSqlQueries.GET_ALL_SERVICE_API);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_SERVICE_API);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_SERVICE_API).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_SERVICE_API)),
						AuthnAddressConstants.GET_BY_ID_SERVICE_API, AuthnSqlQueries.GET_BY_ID_SERVICE_API);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_SERVICE_API);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_SERVICE_API).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_SERVICE_API)),
						AuthnAddressConstants.UPDATE_SERVICE_API, AuthnSqlQueries.UPDATE_SERVICE_API);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_SERVICE_API);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO)),
								AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO, AuthnSqlQueries.CUSTOM_SEARCH_SESSION_INFO);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO)),
								AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO, AuthnSqlQueries.CUSTOM_UPDATE_SESSION_INFO);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_SESSION_INFO).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_SESSION_INFO)),
						AuthnAddressConstants.CREATE_SESSION_INFO, AuthnSqlQueries.CREATE_SESSION_INFO);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_SESSION_INFO);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_SESSION_INFO).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_SESSION_INFO)),
						AuthnAddressConstants.GET_ALL_SESSION_INFO, AuthnSqlQueries.GET_ALL_SESSION_INFO);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_SESSION_INFO);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_SESSION_INFO).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_SESSION_INFO)),
						AuthnAddressConstants.GET_BY_ID_SESSION_INFO, AuthnSqlQueries.GET_BY_ID_SESSION_INFO);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_SESSION_INFO);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_SESSION_INFO).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_SESSION_INFO)),
						AuthnAddressConstants.UPDATE_SESSION_INFO, AuthnSqlQueries.UPDATE_SESSION_INFO);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_SESSION_INFO);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO_HIST)),
								AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO_HIST,
								AuthnSqlQueries.CUSTOM_SEARCH_SESSION_INFO_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_SESSION_INFO_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO_HIST)),
								AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO_HIST,
								AuthnSqlQueries.CUSTOM_UPDATE_SESSION_INFO_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_SESSION_INFO_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_SESSION_INFO_HIST).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_SESSION_INFO_HIST)),
						AuthnAddressConstants.CREATE_SESSION_INFO_HIST, AuthnSqlQueries.CREATE_SESSION_INFO_HIST);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_SESSION_INFO_HIST);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_SESSION_INFO_HIST).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_SESSION_INFO_HIST)),
						AuthnAddressConstants.GET_ALL_SESSION_INFO_HIST, AuthnSqlQueries.GET_ALL_SESSION_INFO_HIST);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_SESSION_INFO_HIST);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_SESSION_INFO_HIST)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_BY_ID_SESSION_INFO_HIST)),
								AuthnAddressConstants.GET_BY_ID_SESSION_INFO_HIST, AuthnSqlQueries.GET_BY_ID_SESSION_INFO_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_SESSION_INFO_HIST);
					}
				});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_SESSION_INFO_HIST).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_SESSION_INFO_HIST)),
						AuthnAddressConstants.UPDATE_SESSION_INFO_HIST, AuthnSqlQueries.UPDATE_SESSION_INFO_HIST);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_SESSION_INFO_HIST);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO)),
								AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO, AuthnSqlQueries.CUSTOM_SEARCH_SIGNIN_INFO);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO)),
								AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO, AuthnSqlQueries.CUSTOM_UPDATE_SIGNIN_INFO);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_SIGNIN_INFO).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_SIGNIN_INFO)),
						AuthnAddressConstants.CREATE_SIGNIN_INFO, AuthnSqlQueries.CREATE_SIGNIN_INFO);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_SIGNIN_INFO);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_SIGNIN_INFO).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_SIGNIN_INFO)),
						AuthnAddressConstants.GET_ALL_SIGNIN_INFO, AuthnSqlQueries.GET_ALL_SIGNIN_INFO);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_SIGNIN_INFO);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO)),
						AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO, AuthnSqlQueries.GET_BY_ID_SIGNIN_INFO);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_SIGNIN_INFO).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_SIGNIN_INFO)),
						AuthnAddressConstants.UPDATE_SIGNIN_INFO, AuthnSqlQueries.UPDATE_SIGNIN_INFO);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_SIGNIN_INFO);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO_HIST)),
								AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO_HIST,
								AuthnSqlQueries.CUSTOM_SEARCH_SIGNIN_INFO_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_SIGNIN_INFO_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO_HIST)),
								AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO_HIST,
								AuthnSqlQueries.CUSTOM_UPDATE_SIGNIN_INFO_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_SIGNIN_INFO_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_SIGNIN_INFO_HIST).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_SIGNIN_INFO_HIST)),
						AuthnAddressConstants.CREATE_SIGNIN_INFO_HIST, AuthnSqlQueries.CREATE_SIGNIN_INFO_HIST);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_SIGNIN_INFO_HIST);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_SIGNIN_INFO_HIST).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_SIGNIN_INFO_HIST)),
						AuthnAddressConstants.GET_ALL_SIGNIN_INFO_HIST, AuthnSqlQueries.GET_ALL_SIGNIN_INFO_HIST);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_SIGNIN_INFO_HIST);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO_HIST)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO_HIST)),
								AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO_HIST, AuthnSqlQueries.GET_BY_ID_SIGNIN_INFO_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_SIGNIN_INFO_HIST);
					}
				});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_SIGNIN_INFO_HIST).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_SIGNIN_INFO_HIST)),
						AuthnAddressConstants.UPDATE_SIGNIN_INFO_HIST, AuthnSqlQueries.UPDATE_SIGNIN_INFO_HIST);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_SIGNIN_INFO_HIST);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_TOKENS).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_TOKENS)),
						AuthnAddressConstants.CUSTOM_SEARCH_TOKENS, AuthnSqlQueries.CUSTOM_SEARCH_TOKENS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_TOKENS);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_TOKENS).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_TOKENS)),
						AuthnAddressConstants.CUSTOM_UPDATE_TOKENS, AuthnSqlQueries.CUSTOM_UPDATE_TOKENS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_TOKENS);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_TOKENS).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_TOKENS)),
						AuthnAddressConstants.CREATE_TOKENS, AuthnSqlQueries.CREATE_TOKENS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_TOKENS);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_TOKENS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_TOKENS)),
						AuthnAddressConstants.GET_ALL_TOKENS, AuthnSqlQueries.GET_ALL_TOKENS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_TOKENS);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_TOKENS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_TOKENS)),
						AuthnAddressConstants.GET_BY_ID_TOKENS, AuthnSqlQueries.GET_BY_ID_TOKENS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_TOKENS);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_TOKENS).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_TOKENS)),
						AuthnAddressConstants.UPDATE_TOKENS, AuthnSqlQueries.UPDATE_TOKENS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_TOKENS);
			}
		});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_USER_PERMISSION_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder.getPreProcessList(
												AuthnAddressConstants.CUSTOM_SEARCH_USER_PERMISSION_HIST)),
								AuthnAddressConstants.CUSTOM_SEARCH_USER_PERMISSION_HIST,
								AuthnSqlQueries.CUSTOM_SEARCH_USER_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_USER_PERMISSION_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_USER_PERMISSION_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder.getPreProcessList(
												AuthnAddressConstants.CUSTOM_UPDATE_USER_PERMISSION_HIST)),
								AuthnAddressConstants.CUSTOM_UPDATE_USER_PERMISSION_HIST,
								AuthnSqlQueries.CUSTOM_UPDATE_USER_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_USER_PERMISSION_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_USER_PERMISSION_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CREATE_USER_PERMISSION_HIST)),
								AuthnAddressConstants.CREATE_USER_PERMISSION_HIST, AuthnSqlQueries.CREATE_USER_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CREATE_USER_PERMISSION_HIST);
					}
				});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_USER_PERMISSION_HIST)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_ALL_USER_PERMISSION_HIST)),
								AuthnAddressConstants.GET_ALL_USER_PERMISSION_HIST, AuthnSqlQueries.GET_ALL_USER_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_ALL_USER_PERMISSION_HIST);
					}
				});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_USER_PERMISSION_HIST)
				.handler(routingContext -> {
					try {
						JsonObject data = new JsonObject();
						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(data,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.GET_BY_ID_USER_PERMISSION_HIST)),
								AuthnAddressConstants.GET_BY_ID_USER_PERMISSION_HIST,
								AuthnSqlQueries.GET_BY_ID_USER_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_USER_PERMISSION_HIST);
					}
				});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_USER_PERMISSION_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.UPDATE_USER_PERMISSION_HIST)),
								AuthnAddressConstants.UPDATE_USER_PERMISSION_HIST, AuthnSqlQueries.UPDATE_USER_PERMISSION_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.UPDATE_USER_PERMISSION_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_SEARCH_USER_ROLE_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_SEARCH_USER_ROLE_HIST)),
								AuthnAddressConstants.CUSTOM_SEARCH_USER_ROLE_HIST, AuthnSqlQueries.CUSTOM_SEARCH_USER_ROLE_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_SEARCH_USER_ROLE_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CUSTOM_UPDATE_USER_ROLE_HIST)
				.handler(routingContext -> {
					try {

						JsonObject inputJson = routingContext.getBodyAsJson();
						log.info("Input Request : " + inputJson.encodePrettily());

						processDbEbRequest(routingContext,
								AuthnPreProcessor.doProcess(inputJson,
										AuthnPreProcessBuilder
												.getPreProcessList(AuthnAddressConstants.CUSTOM_UPDATE_USER_ROLE_HIST)),
								AuthnAddressConstants.CUSTOM_UPDATE_USER_ROLE_HIST, AuthnSqlQueries.CUSTOM_UPDATE_USER_ROLE_HIST);
					} catch (Exception e) {
						processException(e, routingContext, AuthnAddressConstants.CUSTOM_UPDATE_USER_ROLE_HIST);
					}
				});
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_USER_ROLE_HIST).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_USER_ROLE_HIST)),
						AuthnAddressConstants.CREATE_USER_ROLE_HIST, AuthnSqlQueries.CREATE_USER_ROLE_HIST);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_USER_ROLE_HIST);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_USER_ROLE_HIST).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_USER_ROLE_HIST)),
						AuthnAddressConstants.GET_ALL_USER_ROLE_HIST, AuthnSqlQueries.GET_ALL_USER_ROLE_HIST);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_USER_ROLE_HIST);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_BY_ID_USER_ROLE_HIST).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_BY_ID_USER_ROLE_HIST)),
						AuthnAddressConstants.GET_BY_ID_USER_ROLE_HIST, AuthnSqlQueries.GET_BY_ID_USER_ROLE_HIST);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_BY_ID_USER_ROLE_HIST);
			}
		});
		router.put(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.UPDATE_USER_ROLE_HIST).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.UPDATE_USER_ROLE_HIST)),
						AuthnAddressConstants.UPDATE_USER_ROLE_HIST, AuthnSqlQueries.UPDATE_USER_ROLE_HIST);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.UPDATE_USER_ROLE_HIST);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_PERMISSIONS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_PERMISSIONS)),
						AuthnAddressConstants.GET_ALL_PERMISSIONS, AuthnSqlQueries.GET_ALL_PERMISSIONS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_PERMISSIONS);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.IS_UNIQUE_MODULE_NAME_EXISTS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("module_name", routingContext.request().getParam("module_name"));
				System.out.println("module_name");
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.IS_UNIQUE_MODULE_NAME_EXISTS)),
						AuthnAddressConstants.IS_UNIQUE_MODULE_NAME_EXISTS, AuthnSqlQueries.IS_UNIQUE_MODULE_NAME_EXISTS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.IS_UNIQUE_MODULE_NAME_EXISTS);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.IS_UNIQUE_DB_TABLE_NAME_EXISTS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("db_table_name", routingContext.request().getParam("db_table_name"));
				// Extract the 'db_table_name' parameter from the request
		        String db_table_name = routingContext.request().getParam("db_table_name");

		        // Log the value of 'db_table_name' for debugging
		        System.out.println("db_table_name: " + db_table_name);

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.IS_UNIQUE_DB_TABLE_NAME_EXISTS)),
						AuthnAddressConstants.IS_UNIQUE_DB_TABLE_NAME_EXISTS, AuthnSqlQueries.IS_UNIQUE_DB_TABLE_NAME_EXISTS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.IS_UNIQUE_DB_TABLE_NAME_EXISTS);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_MAP_UNMAP_ROLE_PERMISSION_BY_ROLE_ID).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("roleId", routingContext.request().getParam("roleId"));
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_MAP_UNMAP_ROLE_PERMISSION_BY_ROLE_ID)),
						AuthnAddressConstants.GET_MAP_UNMAP_ROLE_PERMISSION_BY_ROLE_ID, AuthnSqlQueries.GET_MAP_UNMAP_ROLE_PERMISSION_BY_ROLE_ID);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_MAP_UNMAP_ROLE_PERMISSION_BY_ROLE_ID);
			}
		});
		
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_MAP_UNMAP_ROLE_PERMISSIONS).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_MAP_UNMAP_ROLE_PERMISSIONS)),
						AuthnAddressConstants.CREATE_MAP_UNMAP_ROLE_PERMISSIONS, AuthnSqlQueries.CREATE_MAP_UNMAP_ROLE_PERMISSIONS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_MAP_UNMAP_ROLE_PERMISSIONS);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_MAP_UNMAP_MODULE_MENU_BY_MODULE_ID).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("moduleId", routingContext.request().getParam("moduleId"));
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_MAP_UNMAP_MODULE_MENU_BY_MODULE_ID)),
						AuthnAddressConstants.GET_MAP_UNMAP_MODULE_MENU_BY_MODULE_ID, AuthnSqlQueries.GET_MAP_UNMAP_MODULE_MENU_BY_MODULE_ID);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_MAP_UNMAP_MODULE_MENU_BY_MODULE_ID);
			}
		});
		
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_MAP_UNMAP_MODULE_MENU).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_MAP_UNMAP_MODULE_MENU)),
						AuthnAddressConstants.CREATE_MAP_UNMAP_MODULE_MENU, AuthnSqlQueries.CREATE_MAP_UNMAP_MODULE_MENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_MAP_UNMAP_MODULE_MENU);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.IS_UNIQUE_MENU_NAME_EXISTS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("menu_name", routingContext.request().getParam("menu_name"));
				System.out.println("menu_name");
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.IS_UNIQUE_MENU_NAME_EXISTS)),
						AuthnAddressConstants.IS_UNIQUE_MENU_NAME_EXISTS, AuthnSqlQueries.IS_UNIQUE_MENU_NAME_EXISTS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.IS_UNIQUE_MENU_NAME_EXISTS);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.IS_UNIQUE_SERVICE_API_URL_EXISTS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("service_api_url", routingContext.request().getParam("service_api_url"));
				System.out.println("service_api_url");
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.IS_UNIQUE_SERVICE_API_URL_EXISTS)),
						AuthnAddressConstants.IS_UNIQUE_SERVICE_API_URL_EXISTS, AuthnSqlQueries.IS_UNIQUE_SERVICE_API_URL_EXISTS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.IS_UNIQUE_SERVICE_API_URL_EXISTS);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.IS_UNIQUE_PERMISSION_NAME_EXISTS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("permission_name", routingContext.request().getParam("permission_name"));
				System.out.println("permission_name");
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.IS_UNIQUE_PERMISSION_NAME_EXISTS)),
						AuthnAddressConstants.IS_UNIQUE_PERMISSION_NAME_EXISTS, AuthnSqlQueries.IS_UNIQUE_PERMISSION_NAME_EXISTS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.IS_UNIQUE_PERMISSION_NAME_EXISTS);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.IS_UNIQUE_ROLE_NAME_EXISTS).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("role_name", routingContext.request().getParam("role_name"));
				System.out.println("role_name");
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.IS_UNIQUE_ROLE_NAME_EXISTS)),
						AuthnAddressConstants.IS_UNIQUE_ROLE_NAME_EXISTS, AuthnSqlQueries.IS_UNIQUE_ROLE_NAME_EXISTS);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.IS_UNIQUE_ROLE_NAME_EXISTS);
			}
		});
		
//		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.IS_UNIQUE_PERMISSION_SERVICE_API_EXISTS).handler(routingContext -> {
//			try {
//				JsonObject data = new JsonObject().put("service_api_url", routingContext.request().getParam("service_api_url"));
//				System.out.println("service_api_url");
//				processDbEbRequest(routingContext,
//						AuthnPreProcessor.doProcess(data,
//								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.IS_UNIQUE_PERMISSION_SERVICE_API_EXISTS)),
//						AuthnAddressConstants.IS_UNIQUE_PERMISSION_SERVICE_API_EXISTS, AuthnSqlQueries.IS_UNIQUE_PERMISSION_SERVICE_API_EXISTS);
//			} catch (Exception e) {
//				processException(e, routingContext, AuthnAddressConstants.IS_UNIQUE_PERMISSION_SERVICE_API_EXISTS);
//			}
//		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_DASHBOARD).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_DASHBOARD)),
						AuthnAddressConstants.GET_DASHBOARD, AuthnSqlQueries.GET_DASHBOARD);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_DASHBOARD);
			}
		});
		
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.AUTH_USER_REGISTER).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.AUTH_USER_REGISTER)),
						AuthnAddressConstants.AUTH_USER_REGISTER, AuthnSqlQueries.AUTH_USER_REGISTER);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.AUTH_USER_REGISTER);
			}
		});

		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.VERIFY_OTP).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.VERIFY_OTP)),
						AuthnAddressConstants.VERIFY_OTP, AuthnSqlQueries.VERIFY_OTP);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.VERIFY_OTP);
			}
		});
		
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.SET_AUTH_USER_PASSWORD).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.SET_AUTH_USER_PASSWORD)),
						AuthnAddressConstants.SET_AUTH_USER_PASSWORD, AuthnSqlQueries.SET_AUTH_USER_PASSWORD);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.SET_AUTH_USER_PASSWORD);
			}
		});
		
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.LOGIN).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.LOGIN)),
						AuthnAddressConstants.LOGIN, AuthnSqlQueries.LOGIN);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.LOGIN);
			}
		});
		
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.VERIFY_EMAIL).handler(routingContext -> {
			try {

				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("Input Request : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(inputJson,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.VERIFY_EMAIL)),
						AuthnAddressConstants.VERIFY_EMAIL, AuthnSqlQueries.VERIFY_EMAIL);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.VERIFY_EMAIL);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_MENU_SUBMENU).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_MENU_SUBMENU)),
						AuthnAddressConstants.GET_ALL_MENU_SUBMENU, AuthnSqlQueries.GET_ALL_MENU_SUBMENU);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_MENU_SUBMENU);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_ALL_LOADER).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject();
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_ALL_LOADER)),
						AuthnAddressConstants.GET_ALL_LOADER, AuthnSqlQueries.GET_ALL_LOADER);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_ALL_LOADER);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_MAPPED_UNMAPPED_ENTITIES_FOR_LOADER).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("authUserId", routingContext.request().getParam("authUserId"));
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_MAPPED_UNMAPPED_ENTITIES_FOR_LOADER)),
						AuthnAddressConstants.GET_MAPPED_UNMAPPED_ENTITIES_FOR_LOADER, AuthnSqlQueries.GET_MAPPED_UNMAPPED_ENTITIES_FOR_LOADER);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_MAPPED_UNMAPPED_ENTITIES_FOR_LOADER);
			}
		});
		
		router.post(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.CREATE_USER).handler(routingContext -> {
			try {
 
				JsonObject inputJson = routingContext.getBodyAsJson();
				mediaUpload(inputJson.getJsonObject("profileImage"), result -> {
					if (result.succeeded()) {
						inputJson.remove("profileImage");
						inputJson.put("profileImage", result.result().getInteger("mediaSno"));
						processDbEbRequest(routingContext,
								PreProcessor.doProcess(inputJson,
										PreProcessBuilder.getPreProcessList(AuthnAddressConstants.CREATE_USER)),
								AuthnAddressConstants.CREATE_USER, AuthnSqlQueries.CREATE_USER);
					}
				});
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.CREATE_USER);
			}
		});
		
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_AUTH_USER).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("qboxEntitySno", routingContext.request().getParam("qboxEntitySno"))
						.put("auth_user_id", routingContext.request().getParam("auth_user_id"));
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_AUTH_USER)),
						AuthnAddressConstants.GET_AUTH_USER, AuthnSqlQueries.GET_AUTH_USER);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_AUTH_USER);
			}
		});
		router.get(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.GET_USER_BY_QBOX_ENTITY).handler(routingContext -> {
			try {
				JsonObject data = new JsonObject().put("qboxEntitySno", routingContext.request().getParam("qboxEntitySno"));
				processDbEbRequest(routingContext,
						AuthnPreProcessor.doProcess(data,
								AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.GET_USER_BY_QBOX_ENTITY)),
						AuthnAddressConstants.GET_USER_BY_QBOX_ENTITY, AuthnSqlQueries.GET_USER_BY_QBOX_ENTITY);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.GET_USER_BY_QBOX_ENTITY);
			}
		});
		
		router.delete(AuthnAddressConstants.AUTH_API_PREFIX + AuthnAddressConstants.DELETE_USER_BY_ID).handler(routingContext -> {
			try {
				JsonObject inputJson = routingContext.getBodyAsJson();
				log.info("DELETE Request Input : " + inputJson.encodePrettily());

				processDbEbRequest(routingContext,
					AuthnPreProcessor.doProcess(inputJson,
						AuthnPreProcessBuilder.getPreProcessList(AuthnAddressConstants.DELETE_USER_BY_ID)),
					AuthnAddressConstants.DELETE_USER_BY_ID, AuthnSqlQueries.DELETE_USER_BY_ID);
			} catch (Exception e) {
				processException(e, routingContext, AuthnAddressConstants.DELETE_USER_BY_ID);
			}
		});


		this.httpServer = vertx.createHttpServer();
//		int portNo = Integer.parseInt(Crypto.decryptData(config().getString(ConfigConstants.MICRO_SERVICE_PORT)));
		int portNo = 8914;

		if (this.httpServer != null && portNo > 0) {
			this.httpServer.requestHandler(router).requestStream().toFlowable().subscribe();
			this.httpServer.rxListen(portNo);
			this.httpServer.requestHandler(router).rxListen(portNo).subscribe();
			log.info("ServerVerticle Started " + portNo);
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

	private static boolean isValidEmail(String email) {
		Matcher matcher = EMAIL_PATTERN.matcher(email);
		return matcher.matches();
	}
}
