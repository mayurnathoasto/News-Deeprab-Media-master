import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:news/cubits/appLocalizationCubit.dart';
import 'package:news/cubits/getRssFeedsCubit.dart';
import 'package:news/data/models/FeatureSectionModel.dart';
import 'package:news/ui/widgets/customTextLabel.dart';
import 'package:news/app/routes.dart';
import 'package:news/utils/uiUtils.dart';
import 'package:news/cubits/appSystemSettingCubit.dart';
import 'package:news/ui/screens/dashBoard/dashBoardScreen.dart';
import 'package:news/utils/internetConnectivity.dart';

Widget commonSectionTitle(FeatureSectionModel model, BuildContext context) {
  return ListTile(
    minVerticalPadding: 5,
    contentPadding: EdgeInsets.zero,
    title: Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
            child: CustomTextLabel(
                text: model.title!,
                textStyle: Theme.of(context).textTheme.titleMedium!.copyWith(
                    color: UiUtils.getColorScheme(context).primaryContainer,
                    fontWeight: FontWeight.bold),
                softWrap: true,
                maxLines: 1,
                overflow: TextOverflow.ellipsis)),
        GestureDetector(
          onTap: () async {
            UiUtils.showInterstitialAds(context: context);
            if ((model.newsType == newsTypeToString(NewsType.news) ||
                    model.newsType == newsTypeToString(NewsType.userChoice) ||
                    model.newsType == newsTypeToString(NewsType.authorNews)) ||
                model.videosType == newsTypeToString(NewsType.news) &&
                    model.newsType != newsTypeToString(NewsType.breakingNews)) {
              Navigator.of(context).pushNamed(Routes.sectionNews,
                  arguments: {"sectionId": model.id!, "title": model.title!});
            } else if (model.newsType ==
                newsTypeToString(NewsType.rssFeedsNews)) {
              // Change tab to RSS feed tab (index 3)
              final dashBoardState =
                  context.findAncestorStateOfType<DashBoardState>();
              if (dashBoardState != null) {
                // Calculate RSS feed tab index: 3 if Category Mode is enabled, 2 if disabled
                final isCategoryModeEnabled =
                    context.read<AppConfigurationCubit>().getCategoryMode() ==
                        "1";
                final rssFeedTabIndex = isCategoryModeEnabled ? 3 : 2;

                // Reload RSS feed data before changing tab
                if (await InternetConnectivity.isNetworkAvailable()) {
                  context.read<GetRssFeedsCubit>().getRssFeeds(
                      languageCode: context
                          .read<AppLocalizationCubit>()
                          .state
                          .languageCode,
                      categoryIds: [model.categoryIds ?? ""],
                      subcategoryIds: [model.subcategoryIds ?? ""]);
                }
                // Change tab - BlocBuilder will handle UI updates when state changes
                dashBoardState.changeTab(rssFeedTabIndex);
              }
              return;
            } else {
              Navigator.of(context).pushNamed(Routes.sectionBreakNews,
                  arguments: {"sectionId": model.id!, "title": model.title!});
            }
          },
          child: CustomTextLabel(
              text: 'viewMore',
              textStyle: Theme.of(context).textTheme.titleSmall!.copyWith(
                  decoration: TextDecoration.underline,
                  fontWeight: FontWeight.bold,
                  color: UiUtils.getColorScheme(context).outline)),
        )
      ],
    ),
    subtitle: (model.shortDescription != null)
        ? CustomTextLabel(
            text: model.shortDescription!,
            textStyle: Theme.of(context).textTheme.titleSmall!.copyWith(
                color: UiUtils.getColorScheme(context)
                    .primaryContainer
                    .withOpacity(0.6)),
            softWrap: true,
            maxLines: 3,
            overflow: TextOverflow.ellipsis)
        : SizedBox.shrink(),
  );
}
