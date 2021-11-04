import React from 'react';
import SharedLayout from './sharedLayout';
import { FormatAlignLeft } from '@material-ui/icons';

const FormsLayout: React.FC<unknown> = ({ children }) => {
  const pathNames = ['/forms/view', '/forms/settings'];
  const labels = ['view', 'settings'];

  return (
    <SharedLayout
      title={'Forms'}
      labels={labels}
      pathNames={pathNames}
      swagger={'cms'}
      icon={<FormatAlignLeft />}>
      {children}
    </SharedLayout>
  );
};

export default FormsLayout;
