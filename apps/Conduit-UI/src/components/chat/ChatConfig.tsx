import React, { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { IChatConfig } from '../../models/chat/ChatModels';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { asyncPutChatConfig } from '../../redux/slices/chatSlice';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { FormInputSwitch } from '../common/FormComponents/FormInputSwitch';
import { ConfigSaveSection, ConfigContainer } from '@conduitplatform/ui-components';

const ChatConfig: React.FC = () => {
  const dispatch = useAppDispatch();
  const [edit, setEdit] = useState<boolean>(false);

  const { config } = useAppSelector((state) => state.chatSlice);

  const methods = useForm<IChatConfig>({
    defaultValues: useMemo(() => {
      return config;
    }, [config]),
  });

  const { control } = methods;

  useEffect(() => {
    methods.reset(config);
  }, [methods, config]);

  const isActive = useWatch({
    control,
    name: 'active',
  });

  const handleCancel = () => {
    setEdit(!edit);
    methods.reset();
  };

  const onSubmit = (data: IChatConfig) => {
    setEdit(false);
    dispatch(asyncPutChatConfig(data));
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
              <Typography variant={'h6'}>Activate Chat Module</Typography>
              <FormInputSwitch name={'active'} disabled={!edit} />
            </Box>
            <Divider sx={{ marginTop: 2, marginBottom: 2, width: '100%' }} />
            <Grid container spacing={2} sx={{ paddingLeft: 4 }}>
              {isActive && (
                <>
                  <Grid item xs={12}>
                    <Box
                      width={'50%'}
                      display={'inline-flex'}
                      justifyContent={'space-between'}
                      alignItems={'center'}>
                      <Typography variant={'subtitle1'}>Allow Message Edit</Typography>
                      <FormInputSwitch name={'allowMessageEdit'} disabled={!edit} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      width={'50%'}
                      display={'inline-flex'}
                      justifyContent={'space-between'}
                      alignItems={'center'}>
                      <Typography variant={'subtitle1'}>Allow Message Delete</Typography>
                      <FormInputSwitch name={'allowMessageDelete'} disabled={!edit} />
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
            <ConfigSaveSection edit={edit} setEdit={setEdit} handleCancel={handleCancel} />
          </Grid>
        </form>
      </FormProvider>
    </ConfigContainer>
  );
};

export default ChatConfig;
