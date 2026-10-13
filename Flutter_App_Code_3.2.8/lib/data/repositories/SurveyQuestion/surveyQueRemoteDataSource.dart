import 'package:news/utils/api.dart';
import 'package:news/utils/strings.dart';

class SurveyQuestionRemoteDataSource {
  Future<dynamic> getSurveyQuestions({required String langCode}) async {
    try {
      final body = {LANGUAGE_CODE: langCode};
      final result = await Api.sendApiRequest(body: body, url: Api.getQueApi);

      return result;
    } catch (e) {
      throw ApiMessageAndCodeException(errorMessage: e.toString());
    }
  }
}
