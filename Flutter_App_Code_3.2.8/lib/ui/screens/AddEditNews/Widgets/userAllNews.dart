import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:news/cubits/getUserNewsCubit.dart';
import 'package:news/ui/screens/AddEditNews/Widgets/UserNewsWidgets.dart';
import 'package:news/ui/widgets/errorContainerWidget.dart';
import 'package:news/utils/ErrorMessageKeys.dart';
import 'package:news/utils/uiUtils.dart';

class UserAllNewsTab extends StatelessWidget {
  final ScrollController controller;
  final Widget contentShimmer;
  final Function fetchNews;
  final Function fetchMoreNews;

  UserAllNewsTab(
      {super.key,
      required this.controller,
      required this.contentShimmer,
      required this.fetchNews,
      required this.fetchMoreNews});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<GetUserNewsCubit, GetUserNewsState>(
        builder: (context, state) {
      if (state is GetUserNewsFetchSuccess) {
        return RefreshIndicator(
          onRefresh: () async => fetchNews(),
          child: Padding(
            padding: const EdgeInsetsDirectional.only(
                start: 10, end: 10, bottom: 10),
            child: ListView.builder(
                controller: controller,
                physics: const AlwaysScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount: state.getUserNews.length,
                itemBuilder: (context, index) {
                  return UsernewsWidgets.buildNewsContainer(
                      context: context,
                      model: state.getUserNews[index],
                      hasMore: state.hasMore,
                      hasMoreNewsFetchError: state.hasMoreFetchError,
                      index: index,
                      totalCurrentNews: state.getUserNews.length,
                      fetchMoreNews: fetchMoreNews);
                }),
          ),
        );
      }
      if (state is GetUserNewsFetchFailure) {
        return ErrorContainerWidget(
            errorMsg: (state.errorMessage.contains(ErrorMessageKeys.noInternet))
                ? UiUtils.getTranslatedLabel(context, 'internetmsg')
                : state.errorMessage,
            onRetry: () => fetchNews());
      }
      return contentShimmer;
    });
  }
}
