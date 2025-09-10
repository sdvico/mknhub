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
} from "@mui/material";
import { useShow } from "@refinedev/core";
import { DateField } from "@refinedev/mui";
import { IShipNotificationEvent } from "../../interfaces/ship-notification-event";

interface ShipNotificationEventShowModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
  id: string;
}

const getTypeColor = (type: string | null | undefined) => {
  switch (type) {
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
    case "BOUNDARY_NEAR":
      return "warning";
    case "BOUNDARY_CROSSED":
      return "error";
    default:
      return "default";
  }
};

const getStatusColor = (isResolved: boolean) => {
  return isResolved ? "success" : "error";
};

const formatDuration = (minutes: number | undefined) => {
  if (!minutes) return "N/A";
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours} hours ${remainingMinutes} minutes`
    : `${hours} hours`;
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

export const ShipNotificationEventShowModal: React.FC<
  ShipNotificationEventShowModalProps
> = ({ modalProps, id }) => {
  const { isOpen, onClose } = modalProps;

  const { queryResult } = useShow<IShipNotificationEvent>({
    resource: "ship-notification-events",
    id,
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

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
                    Event Type
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
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    Started At
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
                    Duration
                  </Typography>
                  <Box
                    sx={{
                      height: 20,
                      width: 120,
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
      <DialogTitle>Event Details</DialogTitle>
      <DialogContent>
        {record && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoRow label="Ship Code" value={record.ship_code} />
                <InfoRow
                  label="Event Type"
                  value={
                    <Chip
                      label={record.type || "N/A"}
                      color={getTypeColor(record.type) as any}
                      size="small"
                    />
                  }
                />
                <InfoRow
                  label="Status"
                  value={
                    <Chip
                      label={record.is_resolved ? "Resolved" : "Open"}
                      color={getStatusColor(record.is_resolved) as any}
                      size="small"
                    />
                  }
                />
                <InfoRow
                  label="Response Time (from 6H)"
                  value={
                    record.response_minutes_from_6h
                      ? `${record.response_minutes_from_6h} minutes`
                      : "N/A"
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoRow
                  label="Started At"
                  value={
                    record.started_at ? (
                      <DateField value={record.started_at} format="LLL" />
                    ) : (
                      "N/A"
                    )
                  }
                />
                <InfoRow
                  label="Resolved At"
                  value={
                    record.resolved_at ? (
                      <DateField value={record.resolved_at} format="LLL" />
                    ) : (
                      "Not resolved"
                    )
                  }
                />
                <InfoRow
                  label="User Report Time"
                  value={
                    record.user_report_time ? (
                      <DateField value={record.user_report_time} format="LLL" />
                    ) : (
                      "No user report"
                    )
                  }
                />
                <InfoRow
                  label="Duration"
                  value={formatDuration(record.duration_minutes)}
                />
              </Grid>
              <Grid item xs={12}>
                <InfoRow
                  label="Created At"
                  value={<DateField value={record.created_at} format="LLL" />}
                />
                <InfoRow
                  label="Updated At"
                  value={<DateField value={record.updated_at} format="LLL" />}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
