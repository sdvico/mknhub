import React from "react";
import { useOne } from "@refinedev/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

interface AgencyShowModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
  id?: string | number;
}

export const AgencyShowModal: React.FC<AgencyShowModalProps> = ({
  modalProps,
  id,
}) => {
  const { isOpen, onClose } = modalProps;

  const { data, isLoading } = useOne({
    resource: "agencies",
    id: id || "",
    queryOptions: { enabled: !!id && isOpen },
  });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Loading...</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">ID</Typography>
                <Box sx={{ height: 20, width: 120, bgcolor: '#eee', borderRadius: 1, mb: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">Name</Typography>
                <Box sx={{ height: 20, width: 200, bgcolor: '#eee', borderRadius: 1, mb: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">Code</Typography>
                <Box sx={{ height: 20, width: 160, bgcolor: '#eee', borderRadius: 1, mb: 2 }} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const agency = data?.data;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Agency Details</DialogTitle>
      <DialogContent>
        {agency && (
          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    ID
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {agency.id}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Name
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {agency.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Code
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {agency.code}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
