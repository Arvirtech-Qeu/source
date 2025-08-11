package com.swomb.qbox;

import java.security.Key;

import javax.crypto.Cipher;

import org.apache.commons.codec.binary.Base64;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.swomb.qbox.common.AppRestAPIBaseVerticle;
import com.swomb.qbox.common.util.ConfigConstants;
import com.swomb.qbox.crypto.Crypto;
import com.swomb.qbox.process.PostProcessor;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonObject;
import io.vertx.pgclient.PgConnectOptions;
import io.vertx.reactivex.pgclient.PgPool;
import io.vertx.reactivex.sqlclient.Row;
import io.vertx.reactivex.sqlclient.RowSet;
import io.vertx.reactivex.sqlclient.SqlConnection;
import io.vertx.reactivex.sqlclient.Tuple;
import io.vertx.sqlclient.PoolOptions;

public class DBManagerVerticle extends AppRestAPIBaseVerticle {

	Logger log = LoggerFactory.getLogger(DBManagerVerticle.class.getName());
	PgConnectOptions connectOptions;
	PoolOptions poolOptions;
	PgPool pool;

	public void start() throws Exception {
		log.info("DBManagerVerticle started");
		super.start();
		// TODO Auto-generated method stub
		this.databaseConnection();
	}

	public void databaseConnection() {

		try {
			/*connectOptions = new PgConnectOptions()
					.setPort(Integer.parseInt(Crypto.decryptData(config().getString(ConfigConstants.DATABASE_PG_PORT))))
					.setHost(Crypto.decryptData(config().getString(ConfigConstants.DATABASE_PG_HOST)))
					.setDatabase(Crypto.decryptData(config().getString(ConfigConstants.DATABASE_PG_NAME)))
					.setUser(Crypto.decryptData(config().getString(ConfigConstants.DATABASE_PG_USERNAME)))
					.setPassword(Crypto.decryptData(config().getString(ConfigConstants.DATABASE_PG_PASSWORD)));
			poolOptions = new PoolOptions().setMaxSize(Integer.parseInt(config().getString(ConfigConstants.DATABASE_PG_CONN_POOL_SIZE)));*/
			
			
			connectOptions = new PgConnectOptions()
					.setPort(5432)
					.setHost("localhost")
					.setDatabase("qbox_db")
					.setUser("qbox_admin")
					.setPassword("qbox123");
			poolOptions = new PoolOptions().setMaxSize(2000);
			
			
			
			pool = PgPool.pool(vertx, connectOptions, poolOptions);
			log.info("Database connection started");
		} catch (Exception e) {
			e.getStackTrace();
			log.error("Error in Connection Handling");
		}
	}


//	protected void runQuery(String query, JsonObject data, String methodAddress,
//			Handler<AsyncResult<Object>> handler) {
//
//		log.info("---> " + query + data);
//
//		pool.getConnection(connectionHandler -> {
//			if (connectionHandler.succeeded()) {
//				SqlConnection poolConnection = connectionHandler.result();
//				Tuple tuple = Tuple.of(data);
//				
//				System.out.println("db " + data);
//
//				
////				Tuple tuple = (data != null && !data.isEmpty()) ? Tuple.of(data) : Tuple.tuple();
//				
//				Tuple tuple = Tuple.tuple();
//				if (data != null && !data.isEmpty()) {
//				    for (String key : data.fieldNames()) {
//				        tuple.addValue(data.getValue(key));
//				    }
//				}
//
//				
//				Tuple tuple = Tuple.tuple();
//				if (data != null && !data.isEmpty()) {
//				    for (String key : data.fieldNames()) {
//				        tuple.addValue(data.getValue(key));
//				    }
//				}
//				
//				System.out.println(tuple);
//
//				poolConnection.preparedQuery(query).execute(tuple, ar -> {
//					if (ar.succeeded()) {
//						try {
//							RowSet<Row> result = ar.result();
//							for (Row row : result) {
//								JsonObject jsonObj = new JsonObject();
//								for (int i = 0; i < result.columnsNames().size(); i++) {
//									jsonObj.put(row.getColumnName(i), row.getValue(i));
//								}
//
//								log.info("Data From DB : "+jsonObj.encode());
//								if (jsonObj != null) {
//									
//									PostProcessor.doProcess(jsonObj,methodAddress,
//											object -> {
//												if (object.succeeded()) {
//													handler.handle(
//															Future.succeededFuture(object.result()));
//													poolConnection.close();
//												} else {
//													poolConnection.close();
//													log.info("Failure: " + object.cause().getMessage());
//												}
//											});
//								}
//
//							}
//
//						} catch (Exception e) {
//							log.info("Exception: " + ar.cause().getMessage());
//							poolConnection.close();
//							handler.handle(Future.failedFuture(e));
//						}
//					} else {
//						log.info("Failure: " + ar.cause().getMessage());
//						poolConnection.close();
//						handler.handle(Future.failedFuture(ar.cause()));
//					}
//
//				});
//
//			} else {
//				log.info("Failure: " + connectionHandler.cause().getMessage());
//				handler.handle(Future.failedFuture(connectionHandler.cause()));
//			}
//		});
//	}
	
	protected void runQuery(String query, JsonObject data, String methodAddress,
			Handler<AsyncResult<Object>> handler) {

		log.info("---> " + query + data);

		pool.getConnection(connectionHandler -> {
			if (connectionHandler.succeeded()) {
				SqlConnection poolConnection = connectionHandler.result();
//				Tuple tuple = Tuple.of(data);
				
				boolean requiresParameters = query.contains("$1");

				Tuple tuple;
				
				if((requiresParameters && data != null && !data.isEmpty()) || (requiresParameters && data.isEmpty()) ) {
					System.out.println("if");
					tuple = Tuple.of(data);
				}else {
					System.out.println("else");
					tuple = Tuple.tuple();
				}

				poolConnection.preparedQuery(query).execute(tuple, ar -> {
					if (ar.succeeded()) {
						try {
							RowSet<Row> result = ar.result();
							for (Row row : result) {
								JsonObject jsonObj = new JsonObject();
								for (int i = 0; i < result.columnsNames().size(); i++) {
									jsonObj.put(row.getColumnName(i), row.getValue(i));
								}

								log.info("Data From DB : "+jsonObj.encode());
								if (jsonObj != null) {
									
									PostProcessor.doProcess(jsonObj,methodAddress,
											object -> {
												if (object.succeeded()) {
													handler.handle(
															Future.succeededFuture(object.result()));
													poolConnection.close();
												} else {
													poolConnection.close();
													log.info("Failure: " + object.cause().getMessage());
												}
											});
								}

							}

						} catch (Exception e) {
							log.info("Exception: " + ar.cause().getMessage());
							poolConnection.close();
							handler.handle(Future.failedFuture(e));
						}
					} else {
						log.info("Failure: " + ar.cause().getMessage());
						poolConnection.close();
						handler.handle(Future.failedFuture(ar.cause()));
					}

				});

			} else {
				log.info("Failure: " + connectionHandler.cause().getMessage());
				handler.handle(Future.failedFuture(connectionHandler.cause()));
			}
		});
	}

	private static Key key = null;
	private static String cryptoAlgorithm = null;

	public static String decryptData(String data) throws Exception {
		if (key != null) {
			Cipher cipher = Cipher.getInstance(cryptoAlgorithm);
			cipher.init(Cipher.DECRYPT_MODE, key);
			byte[] encrypted = Base64.decodeBase64(data.getBytes());
			return new String(cipher.doFinal(encrypted));
		}
		return null;
	}

	

	@SuppressWarnings("unchecked")
	protected void runQuery(String query, Handler<AsyncResult<JSONArray>> handler) {

		log.info("--->" + query);

		pool.getConnection(connectionHandler -> {
			if (connectionHandler.succeeded()) {
				SqlConnection poolConnection = connectionHandler.result();
//				 = Tuple.of(data);
				poolConnection.preparedQuery(query).execute(ar -> {
					if (ar.succeeded()) {
						try {
							RowSet<Row> result = ar.result();
							JSONArray resultList = new JSONArray();
							for (Row row : result) {
								JSONObject jsonObj = new JSONObject();
								for (int i = 0; i < result.columnsNames().size(); i++) {
									jsonObj.put(row.getColumnName(i), row.getValue(i));
								}
								resultList.add(jsonObj);
							}

							poolConnection.close();
							handler.handle(Future.succeededFuture(resultList));
						} catch (Exception e) {
							// TODO: handle exception
							poolConnection.close();
							handler.handle(Future.failedFuture(e));
						}
					} else {
						log.info("Failure: " + ar.cause().getMessage());
						poolConnection.close();
						handler.handle(Future.failedFuture(ar.cause()));
					}

				});

			} else {
				log.info("Failure: " + connectionHandler.cause().getMessage());
				handler.handle(Future.failedFuture(connectionHandler.cause()));
			}
		});
	}

	@SuppressWarnings("unchecked")
	protected void runSP(String query, JsonObject data, Handler<AsyncResult<JSONArray>> handler) {

		log.info("--->" + query);

		pool.getConnection(connectionHandler -> {
			if (connectionHandler.succeeded()) {
				SqlConnection poolConnection = connectionHandler.result();
				
//				Tuple tuple = Tuple.of(data);
//				Tuple tuple = query.contains("$1") ? Tuple.of(data) : Tuple.tuple();
				Tuple tuple = (query.contains("$1") && data != null && !data.isEmpty()) ? Tuple.of(data) : Tuple.tuple();		
			
				poolConnection.preparedQuery(query).execute(tuple, ar -> {
					if (ar.succeeded()) {
						try {
							RowSet<Row> result = ar.result();
							JSONArray resultList = new JSONArray();
							for (Row row : result) {
								JSONObject jsonObj = new JSONObject();
								for (int i = 0; i < result.columnsNames().size(); i++) {
									jsonObj.put(row.getColumnName(i), row.getValue(i));
								}
								resultList.add(jsonObj);
							}

							poolConnection.close();
							handler.handle(Future.succeededFuture(resultList));
						} catch (Exception e) {
							// TODO: handle exception
							poolConnection.close();
							handler.handle(Future.failedFuture(e));
						}
					} else {
						log.info("Failure: " + ar.cause().getMessage());
						poolConnection.close();
						handler.handle(Future.failedFuture(ar.cause()));
					}

				});

			} else {
				log.info("Failure: " + connectionHandler.cause().getMessage());
				handler.handle(Future.failedFuture(connectionHandler.cause()));
			}
		});
	}
	
	
}