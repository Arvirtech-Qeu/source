package com.swomb.qbox.process;

import java.util.ArrayList;

import com.swomb.qbox.process.builder.PostProcessBuilder;
import com.swomb.qbox.process.utils.ProcessUtils;
import com.swomb.qbox.process.utils.RequestProcessRule;
import com.swomb.qbox.process.utils.RuleConstants;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

public class PostProcessor {
	
	
	private static final Logger log = LoggerFactory.getLogger(PostProcessor.class);

	public static void doProcess(JsonObject object,  String methodAddress,
			Handler<AsyncResult<Object>> handler) throws Exception{
		
		try {

		ArrayList<RequestProcessRule> ruleList = PostProcessBuilder.getPostProcessList(methodAddress);
			
		if(ruleList!=null)
		ruleList.forEach(rule->{
			log.info(rule.getElementName()+" - "+rule.getRuleName());
		});
		
		if (object.getValue(methodAddress) instanceof JsonObject) {
			JsonObject inObject = (JsonObject) object.getValue(methodAddress);
			handler.handle(Future.succeededFuture(processData((JsonObject) inObject, ruleList)));
		} else if (object.getValue(methodAddress) instanceof JsonArray) {

			JsonArray inObjectArray = (JsonArray) object.getValue(methodAddress);
 
			JsonArray outObjectArray = new JsonArray();
			inObjectArray.forEach(item -> {
				outObjectArray.add(processData((JsonObject) item, ruleList));
			});
			handler.handle(Future.succeededFuture(outObjectArray));
		}else {
			handler.handle(Future.succeededFuture(null));
		}
		}catch(Exception e) {
			log.error(e);
			e.printStackTrace();
		}
	}

	public static JsonObject processData(JsonObject object, ArrayList<RequestProcessRule> ruleList) {
		if (ruleList != null && ruleList.size() > 0 && object != null) {
			
			log.info("Process Data ENTRY");
			
			log.info(object.encodePrettily());
			
			for (RequestProcessRule rule : ruleList) {

				if (rule.getRuleName().equals(RuleConstants.LOWER_CASE_ENCRYPT)) {
					log.info("LOWER_CASE_ENCRYPT : "+object.getString(rule.getElementName()));
					object.put(rule.getElementName(),
							ProcessUtils.encryptInput(object.getString(rule.getElementName()).toLowerCase()));
					
				} else if (rule.getRuleName().equals(RuleConstants.ENCRYPT_DATA)) {
					log.info("ENCRYPT_DATA : "+object.getString(rule.getElementName()));
					object.put(rule.getElementName(),
							ProcessUtils.encryptInput(object.getString(rule.getElementName())));
				} else if (rule.getRuleName().equals(RuleConstants.DECRYPT_DATA)) {
					log.info("DECRYPT_DATA : "+object.getString(rule.getElementName()));
					object.put(rule.getElementName(),
							ProcessUtils.decryptInput(object.getString(rule.getElementName())));
				} else if (rule.getRuleName().equals(RuleConstants.LOWER_CASE_ENCRYPT_WITH_KEY)) {
					log.info("LOWER_CASE_ENCRYPT_WITH_CLIENT_KEY : "+object.getString(rule.getElementName()));
					
					log.info(object.getString("clientSno"));
					
					object.put(rule.getElementName(), ProcessUtils.encryptVendorInput(object.getString("clientSno"),
							object.getString(rule.getElementName()).toLowerCase()));
				} else if (rule.getRuleName().equals(RuleConstants.ENCRYPT_DATA_WITH_KEY)) {
					log.info("ENCRYPT_DATA_WITH_CLIENT_KEY : "+object.getString(rule.getElementName()));
					log.info(object.getString("clientSno"));
					object.put(rule.getElementName(), ProcessUtils.encryptVendorInput(object.getString("clientSno"),
							object.getString(rule.getElementName())));
				} else if (rule.getRuleName().equals(RuleConstants.DECRYPT_DATA_WITH_KEY)) {
					log.info("DECRYPT_DATA_WITH_CLIENT_KEY : "+object.getString(rule.getElementName()));
					log.info(object.getString("clientSno"));
					object.put(rule.getElementName(), ProcessUtils.decryptVendorInput(object.getString("clientSno"),
							object.getString(rule.getElementName())));
				} else if (rule.getRuleName().equals(RuleConstants.ENCRYPT_DATA_WITH_SALT)) {
					log.info("ENCRYPT_DATA_WITH_SALT : "+object.getString(rule.getElementName()));
					object = ProcessUtils.encryptInputWithSalt(object);
				} else if (rule.getRuleName().equals(RuleConstants.MASK_DATA)) {
					log.info("MASK_DATA : "+object.getString(rule.getElementName()));
					object.put(rule.getElementName(),
							ProcessUtils.maskData(object.getString(rule.getElementName()),object.getInteger("maskTypeCd")==null?1:object.getInteger("maskTypeCd")));
				}
			}
			log.info("Process Data EXIT");
		}
		return object;
	}
}
