import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';

interface Props {
  open: boolean;
  name: string;
  setName: (value: string) => void;
  handleClose: () => void;
  handleCreate: () => void;
}

const CreateServiceAccount: React.FC<Props> = ({
  open,
  name,
  setName,
  handleClose,
  handleCreate,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">New Service Account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Provide a service name for your new service account and click the create button
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="serviceName"
          label="Service name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary" disabled={!name}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateServiceAccount;
