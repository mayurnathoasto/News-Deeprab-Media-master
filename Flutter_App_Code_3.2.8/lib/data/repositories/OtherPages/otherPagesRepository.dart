import 'package:news/utils/api.dart';
import 'package:news/utils/strings.dart';
import 'package:news/data/models/OtherPageModel.dart';
import 'package:news/data/repositories/OtherPages/otherPageRemoteDataSorce.dart';

class OtherPageRepository {
  static final OtherPageRepository _otherPageRepository =
      OtherPageRepository._internal();

  late OtherPageRemoteDataSource _otherPageRemoteDataSource;

  factory OtherPageRepository() {
    _otherPageRepository._otherPageRemoteDataSource =
        OtherPageRemoteDataSource();
    return _otherPageRepository;
  }

  OtherPageRepository._internal();

  Future<Map<String, dynamic>> getOtherPage({required String langCode}) async {
    final result =
        await _otherPageRemoteDataSource.getOtherPages(langCode: langCode);

    return {
      "OtherPage": (result[DATA][DATA] as List)
          .map((e) => OtherPageModel.fromJson(e))
          .toList()
    };
  }

  //get only privacy policy & Terms Conditions
  Future<Map<String, dynamic>> getPrivacyTermsPage(
      {required String langCode}) async {
    try {
      final body = {LANGUAGE_CODE: langCode};
      final result =
          await Api.sendApiRequest(body: body, url: Api.getPolicyPagesApi);
      return result;
    } catch (e) {
      throw ApiMessageAndCodeException(errorMessage: e.toString());
    }
  }
}
