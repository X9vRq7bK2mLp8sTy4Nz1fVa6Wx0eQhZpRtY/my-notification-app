'use client';

import { useEffect, useState } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function Home() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => {
          console.log('Service Worker Registered');
          reg.pushManager.getSubscription()
            .then(subscription => {
              setIsSubscribed(!!subscription);
            });
        })
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  }, []);

  const handleSubscribe = async () => {
    if (permission !== 'granted') {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        alert("Permission denied. Notifications will not be sent.");
        return;
      }
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (response.ok) {
        setIsSubscribed(true);
        console.log('Subscription sent to server successfully!');
      } else {
        console.error('Failed to send subscription to server.');
      }
    } catch (err) {
      console.error('Error during subscription:', err);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>iOS Push Notifications</h1>
      <p>This works on iPhone by adding the website to your home screen.</p>
      {permission === 'denied' ? (
        <p style={{ color: 'red' }}>Notifications are blocked. Please enable them in your phone's settings.</p>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={isSubscribed}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: isSubscribed ? 'not-allowed' : 'pointer',
            backgroundColor: isSubscribed ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          {isSubscribed ? 'Subscribed!' : 'Enable Notifications'}
        </button>
      )}
    </div>
  );
}
