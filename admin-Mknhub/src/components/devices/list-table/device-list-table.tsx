import React, { useState } from "react";
import { useTranslate, CrudFilter } from "@refinedev/core";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@refinedev/mui";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DateField } from "@refinedev/mui";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { StatusChip } from "../../StatusChip";
import { ActionButtons } from "../../ActionButtons";
import { defaultDataGridStyles } from "../../DataGridStyles";
import { SearchBar } from "../../SearchBar";
import type { IDevice } from "../../../interfaces";
import { CreateTopupDrawer } from "../../payment/create-topup-drawer";

type Props = ReturnType<typeof useDataGrid<IDevice>> & {
  onEdit?: (id: string | number) => void;
  onShow?: (id: string | number) => void;
};

export const DeviceListTable = (props: Props) => {
  const { dataGridProps, onEdit, onShow } = props;
  const t = useTranslate();
  const [topupDrawerOpen, setTopupDrawerOpen] = useState(false);
  const [selectedDeviceImei, setSelectedDeviceImei] = useState<string>("");

  // Get search parameters from URL
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("q");
  const searchField = searchParams.get("field");

  // Define search fields
  const searchFields = [
    { value: "imei", label: "IMEI" },
    { value: "name", label: "Name" },
    { value: "plateNumber", label: "Plate Number" },
    { value: "deviceStatus", label: "Device Status" },
    { value: "dataStatus", label: "Data Status" },
  ];

  const columns = React.useMemo<GridColDef<IDevice>[]>(
    () => [
      {
        field: "actions",
        headerName: t("table.actions", "Actions"),
        sortable: false,
        filterable: false,
        minWidth: 200,
        renderCell: function render({ row }) {
          const actions = [
            {
              icon: <PaymentIcon />,
              label: "Payment",
              onClick: () => {
                setSelectedDeviceImei(row.imei);
                setTopupDrawerOpen(true);
              },
              color: "success" as const,
            },
            {
              icon: <VisibilityIcon />,
              label: "View",
              onClick: () => onShow?.(row.id),
              color: "primary" as const,
            },
            {
              icon: <EditIcon />,
              label: "Edit",
              onClick: () => onEdit?.(row.id),
              color: "secondary" as const,
            },
          ];

          return <ActionButtons actions={actions} maxVisible={2} />;
        },
      },
      {
        field: "imei",
        headerName: t("devices.fields.imei", "IMEI"),
        minWidth: 150,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "700",
              fontFamily: "monospace",
            }}
          >
            {value}
          </Typography>
        ),
      },
      {
        field: "name",
        headerName: t("devices.fields.name", "Name"),
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            {value || "N/A"}
          </Typography>
        ),
      },
      {
        field: "plateNumber",
        headerName: t("devices.fields.plateNumber", "Plate Number"),
        minWidth: 130,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            {value || "N/A"}
          </Typography>
        ),
      },
      {
        field: "shipName",
        headerName: t("devices.fields.shipName", "Ship Name"),
        minWidth: 130,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            {value || "N/A"}
          </Typography>
        ),
      },
      {
        field: "deviceStatus",
        headerName: t("devices.fields.deviceStatus", "Device Status"),
        minWidth: 130,
        flex: 1,
        renderCell: ({ value }) => <StatusChip status={value || "Unknown"} />,
      },
      {
        field: "dataStatus",
        headerName: t("devices.fields.dataStatus", "Data Status"),
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => <StatusChip status={value || "Unknown"} />,
      },
      {
        field: "packageName",
        headerName: t("devices.fields.packageName", "Package"),
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {value || "No Package"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "expiryDate",
        headerName: t("devices.fields.expiryDate", "Expiry Date"),
        minWidth: 130,
        flex: 1,
        renderCell: ({ value }) => {
          return value ? (
            <DateField value={value} format="DD/MM/YYYY" />
          ) : (
            "N/A"
          );
        },
      },
    ],
    [t, onEdit, onShow]
  );

  return (
    <>
      <SearchBar fields={searchFields} placeholder="Search devices..." />
      <DataGrid
        {...dataGridProps}
        columns={columns}
        getRowHeight={() => "auto"}
        sx={defaultDataGridStyles}
      />
      <CreateTopupDrawer
        open={topupDrawerOpen}
        onClose={() => {
          setTopupDrawerOpen(false);
          setSelectedDeviceImei("");
        }}
        deviceImei={selectedDeviceImei}
      />
    </>
  );
};
