import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { CallMissedOutgoing } from '@mui/icons-material';
import { asyncGetExternalTemplates } from '../../redux/slices/emailsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { EmailTemplateType } from '../../models/emails/EmailModels';
import { enqueueInfoNotification } from '../../utils/useNotifier';
import { camelCase } from 'lodash';
import TemplateEditor from './TemplateEditor';

interface Props {
  handleSave: (templateState: EmailTemplateType) => void;
}

const ExternalTemplates: React.FC<Props> = ({ handleSave }) => {
  const dispatch = useAppDispatch();

  const emptyTemplate = {
    _id: '',
    name: '',
    subject: '',
    body: '',
    variables: [],
    externalManaged: false,
  };

  const { externalTemplates } = useAppSelector((state) => state.emailsSlice.data);
  const [select, setSelect] = useState<number>(-1);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>(emptyTemplate);

  useEffect(() => {
    dispatch(asyncGetExternalTemplates());
  }, [dispatch]);

  const handleSaveData = () => {
    if (selectedTemplate.subject === '' || selectedTemplate.subject === undefined) {
      dispatch(enqueueInfoNotification('Please provide a valid subject', 'externalSubject'));
      return;
    }
    const data = {
      name: selectedTemplate.name,
      subject: selectedTemplate.subject,
      body: selectedTemplate.body,
      variables: selectedTemplate.variables,
      _id: selectedTemplate._id,
      externalManaged: true,
    };

    handleSave(data);
  };

  const handleTemplateChange = (e: any) => {
    setSelect(e.target.value);
    const foundTemplate = externalTemplates.find(
      (template: EmailTemplateType) => camelCase(template.name) === camelCase(e.target.value)
    );

    if (e.target.value !== '' && foundTemplate !== undefined)
      setSelectedTemplate({ ...foundTemplate, subject: '' });
    else setSelectedTemplate(emptyTemplate);
  };

  return (
    <Box mt={10}>
      <Grid container justifyContent="center">
        <FormControl variant="outlined" sx={{ margin: 1, minWidth: 120, width: '90%' }}>
          <InputLabel>{select === -1 ? 'Select template' : 'Selected template'}</InputLabel>
          <Select label="Select template" value={select} onChange={handleTemplateChange}>
            <MenuItem value={-1}>
              <em>None</em>
            </MenuItem>
            {externalTemplates.length > 0 &&
              externalTemplates.map((template, index: number) => (
                <MenuItem key={index} value={template._id}>
                  {template.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Divider sx={{ mt: 2, mb: 2 }} />
      {externalTemplates.length > 0 ? (
        <Typography mt={2} textAlign="center">
          {selectedTemplate.name === ''
            ? 'Select a template to proceed with the import'
            : 'Preview your imported template'}
        </Typography>
      ) : (
        <Typography mt={2} textAlign="center">
          No external templates at the moment
        </Typography>
      )}
      {selectedTemplate.name !== '' && (
        <Grid
          container
          spacing={2}
          justifyContent="space-around"
          sx={{ p: 2, color: 'text.secondary', mt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Template name:</Typography>
            <Typography variant="body2">{selectedTemplate.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Sender Input:</Typography>
            {selectedTemplate.sender === '' || selectedTemplate.sender === undefined ? (
              'No sender input provided'
            ) : (
              <Typography variant="body2">{selectedTemplate.sender}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Subject:</Typography>
            <TextField
              sx={{ width: '100%', mt: 2 }}
              label={'Subject'}
              variant={'outlined'}
              value={selectedTemplate.subject}
              helperText="Provide a subject for the imported template."
              onChange={(event) => {
                setSelectedTemplate({
                  ...selectedTemplate,
                  subject: event.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Body:</Typography>
            <TemplateEditor disabled value={selectedTemplate.body} />
          </Grid>
        </Grid>
      )}
      {selectedTemplate.name !== '' && (
        <Grid container xs={12} justifyContent="space-around" sx={{ marginTop: '15px' }}>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CallMissedOutgoing />}
              onClick={() => handleSaveData()}>
              Import template
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ExternalTemplates;
