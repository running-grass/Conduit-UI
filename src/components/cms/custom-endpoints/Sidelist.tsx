import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircleOutline, Search } from '@material-ui/icons';
import EndpointsList from './EndpointsList';
import {
  asyncCreateCustomEndpoints,
  asyncDeleteCustomEndpoints,
  asyncGetCmsSchemas,
  asyncGetCustomEndpoints,
  asyncUpdateCustomEndpoints,
} from '../../../redux/slices/cmsSlice';
import { useAppDispatch } from '../../../redux/store';
import useDebounce from '../../../hooks/useDebounce';
import {
  endpointCleanSlate,
  setEndpointData,
  setSelectedEndPoint,
} from '../../../redux/slices/customEndpointsSlice';

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
      background: theme.palette.primary.main,
      borderRadius: '4px',
      margin: theme.spacing(0.5),
    },
  },
  button: {
    margin: theme.spacing(1),
    textTransform: 'none',
    color: 'white',
  },
  actions: {
    padding: theme.spacing(1),
  },
  formControl: {
    minWidth: 150,
  },
  noEndpoints: {
    textAlign: 'center',
    marginTop: '100px',
  },
  loadMore: {
    textAlign: 'center',
  },
}));

interface Props {
  action: { action: string; data: any };
  setAction: any;
  setEditMode: (edit: boolean) => void;
  setCreateMode: (create: boolean) => void;
}

const SideList: FC<Props> = ({ action, setAction, setEditMode, setCreateMode }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [operation, setOperation] = useState(-2);
  const debouncedSearch = useDebounce(search, 500);

  const getEndpointsCallback = useCallback(() => {
    dispatch(
      asyncGetCustomEndpoints({
        skip: 0,
        limit: 10,
        search,
        operation: operation !== -2 ? operation : undefined,
      })
    );
  }, [dispatch, search]);

  useEffect(() => {
    switch (action.action) {
      case 'edit':
        if (action.data.id && action.data.data) {
          asyncUpdateCustomEndpoints({
            _id: action.data.id,
            endpointData: action.data.data,
            getEndpoints: getEndpointsCallback,
          });
        }
        setAction({ action: '', data: {} });
        break;
      case 'create':
        if (action.data) {
          dispatch(
            asyncCreateCustomEndpoints({
              endpointData: action.data,
              getEndpoints: getEndpointsCallback,
            })
          );
        }
        setAction({ action: '', data: {} });
        break;
      case 'delete':
        if (action.data) {
          dispatch(
            asyncDeleteCustomEndpoints({ _id: action.data, getEndpoints: getEndpointsCallback })
          );
          break;
        }
        setAction({ action: '', data: {} });
      default:
        break;
    }
  }, [action, dispatch, getEndpointsCallback]);

  const handleListItemSelect = (endpoint: any) => {
    dispatch(setSelectedEndPoint(endpoint));
    dispatch(setEndpointData({ ...endpoint }));
    setCreateMode(false);
  };

  const handleAddNewEndpoint = () => {
    dispatch(endpointCleanSlate());
    setEditMode(true);
    setCreateMode(true);
  };

  return (
    <Box>
      <Grid className={classes.actions} spacing={1} container>
        <Grid item sm={5}>
          <TextField
            variant="outlined"
            name="Search"
            label="Find endpoint"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item sm={6}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Operation</InputLabel>
            <Select
              label="Provider"
              value={operation}
              onChange={(event) => setOperation(event.target.value as number)}>
              <MenuItem value={-2}>
                <em>All</em>
              </MenuItem>
              <MenuItem value={0}>GET</MenuItem>
              <MenuItem value={1}>POST</MenuItem>
              <MenuItem value={2}>PUT</MenuItem>
              <MenuItem value={3}>DELETE</MenuItem>
              <MenuItem value={4}>PATCH</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={1}>
          <IconButton color="secondary" onClick={handleAddNewEndpoint}>
            <AddCircleOutline />
          </IconButton>
        </Grid>
      </Grid>
      <Divider flexItem variant="middle" className={classes.divider} />
      <Box height="60vh">
        <EndpointsList
          handleListItemSelect={handleListItemSelect}
          search={debouncedSearch}
          operation={operation}
        />
      </Box>
    </Box>
  );
};

export default SideList;
