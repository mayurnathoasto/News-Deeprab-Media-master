import 'package:news/utils/constant.dart';
import 'package:news/utils/strings.dart';

class Author {
  final int? id;
  final int? userId;
  final String? bio;
  final String? telegramLink;
  final String? linkedinLink;
  final String? facebookLink;
  final String? whatsappLink;
  final AuthorStatus? status;

  Author({
    this.id,
    this.userId,
    this.bio,
    this.telegramLink,
    this.linkedinLink,
    this.facebookLink,
    this.whatsappLink,
    this.status,
  });

  factory Author.fromJson(Map<String, dynamic> json) {
    return Author(
        id: json['id'] as int?,
        userId: json['user_id'] as int?,
        bio: json['bio'] ?? "",
        telegramLink: json['telegram_link'] ?? "",
        linkedinLink: json['linkedin_link'] ?? "",
        facebookLink: json['facebook_link'] ?? "",
        whatsappLink: json['whatsapp_link'] ?? "",
        status: fromAuthorStatus(json[STATUS]));
  }
}

AuthorStatus? fromAuthorStatus(String? value) {
  switch (value) {
    case 'pending':
      return AuthorStatus.pending;
    case 'approved':
      return AuthorStatus.approved;
    case 'rejected':
      return AuthorStatus.rejected;
    default:
      return null;
  }
}
