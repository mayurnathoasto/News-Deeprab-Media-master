import 'package:news/utils/api.dart';
import 'package:news/utils/strings.dart';

class AddTagRemoteDataSource {
  Future<dynamic> addTag(
      {required String langCode, required String tagName}) async {
    try {
      final body = {LANGUAGE_CODE: langCode, TAGNAME: tagName};
      final result = await Api.sendApiRequest(body: body, url: Api.addTagApi);
      return result;
    } catch (e) {
      throw ApiMessageAndCodeException(errorMessage: e.toString());
    }
  }
}
