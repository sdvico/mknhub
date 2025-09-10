import React, { useState } from "react";
import { Box, Typography, Chip, CircularProgress, Alert } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { useList, useTranslate } from "@refinedev/core";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { StatusChip } from "../../StatusChip";
import { ActionButtons } from "../../ActionButtons";
import { defaultDataGridStyles } from "../../DataGridStyles";
import type { ISubscription } from "../../../interfaces";

interface SubscriptionListProps {
  deviceId?: string;
  onSubscriptionClick?: (subscription: ISubscription) => void;
}

export const SubscriptionList: React.FC<SubscriptionListProps> = ({
  deviceId,
  onSubscriptionClick,
}) => {
  const [page, setPage] = useState(1);
  const t = useTranslate();

  const { data, isLoading, isError, error } = useList<ISubscription>({
    resource: "subscriptions",
    pagination: {
      current: page,
      pageSize: deviceId ? 10 : 20,
    },
    filters: [
      ...(deviceId
        ? [
            {
              field: "deviceId",
              operator: "eq" as const,
              value: deviceId,
            },
          ]
        : []),
    ],
    sorters: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
    queryOptions: {
      enabled: !deviceId || !!deviceId,
    },
  });

  const subscriptions = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;
  const total = data?.meta?.total || 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const columns = useMemo<GridColDef<ISubscription>[]>(
    () => [
      {
        field: "device.imei",
        headerName: "Device IMEI",
        minWidth: 150,
        flex: 1,
        renderCell: ({ row }) => (
          <Box>
            <Typography variant="body2" fontFamily="monospace">
              {row.device?.imei || "N/A"}
            </Typography>
            {row.device?.name && (
              <Typography variant="caption" color="text.secondary">
                {row.device.name}
              </Typography>
            )}
          </Box>
        ),
      },
      {
        field: "plan.name",
        headerName: "Plan",
        minWidth: 150,
        flex: 1,
        renderCell: ({ row }) => (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.plan?.name || "N/A"}
            </Typography>
            {row.plan?.durationMonths && (
              <Typography variant="caption" color="text.secondary">
                {row.plan.durationMonths} months
              </Typography>
            )}
          </Box>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => <StatusChip status={value} />,
      },
      {
        field: "startDate",
        headerName: "Start Date",
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography variant="body2">{formatDate(value)}</Typography>
        ),
      },
      {
        field: "endDate",
        headerName: "End Date",
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography variant="body2">{formatDate(value)}</Typography>
        ),
      },
      {
        field: "plan.price",
        headerName: "Price",
        minWidth: 120,
        flex: 1,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight="medium">
            {row.plan?.price ? formatCurrency(row.plan.price) : "N/A"}
          </Typography>
        ),
      },
      {
        field: "isLatest",
        headerName: "Latest",
        minWidth: 100,
        flex: 1,
        renderCell: ({ value }) => (
          <Chip
            label={value ? "Yes" : "No"}
            color={value ? "success" : "default"}
            size="small"
            variant={value ? "filled" : "outlined"}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 120,
        flex: 1,
        sortable: false,
        filterable: false,
        renderCell: function render({ row }) {
          const actions = [
            {
              icon: <VisibilityIcon />,
              label: "View Details",
              onClick: () => {
                if (onSubscriptionClick) {
                  onSubscriptionClick(row);
                }
              },
              color: "primary" as const,
            },
          ];
          return <ActionButtons actions={actions} maxVisible={1} />;
        },
      },
    ],
    [onSubscriptionClick]
  );

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
        {error?.message || "Failed to fetch subscriptions"}
      </Alert>
    );
  }

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>
          {deviceId ? "Device Subscriptions" : "All Subscriptions"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {total} subscriptions
        </Typography>
      </Box>

      <DataGrid
        rows={subscriptions}
        columns={columns}
        pageSizeOptions={[10, 20, 50]}
        initialState={{
          pagination: {
            paginationModel: { page: page - 1, pageSize: deviceId ? 10 : 20 },
          },
        }}
        rowCount={total}
        paginationMode="server"
        onPaginationModelChange={(model) => {
          if (model.page !== undefined) {
            // Update page state if needed
          }
        }}
        autoHeight
        sx={defaultDataGridStyles}
      />
    </Box>
  );
};
