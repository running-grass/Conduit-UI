import React, { useEffect, useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import { useRouter } from 'next/router';
import sharedClasses from './sharedClasses';

const AuthenticationLayout: React.FC<unknown> = ({ children }) => {
  const classes = sharedClasses();
  const router = useRouter();
  const [value, setValue] = useState(0);

  const pathnames = [
    '/authentication/users',
    '/authentication/signIn',
    '/authentication/serviceAccounts',
    '/authentication/settings',
  ];

  useEffect(() => {
    const index = pathnames.findIndex((pathname) => pathname === router.pathname);
    setValue(index);
  });

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    setValue(newValue);
    router.push(`${event.currentTarget.id}`, undefined, { shallow: false });
  };

  return (
    <Box p={4}>
      <Box className={classes.navBar}>
        <Typography variant={'h4'}>Authentication</Typography>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Users" id="users" />
          <Tab label="Sign in methods" id="signIn" />
          <Tab label="Service accounts" id="serviceAccounts" />
          <Tab label="Settings" id="settings" />
        </Tabs>
      </Box>
      <Box className={classes.content}>{children}</Box>
    </Box>
  );
};

export default AuthenticationLayout;
