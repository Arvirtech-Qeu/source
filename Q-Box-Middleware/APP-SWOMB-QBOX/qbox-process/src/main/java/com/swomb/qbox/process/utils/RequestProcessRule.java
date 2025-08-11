package com.swomb.qbox.process.utils;

public class RequestProcessRule {

	private String ruleName;
	private String elementName;
	private int executionOrder;

	public RequestProcessRule() {

	}

	public RequestProcessRule(String ruleName, String elementName, int executionOrder) {
		this.ruleName = ruleName;
		this.elementName = elementName;
		this.executionOrder = executionOrder;
	}

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String ruleName) {
		this.ruleName = ruleName;
	}

	public String getElementName() {
		return elementName;
	}

	public void setElementName(String elementName) {
		this.elementName = elementName;
	}

	public int getExecutionOrder() {
		return executionOrder;
	}

	public void setExecutionOrder(int executionOrder) {
		this.executionOrder = executionOrder;
	}

}
