-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: enews_admin
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(191) NOT NULL,
  `password` text DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `forgot_unique_code` text DEFAULT NULL,
  `forgot_at` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin','$2y$10$ZlwPj5L1Ab5aEr.2o47fyukRR70MGqfzaM0X6xF1cKFHqnp2NInDy','admin@gmail.com','','','panel/user.jpg',1,'2026-05-14 08:36:50','2026-05-14 08:36:50');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `featured_section_rss_feeds`
--

DROP TABLE IF EXISTS `featured_section_rss_feeds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `featured_section_rss_feeds` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `featured_section_id` bigint(20) unsigned NOT NULL,
  `rss_feed_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `featured_section_rss_feeds_featured_section_id_foreign` (`featured_section_id`),
  KEY `featured_section_rss_feeds_rss_feed_id_foreign` (`rss_feed_id`),
  CONSTRAINT `featured_section_rss_feeds_featured_section_id_foreign` FOREIGN KEY (`featured_section_id`) REFERENCES `tbl_featured_sections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `featured_section_rss_feeds_rss_feed_id_foreign` FOREIGN KEY (`rss_feed_id`) REFERENCES `tbl_rss` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `featured_section_rss_feeds`
--

LOCK TABLES `featured_section_rss_feeds` WRITE;
/*!40000 ALTER TABLE `featured_section_rss_feeds` DISABLE KEYS */;
/*!40000 ALTER TABLE `featured_section_rss_feeds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feed_items`
--

DROP TABLE IF EXISTS `feed_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feed_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rss_source_id` bigint(20) unsigned NOT NULL,
  `guid` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `url` text NOT NULL,
  `description` longtext DEFAULT NULL,
  `image_url` varchar(191) DEFAULT NULL,
  `author` varchar(191) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `fetched_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `feed_items_guid_rss_source_unique` (`guid`,`rss_source_id`),
  KEY `feed_items_rss_source_id_published_at_index` (`rss_source_id`,`published_at`),
  CONSTRAINT `feed_items_rss_source_id_foreign` FOREIGN KEY (`rss_source_id`) REFERENCES `tbl_rss` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feed_items`
--

LOCK TABLES `feed_items` WRITE;
/*!40000 ALTER TABLE `feed_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `feed_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_100000_create_password_reset_tokens_table',1),(2,'2014_10_12_100000_create_password_resets_table',1),(3,'2019_08_19_000000_create_failed_jobs_table',1),(4,'2019_12_14_000001_create_personal_access_tokens_table',1),(5,'2023_11_27_064401_create_all_tables',1),(6,'2024_04_10_104520_create_admin_table',1),(7,'2024_04_10_104525_create_tbl_users_table',1),(8,'2024_04_10_104530_create_tbl_languages_table',1),(9,'2024_04_10_105710_create_tbl_category_table',1),(10,'2024_04_10_110701_create_tbl_subcategory_table',1),(11,'2024_04_10_114540_create_tbl_tag_table',1),(12,'2024_04_10_115137_create_tbl_news_table',1),(13,'2024_04_10_115178_create_tbl_news_image_table',1),(14,'2024_04_10_120536_create_tbl_breaking_news_table',1),(15,'2024_04_10_122518_create_tbl_live_streaming_table',1),(16,'2024_04_12_091014_create_tbl_settings_table',1),(17,'2024_04_12_091153_create_tbl_bookmark_table',1),(18,'2024_04_12_091423_create_tbl_news_like_table',1),(19,'2024_04_12_091725_create_tbl_news_view_table',1),(20,'2024_04_12_092110_create_tbl_breaking_news_view_table',1),(21,'2024_04_12_092330_create_tbl_comment_table',1),(22,'2024_04_12_093239_create_tbl_comment_flag_table',1),(23,'2024_04_12_095441_create_tbl_comment_like_table',1),(24,'2024_04_12_100023_create_tbl_comment_notification_table',1),(25,'2024_04_12_100436_create_tbl_survey_question_table',1),(26,'2024_04_12_100901_create_tbl_survey_option_table',1),(27,'2024_04_12_102723_create_tbl_survey_result_table',1),(28,'2024_04_12_103031_create_tbl_location_table',1),(29,'2024_04_12_103211_create_tbl_notifications_table',1),(30,'2024_04_13_052620_create_tbl_token_table',1),(31,'2024_04_13_052717_create_tbl_users_category_table',1),(32,'2024_04_13_053529_create_tbl_pages_table',1),(33,'2024_04_13_054156_create_tbl_featured_sections_table',1),(34,'2024_04_13_055248_create_tbl_ad_spaces_table',1),(35,'2024_04_13_055535_create_tbl_web_settings_table',1),(36,'2024_04_13_055705_create_tbl_web_seo_pages_table',1),(37,'2024_07_15_161407_create_tbl_social_media_table',1),(38,'2024_11_09_150136_create_tbl_rss_table',1),(39,'2025_01_23_100907_version_3_2_0',1),(40,'2025_04_07_051450_version_3_2_1',1),(41,'2025_05_06_102624_version_3_2_2',1),(42,'2025_05_06_102624_version_3_2_3',1),(43,'2025_08_18_183935_version_3_2_4',1),(44,'2025_09_03_124942_update_tbl_news_table',1),(45,'2025_11_08_155756_version_3_2_5',1),(46,'2025_12_19_095852_version_3_2_6_table',1),(47,'2026_01_13_164209_create_jobs_table',1),(48,'2026_02_18_172444_version_3_2_7_table',1),(49,'2026_03_20_122142_version_3_2_8_table',1),(50,'2026_04_08_100000_create_service_health_logs_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(191) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(191) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` VALUES (1,'App\\Models\\Admin',1);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `guard_name` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'category-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(2,'category-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(3,'category-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(4,'category-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(5,'category-order-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(6,'sub-category-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(7,'sub-category-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(8,'sub-category-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(9,'sub-category-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(10,'sub-category-order-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(11,'tag-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(12,'tag-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(13,'tag-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(14,'tag-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(15,'news-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(16,'news-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(17,'news-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(18,'news-edit-description','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(19,'news-clone','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(20,'news-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(21,'news-bulk-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(22,'breaking-news-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(23,'breaking-news-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(24,'breaking-news-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(25,'breaking-news-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(26,'breaking-news-bulk-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(27,'live-streaming-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(28,'live-streaming-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(29,'live-streaming-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(30,'live-streaming-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(31,'rss-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(32,'rss-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(33,'rss-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(34,'rss-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(35,'rss-bulk-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(36,'featured-section-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(37,'featured-section-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(38,'featured-section-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(39,'featured-section-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(40,'featured-section-order-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(41,'ad-space-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(42,'ad-space-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(43,'ad-space-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(44,'ad-space-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(45,'user-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(46,'user-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(47,'comment-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(48,'comment-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(49,'comment-bulk-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(50,'comment-flag-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(51,'comment-flag-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(52,'notification-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(53,'notification-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(54,'notification-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(55,'survey-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(56,'survey-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(57,'survey-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(58,'survey-view','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(59,'survey-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(60,'survey-bulk-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(61,'location-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(62,'location-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(63,'location-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(64,'location-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(65,'page-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(66,'page-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(67,'page-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(68,'page-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(69,'staff-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(70,'staff-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(71,'staff-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(72,'staff-change-password','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(73,'staff-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(74,'role-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(75,'role-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(76,'role-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(77,'role-view','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(78,'role-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(79,'general-settings','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(80,'panel-settings','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(81,'web-settings','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(82,'app-settings','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(83,'language-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(84,'language-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(85,'language-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(86,'language-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(87,'seo-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(88,'seo-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(89,'seo-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(90,'seo-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(91,'firebase-configuration','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(92,'social-media-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(93,'social-media-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(94,'social-media-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(95,'social-media-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(96,'system-update','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(97,'author-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(98,'author-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(99,'enews-list','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(100,'enews-create','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(101,'enews-edit','admin','2026-05-14 08:08:47','2026-05-14 08:08:47'),(102,'enews-delete','admin','2026-05-14 08:08:47','2026-05-14 08:08:47');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(191) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
INSERT INTO `role_has_permissions` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),(21,1),(22,1),(23,1),(24,1),(25,1),(26,1),(27,1),(28,1),(29,1),(30,1),(31,1),(32,1),(33,1),(34,1),(35,1),(36,1),(37,1),(38,1),(39,1),(40,1),(41,1),(42,1),(43,1),(44,1),(45,1),(46,1),(47,1),(48,1),(49,1),(50,1),(51,1),(52,1),(53,1),(54,1),(55,1),(56,1),(57,1),(58,1),(59,1),(60,1),(61,1),(62,1),(63,1),(64,1),(65,1),(66,1),(67,1),(68,1),(69,1),(70,1),(71,1),(72,1),(73,1),(74,1),(75,1),(76,1),(77,1),(78,1),(79,1),(80,1),(81,1),(82,1),(83,1),(84,1),(85,1),(86,1),(87,1),(88,1),(89,1),(90,1),(91,1),(92,1),(93,1),(94,1),(95,1),(96,1),(97,1),(98,1),(99,1),(100,1),(101,1),(102,1);
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `guard_name` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','admin','2026-05-14 08:08:47','2026-05-14 08:08:47');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_health_logs`
--

DROP TABLE IF EXISTS `service_health_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_health_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `status` enum('valid','invalid') NOT NULL,
  `response_message` text DEFAULT NULL,
  `domain_checked` varchar(191) NOT NULL,
  `checksum` varchar(64) DEFAULT NULL,
  `checked_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `service_health_logs_checked_at_index` (`checked_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_health_logs`
--

LOCK TABLES `service_health_logs` WRITE;
/*!40000 ALTER TABLE `service_health_logs` DISABLE KEYS */;
INSERT INTO `service_health_logs` VALUES (1,'valid','Verification deferred.','127.0.0.1:8000','85dc07bfd131bd6c692803bdb21fee32f1975f36e8743485c2d343b8dd10ce5b','2026-05-14 08:45:12','2026-05-14 08:45:12','2026-05-14 08:45:12');
/*!40000 ALTER TABLE `service_health_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_ad_spaces`
--

DROP TABLE IF EXISTS `tbl_ad_spaces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_ad_spaces` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL,
  `ad_space` varchar(191) NOT NULL,
  `ad_featured_section_id` int(11) NOT NULL,
  `ad_image` varchar(191) DEFAULT NULL,
  `web_ad_image` varchar(191) DEFAULT NULL,
  `ad_url` varchar(191) DEFAULT NULL,
  `date` date NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0-deactive, 1-active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ad_spaces`
--

LOCK TABLES `tbl_ad_spaces` WRITE;
/*!40000 ALTER TABLE `tbl_ad_spaces` DISABLE KEYS */;
INSERT INTO `tbl_ad_spaces` VALUES (1,1,'Technology',1,'ad_spaces/dummy-1.jpg','ad_spaces/dummy-6.jpg','https://newsweb.wrteam.me','2026-05-14',1,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(2,1,'Science',2,'ad_spaces/dummy-2.jpg','ad_spaces/dummy-7.jpg','https://newsweb.wrteam.me','2026-05-14',1,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(3,1,'Business',3,'ad_spaces/dummy-3.jpg','ad_spaces/dummy-8.jpg','https://newsweb.wrteam.me','2026-05-14',1,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(4,1,'Religion',4,'ad_spaces/dummy-4.jpg','ad_spaces/dummy-9.jpg','https://newsweb.wrteam.me','2026-05-14',1,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(5,1,'Health',5,'ad_spaces/dummy-5.jpg','ad_spaces/dummy-10.jpg','https://newsweb.wrteam.me','2026-05-14',1,'2026-05-14 08:09:03','2026-05-14 08:09:03');
/*!40000 ALTER TABLE `tbl_ad_spaces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_authors`
--

DROP TABLE IF EXISTS `tbl_authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_authors` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `bio` text DEFAULT NULL,
  `telegram_link` varchar(191) DEFAULT NULL,
  `linkedin_link` varchar(191) DEFAULT NULL,
  `facebook_link` varchar(191) DEFAULT NULL,
  `whatsapp_link` varchar(191) DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tbl_authors_user_id_foreign` (`user_id`),
  CONSTRAINT `tbl_authors_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_authors`
--

LOCK TABLES `tbl_authors` WRITE;
/*!40000 ALTER TABLE `tbl_authors` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_bookmark`
--

DROP TABLE IF EXISTS `tbl_bookmark`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_bookmark` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `news_id` (`news_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_bookmark`
--

LOCK TABLES `tbl_bookmark` WRITE;
/*!40000 ALTER TABLE `tbl_bookmark` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_bookmark` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_breaking_news`
--

DROP TABLE IF EXISTS `tbl_breaking_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_breaking_news` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL,
  `title` text NOT NULL,
  `slug` varchar(191) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `content_type` varchar(50) DEFAULT NULL,
  `content_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `summarized_description` varchar(191) DEFAULT NULL,
  `meta_title` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `schema_markup` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`),
  KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_breaking_news`
--

LOCK TABLES `tbl_breaking_news` WRITE;
/*!40000 ALTER TABLE `tbl_breaking_news` DISABLE KEYS */;
INSERT INTO `tbl_breaking_news` VALUES (1,1,'WhatsApp rolls out new features for Communities','whatsapp-rolls-out-new-features-for-communities','breaking_news/dummy-1.jpg','standard_post',NULL,'WhatsApp is getting new features for Communities and their groups that will allow users to organise events and reply to admin announcements in Community Announcement Groups announced Meta chief Mark Zuckerberg on his WhatsApp Channel.\n\n            Groups that are part of a WhatsApp community can now create events for their groups, facilitating both in-person and online gatherings.',NULL,'WhatsApp rolls out new features for Communities','WhatsApp is getting new features for Communities and their groups that will allow users to organise events and reply to admin announcements in Community Announcement Groups announced Meta chief Mark Zuckerberg on his WhatsApp Channel.\n\n            Groups that are part of a WhatsApp community can now create events for their groups, facilitating both in-person and online gatherings.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(2,1,'Chat GPT and Future of AI','chat-gpt-and-future-of-ai','breaking_news/dummy-2.jpg','standard_post',NULL,'ChatGPT is a conversational AI chatbot that is able to produce text for you based on any prompt you input, generating emails, essays, poems, raps, grocery lists, letters and much more.\n\n            In addition to writing for you, it can chat with you about simple or complex topics such as \"What are colors?\" or \"What is the meaning of life?\" ChatGPT is also proficient in STEM and can write and debug code, and even solve complex math equations. The best part is that the service is completely free to the public right now because it is still in its research and feedback-collection phase.',NULL,'Chat GPT and Future of AI','ChatGPT is a conversational AI chatbot that is able to produce text for you based on any prompt you input, generating emails, essays, poems, raps, grocery lists, letters and much more.\n\n            In addition to writing for you, it can chat with you about simple or complex topics such as \"What are colors?\" or \"What is the meaning of life?\" ChatGPT is also proficient in STEM and can write and debug code, and even solve complex math equations. The best part is that the service is completely free to the public right now because it is still in its research and feedback-collection phase.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(3,1,'In US Shocker, Senator Suggests Israel Should Be Allowed To Nuke Gaza','in-us-shocker-senator-suggests-israel-should-be-allowed-to-nuke-gaza','breaking_news/dummy-3.jpg','standard_post',NULL,'In US Shocker, Senator Suggests Israel Should Be Allowed To Nuke Gaza',NULL,'In US Shocker, Senator Suggests Israel Should Be Allowed To Nuke Gaza','In US Shocker, Senator Suggests Israel Should Be Allowed To Nuke Gaza',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(4,1,'This Solar-Electric Car Has Over 1000 Km Range, Needs Charge Once in 7 Months','this-solar-electric-car-has-over-1000-km-range-needs-charge-once-in-7-months','breaking_news/dummy-4.jpg','standard_post',NULL,'Electric cars are being unveiled every other day now but the major challenge remains their change. That too may be a thing of the past. Lightyear, a company developing solar electric cars, has revealed their first production-ready vehicle, the Lightyear 0. The vehicle uses both solar and electric energy to run the powertrain which, the company claims, has boosted the range of the vehicle beyond 1000 kilometres.\n\n            “After six years of R&D, design, engineering, prototyping, and testing, this premier solar car is slated to go into production this fall,” read the official statement. “In 2016, we only had an idea; three years later, we had a prototype. Now, after six years of testing, iterating, re(designing), and countless obstacles, Lightyear 0 is proof that the impossible is actually possible,” said Lightyear CEO Lex Hoefsloot.',NULL,'This Solar-Electric Car Has Over 1000 Km Range, Needs Charge Once in 7 Months','Electric cars are being unveiled every other day now but the major challenge remains their change. That too may be a thing of the past. Lightyear, a company developing solar electric cars, has revealed their first production-ready vehicle, the Lightyear 0. The vehicle uses both solar and electric energy to run the powertrain which, the company claims, has boosted the range of the vehicle beyond 1000 kilometres.\n\n            “After six years of R&D, design, engineering, prototyping, and testing, this premier solar car is slated to go into production this fall,” read the official statement. “In 2016, we only had an idea; three years later, we had a prototype. Now, after six years of testing, iterating, re(designing), and countless obstacles, Lightyear 0 is proof that the impossible is actually possible,” said Lightyear CEO Lex Hoefsloot.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(5,1,'Does apple cider vinegar really have health super powers?','does-apple-cider-vinegar-really-have-health-super-powers','breaking_news/dummy-5.jpg','standard_post',NULL,'Does apple cider vinegar really have health super powers?',NULL,'Does apple cider vinegar really have health super powers?','Does apple cider vinegar really have health super powers?',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(6,1,'Samsung Electronics To Showcase How Enhanced AI and Connectivity Enable Expansive Kitchen Experiences at CES 2024','samsung-electronics-to-showcase-how-enhanced-ai-and-connectivity-enable-expansive-kitchen-experiences-at-ces-2024','breaking_news/dummy-6.jpg','standard_post',NULL,'Samsung Electronics Co., Ltd. today announced that it will use CES® 2024 to introduce Samsung’s newest kitchen products, applications, and features, which include artificial intelligence (AI) features and SmartThings connectivity, enabling an ecosystem that delivers new food and kitchen experiences with Samsung products. Notable products and features in the lineup include the 2024 Bespoke 4-Door Flex™ Refrigerator with AI Family Hub™ — which was Samsung’s first home Internet of Things (IoT) refrigerator launched in 2016 — now equipped with the all-new AI Vision Inside feature, the new Anyplace Induction Cooktop and enhancements to the Samsung Food service.',NULL,'Samsung Electronics To Showcase How Enhanced AI and Connectivity Enable Expansive Kitchen Experiences at CES 2024','Samsung Electronics Co., Ltd. today announced that it will use CES® 2024 to introduce Samsung’s newest kitchen products, applications, and features, which include artificial intelligence (AI) features and SmartThings connectivity, enabling an ecosystem that delivers new food and kitchen experiences with Samsung products. Notable products and features in the lineup include the 2024 Bespoke 4-Door Flex™ Refrigerator with AI Family Hub™ — which was Samsung’s first home Internet of Things (IoT) refrigerator launched in 2016 — now equipped with the all-new AI Vision Inside feature, the new Anyplace Induction Cooktop and enhancements to the Samsung Food service.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(7,1,'ICC 0:20 / 5:00 The Making of the ICC Cricket World Cup Trophy','icc-020-500-the-making-of-the-icc-cricket-world-cup-trophy','breaking_news/dummy-7.jpg','standard_post',NULL,'ICC 0:20 / 5:00 The Making of the ICC Cricket World Cup Trophy',NULL,'ICC 0:20 / 5:00 The Making of the ICC Cricket World Cup Trophy','ICC 0:20 / 5:00 The Making of the ICC Cricket World Cup Trophy',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(8,1,'Supreme Court to urgently hear plea on ‘delay’ in voter turnout data publication on May 17','supreme-court-to-urgently-hear-plea-on-delay-in-voter-turnout-data-publication-on-may-17','breaking_news/dummy-8.jpg','standard_post',NULL,'The Supreme Court is scheduled to urgently hear on May 17 an application alleging inordinate delay in the publication of voter turnout data of the first two phases of polling in the Lok Sabha elections.\n\n            Mr. Bhushan had urged for an early hearing by the court in the background of the ongoing elections.\n\n            Besides delay in publishing the voter-turnout details, the application said there was a sharp spike in figures from the initial voter turnout percentages released by the Election Commission (EC).\n\n            Mr. Bhushan said both these developments, post polling in the initial phases, had raised concerns and public suspicion regarding the accuracy of the data.\n\n            The plea has urged the court to direct the EC to disclose authenticated record of voter turnout by uploading on its website scanned legible copies of account of votes recorded at polling stations after each phase of voting in the on-going Lok Sabha elections. Rule 49S and Rule 56C(2) of the Conduct of Election Rules, 1961 require the presiding officer to prepare an account of votes recorded in form 17C (Part I) and the returning officer to record the number of votes in favour of each candidate.',NULL,'Supreme Court to urgently hear plea on ‘delay’ in voter turnout data publication on May 17','The Supreme Court is scheduled to urgently hear on May 17 an application alleging inordinate delay in the publication of voter turnout data of the first two phases of polling in the Lok Sabha elections.\n\n            Mr. Bhushan had urged for an early hearing by the court in the background of the ongoing elections.\n\n            Besides delay in publishing the voter-turnout details, the application said there was a sharp spike in figures from the initial voter turnout percentages released by the Election Commission (EC).\n\n            Mr. Bhushan said both these developments, post polling in the initial phases, had raised concerns and public suspicion regarding the accuracy of the data.\n\n            The plea has urged the court to direct the EC to disclose authenticated record of voter turnout by uploading on its website scanned legible copies of account of votes recorded at polling stations after each phase of voting in the on-going Lok Sabha elections. Rule 49S and Rule 56C(2) of the Conduct of Election Rules, 1961 require the presiding officer to prepare an account of votes recorded in form 17C (Part I) and the returning officer to record the number of votes in favour of each candidate.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(9,1,'The Future of OER in Higher Education','the-future-of-oer-in-higher-education','breaking_news/dummy-9.jpg','standard_post',NULL,'The past few years have brought drastic changes to higher education, in both how students learn and how instructors teach. Whether due to increases in remote and hybrid learning during the COVID-19 pandemic or the growing prominence of generative artificial intelligence (GenAI), business educators have had to adapt to change quickly, often without much institutional support.\n\n            Even through all this upheaval, textbooks have remained the most popular course material in higher education, according to a survey conducted by the research firm Bay View Analytics. However, increasingly instructors are replacing print materials such as hardcopy textbooks and homework handouts with digital options such as online textbooks and homework assistance platforms. Instructors also have embraced open educational resources (OER). Bay View’s data also show that the percentage of educators using OER as required course materials nearly doubled between the 2019–20 and 2022–23 academic years, from 15 percent to 29 percent.',NULL,'The Future of OER in Higher Education','The past few years have brought drastic changes to higher education, in both how students learn and how instructors teach. Whether due to increases in remote and hybrid learning during the COVID-19 pandemic or the growing prominence of generative artificial intelligence (GenAI), business educators have had to adapt to change quickly, often without much institutional support.\n\n            Even through all this upheaval, textbooks have remained the most popular course material in higher education, according to a survey conducted by the research firm Bay View Analytics. However, increasingly instructors are replacing print materials such as hardcopy textbooks and homework handouts with digital options such as online textbooks and homework assistance platforms. Instructors also have embraced open educational resources (OER). Bay View’s data also show that the percentage of educators using OER as required course materials nearly doubled between the 2019–20 and 2022–23 academic years, from 15 percent to 29 percent.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(10,1,'Stay Ahead of the Curve - Breaking News on the Latest Developments in the World of Bitcoin.','stay-ahead-of-the-curve-breaking-news-on-the-latest-developments-in-the-world-of-bitcoin','breaking_news/dummy-10.jpg','standard_post',NULL,'Stay informed and stay ahead of the game with our up-to-the-minute coverage on the latest Bitcoin news and developments, delivering comprehensive insights and analysis on the world leading cryptocurrency.',NULL,'Stay Ahead of the Curve - Breaking News on the Latest Developments in the World of Bitcoin.','Stay informed and stay ahead of the game with our up-to-the-minute coverage on the latest Bitcoin news and developments, delivering comprehensive insights and analysis on the world leading cryptocurrency.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(11,1,'NASA’s Artemis II Moon Mission Delayed to September 2025','nasa-artemis-ii-mission-delayed','breaking_news/dummy-1.jpg','standard_post',NULL,'NASA has announced that the Artemis II crewed mission around the moon has been delayed to September 2025 due to safety reviews and technical challenges. This mission marks the next step in returning humans to lunar exploration.',NULL,'NASA’s Artemis II Moon Mission Delayed to September 2025','NASA has announced that the Artemis II crewed mission around the moon has been delayed to September 2025 due to safety reviews and technical challenges. This mission marks the next step in returning humans to lunar exploration.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(12,1,'India Passes Landmark Data Protection Bill','india-passes-landmark-data-protection-bill','breaking_news/dummy-2.jpg','standard_post',NULL,'The Indian Parliament has passed the Digital Personal Data Protection Bill, aiming to regulate how companies collect and handle digital data, promising greater security and privacy for the country’s citizens.',NULL,'India Passes Landmark Data Protection Bill','The Indian Parliament has passed the Digital Personal Data Protection Bill, aiming to regulate how companies collect and handle digital data, promising greater security and privacy for the country’s citizens.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(13,1,'Tesla Unveils Fully Self-Driving Robotaxi','tesla-unveils-fully-self-driving-robotaxi','breaking_news/dummy-3.jpg','standard_post',NULL,'Elon Musk announced the launch of Tesla’s first fully autonomous robotaxi, marking a milestone in driverless technology and urban transportation.',NULL,'Tesla Unveils Fully Self-Driving Robotaxi','Elon Musk announced the launch of Tesla’s first fully autonomous robotaxi, marking a milestone in driverless technology and urban transportation.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(14,1,'China Successfully Tests Quantum Internet Satellite','china-successfully-tests-quantum-internet-satellite','breaking_news/dummy-4.jpg','standard_post',NULL,'China has made significant advances in quantum technology, successfully launching a satellite capable of unhackable quantum communication, paving the way for a new era of internet security.',NULL,'China Successfully Tests Quantum Internet Satellite','China has made significant advances in quantum technology, successfully launching a satellite capable of unhackable quantum communication, paving the way for a new era of internet security.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(15,1,'Apple Introduces Revolutionary Foldable iPhone','apple-introduces-foldable-iphone','breaking_news/dummy-5.jpg','standard_post',NULL,'Apple officially revealed its first foldable iPhone at a global launch event, blending larger screen real estate with signature iOS innovation.',NULL,'Apple Introduces Revolutionary Foldable iPhone','Apple officially revealed its first foldable iPhone at a global launch event, blending larger screen real estate with signature iOS innovation.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(16,1,'Euro 2024: France Crowned European Champions','france-crowned-euro-2024-champions','breaking_news/dummy-6.jpg','standard_post',NULL,'France secured their third European Championship title by defeating Germany in a thrilling final, celebrated by fans across the globe.',NULL,'Euro 2024: France Crowned European Champions','France secured their third European Championship title by defeating Germany in a thrilling final, celebrated by fans across the globe.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(17,1,'United Nations Publishes Climate Action Roadmap for 2030','un-publishes-climate-action-roadmap-2030','breaking_news/dummy-7.jpg','standard_post',NULL,'The United Nations has released a new roadmap outlining ambitious targets to mitigate climate change, urging countries to take decisive action by 2030 to keep global warming under control.',NULL,'United Nations Publishes Climate Action Roadmap for 2030','The United Nations has released a new roadmap outlining ambitious targets to mitigate climate change, urging countries to take decisive action by 2030 to keep global warming under control.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(18,1,'AI Breakthrough Predicts Protein Structures in Seconds','ai-breakthrough-protein-structure-prediction','breaking_news/dummy-8.jpg','standard_post',NULL,'Researchers have announced a major breakthrough in artificial intelligence, with algorithms able to predict complex protein structures within seconds, promising to accelerate drug discovery.',NULL,'AI Breakthrough Predicts Protein Structures in Seconds','Researchers have announced a major breakthrough in artificial intelligence, with algorithms able to predict complex protein structures within seconds, promising to accelerate drug discovery.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(19,1,'Bitcoin Hits Record High Amid Market Surge','bitcoin-hits-record-high-2024','breaking_news/dummy-9.jpg','standard_post',NULL,'Bitcoin’s value reached an all-time high, surpassing previous records as cryptocurrency adoption accelerates worldwide, signaling increased confidence from investors and institutions.',NULL,'Bitcoin Hits Record High Amid Market Surge','Bitcoin’s value reached an all-time high, surpassing previous records as cryptocurrency adoption accelerates worldwide, signaling increased confidence from investors and institutions.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(20,1,'Japan Opens World’s First Automated Sushi Restaurant','japan-opens-automated-sushi-restaurant','breaking_news/dummy-10.jpg','standard_post',NULL,'A Tokyo restaurant has debuted the world\'s first fully automated sushi-making experience, combining robotics and AI to revolutionize the dining sector.',NULL,'Japan Opens World’s First Automated Sushi Restaurant','A Tokyo restaurant has debuted the world\'s first fully automated sushi-making experience, combining robotics and AI to revolutionize the dining sector.',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03');
/*!40000 ALTER TABLE `tbl_breaking_news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_breaking_news_view`
--

DROP TABLE IF EXISTS `tbl_breaking_news_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_breaking_news_view` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `breaking_news_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `breaking_news_id` (`breaking_news_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_breaking_news_view`
--

LOCK TABLES `tbl_breaking_news_view` WRITE;
/*!40000 ALTER TABLE `tbl_breaking_news_view` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_breaking_news_view` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_category`
--

DROP TABLE IF EXISTS `tbl_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_category` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL,
  `category_name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `row_order` int(11) NOT NULL DEFAULT 0,
  `image` varchar(191) DEFAULT NULL,
  `meta_title` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `schema_markup` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`),
  KEY `slug` (`slug`),
  KEY `row_order` (`row_order`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_category`
--

LOCK TABLES `tbl_category` WRITE;
/*!40000 ALTER TABLE `tbl_category` DISABLE KEYS */;
INSERT INTO `tbl_category` VALUES (1,1,'Technology','technology',0,'category/dummy-1.jpg','Technology','Technology','Technology','Technology','2026-05-14 08:09:03','2026-05-14 08:09:03'),(2,1,'Science','science',0,'category/dummy-2.jpg','Science','Science','Science','Science','2026-05-14 08:09:03','2026-05-14 08:09:03'),(3,1,'Business','business',0,'category/dummy-3.jpg','Business','Business','Business','Business','2026-05-14 08:09:03','2026-05-14 08:09:03'),(4,1,'Religion','religion',0,'category/dummy-4.jpg','Religion','Religion','Religion','Religion','2026-05-14 08:09:03','2026-05-14 08:09:03'),(5,1,'Health','health',0,'category/dummy-5.jpg','Health','Health','Health','Health','2026-05-14 08:09:03','2026-05-14 08:09:03'),(6,1,'Entertainment','entertainment',0,'category/dummy-6.jpg','Entertainment','Entertainment','Entertainment','Entertainment','2026-05-14 08:09:03','2026-05-14 08:09:03'),(7,1,'Sports','sports',0,'category/dummy-7.jpg','Sports','Sports','Sports','Sports','2026-05-14 08:09:03','2026-05-14 08:09:03'),(8,1,'Politics','politics',0,'category/dummy-8.jpg','Politics','Politics','Politics','Politics','2026-05-14 08:09:03','2026-05-14 08:09:03'),(9,1,'Education','education',0,'category/dummy-9.jpg','Education','Education','Education','Education','2026-05-14 08:09:03','2026-05-14 08:09:03'),(10,1,'Top News','top-news',0,'category/dummy-10.jpg','Top News','Top News','Top News','Top News','2026-05-14 08:09:03','2026-05-14 08:09:03');
/*!40000 ALTER TABLE `tbl_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_comment`
--

DROP TABLE IF EXISTS `tbl_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_comment` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0-unapproved, 1-approved',
  `date` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `user_id` (`user_id`),
  KEY `news_id` (`news_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_comment`
--

LOCK TABLES `tbl_comment` WRITE;
/*!40000 ALTER TABLE `tbl_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_comment_flag`
--

DROP TABLE IF EXISTS `tbl_comment_flag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_comment_flag` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '0-deactive, 1-active',
  `date` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comment_id` (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `news_id` (`news_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_comment_flag`
--

LOCK TABLES `tbl_comment_flag` WRITE;
/*!40000 ALTER TABLE `tbl_comment_flag` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_comment_flag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_comment_like`
--

DROP TABLE IF EXISTS `tbl_comment_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_comment_like` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '1-like, 2-dislike',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comment_id` (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_comment_like`
--

LOCK TABLES `tbl_comment_like` WRITE;
/*!40000 ALTER TABLE `tbl_comment_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_comment_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_comment_notification`
--

DROP TABLE IF EXISTS `tbl_comment_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_comment_notification` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `master_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `date` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `master_id` (`master_id`),
  KEY `user_id` (`user_id`),
  KEY `sender_id` (`sender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_comment_notification`
--

LOCK TABLES `tbl_comment_notification` WRITE;
/*!40000 ALTER TABLE `tbl_comment_notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_comment_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_e_news`
--

DROP TABLE IF EXISTS `tbl_e_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_e_news` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` bigint(20) unsigned NOT NULL,
  `title` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail` varchar(191) DEFAULT NULL,
  `attachment` varchar(191) NOT NULL,
  `date` date DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `meta_title` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `schema_markup` text DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1-active, 0-deactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tbl_e_news_language_id_foreign` (`language_id`),
  KEY `slug` (`slug`),
  CONSTRAINT `tbl_e_news_language_id_foreign` FOREIGN KEY (`language_id`) REFERENCES `tbl_languages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_e_news`
--

LOCK TABLES `tbl_e_news` WRITE;
/*!40000 ALTER TABLE `tbl_e_news` DISABLE KEYS */;
INSERT INTO `tbl_e_news` VALUES (1,1,'How To Enter International Space Station (ISS) Virtually Via Google Maps Street View','how-to-enter-international-space-station-iss-virtually-via-google-maps-street-view','Google Maps is a very good tool for finding your way and going places you have not explored so far.','enews/dummy-1.jpg','enews/699be5af4d28b.pdf','2026-05-14','How To Enter International Space Station (ISS) Virtually Via Google Maps Street View','How To Enter International Space Station (ISS) Virtually Via Google Maps Street View','Google Maps is a very good tool for finding your way and going places you have not explored so far.','',1,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(2,1,'NASA Invites Media to NOAA’s Advanced Weather Satellite Launch','nasa-invites-media-to-noaa-s-advanced-weather-satellite-launch','NASA is preparing to launch NOAA’s (National Oceanic and Atmospheric Administration) GOES-U (Geostationary Operational Environmental Satellite U), a mission to help improve weather observing and environmental monitoring capabilities on Earth, as well as advance space weather observations.','enews/dummy-2.jpg','enews/file-example_PDF_500_kB.pdf','2026-05-14','NASA Invites Media to NOAA’s Advanced Weather Satellite Launch','NASA Invites Media to NOAA’s Advanced Weather Satellite Launch','NASA is preparing to launch NOAA’s (National Oceanic and Atmospheric Administration) GOES-U (Geostationary Operational Environmental Satellite U), a mission to help improve weather observing and environmental monitoring capabilities on Earth, as well as advance space weather observations.','',1,'2026-05-14 08:09:03','2026-05-14 08:09:03');
/*!40000 ALTER TABLE `tbl_e_news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_featured_sections`
--

DROP TABLE IF EXISTS `tbl_featured_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_featured_sections` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL,
  `title` varchar(500) DEFAULT NULL,
  `slug` varchar(500) DEFAULT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `news_type` varchar(500) DEFAULT NULL,
  `user_ids` varchar(191) DEFAULT NULL COMMENT 'comma separated user_ids of authors',
  `videos_type` varchar(100) DEFAULT NULL,
  `filter_type` varchar(500) DEFAULT NULL,
  `category_ids` varchar(191) NOT NULL,
  `subcategory_ids` varchar(191) NOT NULL,
  `news_ids` varchar(191) NOT NULL,
  `style_app` varchar(100) DEFAULT NULL,
  `style_web` varchar(100) DEFAULT NULL,
  `row_order` int(11) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0-deactive, 1-active',
  `is_based_on_user_choice` tinyint(4) NOT NULL COMMENT '0-filter_section, 1-news from users category',
  `meta_title` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `schema_markup` text DEFAULT NULL,
  `og_image` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_featured_sections`
--

LOCK TABLES `tbl_featured_sections` WRITE;
/*!40000 ALTER TABLE `tbl_featured_sections` DISABLE KEYS */;
INSERT INTO `tbl_featured_sections` VALUES (1,1,'Technology','technology','Technology','news',NULL,NULL,'custom','','','1','style_1','style_1',0,1,0,'Technology','Technology','Technology','Technology',NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(2,1,'Science','science','Science','news',NULL,NULL,'custom','','','2','style_2','style_2',0,1,0,'Science','Science','Science','Science',NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(3,1,'Business','business','Business','news',NULL,NULL,'custom','','','3','style_3','style_3',0,1,0,'Business','Business','Business','Business',NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(4,1,'Religion','religion','Religion','news',NULL,NULL,'most_viewed','4','','','style_4','style_4',0,1,0,'Religion','Religion','Religion','Religion',NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03'),(5,1,'Health','health','Health','news',NULL,NULL,'most_commented','5','','','style_5','style_5',0,1,0,'Health','Health','Health','Health',NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03');
/*!40000 ALTER TABLE `tbl_featured_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_languages`
--

DROP TABLE IF EXISTS `tbl_languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_languages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language` varchar(255) NOT NULL,
  `code` varchar(10) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1-active, 0-deactive',
  `isRTL` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1-yes, 0-no',
  `image` varchar(191) DEFAULT NULL,
  `display_name` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `app_file` varchar(191) DEFAULT NULL,
  `web_file` varchar(191) DEFAULT NULL,
  `panel_file` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_languages`
--

LOCK TABLES `tbl_languages` WRITE;
/*!40000 ALTER TABLE `tbl_languages` DISABLE KEYS */;
INSERT INTO `tbl_languages` VALUES (1,'English (US)','en',1,0,'flags/en.webp','English (US)','2026-05-14 08:08:47','2026-05-14 08:08:47','en_app.json','en_web.json','en.json');
/*!40000 ALTER TABLE `tbl_languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_live_streaming`
--

DROP TABLE IF EXISTS `tbl_live_streaming`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_live_streaming` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL,
  `title` text NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `url` text DEFAULT NULL,
  `meta_title` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `schema_markup` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_live_streaming`
--

LOCK TABLES `tbl_live_streaming` WRITE;
/*!40000 ALTER TABLE `tbl_live_streaming` DISABLE KEYS */;
INSERT INTO `tbl_live_streaming` VALUES (1,1,'Technology','liveStreaming/dummy-1.jpg','youtube','https://newsweb.wrteam.me','Technology','Technology','Technology','Technology','2026-05-14 08:09:03','2026-05-14 08:09:03'),(2,1,'Science','liveStreaming/dummy-2.jpg','youtube','https://newsweb.wrteam.me','Science','Science','Science','Science','2026-05-14 08:09:03','2026-05-14 08:09:03'),(3,1,'Business','liveStreaming/dummy-3.jpg','youtube','https://newsweb.wrteam.me','Business','Business','Business','Business','2026-05-14 08:09:03','2026-05-14 08:09:03'),(4,1,'Religion','liveStreaming/dummy-4.jpg','youtube','https://newsweb.wrteam.me','Religion','Religion','Religion','Religion','2026-05-14 08:09:03','2026-05-14 08:09:03'),(5,1,'Health','liveStreaming/dummy-5.jpg','youtube','https://newsweb.wrteam.me','Health','Health','Health','Health','2026-05-14 08:09:03','2026-05-14 08:09:03');
/*!40000 ALTER TABLE `tbl_live_streaming` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_location`
--

DROP TABLE IF EXISTS `tbl_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_location` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `location_name` varchar(191) NOT NULL,
  `latitude` varchar(191) NOT NULL,
  `longitude` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_location`
--

LOCK TABLES `tbl_location` WRITE;
/*!40000 ALTER TABLE `tbl_location` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_news`
--

DROP TABLE IF EXISTS `tbl_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_news` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `subcategory_id` int(11) NOT NULL DEFAULT 0,
  `tag_id` text NOT NULL,
  `location_id` int(11) NOT NULL DEFAULT 0,
  `title` text NOT NULL,
  `slug` varchar(191) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `published_date` date DEFAULT NULL,
  `content_type` varchar(50) NOT NULL,
  `content_value` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `summarized_description` varchar(191) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `show_till` date DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1-active, 0-deactive',
  `is_draft` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0-no, 1-yes',
  `is_clone` int(11) NOT NULL DEFAULT 0,
  `is_comment` tinyint(1) NOT NULL DEFAULT 1 COMMENT '0 - Comments disabled, 1 - Comments enabled',
  `counter` int(11) NOT NULL DEFAULT 0,
  `meta_title` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `schema_markup` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_short_news` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0-no, 1-yes',
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`),
  KEY `category_id` (`category_id`),
  KEY `subcategory_id` (`subcategory_id`),
  KEY `location_id` (`location_id`),
  KEY `slug` (`slug`),
  KEY `published_date` (`published_date`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_news`
--

LOCK TABLES `tbl_news` WRITE;
/*!40000 ALTER TABLE `tbl_news` DISABLE KEYS */;
INSERT INTO `tbl_news` VALUES (1,1,1,0,'6,1',0,'How To Enter International Space Station (ISS) Virtually Via Google Maps Street View','how-to-enter-international-space-station-iss-virtually-via-google-maps-street-view','news/dummy-1.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'How To Enter International Space Station (ISS) Virtually Via Google Maps Street View',NULL,0,0,'0000-00-00',1,0,0,1,0,'How To Enter International Space Station (ISS) Virtually Via Google Maps Street View','How To Enter International Space Station (ISS) Virtually Via Google Maps Street View',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(2,1,2,0,'8,6',0,'NASA Invites Media to NOAA’s Advanced Weather Satellite Launch','nasa-invites-media-to-noaa-s-advanced-weather-satellite-launch','news/dummy-2.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'NASA Invites Media to NOAA’s Advanced Weather Satellite Launch',NULL,0,0,'0000-00-00',1,0,0,1,0,'NASA Invites Media to NOAA’s Advanced Weather Satellite Launch','NASA Invites Media to NOAA’s Advanced Weather Satellite Launch',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(3,1,3,0,'7,9',0,'Rise in Spending Through Credit Cards, Debit Cards, UPI Indicate Pick-Up In Consumption: FinMin','rise-in-spending-through-credit-cards-debit-cards-upi-indicate-pick-up-in-consumption-finmin','news/dummy-3.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'Rise in Spending Through Credit Cards, Debit Cards, UPI Indicate Pick-Up In Consumption: FinMin',NULL,0,0,'0000-00-00',1,0,0,1,0,'Rise in Spending Through Credit Cards, Debit Cards, UPI Indicate Pick-Up In Consumption: FinMin','Rise in Spending Through Credit Cards, Debit Cards, UPI Indicate Pick-Up In Consumption: FinMin',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(4,1,4,0,'4,1',0,'Tamil Nadu Woman Becomes First Indian To Get No Caste, No Religion Certificate After 9-Year-Long Battle','tamil-nadu-woman-becomes-first-indian-to-get-no-caste-no-religion-certificate-after-9-year-long-battle','news/dummy-4.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'Tamil Nadu Woman Becomes First Indian To Get No Caste, No Religion Certificate After 9-Year-Long Battle',NULL,0,0,'0000-00-00',1,0,0,1,0,'Tamil Nadu Woman Becomes First Indian To Get No Caste, No Religion Certificate After 9-Year-Long Battle','Tamil Nadu Woman Becomes First Indian To Get No Caste, No Religion Certificate After 9-Year-Long Battle',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(5,1,5,0,'4,3',0,'International Yoga Day 2022: Practising These 8 Limbs of Yoga Can Help You Attain Enlightenment','international-yoga-day-2022-practising-these-8-limbs-of-yoga-can-help-you-attain-enlightenment','news/dummy-5.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'International Yoga Day 2022: Practising These 8 Limbs of Yoga Can Help You Attain Enlightenment',NULL,0,0,'0000-00-00',1,0,0,1,0,'International Yoga Day 2022: Practising These 8 Limbs of Yoga Can Help You Attain Enlightenment','International Yoga Day 2022: Practising These 8 Limbs of Yoga Can Help You Attain Enlightenment',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(6,1,6,0,'8,5',0,'Virat Kohli, Rohit Sharma move up in ICC T20 rankings','virat-kohli-rohit-sharma-move-up-in-icc-t20-rankings','news/dummy-6.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'Virat Kohli, Rohit Sharma move up in ICC T20 rankings',NULL,0,0,'0000-00-00',1,0,0,1,0,'Virat Kohli, Rohit Sharma move up in ICC T20 rankings','Virat Kohli, Rohit Sharma move up in ICC T20 rankings',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(7,1,7,0,'10,1',0,'Modi@8: Scale and Sustainability are the Modi Mantra for India’s Successful Infra Story','modi-8-scale-and-sustainability-are-the-modi-mantra-for-india-s-successful-infra-story','news/dummy-7.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'Modi@8: Scale and Sustainability are the Modi Mantra for India’s Successful Infra Story',NULL,0,0,'0000-00-00',1,0,0,1,0,'Modi@8: Scale and Sustainability are the Modi Mantra for India’s Successful Infra Story','Modi@8: Scale and Sustainability are the Modi Mantra for India’s Successful Infra Story',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(8,1,8,0,'1,5',0,'Sensex, Nifty up amid rising US rate cut hopes; Zomato, Paytm shares gain','sensex-nifty-up-amid-rising-us-rate-cut-hopes-zomato-paytm-shares-gain','news/dummy-8.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'Sensex, Nifty up amid rising US rate cut hopes; Zomato, Paytm shares gain',NULL,0,0,'0000-00-00',1,0,0,1,0,'Sensex, Nifty up amid rising US rate cut hopes; Zomato, Paytm shares gain','Sensex, Nifty up amid rising US rate cut hopes; Zomato, Paytm shares gain',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(9,1,9,0,'4,5',0,'Can India be a global role model for climate-friendly energy growth?','can-india-be-a-global-role-model-for-climate-friendly-energy-growth','news/dummy-9.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'Can India be a global role model for climate-friendly energy growth?',NULL,0,0,'0000-00-00',1,0,0,1,0,'Can India be a global role model for climate-friendly energy growth?','Can India be a global role model for climate-friendly energy growth?',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(10,1,10,0,'3,8',0,'The Impact of 5G Rollout in Rural India','impact-of-5g-rollout-in-rural-india','news/dummy-10.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'The Impact of 5G Rollout in Rural India',NULL,0,0,'0000-00-00',1,0,0,1,0,'The Impact of 5G Rollout in Rural India','The Impact of 5G Rollout in Rural India',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(11,1,1,0,'8,2',0,'How AI is Revolutionizing Indian Agriculture','ai-revolutionizing-indian-agriculture','news/dummy-1.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'How AI is Revolutionizing Indian Agriculture',NULL,0,0,'0000-00-00',1,0,0,1,0,'How AI is Revolutionizing Indian Agriculture','How AI is Revolutionizing Indian Agriculture',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(12,1,2,0,'4,10',0,'The Evolution of Renewable Energy in India','evolution-of-renewable-energy-in-india','news/dummy-2.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'The Evolution of Renewable Energy in India',NULL,0,0,'0000-00-00',1,0,0,1,0,'The Evolution of Renewable Energy in India','The Evolution of Renewable Energy in India',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(13,1,3,0,'9,4',0,'India’s Startup Ecosystem Among World’s Fastest Growing','indias-startup-ecosystem-among-worlds-fastest-growing','news/dummy-3.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'India’s Startup Ecosystem Among World’s Fastest Growing',NULL,0,0,'0000-00-00',1,0,0,1,0,'India’s Startup Ecosystem Among World’s Fastest Growing','India’s Startup Ecosystem Among World’s Fastest Growing',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(14,1,4,0,'9,1',0,'Green Mobility: Electric Vehicles Gain Traction in Indian Cities','green-mobility-electric-vehicles-india','news/dummy-4.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'Green Mobility: Electric Vehicles Gain Traction in Indian Cities',NULL,0,0,'0000-00-00',1,0,0,1,0,'Green Mobility: Electric Vehicles Gain Traction in Indian Cities','Green Mobility: Electric Vehicles Gain Traction in Indian Cities',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(15,1,5,0,'8,1',0,'The Rise of Esports Among India’s Youth','rise-of-esports-among-indians-youth','news/dummy-5.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'The Rise of Esports Among India’s Youth',NULL,0,0,'0000-00-00',1,0,0,1,0,'The Rise of Esports Among India’s Youth','The Rise of Esports Among India’s Youth',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(16,1,6,0,'7,4',0,'Remote Work: Changing the Urban Landscape in India','remote-work-changing-urban-landscape-india','news/dummy-6.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'Remote Work: Changing the Urban Landscape in India',NULL,0,0,'0000-00-00',1,0,0,1,0,'Remote Work: Changing the Urban Landscape in India','Remote Work: Changing the Urban Landscape in India',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(17,1,7,0,'8,2',0,'Water Conservation Efforts Bear Fruit in Maharashtra','water-conservation-efforts-maharashtra','news/dummy-7.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'Water Conservation Efforts Bear Fruit in Maharashtra',NULL,0,0,'0000-00-00',1,0,0,1,0,'Water Conservation Efforts Bear Fruit in Maharashtra','Water Conservation Efforts Bear Fruit in Maharashtra',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(18,1,8,0,'6,4',0,'Yoga and Mindfulness Practices Bring Calm to Busy Lives','yoga-mindfulness-practices-bring-calm','news/dummy-8.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'Yoga and Mindfulness Practices Bring Calm to Busy Lives',NULL,0,0,'0000-00-00',1,0,0,1,0,'Yoga and Mindfulness Practices Bring Calm to Busy Lives','Yoga and Mindfulness Practices Bring Calm to Busy Lives',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0),(19,1,9,0,'9,1',0,'Indian Cinema Goes Global: A New Wave of Film Exports','indian-cinema-goes-global','news/dummy-9.jpg','2026-05-14 13:39:03','2026-05-14','standard_post',NULL,'Indian Cinema Goes Global: A New Wave of Film Exports',NULL,0,0,'0000-00-00',1,0,0,1,0,'Indian Cinema Goes Global: A New Wave of Film Exports','Indian Cinema Goes Global: A New Wave of Film Exports',NULL,NULL,'2026-05-14 08:09:03','2026-05-14 08:09:03',0);
/*!40000 ALTER TABLE `tbl_news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_news_image`
--

DROP TABLE IF EXISTS `tbl_news_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_news_image` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `news_id` int(11) NOT NULL,
  `other_image` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `news_id` (`news_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_news_image`
--

LOCK TABLES `tbl_news_image` WRITE;
/*!40000 ALTER TABLE `tbl_news_image` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_news_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_news_like`
--

DROP TABLE IF EXISTS `tbl_news_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_news_like` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '1-like, 2-dislike, 0-none',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `news_id` (`news_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_news_like`
--

LOCK TABLES `tbl_news_like` WRITE;
/*!40000 ALTER TABLE `tbl_news_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_news_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_news_view`
--

DROP TABLE IF EXISTS `tbl_news_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_news_view` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `news_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `news_id` (`news_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_news_view`
--

LOCK TABLES `tbl_news_view` WRITE;
/*!40000 ALTER TABLE `tbl_news_view` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_news_view` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_notifications`
--

DROP TABLE IF EXISTS `tbl_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_notifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `category_id` int(11) NOT NULL DEFAULT 0,
  `subcategory_id` int(11) NOT NULL DEFAULT 0,
  `news_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL DEFAULT 0,
  `title` varchar(191) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `type` varchar(12) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `category_preference` tinyint(1) NOT NULL DEFAULT 0,
  `date_sent` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`),
  KEY `category_id` (`category_id`),
  KEY `subcategory_id` (`subcategory_id`),
  KEY `location_id` (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_notifications`
--

LOCK TABLES `tbl_notifications` WRITE;
/*!40000 ALTER TABLE `tbl_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_pages`
--

DROP TABLE IF EXISTS `tbl_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_pages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL,
  `title` varchar(500) NOT NULL,
  `page_type` varchar(50) NOT NULL,
  `slug` varchar(500) NOT NULL,
  `page_content` mediumtext DEFAULT NULL,
  `page_icon` varchar(191) DEFAULT NULL,
  `og_image` varchar(191) DEFAULT NULL,
  `schema_markup` text DEFAULT NULL,
  `meta_title` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `is_custom` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0-default, 1-custom',
  `is_termspolicy` tinyint(4) NOT NULL DEFAULT 0,
  `is_privacypolicy` tinyint(4) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0-deactive, 1-active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_pages`
--

LOCK TABLES `tbl_pages` WRITE;
/*!40000 ALTER TABLE `tbl_pages` DISABLE KEYS */;
INSERT INTO `tbl_pages` VALUES (1,1,'Privacy Policy','privacy-policy','privacy-policy','<p style=\"text-align: left;\">NEWS APP &amp; CONTENT POLICY</p>','','','','','Privacy Policy','Policy',0,0,1,1,'2026-05-14 08:08:47','2026-05-14 08:08:47'),(2,1,'Terms & Conditions','terms-condition','terms-condition','<p style=\"text-align: left;\"><strong>1. Terms Conditions</strong></p>','','','','','Terms & Conditions','Terms',0,1,0,1,'2026-05-14 08:08:47','2026-05-14 08:08:47'),(3,1,'Contact Us','contact-us','contact-us','<p style=\"text-align: center;\"><strong>How can we help you?</strong></p>','','','','','Contact Us','Contact',0,0,0,1,'2026-05-14 08:08:47','2026-05-14 08:08:47'),(4,1,'About Us','about-us','about-us','<p><strong>About Us:</strong></p>','','','','','About Us','About',0,0,0,1,'2026-05-14 08:08:47','2026-05-14 08:08:47');
/*!40000 ALTER TABLE `tbl_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_rss`
--

DROP TABLE IF EXISTS `tbl_rss`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_rss` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `subcategory_id` int(11) NOT NULL DEFAULT 0,
  `tag_id` varchar(191) NOT NULL,
  `feed_name` varchar(191) NOT NULL,
  `feed_url` varchar(191) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1-active, 0-deactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_fetched_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`),
  KEY `category_id` (`category_id`),
  KEY `subcategory_id` (`subcategory_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_rss`
--

LOCK TABLES `tbl_rss` WRITE;
/*!40000 ALTER TABLE `tbl_rss` DISABLE KEYS */;
INSERT INTO `tbl_rss` VALUES (1,1,1,0,'1','Technology','https://newsweb.wrteam.me',1,'2026-05-14 08:09:03','2026-05-14 08:09:03',NULL),(2,1,2,0,'2','Science','https://newsweb.wrteam.me',1,'2026-05-14 08:09:03','2026-05-14 08:09:03',NULL),(3,1,3,0,'3','Business','https://newsweb.wrteam.me',1,'2026-05-14 08:09:03','2026-05-14 08:09:03',NULL),(4,1,4,0,'4','Religion','https://newsweb.wrteam.me',1,'2026-05-14 08:09:03','2026-05-14 08:09:03',NULL),(5,1,5,0,'5','Health','https://newsweb.wrteam.me',1,'2026-05-14 08:09:03','2026-05-14 08:09:03',NULL);
/*!40000 ALTER TABLE `tbl_rss` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_settings`
--

DROP TABLE IF EXISTS `tbl_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_settings`
--

LOCK TABLES `tbl_settings` WRITE;
/*!40000 ALTER TABLE `tbl_settings` DISABLE KEYS */;
INSERT INTO `tbl_settings` VALUES (1,'rss_feed_mode','1','2026-05-14 08:08:41','2026-05-14 08:08:41'),(2,'mobile_login_mode','0','2026-05-14 08:08:41','2026-05-14 08:08:41'),(3,'country_code','IN','2026-05-14 08:08:41','2026-05-14 08:08:41'),(4,'shareapp_text','You can find our app from below url','2026-05-14 08:08:41','2026-05-14 08:08:41'),(5,'appstore_app_id','','2026-05-14 08:08:41','2026-05-14 08:08:41'),(6,'association_file','','2026-05-14 08:08:41','2026-05-14 08:08:41'),(7,'assetlinks_file','','2026-05-14 08:08:41','2026-05-14 08:08:41'),(8,'views_auth_mode','1','2026-05-14 08:08:41','2026-05-14 08:08:41'),(9,'video_type_preference','normal_style','2026-05-14 08:08:41','2026-05-14 08:08:41'),(10,'app_version','3.2.8',NULL,NULL),(11,'default_language','1',NULL,NULL),(12,'system_timezone','Asia/Kolkata',NULL,NULL),(13,'app_name','Deeprab Media',NULL,NULL),(14,'primary_color','#000000',NULL,NULL),(15,'secondary_color','#ba2028',NULL,NULL),(16,'auto_delete_expire_news_mode','0',NULL,NULL),(17,'app_logo_full','panel/logo.png',NULL,NULL),(18,'app_logo','panel/favicon.png',NULL,NULL),(19,'smtp_host','smtp.googlemail.com',NULL,NULL),(20,'smtp_user','SMTP User',NULL,NULL),(21,'smtp_password','SMTP Password',NULL,NULL),(22,'smtp_port','465',NULL,NULL),(23,'smtp_crypto','tls',NULL,NULL),(24,'from_name','Deeprab Media',NULL,NULL),(25,'category_mode','1',NULL,NULL),(26,'subcategory_mode','1',NULL,NULL),(27,'breaking_news_mode','1',NULL,NULL),(28,'live_streaming_mode','1',NULL,NULL),(29,'comments_mode','1',NULL,NULL),(30,'weather_mode','0',NULL,NULL),(31,'location_news_mode','0',NULL,NULL),(32,'nearest_location_measure','1000',NULL,NULL),(33,'maintenance_mode','0',NULL,NULL),(34,'in_app_ads_mode','0',NULL,NULL),(35,'ads_type','1',NULL,NULL),(36,'google_rewarded_video_id','google Rewarded Video Id',NULL,NULL),(37,'google_interstitial_id','google Interstitial Id',NULL,NULL),(38,'google_banner_id','google Banner Id',NULL,NULL),(39,'google_native_unit_id','google Native Unit Id',NULL,NULL),(40,'unity_rewarded_video_id','1',NULL,NULL),(41,'unity_interstitial_id','1',NULL,NULL),(42,'unity_banner_id','1',NULL,NULL),(43,'android_game_id','1',NULL,NULL),(44,'ios_in_app_ads_mode','0',NULL,NULL),(45,'ios_ads_type','1',NULL,NULL),(46,'ios_google_rewarded_video_id','google Rewarded Video Id',NULL,NULL),(47,'ios_google_interstitial_id','google Interstitial Id',NULL,NULL),(48,'ios_google_banner_id','google Banner Id',NULL,NULL),(49,'ios_google_native_unit_id','google Native Unit Id',NULL,NULL),(50,'ios_unity_rewarded_video_id','1',NULL,NULL),(51,'ios_unity_interstitial_id','1',NULL,NULL),(52,'ios_unity_banner_id','1',NULL,NULL),(53,'ios_game_id','1',NULL,NULL),(54,'force_update_app_mode','0',NULL,NULL),(55,'android_app_version','1.0.0',NULL,NULL),(56,'ios_app_version','1.0.0',NULL,NULL),(57,'google_gemini_api_key','',NULL,NULL),(58,'google_app_open_unit_id','google App Open Unit Id',NULL,NULL),(59,'ios_google_app_open_unit_id','google App Open Unit Id',NULL,NULL);
/*!40000 ALTER TABLE `tbl_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_social_media`
--

DROP TABLE IF EXISTS `tbl_social_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_social_media` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `image` char(191) NOT NULL,
  `link` char(191) NOT NULL,
  `row_order` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_social_media`
--

LOCK TABLES `tbl_social_media` WRITE;
/*!40000 ALTER TABLE `tbl_social_media` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_social_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_subcategory`
--

DROP TABLE IF EXISTS `tbl_subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_subcategory` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `subcategory_name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `row_order` int(11) NOT NULL DEFAULT 0,
  `image` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`),
  KEY `category_id` (`category_id`),
  KEY `slug` (`slug`),
  KEY `row_order` (`row_order`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_subcategory`
--

LOCK TABLES `tbl_subcategory` WRITE;
/*!40000 ALTER TABLE `tbl_subcategory` DISABLE KEYS */;
INSERT INTO `tbl_subcategory` VALUES (1,1,1,'Technology','technology',0,'','2026-05-14 08:09:03','2026-05-14 08:09:03'),(2,1,2,'Science','science',0,'','2026-05-14 08:09:03','2026-05-14 08:09:03'),(3,1,3,'Business','business',0,'','2026-05-14 08:09:03','2026-05-14 08:09:03'),(4,1,4,'Religion','religion',0,'','2026-05-14 08:09:03','2026-05-14 08:09:03'),(5,1,5,'Health','health',0,'','2026-05-14 08:09:03','2026-05-14 08:09:03'),(6,1,6,'Entertainment','entertainment',0,'','2026-05-14 08:09:03','2026-05-14 08:09:03'),(7,1,7,'Sports','sports',0,'','2026-05-14 08:09:03','2026-05-14 08:09:03'),(8,1,8,'Politics','politics',0,'','2026-05-14 08:09:03','2026-05-14 08:09:03'),(9,1,9,'Education','education',0,'','2026-05-14 08:09:03','2026-05-14 08:09:03'),(10,1,10,'Top News','top-news',0,'','2026-05-14 08:09:03','2026-05-14 08:09:03');
/*!40000 ALTER TABLE `tbl_subcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_survey_option`
--

DROP TABLE IF EXISTS `tbl_survey_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_survey_option` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `options` text NOT NULL,
  `counter` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_survey_option`
--

LOCK TABLES `tbl_survey_option` WRITE;
/*!40000 ALTER TABLE `tbl_survey_option` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_survey_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_survey_question`
--

DROP TABLE IF EXISTS `tbl_survey_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_survey_question` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_survey_question`
--

LOCK TABLES `tbl_survey_question` WRITE;
/*!40000 ALTER TABLE `tbl_survey_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_survey_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_survey_result`
--

DROP TABLE IF EXISTS `tbl_survey_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_survey_result` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `option_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `option_id` (`option_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_survey_result`
--

LOCK TABLES `tbl_survey_result` WRITE;
/*!40000 ALTER TABLE `tbl_survey_result` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_survey_result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_tag`
--

DROP TABLE IF EXISTS `tbl_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_tag` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL,
  `tag_name` varchar(100) DEFAULT NULL,
  `slug` varchar(191) NOT NULL,
  `meta_title` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `schema_markup` text DEFAULT NULL,
  `og_image` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`),
  KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_tag`
--

LOCK TABLES `tbl_tag` WRITE;
/*!40000 ALTER TABLE `tbl_tag` DISABLE KEYS */;
INSERT INTO `tbl_tag` VALUES (1,1,'Technology','technology','Technology','Technology','Technology','Technology','tag_og_image/dummy-1.jpg','2026-05-14 08:09:03','2026-05-14 08:09:03'),(2,1,'Science','science','Science','Science','Science','Science','tag_og_image/dummy-2.jpg','2026-05-14 08:09:03','2026-05-14 08:09:03'),(3,1,'Business','business','Business','Business','Business','Business','tag_og_image/dummy-3.jpg','2026-05-14 08:09:03','2026-05-14 08:09:03'),(4,1,'Religion','religion','Religion','Religion','Religion','Religion','tag_og_image/dummy-4.jpg','2026-05-14 08:09:03','2026-05-14 08:09:03'),(5,1,'Health','health','Health','Health','Health','Health','tag_og_image/dummy-5.jpg','2026-05-14 08:09:03','2026-05-14 08:09:03'),(6,1,'Entertainment','entertainment','Entertainment','Entertainment','Entertainment','Entertainment','tag_og_image/dummy-6.jpg','2026-05-14 08:09:03','2026-05-14 08:09:03'),(7,1,'Sports','sports','Sports','Sports','Sports','Sports','tag_og_image/dummy-7.jpg','2026-05-14 08:09:03','2026-05-14 08:09:03'),(8,1,'Politics','politics','Politics','Politics','Politics','Politics','tag_og_image/dummy-8.jpg','2026-05-14 08:09:03','2026-05-14 08:09:03'),(9,1,'Education','education','Education','Education','Education','Education','tag_og_image/dummy-9.jpg','2026-05-14 08:09:03','2026-05-14 08:09:03'),(10,1,'Top News','top-news','Top News','Top News','Top News','Top News','tag_og_image/dummy-10.jpg','2026-05-14 08:09:03','2026-05-14 08:09:03');
/*!40000 ALTER TABLE `tbl_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_token`
--

DROP TABLE IF EXISTS `tbl_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_token` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `token` text NOT NULL,
  `language_id` int(11) DEFAULT NULL,
  `latitude` varchar(191) DEFAULT NULL,
  `longitude` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tbl_token_user_id_index` (`user_id`),
  CONSTRAINT `tbl_token_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_token`
--

LOCK TABLES `tbl_token` WRITE;
/*!40000 ALTER TABLE `tbl_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_roles`
--

DROP TABLE IF EXISTS `tbl_user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_user_roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_roles`
--

LOCK TABLES `tbl_user_roles` WRITE;
/*!40000 ALTER TABLE `tbl_user_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_users`
--

DROP TABLE IF EXISTS `tbl_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `firebase_id` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `profile` text DEFAULT NULL,
  `fcm_id` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1-active, 0-deactive',
  `date` datetime NOT NULL,
  `is_author` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0-no, 1-yes',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_users`
--

LOCK TABLES `tbl_users` WRITE;
/*!40000 ALTER TABLE `tbl_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_users_category`
--

DROP TABLE IF EXISTS `tbl_users_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_users_category` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `category_id` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_users_category`
--

LOCK TABLES `tbl_users_category` WRITE;
/*!40000 ALTER TABLE `tbl_users_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_users_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_web_seo_pages`
--

DROP TABLE IF EXISTS `tbl_web_seo_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_web_seo_pages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int(11) DEFAULT NULL,
  `page_type` varchar(50) NOT NULL,
  `og_image` varchar(191) NOT NULL,
  `meta_title` varchar(191) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `schema_markup` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `page_type` (`page_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_web_seo_pages`
--

LOCK TABLES `tbl_web_seo_pages` WRITE;
/*!40000 ALTER TABLE `tbl_web_seo_pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_web_seo_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_web_settings`
--

DROP TABLE IF EXISTS `tbl_web_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_web_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(191) DEFAULT NULL,
  `message` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_web_settings`
--

LOCK TABLES `tbl_web_settings` WRITE;
/*!40000 ALTER TABLE `tbl_web_settings` DISABLE KEYS */;
INSERT INTO `tbl_web_settings` VALUES (1,'web_name','Deeprab Media','2026-05-14 08:08:41','2026-05-14 08:08:41'),(2,'light_body_color','#f5f5f5','2026-05-14 08:08:41','2026-05-14 08:08:41'),(3,'light_hover_color','#122342','2026-05-14 08:08:41','2026-05-14 08:08:41'),(4,'light_primary_color','#ee2934','2026-05-14 08:08:41','2026-05-14 08:08:41'),(5,'light_secondary_color','#1a2e51','2026-05-14 08:08:41','2026-05-14 08:08:41'),(6,'light_text_primary_color','#0f1f40','2026-05-14 08:08:41','2026-05-14 08:08:41'),(7,'light_text_secondary_color','#65686d','2026-05-14 08:08:41','2026-05-14 08:08:41'),(8,'light_header_logo','logos/deeprab-logo.svg','2026-05-14 08:08:41','2026-05-14 08:08:41'),(9,'light_footer_logo','logos/deeprab-logo.svg','2026-05-14 08:08:41','2026-05-14 08:08:41'),(10,'light_placeholder_image','logos/placeholder.png','2026-05-14 08:08:41','2026-05-14 08:08:41'),(11,'dark_body_color','#0a1935','2026-05-14 08:08:41','2026-05-14 08:08:41'),(12,'dark_hover_color','#15346d','2026-05-14 08:08:41','2026-05-14 08:08:41'),(13,'dark_primary_color','#ce2b2b','2026-05-14 08:08:41','2026-05-14 08:08:41'),(14,'dark_secondary_color','#122342','2026-05-14 08:08:41','2026-05-14 08:08:41'),(15,'dark_text_primary_color','#ffffff','2026-05-14 08:08:41','2026-05-14 08:08:41'),(16,'dark_text_secondary_color','#98a2b3','2026-05-14 08:08:41','2026-05-14 08:08:41'),(17,'dark_header_logo','logos/deeprab-logo-dark.svg','2026-05-14 08:08:41','2026-05-14 08:08:41'),(18,'dark_footer_logo','logos/deeprab-logo-dark.svg','2026-05-14 08:08:41','2026-05-14 08:08:41'),(19,'dark_placeholder_image','logos/placeholder-dark.png','2026-05-14 08:08:41','2026-05-14 08:08:41'),(20,'favicon_icon','logos/favicon-icon.png','2026-05-14 08:08:41','2026-05-14 08:08:41'),(21,'web_footer_description','News Web website is an online platform that provides news and information about various topics, including current events, entertainment, politics, sports, technology, and more.','2026-05-14 08:08:41','2026-05-14 08:08:41'),(22,'google_adsense','','2026-05-14 08:08:41','2026-05-14 08:08:41'),(23,'android_app_link','','2026-05-14 08:08:41','2026-05-14 08:08:41'),(24,'ios_app_link','','2026-05-14 08:08:41','2026-05-14 08:08:41'),(25,'accept_cookie','0','2026-05-14 08:08:41','2026-05-14 08:08:41');
/*!40000 ALTER TABLE `tbl_web_settings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-19  2:31:51
