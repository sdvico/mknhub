import React, { useEffect, useMemo } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useOne, useList, useUpdate } from "@refinedev/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useNotification } from "@refinedev/core";

interface CustomerEditModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
  formProps: any;
  id?: string | number;
}

export const CustomerEditModal: React.FC<CustomerEditModalProps> = ({
  modalProps,
  formProps,
  id,
}) => {
  const { isOpen, onClose } = modalProps;
  const { open } = useNotification();

  const { data, isLoading } = useOne({
    resource: "users",
    id: id || "",
    queryOptions: {
      enabled: !!id && isOpen,
    },
  });

  const { data: agenciesData } = useList({
    resource: "agencies",
    pagination: { current: 1, pageSize: 100 },
    queryOptions: { enabled: isOpen },
  });

  const agencies = useMemo(() => agenciesData?.data ?? [], [agenciesData]);

  const { mutate: updateUser } = useUpdate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    if (data?.data) {
      const user = data.data;
      setValue("username", user.username);
      setValue("fullname", user.fullname);
      setValue("phone", user.phone);
      setValue("state", user.state);
      setValue("agency_id", (user as any).agency_id || "");
      setValue("agent_code", (user as any).agent_code || "");
    }
  }, [data, setValue]);

  const onSubmit = async (formData: any) => {
    try {
      await updateUser({
        resource: "users",
        id: id as any,
        values: {
          username: formData.username,
          fullname: formData.fullname,
          phone: formData.phone,
          state: formData.state,
          agency_id: formData.agency_id || null,
          agent_code: formData.agent_code || null,
        },
      });
      open?.({ type: "success", message: "Customer updated successfully" });
      onClose();
    } catch (error) {
      open?.({ type: "error", message: "Failed to update customer" });
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
      <DialogTitle>Edit Customer</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            {...register("username", { required: "Username is required" })}
            label="Username"
            fullWidth
            margin="normal"
            error={!!errors.username as any}
            helperText={(errors as any).username?.message as string}
          />

          <TextField
            {...register("fullname", { required: "Full name is required" })}
            label="Full Name"
            fullWidth
            margin="normal"
            error={!!errors.fullname as any}
            helperText={(errors as any).fullname?.message as string}
          />

          <TextField
            {...register("phone")}
            label="Phone Number"
            fullWidth
            margin="normal"
            error={!!errors.phone as any}
            helperText={(errors as any).phone?.message as string}
          />

          <TextField
            {...register("gsm")}
            label="Phone Number"
            fullWidth
            margin="normal"
            error={!!errors.gsm}
            helperText={errors.gsm?.message as string}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>State</InputLabel>
            <Select {...register("state")} label="State">
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Agency</InputLabel>
            <Select {...register("agency_id")} label="Agency" defaultValue="">
              <MenuItem value="">None</MenuItem>
              {agencies.map((a: any) => (
                <MenuItem
                  key={a.id}
                  value={a.id}
                >{`${a.name} (${a.code})`}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            {...register("agent_code")}
            label="Agent Code"
            fullWidth
            margin="normal"
            placeholder="Optional agent code"
          />

          <FormControlLabel
            control={<Switch {...register("enable")} />}
            label="Enable"
            sx={{ mt: 2 }}
          />

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Update Customer
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
