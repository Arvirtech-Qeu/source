package com.swomb.qbox.common.model;

import io.vertx.core.json.JsonObject;

public class ApiDetail {

	private JsonObject payload;
	private int port;
	private String host;
	private String path;
	private boolean ssl = false;
	private String contentType = "application/json; charset=utf-8";;
	private long timeout = 10000;
	private boolean trustAll = true;
	private boolean verifyHost = false;

	public ApiDetail() {
	};

	public ApiDetail(String host, int port, String path, boolean ssl, String contentType, long timeout,
			boolean trustAll, boolean verifyHost, JsonObject payload) {
		this.host = host;
		this.port = port;
		this.path = path;
		this.ssl = ssl;
		this.contentType = contentType;
		this.timeout = timeout;
		this.trustAll = trustAll;
		this.verifyHost = verifyHost;
		this.payload = payload;
	};

	public ApiDetail(String host, int port, String path, boolean ssl, JsonObject payload) {
		this.host = host;
		this.port = port;
		this.path = path;
		this.ssl = ssl;
		this.payload = payload;
	};

	public JsonObject getPayload() {
		return payload;
	}

	public void setPayload(JsonObject payload) {
		this.payload = payload;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public boolean getSsl() {
		return ssl;
	}

	public void setSsl(boolean ssl) {
		this.ssl = ssl;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public long getTimeout() {
		return timeout;
	}

	public void setTimeout(long timeout) {
		this.timeout = timeout;
	}

	public boolean getTrustAll() {
		return trustAll;
	}

	public void setTrustAll(boolean trustAll) {
		this.trustAll = trustAll;
	}

	public boolean getVerifyHost() {
		return verifyHost;
	}

	public void setVerifyHost(boolean verifyHost) {
		this.verifyHost = verifyHost;
	}

}
