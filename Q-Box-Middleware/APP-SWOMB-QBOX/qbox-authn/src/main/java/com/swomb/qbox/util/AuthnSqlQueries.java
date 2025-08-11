package com.swomb.qbox.util;

import com.swomb.qbox.authn.ServerVerticle;

public class AuthnSqlQueries {

	public static String DB_SCHEMA = ServerVerticle.DB_SCHEMA;

	public static String CUSTOM_SEARCH_API_KEY = "select * from " + DB_SCHEMA + ".custom_search_api_key($1)";
	public static String CUSTOM_UPDATE_API_KEY = "select * from " + DB_SCHEMA + ".custom_update_api_key($1)";
	public static String CREATE_API_KEY = "select * from " + DB_SCHEMA + ".create_api_key($1)";
	public static String GET_ALL_API_KEY = "select * from " + DB_SCHEMA + ".get_all_api_key($1)";
	public static String GET_BY_ID_API_KEY = "select * from " + DB_SCHEMA + ".get_by_id_api_key($1)";
	public static String UPDATE_API_KEY = "select * from " + DB_SCHEMA + ".update_api_key($1)";
	public static String CUSTOM_SEARCH_APP_USER_SETTINGS = "select * from " + DB_SCHEMA
			+ ".custom_search_app_user_settings($1)";
	public static String CUSTOM_UPDATE_APP_USER_SETTINGS = "select * from " + DB_SCHEMA
			+ ".custom_update_app_user_settings($1)";
	public static String CREATE_APP_USER_SETTINGS = "select * from " + DB_SCHEMA + ".create_app_user_settings($1)";
	public static String GET_ALL_APP_USER_SETTINGS = "select * from " + DB_SCHEMA + ".get_all_app_user_settings($1)";
	public static String GET_BY_ID_APP_USER_SETTINGS = "select * from " + DB_SCHEMA
			+ ".get_by_id_app_user_settings($1)";
	public static String UPDATE_APP_USER_SETTINGS = "select * from " + DB_SCHEMA + ".update_app_user_settings($1)";
	public static String CUSTOM_SEARCH_AUDIT_TRAIL = "select * from " + DB_SCHEMA + ".custom_search_audit_trail($1)";
	public static String CUSTOM_UPDATE_AUDIT_TRAIL = "select * from " + DB_SCHEMA + ".custom_update_audit_trail($1)";
	public static String CREATE_AUDIT_TRAIL = "select * from " + DB_SCHEMA + ".create_audit_trail($1)";
	public static String GET_ALL_AUDIT_TRAIL = "select * from " + DB_SCHEMA + ".get_all_audit_trail($1)";
	public static String GET_BY_ID_AUDIT_TRAIL = "select * from " + DB_SCHEMA + ".get_by_id_audit_trail($1)";
	public static String UPDATE_AUDIT_TRAIL = "select * from " + DB_SCHEMA + ".update_audit_trail($1)";
	public static String CUSTOM_SEARCH_AUTH_ATTEMPT = "select * from " + DB_SCHEMA + ".custom_search_auth_attempt($1)";
	public static String CUSTOM_UPDATE_AUTH_ATTEMPT = "select * from " + DB_SCHEMA + ".custom_update_auth_attempt($1)";
	public static String CREATE_AUTH_ATTEMPT = "select * from " + DB_SCHEMA + ".create_auth_attempt($1)";
	public static String GET_ALL_AUTH_ATTEMPT = "select * from " + DB_SCHEMA + ".get_all_auth_attempt($1)";
	public static String GET_BY_ID_AUTH_ATTEMPT = "select * from " + DB_SCHEMA + ".get_by_id_auth_attempt($1)";
	public static String UPDATE_AUTH_ATTEMPT = "select * from " + DB_SCHEMA + ".update_auth_attempt($1)";
	public static String CUSTOM_SEARCH_AUTH_PASSWORD = "select * from " + DB_SCHEMA
			+ ".custom_search_auth_password($1)";
	public static String CUSTOM_UPDATE_AUTH_PASSWORD = "select * from " + DB_SCHEMA
			+ ".custom_update_auth_password($1)";
	public static String CREATE_AUTH_PASSWORD = "select * from " + DB_SCHEMA + ".create_auth_password($1)";
	public static String GET_ALL_AUTH_PASSWORD = "select * from " + DB_SCHEMA + ".get_all_auth_password($1)";
	public static String GET_BY_ID_AUTH_PASSWORD = "select * from " + DB_SCHEMA + ".get_by_id_auth_password($1)";
	public static String UPDATE_AUTH_PASSWORD = "select * from " + DB_SCHEMA + ".update_auth_password($1)";
	public static String CUSTOM_SEARCH_AUTH_PASSWORD_HIST = "select * from " + DB_SCHEMA
			+ ".custom_search_auth_password_hist($1)";
	public static String CUSTOM_UPDATE_AUTH_PASSWORD_HIST = "select * from " + DB_SCHEMA
			+ ".custom_update_auth_password_hist($1)";
	public static String CREATE_AUTH_PASSWORD_HIST = "select * from " + DB_SCHEMA + ".create_auth_password_hist($1)";
	public static String GET_ALL_AUTH_PASSWORD_HIST = "select * from " + DB_SCHEMA + ".get_all_auth_password_hist($1)";
	public static String GET_BY_ID_AUTH_PASSWORD_HIST = "select * from " + DB_SCHEMA
			+ ".get_by_id_auth_password_hist($1)";
	public static String UPDATE_AUTH_PASSWORD_HIST = "select * from " + DB_SCHEMA + ".update_auth_password_hist($1)";
	public static String CUSTOM_SEARCH_AUTH_STATUS = "select * from " + DB_SCHEMA + ".custom_search_auth_status($1)";
	public static String CUSTOM_UPDATE_AUTH_STATUS = "select * from " + DB_SCHEMA + ".custom_update_auth_status($1)";
	public static String CREATE_AUTH_STATUS = "select * from " + DB_SCHEMA + ".create_auth_status($1)";
	public static String GET_ALL_AUTH_STATUS = "select * from " + DB_SCHEMA + ".get_all_auth_statuses()";
	public static String GET_BY_ID_AUTH_STATUS = "select * from " + DB_SCHEMA + ".get_by_id_auth_status($1)";
	public static String UPDATE_AUTH_STATUS = "select * from " + DB_SCHEMA + ".update_auth_status($1)";
	public static String CUSTOM_SEARCH_AUTH_STATUS_LOG = "select * from " + DB_SCHEMA
			+ ".custom_search_auth_status_log($1)";
	public static String CUSTOM_UPDATE_AUTH_STATUS_LOG = "select * from " + DB_SCHEMA
			+ ".custom_update_auth_status_log($1)";
	public static String CREATE_AUTH_STATUS_LOG = "select * from " + DB_SCHEMA + ".create_auth_status_log($1)";
	public static String GET_ALL_AUTH_STATUS_LOG = "select * from " + DB_SCHEMA + ".get_all_auth_status_log($1)";
	public static String GET_BY_ID_AUTH_STATUS_LOG = "select * from " + DB_SCHEMA + ".get_by_id_auth_status_log($1)";
	public static String UPDATE_AUTH_STATUS_LOG = "select * from " + DB_SCHEMA + ".update_auth_status_log($1)";
	public static String CUSTOM_SEARCH_AUTH_USER = "select * from " + DB_SCHEMA + ".custom_search_auth_user($1)";
	public static String CUSTOM_UPDATE_AUTH_USER = "select * from " + DB_SCHEMA + ".custom_update_auth_user($1)";
	public static String CREATE_AUTH_USER = "select * from " + DB_SCHEMA + ".create_auth_user($1)";
	public static String GET_ALL_AUTH_USER = "select * from " + DB_SCHEMA + ".get_all_auth_user($1)";
	public static String GET_BY_ID_AUTH_USER = "select * from " + DB_SCHEMA + ".get_by_id_auth_user($1)";
	public static String UPDATE_AUTH_USER = "select * from " + DB_SCHEMA + ".update_auth_user($1)";
	public static String CUSTOM_SEARCH_AUTH_USER_ROLE = "select * from " + DB_SCHEMA
			+ ".custom_search_auth_user_role($1)";
	public static String CUSTOM_UPDATE_AUTH_USER_ROLE = "select * from " + DB_SCHEMA
			+ ".custom_update_auth_user_role($1)";
	public static String CREATE_AUTH_USER_ROLE = "select * from " + DB_SCHEMA + ".create_auth_user_role($1)";
	public static String GET_ALL_AUTH_USER_ROLE = "select * from " + DB_SCHEMA + ".get_all_auth_user_role($1)";
	public static String GET_BY_ID_AUTH_USER_ROLE = "select * from " + DB_SCHEMA + ".get_by_id_auth_user_role($1)";
	public static String UPDATE_AUTH_USER_ROLE = "select * from " + DB_SCHEMA + ".update_auth_user_role($1)";
	public static String CUSTOM_SEARCH_DB_TABLE = "select * from " + DB_SCHEMA + ".custom_search_db_table($1)";
	public static String CUSTOM_UPDATE_DB_TABLE = "select * from " + DB_SCHEMA + ".custom_update_db_table($1)";
	public static String CREATE_DB_TABLE = "select * from " + DB_SCHEMA + ".create_db_table($1)";
	public static String GET_ALL_DB_TABLE = "select * from " + DB_SCHEMA + ".get_all_db_table()";
	public static String GET_BY_ID_DB_TABLE = "select * from " + DB_SCHEMA + ".get_by_id_db_table($1)";
	public static String UPDATE_DB_TABLE = "select * from " + DB_SCHEMA + ".update_db_table($1)";
	public static String CUSTOM_SEARCH_MENU = "select * from " + DB_SCHEMA + ".custom_search_menu($1)";
	public static String CUSTOM_UPDATE_MENU = "select * from " + DB_SCHEMA + ".custom_update_menu($1)";
	public static String CREATE_MENU = "select * from " + DB_SCHEMA + ".create_menu($1)";
	public static String GET_ALL_MENU = "select * from " + DB_SCHEMA + ".get_all_menus()";
	public static String GET_BY_ID_MENU = "select * from " + DB_SCHEMA + ".get_by_id_menu($1)";
	public static String UPDATE_MENU = "select * from " + DB_SCHEMA + ".update_menu($1)";
	public static String CUSTOM_SEARCH_MENU_PERMISSION = "select * from " + DB_SCHEMA
			+ ".custom_search_menu_permission($1)";
	public static String CUSTOM_UPDATE_MENU_PERMISSION = "select * from " + DB_SCHEMA
			+ ".custom_update_menu_permission($1)";
	public static String CREATE_MENU_PERMISSION = "select * from " + DB_SCHEMA + ".create_menu_permission($1)";
	public static String GET_ALL_MENU_PERMISSION = "select * from " + DB_SCHEMA + ".get_all_menu_permission()";
	public static String GET_BY_ID_MENU_PERMISSION = "select * from " + DB_SCHEMA + ".get_by_id_menu_permission($1)";
	public static String UPDATE_MENU_PERMISSION = "select * from " + DB_SCHEMA + ".update_menu_permission($1)";
	public static String CUSTOM_SEARCH_METRIC = "select * from " + DB_SCHEMA + ".custom_search_metric($1)";
	public static String CUSTOM_UPDATE_METRIC = "select * from " + DB_SCHEMA + ".custom_update_metric($1)";
	public static String CREATE_METRIC = "select * from " + DB_SCHEMA + ".create_metric($1)";
	public static String GET_ALL_METRIC = "select * from " + DB_SCHEMA + ".get_all_metric($1)";
	public static String GET_BY_ID_METRIC = "select * from " + DB_SCHEMA + ".get_by_id_metric($1)";
	public static String UPDATE_METRIC = "select * from " + DB_SCHEMA + ".update_metric($1)";
	public static String CUSTOM_SEARCH_MODULE = "select * from " + DB_SCHEMA + ".custom_search_module($1)";
	public static String CUSTOM_UPDATE_MODULE = "select * from " + DB_SCHEMA + ".custom_update_module($1)";
	public static String CREATE_MODULE = "select * from " + DB_SCHEMA + ".create_module($1)";
	public static String GET_ALL_MODULE = "select * from " + DB_SCHEMA + ".get_all_modules()";
	public static String GET_BY_ID_MODULE = "select * from " + DB_SCHEMA + ".get_by_id_module($1)";
	public static String UPDATE_MODULE = "select * from " + DB_SCHEMA + ".update_module($1)";
	public static String CUSTOM_SEARCH_MODULE_MENU = "select * from " + DB_SCHEMA + ".custom_search_module_menu($1)";
	public static String CUSTOM_UPDATE_MODULE_MENU = "select * from " + DB_SCHEMA + ".custom_update_module_menu($1)";
	public static String CREATE_MODULE_MENU = "select * from " + DB_SCHEMA + ".create_module_menu($1)";
	public static String GET_ALL_MODULE_MENU = "select * from " + DB_SCHEMA + ".get_all_module_menus()";
	public static String GET_BY_ID_MODULE_MENU = "select * from " + DB_SCHEMA + ".get_by_id_module_menu($1)";
	public static String UPDATE_MODULE_MENU = "select * from " + DB_SCHEMA + ".update_module_menu($1)";
	public static String CUSTOM_SEARCH_PERMISSION = "select * from " + DB_SCHEMA + ".custom_search_permission($1)";
	public static String CUSTOM_UPDATE_PERMISSION = "select * from " + DB_SCHEMA + ".custom_update_permission($1)";
	public static String CREATE_PERMISSION = "select * from " + DB_SCHEMA + ".create_permission($1)";
	public static String GET_ALL_PERMISSION = "select * from " + DB_SCHEMA + ".get_all_permission($1)";
	public static String GET_BY_ID_PERMISSION = "select * from " + DB_SCHEMA + ".get_by_id_permission($1)";
	public static String UPDATE_PERMISSION = "select * from " + DB_SCHEMA + ".update_permission($1)";
	public static String CUSTOM_SEARCH_PERMISSION_ADDON = "select * from " + DB_SCHEMA
			+ ".custom_search_permission_addon($1)";
	public static String CUSTOM_UPDATE_PERMISSION_ADDON = "select * from " + DB_SCHEMA
			+ ".custom_update_permission_addon($1)";
	public static String CREATE_PERMISSION_ADDON = "select * from " + DB_SCHEMA + ".create_permission_addon($1)";
	public static String GET_ALL_PERMISSION_ADDON = "select * from " + DB_SCHEMA + ".get_all_permission_addon($1)";
	public static String GET_BY_ID_PERMISSION_ADDON = "select * from " + DB_SCHEMA + ".get_by_id_permission_addon($1)";
	public static String UPDATE_PERMISSION_ADDON = "select * from " + DB_SCHEMA + ".update_permission_addon($1)";
	public static String CUSTOM_SEARCH_PERMISSION_SERVICE_API = "select * from " + DB_SCHEMA
			+ ".custom_search_permission_service_api($1)";
	public static String CUSTOM_UPDATE_PERMISSION_SERVICE_API = "select * from " + DB_SCHEMA
			+ ".custom_update_permission_service_api($1)";
	public static String CREATE_PERMISSION_SERVICE_API = "select * from " + DB_SCHEMA
			+ ".create_permission_service_api($1)";
	public static String GET_ALL_PERMISSION_SERVICE_API = "select * from " + DB_SCHEMA
			+ ".get_all_permission_service_apis()";
	public static String GET_BY_ID_PERMISSION_SERVICE_API = "select * from " + DB_SCHEMA
			+ ".get_by_id_permission_service_api($1)";
	public static String UPDATE_PERMISSION_SERVICE_API = "select * from " + DB_SCHEMA
			+ ".update_permission_service_api($1)";
	public static String CUSTOM_SEARCH_POLICY = "select * from " + DB_SCHEMA + ".custom_search_policy($1)";
	public static String CUSTOM_UPDATE_POLICY = "select * from " + DB_SCHEMA + ".custom_update_policy($1)";
	public static String CREATE_POLICY = "select * from " + DB_SCHEMA + ".create_policy($1)";
	public static String GET_ALL_POLICY = "select * from " + DB_SCHEMA + ".get_all_policy($1)";
	public static String GET_BY_ID_POLICY = "select * from " + DB_SCHEMA + ".get_by_id_policy($1)";
	public static String UPDATE_POLICY = "select * from " + DB_SCHEMA + ".update_policy($1)";
	public static String CUSTOM_SEARCH_REASON = "select * from " + DB_SCHEMA + ".custom_search_reason($1)";
	public static String CUSTOM_UPDATE_REASON = "select * from " + DB_SCHEMA + ".custom_update_reason($1)";
	public static String CREATE_REASON = "select * from " + DB_SCHEMA + ".create_reason($1)";
	public static String GET_ALL_REASON = "select * from " + DB_SCHEMA + ".get_all_reason($1)";
	public static String GET_BY_ID_REASON = "select * from " + DB_SCHEMA + ".get_by_id_reason($1)";
	public static String UPDATE_REASON = "select * from " + DB_SCHEMA + ".update_reason($1)";
	public static String CUSTOM_SEARCH_RECORD_ACTION = "select * from " + DB_SCHEMA
			+ ".custom_search_record_action($1)";
	public static String CUSTOM_UPDATE_RECORD_ACTION = "select * from " + DB_SCHEMA
			+ ".custom_update_record_action($1)";
	public static String CREATE_RECORD_ACTION = "select * from " + DB_SCHEMA + ".create_record_action($1)";
	public static String GET_ALL_RECORD_ACTION = "select * from " + DB_SCHEMA + ".get_all_record_action()";
	public static String GET_BY_ID_RECORD_ACTION = "select * from " + DB_SCHEMA + ".get_by_id_record_action($1)";
	public static String UPDATE_RECORD_ACTION = "select * from " + DB_SCHEMA + ".update_record_action($1)";
	public static String CUSTOM_SEARCH_REGISTERATION_OTP = "select * from " + DB_SCHEMA
			+ ".custom_search_registeration_otp($1)";
	public static String CUSTOM_UPDATE_REGISTERATION_OTP = "select * from " + DB_SCHEMA
			+ ".custom_update_registeration_otp($1)";
	public static String CREATE_REGISTERATION_OTP = "select * from " + DB_SCHEMA + ".create_registeration_otp($1)";
	public static String GET_ALL_REGISTERATION_OTP = "select * from " + DB_SCHEMA + ".get_all_registeration_otp($1)";
	public static String GET_BY_ID_REGISTERATION_OTP = "select * from " + DB_SCHEMA
			+ ".get_by_id_registeration_otp($1)";
	public static String UPDATE_REGISTERATION_OTP = "select * from " + DB_SCHEMA + ".update_registeration_otp($1)";
	public static String CUSTOM_SEARCH_REGITRATION_ID_TYPE = "select * from " + DB_SCHEMA
			+ ".custom_search_regitration_id_type($1)";
	public static String CUSTOM_UPDATE_REGITRATION_ID_TYPE = "select * from " + DB_SCHEMA
			+ ".custom_update_regitration_id_type($1)";
	public static String CREATE_REGITRATION_ID_TYPE = "select * from " + DB_SCHEMA + ".create_regitration_id_type($1)";
	public static String GET_ALL_REGITRATION_ID_TYPE = "select * from " + DB_SCHEMA
			+ ".get_all_regitration_id_type($1)";
	public static String GET_BY_ID_REGITRATION_ID_TYPE = "select * from " + DB_SCHEMA
			+ ".get_by_id_regitration_id_type($1)";
	public static String UPDATE_REGITRATION_ID_TYPE = "select * from " + DB_SCHEMA + ".update_regitration_id_type($1)";
	public static String CUSTOM_SEARCH_RESET_OTP = "select * from " + DB_SCHEMA + ".custom_search_reset_otp($1)";
	public static String CUSTOM_UPDATE_RESET_OTP = "select * from " + DB_SCHEMA + ".custom_update_reset_otp($1)";
	public static String CREATE_RESET_OTP = "select * from " + DB_SCHEMA + ".create_reset_otp($1)";
	public static String GET_ALL_RESET_OTP = "select * from " + DB_SCHEMA + ".get_all_reset_otp($1)";
	public static String GET_BY_ID_RESET_OTP = "select * from " + DB_SCHEMA + ".get_by_id_reset_otp($1)";
	public static String UPDATE_RESET_OTP = "select * from " + DB_SCHEMA + ".update_reset_otp($1)";
	public static String CUSTOM_SEARCH_ROLE = "select * from " + DB_SCHEMA + ".custom_search_role($1)";
	public static String CUSTOM_UPDATE_ROLE = "select * from " + DB_SCHEMA + ".custom_update_role($1)";
	public static String CREATE_ROLE = "select * from " + DB_SCHEMA + ".create_role($1)";
	public static String GET_ALL_ROLE = "select * from " + DB_SCHEMA + ".get_all_role()";
	public static String GET_BY_ID_ROLE = "select * from " + DB_SCHEMA + ".get_by_id_role($1)";
	public static String UPDATE_ROLE = "select * from " + DB_SCHEMA + ".update_role($1)";
	public static String CUSTOM_SEARCH_ROLE_PERMISSION = "select * from " + DB_SCHEMA
			+ ".custom_search_role_permission($1)";
	public static String CUSTOM_UPDATE_ROLE_PERMISSION = "select * from " + DB_SCHEMA
			+ ".custom_update_role_permission($1)";
	public static String CREATE_ROLE_PERMISSION = "select * from " + DB_SCHEMA + ".create_role_permission($1)";
	public static String GET_ALL_ROLE_PERMISSION = "select * from " + DB_SCHEMA + ".get_all_role_permission()";
	public static String GET_BY_ID_ROLE_PERMISSION = "select * from " + DB_SCHEMA + ".get_by_id_role_permission($1)";
	public static String UPDATE_ROLE_PERMISSION = "select * from " + DB_SCHEMA + ".update_role_permission($1)";
	public static String CUSTOM_SEARCH_ROLE_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".custom_search_role_permission_hist($1)";
	public static String CUSTOM_UPDATE_ROLE_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".custom_update_role_permission_hist($1)";
	public static String CREATE_ROLE_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".create_role_permission_hist($1)";
	public static String GET_ALL_ROLE_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".get_all_role_permission_hist($1)";
	public static String GET_BY_ID_ROLE_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".get_by_id_role_permission_hist($1)";
	public static String UPDATE_ROLE_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".update_role_permission_hist($1)";
	public static String CUSTOM_SEARCH_SERVICE_API = "select * from " + DB_SCHEMA + ".custom_search_service_api($1)";
	public static String CUSTOM_UPDATE_SERVICE_API = "select * from " + DB_SCHEMA + ".custom_update_service_api($1)";
	public static String CREATE_SERVICE_API = "select * from " + DB_SCHEMA + ".create_service_api($1)";
	public static String GET_ALL_SERVICE_API = "select * from " + DB_SCHEMA + ".get_all_service_apis()";
	public static String GET_BY_ID_SERVICE_API = "select * from " + DB_SCHEMA + ".get_by_id_service_api($1)";
	public static String UPDATE_SERVICE_API = "select * from " + DB_SCHEMA + ".update_service_api($1)";
	public static String CUSTOM_SEARCH_SESSION_INFO = "select * from " + DB_SCHEMA + ".custom_search_session_info($1)";
	public static String CUSTOM_UPDATE_SESSION_INFO = "select * from " + DB_SCHEMA + ".custom_update_session_info($1)";
	public static String CREATE_SESSION_INFO = "select * from " + DB_SCHEMA + ".create_session_info($1)";
	public static String GET_ALL_SESSION_INFO = "select * from " + DB_SCHEMA + ".get_all_session_info($1)";
	public static String GET_BY_ID_SESSION_INFO = "select * from " + DB_SCHEMA + ".get_by_id_session_info($1)";
	public static String UPDATE_SESSION_INFO = "select * from " + DB_SCHEMA + ".update_session_info($1)";
	public static String CUSTOM_SEARCH_SESSION_INFO_HIST = "select * from " + DB_SCHEMA
			+ ".custom_search_session_info_hist($1)";
	public static String CUSTOM_UPDATE_SESSION_INFO_HIST = "select * from " + DB_SCHEMA
			+ ".custom_update_session_info_hist($1)";
	public static String CREATE_SESSION_INFO_HIST = "select * from " + DB_SCHEMA + ".create_session_info_hist($1)";
	public static String GET_ALL_SESSION_INFO_HIST = "select * from " + DB_SCHEMA + ".get_all_session_info_hist($1)";
	public static String GET_BY_ID_SESSION_INFO_HIST = "select * from " + DB_SCHEMA
			+ ".get_by_id_session_info_hist($1)";
	public static String UPDATE_SESSION_INFO_HIST = "select * from " + DB_SCHEMA + ".update_session_info_hist($1)";
	public static String CUSTOM_SEARCH_SIGNIN_INFO = "select * from " + DB_SCHEMA + ".custom_search_signin_info($1)";
	public static String CUSTOM_UPDATE_SIGNIN_INFO = "select * from " + DB_SCHEMA + ".custom_update_signin_info($1)";
	public static String CREATE_SIGNIN_INFO = "select * from " + DB_SCHEMA + ".create_signin_info($1)";
	public static String GET_ALL_SIGNIN_INFO = "select * from " + DB_SCHEMA + ".get_all_signin_info($1)";
	public static String GET_BY_ID_SIGNIN_INFO = "select * from " + DB_SCHEMA + ".get_by_id_signin_info($1)";
	public static String UPDATE_SIGNIN_INFO = "select * from " + DB_SCHEMA + ".update_signin_info($1)";
	public static String CUSTOM_SEARCH_SIGNIN_INFO_HIST = "select * from " + DB_SCHEMA
			+ ".custom_search_signin_info_hist($1)";
	public static String CUSTOM_UPDATE_SIGNIN_INFO_HIST = "select * from " + DB_SCHEMA
			+ ".custom_update_signin_info_hist($1)";
	public static String CREATE_SIGNIN_INFO_HIST = "select * from " + DB_SCHEMA + ".create_signin_info_hist($1)";
	public static String GET_ALL_SIGNIN_INFO_HIST = "select * from " + DB_SCHEMA + ".get_all_signin_info_hist($1)";
	public static String GET_BY_ID_SIGNIN_INFO_HIST = "select * from " + DB_SCHEMA + ".get_by_id_signin_info_hist($1)";
	public static String UPDATE_SIGNIN_INFO_HIST = "select * from " + DB_SCHEMA + ".update_signin_info_hist($1)";
	public static String CUSTOM_SEARCH_TOKENS = "select * from " + DB_SCHEMA + ".custom_search_tokens($1)";
	public static String CUSTOM_UPDATE_TOKENS = "select * from " + DB_SCHEMA + ".custom_update_tokens($1)";
	public static String CREATE_TOKENS = "select * from " + DB_SCHEMA + ".create_tokens($1)";
	public static String GET_ALL_TOKENS = "select * from " + DB_SCHEMA + ".get_all_tokens($1)";
	public static String GET_BY_ID_TOKENS = "select * from " + DB_SCHEMA + ".get_by_id_tokens($1)";
	public static String UPDATE_TOKENS = "select * from " + DB_SCHEMA + ".update_tokens($1)";
	public static String CUSTOM_SEARCH_USER_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".custom_search_user_permission_hist($1)";
	public static String CUSTOM_UPDATE_USER_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".custom_update_user_permission_hist($1)";
	public static String CREATE_USER_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".create_user_permission_hist($1)";
	public static String GET_ALL_USER_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".get_all_user_permission_hist($1)";
	public static String GET_BY_ID_USER_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".get_by_id_user_permission_hist($1)";
	public static String UPDATE_USER_PERMISSION_HIST = "select * from " + DB_SCHEMA
			+ ".update_user_permission_hist($1)";
	public static String CUSTOM_SEARCH_USER_ROLE_HIST = "select * from " + DB_SCHEMA
			+ ".custom_search_user_role_hist($1)";
	public static String CUSTOM_UPDATE_USER_ROLE_HIST = "select * from " + DB_SCHEMA
			+ ".custom_update_user_role_hist($1)";
	public static String CREATE_USER_ROLE_HIST = "select * from " + DB_SCHEMA + ".create_user_role_hist($1)";
	public static String GET_ALL_USER_ROLE_HIST = "select * from " + DB_SCHEMA + ".get_all_user_role_hist($1)";
	public static String GET_BY_ID_USER_ROLE_HIST = "select * from " + DB_SCHEMA + ".get_by_id_user_role_hist($1)";
	public static String UPDATE_USER_ROLE_HIST = "select * from " + DB_SCHEMA + ".update_user_role_hist($1)";
	
	
	public static String GET_DB_TABLE_BY_ID = "select * from " + DB_SCHEMA + ".get_db_table_by_id($1)";
	
	public static String IS_UNIQUE_MODULE_NAME_EXISTS = "select * from " + DB_SCHEMA + ".is_unique_module_name_exists($1)";
	
	public static String IS_UNIQUE_DB_TABLE_NAME_EXISTS = "select * from " + DB_SCHEMA + ".is_unique_db_table_name_exists($1)";
	
	public static String GET_ALL_PERMISSIONS = "select * from " + DB_SCHEMA + ".get_all_permissions()";
	
	public static String GET_MAP_UNMAP_ROLE_PERMISSION_BY_ROLE_ID = "select * from " + DB_SCHEMA + ".get_map_unmap_role_permission_by_role_id($1)";
	
	public static String CREATE_MAP_UNMAP_ROLE_PERMISSIONS = "select * from " + DB_SCHEMA + ".create_map_unmap_role_permissions($1)";
	
	public static String GET_MAP_UNMAP_MODULE_MENU_BY_MODULE_ID = "select * from " + DB_SCHEMA + ".get_map_unmap_module_menu_by_module_id($1)";
	
	public static String CREATE_MAP_UNMAP_MODULE_MENU = "select * from " + DB_SCHEMA + ".create_map_unmap_module_menu($1)";
	
	public static String IS_UNIQUE_MENU_NAME_EXISTS = "select * from " + DB_SCHEMA + ".is_unique_menu_name_exists($1)";
	
	public static String IS_UNIQUE_SERVICE_API_URL_EXISTS = "select * from " + DB_SCHEMA + ".is_unique_service_api_url_exists($1)";
	
	public static String IS_UNIQUE_PERMISSION_NAME_EXISTS = "select * from " + DB_SCHEMA + ".is_unique_permission_name_exists($1)";
	
	public static String IS_UNIQUE_ROLE_NAME_EXISTS = "select * from " + DB_SCHEMA + ".is_unique_role_name_exists($1)";
	
//	public static String IS_UNIQUE_PERMISSION_SERVICE_API_EXISTS = "select * from " + DB_SCHEMA + ".is_unique_permission_service_api_exists($1)";
	
	public static String GET_DASHBOARD = "select * from " + DB_SCHEMA + ".get_dashboard()";
	
	public static String AUTH_USER_REGISTER = "select * from " + DB_SCHEMA + ".auth_user_register($1)";
	
	public static String VERIFY_OTP = "select * from " + DB_SCHEMA + ".verify_otp($1)";
	
	public static String SET_AUTH_USER_PASSWORD = "select * from " + DB_SCHEMA + ".set_auth_user_password($1)";
	
	public static String LOGIN = "select * from " + DB_SCHEMA + ".login($1)";
	
	public static String VERIFY_EMAIL = "select * from " + DB_SCHEMA + ".verify_email($1)";
	
	public static String GET_ALL_MENU_SUBMENU = "select * from " + DB_SCHEMA + ".get_all_menu_submenu()";
	
	public static String GET_ALL_LOADER = "select * from " + DB_SCHEMA + ".get_all_loader()";
	
	public static String GET_MAPPED_UNMAPPED_ENTITIES_FOR_LOADER = "select * from " + DB_SCHEMA + ".get_mapped_unmapped_entities_for_loader($1)";
	
	public static String CREATE_USER = "select * from " + DB_SCHEMA + ".create_user($1)";	
	
	public static String GET_AUTH_USER = "select * from " + DB_SCHEMA + ".get_auth_user($1)";	
	
	public static String GET_USER_BY_QBOX_ENTITY = "select * from " + DB_SCHEMA + ".get_user_by_qbox_entity($1)";
	
	public static String DELETE_USER_BY_ID = "select * from " + DB_SCHEMA + ".delete_user_by_id($1)";

}
