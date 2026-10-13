import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:news/data/models/AuthModel.dart';
import 'package:news/data/models/NewsModel.dart';
import 'package:news/utils/api.dart';
import 'package:news/utils/strings.dart';

abstract class AuthorNewsState {}

class AuthorNewsInitial extends AuthorNewsState {}

class AuthorNewsFetchInProgress extends AuthorNewsState {}

class AuthorNewsFetchSuccess extends AuthorNewsState {
  final List<NewsModel> AuthorNewsList;
  final dynamic authorData;
  final int totalAuthorNewsCount;
  final bool hasMoreFetchError;
  final bool hasMore;

  AuthorNewsFetchSuccess({
    required this.AuthorNewsList,
    required this.authorData,
    required this.totalAuthorNewsCount,
    required this.hasMoreFetchError,
    required this.hasMore,
  });
}

class AuthorNewsFetchFailed extends AuthorNewsState {
  final String errorMessage;

  AuthorNewsFetchFailed(this.errorMessage);
}

class AuthorNewsCubit extends Cubit<AuthorNewsState> {
  AuthorNewsCubit() : super(AuthorNewsInitial());

  void getAuthorNews({required String authorId}) async {
    try {
      emit(AuthorNewsInitial());
      final body = {USER_ID: authorId};
      final apiUrl = Api.getAuthorNewsApi;
      final result = await Api.sendApiRequest(body: body, url: apiUrl);

      (!result[ERROR])
          ? emit(
              AuthorNewsFetchSuccess(
                AuthorNewsList: (result[DATA][NEWS][DATA] as List)
                    .map((e) => NewsModel.fromJson(e))
                    .toList(),
                authorData: result[DATA][USER].containsKey(FIREBASE_ID)
                    ? AuthModel.fromJson(result[DATA][USER])
                    : UserAuthorModel.fromJson(result[DATA][USER]),
                totalAuthorNewsCount: result[DATA][NEWS][TOTAL],
                hasMore: false,
                hasMoreFetchError: false,
              ),
            )
          : emit(AuthorNewsFetchFailed(result[MESSAGE]));
    } catch (e) {
      emit(AuthorNewsFetchFailed(e.toString()));
    }
  }
}
