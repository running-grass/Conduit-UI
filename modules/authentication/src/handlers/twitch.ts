import ConduitGrpcSdk, { ConduitError, RouterResponse, RouterRequest } from '@quintessential-sft/conduit-grpc-sdk';
import grpc from 'grpc';
import { isNil } from 'lodash';
import axios from 'axios';
import moment from 'moment';
import { ConfigController } from '../config/Config.controller';
import { AuthUtils } from '../utils/auth';

export class TwitchHandlers {
  private database: any;
  private initialized: boolean = false;

  constructor(private readonly grpcSdk: ConduitGrpcSdk) {
    this.database = this.grpcSdk.databaseProvider;
  }

  async validate(): Promise<Boolean> {
    const authConfig = ConfigController.getInstance().config;
    if (!authConfig.twitch.enabled) {
      console.log('twitch not active');
      throw ConduitError.forbidden('Twitch auth is deactivated');
    }
    if (
      !authConfig.twitch ||
      !authConfig.twitch.clientId ||
      !authConfig.twitch.clientSecret
    ) {
      console.log('twitch not active');
      throw ConduitError.forbidden(
        'Cannot enable twitch auth due to missing clientId or client secret'
      );
    }
    console.log('twitch is active');
    this.initialized = true;
    return true;
  }

  async beginAuth(call: RouterRequest, callback: RouterResponse) {
    let errorMessage = null;
    const config = ConfigController.getInstance().config;

    let serverConfig = await this.grpcSdk.config
      .getServerConfig()
      .catch((e: any) => (errorMessage = e.message));
    if (!isNil(errorMessage))
      return callback({ code: grpc.status.INTERNAL, message: errorMessage });
    let redirect = serverConfig.url + '/hook/authentication/twitch';
    const context = JSON.parse(call.request.context);
    const clientId = context.clientId;
    let originalUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${config.twitch.clientId}&redirect_uri=${redirect}&response_type=code&scope=user:read:email&state=${clientId}`;
    return callback(null, {
      result: originalUrl,
    });
  }

  async authenticate(call: RouterRequest, callback: RouterResponse) {
    const params = JSON.parse(call.request.params);
    const code = params.code;
    if (isNil(code))
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Invalid parameters',
      });

    let errorMessage = null;

    const config = ConfigController.getInstance().config;

    let serverConfig = await this.grpcSdk.config
      .getServerConfig()
      .catch((e: any) => (errorMessage = e.message));
    if (!isNil(errorMessage))
      return callback({ code: grpc.status.INTERNAL, message: errorMessage });
    let url = serverConfig.url;

    let twitch_access_token = undefined;
    let expires_in = undefined;
    let id = undefined;
    let email = undefined;
    let profile_image_url = undefined;

    try {
      const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
          client_id: config.twitch.clientId,
          client_secret: config.twitch.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: url + '/hook/authentication/twitch',
        },
      });

      twitch_access_token = response.data.access_token;
      expires_in = response.data.expires_in;

      const response2 = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${twitch_access_token}`,
          'Client-Id': config.twitch.clientId,
        },
      });

      id = response2.data.data[0].id;
      email = response2.data.data[0].email;
      profile_image_url = response2.data.data[0].profile_image_url;
    } catch (e) {
      errorMessage = e.message;
    }
    if (!isNil(errorMessage))
      return callback({ code: grpc.status.INTERNAL, message: errorMessage });

    let user = await this.database
      .findOne('User', { 'twitch.id': id })
      .catch((e: any) => (errorMessage = e.message));
    if (!isNil(errorMessage))
      return callback({ code: grpc.status.INTERNAL, message: errorMessage });

    if (isNil(user) && !isNil(email)) {
      user = await this.database
        .findOne('User', { email: email })
        .catch((e: any) => (errorMessage = e.message));
      if (!isNil(errorMessage))
        return callback({ code: grpc.status.INTERNAL, message: errorMessage });
    }
    if (isNil(user)) {
      user = await this.database
        .create('User', {
          email,
          twitch: {
            id,
            token: twitch_access_token,
            tokenExpires: moment().add(expires_in).format(),
            profile_image_url,
          },
          isVerified: true,
        })
        .catch((e: any) => (errorMessage = e.message));
      if (!isNil(errorMessage))
        return callback({ code: grpc.status.INTERNAL, message: errorMessage });
    } else {
      if (!user.active)
        return callback({
          code: grpc.status.PERMISSION_DENIED,
          message: 'Inactive user',
        });
      if (!user.twitch) {
        user = await this.database
          .findByIdAndUpdate('User', user._id, {
            $set: {
              ['twitch']: {
                id,
                token: twitch_access_token,
                tokenExpires: moment().add(expires_in).format(),
                profile_image_url,
              },
            },
          })
          .catch((e: any) => (errorMessage = e.message));
        if (!isNil(errorMessage))
          return callback({ code: grpc.status.INTERNAL, message: errorMessage });
      }
    }

    let clientId = params.state;

    const [accessToken, refreshToken] = await AuthUtils.createUserTokensAsPromise(
      this.grpcSdk,
      {
        userId: user._id,
        clientId,
        config,
      }
    ).catch((e) => (errorMessage = e));

    if (!isNil(errorMessage))
      return callback({ code: grpc.status.INTERNAL, message: errorMessage });

    return callback(null, {
      redirect:
        config.twitch.redirect_uri +
        '?accessToken=' +
        accessToken.token +
        '&refreshToken=' +
        refreshToken.token,
      result: JSON.stringify({
        userId: user._id.toString(),
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
      }),
    });
  }
}