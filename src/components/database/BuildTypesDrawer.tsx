import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import SimpleForm from './types/SimpleType/SimpleForm';
import BooleanForm from './types/BooleanType/BooleanForm';
import GroupForm from './types/GroupType/GroupForm';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EnumForm from './types/EnumType/EnumForm';
import ObjectIdForm from './types/ObjectIdType/ObjectIdForm';
import RelationForm from './types/RelationType/RelationForm';
import { IDrawerData } from '../../models/database/BuildTypesModels';

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: '25%',
    alignItems: 'center',
  },
  duplicateId: {
    color: 'red',
    marginBottom: theme.spacing(2),
  },
  title: {
    width: '100%',
    padding: theme.spacing(2),
    fontWeight: 'bold',
    borderBottom: '1px solid',
    borderColor: theme.palette.primary.main,
  },
}));

interface Props {
  // drawerData: IDrawerData;
  disabledProps: boolean;
  drawerData: any; //todo fix this
  readOnly: boolean;
  onSubmit: (data: any) => void;
  onClose: () => void;
  selectedItem: any;
  duplicateId: boolean;
  invalidName: boolean;
}

const BuildTypesDrawer: FC<Props> = ({
  disabledProps,
  drawerData,
  readOnly,
  onSubmit,
  onClose,
  selectedItem,
  duplicateId,
  invalidName,
  ...rest
}) => {
  const classes = useStyles();

  const handleForm = (data: IDrawerData) => {
    switch (data.type) {
      case 'Text':
        return (
          <SimpleForm
            disabledProps={disabledProps}
            readOnly={readOnly}
            onSubmit={onSubmit}
            drawerData={drawerData}
            onClose={onClose}
            selectedItem={selectedItem}
          />
        );
      case 'Number':
        return (
          <SimpleForm
            disabledProps={disabledProps}
            readOnly={readOnly}
            onSubmit={onSubmit}
            drawerData={drawerData}
            onClose={onClose}
            selectedItem={selectedItem}
          />
        );
      case 'Date':
        return (
          <SimpleForm
            disabledProps={disabledProps}
            readOnly={readOnly}
            onSubmit={onSubmit}
            drawerData={drawerData}
            onClose={onClose}
            selectedItem={selectedItem}
          />
        );
      case 'Enum':
        return (
          <EnumForm
            disabledProps={disabledProps}
            readOnly={readOnly}
            onSubmit={onSubmit}
            drawerData={drawerData}
            onClose={onClose}
            selectedItem={selectedItem}
          />
        );
      case 'Boolean':
        return (
          <BooleanForm
            disabledProps={disabledProps}
            readOnly={readOnly}
            onSubmit={onSubmit}
            drawerData={drawerData}
            onClose={onClose}
            selectedItem={selectedItem}
          />
        );
      case 'ObjectId':
        return (
          <ObjectIdForm
            disabledProps={disabledProps}
            readOnly={readOnly}
            onSubmit={onSubmit}
            drawerData={drawerData}
            onClose={onClose}
            selectedItem={selectedItem}
          />
        );
      case 'Group':
        return (
          <GroupForm
            disabledProps={disabledProps}
            readOnly={readOnly}
            onSubmit={onSubmit}
            drawerData={drawerData}
            onClose={onClose}
            selectedItem={selectedItem}
          />
        );
      case 'Relation':
        return (
          <RelationForm
            disabledProps={disabledProps}
            readOnly={readOnly}
            onSubmit={onSubmit}
            drawerData={drawerData}
            onClose={onClose}
            selectedItem={selectedItem}
          />
        );
      default:
        return (
          <Box>
            <Typography>Something went wrong</Typography>
            <Button onClick={onClose} color="primary">
              Go Back
            </Button>
          </Box>
        );
    }
  };

  return (
    <Drawer
      anchor="right"
      open={drawerData.open}
      classes={{ paper: classes.drawerPaper }}
      {...rest}>
      <Typography variant={'subtitle1'} className={classes.title}>
        Configuration of {drawerData.type} field
      </Typography>
      {handleForm(drawerData)}
      {duplicateId && (
        <Box textAlign={'center'}>
          <Typography variant={'button'} className={classes.duplicateId}>
            Warning! Duplicate Field name
          </Typography>
          <Typography variant={'body1'}>Please provide a unique field name</Typography>
        </Box>
      )}
      {invalidName && (
        <Box textAlign={'center'}>
          <Typography variant={'button'} className={classes.duplicateId}>
            Warning! Invalid Field name
          </Typography>
          <Typography variant={'body1'}>Field name type is forbidden</Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default BuildTypesDrawer;