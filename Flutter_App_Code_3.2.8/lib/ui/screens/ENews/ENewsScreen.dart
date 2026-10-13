import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive/hive.dart';
import 'package:intl/intl.dart';
import 'package:news/app/app.dart';
import 'package:news/cubits/appLocalizationCubit.dart';
import 'package:news/cubits/eNewsCubit.dart';
import 'package:news/data/models/ENewsModel.dart';
import 'package:news/ui/screens/ENews/ENewsPdfViewerScreen.dart';
import 'package:news/ui/widgets/customAppBar.dart';
import 'package:news/ui/widgets/errorContainerWidget.dart';
import 'package:news/utils/hiveBoxKeys.dart';
import 'package:news/utils/uiUtils.dart';

class ENewsScreen extends StatefulWidget {
  const ENewsScreen({super.key});

  static Route route(RouteSettings routeSettings) {
    return CupertinoPageRoute(builder: (_) => const ENewsScreen());
  }

  @override
  State<ENewsScreen> createState() => _ENewsScreenState();
}

class _ENewsScreenState extends State<ENewsScreen> {
  static const int _perPage = 10;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _fetchENews();
    _scrollController.addListener(_onScroll);
  }

  void _fetchENews() {
    Future.delayed(Duration.zero, () {
      if (!mounted) return;
      context.read<ENewsCubit>().getENews(
            languageCode:
                context.read<AppLocalizationCubit>().state.languageCode,
            perPage: _perPage,
          );
    });
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      context.read<ENewsCubit>().getMoreENews(
            languageCode:
                context.read<AppLocalizationCubit>().state.languageCode,
            perPage: _perPage,
          );
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
          height: 45, isBackBtn: true, label: 'eNewsLbl', isConvertText: true),
      body: BlocBuilder<ENewsCubit, ENewsState>(
        builder: (context, state) {
          if (state is ENewsFetchInProgress || state is ENewsInitial) {
            return _buildShimmer();
          }

          if (state is ENewsFetchFailure) {
            return Center(
                child: ErrorContainerWidget(
                    errorMsg: state.errorMessage, onRetry: _fetchENews));
          }

          if (state is ENewsFetchSuccess) {
            if (state.eNewsList.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.newspaper,
                        size: 60, color: Colors.grey.shade400),
                    const SizedBox(height: 16),
                    Text(
                        UiUtils.getTranslatedLabel(
                            context, 'eNewsNotAvailable'),
                        style: Theme.of(context)
                            .textTheme
                            .bodyLarge
                            ?.copyWith(color: Colors.grey)),
                  ],
                ),
              );
            }

            return ScrollConfiguration(
              behavior: GlobalScrollBehavior(),
              child: GridView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(12),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 0.62,
                ),
                itemCount: state.eNewsList.length + (state.hasMore ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index >= state.eNewsList.length) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  return _ENewsGridItem(eNews: state.eNewsList[index]);
                },
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildShimmer() {
    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.62,
      ),
      itemCount: 6,
      itemBuilder: (context, index) => _ShimmerCard(),
    );
  }
}

class _ENewsGridItem extends StatelessWidget {
  final ENewsModel eNews;

  const _ENewsGridItem({required this.eNews});

  void _openPdf(BuildContext context) {
    if (eNews.attachment != null && eNews.attachment!.isNotEmpty) {
      Navigator.of(context).push(
        CupertinoPageRoute(
          builder: (_) => ENewsPdfViewerScreen(
            title: eNews.title,
            pdfUrl: eNews.attachment!,
          ),
        ),
      );
    }
  }

  String? _plainDescription() {
    if (eNews.description == null || eNews.description!.trim().isEmpty)
      return null;
    // Strip basic HTML tags for display
    return eNews.description!
        .replaceAll(RegExp(r'<[^>]*>'), '')
        .replaceAll('&nbsp;', ' ')
        .trim();
  }

  @override
  Widget build(BuildContext context) {
    final String? plainDesc = _plainDescription();

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.07),
              blurRadius: 8,
              offset: const Offset(0, 3)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            child: SizedBox(
                height: 120,
                width: double.infinity,
                child: _buildThumbnail(context)),
          ),

          // Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(eNews.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                          color:
                              UiUtils.getColorScheme(context).primaryContainer,
                          height: 1.3)),

                  // Description — if absent, SizedBox fills the equivalent vertical gap
                  if (plainDesc != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      plainDesc,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: UiUtils.getColorScheme(context)
                              .primaryContainer
                              .withOpacity(0.6),
                          height: 1.3),
                    ),
                    const Spacer(),
                  ] else
                    const Spacer(),
                  const Divider(height: 1, thickness: 1),
                  const SizedBox(height: 6),

                  // Date + View Paper button
                  Row(
                    children: [
                      if (eNews.date != null && eNews.date!.isNotEmpty) ...[
                        Icon(Icons.calendar_today_outlined,
                            size: 10,
                            color: UiUtils.getColorScheme(context)
                                .primaryContainer
                                .withOpacity(0.5)),
                        const SizedBox(width: 3),
                        Expanded(
                          child: Text(
                            DateFormat(
                                    "dd-MM-yyyy",
                                    Hive.box(settingsBoxKey)
                                        .get(currentLanguageCodeKey))
                                .format(DateTime.parse(eNews.date ?? '')),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: Theme.of(context)
                                .textTheme
                                .labelSmall
                                ?.copyWith(
                                  fontSize: 10,
                                  color: UiUtils.getColorScheme(context)
                                      .primaryContainer
                                      .withOpacity(0.5),
                                ),
                          ),
                        ),
                      ] else
                        const Spacer(),
                      GestureDetector(
                        onTap: () => _openPdf(context),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Theme.of(context).primaryColor,
                            borderRadius: BorderRadius.circular(5),
                          ),
                          child: Text(
                            UiUtils.getTranslatedLabel(context, 'viewLbl'),
                            style: Theme.of(context)
                                .textTheme
                                .labelSmall
                                ?.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w600),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildThumbnail(BuildContext context) {
    if (eNews.thumbnail != null && eNews.thumbnail!.isNotEmpty) {
      return Image.network(
        eNews.thumbnail!,
        width: double.infinity,
        fit: BoxFit.fitWidth,
        errorBuilder: (context, error, stackTrace) => _pdfPlaceholder(context),
      );
    }
    return _pdfPlaceholder(context);
  }

  Widget _pdfPlaceholder(BuildContext context) {
    return Container(
      color: Theme.of(context).primaryColor.withOpacity(0.08),
      alignment: Alignment.center,
      child: Icon(
        Icons.picture_as_pdf_rounded,
        size: 48,
        color: Theme.of(context).primaryColor.withOpacity(0.5),
      ),
    );
  }
}

class _ShimmerCard extends StatefulWidget {
  @override
  State<_ShimmerCard> createState() => _ShimmerCardState();
}

class _ShimmerCardState extends State<_ShimmerCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image shimmer
              ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(12)),
                child: _shimmerBlock(context, double.infinity, 120),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 10, 10, 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _shimmerBlock(context, double.infinity, 13),
                    const SizedBox(height: 6),
                    _shimmerBlock(context, double.infinity, 13),
                    const SizedBox(height: 6),
                    _shimmerBlock(context, 100, 11),
                    const SizedBox(height: 10),
                    const Divider(height: 1, thickness: 1),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _shimmerBlock(context, 60, 11),
                        _shimmerBlock(context, 70, 24),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _shimmerBlock(BuildContext context, double width, double height) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(6),
        gradient: LinearGradient(
          begin: Alignment(-1.0 + 2 * _animationController.value, 0),
          end: Alignment(1.0 + 2 * _animationController.value, 0),
          colors: [
            Colors.grey.shade300,
            Colors.grey.shade100,
            Colors.grey.shade300,
          ],
        ),
      ),
    );
  }
}
