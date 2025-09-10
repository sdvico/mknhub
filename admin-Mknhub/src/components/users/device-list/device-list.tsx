import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  SignalCellularAlt as SignalIcon,
} from "@mui/icons-material";
import { useList, useTranslate } from "@refinedev/core";
import type { IDevice } from "../../../interfaces";

interface DeviceListProps {
  username: string;
  onDeviceClick?: (device: IDevice) => void;
}

export const DeviceList: React.FC<DeviceListProps> = ({
  username,
  onDeviceClick,
}) => {
  const [page, setPage] = useState(1);
  const t = useTranslate();

  const { data, isLoading, isError, error } = useList<IDevice>({
    resource: "devices",
    pagination: {
      current: page,
      pageSize: 10,
    },
    filters: [
      {
        field: "userId",
        operator: "eq",
        value: username,
      },
      // Fallback filter in case userId doesn't work
      {
        field: "email",
        operator: "eq",
        value: username,
      },
    ],
    sorters: [
      {
        field: "imei",
        order: "asc",
      },
    ],
    queryOptions: {
      enabled: !!username,
    },
  });

  const devices = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;
  const total = data?.meta?.total || 0;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "success":
        return "success";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error?.message || "Failed to fetch devices"}
      </Alert>
    );
  }

  if (devices.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          No devices found for this user.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          User Devices ({total})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Page {page} of {totalPages}
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>IMEI</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ship</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Data Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Package</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Expiry</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id} hover>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {device.imei}
                  </Typography>
                </TableCell>
                <TableCell>{device.name || "N/A"}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {device.shipName || device.plateNumber || "N/A"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={device.deviceStatus || device.status || "Unknown"}
                    color={
                      getStatusColor(
                        device.deviceStatus || device.status || "unknown"
                      ) as any
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={device.dataStatus || "Unknown"}
                    color={
                      getStatusColor(device.dataStatus || "unknown") as any
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {device.packageName || "No Package"}
                    </Typography>
                    {device.currentFee && (
                      <Typography variant="caption" color="text.secondary">
                        ${device.currentFee}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(device.expiryDate || null)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => onDeviceClick?.(device)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="small"
          />
        </Box>
      )}
    </Box>
  );
};
