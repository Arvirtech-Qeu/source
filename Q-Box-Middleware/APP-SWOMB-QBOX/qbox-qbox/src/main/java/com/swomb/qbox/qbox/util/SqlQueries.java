package com.swomb.qbox.qbox.util;

public class SqlQueries {

	public static String DB_SCHEMA = "masters";

	public static String INTERNAL_INVENTORY_MOVEMENT = "select * from " + DB_SCHEMA + ".internal_inventory_movement($1)";
	public static String VERIFY_INWARD_DELIVERY = "select * from " + DB_SCHEMA + ".verify_inward_delivery($1)";
	public static String PARTNER_CHANNEL_INWARD_ORDER = "select * from " + DB_SCHEMA + ".partner_channel_inward_order($1)";
	public static String PARTNER_CHANNEL_INWARD_DELIVERY = "select * from " + DB_SCHEMA + ".partner_channel_inward_delivery($1)";
	public static String PARTNER_CHANNEL_OUTWARD_ORDER = "select * from " + DB_SCHEMA + ".partner_channel_outward_order($1)";
	public static String PARTNER_CHANNEL_OUTWARD_DELIVERY = "select * from " + DB_SCHEMA + ".partner_channel_outward_delivery($1)";
	public static String PARTNER_CHANNEL_INWARD_DELIVERY_LIST = "select * from " + DB_SCHEMA + ".partner_channel_inward_delivery_list($1";
	public static String LOAD_SKU_IN_QBOX = "select * from " + DB_SCHEMA + ".load_sku_in_qbox($1)";
	public static String UNLOAD_SKU_FROM_QBOX_TO_HOTBOX = "select * from " + DB_SCHEMA + ".unload_sku_from_qbox_to_hotbox($1)";
	
	public static String SERVICE_HEALTH = "select * from " + DB_SCHEMA + ".service_health($1)";
	public static String SEARCH_BOX_CELL = "select * from " + DB_SCHEMA + ".search_box_cell($1)";
	public static String CREATE_BOX_CELL = "select * from " + DB_SCHEMA + ".create_box_cell($1)";
	public static String EDIT_BOX_CELL = "select * from " + DB_SCHEMA + ".edit_box_cell($1)";
	public static String DELETE_BOX_CELL = "select * from " + DB_SCHEMA + ".delete_box_cell($1)";
	public static String SEARCH_BOX_CELL_FOOD = "select * from " + DB_SCHEMA + ".search_box_cell_food($1)";
	public static String CREATE_BOX_CELL_FOOD = "select * from " + DB_SCHEMA + ".create_box_cell_food($1)";
	public static String EDIT_BOX_CELL_FOOD = "select * from " + DB_SCHEMA + ".edit_box_cell_food($1)";
	public static String DELETE_BOX_CELL_FOOD = "select * from " + DB_SCHEMA + ".delete_box_cell_food($1)";
	public static String SEARCH_BOX_CELL_FOOD_HIST = "select * from " + DB_SCHEMA + ".search_box_cell_food_hist($1)";
	public static String CREATE_BOX_CELL_FOOD_HIST = "select * from " + DB_SCHEMA + ".create_box_cell_food_hist($1)";
	public static String EDIT_BOX_CELL_FOOD_HIST = "select * from " + DB_SCHEMA + ".edit_box_cell_food_hist($1)";
	public static String DELETE_BOX_CELL_FOOD_HIST = "select * from " + DB_SCHEMA + ".delete_box_cell_food_hist($1)";
	public static String SEARCH_CODES_DTL = "select * from " + DB_SCHEMA + ".search_codes_dtl($1)";
	public static String CREATE_CODES_DTL = "select * from " + DB_SCHEMA + ".create_codes_dtl($1)";
	public static String EDIT_CODES_DTL = "select * from " + DB_SCHEMA + ".edit_codes_dtl($1)";
	public static String DELETE_CODES_DTL = "select * from " + DB_SCHEMA + ".delete_codes_dtl($1)";
	public static String SEARCH_CODES_HDR = "select * from " + DB_SCHEMA + ".search_codes_hdr($1)";
	public static String CREATE_CODES_HDR = "select * from " + DB_SCHEMA + ".create_codes_hdr($1)";
	public static String EDIT_CODES_HDR = "select * from " + DB_SCHEMA + ".edit_codes_hdr($1)";
	public static String DELETE_CODES_HDR = "select * from " + DB_SCHEMA + ".delete_codes_hdr($1)";
	public static String SEARCH_DELIVERY_PARTNER = "select * from " + DB_SCHEMA + ".search_delivery_partner($1)";
	public static String CREATE_DELIVERY_PARTNER = "select * from " + DB_SCHEMA + ".create_delivery_partner($1)";
	public static String EDIT_DELIVERY_PARTNER = "select * from " + DB_SCHEMA + ".edit_delivery_partner($1)";
	public static String DELETE_DELIVERY_PARTNER = "select * from " + DB_SCHEMA + ".delete_delivery_partner($1)";
	public static String SEARCH_ENTITY_INFRA = "select * from " + DB_SCHEMA + ".search_entity_infra($1)";
	public static String CREATE_ENTITY_INFRA = "select * from " + DB_SCHEMA + ".create_entity_infra($1)";
	public static String EDIT_ENTITY_INFRA = "select * from " + DB_SCHEMA + ".edit_entity_infra($1)";
	public static String DELETE_ENTITY_INFRA = "select * from " + DB_SCHEMA + ".delete_entity_infra($1)";
	public static String SEARCH_ENTITY_INFRA_PROPERTY = "select * from " + DB_SCHEMA
			+ ".search_entity_infra_property($1)";
	public static String CREATE_ENTITY_INFRA_PROPERTY = "select * from " + DB_SCHEMA
			+ ".create_entity_infra_property($1)";
	public static String EDIT_ENTITY_INFRA_PROPERTY = "select * from " + DB_SCHEMA + ".edit_entity_infra_property($1)";
	public static String DELETE_ENTITY_INFRA_PROPERTY = "select * from " + DB_SCHEMA
			+ ".delete_entity_infra_property($1)";
	public static String SEARCH_INFRA = "select * from " + DB_SCHEMA + ".search_infra($1)";
	public static String CREATE_INFRA = "select * from " + DB_SCHEMA + ".create_infra($1)";
	public static String EDIT_INFRA = "select * from " + DB_SCHEMA + ".edit_infra($1)";
	public static String DELETE_INFRA = "select * from " + DB_SCHEMA + ".delete_infra($1)";
	public static String SEARCH_INFRA_PROPERTY = "select * from " + DB_SCHEMA + ".search_infra_property($1)";
	public static String CREATE_INFRA_PROPERTY = "select * from " + DB_SCHEMA + ".create_infra_property($1)";
	public static String EDIT_INFRA_PROPERTY = "select * from " + DB_SCHEMA + ".edit_infra_property($1)";
	public static String DELETE_INFRA_PROPERTY = "select * from " + DB_SCHEMA + ".delete_infra_property($1)";
	public static String SEARCH_PURCHASE_ORDER = "select * from " + DB_SCHEMA + ".search_purchase_order($1)";
	public static String EDIT_PURCHASE_ORDER = "select * from " + DB_SCHEMA + ".edit_purchase_order($1)";
	public static String DELETE_PURCHASE_ORDER = "select * from " + DB_SCHEMA + ".delete_purchase_order($1)";
	public static String SEARCH_PURCHASE_ORDER_DTL = "select * from " + DB_SCHEMA + ".search_purchase_order_dtl($1)";
	public static String CREATE_PURCHASE_ORDER_DTL = "select * from " + DB_SCHEMA + ".create_purchase_order_dtl($1)";
	public static String EDIT_PURCHASE_ORDER_DTL = "select * from " + DB_SCHEMA + ".edit_purchase_order_dtl($1)";
	public static String DELETE_PURCHASE_ORDER_DTL = "select * from " + DB_SCHEMA + ".delete_purchase_order_dtl($1)";
	public static String SEARCH_QBOX_ENTITY = "select * from " + DB_SCHEMA + ".search_qbox_entity($1)";
	public static String CREATE_QBOX_ENTITY = "select * from " + DB_SCHEMA + ".create_qbox_entity($1)";
	public static String EDIT_QBOX_ENTITY = "select * from " + DB_SCHEMA + ".edit_qbox_entity($1)";
	public static String DELETE_QBOX_ENTITY = "select * from " + DB_SCHEMA + ".delete_qbox_entity($1)";
	public static String SEARCH_QBOX_ENTITY_DELIVERY_PARTNER = "select * from " + DB_SCHEMA
			+ ".search_qbox_entity_delivery_partner($1)";
	public static String CREATE_QBOX_ENTITY_DELIVERY_PARTNER = "select * from " + DB_SCHEMA
			+ ".create_qbox_entity_delivery_partner($1)";
	public static String EDIT_QBOX_ENTITY_DELIVERY_PARTNER = "select * from " + DB_SCHEMA
			+ ".edit_qbox_entity_delivery_partner($1)";
	public static String DELETE_QBOX_ENTITY_DELIVERY_PARTNER = "select * from " + DB_SCHEMA
			+ ".delete_qbox_entity_delivery_partner($1)";
	public static String SEARCH_SALES_ORDER = "select * from " + DB_SCHEMA + ".search_sales_order($1)";
	public static String CREATE_SALES_ORDER = "select * from " + DB_SCHEMA + ".create_sales_order($1)";
	public static String EDIT_SALES_ORDER = "select * from " + DB_SCHEMA + ".edit_sales_order($1)";
	public static String DELETE_SALES_ORDER = "select * from " + DB_SCHEMA + ".delete_sales_order($1)";
	public static String SEARCH_SALES_ORDER_DTL = "select * from " + DB_SCHEMA + ".search_sales_order_dtl($1)";
	public static String CREATE_SALES_ORDER_DTL = "select * from " + DB_SCHEMA + ".create_sales_order_dtl($1)";
	public static String EDIT_SALES_ORDER_DTL = "select * from " + DB_SCHEMA + ".edit_sales_order_dtl($1)";
	public static String DELETE_SALES_ORDER_DTL = "select * from " + DB_SCHEMA + ".delete_sales_order_dtl($1)";
	public static String SEARCH_SKU_INVENTORY = "select * from " + DB_SCHEMA + ".search_sku_inventory($1)";
	public static String CREATE_SKU_INVENTORY = "select * from " + DB_SCHEMA + ".create_sku_inventory($1)";
	public static String EDIT_SKU_INVENTORY = "select * from " + DB_SCHEMA + ".edit_sku_inventory($1)";
	public static String DELETE_SKU_INVENTORY = "select * from " + DB_SCHEMA + ".delete_sku_inventory($1)";
	public static String SEARCH_SKU_TRACE_WF = "select * from " + DB_SCHEMA + ".search_sku_trace_wf($1)";
	public static String CREATE_SKU_TRACE_WF = "select * from " + DB_SCHEMA + ".create_sku_trace_wf($1)";
	public static String EDIT_SKU_TRACE_WF = "select * from " + DB_SCHEMA + ".edit_sku_trace_wf($1)";
	public static String DELETE_SKU_TRACE_WF = "select * from " + DB_SCHEMA + ".delete_sku_trace_wf($1)";
	public static String GET_CROSSED_STAGES_INFO = "select * from " + DB_SCHEMA + ".get_crossed_stages_info($1)";
	public static String GET_QBOX_CURRENT_STATUS = "select * from " + DB_SCHEMA + ".get_qbox_current_status($1)";
	public static String GET_HOTBOX_CURRENT_STATUS = "select * from " + DB_SCHEMA + ".get_hotbox_current_status($1)";

	public static String REJECT_SKU = "select * from " + DB_SCHEMA + ".reject_sku($1)";
	public static String ACCEPT_SKU = "select * from " + DB_SCHEMA + ".accept_sku($1)";
	
	public static String SAVE_ENTITY_INFRASTRUCTURE = "select * from " + DB_SCHEMA + ".save_entity_infrastructure($1)";
	public static String GET_ENTITY_INFRA_PROPERTIES = "select * from " + DB_SCHEMA + ".get_entity_infra_properties($1)";
	public static String UPDATE_ENTITY_INFRASTRUCTURE = "select * from " + DB_SCHEMA + ".update_entity_infrastructure($1)";
	
	public static String UPLOAD_ORDER_CSV = "select * from " + DB_SCHEMA + ".upload_order_csv($1)";
	
	public static String GET_PURCHASE_ORDERS_DASHBOARD = "select * from " + DB_SCHEMA + ".get_purchase_orders_dashboard($1)";
	public static String GET_HOTBOX_CURRENT_STATUS_V2 = "select * from " + DB_SCHEMA + ".get_hotbox_current_status_v2($1)";
	
	public static String DELETE_ENTITY_INFRA_BY_ID = "select * from " + DB_SCHEMA + ".delete_entity_infra_by_id($1)";
	
	public static String PROCESS_ORDER_DELIVERY = "select * from " + DB_SCHEMA + ".process_order_delivery($1)";
	
}
