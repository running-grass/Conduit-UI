import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { IFormsConfig } from '../../models/forms/FormsModels';
import { FormInputSwitch } from '../common/FormComponents/FormInputSwitch';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { asyncEditFormsConfig } from '../../redux/slices/formsSlice';
import { ConfigContainer, ConfigSaveSection } from '@conduitplatform/ui-components';

const FormsConfig: React.FC = () => {
  const dispatch = useAppDispatch();
  const [edit, setEdit] = useState<boolean>(false);
  const { config } = useAppSelector((state) => state.formsSlice.data);

  const methods = useForm<IFormsConfig>({
    defaultValues: useMemo(() => {
      return config;
    }, [config]),
  });
  const { reset, control } = methods;

  useEffect(() => {
    reset(config);
  }, [config, reset]);

  const isActive = useWatch({
    control,
    name: 'active',
  });

  const handleCancel = () => {
    setEdit(false);
    reset();
  };

  const onSubmit = (data: IFormsConfig) => {
    setEdit(false);
    const updatedConfig = {
      ...config,
      ...data,
    };
    dispatch(asyncEditFormsConfig(updatedConfig));
  };

  return (
    <ConfigContainer>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid container>
            <Box
              width={'100%'}
              display={'inline-flex'}
              justifyContent={'space-between'}
              alignItems={'center'}>
              <Typography variant={'h6'}>Activate Forms Module</Typography>
              <FormInputSwitch disabled={!edit} name={'active'} />
            </Box>

            <Divider sx={{ mt: 2, mb: 2, width: '100%' }} />

            <Grid container spacing={2} sx={{ pl: 4 }}>
              {isActive && (
                <Grid item xs={12}>
                  <Box
                    width={'100%'}
                    display={'inline-flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}>
                    <Typography variant={'h6'}>Use Attachments</Typography>
                    <FormInputSwitch disabled={!edit} name={'useAttachments'} />
                  </Box>
                </Grid>
              )}
            </Grid>
            <ConfigSaveSection edit={edit} setEdit={setEdit} handleCancel={handleCancel} />
          </Grid>
        </form>
      </FormProvider>
    </ConfigContainer>
  );
};

export default FormsConfig;
