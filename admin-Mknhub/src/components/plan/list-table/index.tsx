import React from "react";
import { useTranslate } from "@refinedev/core";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@refinedev/mui";
import Typography from "@mui/material/Typography";
import { StatusChip } from "../../StatusChip";
import { defaultDataGridStyles } from "../../DataGridStyles";
import { SearchBar } from "../../SearchBar";
import type { IPlan } from "../../../interfaces";

type Props = ReturnType<typeof useDataGrid<IPlan>> & {
  onEdit?: (id: string | number) => void;
  onShow?: (id: string | number) => void;
};

export const PlanListTable = (props: Props) => {
  const { dataGridProps, search, filters, onEdit, onShow } = props;
  const t = useTranslate();

  // Define search fields
  const searchFields = [
    { value: "id", label: "ID" },
    { value: "name", label: "Name" },
    { value: "isActive", label: "Status" },
  ];

  const columns = React.useMemo<GridColDef<IPlan>[]>(
    () => [
      {
        field: "id",
        headerName: t("plans.fields.id"),
        minWidth: 200,
        maxWidth: 250,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            {value}
          </Typography>
        ),
      },
      {
        field: "name",
        headerName: t("plans.fields.name"),
        minWidth: 150,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {value}
          </Typography>
        ),
      },
      {
        field: "price",
        headerName: t("plans.fields.price"),
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
              color: "primary.main",
            }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value)}
          </Typography>
        ),
      },
      {
        field: "durationMonths",
        headerName: t("plans.fields.durationMonths"),
        minWidth: 100,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            {value} {t("plans.fields.months")}
          </Typography>
        ),
      },
      {
        field: "isActive",
        headerName: t("plans.fields.isActive.label"),
        minWidth: 100,
        flex: 1,
        renderCell: ({ value }) => (
          <StatusChip status={value ? "ACTIVE" : "INACTIVE"} />
        ),
      },
      {
        field: "description",
        headerName: t("plans.fields.description"),
        minWidth: 200,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value || "-"}
          </Typography>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <SearchBar fields={searchFields} placeholder="Search plans..." />
      <DataGrid
        {...dataGridProps}
        columns={columns}
        filterModel={undefined}
        autoHeight
        pageSizeOptions={[10, 20, 50, 100]}
        sx={defaultDataGridStyles}
        onRowClick={({ id }) => {
          onShow?.(id);
        }}
      />
    </>
  );
};
