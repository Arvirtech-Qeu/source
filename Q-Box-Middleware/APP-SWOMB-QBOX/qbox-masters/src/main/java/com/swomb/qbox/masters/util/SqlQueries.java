package com.swomb.qbox.masters.util;

public class SqlQueries {
	
	public static String DB_SCHEMA  = "masters";
	
	public static String SERVICE_HEALTH = "select * from " + DB_SCHEMA + ".service_health($1)";
	
	public static String  SEARCH_ADDRESS = "select * from "+DB_SCHEMA+".search_address($1)";
	public static String  CREATE_ADDRESS = "select * from "+DB_SCHEMA+".create_address($1)";
	public static String  EDIT_ADDRESS = "select * from "+DB_SCHEMA+".edit_address($1)";
	public static String  DELETE_ADDRESS = "select * from "+DB_SCHEMA+".delete_address($1)";
	public static String  SEARCH_AREA = "select * from "+DB_SCHEMA+".search_area($1)";
	public static String  CREATE_AREA = "select * from "+DB_SCHEMA+".create_area($1)";
	public static String  EDIT_AREA = "select * from "+DB_SCHEMA+".edit_area($1)";
	public static String  DELETE_AREA = "select * from "+DB_SCHEMA+".delete_area($1)";
	public static String  SEARCH_CITY = "select * from "+DB_SCHEMA+".search_city($1)";
	public static String  CREATE_CITY = "select * from "+DB_SCHEMA+".create_city($1)";
	public static String  EDIT_CITY = "select * from "+DB_SCHEMA+".edit_city($1)";
	public static String  DELETE_CITY = "select * from "+DB_SCHEMA+".delete_city($1)";
	public static String  SEARCH_CODES_DTL = "select * from "+DB_SCHEMA+".search_codes_dtl($1)";
	public static String  CREATE_CODES_DTL = "select * from "+DB_SCHEMA+".create_codes_dtl($1)";
	public static String  EDIT_CODES_DTL = "select * from "+DB_SCHEMA+".edit_codes_dtl($1)";
	public static String  DELETE_CODES_DTL = "select * from "+DB_SCHEMA+".delete_codes_dtl($1)";
	public static String  SEARCH_CODES_HDR = "select * from "+DB_SCHEMA+".search_codes_hdr($1)";
	public static String  CREATE_CODES_HDR = "select * from "+DB_SCHEMA+".create_codes_hdr($1)";
	public static String  EDIT_CODES_HDR = "select * from "+DB_SCHEMA+".edit_codes_hdr($1)";
	public static String  DELETE_CODES_HDR = "select * from "+DB_SCHEMA+".delete_codes_hdr($1)";
	public static String  SEARCH_COUNTRY = "select * from "+DB_SCHEMA+".search_country($1)";
	public static String  CREATE_COUNTRY = "select * from "+DB_SCHEMA+".create_country($1)";
	public static String  EDIT_COUNTRY = "select * from "+DB_SCHEMA+".edit_country($1)";
	public static String  DELETE_COUNTRY = "select * from "+DB_SCHEMA+".delete_country($1)";
	public static String  SEARCH_DELIVERY_PARTNER = "select * from "+DB_SCHEMA+".search_delivery_partner($1)";
	public static String  CREATE_DELIVERY_PARTNER = "select * from "+DB_SCHEMA+".create_delivery_partner($1)";
	public static String  EDIT_DELIVERY_PARTNER = "select * from "+DB_SCHEMA+".edit_delivery_partner($1)";
	public static String  DELETE_DELIVERY_PARTNER = "select * from "+DB_SCHEMA+".delete_delivery_partner($1)";
	public static String  SEARCH_FOOD_SKU = "select * from "+DB_SCHEMA+".search_food_sku($1)";
	public static String  CREATE_FOOD_SKU = "select * from "+DB_SCHEMA+".create_food_sku($1)";
	public static String  EDIT_FOOD_SKU = "select * from "+DB_SCHEMA+".edit_food_sku($1)";
	public static String  DELETE_FOOD_SKU = "select * from "+DB_SCHEMA+".delete_food_sku($1)";
	public static String  SEARCH_PARTNER_FOOD_SKU = "select * from "+DB_SCHEMA+".search_partner_food_sku($1)";
	public static String  CREATE_PARTNER_FOOD_SKU = "select * from "+DB_SCHEMA+".create_partner_food_sku($1)";
	public static String  EDIT_PARTNER_FOOD_SKU = "select * from "+DB_SCHEMA+".edit_partner_food_sku($1)";
	public static String  DELETE_PARTNER_FOOD_SKU = "select * from "+DB_SCHEMA+".delete_partner_food_sku($1)";
	public static String  SEARCH_RESTAURANT = "select * from "+DB_SCHEMA+".search_restaurant($1)";
	public static String  CREATE_RESTAURANT = "select * from "+DB_SCHEMA+".create_restaurant($1)";
	public static String  EDIT_RESTAURANT = "select * from "+DB_SCHEMA+".edit_restaurant($1)";
	public static String  DELETE_RESTAURANT = "select * from "+DB_SCHEMA+".delete_restaurant($1)";
	public static String  SEARCH_RESTAURANT_FOOD_SKU = "select * from "+DB_SCHEMA+".search_restaurant_food_sku($1)";
	public static String  CREATE_RESTAURANT_FOOD_SKU = "select * from "+DB_SCHEMA+".create_restaurant_food_sku($1)";
	public static String  EDIT_RESTAURANT_FOOD_SKU = "select * from "+DB_SCHEMA+".edit_restaurant_food_sku($1)";
	public static String  DELETE_RESTAURANT_FOOD_SKU = "select * from "+DB_SCHEMA+".delete_restaurant_food_sku($1)";
	public static String  SEARCH_STATE = "select * from "+DB_SCHEMA+".search_state($1)";
	public static String  CREATE_STATE = "select * from "+DB_SCHEMA+".create_state($1)";
	public static String  EDIT_STATE = "select * from "+DB_SCHEMA+".edit_state($1)";
	public static String  DELETE_STATE = "select * from "+DB_SCHEMA+".delete_state($1)";
	public static String  GET_ENUM = "select * from "+DB_SCHEMA+".get_enum($1)";
	
	public static String SEARCH_ETL_JOB = "select * from " + DB_SCHEMA + ".search_etl_job($1)";
	
	public static String SEARCH_ETL_TABLE_COLUMN = "select * from " + DB_SCHEMA + ".search_etl_table_column($1)";
	public static String CREATE_ETL_TABLE_COLUMN = "select * from " + DB_SCHEMA + ".create_etl_table_column($1)";
	public static String EDIT_ETL_TABLE_COLUMN = "select * from " + DB_SCHEMA + ".edit_etl_table_column($1)";
	public static String DELETE_ETL_TABLE_COLUMN = "select * from " + DB_SCHEMA + ".delete_etl_table_column($1)";

	public static String CREATE_ORDER_ETL_HDR = "select * from " + DB_SCHEMA + ".create_order_etl_hdr($1)";
	public static String SEARCH_ORDER_ETL_HDR = "select * from " + DB_SCHEMA + ".search_order_etl_hdr($1)";
	public static String EDIT_ORDER_ETL_HDR = "select * from " + DB_SCHEMA + ".edit_order_etl_hdr($1)";
	public static String DELETE_ORDER_ETL_HDR = "select * from " + DB_SCHEMA + ".delete_order_etl_hdr($1)";
	
	public static String GET_BOX_CELL_INVENTORY = "select * from " + DB_SCHEMA + ".get_box_cell_inventory($1)";

	public static String  PARTNER_CHANNEL_INWARD_DELIVERY_HISTORY = "select * from "+DB_SCHEMA+".partner_channel_inward_delivery_history($1)";
	public static String  PARTNER_CHANNEL_OUTWARD_DELIVERY_HISTORY = "select * from "+DB_SCHEMA+".partner_channel_outward_delivery_history($1)";
	public static String GET_PARTNER_ORDER_DASHBOARD_DETAILS = "select * from "+DB_SCHEMA+".get_partner_order_dashboard_details($1)";
	public static String GET_SKU_DASHBOARD_COUNTS = "select * from "+DB_SCHEMA+".get_sku_dashboard_counts($1)";
	
	public static String GET_HOTBOX_COUNT = "select * from "+DB_SCHEMA+".get_hotbox_count($1)";
	
	public static String GET_SALES_REPORT = "select * from " + DB_SCHEMA + ".get_sales_report($1)";
	public static String GET_PURCHASE_REPORT = "select * from " + DB_SCHEMA + ".get_purchase_report($1)";
	public static String GET_DAILY_BEST_SELLER_REPORT = "select * from " + DB_SCHEMA + ".get_daily_best_seller_report($1)";
	public static String GET_DAILY_GOODS_RETURNED_REPORT = "select * from " + DB_SCHEMA + ".get_daily_goods_returned_report($1)";
	public static String GET_DAILY_ITEMS_RETURNED_REPORT = "select * from " + DB_SCHEMA + ".get_daily_items_returned_report($1)"; 
	public static String GET_DAILY_PURCHASE_REPORT = "select * from " + DB_SCHEMA + ".get_daily_purchase_report($1)";
	public static String GET_DAILY_SALES_REPORT = "select * from " + DB_SCHEMA + ".get_daily_sales_report($1)";
	public static String GET_DAILY_STOCKS_IN_HAND_REPORT = "select * from " + DB_SCHEMA + ".get_daily_stocks_in_hand_report($1)";
	
	public static String GET_BOX_CELL_INVENTORY_V2 = "select * from " + DB_SCHEMA + ".get_box_cell_inventory_v2($1)";
	public static String GET_HOTBOX_COUNT_V2 = "select * from " + DB_SCHEMA + ".get_hotbox_count_v2($1)";
	public static String GET_ENTITY_INFRA_PROPERTIES_V2 = "select * from " + DB_SCHEMA + ".get_entity_infra_properties_v2($1)";
	public static String GET_REJECTED_SKU = "select * from " + DB_SCHEMA + ".get_rejected_sku($1)";
	public static String  GET_UNALLOCATED_FOOD_ORDERS = "select * from "+DB_SCHEMA+".get_unallocated_food_orders($1)";
	public static String UPDATE_PROFILE = "select * from " + DB_SCHEMA + ".update_profile($1)";
	
	public static String GET_MOST_SOLD_COUNTS = "select * from " + DB_SCHEMA + ".get_most_sold_counts($1)";
	public static String GET_INWARD_ORDER_DETAILS = "select * from " + DB_SCHEMA + ".get_inward_order_details($1)";
	public static String GET_UNSOLD_SKU_LUNCH_COUNTS = "select * from " + DB_SCHEMA + ".get_unsold_sku_lunch_counts($1)";
	public static String GET_UNSOLD_SKU_DINNER_COUNTS = "select * from " + DB_SCHEMA + ".get_unsold_sku_dinner_counts($1)";
	
	public static String GET_CONSOLIDATED_DATA = "select * from " + DB_SCHEMA + ".get_consolidated_data($1)";
	public static String GET_DAILY_STOCK_REPORT = "select * from " + DB_SCHEMA + ".get_daily_stock_report($1)";
	public static String GET_BEST_SELLING_FOOD = "select * from " + DB_SCHEMA + ".get_best_selling_food()";
	
	public static String GET_DASHBOARD_QBOX_ENTITY = "select * from " + DB_SCHEMA + ".get_dashboard_qbox_entity($1)";
	public static String GENERATE_ORDER_FILE = "select * from " + DB_SCHEMA + ".generate_order_file($1)";
	public static String GET_SALES_SKU_INVENTORY = "select * from " + DB_SCHEMA + ".get_sales_sku_inventory($1)";

	public static String GET_DASHBOARD_STOCK_SUMMARY = "select * from " + DB_SCHEMA + ".get_dashboard_stock_summary($1)";
	public static String GET_HOTBOX_SUMMARY = "select * from " + DB_SCHEMA + ".get_hotbox_summary($1)";
	public static String GET_INWARD_ORDER_DETAILS_V2 = "select * from " + DB_SCHEMA + ".get_inward_order_details_v2($1)";
	public static String GET_HOTBOX_COUNT_V3 = "select * from " + DB_SCHEMA + ".get_hotbox_count_v3($1)";
	public static String GET_DAILY_STOCK_REPORT_V2 = "select * from " + DB_SCHEMA + ".get_daily_stock_report_v2($1)";
	public static String GET_ENTITY_LOADER = "select * from " + DB_SCHEMA + ".get_entity_loader($1)";
	public static String GET_DETAILED_INWARD_ORDERS = "select * from " + DB_SCHEMA + ".get_detailed_inward_orders($1)";
	
	public static String GET_DASHBOARD_QBOX_ENTITY_BY_AUTH_USER = "select * from " + DB_SCHEMA + ".get_dashboard_qbox_entity_by_auth_user($1)";
	public static String GET_SUPERVISORS_BY_ENTITIES = "select * from " + DB_SCHEMA + ".get_supervisors_by_entities($1)";
	public static String CREATE_ATTENDANCE_RECORD = "select * from " + DB_SCHEMA + ".create_attendance_record($1)";
	public static String UPDATE_ATTENDANCE_RECORD = "select * from " + DB_SCHEMA + ".update_attendance_record($1)";
	public static String GET_TODAY_ATTENDANCE = "select * from " + DB_SCHEMA + ".get_today_attendance($1)";
	public static String GET_ATTENDANCE_SUMMARY = "select * from " + DB_SCHEMA + ".get_attendance_summary($1)";
	
	public static String DELETE_USER_BY_ID = "select * from " + DB_SCHEMA + ".delete_user_by_id($1)";
	public static String GET_SKU_SALES_REPORT = "select * from " + DB_SCHEMA + ".get_sku_sales_report($1)";
	
	public static String SEARCH_FULL_PURCHASE_ORDER = "select * from " + DB_SCHEMA + ".search_full_purchase_order($1)";
	public static String GET_SKU_IN_QBOX_INVENTORY = "select * from " + DB_SCHEMA + ".get_sku_in_qbox_inventory($1)";
	public static String GET_ENTITY_INFRA_DETAILS = "select * from " + DB_SCHEMA + ".get_entity_infra_details($1)";
	
	public static String CREATE_LOW_STOCK_TRIGGER = "select * from " + DB_SCHEMA + ".create_low_stock_trigger($1)";
	public static String EDIT_LOW_STOCK_TRIGGER = "select * from " + DB_SCHEMA + ".edit_low_stock_trigger($1)";
	public static String SEARCH_LOW_STOCK_TRIGGER = "select * from " + DB_SCHEMA + ".search_low_stock_trigger($1)";
	public static String DELETE_LOW_STOCK_TRIGGER = "select * from " + DB_SCHEMA + ".delete_low_stock_trigger($1)";
	public static String CONFIRM_SKU_REJECT = "select * from " + DB_SCHEMA + ".confirm_sku_reject($1)";
	
	public static String CREATE_REJECT_REASON = "select * from " + DB_SCHEMA + ".create_reject_reason($1)";
	public static String GET_REJECT_REASON = "select * from " + DB_SCHEMA + ".get_reject_reason($1)";
	public static String UPDATE_REJECT_REASON = "select * from " + DB_SCHEMA + ".update_reject_reason($1)";
	public static String DELETE_REJECT_REASON = "select * from " + DB_SCHEMA + ".delete_reject_reason($1)";
	public static String GET_DASHBOARD_ANALYTICS = "select * from " + DB_SCHEMA + ".get_dashboard_analytics($1)";
			
	
}
