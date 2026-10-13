import 'package:flutter/material.dart';
import 'package:news/cubits/Auth/authCubit.dart';
import 'package:news/cubits/getUserDraftedNewsCubit.dart';
import 'package:news/data/repositories/Settings/settingsLocalDataRepository.dart';
import 'package:news/ui/screens/AddEditNews/Widgets/userAllNews.dart';
import 'package:news/ui/screens/AddEditNews/Widgets/userDrafterNews.dart';
import 'package:news/ui/widgets/customTextLabel.dart';
import 'package:shimmer/shimmer.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:news/cubits/getUserNewsCubit.dart';
import 'package:news/app/routes.dart';
import 'package:news/utils/uiUtils.dart';

class ManageUserNews extends StatefulWidget {
  const ManageUserNews({super.key});

  @override
  ManageUserNewsState createState() => ManageUserNewsState();
}

class ManageUserNewsState extends State<ManageUserNews>
    with TickerProviderStateMixin {
  final bool _isButtonExtended = true;
  late final ScrollController controller = ScrollController()
    ..addListener(hasMoreNewsScrollListener);
  late final ScrollController draftController = ScrollController()
    ..addListener(hasMoreDraftedNewsScrollListener);

  Set<String> get locationValue =>
      SettingsLocalDataRepository().getLocationCityValues();

  @override
  void initState() {
    getNews();
    getUserDraftedNews();
    super.initState();
  }

  @override
  void dispose() {
    controller.dispose();
    draftController.dispose();
    super.dispose();
  }

  void getUserDraftedNews() {
    context.read<GetUserDraftedNewsCubit>().getUserDraftedNews(
        userId: int.parse(context.read<AuthCubit>().getUserId()));
  }

  void getMoreDraftedNews() {
    context.read<GetUserDraftedNewsCubit>().getMoreUserDraftedNews(
        userId: int.parse(context.read<AuthCubit>().getUserId()));
  }

  void getNews() {
    context.read<GetUserNewsCubit>().getGetUserNews(
        latitude: locationValue.first, longitude: locationValue.last);
  }

  void getMoreNews() {
    context.read<GetUserNewsCubit>().getMoreGetUserNews(
        latitude: locationValue.first, longitude: locationValue.last);
  }

  void hasMoreNewsScrollListener() {
    if (controller.position.maxScrollExtent == controller.offset) {
      if (context.read<GetUserNewsCubit>().hasMoreGetUserNews()) {
        getMoreNews();
      } else {
        //debugPrint("No more News for this user");
      }
    }
  }

  void hasMoreDraftedNewsScrollListener() {
    if (draftController.position.maxScrollExtent == draftController.offset) {
      if (context.read<GetUserDraftedNewsCubit>().hasMoreGetUserDraftedNews()) {
        getMoreDraftedNews();
      } else {
        //debugPrint("No more Drafted News for this user");
      }
    }
  }

  getAppBar() {
    return PreferredSize(
        preferredSize: const Size(double.infinity, 45),
        child: UiUtils.applyBoxShadow(
          context: context,
          child: AppBar(
            centerTitle: false,
            backgroundColor: Colors.transparent,
            title: Transform(
                transform: Matrix4.translationValues(-20.0, 0.0, 0.0),
                child: CustomTextLabel(
                    text: 'manageNewsLbl',
                    textStyle: Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: UiUtils.getColorScheme(context).primaryContainer,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.5))),
            leading: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10.0),
              child: InkWell(
                  onTap: () {
                    Navigator.of(context).pop();
                  },
                  splashColor: Colors.transparent,
                  highlightColor: Colors.transparent,
                  child: Icon(Icons.arrow_back,
                      color: UiUtils.getColorScheme(context).primaryContainer)),
            ),
          ),
        ));
  }

  newsAddBtn() {
    return Column(mainAxisAlignment: MainAxisAlignment.end, children: [
      FloatingActionButton(
          isExtended: _isButtonExtended,
          backgroundColor: UiUtils.getColorScheme(context).surface,
          child: Icon(Icons.add,
              size: 32,
              color: UiUtils.getColorScheme(context).primaryContainer),
          onPressed: () {
            Navigator.of(context).pushNamed(Routes.addNews,
                arguments: {"isEdit": false, "from": "myNews"});
          }),
      const SizedBox(height: 10)
    ]);
  }

  contentShimmer(BuildContext context) {
    return Shimmer.fromColors(
        baseColor: Colors.grey.withOpacity(0.6),
        highlightColor: Colors.grey,
        child: ListView.builder(
            shrinkWrap: true,
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsetsDirectional.only(start: 20, end: 20),
            itemBuilder: (_, i) => Container(
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10.0),
                    color: Colors.grey.withOpacity(0.6)),
                margin: const EdgeInsets.only(top: 20),
                height: 190.0),
            itemCount: 6));
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: getAppBar(),
        floatingActionButton: newsAddBtn(),
        body: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Column(
            children: [
              Container(
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: UiUtils.getColorScheme(context).surface),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                margin: const EdgeInsetsDirectional.only(start: 10, end: 10),
                child: TabBar(
                  indicator: BoxDecoration(
                    color: UiUtils.getColorScheme(context).primaryContainer,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  labelColor: UiUtils.getColorScheme(context).surface,
                  unselectedLabelColor:
                      UiUtils.getColorScheme(context).primaryContainer,
                  tabs: [
                    Tab(
                        text: UiUtils.getTranslatedLabel(
                            context, 'manageNewsAllLbl')),
                    Tab(
                        text: UiUtils.getTranslatedLabel(
                            context, 'manageNewsDraftLbl')),
                  ],
                ),
              ),
              Expanded(
                child: TabBarView(
                  children: [
                    UserAllNewsTab(
                        controller: controller,
                        contentShimmer: contentShimmer(context),
                        fetchNews: getNews,
                        fetchMoreNews: getMoreNews),
                    UserDrafterNewsTab(
                        controller: draftController,
                        contentShimmer: contentShimmer(context),
                        fetchDraftedNews: getUserDraftedNews,
                        fetchMoreDraftedNews: getMoreDraftedNews),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
