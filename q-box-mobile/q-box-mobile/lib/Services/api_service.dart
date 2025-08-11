import 'dart:convert';
import 'package:dio/dio.dart';

import '../Core/Configurations/config.dart';

class ApiService {

  Dio _dio = Dio();

  Uri _buildUri(String port,String service,String endpoint) {
    print('HOST${AppConfig.HOST}');
    print(Uri.parse('${AppConfig.URL}${AppConfig.HOST}:$port${AppConfig.API_PREFIX}/$service/$endpoint'));
    return Uri.parse('${AppConfig.URL}${AppConfig.HOST}:$port${AppConfig.API_PREFIX}/$service/$endpoint');
  }

  Future<dynamic> get(String port,String service,String endpoint) async {
    final response = await _dio.getUri(_buildUri(port,service,endpoint));

    if (response.statusCode == 200) {
      return json.decode(response.data);
    } else {
      throw Exception('Failed to perform GET request');
    }
  }

  Future<dynamic> post(String port, String service, String endpoint, Map<String, dynamic> body) async {
    try {
      final response = await _dio.postUri(
        _buildUri(port, service, endpoint),
        data: body, // No need to encode data, Dio handles it automatically
        options: Options(contentType: Headers.jsonContentType),
      );
      print(response);
      if (response.statusCode == 200) {
        return response.data; // Response data is already decoded
      } else {
        throw Exception('Failed to perform POST request');
      }
    } catch (error) {
      throw Exception('Failed to perform POST request: $error');
    }
  }

  Future<dynamic> put(String port,String service,String endpoint, dynamic body) async {
    final response = await _dio.putUri(
      _buildUri(port,service,endpoint),
      data: body,
      options: Options(contentType: Headers.jsonContentType),
    );

    if (response.statusCode == 200) {
      return json.decode(response.data);
    } else {
      throw Exception('Failed to perform PUT request');
    }
  }

  Future<dynamic> delete(String port,String service,String endpoint) async {
    final response = await _dio.deleteUri(_buildUri(port,service,endpoint));

    if (response.statusCode == 200) {
      return json.decode(response.data);
    } else {
      throw Exception('Failed to perform DELETE request');
    }
  }

}