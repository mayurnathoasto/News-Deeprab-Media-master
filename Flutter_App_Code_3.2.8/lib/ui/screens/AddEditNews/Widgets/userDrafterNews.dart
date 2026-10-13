import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:news/cubits/getUserDraftedNewsCubit.dart';
import 'package:news/ui/screens/AddEditNews/Widgets/UserNewsWidgets.dart';
import 'package:news/ui/widgets/errorContainerWidget.dart';
import 'package:news/utils/ErrorMessageKeys.dart';
import 'package:news/utils/uiUtils.dart';

class UserDrafterNewsTab extends StatelessWidget {
  final ScrollController controller;
  final Widget contentShimmer;
  final Function fetchDraftedNews;
  final Function fetchMoreDraftedNews;

  UserDrafterNewsTab(
      {super.key,
      required this.controller,
      required this.contentShimmer,
      required this.fetchDraftedNews,
      required this.fetchMoreDraftedNews});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<GetUserDraftedNewsCubit, GetUserDraftedNewsState>(
        builder: (context, state) {
      if (state is GetUserDraftedNewsFetchSuccess) {
        if (state.GetUserDraftedNews.isEmpty)
          return ErrorContainerWidget(
              errorMsg: ErrorMessageKeys.noDataMessage,
              onRetry: () => fetchDraftedNews());
        return Padding(
          padding:
              const EdgeInsetsDirectional.only(start: 10, end: 10, bottom: 10),
          child: RefreshIndicator(
            onRefresh: () async => fetchDraftedNews(),
            child: ListView.builder(
                controller: controller,
                physics: const AlwaysScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount: state.GetUserDraftedNews.length,
                itemBuilder: (context, index) {
                  return UsernewsWidgets.buildNewsContainer(
                      context: context,
                      model: state.GetUserDraftedNews[index],
                      hasMore: state.hasMore,
                      hasMoreNewsFetchError: state.hasMoreFetchError,
                      index: index,
                      totalCurrentNews: state.GetUserDraftedNews.length,
                      fetchMoreNews: fetchMoreDraftedNews);
                }),
          ),
        );
      }
      if (state is GetUserDraftedNewsFetchFailure) {
        return ErrorContainerWidget(
            errorMsg: (state.errorMessage.contains(ErrorMessageKeys.noInternet))
                ? UiUtils.getTranslatedLabel(context, 'internetmsg')
                : state.errorMessage,
            onRetry: fetchDraftedNews);
      }
      return contentShimmer;
    });
  }
}
