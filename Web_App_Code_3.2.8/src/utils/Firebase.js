'use client'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import firebase from "firebase/compat/app"
import { getAuth } from "firebase/auth";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { loadFcmToken } from '@/components/store/reducers/settingsReducer';
import { checkNotificationPermission, notificationRequestSelector } from '@/components/store/reducers/CheckPermissionsReducer';
import { useEffect } from 'react';

const hasRealValue = (value) => {
  return typeof value === 'string' && value.trim() !== '' && !value.includes('enter_here');
}

const isValidBase64Url = (value) => {
  return hasRealValue(value) && /^[A-Za-z0-9_-]+={0,2}$/.test(value);
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY || 'placeholder-api-key',
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || 'placeholder-auth-domain',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || 'placeholder-project-id',
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'placeholder-storage-bucket',
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || 'placeholder-messaging-sender-id',
  appId: process.env.NEXT_PUBLIC_APP_ID || 'placeholder-app-id',
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID || 'placeholder-measurement-id'
}

const firebaseConfigured = [
  process.env.NEXT_PUBLIC_API_KEY,
  process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  process.env.NEXT_PUBLIC_PROJECT_ID,
  process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  process.env.NEXT_PUBLIC_APP_ID,
].every(hasRealValue);

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const FirebaseData = () => {

  const dispatch = useDispatch()

  const notificationPermission = useSelector(notificationRequestSelector);

  const authentication = getAuth(firebaseApp);

  const messagingInstance = async () => {
    if (!firebaseConfigured || !isValidBase64Url(process.env.NEXT_PUBLIC_VAPID_KEY)) {
      return null;
    }

    try {
      const isSupportedBrowser = await isSupported();
      if (isSupportedBrowser) {
        return getMessaging(firebaseApp);
      }
    } catch (err) {
      console.error('Error checking messaging support:', err);
      return null;
    }
  };
  const fetchToken = async (setTokenFound = () => { }, setFcmToken = () => { }) => {
    const messaging = await messagingInstance();
    if (!messaging) {
      setTokenFound(false);
      setFcmToken(null);
      return;
    }

    try {
      const permission = notificationPermission;
      if (permission === 'granted') {
        dispatch(checkNotificationPermission({ data: { isNotificationPermission: 'granted' } }))
        getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        })
          .then((currentToken) => {
            if (currentToken) {
              setTokenFound(true);
              loadFcmToken(currentToken);
              setFcmToken(currentToken);
            } else {
              setTokenFound(false);
              setFcmToken(null);
              toast.error('Permission is required to receive notifications.');
            }
          })
          .catch((err) => {
            console.error('Error retrieving token:', err);
            // If the error is "no active Service Worker", try to register the service worker again
            if (err.message.includes('no active Service Worker')) {
              registerServiceWorker(setTokenFound, setFcmToken);
            }
          });
      } else if (permission === 'denied') {
        dispatch(checkNotificationPermission({ data: { isNotificationPermission: 'denied' } }))
      } else {
        setTokenFound(false);
        setFcmToken(null);
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
  };

  useEffect(() => {
    if (notificationPermission) {
      fetchToken();
    }
  }, [notificationPermission]);

  const registerServiceWorker = (setTokenFound, setFcmToken) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registration successful with scope: ', registration.scope);
          // After successful registration, try to fetch the token again
          fetchToken(setTokenFound, setFcmToken);
        })
        .catch((err) => {
          console.log('Service Worker registration failed: ', err);
        });
    }
  };

  const onMessageListener = async () => {
    const messaging = await messagingInstance();
    if (messaging) {
      return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      });
    } else {
      return null;
    }
  };
  const signOut = () => {
    return authentication?.signOut();
  };
  return { authentication, fetchToken, onMessageListener, signOut }
}

export default FirebaseData;
