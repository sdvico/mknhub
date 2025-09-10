import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
} from "@mui/material";

export const WarningsTab: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thống kê Thông báo Cảnh báo
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Tỷ lệ gửi thành công
            </Typography>
            <LinearProgress
              variant="determinate"
              value={60}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Box mt={1} display="flex" justifyContent="space-between">
              <Typography variant="caption">Đã gửi</Typography>
              <Typography variant="caption">Thất bại</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Tỷ lệ xác nhận
            </Typography>
            <LinearProgress
              variant="determinate"
              value={60}
              color="primary"
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Box mt={1} display="flex" justifyContent="space-between">
              <Typography variant="caption">Đã xác nhận</Typography>
              <Typography variant="caption">Chưa xác nhận</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
