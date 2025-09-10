import React from "react";
import { useCustom } from "@refinedev/core";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  DirectionsBoat as ShipIcon,
  Wifi as ConnectedIcon,
  Warning as WarningIcon,
  WifiOff as OfflineIcon,
} from "@mui/icons-material";

type ShipStats = {
  total: number;
  disconnected_mkn: number;
  connected: number;
  with_owner_no_push_token: number;
};

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  subtitle?: string;
}> = ({ title, value, icon, color, bgColor, borderColor, subtitle }) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: 2,
      border: `1px solid ${borderColor}`,
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: 4,
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: bgColor,
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700} color={color}>
            {value.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export const ShipStatsHeader: React.FC = () => {
  const { data, isLoading } = useCustom<{ data: ShipStats }>({
    url: "ships/stats",
    method: "get",
  });

  const stats = (data as any)?.data?.data as ShipStats | undefined;

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Đang tải thống kê...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Thống kê cảnh báo theo tàu
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng số tàu"
            value={stats?.total ?? 0}
            icon={<ShipIcon />}
            color="#2563EB"
            bgColor="#EFF6FF"
            borderColor="#93C5FD"
            subtitle="Tất cả tàu trong hệ thống"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Đang kết nối"
            value={stats?.connected ?? 0}
            icon={<ConnectedIcon />}
            color="#16A34A"
            bgColor="#F0FDF4"
            borderColor="#86EFAC"
            subtitle="Tàu hoạt động bình thường"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Có cảnh báo"
            value={stats?.disconnected_mkn ?? 0}
            icon={<WarningIcon />}
            color="#EA580C"
            bgColor="#FFF7ED"
            borderColor="#FDBA74"
            subtitle="Cần xử lý ngay"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ngoại tuyến"
            value={stats?.with_owner_no_push_token ?? 0}
            icon={<OfflineIcon />}
            color="#DC2626"
            bgColor="#FEF2F2"
            borderColor="#FCA5A5"
            subtitle="Mất kết nối"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
