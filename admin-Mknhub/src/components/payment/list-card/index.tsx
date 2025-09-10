import React from "react";
import { useTranslate } from "@refinedev/core";
import { useDataGrid } from "@refinedev/mui";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { StatusChip } from "../../StatusChip";
import type { ITopUp } from "../../../interfaces";

type Props = ReturnType<typeof useDataGrid<ITopUp>> & {
  onEdit?: (id: string | number) => void;
  onShow?: (id: string | number) => void;
};

export const PaymentListCard = (props: Props) => {
  const { dataGridProps, onEdit, onShow } = props;
  const t = useTranslate();

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    dataGridProps.onPaginationModelChange?.(
      {
        page: value - 1,
        pageSize: dataGridProps.paginationModel?.pageSize || 10,
      },
      { api: {} as any }
    );
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {dataGridProps.rows?.map((topup: ITopUp) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={topup.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 2,
                },
              }}
              onClick={() => onShow?.(topup.id)}
            >
              <CardContent sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: "14px",
                    fontWeight: "700",
                    mb: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {topup.id}
                </Typography>

                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "700",
                    mb: 1,
                    color: "primary.main",
                  }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(topup.amount)}
                </Typography>

                <Box sx={{ mb: 1 }}>
                  <StatusChip status={topup.status} />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {topup.note}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                >
                  {new Intl.DateTimeFormat("vi-VN", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(topup.createdAt))}
                </Typography>
              </CardContent>

              <CardActions
                sx={{
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  marginTop: "auto",
                  borderTop: "1px solid",
                  borderColor: (theme) => theme.palette.divider,
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShow?.(topup.id);
                  }}
                >
                  View
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(topup.id);
                  }}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {dataGridProps.paginationModel && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "24px",
          }}
        >
          <Pagination
            count={Math.ceil(
              (dataGridProps.rowCount || 0) /
                (dataGridProps.paginationModel.pageSize || 10)
            )}
            page={(dataGridProps.paginationModel.page || 0) + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
