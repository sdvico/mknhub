import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useCustom } from "@refinedev/core";
import { useNavigate } from "react-router";
import { ShipNotificationEventList } from "./list";

interface EventStats {
  total: number;
  mkn_total: number;
  mkn_by_type: Record<string, number>;
  boundary_near: number;
  boundary_crossed: number;
  open: number;
  resolved: number;
}

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  onClick?: () => void;
}> = ({ title, value, icon, color, onClick }) => (
  <Card
    sx={{
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.2s",
      "&:hover": onClick ? { transform: "translateY(-2px)", boxShadow: 3 } : {},
    }}
    onClick={onClick}
  >
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            p: 1,
            borderRadius: "50%",
            bgcolor: `${color}.light`,
            color: `${color}.contrastText`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export const EventsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showUnresolvedList, setShowUnresolvedList] = useState(false);

  const { data: statsData, isLoading: statsLoading } = useCustom<EventStats>({
    url: "v1/ship-notifications/events/stats",
    method: "get",
  });

  const { data: unresolvedData, isLoading: unresolvedLoading } = useCustom({
    url: "v1/ship-notifications/events/unresolved",
    method: "get",
    config: {
      query: {
        page: 1,
        limit: 5,
        sortBy: "created_at",
        sortOrder: "DESC",
      },
    },
  });

  const stats = statsData?.data;
  const unresolvedEvents = unresolvedData?.data?.data || [];

  if (statsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Ship Notification Events Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Events"
            value={stats?.total || 0}
            icon={<InfoIcon />}
            color="info"
            onClick={() => navigate("/ship-notification-events")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Events"
            value={stats?.open || 0}
            icon={<WarningIcon />}
            color="warning"
            onClick={() => setShowUnresolvedList(true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved Events"
            value={stats?.resolved || 0}
            icon={<CheckCircleIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="MKN Events"
            value={stats?.mkn_total || 0}
            icon={<ErrorIcon />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* MKN Events Breakdown */}
      {stats?.mkn_by_type && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              MKN Events by Type
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {Object.entries(stats.mkn_by_type).map(([type, count]) => (
                <Chip
                  key={type}
                  label={`${type}: ${count}`}
                  color={
                    type.includes("8D") || type.includes("10D")
                      ? "error"
                      : type.includes("6H")
                      ? "warning"
                      : "info"
                  }
                  variant="outlined"
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Boundary Events */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Boundary Near
              </Typography>
              <Typography variant="h3" color="warning.main">
                {stats?.boundary_near || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Boundary Crossed
              </Typography>
              <Typography variant="h3" color="error.main">
                {stats?.boundary_crossed || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Unresolved Events */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Recent Unresolved Events</Typography>
            <Button
              variant="contained"
              onClick={() => setShowUnresolvedList(true)}
            >
              View All Unresolved
            </Button>
          </Box>

          {unresolvedLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress />
            </Box>
          ) : unresolvedEvents.length === 0 ? (
            <Alert severity="success">No unresolved events!</Alert>
          ) : (
            <Grid container spacing={2}>
              {unresolvedEvents.map((event: any) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">{event.ship_code}</Typography>
                        <Chip
                          label={event.type || "N/A"}
                          color={
                            event.type?.includes("8D") ||
                            event.type?.includes("10D")
                              ? "error"
                              : event.type?.includes("6H")
                              ? "warning"
                              : "info"
                          }
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Started:{" "}
                        {event.started_at
                          ? new Date(event.started_at).toLocaleString()
                          : "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration:{" "}
                        {event.duration_minutes
                          ? `${Math.floor(event.duration_minutes / 60)}h ${
                              event.duration_minutes % 60
                            }m`
                          : "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Unresolved Events List Modal */}
      {showUnresolvedList && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              width: "100%",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Unresolved Events</Typography>
              <Button onClick={() => setShowUnresolvedList(false)}>
                Close
              </Button>
            </Box>
            <Box sx={{ p: 2 }}>
              <ShipNotificationEventList
                showUnresolvedOnly={true}
                defaultView="table"
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
