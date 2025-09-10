import { Box, Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { type HttpError, CrudFilter } from "@refinedev/core";
import { RefineListView, SearchBar } from "../../components";
import { FeedbackShowModal } from "./show";
import { defaultDataGridStyles } from "../../components/DataGridStyles";
import { useMemo, useState } from "react";
import { DateField } from "@refinedev/mui";
import { IFeedback, FeedbackStatus } from "../../interfaces";
import { useDataGrid } from "@refinedev/mui";

const getStatusColor = (status: FeedbackStatus) => {
  switch (status) {
    case "new":
      return "warning";
    case "in_progress":
      return "info";
    case "resolved":
      return "success";
    default:
      return "default";
  }
};

export const FeedbackList = () => {
  const [showId, setShowId] = useState<string | null>(null);
  const [showOpen, setShowOpen] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("q");
  const searchField = searchParams.get("field");

  const searchFields = [
    { value: "content", label: "Content" },
    { value: "status", label: "Status" },
  ];

  const { dataGridProps } = useDataGrid<IFeedback, HttpError, any>({
    resource: "feedbacks",
    initialPageSize: 10,
    filters: {
      permanent: searchQuery
        ? ([
            {
              field: "q",
              operator: "contains" as const,
              value: searchQuery,
            } as CrudFilter,
            ...(searchField
              ? ([
                  {
                    field: "keySearch",
                    operator: "eq" as const,
                    value: searchField,
                  } as CrudFilter,
                ] as CrudFilter[])
              : ([] as CrudFilter[])),
          ] as CrudFilter[])
        : ([] as CrudFilter[]),
    },
    syncWithLocation: true,
  });

  const columns = useMemo<GridColDef<IFeedback>[]>(
    () => [
      {
        field: "content",
        headerName: "Content",
        minWidth: 250,
        flex: 2,
      },
      {
        field: "reporter",
        headerName: "Reporter",
        minWidth: 200,
        flex: 1,
        renderCell: ({ row }) =>
          row.reporter?.fullname || row.reporter?.username || "-",
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 160,
        flex: 1,
        renderCell: ({ value }) => (
          <Chip
            label={String(value).toUpperCase()}
            color={getStatusColor(value as FeedbackStatus)}
            size="small"
            sx={{ borderRadius: 999, px: 1, fontWeight: 700 }}
          />
        ),
      },
      {
        field: "created_at",
        headerName: "Created At",
        minWidth: 180,
        flex: 1,
        renderCell: ({ value }) => <DateField value={value} format="LLL" />,
      },
      {
        field: "updated_at",
        headerName: "Updated At",
        minWidth: 180,
        flex: 1,
        renderCell: ({ value }) => <DateField value={value} format="LLL" />,
      },
    ],
    []
  );

  return (
    <RefineListView
      breadcrumb={false}
      headerProps={{
        sx: { display: "none" },
      }}
    >
      <Box sx={{ px: 0, pt: 2, pb: 0 }}>
        <SearchBar fields={searchFields} placeholder="Search feedbacks..." />
        <Box sx={{ mt: 2 }}>
          <DataGrid
            {...dataGridProps}
            columns={columns}
            pageSizeOptions={[10, 20, 50, 100]}
            filterModel={undefined}
            autoHeight
            sx={defaultDataGridStyles}
            onRowClick={(params) => {
              const r: any = params.row;
              const id = r?.id;
              if (id) setShowId(String(id));
              setShowOpen(true);
            }}
          />
        </Box>
      </Box>
      {showId && (
        <FeedbackShowModal
          id={showId}
          modalProps={{ isOpen: showOpen, onClose: () => setShowOpen(false) }}
        />
      )}
    </RefineListView>
  );
};

export default FeedbackList;
