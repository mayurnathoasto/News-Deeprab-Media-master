import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:news/data/repositories/Settings/settingsLocalDataRepository.dart';

import 'package:news/ui/styles/appTheme.dart';

import 'package:news/utils/uiUtils.dart';

class ThemeState {
  final AppTheme appTheme;
  ThemeState(this.appTheme);
}

class ThemeCubit extends Cubit<ThemeState> {
  SettingsLocalDataRepository settingsRepository;
  ThemeCubit(this.settingsRepository) : super(ThemeState(UiUtils.getAppThemeFromLabel(settingsRepository.getCurrentTheme())));

  void changeTheme(AppTheme appTheme) {
    settingsRepository.setCurrentTheme(UiUtils.getThemeLabelFromAppTheme(appTheme));
    emit(ThemeState(appTheme));
  }
}
