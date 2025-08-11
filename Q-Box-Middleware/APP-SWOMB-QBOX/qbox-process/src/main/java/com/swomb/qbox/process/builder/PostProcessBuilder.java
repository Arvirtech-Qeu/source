package com.swomb.qbox.process.builder;

import java.util.ArrayList;
import java.util.HashMap;

import com.swomb.qbox.common.util.AddressConstants;
import com.swomb.qbox.process.utils.RequestProcessRule;
import com.swomb.qbox.process.utils.RuleConstants;

public class PostProcessBuilder {

	private PostProcessBuilder() {
	}

	private static HashMap<String, ArrayList<RequestProcessRule>> postProcessRuleListMap;

	public static ArrayList<RequestProcessRule> getPostProcessList(String apiName) {

		if (postProcessRuleListMap == null) {
			buildPostProcessList();
		}
		return postProcessRuleListMap.get(apiName);
	}

	public static void buildPostProcessList() {

		ArrayList<RequestProcessRule> SERVICE_HEALTH_RULE_LIST = new ArrayList<RequestProcessRule>();

		postProcessRuleListMap = new HashMap<String, ArrayList<RequestProcessRule>>();

		RequestProcessRule mobileNo_EncryptRule = new RequestProcessRule();
		mobileNo_EncryptRule.setRuleName(RuleConstants.ENCRYPT_DATA);
		mobileNo_EncryptRule.setElementName("DB");
		mobileNo_EncryptRule.setExecutionOrder(1);
		SERVICE_HEALTH_RULE_LIST.add(mobileNo_EncryptRule);

		postProcessRuleListMap.put(AddressConstants.SERVICE_HEALTH, SERVICE_HEALTH_RULE_LIST);
	}
}
