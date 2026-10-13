import 'package:flutter/material.dart';
import 'package:news/ui/widgets/customTextLabel.dart';
import 'package:news/utils/uiUtils.dart';

showSnackBar(String msg, BuildContext context, {int? durationInMiliSeconds}) {
  try {
    // Check if the context is still valid before showing snackbar
    // Use a try-catch around ScaffoldMessenger.of() as it throws when context is disposed
    final scaffoldMessenger = ScaffoldMessenger.of(context);

    // Get theme and color scheme safely
    final theme = Theme.of(context);
    final colorScheme = UiUtils.getColorScheme(context);

    scaffoldMessenger.showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        content: CustomTextLabel(
            text: msg,
            textAlign: TextAlign.center,
            textStyle: TextStyle(color: theme.colorScheme.surface)),
        showCloseIcon: false,
        duration: Duration(
            milliseconds: durationInMiliSeconds ?? 1500), //bydefault 4000 ms
        backgroundColor: colorScheme.primaryContainer,
        elevation: 1.0,
      ),
    );
  } catch (e) {
    // Silently handle errors if context is no longer valid or widget is disposed
    // This prevents "Looking up a deactivated widget's ancestor is unsafe" errors
    // Don't log the error to avoid cluttering logs with expected errors
  }
}
