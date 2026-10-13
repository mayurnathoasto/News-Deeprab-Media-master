import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:news/data/repositories/Auth/authLocalDataSource.dart';
import 'package:news/utils/ErrorMessageKeys.dart';
import 'package:news/utils/curl_logger_interceptor.dart';
import 'package:news/utils/internetConnectivity.dart';
import 'package:news/utils/constant.dart';

class ApiMessageAndCodeException implements Exception {
  final String errorMessage;

  ApiMessageAndCodeException({required this.errorMessage});

  Map toError() => {"message": errorMessage};

  @override
  String toString() => errorMessage;
}

class ApiException implements Exception {
  String errorMessage;

  ApiException(this.errorMessage);

  @override
  String toString() {
    return errorMessage;
  }
}

class Api {
  static String getToken() {
    String token = AuthLocalDataSource().getJWTtoken();
    debugPrint("token $token");
    return (token.trim().isNotEmpty) ? token : "";
  }

  static Map<String, String> get headers =>
      {"Authorization": 'Bearer ${getToken()}'};

  //all apis list
  static String getUserSignUpApi = 'user_signup';
  static String getNewsApi = 'get_news';
  static String getSettingApi = 'get_settings';
  static String getCatApi = 'get_category';
  static String setBookmarkApi = 'set_bookmark';
  static String getBookmarkApi = 'get_bookmark';
  static String setCommentApi = 'set_comment';
  static String getCommentByNewsApi = 'get_comment_by_news';
  static String getBreakingNewsApi = 'get_breaking_news';
  static String setUpdateProfileApi = 'update_profile';
  static String setRegisterToken = 'register_token';
  static String setUserCatApi = 'set_user_category';
  static String getUserByIdApi = 'get_user_by_id';
  static String setCommentDeleteApi = 'delete_comment';
  static String setLikesDislikesApi = 'set_like_dislike';
  static String setFlagApi = 'set_flag';
  static String getLiveStreamingApi = 'get_live_streaming';
  static String getSubCategoryApi = 'get_subcategory_by_category';
  static String setLikeDislikeComApi = 'set_comment_like_dislike';
  static String getUserNotificationApi = 'get_user_notification';
  static String deleteUserNotiApi = 'delete_user_notification';
  static String getQueApi = 'get_question';
  static String getQueResultApi = 'get_question_result';
  static String setQueResultApi = 'set_question_result';
  static String userDeleteApi = 'delete_user';
  static String getTagsApi = 'get_tag';
  static String setNewsApi = 'set_news';
  static String setDeleteNewsApi = 'delete_news';
  static String setDeleteImageApi = 'delete_news_images';
  static String getVideosApi = 'get_videos';
  static String getLanguagesApi = 'get_languages_list';
  static String getLangJsonDataApi = 'get_language_json_data';
  static String getPagesApi = 'get_pages';
  static String getPolicyPagesApi = 'get_policy_pages';
  static String getFeatureSectionApi = 'get_featured_sections';
  static String getLikeNewsApi = 'get_like';
  static String setNewsViewApi = 'set_news_view';
  static String setBreakingNewsViewApi = 'set_breaking_news_view';
  static String getAdsNewsDetailsApi = 'get_ad_space_news_details';
  static String getLocationCityApi = 'get_location';
  static String slugCheckApi = 'check_slug_availability';
  static String rssFeedApi = 'get_rss_feed';
  static String getFeedItemsApi = 'get_feed_items';
  static String becomeAnAuthorApi = 'become_author';
  static String getAuthorNewsApi = 'get_authors_news';
  static String getDraftNewsApi = 'get_user_drafted_news';
  static String addTagApi = 'create_tag';
  static String getENewsApi = 'get_e_news';
  static String getShortNewsApi = 'get_short_news';
  static String geminiMetaInfoApi =
      'https://generativelanguage.googleapis.com/v1beta/models/';
  static Dio get dio {
    final dio = Dio();
    dio.interceptors.add(CurlLoggerInterceptor(
      printOnSuccess: true,
      convertFormData: true, // Ensures form-data works with Postman curl import
    ));
    return dio;
  }

  static FormData? toFormData(dynamic data) {
    if (data == null) return null;

    if (data is Map<String, dynamic>) {
      return FormData.fromMap(data, ListFormat.multiCompatible);
    }

    if (data is List) {
      final formData = FormData();
      for (var value in data) {
        formData.fields.add(MapEntry("list[]", value.toString()));
      }
      return formData;
    }

    // Raw value (int/string/etc.) → cannot convert → return null
    return null;
  }

  static Future<Map<String, dynamic>> sendApiRequest(
      {required dynamic body, required String url, bool isGet = false}) async {
    try {
      if (!await InternetConnectivity.isNetworkAvailable()) {
        throw const SocketException(ErrorMessageKeys.noInternet);
      }

      final Dio dio = Dio();
      final apiUrl = "$databaseUrl$url";

      // Convert only if possible
      final convertedBody = toFormData(body);

      debugPrint("Requested API: $url");
      debugPrint("Converted Body (FormData fields): ${convertedBody?.fields}");
      debugPrint("Raw Body: $body");

      final Options options = Options(
        headers: headers,
        validateStatus: (status) {
          return status != null && (status < 500 || status == 404);
          //excluded 404 status code due to API response status
        },
      );

      final response = (isGet)
          ? await dio.get(apiUrl, queryParameters: {}, options: options)
          : await dio.post(apiUrl,
              data: convertedBody ?? body, options: options);

      if (response.data['error'] == 'true') {
        debugPrint("API Exception: ${response.data['message']}");
        throw ApiException(response.data['message']);
      }

      debugPrint("API Response: ${response.data}");
      return Map<String, dynamic>.from(response.data);
    } on DioException catch (e) {
      debugPrint("Dio Error - $e");

      if (e.response?.statusCode == 503) {
        throw ApiException(ErrorMessageKeys.serverDownMessage);
      } else if (e.response?.statusCode == 302) {
        throw ApiException(ErrorMessageKeys.noDataMessage);
      }

      throw ApiException(
        e.error is SocketException
            ? ErrorMessageKeys.noInternet
            : ErrorMessageKeys.defaultErrorMessage,
      );
    } on SocketException catch (e) {
      throw SocketException(e.message);
    } on ApiException catch (e) {
      throw ApiException(e.errorMessage);
    } catch (e) {
      debugPrint("Unhandled exception: $e");
      throw ApiException(ErrorMessageKeys.defaultErrorMessage);
    }
  }
}
