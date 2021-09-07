import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Clear, MailOutline, Send } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { sendEmailThunk } from '../../redux/thunks/emailsThunk';
import { useDispatch } from 'react-redux';
import { EmailTemplateType } from '../../models/emails/EmailModels';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  simpleTextField: {
    width: '65ch',
  },
  typography: {
    marginBottom: theme.spacing(4),
  },
}));

interface IEmailState {
  email: string;
  sender: string;
  subject: string;
  body: string;
  template: string;
  variables: [];
  variablesValues: { [key: string]: string };
  templateName: string;
}

interface Props {
  templates: EmailTemplateType[];
}

const SendEmailForm: React.FC<Props> = ({ templates }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [withTemplate, setWithTemplate] = useState<boolean>(false);
  const [emailState, setEmailState] = useState<IEmailState>({
    email: '',
    sender: '',
    subject: '',
    body: '',
    template: '',
    variables: [],
    variablesValues: {},
    templateName: '',
  });

  const sendEmail = () => {
    let email;
    if (emailState.template) {
      email = {
        templateName: emailState.templateName,
        variables: emailState.variablesValues,
        sender: emailState.sender,
        email: emailState.email,
        body: emailState.body,
      };
    } else {
      email = {
        subject: emailState.subject,
        sender: emailState.sender,
        email: emailState.email,
        body: emailState.body,
      };
    }
    dispatch(sendEmailThunk(email));
  };

  const clearEmail = () => {
    setEmailState({
      email: '',
      sender: '',
      subject: '',
      body: '',
      template: '',
      variables: [],
      variablesValues: {},
      templateName: '',
    });
  };

  const handleChangeTemplate = (event: any) => {
    const selectedTemplate = event.target.value;

    let variableValues = {};
    selectedTemplate.variables.forEach((variable: string) => {
      variableValues = { ...variableValues, [variable]: '' };
    });

    setEmailState({
      ...emailState,
      variables: selectedTemplate.variables,
      templateName: selectedTemplate.name,
      subject: selectedTemplate.subject,
      variablesValues: variableValues,
      template: selectedTemplate,
      body: selectedTemplate.body,
    });
  };

  const handleVariableChange = (event: any, variable: string) => {
    const newValue = event.target.value;
    const variableValues = { ...emailState.variablesValues, [variable]: newValue };
    setEmailState({ ...emailState, variablesValues: variableValues });
  };

  return (
    <Container maxWidth="md">
      <Paper className={classes.paper} elevation={1}>
        <Typography variant={'h6'} className={classes.typography}>
          <MailOutline fontSize={'small'} />. Compose your email
        </Typography>
        <form noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                id="recipient"
                label="Recipient (To:)"
                variant="outlined"
                type={'email'}
                placeholder={'joedoe@gmail.com'}
                className={classes.simpleTextField}
                value={emailState.email}
                onChange={(event) => {
                  setEmailState({
                    ...emailState,
                    email: event.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="sender"
                label="Sender (From:)"
                variant="outlined"
                placeholder={'Sender'}
                className={classes.simpleTextField}
                value={emailState.sender}
                onChange={(event) => {
                  setEmailState({
                    ...emailState,
                    sender: event.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="subject"
                label="Subject"
                variant="outlined"
                disabled={withTemplate}
                required={!withTemplate}
                value={emailState.subject}
                placeholder={'Hello World 👋'}
                className={classes.simpleTextField}
                onChange={(event) => {
                  setEmailState({
                    ...emailState,
                    subject: event.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={withTemplate}
                    onChange={(e) => setWithTemplate(e.target.checked)}
                    name="withTemplate"
                    color="primary"
                  />
                }
                label="With Template"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant="outlined"
                required={withTemplate}
                disabled={!withTemplate}
                style={{ minWidth: '65ch' }}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Email Template
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={emailState.template}
                  onChange={handleChangeTemplate}
                  label="Email Template">
                  <MenuItem value="none">
                    <em>None</em>
                  </MenuItem>
                  {templates?.map((template) => (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <MenuItem key={template._id} value={template}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={withTemplate}
                id="outlined-multiline-static"
                label="Email body"
                multiline
                rows="10"
                variant="outlined"
                placeholder="Write your email here..."
                required
                fullWidth
                value={emailState.body}
                onChange={(event) => {
                  setEmailState({
                    ...emailState,
                    body: event.target.value,
                  });
                }}
              />
            </Grid>
            <Grid container item xs={12} spacing={1}>
              {emailState.variables.map((variable, index) => (
                <Grid key={variable + '_' + index} item xs={3}>
                  <TextField
                    label={variable}
                    variant="outlined"
                    required
                    fullWidth
                    value={emailState.variablesValues[variable]}
                    onChange={(e) => handleVariableChange(e, variable)}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid item container justify="flex-end" xs={12}>
              <Box marginTop={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Clear />}
                  style={{ marginRight: 16 }}
                  onClick={clearEmail}>
                  Clear
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Send />}
                  onClick={sendEmail}>
                  Send
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SendEmailForm;