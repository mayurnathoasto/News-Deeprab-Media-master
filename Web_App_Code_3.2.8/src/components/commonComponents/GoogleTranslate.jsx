'use client';
import { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Define the init function for Google Translate
    window.googleTranslateElementInit = function () {
      try {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'auto',
              includedLanguages: 'en,hi,gu,mr,bn,pa,ta,te,kn,ml,ur,es,fr,de,ar',
              autoDisplay: false,
            },
            'google_translate_element'
          );

          // Once initialized, check if we need to apply default language or saved language
          setTimeout(() => {
            const savedLang = localStorage.getItem('selected_website_language') || 'en';
            applyTranslation(savedLang);
          }, 300);
        }
      } catch (err) {
        console.error('Google Translate init error:', err);
      }
    };

    // Helper to apply translation to combo
    window.applyGoogleTranslateCode = function (targetCode) {
      applyTranslation(targetCode);
    };

    function applyTranslation(targetCode) {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        if (select.value !== targetCode) {
          select.value = targetCode;
          select.dispatchEvent(new Event('change'));
        }
      } else {
        // Retry a few times if combo is still rendering
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          const combo = document.querySelector('.goog-te-combo');
          if (combo) {
            combo.value = targetCode;
            combo.dispatchEvent(new Event('change'));
            clearInterval(interval);
          } else if (attempts > 20) {
            clearInterval(interval);
          }
        }, 150);
      }
    }

    // Set cookie on startup so Google Translate loads with target language
    const currentLang = localStorage.getItem('selected_website_language') || 'en';
    const hostname = window.location.hostname;
    document.cookie = `googtrans=/auto/${currentLang}; path=/;`;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      document.cookie = `googtrans=/auto/${currentLang}; path=/; domain=.${hostname};`;
    }

    // Inject Google Translate script if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
