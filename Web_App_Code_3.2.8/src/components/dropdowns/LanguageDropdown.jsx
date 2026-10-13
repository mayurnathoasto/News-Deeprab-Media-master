'use client'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  currentLanguageLabelSelector,
  currentLanguageSelector,
  languagesListSelector,
  setCurrentLanguageLabelData,
  setLanguageChangeData,
  setLanguagesListData
} from '../store/reducers/languageReducer';
import { getLanguageJsonDataApi, getLanguagesApi, registertokenApi } from '@/utils/api/api';
import { settingsSelector } from '../store/reducers/settingsReducer';
import moment from 'moment';
import { isManualRefresh, setCateOffset } from '@/utils/helpers';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useRouter } from 'next/router';
import { isLangChangeState } from '../store/reducers/helperReducer';
import { userDataSelector } from '../store/reducers/userReducer';
import { FiGlobe, FiCheck } from 'react-icons/fi';

const POPULAR_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

const LanguageDropdown = ({ mobileNav, onClose = () => { }, setMorePagesOffset = () => {}, setIsLoadMorePages = () => {} }) => {
  const router = useRouter();

  const settingsData = useSelector(settingsSelector);
  const currentLanguage = useSelector(currentLanguageSelector);
  const languagesList = useSelector(languagesListSelector);
  const currentLanguageLabelsData = useSelector(currentLanguageLabelSelector);
  const userData = useSelector(userDataSelector);

  const [selectedCode, setSelectedCode] = useState('en');

  const languagesLabelDiffInMinutes = currentLanguageLabelsData?.lastFetch
    ? moment().diff(moment(currentLanguageLabelsData?.lastFetch), 'minutes')
    : (Number(process.env.NEXT_PUBLIC_LOAD_MIN) || 10) + 1;

  const storedLatitude = settingsData?.lat;
  const storedLongitude = settingsData?.long;

  // Apply Google Translate DOM translation to the entire website
  const applyGoogleTranslation = (targetCode) => {
    if (typeof window === 'undefined') return;
    try {
      const hostname = window.location.hostname;
      const isDefault = targetCode === 'en';

      if (isDefault) {
        document.cookie = `googtrans=; path=/; domain=${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `googtrans=/auto/en; path=/; domain=${hostname};`;
        document.cookie = `googtrans=/auto/en; path=/;`;
      } else {
        document.cookie = `googtrans=/auto/${targetCode}; path=/; domain=${hostname};`;
        document.cookie = `googtrans=/auto/${targetCode}; path=/;`;
        document.cookie = `googtrans=/en/${targetCode}; path=/; domain=${hostname};`;
        document.cookie = `googtrans=/en/${targetCode}; path=/;`;
      }

      localStorage.setItem('selected_website_language', targetCode);
      setSelectedCode(targetCode);

      const triggerSelect = () => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = targetCode;
          select.dispatchEvent(new Event('change'));
          return true;
        }
        return false;
      };

      if (!triggerSelect()) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (triggerSelect() || attempts > 15) {
            clearInterval(interval);
          }
        }, 200);
      }
    } catch (err) {
      console.error('Translation trigger error:', err);
    }
  };

  const fetchLanguages = async () => {
    try {
      const { data } = await getLanguagesApi.getLanguages();
      const languageList = data?.data?.data;
      if (Array.isArray(languageList) && languageList.length > 0) {
        setLanguagesListData({ data: languageList });

        if (currentLanguage?.code == null) {
          const defaultLang = languageList.find(
            (item) => item?.code === settingsData?.data?.default_language?.code
          );
          if (defaultLang) {
            setLanguageChangeData(defaultLang.language, defaultLang.code, defaultLang.id, defaultLang.display_name);
          }
        }
      }
    } catch (error) {
      console.error('fetchLanguages Error:', error);
    }
  };

  const fetchLanguagesJsonData = async (code) => {
    try {
      const response = await getLanguageJsonDataApi.getLanguageJsonData({
        language_code: code,
        platform_type: 'web'
      });
      const data = response.data?.data;
      if (data) {
        setCurrentLanguageLabelData(data, Date.now());
      }
    } catch (error) {
      console.error('fetchLanguagesJsonData Error:', error);
    }
  };

  const registerToken = async (fcmId, userId) => {
    if (fcmId) {
      try {
        await registertokenApi.registertoken({
          language_code: currentLanguage?.code,
          token: fcmId,
          latitude: storedLatitude,
          longitude: storedLongitude,
          user_id: userId
        });
      } catch (error) {
        console.error('registerFcmTokenApi Error :', error);
      }
    }
  };

  const languageChange = async (name, code, id, display_name) => {
    fetchLanguagesJsonData(code);
    setLanguageChangeData(name, code, id, display_name);
    onClose();
    if (settingsData?.fcmtoken) {
      registerToken(settingsData?.fcmtoken, userData?.data?.id);
    }
  };

  // Restore previous language on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('selected_website_language');
      if (savedLang) {
        setSelectedCode(savedLang);
        if (savedLang !== 'en') {
          setTimeout(() => applyGoogleTranslation(savedLang), 600);
        }
      } else if (currentLanguage?.code) {
        setSelectedCode(currentLanguage.code);
      }
    }
  }, []);

  useEffect(() => {
    if (settingsData) {
      fetchLanguages();
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (
      settingsData?.data?.default_language?.code &&
      ((languagesList?.length < 2 && languagesLabelDiffInMinutes) || isManualRefresh())
    ) {
      fetchLanguagesJsonData(settingsData.data.default_language.code);
      setLanguageChangeData(
        settingsData.data.default_language.language,
        settingsData.data.default_language.code,
        settingsData.data.default_language.id,
        settingsData.data.default_language.display_name
      );
    }
  }, [settingsData]);

  // Combine backend languages with standard multi-language list
  const combinedLanguages = React.useMemo(() => {
    const map = new Map();
    POPULAR_LANGUAGES.forEach((l) => map.set(l.code, { ...l }));

    if (Array.isArray(languagesList)) {
      languagesList.forEach((item) => {
        if (!item?.code) return;
        const existing = map.get(item.code) || {};
        map.set(item.code, {
          ...existing,
          code: item.code,
          name: item.language || existing.name || item.code,
          nativeName: item.display_name || existing.nativeName || item.language,
          id: item.id
        });
      });
    }

    return Array.from(map.values());
  }, [languagesList]);

  const handleSelectLanguage = (e, lang) => {
    e?.preventDefault();
    setSelectedCode(lang.code);

    // 1. Trigger full-page Google Translate translation
    applyGoogleTranslation(lang.code);

    // 2. If this language exists in backend DB, switch route & Redux state
    const backendMatch = Array.isArray(languagesList)
      ? languagesList.find((l) => l.code === lang.code)
      : null;

    if (backendMatch) {
      languageChange(
        backendMatch.language,
        backendMatch.code,
        backendMatch.id,
        backendMatch.display_name || lang.nativeName
      );
      router.replace(`/${backendMatch.code}`);
    } else {
      onClose();
    }

    setCateOffset(0);
    setMorePagesOffset(0);
    setIsLoadMorePages(false);
    isLangChangeState({ change: true });
    setTimeout(() => {
      isLangChangeState({ change: false });
    }, 1000);
  };

  const activeLang = combinedLanguages.find((l) => l.code === selectedCode) ||
    combinedLanguages.find((l) => l.code === currentLanguage?.code) ||
    combinedLanguages[0];

  const currentLabel = activeLang?.nativeName || activeLang?.name || currentLanguage?.displayName || currentLanguage?.name || 'English';

  return (
    <NavigationMenu className={`relative ${mobileNav ? '!z-[10]' : '!z-[1000]'}`}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='py-[4px] px-[10px] rounded-[6px] h-auto dropdownTrigg font-[600] text-xs uppercase bg-white dark:bg-[#1e293b] text-black dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
            <FiGlobe className='text-sm text-red-600 dark:text-red-400 shrink-0' aria-hidden="true" />
            <span>{currentLabel}</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className='w-[230px] bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-gray-200/80 dark:border-gray-700/80 p-2 z-[1001]'>
            <div className='flex items-center justify-between text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 px-3 py-1.5 tracking-wider border-b border-gray-100 dark:border-gray-700/60 mb-1.5'>
              <span>Select Language</span>
              <span className='text-[10px] font-medium lowercase text-gray-400'>({combinedLanguages.length})</span>
            </div>
            <div className='flex flex-col gap-1 max-h-[280px] overflow-y-auto pr-1 customScrollBar'>
              {combinedLanguages.map((lang) => {
                const isSelected = selectedCode === lang.code;
                return (
                  <NavigationMenuLink
                    key={lang.code}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all text-xs ${
                      isSelected
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold border border-red-100 dark:border-red-900/40 shadow-xs'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/80 font-medium'
                    }`}
                    onClick={(e) => handleSelectLanguage(e, lang)}
                  >
                    <div className='flex items-center gap-2'>
                      <span className='font-semibold'>{lang.nativeName}</span>
                      {lang.nativeName !== lang.name && (
                        <span className='text-[10px] text-gray-400 dark:text-gray-400'>({lang.name})</span>
                      )}
                    </div>
                    {isSelected && <FiCheck className='text-red-600 dark:text-red-400 text-xs shrink-0' />}
                  </NavigationMenuLink>
                );
              })}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default LanguageDropdown;
