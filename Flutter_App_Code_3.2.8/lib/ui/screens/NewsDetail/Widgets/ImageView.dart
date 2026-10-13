import 'package:flutter/material.dart';
import 'package:news/ui/widgets/networkImage.dart';
import '../../../../app/routes.dart';
import '../../../../data/models/BreakingNewsModel.dart';
import '../../../../data/models/NewsModel.dart';

class ImageView extends StatefulWidget {
  final NewsModel? model;
  final BreakingNewsModel? breakModel;
  final bool isFromBreak;

  const ImageView(
      {super.key, this.model, this.breakModel, required this.isFromBreak});

  @override
  ImageViewState createState() => ImageViewState();
}

class ImageViewState extends State<ImageView> {
  List<String> allImage = [];
  int _curSlider = 0;

  late final PageController _pageController;

  static double _thumbSize = 60;
  static double _thumbSpacing = 8;
  static double _thumbPadding = 12;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();

    allImage.clear();
    if (!widget.isFromBreak) {
      allImage.add(widget.model!.image ?? "");
      if (widget.model!.imageDataList!.isNotEmpty) {
        for (int i = 0; i < widget.model!.imageDataList!.length; i++) {
          allImage.add(widget.model!.imageDataList![i].otherImage ?? "");
        }
      }
    } else {
      allImage.add(widget.breakModel!.image ?? "");
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Widget imageView() {
    return SizedBox(
        height: MediaQuery.of(context).size.height * 0.40,
        width: double.maxFinite,
        child: !widget.isFromBreak
            ? PageView.builder(
                controller: _pageController,
                itemCount: allImage.length,
                onPageChanged: (index) {
                  setState(() {
                    _curSlider = index;
                  });
                },
                itemBuilder: (context, index) {
                  return InkWell(
                    onTap: () {
                      Navigator.of(context).pushNamed(
                        Routes.imagePreview,
                        arguments: {
                          "index": index,
                          "imgList": allImage,
                        },
                      );
                    },
                    child: CustomNetworkImage(
                      networkImageUrl: allImage[index],
                      width: double.infinity,
                      height: MediaQuery.of(context).size.height * 0.42,
                      fit: BoxFit.cover,
                      isVideo: false,
                    ),
                  );
                },
              )
            : CustomNetworkImage(
                networkImageUrl: widget.breakModel!.image ?? "",
                width: double.infinity,
                height: MediaQuery.of(context).size.height * 0.42,
                isVideo: false,
                fit: BoxFit.cover));
  }

  List<T> map<T>(List list, Function handler) {
    List<T> result = [];
    for (var i = 0; i < list.length; i++) {
      result.add(handler(i, list[i]));
    }

    return result;
  }

  Widget imageThumbnailIndicator() {
    if (widget.isFromBreak || allImage.length <= 1) {
      return const SizedBox.shrink();
    }

    return Positioned(
      bottom: 12,
      left: 0,
      right: 0,
      child: SizedBox(
        height: _thumbSize + 8,
        child: LayoutBuilder(
          builder: (context, constraints) {
            final totalThumbWidth = (allImage.length * _thumbSize) +
                ((allImage.length - 1) * _thumbSpacing) +
                (_thumbPadding * 2);

            final shouldScroll = totalThumbWidth > constraints.maxWidth;

            final thumbnails = Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(allImage.length, (index) {
                final isActive = index == _curSlider;

                return Padding(
                  padding: EdgeInsets.only(
                    right: index == allImage.length - 1 ? 0 : _thumbSpacing,
                  ),
                  child: GestureDetector(
                    onTap: () {
                      _pageController.animateToPage(
                        index,
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        border: isActive
                            ? Border.all(color: Colors.white, width: 2)
                            : Border.all(color: Colors.transparent),
                        boxShadow: const [
                          BoxShadow(
                              color: Colors.black26,
                              blurRadius: 4,
                              offset: Offset(0, 2))
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: CustomNetworkImage(
                          networkImageUrl: allImage[index],
                          width: _thumbSize,
                          height: _thumbSize,
                          fit: BoxFit.cover,
                          isVideo: false,
                        ),
                      ),
                    ),
                  ),
                );
              }),
            );

            if (!shouldScroll) {
              /// Center thumbnails when they fit
              return Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: _thumbPadding),
                  child: thumbnails,
                ),
              );
            }

            /// Enable horizontal scrolling when overflowed
            return SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.symmetric(horizontal: _thumbPadding),
              physics: const BouncingScrollPhysics(),
              child: thumbnails,
            );
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(children: [imageView(), imageThumbnailIndicator()]);
  }
}
