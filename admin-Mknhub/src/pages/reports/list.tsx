import {
  Box,
  Chip,
  Tooltip,
  Stack,
  Grid,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { type HttpError, CrudFilter, useTranslate } from "@refinedev/core";
import { RefineListView, SearchBar } from "../../components";
import { defaultDataGridStyles } from "../../components/DataGridStyles";
import { useMemo, useState } from "react";
import { DateField } from "@refinedev/mui";
import { IReport, ReportStatus } from "../../interfaces";
import { useDataGrid } from "@refinedev/mui";
import { ReportShowModal } from "./show";

const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

export const ReportList: React.FC<{ defaultView?: "table" | "card" }> = ({
  defaultView,
}) => {
  const [view, setView] = useState<"table" | "card">(
    defaultView === "table" || defaultView === "card" ? defaultView : "card"
  );
  const [showId, setShowId] = useState<string | null>(null);
  const [showOpen, setShowOpen] = useState(false);
  const t = useTranslate();
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("q");
  const searchField = searchParams.get("field");

  const searchFields = [
    { value: "description", label: t("reports.list.search.fields.description", "Description") },
    { value: "port_code", label: t("reports.list.search.fields.port_code", "Port Code") },
    { value: "ship_code", label: t("reports.list.search.fields.ship_code", "Plate Number") },
    { value: "status", label: t("reports.list.search.fields.status", "Status") },
  ];

  const { dataGridProps } = useDataGrid<IReport, HttpError, any>({
    resource: "reports",
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

  const columns = useMemo<GridColDef<IReport>[]>(
    () => [
      {
        field: "reporter_ship",
        headerName: t("reports.list.columns.ship", "Tàu"),
        minWidth: 160,
        flex: 1,
        renderCell: ({ row }) => row.reporter_ship?.plate_number || "-",
      },
      {
        field: "port_code",
        headerName: t("reports.list.columns.port", "Cảng"),
        minWidth: 120,
        flex: 1,
      },
      {
        field: "description",
        headerName: t("reports.list.columns.description", "Mô tả"),
        minWidth: 250,
        flex: 2,
        renderCell: ({ value }) => (
          <Tooltip title={value || ""} placement="top-start">
            <Stack
              direction="row"
              sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {String(value || "")}
            </Stack>
          </Tooltip>
        ),
      },
      {
        field: "lat",
        headerName: t("reports.list.columns.latlng", "Vĩ/ Kinh độ"),
        minWidth: 160,
        flex: 1,
        renderCell: ({ row }) =>
          `${row.lat?.toFixed?.(4) ?? row.lat}, ${
            row.lng?.toFixed?.(4) ?? row.lng
          }`,
      },
      {
        field: "reported_at",
        headerName: t("reports.list.columns.reported_at", "Thời gian báo cáo"),
        minWidth: 180,
        flex: 1,
        renderCell: ({ value }) => <DateField value={value} format="LLL" />,
      },
      {
        field: "status",
        headerName: t("reports.list.columns.status", "Trạng thái"),
        minWidth: 140,
        flex: 1,
        renderCell: ({ value }) => (
          <Chip
            label={String(value).toUpperCase()}
            color={getStatusColor(value as ReportStatus)}
            size="small"
            sx={{ borderRadius: 999, px: 1, fontWeight: 700 }}
          />
        ),
      },
      {
        field: "created_at",
        headerName: t("reports.list.columns.created", "Ngày tạo"),
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
            <SearchBar fields={searchFields} placeholder={t("reports.list.search.placeholder", "Tìm kiếm báo cáo...")} />
          </Box>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={view}
            onChange={(_, v) => v && setView(v)}
          >
            <ToggleButton value="table">{t("reports.list.view.table", "Bảng")}</ToggleButton>
            <ToggleButton value="card">{t("reports.list.view.card", "Thẻ")}</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ mt: 2 }}>
          {view === "table" ? (
            <DataGrid
              {...dataGridProps}
              paginationModel={dataGridProps.paginationModel as any}
              onPaginationModelChange={dataGridProps.onPaginationModelChange as any}
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
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                              <Box sx={{ width: 120, height: 24, bgcolor: '#eee', borderRadius: 1 }} />
                              <Box sx={{ width: 80, height: 24, bgcolor: '#eee', borderRadius: 999 }} />
                            </Stack>
                            <Box sx={{ width: 120, height: 18, bgcolor: '#eee', borderRadius: 1, mb: 1 }} />
                            <Box sx={{ width: 180, height: 14, bgcolor: '#eee', borderRadius: 1, mb: 0.5 }} />
                            <Box sx={{ width: 200, height: 14, bgcolor: '#eee', borderRadius: 1, mb: 0.5 }} />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  : (dataGridProps.rows as IReport[]).map((report) => {
                  const timeText = report.reported_at
                    ? (() => {
                        const diff =
                          Date.now() -
                          new Date(report.reported_at as any).getTime();
                        const mins = Math.round(diff / 60000);
                        if (mins < 60) return t("reports.list.time.minutesAgo", { defaultValue: "{{count}} phút trước", count: mins });
                        const hrs = Math.round(mins / 60);
                        return t("reports.list.time.hoursAgo", { defaultValue: "{{count}} giờ trước", count: hrs });
                      })()
                    : undefined;

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={String(report.id ?? report.reported_at)}
                    >
                      <Card
                        sx={{ borderRadius: 3, cursor: "pointer" }}
                        onClick={() => {
                          const id = report.id as any;
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
                              {report.reporter_ship?.plate_number || "-"}
                            </Typography>
                            <Chip
                              label={String(report.status).toUpperCase()}
                              color={
                                getStatusColor(
                                  report.status as ReportStatus
                                ) as any
                              }
                              size="small"
                              sx={{ borderRadius: 999, px: 1, fontWeight: 700 }}
                            />
                          </Stack>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {report.port_code}
                          </Typography>

                          {typeof report.lat !== "undefined" &&
                            typeof report.lng !== "undefined" && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {t("reports.fields.location", "Vị trí")}: {Number(report.lat).toFixed(4)}, {Number(report.lng).toFixed(4)}
                              </Typography>
                            )}

                          {timeText && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {t("reports.list.labels.report", "Báo cáo")}: {timeText}
                            </Typography>
                          )}
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
                      { reason: 'pagination' } as any
                    );
                  }}
                />
              </Stack>
            </>
          )}
        </Box>
      </Box>
      {showId && (
        <ReportShowModal
          id={showId}
          modalProps={{ isOpen: showOpen, onClose: () => setShowOpen(false) }}
        />
      )}
    </RefineListView>
  );
};

export default ReportList;
