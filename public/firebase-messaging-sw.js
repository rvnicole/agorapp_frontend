importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAXy-6MyN5K0T98-8mOoB1W10xweSxYMAk",
  authDomain: "agorapp-3361e.firebaseapp.com",
  projectId: "agorapp-3361e",
  storageBucket: "agorapp-3361e.firebasestorage.app",
  messagingSenderId: "239179996280",
  appId: "1:239179996280:web:9ebc30b8de851628c7a18d",
  measurementId: "G-4LFB4NH6LN"
});

const messaging = firebase.messaging();

self.addEventListener('push', (event) => {

  if( event.data ){
    const data = event.data.json().data;
    self.registration.showNotification(data.title, { 
      body: data.body,
      data:  {
        url: data.url
      }
    });
  };
});

self.addEventListener("notificationclick", (e) => {
  console.log(e);
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for( const client of clientList ){
          if( client.url.includes(self.location.origin) && "focus" in client ){
            client.focus();
            return client.navigate(e.notification.data.url);
          };
        };

        if( clients.openWindow ) return clients.openWindow(e.notification.data.url);
      })
  );
});