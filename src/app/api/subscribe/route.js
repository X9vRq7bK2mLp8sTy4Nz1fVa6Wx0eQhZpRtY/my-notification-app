import { NextResponse } from 'next/server';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(request) {
  try {
    const subscription = await request.json();
    console.log('Received subscription:', subscription);

    // Send the first notification immediately upon subscription
    const payload1 = JSON.stringify({ title: 'Welcome!', body: 'You will receive another notification in 3 minutes.' });
    await webpush.sendNotification(subscription, payload1);

    // Schedule the second notification for 3 minutes later
    setTimeout(async () => {
      const payload2 = JSON.stringify({ title: 'Reminder!', body: 'This notification was sent 3 minutes later.' });
      try {
        await webpush.sendNotification(subscription, payload2);
        console.log('Second notification sent!');
      } catch (err) {
        console.error('Error sending second notification:', err);
      }
    }, 3 * 60 * 1000); // 3 minutes in milliseconds

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
