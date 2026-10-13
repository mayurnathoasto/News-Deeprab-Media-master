import 'package:news/utils/api.dart';
import 'package:news/utils/constant.dart';
import 'package:news/utils/strings.dart';

class SectionRemoteDataSource {
  Future<dynamic> getSections(
      {required String langCode,
      String? latitude,
      String? longitude,
      String? limit,
      String? offset,
      String? sectionOffset}) async {
    try {
      final body = {
        LANGUAGE_CODE: langCode,
        LIMIT: limit,
        OFFSET: offset,
        SECTION_LIMIT: limitOfSectionsData,
        SECTION_OFFSET: sectionOffset
      };

      if (latitude != null && latitude != "null") body[LATITUDE] = latitude;
      if (longitude != null && longitude != "null") body[LONGITUDE] = longitude;

      final result =
          await Api.sendApiRequest(body: body, url: Api.getFeatureSectionApi);
      return result;
    } catch (e) {
      throw ApiMessageAndCodeException(errorMessage: e.toString());
    }
  }
}
