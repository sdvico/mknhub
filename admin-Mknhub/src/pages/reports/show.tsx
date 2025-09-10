import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useShow, useTranslate, useUpdate } from "@refinedev/core";
import { DateField } from "@refinedev/mui";
import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { LocationOn as LocationIcon } from "@mui/icons-material";
import MapView from "../../components/MapView";
import { MapModal } from "../../components/MapModal";
import { IReport, ReportStatus } from "../../interfaces";

const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

interface ReportShowModalProps {
  modalProps: { isOpen: boolean; onClose: () => void };
  id: string;
}

export const ReportShowModal: React.FC<ReportShowModalProps> = ({
  modalProps,
  id,
}) => {
  const { isOpen, onClose } = modalProps;
  const [mapOpen, setMapOpen] = useState(false);
  const t = useTranslate();
  const { queryResult } = useShow<IReport>({ resource: "reports", id });
  const { data, isLoading } = queryResult;
  const { mutate: updateReport, isLoading: isUpdating } = useUpdate();
  const record = data?.data;

  if (isLoading)
    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{t("loading")}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  {t("reports.fields.ship", "Tàu")}
                </Typography>
                <Box
                  sx={{
                    height: 20,
                    width: 140,
                    bgcolor: "#eee",
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
                <Typography variant="subtitle2">
                  {t("reports.fields.port", "Cảng")}
                </Typography>
                <Box
                  sx={{
                    height: 20,
                    width: 120,
                    bgcolor: "#eee",
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
                <Typography variant="subtitle2">
                  {t("reports.fields.status", "Trạng thái")}
                </Typography>
                <Box
                  sx={{
                    height: 28,
                    width: 120,
                    bgcolor: "#eee",
                    borderRadius: 999,
                    mb: 2,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  {t("reports.fields.reported_at", "Thời gian báo cáo")}
                </Typography>
                <Box
                  sx={{
                    height: 20,
                    width: 160,
                    bgcolor: "#eee",
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
                <Typography variant="subtitle2">
                  {t("reports.fields.location", "Vị trí")}
                </Typography>
                <Box
                  sx={{
                    height: 20,
                    width: 180,
                    bgcolor: "#eee",
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">
                  {t("reports.fields.description", "Mô tả")}
                </Typography>
                <Box
                  sx={{
                    height: 60,
                    width: "100%",
                    bgcolor: "#eee",
                    borderRadius: 1,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>
    );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t("reports.show.title", "Chi tiết báo cáo")}</DialogTitle>
      <DialogContent>
        {record && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  {t("reports.fields.ship", "Tàu")}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  {record.reporter_ship?.plate_number || "-"}
                </Typography>
                <Typography variant="subtitle2">
                  {t("reports.fields.port", "Cảng")}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  {record.port_code || "-"}
                </Typography>
                <Typography variant="subtitle2">
                  {t("reports.fields.status", "Trạng thái")}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={String(record.status).toUpperCase()}
                    color={getStatusColor(record.status)}
                    size="small"
                    sx={{ borderRadius: 999 }}
                  />
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <ToggleButtonGroup
                      size="small"
                      exclusive
                      value={record.status}
                      onChange={(_, v: ReportStatus | null) => {
                        if (!v || v === record.status) return;
                        updateReport(
                          {
                            resource: "reports",
                            id,
                            values: { status: v },
                          },
                          {
                            onSuccess: () => {
                              queryResult.refetch?.();
                            },
                          }
                        );
                      }}
                    >
                      <ToggleButton value="pending" disabled={isUpdating}>
                        {t("reports.status.pending", "Pending")}
                      </ToggleButton>
                      <ToggleButton value="approved" disabled={isUpdating}>
                        {t("reports.status.approved", "Approved")}
                      </ToggleButton>
                      <ToggleButton value="rejected" disabled={isUpdating}>
                        {t("reports.status.rejected", "Rejected")}
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  {t("reports.fields.reported_at", "Thời gian báo cáo")}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  <DateField value={record.reported_at} format="LLL" />
                </Typography>
                <Typography variant="subtitle2">
                  {t("reports.fields.location", "Vị trí")}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Typography>
                    {record.lat}, {record.lng}
                  </Typography>
                  <Tooltip title="Xem trên bản đồ">
                    <IconButton
                      size="small"
                      onClick={() => setMapOpen(true)}
                      color="primary"
                    >
                      <LocationIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">
                  {t("reports.fields.description", "Mô tả")}
                </Typography>
                <Typography sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
                  {record.description || "-"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>

      {/* Map Modal */}
      {record && (
        <MapModal
          open={mapOpen}
          onClose={() => setMapOpen(false)}
          lat={record.lat}
          lng={record.lng}
          title="Vị trí báo cáo"
        />
      )}
    </Dialog>
  );
};
