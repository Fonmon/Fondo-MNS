const webpush = require('web-push');

exports.handler = async (event) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const mailTo = process.env.VAPID_EMAIL;

  webpush.setVapidDetails(
    mailTo,
    publicKey,
    privateKey
  );

  const invalidSubscriptions = []
  const obj = JSON.parse(event.body);

  for (index in obj.subscriptions) {
    subscription = obj.subscriptions[index];
    try {
      await webpush.sendNotification(subscription, JSON.stringify(obj.message));
    } catch (err) {
      console.error(err.body);
      if (err.statusCode === 410)
        invalidSubscriptions.push(subscription);
    }
  }

  // For reference
  console.log('INVALID SUSCRIPTIONS')
  console.log(invalidSubscriptions);
  
  return invalidSubscriptions
}