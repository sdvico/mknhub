import React from "react";
import { useTranslate, useShow } from "@refinedev/core";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@refinedev/mui";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { grey } from "@mui/material/colors";
import { StatusChip } from "../../StatusChip";
import { defaultDataGridStyles } from "../../DataGridStyles";
import { SearchBar } from "../../SearchBar";
import type { ITopUp } from "../../../interfaces";

type Props = ReturnType<typeof useDataGrid<ITopUp>> & {
  onEdit?: (id: string | number) => void;
  onShow?: (id: string | number) => void;
};

export const PaymentListTable = (props: Props) => {
  const { dataGridProps, search, filters, onEdit, onShow } = props;
  const t = useTranslate();

  // Define search fields
  const searchFields = [
    { value: "id", label: "ID" },
    { value: "status", label: "Status" },
    { value: "paymentMethod", label: "Payment Method" },
  ];

  const columns = React.useMemo<GridColDef<ITopUp>[]>(
    () => [
      {
        field: "id",
        headerName: t("topup.fields.id"),
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
        field: "amount",
        headerName: t("topup.fields.amount"),
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
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
        field: "status",
        headerName: t("topup.fields.status"),
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => <StatusChip status={value} />,
      },
      {
        field: "note",
        headerName: t("topup.fields.note"),
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
            {value}
          </Typography>
        ),
      },
      {
        field: "createdAt",
        headerName: t("topup.fields.createdAt"),
        minWidth: 120,
        flex: 1,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            {new Intl.DateTimeFormat("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(value))}
          </Typography>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <SearchBar fields={searchFields} placeholder="Search payments..." />
      <DataGrid
        {...dataGridProps}
        columns={columns}
        filterModel={undefined}
        getRowHeight={() => "auto"}
        pageSizeOptions={[10, 20, 50, 100]}
        sx={defaultDataGridStyles}
        onRowClick={({ id }) => {
          onShow?.(id);
        }}
      />
    </>
  );
};
