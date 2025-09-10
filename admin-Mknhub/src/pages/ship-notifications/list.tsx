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
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useLayoutEffect, useMemo, useState } from "react";
import { RefineListView, SearchBar } from "../../components";
import { defaultDataGridStyles } from "../../components/DataGridStyles";
import {
  IShipNotification,
  IShipNotificationFilterVariables,
  ShipNotificationStatus,
  ShipNotificationType,
  NOTIFICATION_STATUS,
} from "../../interfaces/ship-notification";
import { ShipNotificationCreateModal } from "./create";
import { ShipNotificationShowModal } from "./show";
import customDataProvider from "../../dataProvider";

const getStatusColor = (status: ShipNotificationStatus) => {
  switch (status) {
    case NOTIFICATION_STATUS.QUEUED:
      return "default";
    case NOTIFICATION_STATUS.SENDING:
      return "info";
    case NOTIFICATION_STATUS.SENT:
      return "primary";
    case NOTIFICATION_STATUS.DELIVERED:
      return "success";
    case NOTIFICATION_STATUS.FAILED:
      return "error";
    default:
      return "default";
  }
};

const getStatusText = (status: ShipNotificationStatus) => status || "UNKNOWN";

const getTypeColor = (type: ShipNotificationType) => {
  switch (type) {
    case "NORMAL":
      return "default";
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
    default:
      return "default";
  }
};

export const ShipNotificationList: React.FC<{
  defaultView?: "table" | "card";
}> = ({ defaultView }) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [view, setView] = useState<"table" | "card">(
    defaultView === "table" || defaultView === "card" ? defaultView : "card"
  );
  const [importPreviewOpen, setImportPreviewOpen] = useState(false);
  const [importRecords, setImportRecords] = useState<any[]>([]);
  const [showId, setShowId] = useState<string | null>(null);
  const [showOpen, setShowOpen] = useState(false);
  const [resendingIds, setResendingIds] = useState<Set<string>>(new Set());
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
    { value: "plateNumber", label: "Plate Number" },
    { value: "owner_phone", label: "Owner Phone" },
    { value: "owner_name", label: "Owner Name" },
  ];

  const { dataGridProps, filters } = useDataGrid<
    IShipNotification,
    HttpError,
    IShipNotificationFilterVariables
  >({
    resource: "ship-notifications",
    initialCurrent: urlPage || 1,
    initialPageSize: urlLimit || 10,
    filters: {
      permanent: searchQuery
        ? ([
            {
              field: "ship_code",
              operator: "contains" as const,
              value: searchQuery,
            } as CrudFilter,
          ] as CrudFilter[])
        : ([] as CrudFilter[]),
    },
    // We'll manage URL syncing to use page/limit instead of current/pageSize
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

  const handleResendNotification = async (id: string) => {
    setResendingIds((prev) => new Set(prev).add(id));
    try {
      await customDataProvider.custom({
        url: `v1/ship-notifications/${id}/resend`,
        method: "POST",
        headers: {
          "x-api-key": "446655440001",
        },
      });

      // Refresh the list
      await invalidate({
        resource: "ship-notifications",
        invalidates: ["list"],
      });

      alert("Notification resent successfully!");
    } catch (error) {
      console.error("Failed to resend notification:", error);
      alert("Failed to resend notification");
    } finally {
      setResendingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const columns = useMemo<GridColDef<IShipNotification>[]>(
    () => [
      {
        field: "ship_code",
        headerName: "Plate Number",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "type",
        headerName: "Type",
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Chip
            label={value}
            color={getTypeColor(value as ShipNotificationType)}
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
        field: "owner_name",
        headerName: "Owner Name",
        minWidth: 180,
        flex: 1,
      },
      {
        field: "owner_phone",
        headerName: "Owner Phone",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "created_at",
        headerName: "Created At",
        minWidth: 180,
        flex: 1,
        renderCell: ({ value }) => <DateField value={value} format="LLL" />,
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Chip
            label={getStatusText(value as ShipNotificationStatus)}
            color={getStatusColor(value as ShipNotificationStatus)}
            size="small"
            sx={{
              borderRadius: 999,
              px: 1,
              fontWeight: 700,
            }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 100,
        flex: 0.5,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => {
          const id = row.id || row.requestId || row.clientReq;
          const isResending = resendingIds.has(String(id));

          return (
            <Tooltip title="Resend Notification">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (id) {
                    handleResendNotification(String(id));
                  }
                }}
                disabled={isResending}
                sx={{ color: "primary.main" }}
              >
                {isResending ? (
                  <CircularProgress size={16} />
                ) : (
                  <RefreshIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          );
        },
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
              <SearchBar fields={[]} placeholder="Search notifications..." />
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

            <Button
              variant="contained"
              size="medium"
              component="label"
              sx={{
                height: 40,
                borderRadius: 2,
                px: 2.5,
                boxShadow: 2,
                width: { xs: "100%", sm: "auto" },
                alignSelf: { xs: "stretch", sm: "auto" },
              }}
            >
              Import Excel
              <input
                type="file"
                hidden
                accept=".xlsx,.csv,.xls"
                onChange={async (e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;
                  const form = new FormData();
                  form.append("file", file);
                  try {
                    const res = await customDataProvider.custom({
                      url: "v1/ship-notifications-import/excel",
                      method: "POST",
                      headers: {
                        "x-api-key": "446655440001",
                      },
                      payload: form,
                    });
                    const data = res.data as any;

                    setImportRecords(
                      Array.isArray(data?.records) ? data.records : []
                    );
                    // Refresh only current list via refine invalidate
                    await invalidate({
                      resource: "ship-notifications",
                      invalidates: ["list"],
                    });
                    setImportPreviewOpen(true);
                  } catch (err) {
                    alert("Import failed");
                  } finally {
                    e.currentTarget.value = "";
                  }
                }}
              />
            </Button>

            <CreateButton
              key="create"
              size="medium"
              sx={{
                height: 40,
                borderRadius: 2,
                px: 2.5,
                boxShadow: 2,
                width: { xs: "100%", sm: "auto" },
                alignSelf: { xs: "stretch", sm: "auto" },
              }}
              onClick={() => setCreateModalOpen(true)}
            >
              Send Notification
            </CreateButton>
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
                  const id = r?.id || r?.requestId || r?.clientReq;
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
                    : (dataGridProps.rows as IShipNotification[]).map(
                        (item) => {
                          const createdAt = item.created_at
                            ? new Date(item.created_at as any)
                            : undefined;
                          const timeText = createdAt
                            ? (() => {
                                const diff = Date.now() - createdAt.getTime();
                                const mins = Math.round(diff / 60000);
                                if (mins < 60) return `${mins} phút trước`;
                                const hrs = Math.round(mins / 60);
                                return `${hrs} giờ trước`;
                              })()
                            : undefined;

                          return (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              key={item.clientReq}
                            >
                              <Card
                                sx={{ borderRadius: 3, cursor: "pointer" }}
                                onClick={() => {
                                  const id =
                                    (item as any)?.id ||
                                    item.requestId ||
                                    item.clientReq;
                                  if (id) {
                                    setShowId(String(id));
                                    setShowOpen(true);
                                  }
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
                                      label={item.type}
                                      color={getTypeColor(item.type) as any}
                                      size="small"
                                      variant="outlined"
                                      sx={{ borderRadius: 999 }}
                                    />
                                  </Stack>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {item.owner_name} • {item.owner_phone}
                                  </Typography>

                                  {timeText && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                      sx={{ mt: 0.5 }}
                                    >
                                      Gửi: {timeText}
                                    </Typography>
                                  )}

                                  {item.content && (
                                    <Typography
                                      variant="body2"
                                      sx={{ mt: 1 }}
                                      noWrap
                                      title={item.content}
                                    >
                                      {item.content}
                                    </Typography>
                                  )}

                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{ mt: 1 }}
                                  >
                                    {item.status && (
                                      <Chip
                                        label={getStatusText(item.status)}
                                        color={
                                          getStatusColor(item.status) as any
                                        }
                                        size="small"
                                        sx={{ fontWeight: 700 }}
                                      />
                                    )}
                                    <Tooltip title="Resend Notification">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const id =
                                            item.id ||
                                            item.requestId ||
                                            item.clientReq;
                                          if (id) {
                                            handleResendNotification(
                                              String(id)
                                            );
                                          }
                                        }}
                                        disabled={resendingIds.has(
                                          String(
                                            item.id ||
                                              item.requestId ||
                                              item.clientReq
                                          )
                                        )}
                                        sx={{ color: "primary.main" }}
                                      >
                                        {resendingIds.has(
                                          String(
                                            item.id ||
                                              item.requestId ||
                                              item.clientReq
                                          )
                                        ) ? (
                                          <CircularProgress size={16} />
                                        ) : (
                                          <RefreshIcon fontSize="small" />
                                        )}
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
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

      <ShipNotificationCreateModal
        modalProps={{
          isOpen: createModalOpen,
          onClose: () => setCreateModalOpen(false),
        }}
      />

      {/* Import result preview */}
      <Dialog
        open={importPreviewOpen}
        onClose={() => setImportPreviewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Kết quả import</DialogTitle>
        <DialogContent dividers>
          {importRecords.length === 0 ? (
            <Typography variant="body2">Không có bản ghi.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Row</TableCell>
                  <TableCell>Ship</TableCell>
                  <TableCell>Occurred At</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {importRecords.map((r) => {
                  const isImported = r.imported !== false; // default true if missing
                  return (
                    <TableRow
                      key={`${r.requestId || r.clientReq || r.row}`}
                      sx={{ bgcolor: isImported ? "inherit" : "#fef2f2" }}
                    >
                      <TableCell>{r.row}</TableCell>
                      <TableCell>{r.ship_code}</TableCell>
                      <TableCell>{r.occurred_at}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell>
                        {isImported ? (
                          <Chip
                            label="SUCCESS"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 700, borderRadius: 999 }}
                          />
                        ) : (
                          <Chip
                            label="IMPORT FALSE"
                            color="error"
                            size="small"
                            sx={{ fontWeight: 700, borderRadius: 999 }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportPreviewOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Show details modal */}
      {showId && (
        <ShipNotificationShowModal
          id={showId}
          modalProps={{ isOpen: showOpen, onClose: () => setShowOpen(false) }}
        />
      )}
    </>
  );
};
