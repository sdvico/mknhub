import { Box, Button } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { type HttpError } from "@refinedev/core";
import { CreateButton, useDataGrid } from "@refinedev/mui";
import { useMemo, useState } from "react";
import { RefineListView, SearchBar } from "../../components";
import { defaultDataGridStyles } from "../../components/DataGridStyles";
import { AgencyCreateModal } from "./create";
import { AgencyShowModal } from "./show";

interface IAgency {
  id: string;
  name: string;
  code: string;
  created_at?: string;
}

export const AgencyList = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("q");

  const { dataGridProps } = useDataGrid<IAgency, HttpError, any>({
    resource: "agencies",
    initialPageSize: 10,
    filters: {
      permanent: searchQuery
        ? [
            {
              field: "q",
              operator: "contains" as const,
              value: searchQuery,
            },
          ]
        : [],
    },
    syncWithLocation: true,
  });

  const columns = useMemo<GridColDef<IAgency>[]>(
    () => [
      { field: "id", headerName: "ID", minWidth: 120, flex: 1 },
      { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
      { field: "code", headerName: "Code", minWidth: 140, flex: 0.8 },
      {
        field: "created_at",
        headerName: "Created At",
        minWidth: 180,
        flex: 0.9,
        valueGetter: (params: any) => {
          const v = params?.row?.created_at;
          return v ? new Date(v as any).toLocaleString() : "";
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        minWidth: 140,
        renderCell: (params: any) => (
          <Button
            size="small"
            onClick={() => {
              setSelectedId(params.row.id);
              setShowModalOpen(true);
            }}
          >
            Show
          </Button>
        ),
      },
    ],
    []
  );

  const searchFields = [
    { value: "q", label: "Name/Code" },
  ];

  return (
    <>
      <RefineListView
        breadcrumb={false}
        headerButtons={[
          (
            <CreateButton
              key="create"
              size="medium"
              sx={{ height: "40px" }}
              onClick={() => setCreateModalOpen(true)}
            >
              Add Agency
            </CreateButton>
          ),
        ]}
      >
        <Box sx={{ p: 2 }}>
          <SearchBar fields={searchFields} placeholder="Search agencies..." />
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

      <AgencyCreateModal
        modalProps={{ isOpen: createModalOpen, onClose: () => setCreateModalOpen(false) }}
      />

      <AgencyShowModal
        modalProps={{ isOpen: showModalOpen, onClose: () => setShowModalOpen(false) }}
        id={selectedId || undefined}
      />
    </>
  );
};


