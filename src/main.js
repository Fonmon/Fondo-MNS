const webpush = require('web-push');

sendNotification = async (obj) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const contactEmail = process.env.VAPID_EMAIL;

    webpush.setVapidDetails(
        contactEmail,
        publicKey,
        privateKey
    );

    let subscription = null;
    let invalidSubscriptions = []

    for(index in obj.subscriptions){
        subscription = obj.subscriptions[index];
        try {
            await webpush.sendNotification(subscription, JSON.stringify(obj.message));
        } catch (err) {
            console.log(err);
            if(err.statusCode === 410)
                invalidSubscriptions.push(subscription);
        }
    }
    
    return invalidSubscriptions;
}

exports.sendNotification = sendNotification