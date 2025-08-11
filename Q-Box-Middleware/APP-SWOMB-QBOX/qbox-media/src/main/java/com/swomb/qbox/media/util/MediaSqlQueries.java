package com.swomb.qbox.media.util;

import com.swomb.qbox.media.ServerVerticle;

public class MediaSqlQueries {
	
	public static String DB_SCHEMA  = ServerVerticle.DB_SCHEMA;
	
	public static String SERVICE_HEALTH= "select * from "+DB_SCHEMA+".service_health($1)";

	public static String INSERT_MEDIA = "select * from media.insert_media($1)";
	
	public static String INSERT_MULTI_MEDIA = "select * from media.insert_multi_media($1)";
	
	public static String UPDATE_VIDEO_PROGRESS = "select * from " + "portal" + ".update_video_progress($1)";
	
	public static String UPDATE_WATCHED_VIDEO = "select * from " +  "portal" + ".update_watched_video($1)";
}
