importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')
// // Initialize the Firebase app in the service worker by passing the generated config 

const firebaseConfig = {
  apiKey: "enter_here_your_api_key",
  authDomain: "enter_here_your_auth_domain",
  projectId: "enter_here_your_project_id",
  storageBucket: "enter_here_your_storage_bucket",
  messagingSenderId: "enter_here_your_messaging_sender_id",
  appId: "enter_here_your_app_id",
  measurementId: "enter_here_your_measurement_id"
}

firebase?.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener('install', function (event) {
  // console.log('Hello world from the Service Worker :call_me_hand:');
});

// Handle background messages
self.addEventListener('push', function (event) {
  const payload = event.data.json();
  const notificationTitle = payload.notification.body;

  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.data?.image || './favicon.png',
    data: {
      url: `/${payload.data?.language_code}/news/${payload.data?.news_slug}`,
      id: payload.data?.news_id,
    },
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});


// 🔥 ADDED CLICK LOGIC (Nothing else changed)
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url;

  if (!urlToOpen) return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});