import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Stack,
  Pagination,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RoomIcon from "@mui/icons-material/Room";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useDataGrid, DateField } from "@refinedev/mui";
import { type HttpError, CrudFilter, useTranslate } from "@refinedev/core";
import { RefineListView, SearchBar } from "../../components";
import { ShipShowModal } from "./show";
import { defaultDataGridStyles } from "../../components/DataGridStyles";
import type { IShip } from "../../interfaces/ship";

export const ShipList: React.FC<{ defaultView?: "table" | "card" }> = ({
  defaultView,
}) => {
  const [showId, setShowId] = useState<string | null>(null);
  const [showOpen, setShowOpen] = useState(false);
  const viewQuery = new URLSearchParams(window.location.search).get("view");
  const resolvedInitialView = ((): "table" | "card" => {
    if (defaultView === "table" || defaultView === "card") return defaultView;
    if (viewQuery === "table" || viewQuery === "card") return viewQuery as any;
    return "card";
  })();
  const [view, setView] = useState<"table" | "card">(resolvedInitialView);

  const t = useTranslate();

  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("q");
  const searchField = searchParams.get("field");

  const searchFields = [
    {
      value: "plate_number",
      label: t("ships.list.search.fields.plate_number", "Plate Number"),
    },
    { value: "name", label: t("ships.list.search.fields.name", "Name") },
    {
      value: "ownerphone",
      label: t("ships.list.search.fields.ownerphone", "Owner Phone"),
    },
  ];

  const { dataGridProps } = useDataGrid<IShip, HttpError, any>({
    resource: "ships",
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

  const columns = useMemo<GridColDef<IShip>[]>(
    () => [
      {
        field: "plate_number",
        headerName: t("ships.list.columns.plate_number", "Plate Number"),
        flex: 1,
        minWidth: 150,
      },
      {
        field: "name",
        headerName: t("ships.list.columns.name", "Name"),
        flex: 1,
        minWidth: 150,
      },
      {
        field: "ownerphone",
        headerName: t("ships.list.columns.ownerphone", "Owner Phone"),
        flex: 1,
        minWidth: 150,
      },
      {
        field: "status",
        headerName: t("ships.list.columns.status", "Status"),
        flex: 1,
        minWidth: 140,
        renderCell: ({ value }) => (
          <Chip
            label={value}
            size="small"
            color={
              value === "CONNECTED"
                ? "success"
                : value === "ACTIVE"
                ? "primary"
                : value === "DISCONNECTED" || value === "INACTIVE"
                ? "error"
                : "default"
            }
            sx={{ borderRadius: 999, px: 1, fontWeight: 600 }}
          />
        ),
      },
      {
        field: "lastReport",
        headerName: t("ships.list.columns.lastReport", "Last Report"),
        flex: 1.2,
        minWidth: 180,
        renderCell: ({ row }) =>
          row.lastReport ? (
            <Typography variant="caption">
              {row.lastReport.lat?.toFixed(4)}, {row.lastReport.lng?.toFixed(4)}
            </Typography>
          ) : (
            "-"
          ),
      },
      {
        field: "lastmessage",
        headerName: t("ships.list.columns.lastMessage", "Last Message"),
        flex: 1.5,
        minWidth: 220,
        renderCell: ({ row }) =>
          row.lastmessage ? (
            <Typography variant="caption" noWrap>
              {row.lastmessage.type} •{" "}
              {new Date(row.lastmessage.created_at).toLocaleString()}
            </Typography>
          ) : (
            "-"
          ),
      },
    ],
    []
  );

  return (
    <RefineListView
      breadcrumb={false}
      headerProps={{ sx: { display: "none" } }}
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
            <SearchBar
              fields={searchFields}
              placeholder={t(
                "ships.list.search.placeholder",
                "Tìm kiếm tàu thuyền..."
              )}
            />
          </Box>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={view}
            onChange={(_, v) => {
              if (!v) return;
              setView(v);
              const params = new URLSearchParams(window.location.search);
              params.set("view", v);
              const url = `${window.location.pathname}?${params.toString()}`;
              window.history.replaceState({}, "", url);
            }}
          >
            <ToggleButton value="table">
              {t("ships.list.view.table", "Bảng")}
            </ToggleButton>
            <ToggleButton value="card">
              {t("ships.list.view.card", "Thẻ")}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mt: 2 }}>
          {view === "table" ? (
            <DataGrid
              {...dataGridProps}
              paginationModel={dataGridProps.paginationModel as any}
              onPaginationModelChange={
                dataGridProps.onPaginationModelChange as any
              }
              rowCount={dataGridProps.rowCount as any}
              paginationMode={(dataGridProps as any).paginationMode || "server"}
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
                      <Grid item xs={12} sm={6} md={4} key={`skeleton-${idx}`}>
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
                                width: 180,
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
                                width: 160,
                                height: 14,
                                bgcolor: "#eee",
                                borderRadius: 1,
                                mb: 0.5,
                              }}
                            />
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <Box
                                sx={{
                                  width: 100,
                                  height: 32,
                                  bgcolor: "#eee",
                                  borderRadius: 1,
                                }}
                              />
                              <Box
                                sx={{
                                  width: 140,
                                  height: 32,
                                  bgcolor: "#eee",
                                  borderRadius: 1,
                                }}
                              />
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  : (dataGridProps.rows as IShip[]).map((ship) => {
                      const isConnected = ship.status === "CONNECTED";
                      const isNearBoundary =
                        ship.lastmessage?.boundary_near_warning;
                      const isBoundaryCross =
                        ship.lastmessage?.boundary_crossed;
                      const lastType = ship.lastmessage?.type || "";
                      const isMknShort = /MKN_([2-5]H)/.test(lastType);
                      const isMknLong = /MKN_(6H|8D|10D)/.test(lastType);

                      let badge = {
                        label: "",
                        color: "default" as any,
                        icon: undefined as any,
                        border: "#E6E8EC",
                      };

                      if (isConnected) {
                        badge = {
                          label: t("ships.list.badges.connected", "Kết nối"),
                          color: "success",
                          icon: <CheckCircleOutlineIcon fontSize="small" />,
                          border: "#2e7d32",
                        };
                      } else if (isBoundaryCross) {
                        badge = {
                          label: t(
                            "ships.list.badges.boundary_cross",
                            "Vi phạm ranh giới"
                          ),
                          color: "error",
                          icon: <ReportProblemOutlinedIcon fontSize="small" />,
                          border: "#d32f2f",
                        };
                      } else if (isNearBoundary) {
                        badge = {
                          label: t(
                            "ships.list.badges.near_boundary",
                            "Gần ranh giới"
                          ),
                          color: "warning",
                          icon: <RoomIcon fontSize="small" />,
                          border: "#ed6c02",
                        };
                      } else if (isMknShort) {
                        badge = {
                          label: t("ships.list.badges.mkn_short", "MKN < 6h"),
                          color: "warning",
                          icon: <AccessTimeIcon fontSize="small" />,
                          border: "#ed6c02",
                        };
                      } else if (isMknLong) {
                        badge = {
                          label: t("ships.list.badges.mkn_long", "MKN > 6h"),
                          color: "error",
                          icon: <AccessTimeIcon fontSize="small" />,
                          border: "#d32f2f",
                        };
                      }

                      const lastTime =
                        ship.lastmessage?.created_at ||
                        ship.lastReport?.reported_at;
                      const timeText = lastTime
                        ? (() => {
                            const diff =
                              Date.now() - new Date(lastTime).getTime();
                            const mins = Math.round(diff / 60000);
                            if (mins < 60)
                              return t("ships.list.time.minutesAgo", {
                                defaultValue: "{{count}} phút trước",
                                count: mins,
                              });
                            const hrs = Math.round(mins / 60);
                            return t("ships.list.time.hoursAgo", {
                              defaultValue: "{{count}} giờ trước",
                              count: hrs,
                            });
                          })()
                        : undefined;

                      const lat =
                        ship.lastReport?.lat ?? ship.lastmessage?.report?.lat;
                      const lng =
                        ship.lastReport?.lng ?? ship.lastmessage?.report?.lng;
                      // const warningsCount =
                      //   (ship.lastmessage ? 1 : 0) +
                      //   (isNearBoundary || isBoundaryCross ? 1 : 0);

                      const warningsCount = ship.unresolved_events?.length || 0;

                      return (
                        <Grid item xs={12} sm={6} md={4} key={ship.id}>
                          <Card
                            sx={{
                              borderRadius: 3,
                              borderLeft: `4px solid ${badge.border}`,
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              const id = ship.id;
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
                                  {ship.plate_number}
                                </Typography>
                                {badge.label && (
                                  <Chip
                                    icon={badge.icon}
                                    color={badge.color}
                                    label={badge.label}
                                    size="small"
                                    sx={{ borderRadius: 999 }}
                                  />
                                )}
                              </Stack>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                {ship.name ||
                                  t("ships.fields.unnamed", "Không tên")}
                              </Typography>

                              {timeText && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  {t(
                                    "ships.fields.last_signal",
                                    "Tín hiệu cuối"
                                  )}
                                  : {timeText}
                                </Typography>
                              )}

                              {lat !== undefined && lng !== undefined && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  {t("ships.fields.location", "Vị trí")}:{" "}
                                  {Number(lat).toFixed(4)},{" "}
                                  {Number(lng).toFixed(4)}
                                </Typography>
                              )}

                              <Box sx={{ mt: 1 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ mr: 1 }}
                                >
                                  {t("ships.list.warnings", "Cảnh báo")}:
                                </Typography>
                                <Chip
                                  label={warningsCount}
                                  color={
                                    warningsCount > 0 ? "error" : "default"
                                  }
                                  size="small"
                                  sx={{ fontWeight: 700 }}
                                />
                              </Box>

                              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Button variant="outlined" size="small">
                                  {t("ships.list.actions.view", "Xem chi tiết")}
                                </Button>
                                {warningsCount > 0 && (
                                  <Button variant="contained" size="small">
                                    {t(
                                      "ships.list.actions.handle_warnings",
                                      "Xử lý cảnh báo"
                                    )}
                                  </Button>
                                )}
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
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
                    dataGridProps.onPaginationModelChange?.(
                      {
                        ...(dataGridProps.paginationModel ?? { pageSize: 10 }),
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
      {showId && (
        <ShipShowModal
          id={showId}
          modalProps={{ isOpen: showOpen, onClose: () => setShowOpen(false) }}
        />
      )}
    </RefineListView>
  );
};
