export default function handler(request, response) {
  // 1. Get the secret from the request headers
  const authHeader = request.headers['authorization'];

  // 2. Compare it with your environment variable
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // 3. If they don't match, return an unauthorized error
    return response.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // If the secret is valid, execute the main logic
  try {
    const now = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
    console.log(`Cron job executed at: ${now}`);
    
    response.status(200).send('Cron job executed successfully!');
  } catch (error) {
    console.error('Error executing cron job:', error);
    response.status(500).send('Error executing cron job.');
  }
}
