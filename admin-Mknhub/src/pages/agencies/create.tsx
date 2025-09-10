import React from "react";
import { useForm } from "@refinedev/react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useNotification, useCreate } from "@refinedev/core";

interface AgencyCreateModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
}

export const AgencyCreateModal: React.FC<AgencyCreateModalProps> = ({
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
  } = useForm<{ name: string; code: string }>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutate({ resource: "agencies", values: data });
      open?.({ type: "success", message: "Agency created successfully" });
      reset();
      onClose();
    } catch (error) {
      open?.({ type: "error", message: "Failed to create agency" });
    }
  });

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Agency</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
          <TextField
            {...register("name", { required: "Name is required" })}
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message as string}
            placeholder="Enter agency name"
          />
          <TextField
            {...register("code", { required: "Code is required" })}
            label="Code"
            fullWidth
            margin="normal"
            error={!!errors.code}
            helperText={errors.code?.message as string}
            placeholder="Unique code"
          />
          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Create
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
