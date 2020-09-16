import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(1),
  },
  info: {
    width: '100%',
    fontSize: 14,
    marginBottom: theme.spacing(3),
    opacity: '0.5',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function EnumForm(props) {
  const { drawerData, onSubmit, onClose, selectedItem, ...rest } = props;
  const classes = useStyles();

  const [simpleData, setSimpleData] = useState({
    name: selectedItem ? selectedItem.name : '',
    type: selectedItem ? selectedItem.type : '',
    select: selectedItem ? selectedItem.select : true,
    required: selectedItem ? selectedItem.required : false,
    enumValues: selectedItem ? selectedItem.enumValues : '',
    isEnum: selectedItem ? selectedItem.isEnum : true,
  });

  const handleFieldName = (event) => {
    setSimpleData({ ...simpleData, name: event.target.value });
  };

  const handleFieldType = (event) => {
    setSimpleData({ ...simpleData, type: event.target.value });
  };

  const handleFieldRequired = () => {
    setSimpleData({ ...simpleData, required: !simpleData.required });
  };

  const handleFieldSelect = () => {
    setSimpleData({ ...simpleData, select: !simpleData.select });
  };

  const handleOptions = (event) => {
    setSimpleData({ ...simpleData, enumValues: event.target.value });
  };

  const handleSubmit = (event) => {
    onSubmit(event, simpleData);
    event.preventDefault();
  };

  useEffect(() => {
    setSimpleData({ ...simpleData, type: selectType() });
  }, [drawerData.open]);

  const selectType = () => {
    if (selectedItem) {
      return selectedItem.type ? selectedItem.type : '';
    }
    return '';
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={classes.form} {...rest}>
      <TextField
        id="Field Name"
        label="Field Name"
        onChange={handleFieldName}
        value={simpleData.name}
        variant="outlined"
        className={classes.textField}
        fullWidth
        required
        helperText={'It will appear in the entry editor'}
      />
      <FormControl className={classes.formControl} variant={'outlined'} fullWidth required>
        <InputLabel id="field-type">Type</InputLabel>
        <Select labelId="field-type" id="field type" label={'Type'} value={simpleData.type} onChange={handleFieldType}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'Text'}>Text</MenuItem>
          <MenuItem value={'Number'}>Number</MenuItem>
        </Select>
        <FormHelperText>Select the type of enum values</FormHelperText>
      </FormControl>
      <TextField
        id="Options"
        label="Options"
        multiline
        rows="4"
        onChange={handleOptions}
        value={simpleData.enumValues}
        variant="outlined"
        className={classes.textField}
        fullWidth
        required
        helperText={'(Define one option per line)'}
      />

      <Box width={'100%'}>
        <Grid container>
          <Grid item xs={12}>
            <Box width={'100%'} display={'inline-flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant={'button'} style={{ width: '100%' }}>
                Required
              </Typography>
              <FormControlLabel
                control={<Switch checked={simpleData.required} onChange={handleFieldRequired} color="primary" />}
                label=""
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'body2'} className={classes.info}>
              If active, this field will be required
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Box width={'100%'} display={'inline-flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant={'button'} style={{ width: '100%' }}>
                Select
              </Typography>
              <FormControlLabel
                control={<Switch checked={simpleData.select} onChange={handleFieldSelect} color="primary" />}
                label=""
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'body2'} className={classes.info}>
              This option defines if the field you be returned from the database
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box display={'flex'} width={'100%'}>
        <Button variant="contained" color="primary" type="submit" style={{ marginRight: 16 }}>
          OK
        </Button>
        <Button variant="contained" onClick={onClose}>
          CANCEL
        </Button>
      </Box>
    </form>
  );
}