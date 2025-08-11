package com.swomb.qbox.crypto;

import java.security.SecureRandom;
import java.util.Random;



public class CryptoSalt {
	////private static Logger LOGGER = LogManager.getLogger(CryptoSalt.class.getName());
	
	public static String applyCryptoSalt(String data, SaltVo saltVo) throws Exception {
		return getFinalString(saltVo, data);
	}

	public static String decryptSalt() throws Exception {
		return null;
	}

	@SuppressWarnings("unused")
	private static int getInt(String binary) throws Exception {
		try {
			return Integer.parseInt(binary, 2);
		} catch (Exception e) {
			return 0;
		}
	}

	private static String getBinary(int intValue) throws Exception {
		String returnString = "";
		try {
			if (intValue < 2) {
				returnString += "000";
			} else if (intValue < 4) {
				returnString += "00";
			} else if (intValue < 8) {
				returnString += "0";
			}
			return returnString + Integer.toBinaryString(intValue);
		} catch (Exception e) {
			return "0000";
		}
	}

	public static SaltVo generateSaltVo() throws Exception {
		SaltVo vo = new SaltVo();
		vo.setSaltOption(generateSaltOptions());
		vo.setSalt(generateRandomSalt());
		//LOGGER.debug(vo.getSaltOption());
		//LOGGER.debug(vo.getSalt());
		return vo;
	}

	public static String generateSaltOptions() throws Exception {
		double dob = Math.random() * 100000;
		//LOGGER.debug((int) dob);
		return getBinary(((int) dob) % 16);
	}

	public static String generateRandomSalt() throws Exception {
		Random r = new SecureRandom();
		byte[] salt = new byte[40];
		r.nextBytes(salt);
		 String saltString = new String(salt, "UTF-8").substring(0,20);
		 saltString = saltString.replaceAll(" ", "X");
		 saltString = saltString.replaceAll("\b", "B");
		 saltString = saltString.replaceAll("\t", "T");
		 saltString = saltString.replaceAll("\n", "N");
		 return saltString;
	}

	public static String getFinalString(SaltVo saltVo, String data) throws Exception {
		String returnString = "";
		String saltOption = saltVo.getSaltOption();
		String salt = saltVo.getSalt();
		
		CryptoEngine crypto = new CryptoEngine(null);
		
		if (saltOption.equals(CryptoConstants.SALT_ZERO)) {
			returnString = crypto.encryptData(salt.substring(0, 3) + data + salt.substring(3, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_ONE)) {
			returnString = crypto.encryptData(salt.substring(0, 2) + data + salt.substring(2, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_TWO)) {
			returnString = crypto.encryptData( salt.substring(0, 4) + data+ salt.substring(4, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_FIVE)) {
			returnString = crypto.encryptData( salt.substring(0, 6) + data+ salt.substring(6, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_FOUR)) {
			returnString = crypto.encryptData( salt.substring(0, 8) + data+ salt.substring(8, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_THREE)) {
			returnString = crypto.encryptData( salt.substring(0, 10) + data+ salt.substring(10, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_SIX)) {
			returnString = crypto.encryptData( salt.substring(0, 12) + data+ salt.substring(12, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_EIGHT)) {
			returnString = crypto.encryptData( salt.substring(0, 14) + data+ salt.substring(14, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_SEVEN)) {
			returnString = crypto.encryptData( salt.substring(0, 15) + data+ salt.substring(15, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_NINE)) {
			returnString = crypto.encryptData( salt.substring(0, 16) + data+ salt.substring(16, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_TEN)) {
			returnString = crypto.encryptData( salt.substring(0, 17) + data+ salt.substring(17, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_TWELVE)) {
			returnString = crypto.encryptData( salt.substring(0, 7) + data+ salt.substring(7, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_ELEVEN)) {
			returnString = crypto.encryptData( salt.substring(0, 9) + data+ salt.substring(9, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_THIRTEEN)) {
			returnString = crypto.encryptData( salt.substring(0, 13) + data+ salt.substring(13, 20));
		} else if (saltOption.equals(CryptoConstants.SALT_FOURTEEN)) {
			returnString = crypto.encryptData( salt.substring(0, 11) + data+ salt.substring(11, 20));
		} else {
			returnString = crypto.encryptData( salt.substring(5, 10) + data+ salt.substring(5, 20));
		}
		return returnString + saltOption;
	}

}
