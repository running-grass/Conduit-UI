import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { FC, useEffect, useState } from 'react';
import { asyncGetCmsSchemas } from '../../../../redux/slices/cmsSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { IDrawerData, IRelationData } from '../../../../models/cms/BuildTypesModels';

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
    maxWidth: 300,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface IProps {
  drawerData: IDrawerData;
  readOnly: boolean;
  onSubmit: (data: any) => void;
  onClose: () => void;
  selectedItem: IRelationData;
}

const RelationForm: FC<IProps> = ({
  drawerData,
  readOnly,
  onSubmit,
  onClose,
  selectedItem,
  ...rest
}) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const {
    schemas: { schemaDocuments },
    selectedSchema,
    schemasFromOtherModules,
  } = useAppSelector((state) => state.cmsSlice.data);

  const [simpleData, setSimpleData] = useState({
    name: selectedItem ? selectedItem.name : '',
    type: selectedItem ? selectedItem.type : drawerData.type,
    select: selectedItem ? selectedItem.select : true,
    required: selectedItem ? selectedItem.required : false,
    isArray: selectedItem ? selectedItem.isArray : false,
    model: selectedItem ? selectedItem.model : '',
  });
  const [availableSchemas, setAvailableSchemas] = useState<any>([]);

  useEffect(() => {
    dispatch(asyncGetCmsSchemas({ skip: 0, limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    const systemModules = schemasFromOtherModules.map((s) => ({ ...s, enabled: true }));
    let activeModules = schemaDocuments.filter((s) => s.modelOptions.conduit.cms.enabled);
    if (selectedSchema) {
      activeModules = schemaDocuments.filter((s) => s.name !== selectedSchema.name);
    }

    setAvailableSchemas([...activeModules, ...systemModules]);
  }, [schemaDocuments, schemasFromOtherModules, selectedSchema]);

  const handleFieldName = (event: { target: { value: string } }) => {
    setSimpleData({ ...simpleData, name: event.target.value.split(' ').join('') });
  };

  const handleFieldRequired = () => {
    setSimpleData({ ...simpleData, required: !simpleData.required });
  };

  const handleFieldSelect = () => {
    setSimpleData({ ...simpleData, select: !simpleData.select });
  };

  const handleFieldIsArray = () => {
    setSimpleData({ ...simpleData, isArray: !simpleData.isArray });
  };

  const handleFieldRelation = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setSimpleData({ ...simpleData, model: event.target.value as string });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    onSubmit(simpleData);
    event.preventDefault();
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
        InputProps={{
          readOnly: readOnly && !!selectedItem,
        }}
        helperText={'It will appear in the entry editor'}
      />
      <Box width={'100%'}>
        <Grid container>
          <Grid item xs={12}>
            <Box
              width={'100%'}
              display={'inline-flex'}
              justifyContent={'space-between'}
              alignItems={'center'}>
              <Typography variant={'button'} style={{ width: '100%' }}>
                Required
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={simpleData.required}
                    onChange={handleFieldRequired}
                    color="primary"
                  />
                }
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
            <Box
              width={'100%'}
              display={'inline-flex'}
              justifyContent={'space-between'}
              alignItems={'center'}>
              <Typography variant={'button'} style={{ width: '100%' }}>
                Select
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={simpleData.select}
                    onChange={handleFieldSelect}
                    color="primary"
                  />
                }
                label=""
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'body2'} className={classes.info}>
              This option defines if the field should be returned from the database
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Box
              width={'100%'}
              display={'inline-flex'}
              justifyContent={'space-between'}
              alignItems={'center'}>
              <Typography variant={'button'} style={{ width: '100%' }}>
                Array
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={simpleData.isArray}
                    onChange={handleFieldIsArray}
                    color="primary"
                  />
                }
                label=""
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'body2'} className={classes.info}>
              Activate this option if you want your field to be of type Array
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <FormControl className={classes.formControl} variant={'outlined'} fullWidth>
        <InputLabel id="field-type">Relation</InputLabel>
        <Select
          labelId="field-relation"
          id="field relation"
          label={'Relation'}
          value={simpleData.model}
          onChange={handleFieldRelation}
          renderValue={() => simpleData.model}
          MenuProps={MenuProps}>
          {availableSchemas.map((schema: any) => (
            <MenuItem key={schema.name} value={schema.name}>
              <Checkbox checked={simpleData.model === schema.name} color={'primary'} />
              <ListItemText primary={schema.name} />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select the Relation type</FormHelperText>
      </FormControl>

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
};

export default RelationForm;