import PushNotifications from './PushNotifications';
import ConduitGrpcSdk from '@quintessential-sft/conduit-grpc-sdk';

if (!process.env.CONDUIT_SERVER) {
  throw new Error('Conduit server URL not provided');
}
let grpcSdk = new ConduitGrpcSdk(process.env.CONDUIT_SERVER, 'push-notifications');
let notifications = new PushNotifications(grpcSdk);
notifications
  .initialize()
  .then(() => {
    let url =
      (process.env.REGISTER_NAME === 'true' ? 'push-notifications:' : '0.0.0.0:') +
      notifications.port;

    return grpcSdk.config.registerModule('push-notifications', url);
  })
  .catch((err: Error) => {
    console.log('Failed to initialize server');
    console.error(err);
    process.exit(-1);
  })
  .then(() => {
    return notifications.activate();
  })
  .catch((err: Error) => {
    console.log('Failed to active module');
    console.error(err);
  });
