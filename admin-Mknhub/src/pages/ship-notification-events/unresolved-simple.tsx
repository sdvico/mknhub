import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import { useCustom } from "@refinedev/core";
import { DateField } from "@refinedev/mui";

interface UnresolvedEvent {
  id: string;
  ship_code: string;
  type?: string | null;
  started_at?: Date | null;
  duration_minutes?: number;
  response_minutes_from_6h?: number | null;
  created_at: Date;
}

const getTypeColor = (type: string | null | undefined) => {
  switch (type) {
    case "MKN_2H":
      return "info";
    case "MKN_5H":
      return "info";
    case "MKN_6H":
      return "warning";
    case "MKN_8D":
      return "error";
    case "MKN_10D":
      return "error";
    case "KNL":
      return "success";
    case "BOUNDARY_NEAR":
      return "warning";
    case "BOUNDARY_CROSSED":
      return "error";
    default:
      return "default";
  }
};

const formatDuration = (minutes: number | undefined) => {
  if (!minutes) return "N/A";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const UnresolvedEventsSimple: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, refetch } = useCustom<{
    data: UnresolvedEvent[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    url: "v1/ship-notifications/events/unresolved",
    method: "get",
    config: {
      query: {
        page,
        limit,
        sortBy: "created_at",
        sortOrder: "DESC",
      },
    },
  });

  const events = data?.data?.data || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 0;

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Unresolved Events ({total})
        </Typography>
        <Button variant="contained" onClick={() => refetch()}>
          Refresh
        </Button>
      </Box>

      {events.length === 0 ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          No unresolved events found!
        </Alert>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Total Open
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="warning.main">
                    Over 1 Hour
                  </Typography>
                  <Typography variant="h3" color="warning.main">
                    {
                      events.filter((e) => (e.duration_minutes || 0) > 60)
                        .length
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="error.main">
                    Critical (8D/10D)
                  </Typography>
                  <Typography variant="h3" color="error.main">
                    {
                      events.filter(
                        (e) => e.type?.includes("8D") || e.type?.includes("10D")
                      ).length
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="info.main">
                    MKN Events
                  </Typography>
                  <Typography variant="h3" color="info.main">
                    {events.filter((e) => e.type?.startsWith("MKN")).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Events Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ship Code</TableCell>
                  <TableCell>Event Type</TableCell>
                  <TableCell>Started At</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Response Time</TableCell>
                  <TableCell>Priority</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => {
                  const isCritical =
                    event.type?.includes("8D") || event.type?.includes("10D");
                  const isOver1Hour = (event.duration_minutes || 0) > 60;

                  return (
                    <TableRow
                      key={event.id}
                      sx={{
                        bgcolor: isCritical
                          ? "error.light"
                          : isOver1Hour
                          ? "warning.light"
                          : "inherit",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          {event.ship_code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.type || "N/A"}
                          color={getTypeColor(event.type) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {event.started_at ? (
                          <DateField value={event.started_at} format="LLL" />
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={isOver1Hour ? "error.main" : "text.primary"}
                          fontWeight={isOver1Hour ? "bold" : "normal"}
                        >
                          {formatDuration(event.duration_minutes)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {event.response_minutes_from_6h
                          ? `${event.response_minutes_from_6h}m`
                          : "No response"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            isCritical
                              ? "CRITICAL"
                              : isOver1Hour
                              ? "HIGH"
                              : "NORMAL"
                          }
                          color={
                            isCritical
                              ? "error"
                              : isOver1Hour
                              ? "warning"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Stack direction="row" spacing={1}>
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <Typography variant="body2" sx={{ alignSelf: "center", px: 2 }}>
                  Page {page} of {totalPages}
                </Typography>
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </Stack>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
