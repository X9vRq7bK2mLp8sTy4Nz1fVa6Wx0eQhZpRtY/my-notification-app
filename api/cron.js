export default function handler(request, response) {
  // This is the function that will be executed on the schedule.
  // You can place any logic here, like calling a database, sending an email, etc.

  try {
    // Example logic: just logging the time and returning a success message.
    const now = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
    console.log(`Cron job executed at: ${now}`);

    response.status(200).send('Cron job executed successfully!');
  } catch (error) {
    console.error('Error executing cron job:', error);
    response.status(500).send('Error executing cron job.');
  }
}
