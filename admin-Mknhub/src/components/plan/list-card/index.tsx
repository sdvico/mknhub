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
import type { IPlan } from "../../../interfaces";

type Props = ReturnType<typeof useDataGrid<IPlan>> & {
  onEdit?: (id: string | number) => void;
  onShow?: (id: string | number) => void;
};

export const PlanListCard = (props: Props) => {
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
      {
        api: dataGridProps as any,
      } as any
    );
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {dataGridProps.rows?.map((plan: IPlan) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={plan.id}>
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
              onClick={() => onShow?.(plan.id)}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "700",
                      wordBreak: "break-all",
                    }}
                  >
                    {plan.name}
                  </Typography>
                  <StatusChip status={plan.isActive ? "ACTIVE" : "INACTIVE"} />
                </Box>

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
                  }).format(plan.price)}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Duration: {plan.durationMonths} Month(s)
                </Typography>

                {plan.description && (
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
                    {plan.description}
                  </Typography>
                )}
              </CardContent>

              <CardActions
                sx={{
                  justifyContent: "space-between",
                  px: 2,
                  pb: 2,
                }}
              >
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShow?.(plan.id);
                  }}
                >
                  View
                </Button>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(plan.id);
                  }}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
        }}
      >
        <Pagination
          count={Math.ceil(
            (dataGridProps.rowCount || 0) /
              (dataGridProps.paginationModel?.pageSize || 10)
          )}
          page={(dataGridProps.paginationModel?.page || 0) + 1}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};
