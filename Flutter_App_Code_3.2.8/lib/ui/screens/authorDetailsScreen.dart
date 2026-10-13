import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:news/app/routes.dart';
import 'package:news/cubits/Author/authorNewsCubit.dart';
import 'package:news/cubits/NewsByIdCubit.dart';
import 'package:news/cubits/appLocalizationCubit.dart';
import 'package:news/data/models/NewsModel.dart';
import 'package:news/ui/screens/auth/Widgets/svgPictureWidget.dart';
import 'package:news/ui/styles/colors.dart';
import 'package:news/ui/widgets/customBackBtn.dart';
import 'package:news/ui/widgets/customTextLabel.dart';
import 'package:news/ui/widgets/networkImage.dart';
import 'package:news/utils/constant.dart';
import 'package:news/utils/uiUtils.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:news/ui/widgets/errorContainerWidget.dart';
import 'package:html/parser.dart';

class AuthorDetailsScreen extends StatefulWidget {
  final String authorId;
  const AuthorDetailsScreen({super.key, required this.authorId});

  @override
  State<AuthorDetailsScreen> createState() => _AuthorDetailsScreenState();

  static Route route(RouteSettings routeSettings) {
    final arguments = routeSettings.arguments as Map<String, dynamic>;
    return CupertinoPageRoute(
        builder: (_) => AuthorDetailsScreen(authorId: arguments['authorId']));
  }
}

class _AuthorDetailsScreenState extends State<AuthorDetailsScreen> {
  AuthorLayoutType layout = AuthorLayoutType.list;
  double borderRadius = 10;
  late NewsModel newsData;
  String totalViews = "0", totalLikes = "0";
  NewsModel? localNewsItem;

  @override
  void initState() {
    getNewsByAuthor();
    super.initState();
  }

  void getNewsByAuthor() {
    context.read<AuthorNewsCubit>().getAuthorNews(authorId: widget.authorId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const CustomTextLabel(text: 'authorLbl'),
        leading: CustomBackButton(),
        actions: [
          Padding(
            padding: const EdgeInsets.all(3.0),
            child: Container(
              margin: EdgeInsets.all(10),
              decoration: BoxDecoration(
                  border: Border.all(
                      color: UiUtils.getColorScheme(context).outline),
                  borderRadius: BorderRadius.circular(5)),
              child: GestureDetector(
                child: Icon(
                    layout == AuthorLayoutType.list
                        ? Icons.grid_view
                        : Icons.view_list,
                    size: 25),
                onTap: () {
                  setState(() {
                    layout = layout == AuthorLayoutType.list
                        ? AuthorLayoutType.grid
                        : AuthorLayoutType.list;
                  });
                },
              ),
            ),
          ),
        ],
      ),
      body: BlocBuilder<AuthorNewsCubit, AuthorNewsState>(
        builder: (context, state) {
          if (state is AuthorNewsFetchSuccess) {
            return Column(
              children: [
                authorHeader(state: state),
                const SizedBox(height: 10),
                Expanded(
                    child: layout == AuthorLayoutType.list
                        ? authorNewsListView(state: state)
                        : authorNewsGridView(state: state)),
              ],
            );
          } else if (state is AuthorNewsFetchFailed) {
            return ErrorContainerWidget(
                errorMsg: state.errorMessage, onRetry: getNewsByAuthor);
          } else {
            return const SizedBox.shrink();
          }
        },
      ),
    );
  }

  /// ---------------- HEADER ----------------
  Widget authorHeader({required AuthorNewsFetchSuccess state}) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: UiUtils.getColorScheme(context).surface,
        borderRadius: BorderRadius.circular(borderRadius),
      ),
      child: Column(
        children: [
          Row(
            children: [
              // author image
              ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: CustomNetworkImage(
                      networkImageUrl: state.authorData.profile ?? "")),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CustomTextLabel(
                        text: state.authorData.name ?? "",
                        textStyle: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w600)),
                    SizedBox(height: 6),
                    if (state.authorData.authorDetails != null)
                      CustomTextLabel(
                          text: state.authorData.authorDetails!.bio ?? "",
                          textStyle: TextStyle(fontSize: 13)),
                  ],
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                CustomTextLabel(text: 'followLbl'),
                SizedBox(width: 6),
                (state.authorData.authorDetails != null)
                    ? Row(spacing: 6.5, children: [
                        showSocialMediaLinks(
                            socialMediaLink:
                                state.authorData.authorDetails!.telegramLink ??
                                    "",
                            socialMediaIconName: "telegram"),
                        showSocialMediaLinks(
                            socialMediaLink:
                                state.authorData.authorDetails!.facebookLink ??
                                    "",
                            socialMediaIconName: "facebook"),
                        showSocialMediaLinks(
                            socialMediaLink:
                                state.authorData.authorDetails!.whatsappLink ??
                                    "",
                            socialMediaIconName: "whatsapp"),
                        showSocialMediaLinks(
                            socialMediaLink:
                                state.authorData.authorDetails!.linkedinLink ??
                                    "",
                            socialMediaIconName: "linkedin"),
                      ])
                    : SizedBox.shrink()
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget showSocialMediaLinks(
      {required String socialMediaLink, required String socialMediaIconName}) {
    return Container(
      height: 30,
      width: 30,
      padding: EdgeInsets.all(3),
      decoration: BoxDecoration(
          shape: BoxShape.rectangle,
          borderRadius: BorderRadius.circular(7),
          color: UiUtils.getColorScheme(context).outline.withOpacity(0.2)),
      child: GestureDetector(
          onTap: () async {
            if (await canLaunchUrl(Uri.parse(socialMediaLink))) {
              await launchUrl(Uri.parse(socialMediaLink),
                  mode: LaunchMode.externalApplication);
            }
          },
          child: ClipRRect(
            borderRadius: BorderRadius.circular(7),
            child: SvgPictureWidget(
                assetName: socialMediaIconName,
                height: 11,
                width: 11,
                fit: BoxFit.contain,
                assetColor: ColorFilter.mode(
                    UiUtils.getColorScheme(context)
                        .primaryContainer
                        .withOpacity(0.7),
                    BlendMode.srcIn)),
          )),
    );
  }

  /// ---------------- LIST VIEW ----------------
  Widget authorNewsListView({required AuthorNewsFetchSuccess state}) {
    return ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: state.AuthorNewsList.length,
        itemBuilder: (BuildContext, index) =>
            newsListTile(newsItem: state.AuthorNewsList[index]));
  }

  Widget newsListTile({required NewsModel newsItem}) {
    localNewsItem = newsItem;
    return GestureDetector(
      onTap: () => redirectToNewsDetailsScreen(newsItem: newsItem),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        decoration: BoxDecoration(
            color: UiUtils.getColorScheme(context).surface,
            borderRadius: BorderRadius.circular(12)),
        child: Row(
          children: [
            ClipRRect(
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(borderRadius),
                    bottomLeft: Radius.circular(borderRadius)),
                child: CustomNetworkImage(
                    networkImageUrl: newsItem.image ?? "",
                    width: 110,
                    height: 110,
                    fit: BoxFit.cover)),
            const SizedBox(width: 12),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CustomTextLabel(
                        text: newsItem.title ?? "",
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        textStyle: TextStyle(
                            fontSize: 15, fontWeight: FontWeight.w600)),
                    SizedBox(height: 6),
                    CustomTextLabel(
                        text: parse(newsItem.desc).body?.text ?? "",
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        textStyle: TextStyle(fontSize: 13)),
                    SizedBox(height: 6),
                    Divider(),
                    SizedBox(height: 3),
                    Row(
                      children: [
                        CustomTextLabel(
                            text: UiUtils.convertToAgo(
                                context,
                                DateTime.parse(
                                    newsItem.publishDate ?? newsItem.date!),
                                0)!,
                            textStyle: TextStyle(
                                fontSize: 12,
                                color:
                                    UiUtils.getColorScheme(context).outline)),
                        Spacer(),
                        showViewsAndLikes(
                            newsId: newsItem.id ?? "0",
                            totalViews: (newsItem.totalViews != null &&
                                    newsItem.totalViews != "null" &&
                                    newsItem.totalViews!.isNotEmpty)
                                ? newsItem.totalViews!
                                : "0",
                            totalLikes: (newsItem.totalLikes != null &&
                                    newsItem.totalLikes != "null" &&
                                    newsItem.totalLikes!.isNotEmpty)
                                ? newsItem.totalLikes!
                                : "0")
                      ],
                    ),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget showViewsAndLikes(
      {required String newsId,
      required String totalViews,
      required String totalLikes}) {
    return FutureBuilder(
        future: context.read<NewsByIdCubit>().getNewsById(
            newsId: newsId,
            langCode: context.read<AppLocalizationCubit>().state.languageCode),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting ||
              !snapshot.hasData ||
              snapshot.data!.isEmpty) {
            return Row(
              spacing: 15,
              children: [
                Row(
                  spacing: 5,
                  children: [
                    Icon(Icons.remove_red_eye_rounded, size: 10),
                    CustomTextLabel(
                        text: totalViews, textStyle: TextStyle(fontSize: 12))
                  ],
                ),
                Row(
                  spacing: 5,
                  children: [
                    Icon(Icons.thumb_up_alt_outlined, size: 10),
                    CustomTextLabel(
                        text: totalLikes, textStyle: TextStyle(fontSize: 12))
                  ],
                ),
              ],
            );
          }
          final updated = snapshot.data![0];
          localNewsItem = updated;
          totalViews = updated.totalViews ?? "0";
          totalLikes = updated.totalLikes ?? "0";
          return Row(
            spacing: 15,
            children: [
              Row(
                spacing: 5,
                children: [
                  Icon(Icons.remove_red_eye_rounded, size: 10),
                  CustomTextLabel(
                      text: totalViews, textStyle: TextStyle(fontSize: 12))
                ],
              ),
              Row(
                spacing: 5,
                children: [
                  Icon(Icons.thumb_up_alt_outlined, size: 10),
                  CustomTextLabel(
                      text: totalLikes, textStyle: TextStyle(fontSize: 12))
                ],
              ),
            ],
          );
        });
  }

  Widget authorNewsGridView({required AuthorNewsFetchSuccess state}) {
    return GridView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: state.AuthorNewsList.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            childAspectRatio: 0.65),
        itemBuilder: (BuildContext, index) {
          return newsGridTile(newsItem: state.AuthorNewsList[index]);
        });
  }

  Widget newsGridTile({required NewsModel newsItem}) {
    localNewsItem = newsItem;
    return GestureDetector(
      onTap: () => redirectToNewsDetailsScreen(newsItem: newsItem),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(borderRadius),
            color: UiUtils.getColorScheme(context).surface,
            boxShadow: const [
              BoxShadow(blurRadius: 5, spreadRadius: 1, color: dividerColor)
            ]),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: CustomNetworkImage(
                    networkImageUrl: newsItem.image ?? "",
                    height: 120,
                    width: double.infinity,
                    fit: BoxFit.cover)),
            const SizedBox(height: 8),
            CustomTextLabel(
                text: UiUtils.convertToAgo(context,
                    DateTime.parse(newsItem.publishDate ?? newsItem.date!), 0)!,
                textStyle: TextStyle(
                    color: UiUtils.getColorScheme(context).outline,
                    fontSize: 11)),
            const SizedBox(height: 4),
            Expanded(
              child: CustomTextLabel(
                  text: newsItem.title ?? "",
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  textStyle:
                      TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            ),
            const SizedBox(height: 4),
            CustomTextLabel(
                text: parse(newsItem.desc).body?.text ?? "",
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                textStyle: TextStyle(fontSize: 12)),
            Divider(),
            showViewsAndLikes(
                newsId: newsItem.id ?? "0",
                totalViews: (newsItem.totalViews != null &&
                        newsItem.totalViews != "null" &&
                        newsItem.totalViews!.isNotEmpty)
                    ? newsItem.totalViews!
                    : "0",
                totalLikes: (newsItem.totalLikes != null &&
                        newsItem.totalLikes != "null" &&
                        newsItem.totalLikes!.isNotEmpty)
                    ? newsItem.totalLikes!
                    : "0")
          ],
        ),
      ),
    );
  }

  void redirectToNewsDetailsScreen({required NewsModel newsItem}) {
    Navigator.of(context).pushNamed(Routes.newsDetails, arguments: {
      "model": localNewsItem ?? newsItem,
      "isFromBreak": false,
      "fromShowMore": false
    });
  }
}
