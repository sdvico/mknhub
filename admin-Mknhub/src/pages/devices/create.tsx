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
} from "@mui/material";
import { useNotification, useCreate } from "@refinedev/core";
import type { IDevice } from "../../interfaces";

interface DeviceCreateModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
}

export const DeviceCreateModal: React.FC<DeviceCreateModalProps> = ({
  modalProps,
}) => {
  const { isOpen, onClose } = modalProps;
  const { open } = useNotification();
  const { mutate } = useCreate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IDevice>({
    defaultValues: {
      deviceStatus: "PENDING",
      dataStatus: "INACTIVE",
    },
  });

  const onSubmit = handleSubmit(async (data: FieldValues) => {
    try {
      const createData = data as IDevice;
      await mutate({
        resource: "devices",
        values: createData,
      });

      open?.({
        type: "success",
        message: "Device created successfully",
      });
      reset();
      onClose();
    } catch (error) {
      open?.({
        type: "error",
        message: "Failed to create device",
      });
    }
  });

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Device</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
          <TextField
            {...register("imei", {
              required: "IMEI is required",
              pattern: {
                value: /^[0-9]{15}$/,
                message: "IMEI must be 15 digits",
              },
            })}
            label="IMEI"
            fullWidth
            margin="normal"
            error={!!errors.imei}
            helperText={errors.imei?.message as string}
            placeholder="Enter IMEI"
          />

          <TextField
            {...register("name")}
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message as string}
            placeholder="Enter device name"
          />

          <TextField
            {...register("plateNumber", {
              required: "Plate number is required",
            })}
            label="Plate Number"
            fullWidth
            margin="normal"
            error={!!errors.plateNumber}
            helperText={errors.plateNumber?.message as string}
            placeholder="Enter plate number"
          />

          <TextField
            {...register("shipName", { required: "Ship name is required" })}
            label="Ship Name"
            fullWidth
            margin="normal"
            error={!!errors.shipName}
            helperText={errors.shipName?.message as string}
            placeholder="Enter ship name"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Device Status</InputLabel>
            <Select
              {...register("deviceStatus", { required: "Status is required" })}
              label="Device Status"
              error={!!errors.deviceStatus}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Data Status</InputLabel>
            <Select
              {...register("dataStatus", {
                required: "Data status is required",
              })}
              label="Data Status"
              error={!!errors.dataStatus}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </Select>
          </FormControl>

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Create Device
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
