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

interface DeviceShowModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
  id?: string | number;
}

export const DeviceShowModal: React.FC<DeviceShowModalProps> = ({
  modalProps,
  id,
}) => {
  const { isOpen, onClose } = modalProps;

  const { data, isLoading } = useOne({
    resource: "devices",
    id: id || "",
    queryOptions: {
      enabled: !!id && isOpen,
    },
  });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Loading...</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Grid item xs={12} md={6} key={i}>
                    <Typography variant="subtitle2" color="textSecondary">&nbsp;</Typography>
                    <Box sx={{ height: 20, width: '70%', bgcolor: '#eee', borderRadius: 1, mb: 2 }} />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const device = data?.data;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Device Details</DialogTitle>
      <DialogContent>
        {device && (
          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Device Name
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {device.name || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Serial Number
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {device.serialNumber || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {device.description || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    IMEI
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {device.imei || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Plate Number
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {device.plateNumber || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Device Status
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {device.deviceStatus || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Data Status
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {device.dataStatus || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Current Fee
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {device.currentFee ? `$${device.currentFee}` : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Expiry Date
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {device.expiryDate || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {device.createdAt ? new Date(device.createdAt).toLocaleDateString() : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Updated At
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {device.updatedAt ? new Date(device.updatedAt).toLocaleDateString() : "N/A"}
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
