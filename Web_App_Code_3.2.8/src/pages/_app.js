import { store } from "@/components/store/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import PushNotificationLayout from "@/components/firebaseNotification/PushNotification";
import { Router } from 'next/router'
import NProgress from 'nprogress'
import { useEffect } from 'react';

import dynamic from 'next/dynamic';
const GoogleTranslate = dynamic(() => import('@/components/commonComponents/GoogleTranslate'), { ssr: false });

// CSS File Here
import 'nprogress/nprogress.css'
import 'react-loading-skeleton/dist/skeleton.css'

export default function App({ Component, pageProps }) {

  // Register service worker for PWA
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname)

      if (process.env.NODE_ENV !== 'production' || isLocalhost) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => registration.unregister())
        })

        if ('caches' in window) {
          caches.keys().then(keys => {
            keys.forEach(key => caches.delete(key))
          })
        }
        return
      }

      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })

  return <main>
    <Provider store={store}>
      <Toaster position='top-center' containerClassName='toast-custom' />
      <GoogleTranslate />
      <PushNotificationLayout>
        <Component {...pageProps} />
      </PushNotificationLayout>
    </Provider>
  </main>
}
