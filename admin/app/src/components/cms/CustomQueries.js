import {
  Box,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Button,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React, { useState, Fragment } from 'react';
import ConditionsEnum from '../../models/ConditionsEnum';
import OperationsEnum from '../../models/OperationsEnum';

const useStyles = makeStyles((theme) => ({
  listBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: '1px solid #000000',
    height: '100%',
  },
  divider: {
    '&.MuiDivider-root': {
      height: '2px',
      background: '#000000',
      borderRadius: '4px',
    },
  },
  mainContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  button: {
    margin: theme.spacing(1),
    textTransform: 'none',
  },
  grid: {
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '4px',
    padding: theme.spacing(3),
  },
  listItem: {
    '&.MuiListItem-root:hover': {
      background: 'rgba(0, 83, 156, 0.2)',
      borderRadius: '4px',
    },
    '&.Mui-selected': {
      background: '#00539C',
      borderRadius: '4px',
      color: '#ffffff',
    },
    '&.Mui-selected:hover': {
      background: '#00539C',
      borderRadius: '4px',
      color: '#ffffff',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  list: {
    '&.MuiList-root': {
      maxHeight: '580px',
      overflowY: 'auto',
      width: '100%',
      //   '&::-webkit-scrollbar': {
      //     display: 'none',
      //   },
    },
  },
  textField: {
    width: '245px',
  },
}));

const CustomQueries = ({ endpoints = [], availableSchemas = [] }) => {
  const classes = useStyles();

  const [selectedEndpoint, setSelectedEndpoint] = useState(-1);
  const [selectedOperation, setSelectedOperation] = useState(-1);
  const [selectedSchema, setSelectedSchema] = useState();
  const [name, setName] = useState('');
  const [availableFieldsOfSchema, setAvailableFieldsOfSchema] = useState([]);
  const [selectedInputs, setSelectedInputs] = useState([]);
  const [selectedQueries, setSelectedQueries] = useState([]);

  const handleListItemSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
  };

  const handleOperationChange = (event) => {
    setSelectedOperation(event.target.value);
  };

  const handleNameChange = (value) => {
    setName(value);
  };

  const handleAddNewEndpoint = () => {
    setSelectedEndpoint({});
  };

  const getAvailableFieldsOfSchema = (schemaSelected) => {
    if (schemaSelected) {
      const found = availableSchemas.find((schema) => schema._id === schemaSelected);
      if (found) {
        return found.fields;
      }
    }
  };

  const handleSchemaChange = (event) => {
    setSelectedSchema(event.target.value);
    const fields = getAvailableFieldsOfSchema(event.target.value);
    setAvailableFieldsOfSchema(Object.keys(fields));
  };

  const handleInputNameChange = (event, index) => {
    const value = event.target.value;
    const currentInputs = selectedInputs.slice();
    const input = currentInputs[index];
    if (input) {
      input.value = value;
      setSelectedInputs(currentInputs);
    }
  };

  const handleInputTypeChange = (event, index) => {
    const value = event.target.value;
    const currentInputs = selectedInputs.slice();
    const input = currentInputs[index];
    if (input) {
      input.type = value;
      setSelectedInputs(currentInputs);
    }
  };

  const handleInputArgsTypeChange = (event, index) => {
    const value = event.target.value;
    const currentInputs = selectedInputs.slice();
    const input = currentInputs[index];
    if (input) {
      input.argsType = value;
      setSelectedInputs(currentInputs);
    }
  };

  const handleAddInput = () => {
    const input = {
      value: '',
      type: '',
      argsType: '',
    };
    setSelectedInputs([...selectedInputs, input]);
  };

  const handleAddQuery = () => {
    const query = {
      field: '',
      condition: '',
      comparisonField: '',
    };
    setSelectedQueries([...selectedQueries, query]);
  };

  const handleQueryFieldChange = (event, index) => {
    const value = event.target.value;
    const currentQueries = selectedQueries.slice();
    const input = currentQueries[index];
    if (input) {
      input.field = value;
      setSelectedQueries(currentQueries);
    }
  };

  const handleQueryConditionChange = (event, index) => {
    const value = event.target.value;
    const currentQueries = selectedQueries.slice();
    const input = currentQueries[index];
    if (input) {
      input.condition = value;
      setSelectedQueries(currentQueries);
    }
  };

  const handleQueryComparisonFieldChange = (event, index) => {
    const value = event.target.value;
    const currentQueries = selectedQueries.slice();
    const input = currentQueries[index];
    if (input) {
      input.comparisonField = value;
      setSelectedQueries(currentQueries);
    }
  };

  const renderSideList = () => {
    return (
      <Box className={classes.listBox}>
        <Button
          variant="contained"
          color={'primary'}
          className={classes.button}
          endIcon={<AddCircleOutlineIcon />}
          onClick={handleAddNewEndpoint}>
          Add endpoint
        </Button>
        <Divider flexItem variant="middle" className={classes.divider}></Divider>
        <List className={classes.list}>
          {endpoints.map((endpoint) => (
            <ListItem
              button
              key={`endpoint-${endpoint.id}`}
              className={classes.listItem}
              onClick={() => handleListItemSelect(endpoint)}
              selected={selectedEndpoint?.id === endpoint?.id}>
              <ListItemText primary={endpoint.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  const renderOperationSection = () => {
    return (
      <>
        <Grid item xs={6}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select_operation">Select Operation</InputLabel>
            <Select
              native
              value={selectedOperation}
              onChange={handleOperationChange}
              labelWidth={100}
              inputProps={{
                name: 'select_operation',
                id: 'select_operation',
              }}>
              <option aria-label="None" value={-1} />
              <option value={OperationsEnum.GET}>Find/Get</option>
              <option value={OperationsEnum.POST}>Create</option>
              <option value={OperationsEnum.PUT}>Update/Edit</option>
              <option value={OperationsEnum.DELETE}>Delete</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select_schema">Select Schema</InputLabel>
            <Select
              native
              value={selectedSchema}
              onChange={handleSchemaChange}
              inputProps={{
                name: 'select_schema',
                id: 'select_schema',
              }}>
              <option aria-label="None" value="" />
              {availableSchemas.map((schema, index) => (
                <option key={`schema-${schema.id ? schema.id : index}`} value={schema._id}>
                  {schema.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </>
    );
  };

  const renderInputsList = () => {
    return selectedInputs.map((input, index) => (
      <Fragment key={`input-${index}`}>
        <Grid item xs={1} key={index}>
          <Typography>{index + 1}.</Typography>
        </Grid>
        <Grid item xs={3}>
          <TextField value={input.value} onChange={(event) => handleInputNameChange(event, index)}></TextField>
        </Grid>
        <Grid item xs={4}>
          <FormControl className={classes.formControl}>
            <InputLabel>Type</InputLabel>
            <Select native value={input.type} onChange={(event) => handleInputTypeChange(event, index)}>
              <option aria-label="None" value="" />
              <option value={'String'}>String</option>
              <option value={'Number'}>Number</option>
              <option value={'Boolean'}>Boolean</option>
              <option value={'ObjectId'}>ObjectId</option>
              <option value={'Date'}>Date</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl className={classes.formControl}>
            <Select native value={input.argsType} onChange={(event) => handleInputArgsTypeChange(event, index)}>
              <option aria-label="None" value="" />
              <option value={'query_params'}>Query params</option>
              <option value={'body'}>Body</option>
              <option value={'form_data'}>Form Data</option>
            </Select>
          </FormControl>
        </Grid>
      </Fragment>
    ));
  };

  const renderQueryOptions = () => {
    return selectedQueries.map((query, index) => (
      <Fragment key={`query-${index}`}>
        <Grid item xs={1}>
          <Typography>{index + 1}.</Typography>
        </Grid>
        <Grid item xs={3}>
          <FormControl className={classes.formControl}>
            <Select native value={query.field} onChange={(event) => handleQueryFieldChange(event, index)}>
              <option aria-label="None" value="" />
              {availableFieldsOfSchema.map((field, index) => (
                <option key={`idx-${index}-field`} value={field}>
                  {field}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl className={classes.formControl}>
            <Select native value={query.condition} onChange={(event) => handleQueryConditionChange(event, index)}>
              <option aria-label="None" value="" />
              <option value={ConditionsEnum.EQUAL}>(==) equal to</option>
              <option value={ConditionsEnum.NEQUAL}>(!=) not equal to</option>
              <option value={ConditionsEnum.GREATER}>{'(>) greater than'}</option>
              <option value={ConditionsEnum.GREATER_EQ}>{'(>=) greater that or equal to'}</option>
              <option value={ConditionsEnum.LESS}>{'(<) less than'}</option>
              <option value={ConditionsEnum.LESS_EQ}>{'(<=) less that or equal to'}</option>
              <option value={ConditionsEnum.EQUAL_SET}>(in) equal to any of the following</option>
              <option value={ConditionsEnum.NEQUAL_SET}>(not-in) not equal to any of the following</option>
              <option value={ConditionsEnum.CONTAIN}>(array-contains) an array containing</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl className={classes.formControl}>
            <Select native value={query.comparisonField} onChange={(event) => handleQueryComparisonFieldChange(event, index)}>
              <option aria-label="None" value="" />
              <option value={'Custom'}>Custom</option>
              <option value={'Schema Fields'}>Schema Fields</option>
              <option value={'Input Fields'}>Input Fields</option>
            </Select>
          </FormControl>
        </Grid>
      </Fragment>
    ));
  };

  const renderSaveSection = () => {
    return (
      <Grid container justify="flex-end" spacing={1} style={{ paddingTop: '30px' }}>
        <Grid item xs={4} md={2}>
          <Button variant="contained" color="secondary">
            Cancel
          </Button>
        </Grid>
        <Grid item xs={4} md={2}>
          <Button variant="contained" color="primary">
            Save
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderMainContent = () => {
    if (!selectedEndpoint) {
      return (
        <Box className={classes.mainContent}>
          <Typography>Select an endpoint to view more</Typography>
        </Box>
      );
    } else {
      return (
        <Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                variant={'outlined'}
                className={classes.textField}
                label={'Name'}
                value={name}
                onChange={handleNameChange}></TextField>
            </Grid>
            {renderOperationSection()}
            <Grid item xs={6} style={{ padding: '0 0 0 10px' }}>
              <Typography>Inputs</Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'end', padding: '0' }}>
              <Button
                variant="text"
                color={'primary'}
                className={classes.button}
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddInput}>
                Add another
              </Button>
            </Grid>
            <Grid item xs={12} style={{ padding: '0' }}>
              <Divider></Divider>
            </Grid>
            {renderInputsList()}
            <Grid item xs={12} style={{ padding: '0' }}>
              <Divider></Divider>
            </Grid>
            <Grid item xs={6} style={{ padding: '0 0 0 10px' }}>
              <Typography>Query</Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'end', padding: '0' }}>
              <Button
                variant="text"
                color={'primary'}
                className={classes.button}
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddQuery}>
                Add another
              </Button>
            </Grid>
            <Grid item xs={12} style={{ padding: '0' }}>
              <Divider></Divider>
            </Grid>
            {renderQueryOptions()}
            {renderSaveSection()}
          </Grid>
        </Box>
      );
    }
  };

  return (
    <Container>
      <Grid container spacing={2} className={classes.grid}>
        <Grid item xs={2}>
          {renderSideList()}
        </Grid>
        <Grid item xs={10}>
          {renderMainContent()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomQueries;