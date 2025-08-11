package com.swomb.qbox.process.builder;

import java.util.ArrayList;
import java.util.HashMap;

import com.swomb.qbox.common.util.AddressConstants;
import com.swomb.qbox.process.utils.RequestProcessRule;

public class PreProcessBuilder {

	private PreProcessBuilder() {
	}

	private static HashMap<String, ArrayList<RequestProcessRule>> preprocessRuleListMap;

	public static ArrayList<RequestProcessRule> getPreProcessList(String apiName) {

		if (preprocessRuleListMap == null) {
			buildPreProcessList();
		}
		return preprocessRuleListMap.get(apiName);
	}

	public static void buildPreProcessList() {

		preprocessRuleListMap = new HashMap<String, ArrayList<RequestProcessRule>>();
	}
}
