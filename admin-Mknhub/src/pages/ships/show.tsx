import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Grid,
} from "@mui/material";
import { useShow, useTranslate } from "@refinedev/core";
import { DateField } from "@refinedev/mui";
import { IShip } from "../../interfaces/ship";
import { ShipUnresolvedEvents } from "../../components/ShipUnresolvedEvents";

interface ShipShowModalProps {
  modalProps: { isOpen: boolean; onClose: () => void };
  id: string;
}

export const ShipShowModal: React.FC<ShipShowModalProps> = ({
  modalProps,
  id,
}) => {
  const { isOpen, onClose } = modalProps;

  const t = useTranslate();

  const { queryResult } = useShow<IShip>({ resource: "ships", id });
  const { data, isLoading } = queryResult;
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
                  {t("ships.fields.plate_number", "Số hiệu")}
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 160,
                      height: 24,
                      background: "#eee",
                    }}
                  />
                </Typography>
                <Typography variant="subtitle2">
                  {t("ships.fields.name", "Tên tàu")}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 200,
                      height: 20,
                      background: "#eee",
                    }}
                  />
                </Typography>
                <Typography variant="subtitle2">
                  {t("ships.fields.status", "Trạng thái")}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 100,
                      height: 28,
                      background: "#eee",
                      borderRadius: 999,
                    }}
                  />
                </Box>
                <Typography variant="subtitle2">
                  {t("ships.fields.ownerphone", "SĐT chủ tàu")}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 160,
                      height: 20,
                      background: "#eee",
                    }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  {t("ships.fields.last_signal", "Tín hiệu cuối")}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 140,
                      height: 20,
                      background: "#eee",
                    }}
                  />
                </Typography>
                <Typography variant="subtitle2">
                  {t("ships.fields.location", "Vị trí")}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 180,
                      height: 20,
                      background: "#eee",
                    }}
                  />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>
    );

  const lat = record?.lastReport?.lat ?? record?.lastmessage?.report?.lat;
  const lng = record?.lastReport?.lng ?? record?.lastmessage?.report?.lng;
  const lastTime =
    record?.lastmessage?.created_at || record?.lastReport?.reported_at;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{t("ships.show.title", "Thông tin tàu thuyền")}</DialogTitle>
      <DialogContent sx={{ maxHeight: "80vh", overflow: "auto" }}>
        {record && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  {t("ships.fields.plate_number", "Số hiệu")}
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {record.plate_number}
                </Typography>

                <Typography variant="subtitle2">
                  {t("ships.fields.name", "Tên tàu")}
                </Typography>
                <Typography sx={{ mb: 2 }}>{record.name || "-"}</Typography>

                <Typography variant="subtitle2">
                  {t("ships.fields.status", "Trạng thái")}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={record.status}
                    size="small"
                    sx={{ borderRadius: 999 }}
                  />
                </Box>

                <Typography variant="subtitle2">
                  {t("ships.fields.ownerphone", "SĐT chủ tàu")}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  {record.ownerphone || "-"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  {t("ships.fields.last_signal", "Tín hiệu cuối")}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  {lastTime ? <DateField value={lastTime} format="LLL" /> : "-"}
                </Typography>

                <Typography variant="subtitle2">
                  {t("ships.fields.location", "Vị trí")}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  {lat !== undefined && lng !== undefined
                    ? `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`
                    : "-"}
                </Typography>
              </Grid>
            </Grid>

            {/* Unresolved Events Section */}
            <ShipUnresolvedEvents
              shipCode={record.plate_number}
              shipName={record.name}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.close")}</Button>
      </DialogActions>
    </Dialog>
  );
};
