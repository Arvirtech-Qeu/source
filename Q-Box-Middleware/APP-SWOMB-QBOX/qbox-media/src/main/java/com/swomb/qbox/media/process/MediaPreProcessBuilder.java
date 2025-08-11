package com.swomb.qbox.media.process;

import java.util.ArrayList;
import java.util.HashMap;

import com.swomb.qbox.process.utils.RequestProcessRule;
import com.swomb.qbox.process.utils.RuleConstants;

public class MediaPreProcessBuilder {

	private MediaPreProcessBuilder() {
	}

	private static HashMap<String, ArrayList<RequestProcessRule>> preprocessRuleListMap;

	public static ArrayList<RequestProcessRule> getPreProcessList(String apiName) {

		if (preprocessRuleListMap == null) {
			buildPreProcessList();
		}
		return preprocessRuleListMap.get(apiName);
	}

	public static void buildPreProcessList() {
		ArrayList<RequestProcessRule> ruleList = new ArrayList<RequestProcessRule>();
		preprocessRuleListMap  = new HashMap<String, ArrayList<RequestProcessRule>>();
		
		RequestProcessRule userPassword = new RequestProcessRule();
		userPassword.setRuleName(RuleConstants.ENCRYPT_DATA);
		userPassword.setElementName("password");
		ruleList.add(userPassword);

	}
}
