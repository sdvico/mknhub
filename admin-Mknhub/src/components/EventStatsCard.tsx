import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  LocationOn as LocationOnIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";

interface EventStats {
  total: number;
  mkn_total: number;
  mkn_by_type: Record<string, number>;
  boundary_near: number;
  boundary_crossed: number;
  open: number;
  resolved: number;
}

interface EventStatsCardProps {
  data?: EventStats;
  loading?: boolean;
  error?: string;
}

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
}> = ({ title, value, icon, color, bgColor, subtitle }) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: 2,
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

const MknTypeCard: React.FC<{
  mknByType: Record<string, number>;
  total: number;
}> = ({ mknByType, total }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "MKN_2H":
        return { color: "#2563EB", bgColor: "#EFF6FF", borderColor: "#93C5FD" };
      case "MKN_5H":
        return { color: "#16A34A", bgColor: "#F0FDF4", borderColor: "#86EFAC" };
      case "MKN_6H":
        return { color: "#D97706", bgColor: "#FFFBEB", borderColor: "#FCD34D" };
      case "MKN_8D":
        return { color: "#EA580C", bgColor: "#FFF7ED", borderColor: "#FDBA74" };
      case "MKN_10D":
        return { color: "#DC2626", bgColor: "#FEF2F2", borderColor: "#FCA5A5" };
      case "KNL":
        return { color: "#7C3AED", bgColor: "#FAF5FF", borderColor: "#C4B5FD" };
      default:
        return { color: "#6B7280", bgColor: "#F9FAFB", borderColor: "#D1D5DB" };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "MKN_2H":
        return "MKN 2H";
      case "MKN_5H":
        return "MKN 5H";
      case "MKN_6H":
        return "MKN 6H";
      case "MKN_8D":
        return "MKN 8D";
      case "MKN_10D":
        return "MKN 10D";
      case "KNL":
        return "KNL";
      default:
        return type;
    }
  };

  const sortedTypes = Object.entries(mknByType).sort(([, a], [, b]) => b - a);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 2,
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
              bgcolor: "#EFF6FF",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TimelineIcon />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#2563EB">
              {total.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              MKN Events
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Phân loại theo loại
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1}>
          {sortedTypes.map(([type, count]) => {
            const { color, bgColor, borderColor } = getTypeColor(type);
            const percentage =
              total > 0 ? ((count / total) * 100).toFixed(1) : "0";

            return (
              <Box key={type}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={0.5}
                >
                  <Chip
                    label={getTypeLabel(type)}
                    size="small"
                    sx={{
                      bgcolor: bgColor,
                      color: color,
                      borderColor: borderColor,
                      borderWidth: 1,
                      borderStyle: "solid",
                      fontWeight: 600,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    {count.toLocaleString()}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    width: "100%",
                    height: 6,
                    bgcolor: "#f5f5f5",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${percentage}%`,
                      height: "100%",
                      bgcolor: color,
                      borderRadius: 3,
                      transition: "width 0.3s ease",
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {percentage}%
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const EventStatsCard: React.FC<EventStatsCardProps> = ({
  data,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Đang tải thống kê...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Lỗi khi tải thống kê: {error}
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Thống kê Event
      </Typography>

      <Grid container spacing={3}>
        {/* Tổng số events */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng Events"
            value={data.total}
            icon={<NotificationsIcon />}
            color="#2563EB"
            bgColor="#EFF6FF"
            subtitle="Tất cả events"
          />
        </Grid>

        {/* Events chưa xử lý */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Chưa xử lý"
            value={data.open}
            icon={<WarningIcon />}
            color="#EA580C"
            bgColor="#FFF7ED"
            subtitle="Cần xử lý"
          />
        </Grid>

        {/* Events đã xử lý */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Đã xử lý"
            value={data.resolved}
            icon={<CheckCircleIcon />}
            color="#16A34A"
            bgColor="#F0FDF4"
            subtitle="Hoàn thành"
          />
        </Grid>

        {/* Boundary events */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Boundary Events"
            value={data.boundary_near + data.boundary_crossed}
            icon={<LocationOnIcon />}
            color="#7C3AED"
            bgColor="#FAF5FF"
            subtitle={`Near: ${data.boundary_near}, Crossed: ${data.boundary_crossed}`}
          />
        </Grid>

        {/* MKN Events breakdown */}
        <Grid item xs={12} md={6}>
          <MknTypeCard mknByType={data.mkn_by_type} total={data.mkn_total} />
        </Grid>

        {/* Resolution rate */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 2,
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
                    bgcolor: data.resolved > data.open ? "#F0FDF4" : "#FFF7ED",
                    color: data.resolved > data.open ? "#16A34A" : "#EA580C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {data.resolved > data.open ? (
                    <CheckCircleIcon />
                  ) : (
                    <ErrorIcon />
                  )}
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color={data.resolved > data.open ? "#16A34A" : "#EA580C"}
                  >
                    {data.total > 0
                      ? ((data.resolved / data.total) * 100).toFixed(1)
                      : "0"}
                    %
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Tỷ lệ xử lý
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data.resolved}/{data.total} events
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  width: "100%",
                  height: 8,
                  bgcolor: "#f5f5f5",
                  borderRadius: 4,
                  overflow: "hidden",
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    width: `${
                      data.total > 0 ? (data.resolved / data.total) * 100 : 0
                    }%`,
                    height: "100%",
                    bgcolor: data.resolved > data.open ? "#16A34A" : "#EA580C",
                    borderRadius: 4,
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
