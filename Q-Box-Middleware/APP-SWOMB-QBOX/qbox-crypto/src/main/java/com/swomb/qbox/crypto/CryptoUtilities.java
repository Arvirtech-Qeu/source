package com.swomb.qbox.crypto;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.Scanner;

import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

public class CryptoUtilities {
	
	private static final Logger log = LoggerFactory.getLogger(CryptoUtilities.class);

	@SuppressWarnings("resource")
	public static String readKeyFile(ByteArrayInputStream byteArrayInputStr) throws Exception {

		String key = "";
		log.info(byteArrayInputStr.toString());
		int b = 0;
		while ((b = byteArrayInputStr.read()) != -1) {
			// Convert byte to character
			char ch = (char) b;

			key += ch;
		}

		String actualKey = key.substring((key.length() / 2) - 16, (key.length() / 2) + 16);

		log.info("encryptionKey from File : "+actualKey);

		return actualKey;
	}

	@SuppressWarnings("resource")
	public static String readKeyFile(String fileName) throws Exception {
		
		log.info(fileName);
		Scanner scanner = new Scanner(new File(fileName)).useDelimiter("\\Z");
		String key = scanner.next();
		scanner.close();
		return key.substring((key.length()/2)-16,(key.length()/2)+16);
	}

	
	
}
