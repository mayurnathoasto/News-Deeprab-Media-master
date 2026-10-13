//Please add your admin panel url here and make sure you do not add '/' at the end of the url

const String baseUrl = "http://192.168.1.2/work_latest1/news/Admin_Panel_PHP_Code_3.2.8/code/public";

const String databaseUrl = "$baseUrl/api/"; //Do not change

const String shareNavigationWebUrl = "your_web_url";

const int limitOfSectionsData = 5;

const int limitOfAPIData = 10;
const int limitOfStyle1 = 3;
const int limitOfAllOtherStyle = 20;

//Facebook Login enable/disable
const bool fblogInEnabled = false;

//set value for survey show after news data
const int surveyShow = 4;

//set value for native ads show after news data
const int nativeAdsIndex = 3;

//set value for interstitial ads show after news data
const int interstitialAdsIndex = 2;

//set value for reward ads show after news data
const int rewardAdsIndex = 4;

const String appName = 'News App';

enum VideoViewType { normal, page }

enum ContentType { youtube, uploaded, live }

enum AuthorStatus { approved, pending, rejected }

enum AuthorLayoutType { list, grid }

const String appVersion = '3.2.8';
const String flutterSdk = '3.41.4';
