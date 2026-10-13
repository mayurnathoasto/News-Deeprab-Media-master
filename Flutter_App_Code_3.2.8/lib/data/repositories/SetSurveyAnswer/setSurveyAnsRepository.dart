import 'package:news/data/repositories/SetSurveyAnswer/setSurveyAnsDataRemoteSource.dart';
import 'package:news/utils/strings.dart';

class SetSurveyAnsRepository {
  static final SetSurveyAnsRepository _setSurveyAnsRepository =
      SetSurveyAnsRepository._internal();

  late SetSurveyAnsRemoteDataSource _setSurveyAnsRemoteDataSource;

  factory SetSurveyAnsRepository() {
    _setSurveyAnsRepository._setSurveyAnsRemoteDataSource =
        SetSurveyAnsRemoteDataSource();
    return _setSurveyAnsRepository;
  }

  SetSurveyAnsRepository._internal();

  Future<Map<String, dynamic>> setSurveyAns(
      {required String queId,
      required String optId,
      required String languageCode}) async {
    final result = await _setSurveyAnsRemoteDataSource.setSurveyAns(
        optId: optId, queId: queId, languageCode: languageCode);

    return {"message": result[MESSAGE]};
  }
}
