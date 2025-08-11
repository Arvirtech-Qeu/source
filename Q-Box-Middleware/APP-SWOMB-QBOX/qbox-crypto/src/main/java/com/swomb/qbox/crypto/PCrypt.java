package com.swomb.qbox.crypto;

import java.security.spec.KeySpec;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;

import org.apache.commons.codec.binary.Base64;


public class PCrypt {

	////private static Logger LOGGER = LogManager.getLogger(PCrypt.class.getName());
	
	/*public static PCrypt pCrypt;

	public static PCrypt getPcrypt(String encryptionKey) throws Exception {
		if (pCrypt == null) {
			pCrypt = new PCrypt(encryptionKey);
		}
		return pCrypt;
	}*/

	public final String UNICODE_FORMAT = "UTF8";
	public final String DESEDE_ENCRYPTION_SCHEME = "DESede";
	public KeySpec keySpec;
	public SecretKeyFactory keyFactory;
	public Cipher cipher;
	public byte[] arrayBytes;
	public String encryptionScheme;
	public SecretKey key;

	public PCrypt(String encryptionKey) throws Exception {
		this.encryptionScheme = DESEDE_ENCRYPTION_SCHEME;
		arrayBytes = encryptionKey.getBytes(UNICODE_FORMAT);
		keySpec = new DESedeKeySpec(arrayBytes);
		keyFactory = SecretKeyFactory.getInstance(encryptionScheme);
		cipher = Cipher.getInstance(encryptionScheme);
		key = keyFactory.generateSecret(keySpec);
	}

	public String encrypt(String unencryptedString) {
		String encryptedString = null;
		try {
			cipher.init(Cipher.ENCRYPT_MODE, key);
			byte[] plainText = unencryptedString.getBytes(UNICODE_FORMAT);
			byte[] encryptedText = cipher.doFinal(plainText);
			encryptedString = new String(Base64.encodeBase64(encryptedText));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return encryptedString;
	}

	public String decrypt(String encryptedString) {
		String decryptedText = null;
		try {
			cipher.init(Cipher.DECRYPT_MODE, key);
			byte[] encryptedText = Base64.decodeBase64(encryptedString.getBytes());
			byte[] plainText = cipher.doFinal(encryptedText);
			decryptedText = new String(plainText);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return decryptedText;
	}
}