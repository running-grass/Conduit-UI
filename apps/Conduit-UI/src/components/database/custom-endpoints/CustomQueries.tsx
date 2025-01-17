import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Grid, IconButton, TextField, Typography } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import {
  findFieldsWithTypes,
  getAvailableFieldsOfSchema,
  hasInvalidAssignments,
  hasInvalidInputs,
  hasInvalidQueries,
  prepareQuery,
} from '../../../utils/cms';
import { OperationsEnum } from '../../../models/OperationsEnum';
import { ConfirmationDialog } from '@conduitplatform/ui-components';
import OperationSection from './OperationSection';
import SideList from './Sidelist';
import SaveSection from './SaveSection';
import QueriesSection from './QueriesSection';
import AssignmentsSection from './AssignmentsSection';
import InputsSection from './InputsSection';
import { v4 as uuidv4 } from 'uuid';
import {
  setEndpointData,
  setSchemaFields,
  setSelectedEndPoint,
} from '../../../redux/slices/customEndpointsSlice';
import { Schema } from '../../../models/database/CmsModels';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import {
  asyncCreateCustomEndpoints,
  asyncDeleteCustomEndpoints,
  asyncUpdateCustomEndpoints,
} from '../../../redux/slices/databaseSlice';

const CustomQueries: FC = () => {
  const dispatch = useAppDispatch();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const { filters } = useAppSelector((state) => state.databaseSlice.data.customEndpoints);
  const { endpoints } = useAppSelector((state) => state.databaseSlice.data.customEndpoints);
  const {
    schemas: { schemaDocuments },
  } = useAppSelector((state) => state.databaseSlice.data);
  const { endpoint, selectedEndpoint } = useAppSelector((state) => state.customEndpointsSlice.data);

  const initializeData = useCallback(() => {
    if (selectedEndpoint) {
      const fields = getAvailableFieldsOfSchema(selectedEndpoint.selectedSchema, schemaDocuments);
      let inputs = [];
      const queryGroup: any = [];
      let assignments = [];
      let fieldsWithTypes = [];
      if (fields) {
        fieldsWithTypes = findFieldsWithTypes(fields);
      }

      if (selectedEndpoint.query) {
        const query = selectedEndpoint.query;

        const keys = Object.keys(query);
        keys.forEach((k) => {
          const nodeLevel1 = query[k];
          const nodeLevel1Queries = nodeLevel1.map((q: any) => {
            const keys = Object.keys(q);
            const isOperator = keys.includes('AND') || keys.includes('OR');
            if (isOperator) {
              return { _id: uuidv4(), operator: keys[0], queries: q[keys[0]] };
            } else {
              return { _id: uuidv4(), ...q };
            }
          });

          const lvl2Node = nodeLevel1Queries.find((q: any) => 'operator' in q);
          if (lvl2Node) {
            const nodeLevel2Queries = lvl2Node.queries.map((q: any) => {
              const keys = Object.keys(q);
              const isOperator = keys.includes('AND') || keys.includes('OR');
              if (isOperator) {
                return { _id: uuidv4(), operator: keys[0], queries: q[keys[0]] };
              } else {
                return { _id: uuidv4(), ...q };
              }
            });
            lvl2Node.queries = [...nodeLevel2Queries];

            const lvl3Node = nodeLevel2Queries.find((q: any) => 'operator' in q);
            if (lvl3Node) {
              const nodeLevel3Queries = lvl3Node.queries.map((q: any) => ({
                _id: uuidv4(),
                ...q,
              }));
              lvl3Node.queries = [...nodeLevel3Queries];
            }
          }
          queryGroup.push({
            _id: uuidv4(),
            operator: k,
            queries: [...nodeLevel1Queries],
          });
        });
      }

      if (selectedEndpoint.assignments) {
        assignments = selectedEndpoint.assignments.map((q: any) => ({ ...q }));
      }
      if (selectedEndpoint.inputs) {
        inputs = selectedEndpoint.inputs.map((i: any) => ({ ...i }));
      }

      dispatch(
        setEndpointData({
          queries: queryGroup,
          inputs,
          assignments,
        })
      );
      dispatch(setSchemaFields(fieldsWithTypes));
    }
  }, [dispatch, schemaDocuments, selectedEndpoint]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleConfirmationDialogClose = () => {
    setConfirmationOpen(false);
  };

  const handleDeleteClick = () => {
    setConfirmationOpen(true);
  };

  const handleEditClick = () => {
    setEditMode(true);
    setCreateMode(false);
  };

  const handleSubmit = (edit = false) => {
    const schemaToSubmit = schemaDocuments.find(
      (schemaDocument: Schema) => schemaDocument._id === endpoint.selectedSchema
    );

    const query = prepareQuery(endpoint.queries);

    const data = {
      name: endpoint.name,
      operation: Number(endpoint.operation),
      selectedSchema: schemaToSubmit?._id,
      authentication: endpoint.authentication,
      paginated: endpoint.paginated,
      sorted: endpoint.sorted,
      inputs: endpoint.inputs,
      query,
      assignments: endpoint.assignments,
    };

    if (edit) {
      const _id = selectedEndpoint._id;
      dispatch(asyncUpdateCustomEndpoints({ _id, endpointData: data }));
      dispatch(setSelectedEndPoint(''));
    } else {
      dispatch(
        asyncCreateCustomEndpoints({
          endpointData: data,
          filters,
          endpointsLength: endpoints.length,
        })
      );
      dispatch(setSelectedEndPoint(''));
    }
    setCreateMode(false);
    setEditMode(false);
  };

  const handleCancelClick = () => {
    setCreateMode(false);
    setEditMode(false);
    initializeData();
  };

  const handleDeleteConfirmed = () => {
    handleConfirmationDialogClose();
    dispatch(setSelectedEndPoint(undefined));
    dispatch(asyncDeleteCustomEndpoints({ _id: selectedEndpoint._id }));
  };

  const handleNameChange = (event: any) => {
    dispatch(setEndpointData({ name: event.target.value }));
  };

  const disableSubmit = () => {
    if (!endpoint.name) return true;
    if (!endpoint.selectedSchema) return true;
    if (endpoint.operation === -1) return true;

    let invalidQueries;
    let invalidAssignments;

    if (endpoint.operation === OperationsEnum.POST) {
      if (!endpoint.assignments || endpoint.assignments.length === 0) return true;
      invalidAssignments = hasInvalidAssignments(endpoint.assignments);
    }
    if (endpoint.operation === OperationsEnum.PUT) {
      if (!endpoint.queries || endpoint.queries.length === 0) return true;
      invalidQueries = hasInvalidQueries(endpoint.queries);
      if (!endpoint.assignments || endpoint.assignments.length === 0) return true;
      invalidAssignments = hasInvalidAssignments(endpoint.assignments);
    }
    if (endpoint.operation === OperationsEnum.PATCH) {
      if (!endpoint.queries || endpoint.queries.length === 0) return true;
      invalidQueries = hasInvalidQueries(endpoint.queries);
      if (!endpoint.assignments || endpoint.assignments.length < 1) return true;
      invalidAssignments = hasInvalidAssignments(endpoint.assignments);
    }
    if (endpoint.operation === OperationsEnum.DELETE) {
      if (!endpoint.queries || endpoint.queries.length === 0) return true;
      invalidQueries = hasInvalidQueries(endpoint.queries);
    }
    if (endpoint.operation === OperationsEnum.GET) {
      if (!endpoint.queries || endpoint.queries.length === 0) return true;
      invalidQueries = hasInvalidQueries(endpoint.queries);
    }

    if (invalidQueries || invalidAssignments) {
      return true;
    }
    const invalidInputs = hasInvalidInputs(endpoint.inputs);
    if (invalidInputs) {
      return true;
    }
  };

  const renderSaveSection = () => {
    if (!editMode && !createMode) {
      return null;
    }

    return (
      <SaveSection
        editMode={editMode}
        createMode={createMode}
        disableSubmit={disableSubmit()}
        handleSaveClick={() => handleSubmit(true)}
        handleCreateClick={() => handleSubmit(false)}
        handleCancelClick={handleCancelClick}
      />
    );
  };

  const renderDetails = () => {
    if (!endpoint.selectedSchema || endpoint.operation === -1) return null;
    return (
      <>
        <InputsSection editMode={editMode} />
        {endpoint.operation !== OperationsEnum.POST && <QueriesSection editMode={editMode} />}
        {(endpoint.operation === OperationsEnum.PUT ||
          endpoint.operation === OperationsEnum.POST ||
          endpoint.operation === OperationsEnum.PATCH) && (
          <AssignmentsSection editMode={editMode} />
        )}
      </>
    );
  };

  const renderMainContent = () => {
    if (!selectedEndpoint && !createMode) {
      return (
        <Box sx={{ marginTop: '100px', textAlign: 'center' }}>
          <Typography variant="h6">Select an endpoint to view more</Typography>
        </Box>
      );
    } else {
      return (
        <Box>
          <Grid
            container
            sx={{ maxHeight: '72vh', overflowY: 'auto', alignItems: 'center', paddingTop: '3px' }}
            spacing={2}
            alignItems="flex-end">
            <Grid item xs={5}>
              <TextField
                size="small"
                disabled={!editMode}
                fullWidth
                variant={'outlined'}
                label={'Name'}
                value={endpoint.name}
                onChange={handleNameChange}
              />
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={5} sx={{ textAlign: 'end' }}>
              {!editMode && (
                <IconButton aria-label="delete" onClick={handleDeleteClick} size="large">
                  <Delete color="error" />
                </IconButton>
              )}
              {!editMode && (
                <IconButton
                  color="secondary"
                  aria-label="edit"
                  onClick={handleEditClick}
                  size="large">
                  <Edit />
                </IconButton>
              )}
            </Grid>
            <OperationSection
              schemas={schemaDocuments}
              editMode={editMode}
              availableSchemas={schemaDocuments}
            />
            {renderDetails()}
          </Grid>
          {renderSaveSection()}
        </Box>
      );
    }
  };

  return (
    <Box sx={{ ml: 4, mr: 4, overflow: ' hidden ' }}>
      <Grid container spacing={2} sx={{ background: 'rgba(0, 0, 0, 0.05)', borderRadius: 7, p: 3 }}>
        <Grid item xs={3}>
          <SideList setEditMode={setEditMode} setCreateMode={setCreateMode} filters={filters} />
        </Grid>
        <Grid item xs={9}>
          {renderMainContent()}
        </Grid>
      </Grid>
      <ConfirmationDialog
        buttonText={'Delete'}
        open={confirmationOpen}
        title={'Custom Endpoint Deletion'}
        description={`You are about to
        delete custom endpoint with name:${selectedEndpoint?.name}`}
        handleClose={handleConfirmationDialogClose}
        buttonAction={handleDeleteConfirmed}
      />
    </Box>
  );
};

export default CustomQueries;
