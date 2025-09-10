import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useTranslate } from "@refinedev/core";
import { ShipList } from "../ships/list";
import { ReportList } from "../reports/list";
import { ShipStatsHeader } from "./ship-stats-header";
import { ShipNotificationList } from "../ship-notifications/list";
import { EventStatsCard } from "../../components/EventStatsCard";
import { useEventStats } from "../../hooks/useEventStats";

export const DashboardPage: React.FC = () => {
  const t = useTranslate();
  const [tab, setTab] = useState(0);
  const {
    data: eventStats,
    isLoading: eventStatsLoading,
    error: eventStatsError,
  } = useEventStats();

  return (
    <Box p={2} sx={{ minHeight: "100vh" }}>
      <ShipStatsHeader />
      <EventStatsCard
        data={eventStats}
        loading={eventStatsLoading}
        error={eventStatsError}
      />

      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            border: "1px solid #dfe3e8",
            borderRadius: 2,
            p: 1,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            TabIndicatorProps={{ style: { display: "none" } }}
            variant="fullWidth"
            sx={{
              mb: 2,
              bgcolor: "#eef2f6",
              p: 0.5,
              borderRadius: 2,
              border: "1px solid #e5e7eb",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                minHeight: 44,
                borderRadius: 1.5,
                bgcolor: "transparent",
                color: "text.secondary",
              },
              "& .Mui-selected": {
                bgcolor: "#ffffff",
                color: "text.primary",
              },
            }}
          >
            <Tab label={t("dashboard.tabs.ships", "Tàu thuyền")} />
            <Tab
              label={t("dashboard.tabs.notifications", "Danh sách thông báo")}
            />
            <Tab label={t("dashboard.tabs.reports", "Báo cáo GPS")} />
          </Tabs>

          <Box sx={{ px: 1, pb: 1 }}>
            {tab === 0 && <ShipList defaultView="card" />}
            {tab === 1 && (
              <>
                <ShipNotificationList defaultView="card" />
              </>
            )}
            {tab === 2 && <ReportList defaultView="card" />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
