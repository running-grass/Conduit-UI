import ConduitGrpcSdk from '@quintessential-sft/conduit-grpc-sdk';
import SmsModule from './Sms';

let paths = require('./admin/admin.json');

if (!process.env.CONDUIT_SERVER) {
  throw new Error('Conduit server URL not provided');
}
let grpcSdk = new ConduitGrpcSdk(process.env.CONDUIT_SERVER, 'sms');
let sms = new SmsModule(grpcSdk);
let url = sms.url;
if (process.env.REGISTER_NAME === 'true') {
  url = 'sms-provider:' + url.split(':')[1];
}

grpcSdk.config
  .registerModule('sms', url)
  .catch((err: any) => {
    console.error(err);
    process.exit(-1);
  })
  .then(() => {
    grpcSdk.admin.register(paths.functions);
  })
  .catch((err: Error) => {
    console.log('Failed to register admin routes for sms module!');
    console.error(err);
  });