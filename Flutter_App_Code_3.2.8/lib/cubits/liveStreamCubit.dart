import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:news/data/models/LiveStreamingModel.dart';
import 'package:news/data/repositories/LiveStream/liveStreamRepository.dart';
import 'package:news/utils/constant.dart';
import 'package:news/utils/strings.dart';

abstract class LiveStreamState {}

class LiveStreamInitial extends LiveStreamState {}

class LiveStreamFetchInProgress extends LiveStreamState {}

class LiveStreamFetchSuccess extends LiveStreamState {
  final List<LiveStreamingModel> liveStream;
  final int totalLiveStreamCount;
  final bool hasMoreFetchError;
  final bool hasMore;

  LiveStreamFetchSuccess(
      {required this.liveStream,
      required this.totalLiveStreamCount,
      required this.hasMoreFetchError,
      required this.hasMore});
}

class LiveStreamFetchFailure extends LiveStreamState {
  final String errorMessage;

  LiveStreamFetchFailure(this.errorMessage);
}

class LiveStreamCubit extends Cubit<LiveStreamState> {
  final LiveStreamRepository _liveStreamRepository;

  LiveStreamCubit(this._liveStreamRepository) : super(LiveStreamInitial());

  void getLiveStream({required String langCode}) async {
    try {
      emit(LiveStreamFetchInProgress());
      final result = await _liveStreamRepository.getLiveStream(
          langCode: langCode,
          limit: limitOfAPIData.toString(),
          offset: "0");

      (!result[ERROR])
          ? emit(LiveStreamFetchSuccess(
              liveStream: result['LiveStream'],
              totalLiveStreamCount: result[TOTAL],
              hasMoreFetchError: false,
              hasMore:
                  (result['LiveStream'] as List<LiveStreamingModel>).length <
                      result[TOTAL]))
          : emit(LiveStreamFetchFailure(result[MESSAGE]));
    } catch (e) {
      emit(LiveStreamFetchFailure(e.toString()));
    }
  }

  bool hasMoreLiveStream() {
    return (state is LiveStreamFetchSuccess)
        ? (state as LiveStreamFetchSuccess).hasMore
        : false;
  }

  void getMoreLiveStream({required String langCode}) async {
    if (state is LiveStreamFetchSuccess) {
      try {
        final result = await _liveStreamRepository.getLiveStream(
            langCode: langCode,
            limit: limitOfAPIData.toString(),
            offset:
                (state as LiveStreamFetchSuccess).liveStream.length.toString());
        if (!result[ERROR]) {
          List<LiveStreamingModel> updatedResults =
              (state as LiveStreamFetchSuccess).liveStream;
          updatedResults
              .addAll(result['LiveStream'] as List<LiveStreamingModel>);
          emit(LiveStreamFetchSuccess(
              liveStream: updatedResults,
              totalLiveStreamCount: result[TOTAL],
              hasMoreFetchError: false,
              hasMore: updatedResults.length < result[TOTAL]));
        } else {
          emit(LiveStreamFetchFailure(result[MESSAGE]));
        }
      } catch (e) {
        emit(LiveStreamFetchSuccess(
            liveStream: (state as LiveStreamFetchSuccess).liveStream,
            hasMoreFetchError: true,
            totalLiveStreamCount:
                (state as LiveStreamFetchSuccess).totalLiveStreamCount,
            hasMore: (state as LiveStreamFetchSuccess).hasMore));
      }
    }
  }
}
