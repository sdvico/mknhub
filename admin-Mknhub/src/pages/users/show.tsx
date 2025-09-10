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
  Chip,
  Avatar,
} from "@mui/material";

interface CustomerShowModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
  id?: string | number;
}

export const CustomerShowModal: React.FC<CustomerShowModalProps> = ({
  modalProps,
  id,
}) => {
  const { isOpen, onClose } = modalProps;

  const { data, isLoading } = useOne({
    resource: "users",
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
              <Box display="flex" alignItems="center" mb={3}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#eee', mr: 2 }} />
                <Box>
                  <Box sx={{ height: 24, width: 200, bgcolor: '#eee', borderRadius: 1, mb: 1 }} />
                  <Box sx={{ height: 20, width: 100, bgcolor: '#eee', borderRadius: 999 }} />
                </Box>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Customer ID</Typography>
                  <Box sx={{ height: 20, width: 100, bgcolor: '#eee', borderRadius: 1, mb: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Username</Typography>
                  <Box sx={{ height: 20, width: 160, bgcolor: '#eee', borderRadius: 1, mb: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                  <Box sx={{ height: 20, width: 140, bgcolor: '#eee', borderRadius: 1, mb: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Created At</Typography>
                  <Box sx={{ height: 20, width: 160, bgcolor: '#eee', borderRadius: 1, mb: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Updated At</Typography>
                  <Box sx={{ height: 20, width: 160, bgcolor: '#eee', borderRadius: 1, mb: 2 }} />
                </Grid>
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

  const user = data?.data;

  const getStateColor = (state: number | undefined) => {
    if (state === 1) return "success";
    if (state === 0) return "default";
    return "default";
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Customer Details</DialogTitle>
      <DialogContent>
        {user && (
          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: "2rem",
                    bgcolor: "primary.main",
                    mr: 2,
                  }}
                >
                  {user.username?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {user.fullname || user.username}
                  </Typography>
                  <Chip
                    label={user.state === 1 ? "Active" : "Inactive"}
                    color={getStateColor(user.state) as any}
                    size="small"
                  />
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Customer ID
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    #{user.id}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Username
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user.username}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user.phone || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Updated At
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "N/A"}
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
