package com.swomb.qbox.process.utils;

import com.swomb.qbox.crypto.Crypto;

import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

public class ProcessUtils {
	
	private static final Logger log = LoggerFactory.getLogger(ProcessUtils.class);

	public static String encryptVendorInput(String clientSno, Object inData) {

		log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Inside encryptVendorInput");
		
		log.info("clientSno :"+clientSno);
		
		String data=inData+"";
		
		log.info("data : "+data);
		
		if (clientSno == null) {
			log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Returning Default");
			
			return encryptInput(data);

		}
		
		Long vendoSnoNumber=0L;
		
		try {
			vendoSnoNumber = Long.parseLong(clientSno);
		}catch(NumberFormatException ne) {
			try {
				vendoSnoNumber = Long.parseLong(decryptInput(clientSno));
			}catch(Exception e) {
				vendoSnoNumber=0L;
			}
		}
		
		log.info("@@@@@@@@@@@@@@@@@@@@@@@@vendoRRRRRRRRRRRRSnoNumber : "+vendoSnoNumber);
		

		if (data != null && data.length() > 0) {
			try {
				data = Crypto.encryptData(vendoSnoNumber, data);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return data;
	}


	public static String decryptVendorInput(String clientSno, Object inData) {

		String data=inData+"";
		if (clientSno == null) {
			return decryptInput(data);

		}
		
		Long vendoSnoNumber=0L;
		
		try {
			vendoSnoNumber = Long.parseLong(clientSno);
		}catch(NumberFormatException ne) {
			vendoSnoNumber = Long.parseLong(decryptInput(clientSno));
		}
		
		log.info("vendoSnoNumber : "+vendoSnoNumber);

		if (data != null && data.length() > 0) {
			try {
				data = Crypto.decryptData(vendoSnoNumber, data);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return data;
	}
	
	
	
	public static String encryptInput(String data) {
		if (data != null && data.length() > 0) {
			try {
				data = Crypto.encryptData(data);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return data;
	}

	public static String decryptInput(String data) {
		if (data != null && data.length() > 0) {
			try {
				data = Crypto.decryptData(data);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return data;
	}

	public static String maskData(String data, int type) {
		if (type == 1)
			return maskFixedLength(data, 8);
		else if  (type == 2)
			return maskAlternateData(data);
		else
			return maskFixedLengthMobileNo(data, 9);
	}

	public static String maskFixedLength(String data, int maxLimit) {

		String maskedData = "";
		if (data != null && data.length() > 0) {

			if (data.length() == 1) {
				for (int i = 0; i < maxLimit - 1; i++) {
					data += "*";
				}
			} else if (data.length() == 2) {
				String tempData = data.substring(0, 1);
				for (int i = 0; i < maxLimit - 2; i++) {
					tempData += "*";
				}
				tempData += data.substring(1, 2);
				data = tempData;
			} else if (data.length() == 3) {
				String tempData = data.substring(0, 1);
				for (int i = 0; i < maxLimit - 2; i++) {
					tempData += "*";
				}
				tempData += data.substring(2, 3);
				data = tempData;
			} else {
				String tempData = data.substring(0, 2);
				for (int i = 0; i < maxLimit - 4; i++) {
					tempData += "*";
				}
				data = tempData + data.substring(data.length() - 2, data.length());
			}

			maskedData = data;

		}
		return maskedData;
	}

	public static String maskFixedLengthMobileNo(String data, int maxLimit) {

		String maskedData = "";
		if (data != null && data.length() > 0) {
			 
				String tempData = data.substring(0, 5);
				for (int i = 0; i < maxLimit - 5; i++) {
					tempData += "*";
				}
				data = tempData + data.substring(data.length() - 2, data.length());
			 
			maskedData = data;

		}
		return maskedData;
	}

	public static String maskAlternateData(String data) {

		String maskedData = "";
		if (data != null && data.length() > 0) {
			try {

				for (int i = 0; i < data.length(); i++) {
					if (i % 2 == 0)
						maskedData += data.substring(i, i + 1);
					else
						maskedData += "*";
				}

			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return maskedData;
	}

	public static JsonObject encryptInputWithSalt(JsonObject data) {
		return data;
	}

	public static JsonObject decryptInputWithSalt(JsonObject data) {
		return data;
	}

	
	public static void main(String[] args) {
		log.info(maskFixedLengthMobileNo("+919841966906",9));
	}
}
