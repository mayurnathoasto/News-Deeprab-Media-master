import 'dart:math';

import 'package:flutter/material.dart';
import 'package:news/ui/screens/HomePage/Widgets/CommonSectionTitle.dart';
import 'package:news/app/routes.dart';
import 'package:news/data/models/BreakingNewsModel.dart';
import 'package:news/data/models/FeatureSectionModel.dart';
import 'package:news/data/models/NewsModel.dart';
import 'package:news/data/models/RSSFeedModel.dart';
import 'package:news/ui/widgets/customTextLabel.dart';
import 'package:news/utils/constant.dart';
import 'package:news/utils/uiUtils.dart';
import 'package:news/ui/styles/colors.dart';
import 'package:news/ui/widgets/networkImage.dart';
import 'package:url_launcher/url_launcher.dart';

class Style4Section extends StatelessWidget {
  final FeatureSectionModel model;

  const Style4Section({super.key, required this.model});

  @override
  Widget build(BuildContext context) {
    return style4Data(model, context);
  }

  Widget style4Data(FeatureSectionModel model, BuildContext context) {
    int limit = limitOfAllOtherStyle;
    int newsLength = (model.newsType == newsTypeToString(NewsType.news) ||
            model.newsType == newsTypeToString(NewsType.userChoice))
        ? model.news!.length
        : (model.newsType == newsTypeToString(NewsType.rssFeedsNews))
            ? model.rssFeedNews!.length
            : (model.newsType == newsTypeToString(NewsType.authorNews))
                ? (model.authorNews?.length ?? 0)
            : model.videos!.length;
    int brNewsLength = model.newsType == newsTypeToString(NewsType.breakingNews)
        ? model.breakNews!.length
        : model.breakVideos!.length;
    if (model.breakVideos!.isNotEmpty ||
        model.breakNews!.isNotEmpty ||
        model.videos!.isNotEmpty ||
        model.news?.isNotEmpty == true ||
        model.authorNews?.isNotEmpty == true ||
        model.rssFeedNews?.isNotEmpty == true) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          commonSectionTitle(model, context),
          if ((model.newsType == newsTypeToString(NewsType.news) ||
                  model.newsType == newsTypeToString(NewsType.userChoice) ||
                  model.newsType == newsTypeToString(NewsType.authorNews) ||
                  model.newsType == newsTypeToString(NewsType.rssFeedsNews))
              ? (model.newsType == newsTypeToString(NewsType.rssFeedsNews))
                  ? model.rssFeedNews!.isNotEmpty
                  : (model.newsType == newsTypeToString(NewsType.authorNews))
                      ? model.authorNews?.isNotEmpty == true
                  : model.news!.isNotEmpty
              : model.videos!.isNotEmpty)
            Column(
              children: [
                setGridLayout(
                    context: context,
                    totalCount: min(newsLength, limit),
                    childWidget: (context, index) {
                      bool isRssFeedsNews = model.newsType ==
                          newsTypeToString(NewsType.rssFeedsNews);
                      NewsModel data =
                          (model.newsType == newsTypeToString(NewsType.news) ||
                                  model.newsType ==
                                      newsTypeToString(NewsType.userChoice))
                              ? model.news![index]
                              : ((isRssFeedsNews)
                                  ? NewsModel()
                                  : (model.newsType ==
                                          newsTypeToString(NewsType.authorNews))
                                      ? (model.authorNews ?? [])[index]
                                  : model.videos![index]);
                      final RSSFeedModel rssData = (model.newsType ==
                              newsTypeToString(NewsType.rssFeedsNews))
                          ? (model.rssFeedNews?[index] ?? RSSFeedModel())
                          : RSSFeedModel();
                      return InkWell(
                        child: Container(
                          padding: const EdgeInsets.all(7),
                          decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(10),
                              color: UiUtils.getColorScheme(context).surface),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Stack(children: [
                                setNewsImage(
                                    context: context,
                                    imageURL: (isRssFeedsNews)
                                        ? (rssData.image ?? "")
                                        : (data.image ?? "")),
                                if (!isRssFeedsNews &&
                                    data.categoryName != null &&
                                    data.categoryName!.trim().isNotEmpty)
                                  Align(
                                    alignment: Alignment.topLeft,
                                    child: Container(
                                        margin:
                                            const EdgeInsetsDirectional.only(
                                                start: 7.0, top: 7.0),
                                        height: 18.0,
                                        padding:
                                            const EdgeInsetsDirectional.only(
                                                start: 6.0, end: 6.0, top: 2.5),
                                        decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(5),
                                            color:
                                                Theme.of(context).primaryColor),
                                        child: CustomTextLabel(
                                            text: data.categoryName!,
                                            textAlign: TextAlign.center,
                                            textStyle: Theme.of(context)
                                                .textTheme
                                                .bodySmall
                                                ?.copyWith(
                                                    color: secondaryColor),
                                            overflow: TextOverflow.ellipsis,
                                            softWrap: true)),
                                  ),
                                if (model.newsType ==
                                        newsTypeToString(NewsType.videos) ||
                                    model.videosType ==
                                        newsTypeToString(NewsType.videos))
                                  Positioned.directional(
                                    textDirection: Directionality.of(context),
                                    top: MediaQuery.of(context).size.height *
                                        0.065,
                                    start:
                                        MediaQuery.of(context).size.width / 6,
                                    end: MediaQuery.of(context).size.width / 6,
                                    child: InkWell(
                                        onTap: () {
                                          List<NewsModel> allNewsList =
                                              List.from(model.videos ?? [])
                                                ..removeAt(index);
                                          Navigator.of(context).pushNamed(
                                              Routes.newsVideo,
                                              arguments: {
                                                "from": 1,
                                                "model": data,
                                                "otherVideos": allNewsList
                                              });
                                        },
                                        child: UiUtils.setPlayButton(
                                            context: context)),
                                  ),
                              ]),
                              Padding(
                                  padding: const EdgeInsets.only(top: 8.0),
                                  child: CustomTextLabel(
                                      text: isRssFeedsNews
                                          ? rssData.feedName ?? ""
                                          : data.title ?? "",
                                      textStyle: Theme.of(context)
                                          .textTheme
                                          .titleSmall!
                                          .copyWith(
                                              color: UiUtils.getColorScheme(
                                                      context)
                                                  .primaryContainer),
                                      softWrap: true,
                                      maxLines: 3,
                                      overflow: TextOverflow.ellipsis)),
                            ],
                          ),
                        ),
                        onTap: () async {
                          // Open RSS feed links in external browser for RSS sections
                          if (model.newsType ==
                                  newsTypeToString(NewsType.rssFeedsNews) &&
                              rssData.feedUrl != null &&
                              rssData.feedUrl!.isNotEmpty) {
                            final uri = Uri.tryParse(rssData.feedUrl!);
                            if (uri != null) {
                              await launchUrl(uri,
                                  mode: LaunchMode.inAppBrowserView);
                            }
                            return;
                          }

                          if (model.newsType ==
                                  newsTypeToString(NewsType.news) ||
                              model.newsType ==
                                  newsTypeToString(NewsType.userChoice) ||
                              model.newsType ==
                                  newsTypeToString(NewsType.authorNews)) {
                            //show interstitial ads
                            UiUtils.showInterstitialAds(context: context);
                            List<NewsModel> newsList = [];
                            newsList.addAll(model.newsType ==
                                    newsTypeToString(NewsType.authorNews)
                                ? (model.authorNews ?? [])
                                : (model.news ?? []));
                            newsList.removeAt(index);
                            Navigator.of(context).pushNamed(Routes.newsDetails,
                                arguments: {
                                  "model": data,
                                  "newsList": newsList,
                                  "isFromBreak": false,
                                  "fromShowMore": false
                                });
                          }
                        },
                      );
                    }),
              ],
            ),
          if ((model.newsType == newsTypeToString(NewsType.breakingNews) ||
                  model.videosType ==
                      newsTypeToString(NewsType.breakingNews)) &&
              (model.newsType == newsTypeToString(NewsType.breakingNews)
                  ? model.breakNews!.isNotEmpty
                  : model.breakVideos!.isNotEmpty))
            setGridLayout(
                context: context,
                totalCount: min(brNewsLength, limit),
                childWidget: (context, index) {
                  BreakingNewsModel data =
                      model.newsType == newsTypeToString(NewsType.breakingNews)
                          ? model.breakNews![index]
                          : model.breakVideos![index];
                  return InkWell(
                    child: Container(
                      padding: const EdgeInsets.all(7),
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          color: UiUtils.getColorScheme(context).surface),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Stack(children: [
                            setNewsImage(
                                context: context, imageURL: data.image!),
                            if (model.newsType ==
                                    newsTypeToString(NewsType.videos) ||
                                model.videosType ==
                                    newsTypeToString(NewsType.videos))
                              Positioned.directional(
                                textDirection: Directionality.of(context),
                                top: MediaQuery.of(context).size.height * 0.065,
                                start: MediaQuery.of(context).size.width / 6,
                                end: MediaQuery.of(context).size.width / 6,
                                child: InkWell(
                                    onTap: () {
                                      List<BreakingNewsModel> brNewsList =
                                          List.from(model.breakVideos ?? [])
                                            ..removeAt(index);
                                      Navigator.of(context).pushNamed(
                                          Routes.newsVideo,
                                          arguments: {
                                            "from": 3,
                                            "breakModel": data,
                                            "otherBreakingVideos": brNewsList
                                          });
                                    },
                                    child: UiUtils.setPlayButton(
                                        context: context)),
                              ),
                          ]),
                          Padding(
                              padding: const EdgeInsets.only(top: 8.0),
                              child: CustomTextLabel(
                                  text: data.title!,
                                  textStyle: Theme.of(context)
                                      .textTheme
                                      .titleSmall!
                                      .copyWith(
                                          color: UiUtils.getColorScheme(context)
                                              .primaryContainer),
                                  softWrap: true,
                                  maxLines: 3,
                                  overflow: TextOverflow.ellipsis)),
                        ],
                      ),
                    ),
                    onTap: () {
                      if (model.newsType ==
                          newsTypeToString(NewsType.breakingNews)) {
                        //interstitial ads
                        UiUtils.showInterstitialAds(context: context);
                        List<BreakingNewsModel> breakList = [];
                        breakList.addAll(model.breakNews!);
                        breakList.removeAt(index);
                        Navigator.of(context)
                            .pushNamed(Routes.newsDetails, arguments: {
                          "breakModel": data,
                          "breakNewsList": breakList,
                          "isFromBreak": true,
                          "fromShowMore": false
                        });
                      }
                    },
                  );
                })
        ],
      );
    } else {
      return const SizedBox.shrink();
    }
  }

  Widget setGridLayout(
      {required BuildContext context,
      required int totalCount,
      required Widget? Function(BuildContext, int) childWidget}) {
    return GridView.builder(
        padding: EdgeInsets.zero,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            mainAxisExtent: MediaQuery.of(context).size.height * 0.27,
            crossAxisCount: 2,
            crossAxisSpacing: 10,
            mainAxisSpacing: 13),
        shrinkWrap: true,
        itemCount: totalCount,
        physics: const NeverScrollableScrollPhysics(),
        itemBuilder: childWidget);
  }

  Widget setNewsImage(
      {required BuildContext context, required String imageURL}) {
    return ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: CustomNetworkImage(
            networkImageUrl: imageURL,
            height: MediaQuery.of(context).size.height * 0.175,
            width: MediaQuery.of(context).size.width,
            fit: BoxFit.cover,
            isVideo: model.newsType == newsTypeToString(NewsType.videos)
                ? true
                : false));
  }
}
