import React from "react";
import { useTranslate } from "@refinedev/core";
import { useDataGrid } from "@refinedev/mui";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  SignalCellularAlt as SignalIcon,
} from "@mui/icons-material";
import { DateField } from "@refinedev/mui";
import type { IDevice } from "../../../interfaces";

type Props = ReturnType<typeof useDataGrid<IDevice>> & {
  onEdit?: (id: string | number) => void;
  onShow?: (id: string | number) => void;
};

export const DeviceListCard = (props: Props) => {
  const { dataGridProps, onEdit, onShow } = props;
  const t = useTranslate();

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "success":
        return "success";
      case "inactive":
      case "failed":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={2}>
      {dataGridProps.rows?.map((device: IDevice) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={device.id}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontSize: "16px",
                    fontWeight: "700",
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  {device.imei}
                </Typography>
                <Chip
                  label={device.deviceStatus || device.status || "Unknown"}
                  color={
                    getStatusColor(device.deviceStatus || device.status) as any
                  }
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Name:</strong> {device.name || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Plate Number:</strong> {device.plateNumber || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Ship:</strong> {device.shipName || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Package:</strong> {device.packageName || "No Package"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Expiry:</strong>{" "}
                  {device.expiryDate ? (
                    <DateField value={device.expiryDate} format="DD/MM/YYYY" />
                  ) : (
                    "N/A"
                  )}
                </Typography>
              </Box>

              <Box display="flex" gap={1} mb={1}>
                <Chip
                  label={device.dataStatus || "Unknown"}
                  color={getStatusColor(device.dataStatus) as any}
                  size="small"
                  variant="outlined"
                />
                {device.currentFee && (
                  <Chip
                    label={`$${device.currentFee}`}
                    color="info"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
              <Box>
                <Tooltip title="Location">
                  <IconButton size="small" color="primary">
                    <LocationIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Signal">
                  <IconButton size="small" color="primary">
                    <SignalIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box>
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onShow?.(device.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => onEdit?.(device.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
