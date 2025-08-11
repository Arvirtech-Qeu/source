package com.swomb.qbox.common.model;

import io.vertx.core.json.JsonObject;

public class KongConsumerJWT {

	private String customId;
	private String secret;
	private String key;
	private String username;
	private String consumerId;
	private String createdAt;

	public KongConsumerJWT(JsonObject obj) {
		if (obj.getString("customId") != null)
			this.customId = obj.getString("customId");
		if (obj.getString("secret") != null)
			this.secret = obj.getString("secret");
		if (obj.getString("key") != null)
			this.key = obj.getString("key");
		if (obj.getString("username") != null)
			this.username = obj.getString("username");
		if (obj.getString("consumerId") != null)
			this.consumerId = obj.getString("consumerId");
		if (obj.getString("createdAt") != null)
			this.createdAt = obj.getString("createdAt");
	}

	public JsonObject toJson() {
		JsonObject json = new JsonObject();
		toJson(this, json);
		return json;
	}

	public static void toJson(KongConsumerJWT obj, JsonObject json) {

		if (obj.getCustomId() != null) {
			json.put("customId", obj.getCustomId());
		}
		if (obj.getSecret() != null) {
			json.put("secret", obj.getSecret());
		}
		if (obj.getKey() != null) {
			json.put("key", obj.getKey());
		}
		if (obj.getUsername() != null) {
			json.put("username", obj.getUsername());
		}
		if (obj.getConsumerId() != null) {
			json.put("consumerId", obj.getConsumerId());
		}
		if (obj.getCreatedAt() != null) {
			json.put("createdAt", obj.getCreatedAt());
		}
	}

	public KongConsumerJWT() {

	}

	public String getCustomId() {
		return customId;
	}

	public void setCustomId(String customId) {
		this.customId = customId;
	}

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getConsumerId() {
		return consumerId;
	}

	public void setConsumerId(String consumerId) {
		this.consumerId = consumerId;
	}

	public String getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}
}
