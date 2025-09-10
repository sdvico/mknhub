import { Box, Chip, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { type HttpError, useTranslate, CrudFilter } from "@refinedev/core";
import { CreateButton, useDataGrid, DateField } from "@refinedev/mui";
import { useMemo, useState } from "react";
import { RefineListView, SearchBar } from "../../components";
import { defaultDataGridStyles } from "../../components/DataGridStyles";
import { NotificationTypeCreateModal } from "./create";
// Removed priority color imports
import type {
  INotificationType,
  INotificationTypeFilterVariables,
} from "../../interfaces/notification-type";

export const NotificationTypeList = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const t = useTranslate();

  // Get search parameters from URL
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("q");
  const searchField = searchParams.get("field");

  // Define search fields
  const searchFields = [
    {
      value: "code",
      label: t("notificationTypes.fields.code", { defaultValue: "Code" }),
    },
    {
      value: "name",
      label: t("notificationTypes.fields.name", { defaultValue: "Name" }),
    },
  ];

  const { dataGridProps, filters } = useDataGrid<
    INotificationType,
    HttpError,
    INotificationTypeFilterVariables
  >({
    resource: "notification-types",
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

  const columns = useMemo<GridColDef<INotificationType>[]>(
    () => [
      {
        field: "code",
        headerName: t("notificationTypes.fields.code", {
          defaultValue: "Code",
        }),
        minWidth: 150,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontFamily: "monospace",
              fontWeight: "bold",
            }}
          >
            {value}
          </Typography>
        ),
      },
      {
        field: "name",
        headerName: t("notificationTypes.fields.name", {
          defaultValue: "Name",
        }),
        minWidth: 200,
        flex: 1,
      },
      {
        field: "form_type",
        headerName: t("notificationTypes.fields.form_type", {
          defaultValue: "Form Type",
        }),
        minWidth: 150,
        flex: 1,
        renderCell: ({ value }) =>
          value ? <Chip label={value} size="small" variant="outlined" /> : "-",
      },
      {
        field: "next_action",
        headerName: t("notificationTypes.fields.next_action", {
          defaultValue: "Next Action",
        }),
        minWidth: 200,
        flex: 1.2,
        renderCell: ({ value }) =>
          value ? (
            <Typography
              variant="body2"
              sx={{
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={value}
            >
              {value}
            </Typography>
          ) : (
            "-"
          ),
      },
      {
        field: "priority",
        headerName: t("notificationTypes.fields.priority", {
          defaultValue: "Priority",
        }),
        minWidth: 150,
        flex: 0.6,
        renderCell: ({ value, row }) => {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={value || 0}
                size="small"
                color="default"
                variant="outlined"
                sx={{
                  fontWeight: "bold",
                  minWidth: 40,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: "0.75rem",
                }}
              >
                Priority
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "unread_count",
        headerName: t("notificationTypes.fields.unread", {
          defaultValue: "Unread",
        }),
        minWidth: 100,
        flex: 0.5,
        renderCell: ({ value }) =>
          value ? <Chip label={value} color="primary" size="small" /> : "0",
      },
      {
        field: "created_at",
        headerName: t("common.createdAt", { defaultValue: "Created At" }),
        minWidth: 180,
        flex: 1,
        renderCell: ({ value }) =>
          value ? (
            <DateField value={value as any} format="LLL" />
          ) : (
            <span>-</span>
          ),
      },
      {
        field: "preview",
        headerName: t("common.preview", { defaultValue: "Preview" }),
        minWidth: 200,
        flex: 1.2,
        renderCell: ({ row }) => {
          // Use custom colors if available, otherwise use default colors
          const textColor = row.color || "inherit";
          const backgroundColor = row.background_color || "default";

          return (
            <Chip
              label={row.name}
              size="small"
              color={backgroundColor === "default" ? "default" : undefined}
              sx={{
                color: textColor !== "inherit" ? textColor : undefined,
                backgroundColor:
                  backgroundColor !== "default" ? backgroundColor : undefined,
                fontWeight: "medium",
              }}
              icon={
                row.icon ? (
                  <span className={row.icon} style={{ marginRight: 8 }} />
                ) : undefined
              }
            />
          );
        },
      },
      {
        field: "actions",
        headerName: t("table.actions", { defaultValue: "Actions" }),
        minWidth: 120,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <a
              href={`/notification-types/${row.id}/edit`}
              style={{ textDecoration: "none" }}
            >
              {t("actions.edit", { defaultValue: "Edit" })}
            </a>
          </Box>
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
              <SearchBar
                fields={searchFields}
                placeholder={t("notificationTypes.search.placeholder", {
                  defaultValue: "Search notification types...",
                })}
              />
            </Box>
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
              {t("notificationTypes.actions.createType", {
                defaultValue: "Create Type",
              })}
            </CreateButton>
          </Box>
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

      <NotificationTypeCreateModal
        modalProps={{
          isOpen: createModalOpen,
          onClose: () => setCreateModalOpen(false),
        }}
      />
    </>
  );
};
