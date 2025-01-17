import React from 'react';
import { Security } from '@mui/icons-material';
import StyledLayout from './styledLayout';

const SecurityLayout: React.FC = ({ children }) => {
  const pathNames = ['/security/clients', '/security/config'];

  const labels = [
    { name: 'clients', id: 'clients' },
    { name: 'config', id: 'config' },
  ];

  return (
    <StyledLayout
      title={'Security'}
      labels={labels}
      pathNames={pathNames}
      swagger={'security'}
      icon={<Security />}>
      {children}
    </StyledLayout>
  );
};

export default SecurityLayout;
