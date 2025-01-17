import Typography from '@mui/material/Typography';
import React, { ReactElement, useEffect } from 'react';
import { SignInTypes, SocialNameTypes } from '../../models/authentication/AuthModels';
import {
  asyncGetAuthenticationConfig,
  asyncUpdateAuthenticationConfig,
} from '../../redux/slices/authenticationSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import AuthenticationLayout from '../../components/navigation/InnerLayouts/authenticationLayout';
import AuthAccordion from '../../components/authentication/SignInContainer';

const SignIn = () => {
  const dispatch = useAppDispatch();

  const { config } = useAppSelector((state) => state.authenticationSlice.data);

  useEffect(() => {
    dispatch(asyncGetAuthenticationConfig());
  }, [dispatch]);

  const handleConfigChange = (type: SocialNameTypes, newValue: SignInTypes) => {
    if (newValue.OAuth2Flow === true) {
      delete newValue.OAuth2Flow;
    } else if (newValue.OAuth2Flow === false) {
      delete newValue.OAuth2Flow;
      delete newValue.redirect_uri;
      delete newValue.clientSecret;
    }

    if (type === 'local') {
      const newData = {
        enabled: newValue.enabled,
        verification: {
          required: newValue.verificationRequired,
          send_email: newValue.sendVerificationEmail,
          redirect_uri: newValue.verification_redirect_uri,
        },
        forgot_password_redirect_uri: newValue.forgot_password_redirect_uri,
      };

      const data = {
        ...config,
        [type]: {
          ...newData,
        },
      };

      dispatch(asyncUpdateAuthenticationConfig(data));
    } else {
      const data = {
        ...config,
        [type]: {
          ...newValue,
        },
      };
      dispatch(asyncUpdateAuthenticationConfig(data));
    }
  };

  return (
    <div>
      {config ? (
        <AuthAccordion configData={config} handleData={handleConfigChange} />
      ) : (
        <Typography>No config available</Typography>
      )}
    </div>
  );
};

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <AuthenticationLayout>{page}</AuthenticationLayout>;
};

export default SignIn;
