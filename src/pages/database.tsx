import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Database: React.FC = () => {
  const classes = useStyles();

  return <Box className={classes.root}>Coming not so soon</Box>;
};

export default Database;