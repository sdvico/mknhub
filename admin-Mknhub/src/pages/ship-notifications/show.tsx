import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useShow, useOne, useCustom } from "@refinedev/core";
import { DateField } from "@refinedev/mui";
import customDataProvider from "../../dataProvider";
import {
  IShipNotification,
  ShipNotificationStatus,
  ShipNotificationType,
  NOTIFICATION_STATUS,
} from "../../interfaces/ship-notification";

interface ShipNotificationShowModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
  id: string;
}

const getStatusColor = (status: ShipNotificationStatus) => {
  switch (status) {
    case NOTIFICATION_STATUS.QUEUED:
      return "default";
    case NOTIFICATION_STATUS.SENDING:
      return "info";
    case NOTIFICATION_STATUS.SENT:
      return "primary";
    case NOTIFICATION_STATUS.DELIVERED:
      return "success";
    case NOTIFICATION_STATUS.FAILED:
      return "error";
    default:
      return "default";
  }
};

const getTypeColor = (type: ShipNotificationType) => {
  switch (type) {
    case "NORMAL":
      return "default";
    case "MKN_2H":
      return "info";
    case "MKN_5H":
      return "info";
    case "MKN_6H":
      return "warning";
    case "MKN_8D":
      return "error";
    case "MKN_10D":
      return "error";
    case "KNL":
      return "success";
    default:
      return "default";
  }
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="textSecondary" component="div">
      {label}
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

export const ShipNotificationShowModal: React.FC<
  ShipNotificationShowModalProps
> = ({ modalProps, id }) => {
  const { isOpen, onClose } = modalProps;
  const [isResending, setIsResending] = React.useState(false);

  const { queryResult } = useShow<IShipNotification>({
    resource: "ship-notifications",
    id,
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  const handleResendNotification = async () => {
    setIsResending(true);
    try {
      await customDataProvider.custom({
        url: `v1/ship-notifications/${id}/resend`,
        method: "POST",
        headers: {
          "x-api-key": "446655440001",
        },
      });

      // Refresh the data
      queryResult.refetch?.();

      alert("Notification resent successfully!");
    } catch (error) {
      console.error("Failed to resend notification:", error);
      alert("Failed to resend notification");
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Loading...</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    Ship Code
                  </Typography>
                  <Box
                    sx={{
                      height: 20,
                      width: 180,
                      bgcolor: "#eee",
                      borderRadius: 1,
                      mt: 0.5,
                    }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    Type
                  </Typography>
                  <Box
                    sx={{
                      height: 28,
                      width: 120,
                      bgcolor: "#eee",
                      borderRadius: 999,
                      mt: 0.5,
                    }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box
                    sx={{
                      height: 28,
                      width: 120,
                      bgcolor: "#eee",
                      borderRadius: 999,
                      mt: 0.5,
                    }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    Created At
                  </Typography>
                  <Box
                    sx={{
                      height: 20,
                      width: 160,
                      bgcolor: "#eee",
                      borderRadius: 1,
                      mt: 0.5,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    Owner Name
                  </Typography>
                  <Box
                    sx={{
                      height: 20,
                      width: 200,
                      bgcolor: "#eee",
                      borderRadius: 1,
                      mt: 0.5,
                    }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    Owner Phone
                  </Typography>
                  <Box
                    sx={{
                      height: 20,
                      width: 160,
                      bgcolor: "#eee",
                      borderRadius: 1,
                      mt: 0.5,
                    }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    Content
                  </Typography>
                  <Box
                    sx={{
                      height: 56,
                      width: "100%",
                      bgcolor: "#eee",
                      borderRadius: 1,
                      mt: 0.5,
                    }}
                  />
                </Box>
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

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Notification Details</DialogTitle>
      <DialogContent>
        {record && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoRow label="Ship Code" value={record.ship_code} />
                <InfoRow
                  label="Type"
                  value={
                    <Chip
                      label={record.type}
                      color={getTypeColor(record.type)}
                      size="small"
                    />
                  }
                />
                <InfoRow
                  label="Status"
                  value={
                    <Chip
                      label={record.status}
                      color={getStatusColor(
                        record.status as ShipNotificationStatus
                      )}
                      size="small"
                    />
                  }
                />
                <InfoRow label="Owner Name" value={record.owner_name} />
                <InfoRow label="Owner Phone" value={record.owner_phone} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoRow
                  label="Occurred At"
                  value={<DateField value={record.occurred_at} format="LLL" />}
                />
                <InfoRow
                  label="Created At"
                  value={
                    record.created_at && (
                      <DateField value={record.created_at} format="LLL" />
                    )
                  }
                />
                <InfoRow label="Request ID" value={record.requestId || "N/A"} />
                <InfoRow label="Client Request ID" value={record.clientReq} />
                <InfoRow
                  label="Boundary Status"
                  value={
                    <Box>
                      {record.boundary_crossed && (
                        <Chip
                          label="Boundary Crossed"
                          color="error"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      )}
                      {record.boundary_near_warning && (
                        <Chip
                          label="Near Boundary"
                          color="warning"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      )}
                      {record.boundary_status_code && (
                        <Chip
                          label={
                            record.boundary_status_code === "PERMISSION_001"
                              ? "Allowed"
                              : "Not Allowed"
                          }
                          color={
                            record.boundary_status_code === "PERMISSION_001"
                              ? "success"
                              : "default"
                          }
                          size="small"
                        />
                      )}
                    </Box>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <InfoRow
                  label="Content"
                  value={
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-wrap",
                        bgcolor: "grey.100",
                        p: 2,
                        borderRadius: 1,
                      }}
                    >
                      {record.content}
                    </Typography>
                  }
                />
                {record.formatted_message && (
                  <InfoRow
                    label="Formatted Message"
                    value={
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", mt: 1 }}
                      >
                        {record.formatted_message}
                      </Typography>
                    }
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleResendNotification}
          disabled={isResending}
          variant="contained"
          color="primary"
          startIcon={isResending ? <CircularProgress size={16} /> : undefined}
        >
          {isResending ? "Resending..." : "Resend Notification"}
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
