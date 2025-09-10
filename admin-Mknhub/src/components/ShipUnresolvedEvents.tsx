import React, { useState } from "react";
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
  Collapse,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useCustom } from "@refinedev/core";
import { DateField } from "@refinedev/mui";
import { IShipNotificationEvent } from "../interfaces/ship-notification-event";

interface ShipUnresolvedEventsProps {
  shipCode: string;
  shipName?: string;
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

export const ShipUnresolvedEvents: React.FC<ShipUnresolvedEventsProps> = ({
  shipCode,
  shipName,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useCustom<{
    data: IShipNotificationEvent[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    url: `v1/ship-notifications/events/ship/${shipCode}/unresolved`,
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

  const criticalEvents = events.filter(
    (e) => e.type?.includes("8D") || e.type?.includes("10D")
  );
  const over1HourEvents = events.filter((e) => (e.duration_minutes || 0) > 60);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (total === 0) {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        No unresolved events for this ship
      </Alert>
    );
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6">Unresolved Events ({total})</Typography>
            {criticalEvents.length > 0 && (
              <Chip
                icon={<ErrorIcon />}
                label={`${criticalEvents.length} Critical`}
                color="error"
                size="small"
              />
            )}
            {over1HourEvents.length > 0 && (
              <Chip
                icon={<WarningIcon />}
                label={`${over1HourEvents.length} Over 1h`}
                color="warning"
                size="small"
              />
            )}
          </Box>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="show more"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
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
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Stack direction="row" spacing={1}>
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  size="small"
                >
                  Previous
                </Button>
                <Typography variant="body2" sx={{ alignSelf: "center", px: 2 }}>
                  Page {page} of {totalPages}
                </Typography>
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  size="small"
                >
                  Next
                </Button>
              </Stack>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};
