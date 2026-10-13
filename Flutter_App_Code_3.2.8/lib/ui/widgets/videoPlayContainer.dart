import 'package:flick_video_player/flick_video_player.dart';
import 'package:flutter/material.dart';
import 'package:news/data/models/FeatureSectionModel.dart';
import 'package:video_player/video_player.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

class VideoPlayContainer extends StatefulWidget {
  final String contentType, contentValue;
  final bool autoPlay;

  Duration lastPosition;

  VideoPlayContainer(
      {super.key,
      required this.contentType,
      required this.contentValue,
      this.autoPlay = true,
      this.lastPosition = Duration.zero});
  @override
  VideoPlayContainerState createState() => VideoPlayContainerState();
}

class VideoPlayContainerState extends State<VideoPlayContainer> {
  bool playVideo = false;

  FlickManager? flickManager;
  YoutubePlayerController? _yc;

  late VideoPlayerController _controller;
  late final WebViewController webViewController;

  @override
  void initState() {
    super.initState();
    initialisePlayer();
  }

  @override
  void dispose() async {
    try {
      if (widget.contentType == videoTypeToString(VideoType.video_upload)) {
        // pause only if controller still valid
        if (_controller.value.isInitialized && _controller.value.isPlaying) {
          _controller.pause();
        }

        // exit fullscreen safely
        flickManager?.flickControlManager?.exitFullscreen();

        // dispose only the flick manager
        flickManager?.dispose();
        flickManager = null;
      } else if (widget.contentType ==
              videoTypeToString(VideoType.video_youtube) ||
          widget.contentType == videoTypeToString(VideoType.url_youtube)) {
        _yc?.dispose();
      } else if (widget.contentType ==
              videoTypeToString(VideoType.video_other) ||
          widget.contentType == videoTypeToString(VideoType.url_other)) {
        webViewController.clearCache();
      }
    } catch (e, st) {
      debugPrint("Error during dispose: $e\n$st");
    }

    super.dispose(); // always last
  }

  initialisePlayer() {
    print("content type = ${widget.contentType}");
    if (widget.contentValue != "") {
      if (widget.contentType == videoTypeToString(VideoType.video_upload)) {
        _controller =
            VideoPlayerController.networkUrl(Uri.parse(widget.contentValue));
        flickManager = FlickManager(
            videoPlayerController: _controller,
            autoPlay: widget.autoPlay,
            onVideoEnd: () {
              widget.lastPosition = Duration.zero;
            });
      } else if (widget.contentType ==
              videoTypeToString(VideoType.video_youtube) ||
          widget.contentType == videoTypeToString(VideoType.url_youtube)) {
        _yc = YoutubePlayerController(
            initialVideoId:
                YoutubePlayer.convertUrlToId(widget.contentValue) ?? "",
            flags: YoutubePlayerFlags(autoPlay: widget.autoPlay));
      } else if (widget.contentType ==
              videoTypeToString(VideoType.video_other) ||
          widget.contentType == videoTypeToString(VideoType.url_other)) {
        print("content type = ${widget.contentType}");
        print("content value = ${widget.contentValue}");
        webViewController = WebViewController()
          ..setJavaScriptMode(JavaScriptMode.unrestricted)
          ..loadRequest(Uri.parse(widget.contentValue));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return (widget.contentType == videoTypeToString(VideoType.video_upload))
        ? FlickVideoPlayer(flickManager: flickManager!)
        : (widget.contentType == videoTypeToString(VideoType.video_youtube) ||
                widget.contentType == videoTypeToString(VideoType.url_youtube))
            ? YoutubePlayer(
                controller: _yc!,
                showVideoProgressIndicator: true,
                progressIndicatorColor: Theme.of(context).primaryColor)
            : (widget.contentType == videoTypeToString(VideoType.url_other) ||
                    widget.contentType ==
                        videoTypeToString(VideoType.video_other))
                ? Center(child: WebViewWidget(controller: webViewController))
                : const SizedBox.shrink();
  }
}
