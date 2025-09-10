import React from "react";
import { useForm } from "@refinedev/react-hook-form";
import type { FieldValues } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useNotification, useCreate } from "@refinedev/core";
import { v4 as uuidv4 } from "uuid";
import {
  IShipNotification,
  ShipNotificationType,
  NOTIFICATION_STATUS,
} from "../../interfaces/ship-notification";

interface ShipNotificationCreateModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
}

const NOTIFICATION_TYPES: { value: ShipNotificationType; label: string }[] = [
  { value: "NORMAL", label: "Normal" },
  { value: "MKN_2H", label: "Lost Connection 2h" },
  { value: "MKN_5H", label: "Lost Connection 5h" },
  { value: "MKN_6H", label: "Lost Connection 6h" },
  { value: "MKN_8D", label: "Lost Connection 8d" },
  { value: "MKN_10D", label: "Lost Connection 10d" },
  { value: "KNL", label: "Connected back (KNL)" },
  { value: "NEAR_BORDER", label: "Near Border Warning" },
  { value: "CROSS_BORDER", label: "Cross Border" },
];

export const ShipNotificationCreateModal: React.FC<
  ShipNotificationCreateModalProps
> = ({ modalProps }) => {
  const { isOpen, onClose } = modalProps;
  const { open } = useNotification();
  const { mutate } = useCreate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IShipNotification>({
    defaultValues: {
      clientReq: uuidv4(),
      status: NOTIFICATION_STATUS.QUEUED,
      created_at: new Date(),
      boundary_crossed: false,
      boundary_near_warning: false,
      boundary_status_code: "1",
      type: "NORMAL",
      content: "",
      occurred_at: new Date().toISOString(),
    },
  });

  const onSubmit = handleSubmit(async (data: FieldValues) => {
    try {
      const notificationData = data as IShipNotification;
      await mutate({
        resource: "ship-notifications",
        values: {
          ...notificationData,
        },
      });

      open?.({
        type: "success",
        message: "Notification sent successfully",
      });
      reset();
      onClose();
    } catch (error) {
      open?.({
        type: "error",
        message: "Failed to send notification",
      });
    }
  });

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Send Ship Notification</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
          <TextField
            {...register("clientReq", {
              required: "Client Request ID is required",
              pattern: {
                value:
                  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
                message: "Client Request ID must be a valid UUID format",
              },
            })}
            label="Client Request ID"
            fullWidth
            margin="normal"
            error={!!errors.clientReq}
            helperText={errors.clientReq?.message as string}
            placeholder="Auto-generated UUID"
            InputProps={{ readOnly: true }}
          />

          <TextField
            {...register("ship_code", {
              required: "Ship code is required",
            })}
            label="Ship Code"
            fullWidth
            margin="normal"
            error={!!errors.ship_code}
            helperText={errors.ship_code?.message as string}
            placeholder="Enter ship code (e.g., VN-12345)"
          />

          <TextField
            {...register("occurred_at", {
              required: "Occurred at is required",
            })}
            label="Occurred At"
            type="datetime-local"
            fullWidth
            margin="normal"
            error={!!errors.occurred_at}
            helperText={errors.occurred_at?.message as string}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Notification Type</InputLabel>
            <Select
              {...register("type", {
                required: "Notification type is required",
              })}
              label="Notification Type"
              error={!!errors.type}
            >
              {NOTIFICATION_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            {...register("owner_name", { required: "Owner name is required" })}
            label="Owner Name"
            fullWidth
            margin="normal"
            error={!!errors.owner_name}
            helperText={errors.owner_name?.message as string}
            placeholder="Enter owner name"
          />

          <TextField
            {...register("owner_phone", {
              required: "Owner phone is required",
              pattern: {
                value: /^\+[1-9]\d{1,14}$/,
                message:
                  "Phone number must be in E.164 format (e.g. +84901234567)",
              },
            })}
            label="Owner Phone"
            fullWidth
            margin="normal"
            error={!!errors.owner_phone}
            helperText={errors.owner_phone?.message as string}
            placeholder="Enter owner phone (E.164 format)"
          />

          <TextField
            {...register("content", {
              required: "Content is required",
              maxLength: {
                value: 500,
                message: "Content cannot exceed 500 characters",
              },
            })}
            label="Content"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            error={!!errors.content}
            helperText={errors.content?.message as string}
            placeholder="Enter notification content"
          />

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={<Switch {...register("boundary_crossed")} />}
              label="Boundary Crossed"
            />
          </Box>

          <Box sx={{ mt: 1 }}>
            <FormControlLabel
              control={<Switch {...register("boundary_near_warning")} />}
              label="Near Boundary Warning"
            />
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Boundary Status</InputLabel>
            <Select
              {...register("boundary_status_code")}
              label="Boundary Status"
            >
              <MenuItem value="1">Trong phạm vi</MenuItem>
              <MenuItem value="2">Gần phạm vi giới hạn</MenuItem>
              <MenuItem value="3">Vượt phạm vi</MenuItem>
            </Select>
          </FormControl>

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Send Notification
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
