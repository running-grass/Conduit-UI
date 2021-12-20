import React, { ReactElement, useEffect } from 'react';
import { useAppDispatch } from '../../redux/store';
import CmsLayout from '../../components/navigation/InnerLayouts/cmsLayout';
import { asyncGetCmsSchemas } from '../../redux/slices/cmsSlice';

import CustomQueries from '../../components/cms/custom-endpoints/CustomQueries';

const Custom = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(asyncGetCmsSchemas({ skip: 0, limit: 50, enabled: true }));
  }, [dispatch]);

  return <CustomQueries />;
};

Custom.getLayout = function getLayout(page: ReactElement) {
  return <CmsLayout>{page}</CmsLayout>;
};

export default Custom;
