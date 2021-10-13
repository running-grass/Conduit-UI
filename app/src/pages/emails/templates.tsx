import React, { ReactElement, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import EmailsLayout from '../../components/navigation/InnerLayouts/emailsLayout';
import {
  asyncCreateNewEmailTemplate,
  asyncGetEmailTemplates,
  asyncSaveEmailTemplateChanges,
} from '../../redux/slices/emailsSlice';
import DataTable from '../../components/common/DataTable';
import { EmailTemplateType } from '../../models/emails/EmailModels';
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import DrawerWrapper from '../../components/navigation/SideDrawerWrapper';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import TabPanel from '../../components/emails/TabPanel';
import { CallMissedOutgoing } from '@material-ui/icons';
import useDebounce from '../../hooks/useDebounce';
import { SyncAlt } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  btnAlignment: {
    marginLeft: theme.spacing(1),
  },
  btnAlignment2: {
    marginRight: theme.spacing(1),
  },
  actions: {
    marginBottom: theme.spacing(1),
  },
}));

const Templates = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState<string>('');
  const [drawer, setDrawer] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>([]);
  const [viewTemplate, setViewTemplate] = useState<any>('');
  const [create, setCreate] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  const debouncedSearch: string = useDebounce(search, 500);

  useEffect(() => {
    dispatch(asyncGetEmailTemplates());
  }, [dispatch]);

  const { templateDocuments } = useAppSelector((state) => state.emailsSlice.data);

  const newTemplate = () => {
    setViewTemplate('');
    setCreate(true);
    setEdit(true);
    setDrawer(true);
  };

  const handleSelect = (id: string) => {
    const newSelectedTemplates = [...selectedTemplate];

    if (selectedTemplate.includes(id)) {
      const index = newSelectedTemplates.findIndex((newId) => newId === id);
      newSelectedTemplates.splice(index, 1);
    } else {
      newSelectedTemplates.push(id);
    }
    setSelectedTemplate(newSelectedTemplates);
  };

  const handleSelectAll = (data: any) => {
    if (selectedTemplate.length === templateDocuments.length) {
      setSelectedTemplate([]);
      return;
    }
    const newSelectedUsers = data.map((item: any) => item._id);
    setSelectedTemplate(newSelectedUsers);
  };

  const handleCloseDrawer = () => {
    setEdit(false);
    setCreate(false);
    setDrawer(false);
    setViewTemplate('');
  };

  const saveTemplateChanges = (data: any) => {
    const _id = data._id;
    const updatedData = {
      name: data.name,
      subject: data.subject,
      body: data.body,
      variables: data.variables,
    };

    dispatch(asyncSaveEmailTemplateChanges({ _id, data: updatedData }));
  };

  const createNewTemplate = (data: any) => {
    const newData = {
      name: data.name,
      subject: data.subject,
      body: data.body,
      variables: data.variables,
    };
    dispatch(asyncCreateNewEmailTemplate(newData));
  };

  const formatData = (data: EmailTemplateType[]) => {
    return data.map((u) => {
      return {
        _id: u._id,
        Name: u.name,
        External: '--',
        Synced: '--',
        'Updated At': u.updatedAt,
      };
    });
  };

  //Actions section

  const handleAction = (action: { title: string; type: string }, data: any) => {
    const currentTemplate = templateDocuments.find((user) => user._id === data._id);
    if (action.type === 'view') {
      setViewTemplate(currentTemplate);
      setEdit(false);
      setDrawer(true);
    }
    if (action.type === 'delete') {
      console.log('delete');
    }
    if (action.type === 'sync') {
      console.log('sync');
    }
    if (action.type === 'upload') {
      console.log('upload');
    }
  };

  const toDelete = {
    title: 'Delete',
    type: 'delete',
  };

  const toUpload = {
    title: 'Upload',
    type: 'upload',
  };

  const toSync = {
    title: 'Sync',
    type: 'sync',
  };

  const toView = {
    title: 'View',
    type: 'view',
  };

  const actions = [toDelete, toUpload, toSync, toView];

  return (
    <div>
      <Grid container item xs={12} justify="space-between" className={classes.actions}>
        <Grid item>
          <TextField
            size="small"
            variant="outlined"
            value={search}
            label="Find template"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item spacing={2}>
          <IconButton color="primary" className={classes.btnAlignment}>
            <SyncAlt />
          </IconButton>
          <Button
            className={classes.btnAlignment2}
            variant="contained"
            color="secondary"
            startIcon={<CallMissedOutgoing />}>
            Import Template
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutline />}
            onClick={() => newTemplate()}>
            New Template
          </Button>
        </Grid>
      </Grid>
      {templateDocuments.length > 0 && (
        <DataTable
          dsData={formatData(templateDocuments)}
          actions={actions}
          handleAction={handleAction}
          handleSelect={handleSelect}
          handleSelectAll={handleSelectAll}
          selectedItems={selectedTemplate}
        />
      )}
      <DrawerWrapper
        open={drawer}
        closeDrawer={() => handleCloseDrawer()}
        width={700}
        handleAction={handleAction}>
        <Box>
          <Typography
            variant="h6"
            color="primary"
            style={{ marginTop: '30px', textAlign: 'center' }}>
            {!create ? 'Edit your template' : 'Create an email template'}{' '}
          </Typography>
          <TabPanel
            handleCreate={createNewTemplate}
            handleSave={saveTemplateChanges}
            template={viewTemplate}
            edit={edit}
            setEdit={setEdit}
            create={create}
            setCreate={setCreate}
          />
        </Box>
      </DrawerWrapper>
    </div>
  );
};

Templates.getLayout = function getLayout(page: ReactElement) {
  return <EmailsLayout>{page}</EmailsLayout>;
};

export default Templates;
