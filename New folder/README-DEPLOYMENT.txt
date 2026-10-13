======================================================================
         NEWS DEEPRAB MEDIA - COMPLETE UPDATE DEPLOYMENT GUIDE
======================================================================

Yeh package aapke sabhi latest updates ke sath ready-to-upload hai:
1. Infinite Article Reading (Next article auto-loads at end of article)
2. Post Scheduling (Future date & exact time publish for editors)
3. Full Website Language Selector (Hindi, English, Gujarati, Marathi, Urdu, etc.)
4. Automatic WebP Image Compression
5. Automatic Breaking News Push Notifications
6. Live Market Ticker in Header
7. Newsletter and Social Media Icons in Footer

----------------------------------------------------------------------
DATABASE CHANGES / SQL:
----------------------------------------------------------------------
NO DATABASE CHANGES REQUIRED!
Aapko database me koi bhi change ya migration run karne ki jarurat nahi hai.
Existing 'tbl_news' table me 'date' (DATETIME) aur 'published_date' (DATE) 
columns pehle se maujood hain, isliye yeh automatically bina kisi SQL query 
ke seedhe kaam karega.

----------------------------------------------------------------------
HOW TO UPLOAD TO CPANEL / SERVER:
----------------------------------------------------------------------

TARIKA 1: (Easiest - Individual Zip Files)
  A. FRONTEND:
     - 'website-static.zip' ko apne cPanel me 'public_html' (ya jahan static 
       frontend website hosted hai) me upload karein aur Extract karein.
  
  B. BACKEND (Laravel Admin Panel):
     - 'backend-all-updates.zip' ko apne Laravel backend ke root folder me 
       upload karein aur Extract karein. Files automatically sahi folders 
       (app/, public/, resources/) me replace ho jayengi.

TARIKA 2: (Using Folders Inside This Package)
  A. 'Frontend_Static_Website/' folder ke andar ki sabhi files aur folders ko
     apne static website ke public_html me daal dein.
  
  B. 'Backend_Laravel_Updates/' folder ke andar ki files (app, public, resources)
     ko apne Laravel project root me copy/replace kar dein.

----------------------------------------------------------------------
FILES MODIFIED IN BACKEND:
----------------------------------------------------------------------
- app/Http/Controllers/NewsController.php
- app/Http/Controllers/Api/NewsApiController.php
- app/Http/Controllers/BreakingNewsController.php
- app/Http/Controllers/HomeController.php
- app/Http/Controllers/WebStoryController.php
- app/Services/FeaturedSectionService.php
- app/helper.php
- public/assets/custom/js/actionEvents.js
- resources/views/breaking-news.blade.php
- resources/views/news.blade.php

======================================================================
