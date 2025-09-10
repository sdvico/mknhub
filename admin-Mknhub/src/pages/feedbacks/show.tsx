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
} from "@mui/material";
import { useShow, useTranslate } from "@refinedev/core";
import { DateField } from "@refinedev/mui";
import { IFeedback, FeedbackStatus } from "../../interfaces";

const getStatusColor = (status: FeedbackStatus) => {
  switch (status) {
    case "new":
      return "warning";
    case "in_progress":
      return "info";
    case "resolved":
      return "success";
    default:
      return "default";
  }
};

interface FeedbackShowModalProps {
  modalProps: { isOpen: boolean; onClose: () => void };
  id: string;
}

export const FeedbackShowModal: React.FC<FeedbackShowModalProps> = ({
  modalProps,
  id,
}) => {
  const t = useTranslate();
  const { isOpen, onClose } = modalProps;
  const { queryResult } = useShow<IFeedback>({ resource: "feedbacks", id });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  if (isLoading)
    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t("loading")}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">{t("feedbacks.fields.reporter", "Người báo")}</Typography>
            <Box sx={{ height: 20, width: 200, bgcolor: '#eee', borderRadius: 1, mb: 2 }} />

            <Typography variant="subtitle2">{t("feedbacks.fields.content", "Nội dung")}</Typography>
            <Box sx={{ height: 60, width: '100%', bgcolor: '#eee', borderRadius: 1, mb: 2 }} />

            <Typography variant="subtitle2">{t("feedbacks.fields.status", "Trạng thái")}</Typography>
            <Box sx={{ height: 28, width: 120, bgcolor: '#eee', borderRadius: 999, mb: 2 }} />

            <Typography variant="subtitle2">{t("feedbacks.fields.created_at", "Tạo lúc")}</Typography>
            <Box sx={{ height: 20, width: 160, bgcolor: '#eee', borderRadius: 1 }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>
    );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("feedbacks.show.title", "Chi tiết góp ý")}</DialogTitle>
      <DialogContent>
        {record && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">{t("feedbacks.fields.reporter", "Người báo")}</Typography>
            <Typography sx={{ mb: 2 }}>
              {record.reporter?.fullname || record.reporter?.username || "-"}
            </Typography>

            <Typography variant="subtitle2">{t("feedbacks.fields.content", "Nội dung")}</Typography>
            <Typography sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
              {record.content}
            </Typography>

            <Typography variant="subtitle2">{t("feedbacks.fields.status", "Trạng thái")}</Typography>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={record.status}
                color={getStatusColor(record.status)}
                size="small"
              />
            </Box>

            <Typography variant="subtitle2">{t("feedbacks.fields.created_at", "Tạo lúc")}</Typography>
            <Typography>
              <DateField value={record.created_at} format="LLL" />
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.close")}</Button>
      </DialogActions>
    </Dialog>
  );
};
