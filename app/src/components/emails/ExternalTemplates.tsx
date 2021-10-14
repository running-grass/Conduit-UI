import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { CallMissedOutgoing } from '@material-ui/icons';
import { asyncGetExternalTemplates } from '../../redux/slices/emailsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { EmailTemplateType } from '../../models/emails/EmailModels';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '30px',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: '300px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '90%',
  },
  inputLabel: {
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginTop: '20px',
  },
  templateInfo: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  handleSave: (templateState: EmailTemplateType) => void;
}

const ExternalTemplates: React.FC<Props> = ({ handleSave }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const emptyTemplate = {
    _id: '',
    name: '',
    subject: '',
    body: '',
    variables: [],
    sender: '',
    externalManaged: false,
  };

  const { externalTemplates } = useAppSelector((state) => state.emailsSlice.data);
  const [select, setSelect] = useState<number>(-1);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>(emptyTemplate);

  //Placeholder till we get actual values, logic mostly in place

  const placeholders = [
    { name: 'template 1', _id: 1 },
    { name: 'template 2', _id: 2 },
    { name: 'template 3', _id: 3 },
  ];

  useEffect(() => {
    dispatch(asyncGetExternalTemplates());
  }, [dispatch]);

  const handleSaveData = () => {
    const data = {
      name: selectedTemplate.name,
      subject: selectedTemplate.subject,
      body: selectedTemplate.body,
      variables: [''],
      _id: selectedTemplate._id,
      externalManaged: true,
      sender: selectedTemplate.sender,
    };
  };

  const handleTemplateChange = (e: any) => {
    setSelect(e.target.value);
    //we grab either the _id or the name of the template to find the actual values
    // const foundTemplate = externalTemplates.find(
    //   (template: any) => template.name === e.target.value
    // );
    // if (e.target.value !== '') setSelectedTemplate(foundTemplate);
    // else setSelectedTemplate(emptyTemplate);
  };

  return (
    <Box className={classes.root}>
      <Grid container justify="center">
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">
            {select === -1 ? 'Select template' : 'Selected template'}
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label="Select your template"
            value={select}
            onChange={handleTemplateChange}>
            <MenuItem value={-1}>
              <em>None</em>
            </MenuItem>
            {placeholders.map((template, index: number) => (
              <MenuItem key={index} value={template._id}>
                {template.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Divider className={classes.divider} />
      <Typography className={classes.header}>
        {selectedTemplate.name === ''
          ? 'Select a template to proceed with the import'
          : 'Preview your imported template'}
      </Typography>
      {selectedTemplate.name !== '' && (
        <Grid container spacing={2} justify="space-around" className={classes.templateInfo}>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Template name:</Typography>
            <Typography variant="body2">{selectedTemplate.name}Testing template</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Sender Input:</Typography>
            <Typography variant="body2">{selectedTemplate.sender}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Subject:</Typography>
            <Typography variant="body1">{selectedTemplate.subject}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Body:</Typography>
            <Typography variant="h6">{selectedTemplate.body}</Typography>
          </Grid>
        </Grid>
      )}
      {selectedTemplate.name !== '' && (
        <Grid container xs={12} justify="space-around" style={{ marginTop: '15px' }}>
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