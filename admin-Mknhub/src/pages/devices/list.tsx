import React, { useState } from "react";
import { useTranslate, CrudFilter } from "@refinedev/core";
import { CreateButton, useDataGrid, DateField } from "@refinedev/mui";
import { Box, Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { RefineListView, SearchBar } from "../../components";
import { defaultDataGridStyles } from "../../components/DataGridStyles";
import { DeviceCreateModal } from "./create";
import type { IDevice } from "../../interfaces";

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "INACTIVE":
      return "error";
    case "PENDING":
      return "warning";
    default:
      return "default";
  }
};

export const DeviceList = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const t = useTranslate();

  // Get search parameters from URL
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("q");
  const searchField = searchParams.get("field");

  // Define search fields
  const searchFields = [
    { value: "id", label: "ID" },
    { value: "imei", label: "IMEI" },
    { value: "name", label: "Name" },
    { value: "plateNumber", label: "Plate Number" },
  ];

  const { dataGridProps } = useDataGrid<IDevice>({
    resource: "devices",
    pagination: {
      pageSize: 12,
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      permanent:
        searchQuery && searchField
          ? [
              {
                field: searchField,
                operator: "contains" as const,
                value: searchQuery,
              } as CrudFilter,
            ]
          : [],
    },
    syncWithLocation: true,
  });

  const columns = React.useMemo<GridColDef<IDevice>[]>(
    () => [
      {
        field: "imei",
        headerName: "IMEI",
        minWidth: 200,
        flex: 1,
      },
      {
        field: "name",
        headerName: "Name",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "plateNumber",
        headerName: "Plate Number",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "shipName",
        headerName: "Ship Name",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "deviceStatus",
        headerName: "Status",
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Chip label={value} color={getStatusColor(value)} size="small" />
        ),
      },
      {
        field: "packageName",
        headerName: "Package",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "expiryDate",
        headerName: "Expiry Date",
        minWidth: 180,
        flex: 1,
        renderCell: ({ value }) =>
          value ? <DateField value={value} format="LLL" /> : "-",
      },
      {
        field: "createdAt",
        headerName: "Created At",
        minWidth: 180,
        flex: 1,
        renderCell: ({ value }) => <DateField value={value} format="LLL" />,
      },
    ],
    []
  );

  return (
    <>
      <RefineListView
        headerButtons={[
          <CreateButton
            key="create"
            size="medium"
            sx={{ height: "40px" }}
            onClick={() => setCreateModalOpen(true)}
          >
            {t("devices.actions.add", "Add Device")}
          </CreateButton>,
        ]}
      >
        <Box sx={{ p: 2 }}>
          <SearchBar fields={searchFields} placeholder="Search devices..." />
          <Box sx={{ mt: 2 }}>
            <DataGrid
              {...dataGridProps}
              columns={columns}
              pageSizeOptions={[12, 24, 48, 96]}
              filterModel={undefined}
              autoHeight
              sx={defaultDataGridStyles}
            />
          </Box>
        </Box>
      </RefineListView>

      <DeviceCreateModal
        modalProps={{
          isOpen: createModalOpen,
          onClose: () => setCreateModalOpen(false),
        }}
      />
    </>
  );
};
