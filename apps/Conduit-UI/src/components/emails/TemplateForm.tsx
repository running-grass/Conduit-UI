import { Button, Grid } from '@mui/material';
import React, { FC } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import TemplateEditor from './TemplateEditor';
import { FormInputText } from '../common/FormComponents/FormInputText';
import { EmailTemplateType } from '../../models/emails/EmailModels';

interface Props {
  preloadedValues: EmailTemplateType;
  handleSubmitData: (data: EmailTemplateType) => void;
}

const TemplateForm: FC<Props> = ({ preloadedValues, handleSubmitData }) => {
  const methods = useForm<EmailTemplateType>({ defaultValues: preloadedValues });

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: EmailTemplateType) => {
    handleSubmitData({ ...data });
  };

  const onCancel = () => {
    reset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <FormInputText
              name="name"
              label="Name"
              rules={{ required: 'Template name is required!' }}
            />
          </Grid>
          <Grid item sm={12}>
            <FormInputText name="sender" label="Sender*" />
          </Grid>
          <Grid item sm={12}>
            <FormInputText
              name="subject"
              label="Subject"
              rules={{ required: 'Subject is required!' }}
            />
          </Grid>
          <Grid item sm={12}>
            <Controller
              name="body"
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <TemplateEditor value={value} setValue={onChange} />
              )}
              rules={{ required: 'Template body required' }}
            />
          </Grid>
          <Grid container item>
            <Grid item mr={1}>
              <Button variant="outlined" onClick={() => onCancel()}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default TemplateForm;
