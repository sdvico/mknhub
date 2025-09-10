import React, { useEffect } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useOne } from "@refinedev/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNotification } from "@refinedev/core";

interface DeviceEditModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
  formProps: any;
  id?: string | number;
}

export const DeviceEditModal: React.FC<DeviceEditModalProps> = ({
  modalProps,
  formProps,
  id,
}) => {
  const { isOpen, onClose } = modalProps;
  const { open } = useNotification();

  const { data, isLoading } = useOne({
    resource: "devices",
    id: id || "",
    queryOptions: {
      enabled: !!id && isOpen,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (data?.data) {
      const device = data.data;
      setValue("name", device.name);
      setValue("description", device.description);
      setValue("serialNumber", device.serialNumber);
    }
  }, [data, setValue]);

  const onSubmit = async (formData: any) => {
    try {
      // Handle form submission here
      console.log("Form data:", formData);
      open?.({
        type: "success",
        message: "Device updated successfully",
      });
      onClose();
    } catch (error) {
      open?.({
        type: "error",
        message: "Failed to update device",
      });
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Device</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            {...register("name", { required: "Device name is required" })}
            label="Device Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message as string}
          />

          <TextField
            {...register("description")}
            label="Description"
            fullWidth
            margin="normal"
            error={!!errors.description}
            helperText={errors.description?.message as string}
          />

          <TextField
            {...register("serialNumber", { required: "Serial number is required" })}
            label="Serial Number"
            fullWidth
            margin="normal"
            error={!!errors.serialNumber}
            helperText={errors.serialNumber?.message as string}
          />

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              Update Device
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
