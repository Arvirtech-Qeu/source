package com.swomb.qbox.common.model;


import io.vertx.core.json.JsonObject;

public class VendorSetting implements Cloneable {

	private Long clientSno = 0L;
	private Long vendorSettingSno = 0L;
	private Integer serviceSno = 0;
	private String host = "";
	private Integer port = 0;
	private Boolean ssl = true;
	private String clientSchema = "";
	private String clientKey = "";
	private String deploymentType = "s";

	public VendorSetting clone() throws CloneNotSupportedException {
		return this;
	}

	public VendorSetting() {
		// Empty constructor
	}

	public VendorSetting(VendorSetting other) {
		this.clientSno = other.clientSno;
		this.vendorSettingSno = other.vendorSettingSno;
		this.serviceSno = other.serviceSno;
		this.host = other.host;
		this.port = other.port;
		this.ssl = other.ssl;
		this.clientSchema = other.clientSchema;
		this.clientKey = other.clientKey;
		this.deploymentType = other.deploymentType;
	}



	public String getDeploymentType() {
		return deploymentType;
	}

	public VendorSetting setDeploymentType(String deploymentType) {
		this.deploymentType = deploymentType;
		return this;
	}

	
	
	
	public String getClientSchema() {
		return clientSchema;
	}

	public VendorSetting setClientSchema(String clientSchema) {
		this.clientSchema = clientSchema;
		return this;
	}

	public String getClientKey() {
		return clientKey;
	}

	public VendorSetting setClientKey(String clientKey) {
		this.clientKey = clientKey;
		return this;
	}

	public VendorSetting(JsonObject json) {
		fromJson(json, this);
	}

	public Long getVendorSettingSno() {
		return vendorSettingSno;
	}

	public VendorSetting setVendorSettingSno(Long vendorSettingSno) {
		this.vendorSettingSno = vendorSettingSno;
		return this;
	}

	public Integer getserviceSno() {
		return serviceSno;
	}

	public VendorSetting setserviceSno(Integer serviceSno) {
		this.serviceSno = serviceSno;
		return this;
	}

	public String getIpAddress() {
		return host;
	}

	public VendorSetting setHost(String ipAddress) {
		this.host = ipAddress;
		return this;
	}

	public Integer getPort() {
		return port;
	}

	public VendorSetting setPort(Integer port) {
		this.port = port;
		return this;
	}

	public Boolean getSsl() {
		return ssl;
	}

	public VendorSetting setSsl(Boolean ssl) {
		this.ssl = ssl;
		return this;
	}

	public Long getclientSno() {
		return clientSno;
	}

	public VendorSetting setclientSno(Long clientSno) {
		this.clientSno = clientSno;
		return this;
	}

	@Override
	public int hashCode() {
		int result = clientSno.hashCode();
		result = 31 * result + clientSno.hashCode();
		return result;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;

		VendorSetting vendor = (VendorSetting) o;

		return clientSno.equals(vendor.clientSno);
	}

	public JsonObject toJson() {
		JsonObject json = new JsonObject();
		toJson(this, json);
		return json;
	}

	@Override
	public String toString() {
		return this.toJson().encodePrettily();
	}

	public static void fromJson(JsonObject json, VendorSetting obj) {

		if (json.getValue("vendorSettingSno".toLowerCase()) instanceof Number) {
			obj.setVendorSettingSno(Long.parseLong("" + json.getValue("vendorSettingSno".toLowerCase())));

		} else if (json.getValue("vendorSettingSno") instanceof Number) {
			obj.setVendorSettingSno(Long.parseLong("" + json.getValue("vendorSettingSno")));

		}

		if (json.getValue("clientSno".toLowerCase()) instanceof Number) {
			obj.setclientSno(Long.parseLong("" + json.getValue("clientSno".toLowerCase())));

		} else if (json.getValue("clientSno") instanceof Number) {
			obj.setclientSno(Long.parseLong("" + json.getValue("clientSno")));

		}

		if (json.getValue("serviceSno".toLowerCase()) instanceof Number) {
			obj.setserviceSno((Integer) json.getValue("serviceSno".toLowerCase()));

		} else if (json.getValue("serviceSno") instanceof Number) {
			obj.setserviceSno((Integer) json.getValue("serviceSno"));

		}
		

		if (json.getValue("deploymentType".toLowerCase()) instanceof String) {
			obj.setDeploymentType((String) json.getValue("deploymentType".toLowerCase()));
		}
		else if (json.getValue("deploymentType") instanceof String) {
			obj.setDeploymentType((String) json.getValue("deploymentType"));
		}

		if (json.getValue("clientSchema".toLowerCase()) instanceof String) {
			obj.setClientSchema((String) json.getValue("clientSchema".toLowerCase()));

		} else if (json.getValue("clientSchema") instanceof String) {
			obj.setClientSchema((String) json.getValue("clientSchema"));

		}

		if (json.getValue("clientKey".toLowerCase()) instanceof String) {
			obj.setClientKey((String) json.getValue("clientKey".toLowerCase()));

		} else if (json.getValue("clientKey") instanceof String) {
			obj.setClientKey((String) json.getValue("clientKey"));

		}

		if (json.getValue("port".toLowerCase()) instanceof Number) {
			obj.setPort((Integer) json.getValue("port".toLowerCase()));

		} else if (json.getValue("port") instanceof Number) {
			obj.setPort((Integer) json.getValue("port"));

		}

		if (json.getValue("host".toLowerCase()) instanceof String) {
			obj.setHost((String) json.getValue("host".toLowerCase()));

		} else if (json.getValue("host") instanceof String) {
			obj.setHost((String) json.getValue("host"));

		}

		if (json.getValue("ssl".toLowerCase()) instanceof Boolean) {
			obj.setSsl((Boolean) json.getValue("ssl".toLowerCase()));

		} else if (json.getValue("ssl") instanceof Boolean) {
			obj.setSsl((Boolean) json.getValue("ssl"));

		}

		if (json.getValue("port".toLowerCase()) instanceof Number) {
			obj.setPort((Integer) json.getValue("port".toLowerCase()));

		} else if (json.getValue("port") instanceof Number) {
			obj.setPort((Integer) json.getValue("port"));

		}

		if (json.getValue("host".toLowerCase()) instanceof String) {
			obj.setHost((String) json.getValue("host".toLowerCase()));

		} else if (json.getValue("host") instanceof String) {
			obj.setHost((String) json.getValue("host"));

		}

		if (json.getValue("ssl".toLowerCase()) instanceof Boolean) {
			obj.setSsl((Boolean) json.getValue("ssl".toLowerCase()));

		} else if (json.getValue("ssl") instanceof Boolean) {
			obj.setSsl((Boolean) json.getValue("ssl"));

		}

		

	}

	public static void toJson(VendorSetting obj, JsonObject json) {

		if (obj.getclientSno() != null) {
			json.put("clientSno", obj.getclientSno());
		}

		if (obj.getVendorSettingSno() != null) {
			json.put("vendorSettingSno", obj.getVendorSettingSno());
		}

		if (obj.getserviceSno() != null) {
			json.put("serviceSno", obj.getserviceSno());
		}
		if (obj.getClientSchema() != null) {
			json.put("clientSchema", obj.getClientSchema());
		}

		if (obj.getClientKey() != null) {
			json.put("clientKey", obj.getClientKey());
		}

		if (obj.getIpAddress() != null) {
			json.put("host", obj.getIpAddress());
		}
		if (obj.getPort() != null) {
			json.put("port", obj.getPort());
		}
		if (obj.getSsl() != null) {
			json.put("ssl", obj.getSsl());
		}
		
		if (obj.getDeploymentType() != null) {
			json.put("deploymentType", obj.getDeploymentType());
		}
		
		
	}
}