import React, { FC } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { EmailUI } from '../../models/emails/EmailModels';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import DataTable from '../common/DataTable';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { asyncGetStorageFile } from '../../redux/slices/storageSlice';
import { useAppDispatch } from '../../redux/store';

const useStyles = makeStyles((theme) => ({
  topContainer: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  createButton: {
    marginRight: theme.spacing(1),
  },
  pathContainer: {
    display: 'flex',
  },
  pathItem: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

interface Props {
  containers: any;
  containerData: any;
  path: string;
  handleAdd: any;
  handleCreate: any;
  handlePathClick: (value: string) => void;
}

const StorageTable: FC<Props> = ({
  containers,
  containerData,
  path,
  handleAdd,
  handleCreate,
  handlePathClick,
}) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const formatData = () => {
    if (path === '/')
      return containers.map((item: any) => {
        return {
          icon: <FolderOpenIcon />,
          Name: item.name,
          isPublic: item.isPublic,
        };
      });
    return containerData.map((item: any) => {
      return {
        icon: item.isFile ? <DescriptionIcon /> : <FolderIcon />,
        Name: item.name,
        isPublic: item.isPublic,
        mimeType: item.mimeType,
      };
    });
  };

  const handleAction = (action: { title: string; type: string }, data: EmailUI) => {
    // const currentTemplate = templateDocuments?.find((template) => template._id === data._id);
    // if (currentTemplate !== undefined) {
    //   if (action.type === 'delete') {
    //     //handle delete
    //   }
    // }
  };

  const deleteAction = {
    title: 'Delete',
    type: 'delete',
  };

  const actions = [deleteAction];

  const containerHeaders = [{ title: '' }, { title: 'Name' }, { title: 'is Public' }];
  const headers = [{ title: '' }, { title: 'Name' }, { title: 'is Public' }, { title: 'mimeType' }];

  const onPathClick = (item: string, index?: number) => {
    // if (containerData.length > 0) {
    const file = containerData.find((itemFile: any) => itemFile.name === item);

    if (file) {
      dispatch(asyncGetStorageFile(file._id));
      return;
    }
    const splitPath = path.split('/');
    if (index === splitPath.length - 1) return;
    if (index && splitPath.length - index >= 2) {
      const newPath = splitPath.slice(0, index);
      handlePathClick(`${newPath.join('/')}/${item}`);
      return;
    }
    if (index === 0) {
      handlePathClick('/');
      return;
    }
    if (splitPath[1]) {
      handlePathClick(`${path}/${item}`);
      return;
    }
    handlePathClick(`${path}${item}`);
  };

  return (
    <>
      <Grid container item xs={12} className={classes.topContainer}>
        <Grid item className={classes.pathContainer}>
          {path.split('/').map((item, index) => {
            return (
              <Typography
                variant="subtitle1"
                className={classes.pathItem}
                onClick={() => onPathClick(item, index)}
                key={index}>
                {index === 0 ? '..' : `/${item}`}
              </Typography>
            );
          })}
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            className={classes.createButton}
            startIcon={<AddCircleOutline />}
            onClick={() => handleCreate()}>
            Create
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCircleOutline />}
            onClick={() => handleAdd()}>
            {/*onClick={() => dispatch(asyncGetStorageFiles())}>*/}
            Add
          </Button>
        </Grid>
      </Grid>
      <DataTable
        dsData={formatData()}
        actions={actions}
        handleAction={handleAction}
        selectable={false}
        handleRowClick={(value) => onPathClick(value.Name)}
        headers={path === '/' ? containerHeaders : headers}
      />
      {/*{templateDocuments.length > 0 && (*/}
      {/*  <Grid container style={{ marginTop: '-8px' }}>*/}
      {/*    <Grid item xs={7} />*/}
      {/*    <Grid item xs={5}>*/}
      {/*      <Paginator*/}
      {/*        handlePageChange={handlePageChange}*/}
      {/*        limit={limit}*/}
      {/*        handleLimitChange={handleLimitChange}*/}
      {/*        page={page}*/}
      {/*        count={totalCount}*/}
      {/*      />*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*)}*/}
    </>
  );
};

export default StorageTable;
