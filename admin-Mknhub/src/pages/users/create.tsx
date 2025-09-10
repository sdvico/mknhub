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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useNotification, useCreate } from "@refinedev/core";
import type { IUser } from "../../interfaces";

interface CustomerCreateModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
}

export const CustomerCreateModal: React.FC<CustomerCreateModalProps> = ({
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
  } = useForm<IUser>();

  const onSubmit = handleSubmit(async (data: FieldValues) => {
    try {
      const userData = data as IUser;
      // Backend expects POST /api/users with { username, password, fullname, phone }
      await mutate({
        resource: "users",
        values: {
          username: userData.username,
          password: (userData as any).password || "123456",
          fullname: (userData as any).fullname || userData.username,
          phone: (userData as any).phone,
        },
      });

      open?.({
        type: "success",
        message: "User created successfully",
      });
      reset();
      onClose();
    } catch (error) {
      open?.({
        type: "error",
        message: "Failed to create user",
      });
    }
  });

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
          <TextField
            {...register("username", { required: "Username is required" })}
            label="Username"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message as string}
            placeholder="Enter username"
          />

          <TextField
            {...register("fullname", { required: "Full name is required" })}
            label="Full Name"
            fullWidth
            margin="normal"
            error={!!errors.fullname as any}
            helperText={(errors as any).fullname?.message as string}
            placeholder="Enter full name"
          />

          <TextField
            {...register("phone", { required: "Phone number is required" })}
            label="Phone Number"
            fullWidth
            margin="normal"
            error={!!errors.phone as any}
            helperText={(errors as any).phone?.message as string}
            placeholder="Enter phone number"
          />

          <TextField
            {...register("password")}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            placeholder="Enter password (default 123456)"
          />

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Create User
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
