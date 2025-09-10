import {
  Box,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  type HttpError,
  useTranslate,
  CrudFilter,
  useInvalidate,
  useCustom,
} from "@refinedev/core";
import { CreateButton, useDataGrid, DateField } from "@refinedev/mui";
import { useLayoutEffect, useMemo, useState } from "react";
import { RefineListView, SearchBar } from "../../components";
import { defaultDataGridStyles } from "../../components/DataGridStyles";
import {
  IShipNotificationEvent,
  IShipNotificationEventFilterVariables,
} from "../../interfaces/ship-notification-event";
import { ShipNotificationEventShowModal } from "./show";

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
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const ShipNotificationEventList: React.FC<{
  defaultView?: "table" | "card";
  showUnresolvedOnly?: boolean;
}> = ({ defaultView, showUnresolvedOnly = true }) => {
  const [view, setView] = useState<"table" | "card">(
    defaultView === "table" || defaultView === "card" ? defaultView : "card"
  );
  const [showId, setShowId] = useState<string | null>(null);
  const [showOpen, setShowOpen] = useState(false);
  const t = useTranslate();
  const invalidate = useInvalidate();

  // Get search parameters from URL
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("q");
  const searchField = searchParams.get("field");
  const urlPage = Number(
    searchParams.get("page") || searchParams.get("current") || "1"
  );
  const urlLimit = Number(
    searchParams.get("limit") || searchParams.get("pageSize") || "10"
  );

  // Define search fields
  const searchFields = [
    { value: "ship_code", label: "Ship Code" },
    { value: "type", label: "Event Type" },
  ];

  const { dataGridProps, filters } = useDataGrid<
    IShipNotificationEvent,
    HttpError,
    IShipNotificationEventFilterVariables
  >({
    resource: showUnresolvedOnly
      ? "ship-notification-events/unresolved"
      : "ship-notification-events",
    initialCurrent: urlPage || 1,
    initialPageSize: urlLimit || 10,
    filters: {
      permanent: searchQuery
        ? ([
            {
              field: searchField || "ship_code",
              operator: "contains" as const,
              value: searchQuery,
            } as CrudFilter,
          ] as CrudFilter[])
        : ([] as CrudFilter[]),
    },
    syncWithLocation: false,
  });

  // Normalize legacy current/pageSize -> page/limit on mount
  useLayoutEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    let changed = false;
    const current = sp.get("current");
    const pageSize = sp.get("pageSize");
    const page = sp.get("page");
    const limit = sp.get("limit");

    if (!page && current) {
      sp.set("page", current);
      changed = true;
    }
    if (!limit && pageSize) {
      sp.set("limit", pageSize);
      changed = true;
    }
    if (sp.has("current")) {
      sp.delete("current");
      changed = true;
    }
    if (sp.has("pageSize")) {
      sp.delete("pageSize");
      changed = true;
    }

    if (changed) {
      const newUrl = `${window.location.pathname}?${sp.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  // Update URL when pagination changes and delegate to refine's handler
  const handlePaginationModelChange = (
    model: { page?: number; pageSize?: number },
    details: any
  ) => {
    const sp = new URLSearchParams(window.location.search);
    sp.set("page", String((model?.page ?? 0) + 1));
    sp.set("limit", String(model?.pageSize ?? 10));
    const newUrl = `${window.location.pathname}?${sp.toString()}`;
    window.history.replaceState(null, "", newUrl);
    if (dataGridProps?.onPaginationModelChange) {
      dataGridProps.onPaginationModelChange(model as any, details);
    }
  };

  const columns = useMemo<GridColDef<IShipNotificationEvent>[]>(
    () => [
      {
        field: "ship_code",
        headerName: "Ship Code",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "type",
        headerName: "Event Type",
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Chip
            label={value || "N/A"}
            color={getTypeColor(value) as any}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 999,
              px: 1,
              fontWeight: 600,
            }}
          />
        ),
      },
      {
        field: "started_at",
        headerName: "Started At",
        minWidth: 180,
        flex: 1,
        renderCell: ({ value }) =>
          value ? <DateField value={value} format="LLL" /> : "N/A",
      },
      {
        field: "duration_minutes",
        headerName: "Duration",
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            variant="body2"
            color={value && value > 60 ? "error.main" : "text.primary"}
          >
            {formatDuration(value)}
          </Typography>
        ),
      },
      {
        field: "response_minutes_from_6h",
        headerName: "Response Time",
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography variant="body2">{value ? `${value}m` : "N/A"}</Typography>
        ),
      },
      {
        field: "is_resolved",
        headerName: "Status",
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Chip
            label={value ? "Resolved" : "Open"}
            color={getStatusColor(value) as any}
            size="small"
            sx={{
              borderRadius: 999,
              px: 1,
              fontWeight: 700,
            }}
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      <RefineListView
        breadcrumb={false}
        headerProps={{
          sx: {
            display: "none",
          },
        }}
      >
        <Box sx={{ px: 0, pt: 2, pb: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "stretch", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <SearchBar fields={searchFields} placeholder="Search events..." />
            </Box>

            <ToggleButtonGroup
              size="small"
              exclusive
              value={view}
              onChange={(_, v) => v && setView(v)}
            >
              <ToggleButton value="table">Table</ToggleButton>
              <ToggleButton value="card">Card</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ mt: 2 }}>
            {view === "table" ? (
              <DataGrid
                {...dataGridProps}
                paginationModel={dataGridProps.paginationModel as any}
                onPaginationModelChange={(model, details) =>
                  handlePaginationModelChange(model as any, details)
                }
                rowCount={dataGridProps.rowCount as any}
                paginationMode={
                  (dataGridProps as any).paginationMode || "server"
                }
                columns={columns}
                pageSizeOptions={[10, 20, 50, 100]}
                filterModel={undefined}
                autoHeight
                sx={defaultDataGridStyles}
                onRowClick={(params) => {
                  const r: any = params.row;
                  const id = r?.id;
                  if (id) {
                    setShowId(String(id));
                    setShowOpen(true);
                  }
                }}
              />
            ) : (
              <>
                <Grid container spacing={2}>
                  {(dataGridProps as any).loading
                    ? Array.from({ length: 6 }).map((_, idx) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          key={`skeleton-${idx}`}
                        >
                          <Card sx={{ borderRadius: 3 }}>
                            <CardContent>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                mb={1}
                              >
                                <Box
                                  sx={{
                                    width: 120,
                                    height: 24,
                                    bgcolor: "#eee",
                                    borderRadius: 1,
                                  }}
                                />
                                <Box
                                  sx={{
                                    width: 80,
                                    height: 24,
                                    bgcolor: "#eee",
                                    borderRadius: 999,
                                  }}
                                />
                              </Stack>
                              <Box
                                sx={{
                                  width: 200,
                                  height: 18,
                                  bgcolor: "#eee",
                                  borderRadius: 1,
                                  mb: 1,
                                }}
                              />
                              <Box
                                sx={{
                                  width: 140,
                                  height: 14,
                                  bgcolor: "#eee",
                                  borderRadius: 1,
                                  mb: 0.5,
                                }}
                              />
                              <Box
                                sx={{
                                  width: "100%",
                                  height: 40,
                                  bgcolor: "#eee",
                                  borderRadius: 1,
                                  mt: 1,
                                }}
                              />
                              <Box
                                sx={{
                                  width: 100,
                                  height: 24,
                                  bgcolor: "#eee",
                                  borderRadius: 999,
                                  mt: 1,
                                }}
                              />
                            </CardContent>
                          </Card>
                        </Grid>
                      ))
                    : (dataGridProps.rows as IShipNotificationEvent[]).map(
                        (item) => {
                          const startedAt = item.started_at || item.created_at;
                          const durationText = formatDuration(
                            item.duration_minutes
                          );

                          return (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                              <Card
                                sx={{ borderRadius: 3, cursor: "pointer" }}
                                onClick={() => {
                                  setShowId(item.id);
                                  setShowOpen(true);
                                }}
                              >
                                <CardContent>
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    mb={1}
                                  >
                                    <Typography variant="h6" fontWeight={700}>
                                      {item.ship_code}
                                    </Typography>
                                    <Chip
                                      label={item.type || "N/A"}
                                      color={getTypeColor(item.type) as any}
                                      size="small"
                                      variant="outlined"
                                      sx={{ borderRadius: 999 }}
                                    />
                                  </Stack>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                  >
                                    Started:{" "}
                                    {startedAt
                                      ? new Date(startedAt).toLocaleString()
                                      : "N/A"}
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                  >
                                    Duration: {durationText}
                                  </Typography>

                                  {item.response_minutes_from_6h && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mb: 1 }}
                                    >
                                      Response: {item.response_minutes_from_6h}m
                                    </Typography>
                                  )}

                                  <Box sx={{ mt: 1 }}>
                                    <Chip
                                      label={
                                        item.is_resolved ? "Resolved" : "Open"
                                      }
                                      color={
                                        getStatusColor(item.is_resolved) as any
                                      }
                                      size="small"
                                      sx={{ fontWeight: 700 }}
                                    />
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        }
                      )}
                </Grid>
                <Stack alignItems="center" mt={2}>
                  <Pagination
                    color="primary"
                    page={(dataGridProps.paginationModel?.page ?? 0) + 1}
                    count={Math.max(
                      1,
                      Math.ceil(
                        (dataGridProps.rowCount ?? 0) /
                          (dataGridProps.paginationModel?.pageSize ?? 10)
                      )
                    )}
                    onChange={(_, newPage) => {
                      const sp = new URLSearchParams(window.location.search);
                      sp.set("page", String(newPage));
                      sp.set(
                        "limit",
                        String(dataGridProps.paginationModel?.pageSize ?? 10)
                      );
                      const newUrl = `${
                        window.location.pathname
                      }?${sp.toString()}`;
                      window.history.replaceState(null, "", newUrl);
                      dataGridProps.onPaginationModelChange?.(
                        {
                          ...(dataGridProps.paginationModel ?? {
                            pageSize: 10,
                          }),
                          page: newPage - 1,
                        } as any,
                        { reason: "pagination" } as any
                      );
                    }}
                  />
                </Stack>
              </>
            )}
          </Box>
        </Box>
      </RefineListView>

      {/* Show details modal */}
      {showId && (
        <ShipNotificationEventShowModal
          id={showId}
          modalProps={{ isOpen: showOpen, onClose: () => setShowOpen(false) }}
        />
      )}
    </>
  );
};
