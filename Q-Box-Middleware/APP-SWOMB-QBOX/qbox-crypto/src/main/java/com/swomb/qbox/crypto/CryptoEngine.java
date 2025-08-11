package com.swomb.qbox.crypto;

import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.KeyStore;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;

import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;

public class CryptoEngine implements CryptoInterface {

	
	Logger LOGGER = LoggerFactory.getLogger(CryptoEngine.class.getName());
	
	private Key key = null;
	private String cryptoAlgorithm = null;

	public CryptoEngine() {

	}

	public CryptoEngine(CryptoDataEntity cryptoEntity) throws Exception {
		 LOGGER.info("CryptoEngine staterd for "+cryptoEntity.getDeploymentSno());
		

		String encKey = null;

		cryptoEntity.toString();

		if (cryptoEntity.getMasterKeyFileData() != null)
			encKey = CryptoUtilities
					.readKeyFile(ProcessUtils.decodeBase64ToInputStream(cryptoEntity.getMasterKeyFileData()));
		else
			encKey = CryptoUtilities.readKeyFile(cryptoEntity.getMasterKeyFileName());
		 LOGGER.info("CryptoEngine staterd");
		cryptoAlgorithm = cryptoEntity.getCryptographyAlgorithm();
		String password = new PCrypt(encKey).decrypt(cryptoEntity.getFileKeyPassword());
		 LOGGER.info(password);
		String alias = new PCrypt(encKey).decrypt(cryptoEntity.getFileKeyAliasName());
		 LOGGER.info(alias);
		KeyStore keyStore = KeyStore.getInstance(cryptoEntity.getKeystoreType());
		// String keyDeStoreFile =
		// PCrypt.getPcrypt(CryptoUtilities.readKeyFile(keyFile)).decrypt(keyStoreFile)
		// ;
		 //LOGGER.info(keyDeStoreFile);

		InputStream keyStoreFileData = null;
		if (cryptoEntity.getKeyStoreFileData() != null) {
			keyStoreFileData = ProcessUtils.decodeBase64ToInputStream(cryptoEntity.getKeyStoreFileData());
		} else {
			String keyDeStoreFile = new PCrypt(encKey).decrypt(cryptoEntity.getKeyStoreFileName());
			 LOGGER.info(keyDeStoreFile);
			keyStoreFileData = new FileInputStream(keyDeStoreFile);
		}

		keyStore.load(keyStoreFileData, password.toCharArray());
		key = keyStore.getKey(alias, password.toCharArray());
		 LOGGER.info("CryptoEngine Initialized");

		/*
		 * String fileKey =
		 * CryptoUtilities.readKeyFile(cryptoEntity.getMasterKeyFileData());
		 * cryptoAlgorithm = cryptoEntity.getCryptographyAlgorithm(); String password =
		 * PCrypt.getPcrypt(cryptoEntity.getEncryptionKey()).decrypt(cryptoEntity.
		 * getFileKeyPassword());  LOGGER.info(password); String alias =
		 * PCrypt.getPcrypt(cryptoEntity.getEncryptionKey()).decrypt(cryptoEntity.
		 * getFileKeyAliasName());  LOGGER.info(alias); KeyStore keyStore =
		 * KeyStore.getInstance(cryptoEntity.getKeystoreType()); String keyDeStoreFile =
		 * PCrypt.getPcrypt(cryptoEntity.getEncryptionKey()).decrypt(cryptoEntity.
		 * getKeyStoreFileName());  LOGGER.info(keyDeStoreFile);
		 * keyStore.load(cryptoEntity.getKeyStoreFileData(), password.toCharArray());
		 * key = keyStore.getKey(alias, password.toCharArray()); //
		 * LOGGER.info("CryptoEngine Initializeds");
		 */ }

	public String encryptData(String data) throws Exception {
		if (key != null) {
			SecretKeySpec keySpec = new SecretKeySpec(key.getEncoded(), cryptoAlgorithm);
			Cipher cipher = Cipher.getInstance(cryptoAlgorithm);
			cipher.init(Cipher.ENCRYPT_MODE, keySpec);
			data = new String(data.getBytes(), StandardCharsets.UTF_8.name());
			byte[] byteData = cipher.doFinal(data.getBytes());
			return new String(Base64.encodeBase64(byteData), StandardCharsets.UTF_8.name());
		}
		return null;
	}

	public String decryptData(String data) throws Exception {
		if (key != null) {
			Cipher cipher = Cipher.getInstance(cryptoAlgorithm);
			cipher.init(Cipher.DECRYPT_MODE, key);
			byte[] encrypted = Base64.decodeBase64(data.getBytes());
			return new String(cipher.doFinal(encrypted));
		}
		return null;
	}
}
