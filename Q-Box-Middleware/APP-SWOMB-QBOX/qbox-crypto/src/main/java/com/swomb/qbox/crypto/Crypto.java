package com.swomb.qbox.crypto;

import java.util.HashMap;

public class Crypto {

	private Crypto() {
	}

	public static HashMap<Long, CryptoEngine> deploymentCryptoMap = null;

	public static HashMap<Long, CryptoEngine> getDeploymentCryptoHub() {
		if (deploymentCryptoMap == null) {
			deploymentCryptoMap = new HashMap<Long, CryptoEngine>();
		}
		return deploymentCryptoMap;
	}

	public static String decryptData(Long clientSno, String data) {
		try {
			return getDeploymentCryptoHub().get(clientSno).decryptData(data);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static String encryptData(Long clientSno, String encrypteddata) {
		try {
			return getDeploymentCryptoHub().get(clientSno).encryptData(encrypteddata);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static String decryptData(String data) {
		try {
			return getDeploymentCryptoHub().get(0L).decryptData(data);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static String encryptData(String encrypteddata) {
		try {
			return getDeploymentCryptoHub().get(0L).encryptData(encrypteddata);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static CryptoEngine getCrypto() {

		return getDeploymentCryptoHub().get(0L);
	}

	public static CryptoEngine getCrypto(Integer clientSno) {

		return getDeploymentCryptoHub().get(clientSno);
	}

}
