package com.swomb.qbox.crypto;

import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

public class CryptoDataEntity {
	
	private static final Logger log = LoggerFactory.getLogger(CryptoDataEntity.class);

	private Long cryptoConfigSno;
	private String sourceFolderPath;
	private String keyStoreFileName;
	private String masterKeyFileName;
	private String keyStoreFileData;
	private String masterKeyFileData;
	private String fileKeyPassword;
	private String fileKeyAliasName;
	private String cryptographyAlgorithm;
	private String keystoreType;
	private String createdDate;
	private String encryptionKey;
	private Long createdBy;
	private Long deploymentSno;

	public CryptoDataEntity(Long cryptoConfigSno, String keyStoreFileName, String sourceFolderPath,
			String masterKeyFileName, String fileKeyPassword, String fileKeyAliasName, String cryptographyAlgorithm,
			String keystoreType,String encryptionKey,Long deploymentSno) {

		this.cryptoConfigSno = cryptoConfigSno;
		this.sourceFolderPath = sourceFolderPath;
		this.keyStoreFileName = keyStoreFileName;
		this.masterKeyFileName = masterKeyFileName;
		this.fileKeyPassword = fileKeyPassword;
		this.fileKeyAliasName = fileKeyAliasName;
		this.cryptographyAlgorithm = cryptographyAlgorithm;
		this.keystoreType = keystoreType;
		this.encryptionKey = encryptionKey;
		this.createdBy = 1L;
		this.deploymentSno = deploymentSno;
	}

	public CryptoDataEntity(JsonObject json) {
		this.cryptoConfigSno = json.getLong("cryptoConfigSno");
		this.sourceFolderPath = json.getString("sourceFolderPath");
		this.keyStoreFileName = json.getString("keyStoreFileName");
		this.masterKeyFileName = json.getString("masterKeyFileName");
		this.fileKeyPassword = json.getString("fileKeyPassword");
		this.fileKeyAliasName = json.getString("fileKeyAliasName");
		this.keyStoreFileData = json.getString("keyStoreFileData");
		this.masterKeyFileData = json.getString("masterKeyFileData");
		this.cryptographyAlgorithm = json.getString("cryptographyAlgorithm");
		this.keystoreType = json.getString("keystoreType");
		this.encryptionKey = json.getString("encryptionKey");
		this.deploymentSno = json.getLong("deploymentSno");
		this.createdBy = 1L;
	}

	public String toString() {

		log.info("sourceFolderPath : " + sourceFolderPath);
		log.info("keyStoreFileName : " + keyStoreFileName);
		log.info("masterKeyFileName : " + masterKeyFileName);
		log.info("fileKeyPassword : " + fileKeyPassword);
		log.info("keyStoreFileData : " + keyStoreFileData != null ? "" : keyStoreFileData.toString());
		log.info("masterKeyFileData : " + masterKeyFileData != null ? "" : masterKeyFileData.toString());
		log.info("fileKeyAliasName : " + fileKeyAliasName);
		log.info("cryptographyAlgorithm : " + cryptographyAlgorithm);
		log.info("keystoreType : " + keystoreType);
		log.info("createdBy : " + 1L);
		log.info("encryptionKey : " + encryptionKey);
		log.info("deploymentSno : " + deploymentSno);

		return null;
	}

	public CryptoDataEntity() {

	}

	
	
	public Long getDeploymentSno() {
		return deploymentSno;
	}

	public void setDeploymentSno(Long deploymentSno) {
		this.deploymentSno = deploymentSno;
	}

	public String getKeyStoreFileName() {
		return keyStoreFileName;
	}

	public void setKeyStoreFileName(String keyStoreFileName) {
		this.keyStoreFileName = keyStoreFileName;
	}

	public String getMasterKeyFileName() {
		return masterKeyFileName;
	}

	public void setMasterKeyFileName(String masterKeyFileName) {
		this.masterKeyFileName = masterKeyFileName;
	}

	public String getFileKeyPassword() {
		return fileKeyPassword;
	}

	public void setFileKeyPassword(String fileKeyPassword) {
		this.fileKeyPassword = fileKeyPassword;
	}

	public String getFileKeyAliasName() {
		return fileKeyAliasName;
	}

	public void setFileKeyAliasName(String fileKeyAliasName) {
		this.fileKeyAliasName = fileKeyAliasName;
	}

	public String getCryptographyAlgorithm() {
		return cryptographyAlgorithm;
	}

	public void setCryptographyAlgorithm(String cryptographyAlgorithm) {
		this.cryptographyAlgorithm = cryptographyAlgorithm;
	}

	public String getKeystoreType() {
		return keystoreType;
	}

	public void setKeystoreType(String keystoreType) {
		this.keystoreType = keystoreType;
	}

	public String getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(String createdDate) {
		this.createdDate = createdDate;
	}

	public Long getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Long createdBy) {
		this.createdBy = createdBy;
	}

	public String getSourceFolderPath() {
		return sourceFolderPath;
	}

	public void setSourceFolderPath(String sourceFolderPath) {
		this.sourceFolderPath = sourceFolderPath;
	}

	public String getKeyStoreFileData() {
		return keyStoreFileData;
	}

	public void setKeyStoreFileData(String keyStoreFileData) {
		this.keyStoreFileData = keyStoreFileData;
	}

	public String getMasterKeyFileData() {
		return masterKeyFileData;
	}

	public void setMasterKeyFileData(String masterKeyFileData) {
		this.masterKeyFileData = masterKeyFileData;
	}

	public String getEncryptionKey() {
		return encryptionKey;
	}

	public void setEncryptionKey(String encryptionKey) {
		this.encryptionKey = encryptionKey;
	}

	public Long getCryptoConfigSno() {
		return cryptoConfigSno;
	}

	public void setCryptoConfigSno(Long cryptoConfigSno) {
		this.cryptoConfigSno = cryptoConfigSno;
	}

	public static void toJson(CryptoDataEntity obj, JsonObject json) {

		if (obj.getCryptoConfigSno() != null) {
			json.put("cryptoConfigSno", obj.getCryptoConfigSno());
		}

		if (obj.getDeploymentSno() != null) {
			json.put("deploymentSno", obj.getDeploymentSno());
		}

		if (obj.getEncryptionKey() != null) {
			json.put("encryptionKey", obj.getEncryptionKey());
		}

		if (obj.getMasterKeyFileData() != null) {
			json.put("masterKeyFileData", obj.getMasterKeyFileData());
		}

		if (obj.getKeyStoreFileData() != null) {
			json.put("keyStoreFileData", obj.getKeyStoreFileData());
		}

		if (obj.getSourceFolderPath() != null) {
			json.put("sourceFolderPath", obj.getSourceFolderPath());
		}

		if (obj.getKeystoreType() != null) {
			json.put("keystoreType", obj.getKeystoreType());
		}

		if (obj.getKeyStoreFileName() != null) {
			json.put("keyStoreFileName", obj.getKeyStoreFileName());
		}

		if (obj.getMasterKeyFileName() != null) {
			json.put("masterKeyFileName", obj.getMasterKeyFileName());
		}

		if (obj.getFileKeyPassword() != null) {
			json.put("fileKeyPassword", obj.getFileKeyPassword());
		}

		if (obj.getFileKeyAliasName() != null) {
			json.put("fileKeyAliasName", obj.getFileKeyAliasName());
		}

		if (obj.getCryptographyAlgorithm() != null)

		{
			json.put("cryptographyAlgorithm", obj.getCryptographyAlgorithm());
		}

		if (obj.getSourceFolderPath() != null) {
			json.put("sourceFolderPath", obj.getSourceFolderPath());
		}
	}

}