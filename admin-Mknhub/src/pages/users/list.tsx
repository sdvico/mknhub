import { Box, Button } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { type HttpError, useTranslate, CrudFilter } from "@refinedev/core";
import { CreateButton, useDataGrid } from "@refinedev/mui";
import { useMemo, useState } from "react";
import { RefineListView, SearchBar } from "../../components";
import { defaultDataGridStyles } from "../../components/DataGridStyles";
import { CustomerCreateModal } from "./create";
import { CustomerEditModal } from "./edit";
import type { IUser, IUserFilterVariables } from "../../interfaces";

export const CustomerList = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const t = useTranslate();

  // Get search parameters from URL
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("q");
  const searchField = searchParams.get("field");

  // Define search fields
  const searchFields = [
    { value: "id", label: "ID" },
    { value: "phone", label: "Phone" },
    { value: "username", label: "Username" },
  ];

  const { dataGridProps, filters } = useDataGrid<
    IUser,
    HttpError,
    IUserFilterVariables
  >({
    resource: "users",
    initialPageSize: 10,
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

  const columns = useMemo<GridColDef<IUser>[]>(
    () => [
      {
        field: "id",
        headerName: t("users.list.columns.id", { defaultValue: "ID" }),
        minWidth: 100,
        flex: 0.5,
      },
      {
        field: "username",
        headerName: t("users.list.columns.username", { defaultValue: "Username" }),
        minWidth: 150,
        flex: 1,
      },
      {
        field: "fullname",
        headerName: t("users.list.columns.fullname", { defaultValue: "Full Name" }),
        minWidth: 200,
        flex: 1,
      },
      {
        field: "phone",
        headerName: t("users.list.columns.phone", { defaultValue: "Phone" }),
        minWidth: 150,
        flex: 1,
      },
      {
        field: "state",
        headerName: t("users.list.columns.state", { defaultValue: "State" }),
        minWidth: 120,
        flex: 0.5,
      },
      {
        field: "actions",
        headerName: t("table.actions", { defaultValue: "Actions" }),
        sortable: false,
        filterable: false,
        minWidth: 160,
        renderCell: (params) => (
          <Button
            size="small"
            onClick={() => {
              setSelectedId(params.row.id);
              setEditModalOpen(true);
            }}
          >
            {t("buttons.edit", { defaultValue: "Edit" })}
          </Button>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <RefineListView
        breadcrumb={false}
        headerButtons={[
          <CreateButton
            key="create"
            size="medium"
            sx={{ height: "40px" }}
            onClick={() => setCreateModalOpen(true)}
          >
            {t("users.actions.add")}
          </CreateButton>,
        ]}
      >
        <Box sx={{ p: 2 }}>
          <SearchBar fields={searchFields} placeholder={t("users.list.search.placeholder", { defaultValue: "Search users..." })} />
          <Box sx={{ mt: 2 }}>
            <DataGrid
              {...dataGridProps}
              columns={columns}
              pageSizeOptions={[10, 20, 50, 100]}
              filterModel={undefined}
              autoHeight
              sx={defaultDataGridStyles}
            />
          </Box>
        </Box>
      </RefineListView>

      <CustomerCreateModal
        modalProps={{
          isOpen: createModalOpen,
          onClose: () => setCreateModalOpen(false),
        }}
      />

      <CustomerEditModal
        modalProps={{
          isOpen: editModalOpen,
          onClose: () => setEditModalOpen(false),
        }}
        id={selectedId || undefined}
        formProps={{}}
      />
    </>
  );
};
