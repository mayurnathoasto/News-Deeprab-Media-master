import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive/hive.dart';
import 'package:intl/intl.dart';
import 'package:news/app/routes.dart';
import 'package:news/cubits/deleteUserNewsCubit.dart';
import 'package:news/cubits/getUserNewsCubit.dart';
import 'package:news/cubits/themeCubit.dart';
import 'package:news/data/models/NewsModel.dart';
import 'package:news/ui/styles/appTheme.dart';
import 'package:news/ui/styles/colors.dart';
import 'package:news/data/models/FeatureSectionModel.dart';
import 'package:news/ui/widgets/SnackBarWidget.dart';
import 'package:news/ui/widgets/customTextBtn.dart';
import 'package:news/ui/widgets/customTextLabel.dart';
import 'package:news/ui/widgets/networkImage.dart';
import 'package:news/ui/screens/auth/Widgets/svgPictureWidget.dart';
import 'package:news/utils/hiveBoxKeys.dart';
import 'package:news/utils/uiUtils.dart';

class UsernewsWidgets {
  static final labelKeys = {
    "standard_post": 'stdPostLbl',
    videoTypeToString(VideoType.video_youtube): 'videoYoutubeLbl',
    videoTypeToString(VideoType.video_other): 'videoOtherUrlLbl',
    videoTypeToString(VideoType.video_upload): 'videoUploadLbl'
  };

  static buildNewsContainer(
      {required BuildContext context,
      required NewsModel model,
      required int index,
      required int totalCurrentNews,
      required bool hasMoreNewsFetchError,
      required bool hasMore,
      required Function fetchMoreNews}) {
    if (index == totalCurrentNews - 1 && index != 0) {
      if (hasMore) {
        if (hasMoreNewsFetchError) {
          return Center(
              child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 15.0, vertical: 8.0),
            child: IconButton(
                onPressed: () => fetchMoreNews,
                icon: Icon(Icons.error, color: Theme.of(context).primaryColor)),
          ));
        } else {
          return Center(
              child: Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 15.0, vertical: 8.0),
                  child: UiUtils.showCircularProgress(
                      true, Theme.of(context).primaryColor)));
        }
      }
    }

    return InkWell(
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        onTap: () {
          Navigator.of(context).pushNamed(Routes.newsDetails, arguments: {
            "model": model,
            "isFromBreak": false,
            "fromShowMore": false
          });
        },
        child: Container(
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10.0),
                color: UiUtils.getColorScheme(context).surface),
            padding: const EdgeInsetsDirectional.all(15),
            margin: const EdgeInsets.only(top: 20),
            child: SizedBox(
              width: MediaQuery.of(context).size.width * 0.24,
              height: MediaQuery.of(context).size.height * 0.26,
              child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        newsImage(
                            imageURL: model.image ?? "", context: context),
                        Padding(
                          padding: const EdgeInsets.only(left: 10.0),
                          child: Column(
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                categoryName(
                                    context: context,
                                    categoryName: (model.categoryName != null &&
                                            model.categoryName!
                                                .trim()
                                                .isNotEmpty)
                                        ? model.categoryName!
                                        : ""),
                                setDate(
                                    context: context, dateValue: model.date!)
                              ]),
                        ),
                        Spacer(),
                        deleteAndEditButton(
                            context: context,
                            isEdit: true,
                            onTap: () => Navigator.of(context)
                                    .pushNamed(Routes.addNews, arguments: {
                                  "model": model,
                                  "isEdit": true,
                                  "from": "myNews"
                                })),
                        deleteAndEditButton(
                            context: context,
                            isEdit: false,
                            onTap: () =>
                                deleteNewsDialogue(context, model.id!, index))
                      ],
                    ),
                    Divider(thickness: 2),
                    Expanded(
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                          CustomTextLabel(
                              text: model.title!,
                              maxLines: 3,
                              overflow: TextOverflow.ellipsis,
                              softWrap: true,
                              textStyle: Theme.of(context)
                                  .textTheme
                                  .titleMedium!
                                  .copyWith(
                                      color: UiUtils.getColorScheme(context)
                                          .primaryContainer,
                                      fontWeight: FontWeight.w700)),
                          contentTypeView(context: context, model: model),
                        ])),
                    Divider(thickness: 2),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        (model.isExpired == 1)
                            ? Container(
                                child: Row(
                                children: [
                                  SvgPictureWidget(
                                      assetName: 'expiredNews',
                                      assetColor: (context
                                                  .read<ThemeCubit>()
                                                  .state
                                                  .appTheme ==
                                              AppTheme.Dark
                                          ? ColorFilter.mode(
                                              darkIconColor, BlendMode.srcIn)
                                          : ColorFilter.mode(
                                              iconColor, BlendMode.srcIn))),
                                  SizedBox(width: 2.5),
                                  Text(
                                    UiUtils.getTranslatedLabel(
                                        context, 'expiredKey'),
                                    style: TextStyle(
                                        color: (context
                                                    .read<ThemeCubit>()
                                                    .state
                                                    .appTheme ==
                                                AppTheme.Dark
                                            ? darkIconColor
                                            : iconColor),
                                        fontWeight: FontWeight.w500),
                                  ),
                                ],
                              ))
                            : SizedBox.shrink(),
                        (model.status == "0")
                            ? Container(
                                padding: EdgeInsets.symmetric(
                                    vertical: 3, horizontal: 5),
                                child: Tooltip(
                                  margin: const EdgeInsets.symmetric(
                                      horizontal: 20),
                                  decoration: BoxDecoration(
                                      color: UiUtils.getColorScheme(context)
                                          .primaryContainer,
                                      borderRadius: BorderRadius.circular(10)),
                                  textStyle: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                          color: UiUtils.getColorScheme(context)
                                              .secondary,
                                          fontSize: 10),
                                  message: UiUtils.getTranslatedLabel(
                                      context, 'newsCreatedSuccessfully'),
                                  child: Row(
                                    children: [
                                      SvgPictureWidget(
                                          assetName: 'deactivatedNews',
                                          assetColor: (context
                                                      .read<ThemeCubit>()
                                                      .state
                                                      .appTheme ==
                                                  AppTheme.Dark
                                              ? const ColorFilter.mode(
                                                  darkIconColor,
                                                  BlendMode.srcIn)
                                              : const ColorFilter.mode(
                                                  iconColor, BlendMode.srcIn))),
                                      const SizedBox(width: 2.5),
                                      Text(
                                        UiUtils.getTranslatedLabel(
                                            context, 'deactivatedKey'),
                                        style: TextStyle(
                                            color: (context
                                                        .read<ThemeCubit>()
                                                        .state
                                                        .appTheme ==
                                                    AppTheme.Dark
                                                ? darkIconColor
                                                : iconColor),
                                            fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                ))
                            : SizedBox.shrink(),
                      ],
                    ),
                  ]),
            )));
  }

  static Widget newsImage(
      {required BuildContext context, required String imageURL}) {
    return ClipRRect(
        borderRadius: BorderRadius.circular(45),
        child: CustomNetworkImage(
            networkImageUrl: imageURL,
            fit: BoxFit.cover,
            height: MediaQuery.of(context).size.width * 0.18,
            isVideo: false,
            width: MediaQuery.of(context).size.width * 0.18));
  }

  static Widget categoryName(
      {required BuildContext context, required String categoryName}) {
    return (categoryName.trim().isNotEmpty)
        ? Padding(
            padding: const EdgeInsets.only(top: 4),
            child: CustomTextLabel(
                text: categoryName,
                overflow: TextOverflow.ellipsis,
                softWrap: true,
                textStyle: Theme.of(context).textTheme.bodyLarge!.copyWith(
                    color: UiUtils.getColorScheme(context)
                        .primaryContainer
                        .withOpacity(0.9),
                    fontSize: 16,
                    fontWeight: FontWeight.w600)),
          )
        : const SizedBox.shrink();
  }

  static Widget deleteAndEditButton(
      {required BuildContext context,
      required bool isEdit,
      required void Function()? onTap}) {
    return InkWell(
        onTap: onTap,
        child: Container(
          padding:
              const EdgeInsetsDirectional.only(top: 3, bottom: 3, start: 5),
          alignment: Alignment.center,
          child: SvgPictureWidget(
              assetName: (isEdit) ? 'editMyNews' : 'deleteMyNews',
              height: 30,
              width: 30,
              fit: BoxFit.contain,
              assetColor: (isEdit)
                  ? ColorFilter.mode(UiUtils.getColorScheme(context).onPrimary,
                      BlendMode.srcIn)
                  : null),
        ));
  }

  static Widget setDate(
      {required BuildContext context, required String dateValue}) {
    DateTime time = DateTime.parse(dateValue);
    var newFormat = DateFormat(
        "dd-MMM-yyyy", Hive.box(settingsBoxKey).get(currentLanguageCodeKey));
    final newNewsDate = newFormat.format(time);

    return CustomTextLabel(
        text: newNewsDate,
        overflow: TextOverflow.ellipsis,
        softWrap: true,
        textStyle: Theme.of(context).textTheme.bodySmall!.copyWith(
            color: UiUtils.getColorScheme(context)
                .primaryContainer
                .withOpacity(0.8)));
  }

  static deleteNewsDialogue(
      BuildContext mainContext, String id, int index) async {
    await showDialog(
        context: mainContext,
        builder: (BuildContext context) {
          return StatefulBuilder(
              builder: (BuildContext context, StateSetter setStater) {
            return AlertDialog(
              backgroundColor: UiUtils.getColorScheme(context).surface,
              shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(5.0))),
              content: CustomTextLabel(
                  text: 'doYouReallyNewsLbl',
                  textStyle: Theme.of(context).textTheme.titleMedium),
              title: const CustomTextLabel(text: 'delNewsLbl'),
              titleTextStyle: Theme.of(context)
                  .textTheme
                  .titleLarge
                  ?.copyWith(fontWeight: FontWeight.w600),
              actions: <Widget>[
                CustomTextButton(
                    textWidget: CustomTextLabel(
                        text: 'noLbl',
                        textStyle: Theme.of(context)
                            .textTheme
                            .titleSmall
                            ?.copyWith(
                                color: UiUtils.getColorScheme(context)
                                    .primaryContainer,
                                fontWeight: FontWeight.bold)),
                    onTap: () {
                      Navigator.of(context).pop(false);
                    }),
                BlocConsumer<DeleteUserNewsCubit, DeleteUserNewsState>(
                    bloc: context.read<DeleteUserNewsCubit>(),
                    listener: (context, state) {
                      if (state is DeleteUserNewsSuccess) {
                        context.read<GetUserNewsCubit>().deleteNews(index);
                        showSnackBar(state.message, context);
                        Navigator.pop(context);
                      }
                    },
                    builder: (context, state) {
                      return CustomTextButton(
                          textWidget: CustomTextLabel(
                              text: 'yesLbl',
                              textStyle: Theme.of(context)
                                  .textTheme
                                  .titleSmall
                                  ?.copyWith(
                                      color: UiUtils.getColorScheme(context)
                                          .primaryContainer,
                                      fontWeight: FontWeight.bold)),
                          onTap: () async {
                            context
                                .read<DeleteUserNewsCubit>()
                                .setDeleteUserNews(newsId: id);
                          });
                    })
              ],
            );
          });
        });
  }

  static Widget contentTypeView(
      {required BuildContext context, required NewsModel model}) {
    String contType = "";

    final key = labelKeys[model.contentType];
    if (key != null) {
      contType = UiUtils.getTranslatedLabel(context, key);
    }
    return (model.contentType != "")
        ? Padding(
            padding: const EdgeInsets.only(top: 7),
            child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              CustomTextLabel(
                  text: 'contentTypeLbl',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  softWrap: true,
                  textStyle: Theme.of(context).textTheme.bodyLarge!.copyWith(
                      color: UiUtils.getColorScheme(context)
                          .primaryContainer
                          .withAlpha((0.3 * 255).round()))),
              CustomTextLabel(
                  text: " : ",
                  textStyle: Theme.of(context).textTheme.bodyLarge!.copyWith(
                      color: UiUtils.getColorScheme(context)
                          .primaryContainer
                          .withAlpha((0.3 * 255).round()))),
              CustomTextLabel(
                  text: contType,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  softWrap: true,
                  textStyle: Theme.of(context).textTheme.bodyMedium!.copyWith(
                      color: UiUtils.getColorScheme(context)
                          .primaryContainer
                          .withAlpha((0.3 * 255).round())))
            ]),
          )
        : SizedBox.shrink();
  }
}
