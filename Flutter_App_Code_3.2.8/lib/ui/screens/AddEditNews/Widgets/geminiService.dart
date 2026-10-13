import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:news/utils/api.dart';

/// AI Service Module using Google Gemini API
/// This module contains all AI-related API calls for the application

class GeminiService {
  static const String _geminiModel = "gemini-2.0-flash"; // Or gemini-1.5-pro

  /// Helper function to call Gemini API
  static Future<Map<String, dynamic>> _callGeminiAPI(
      String prompt, String apiKey) async {
    try {
      final requestBody = {
        "contents": [
          {
            "parts": [
              {"text": prompt}
            ]
          }
        ]
      };

      final url = Uri.parse(
          "${Api.geminiMetaInfoApi}$_geminiModel:generateContent?key=$apiKey");

      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(requestBody),
      );

      if (response.statusCode != 200) {
        final errorData = jsonDecode(response.body);
        throw Exception(
            errorData["error"]?["message"] ?? "Failed to generate content");
      }

      return jsonDecode(response.body);
    } catch (e) {
      //print("Gemini API error: $e");
      rethrow;
    }
  }

  /// Generate content
  static Future<String> generateContent({
    String? title,
    String? category,
    String? language,
    String? languageCode,
    required String apiKey,
  }) async {
    try {
      String fullPrompt =
          "You are a skilled news article writer. Create engaging and informative content.";

      if (title != null) {
        fullPrompt += "\n\nWrite an article with the title: \"$title\"";
      }

      if (category != null) {
        fullPrompt += "\nCategory: $category";
      }

      if (language != null && languageCode != null) {
        fullPrompt +=
            "\n\nIMPORTANT: Generate all content in $language language ($languageCode). The response MUST be in $language.";
      }

      fullPrompt += "\n\nRequest: \n\nArticle:";

      final response = await _callGeminiAPI(fullPrompt, apiKey);

      return response["candidates"][0]["content"]["parts"][0]["text"];
    } catch (e) {
      //print("AI content generation error: $e");
      rethrow;
    }
  }

  /// Generate meta info
  static Future<Map<String, dynamic>> generateMetaInfo(
      {required String title,
      String? language,
      String? languageCode,
      required String apiKey}) async {
    try {
      String languageInstruction = "";
      if (language != null && languageCode != null) {
        languageInstruction =
            "\n\nIMPORTANT: Generate all content in $language language ($languageCode). The response MUST be in same language as title.";
      }

      final prompt = """
You are an SEO expert. Generate meta title, description, keywords, and a slug for this news article titled: "$title".$languageInstruction

Return ONLY a JSON object with these fields:
- meta_title
- meta_description
- meta_keywords
- slug

Response must be valid JSON.
""";

      final response = await _callGeminiAPI(prompt, apiKey);
      final responseText =
          response["candidates"][0]["content"]["parts"][0]["text"].trim();

      try {
        return jsonDecode(responseText);
      } catch (_) {
        final match = RegExp(r"\{[\s\S]*\}").firstMatch(responseText);
        if (match != null) {
          return jsonDecode(match.group(0)!);
        }
        return {
          "meta_title": title,
          "meta_description": "Read about $title in our latest news article.",
          "meta_keywords": title.toLowerCase().split(" ").join(","),
          "slug": title
              .toLowerCase()
              .replaceAll(RegExp(r'[^a-z0-9]+'), "-")
              .replaceAll(RegExp(r'^-|-$'), ""),
        };
      }
    } catch (e) {
      //print("AI meta generation error: $e");
      rethrow;
    }
  }

  /// Summarize description
  static Future<String> summarizeDescription(String description, String apiKey,
      {String language = "English", String languageCode = "en"}) async {
    try {
      if (description.trim().isEmpty) return "";

      final cleanContent =
          description.replaceAll(RegExp(r"<[^>]*>"), "").trim();
      if (cleanContent.isEmpty) return "";

      final prompt = """
You are a skilled content summarizer. Summarize the following news content:

Content: "$cleanContent"

Instructions:
- 200-250 words
- Maintain key facts
- Professional news style
- No explanations, only summary
- IMPORTANT: Generate in $language ($languageCode).

Summary:""";

      final response = await _callGeminiAPI(prompt, apiKey);
      final summary =
          response["candidates"][0]["content"]["parts"][0]["text"].trim();

      String finalSummary =
          summary.replaceAll(RegExp(r"^['\']+|['\']+$"), '').trim();
      return finalSummary;
    } catch (e) {
      //print("Summarization error: $e");
      return description.replaceAll(RegExp(r"<[^>]*>"), "").substring(0, 150) +
          "...";
    }
  }
}
