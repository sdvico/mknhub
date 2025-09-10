import React from "react";
import { Chip, ChipProps } from "@mui/material";
import {
  CheckCircle as ActiveIcon,
  Cancel as ExpiredIcon,
  Pause as SuspendedIcon,
  Schedule as PendingIcon,
  AccessTime as TimeIcon,
  Payment as PaymentIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
} from "@mui/icons-material";

export interface StatusChipProps extends Omit<ChipProps, 'icon' | 'label' | 'color'> {
  status: string;
  size?: "small" | "medium";
}

export const StatusChip: React.FC<StatusChipProps> = ({ 
  status, 
  size = "small", 
  ...chipProps 
}) => {
  const getStatusColor = (status: string): ChipProps['color'] => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case "ACTIVE":
      case "SUCCESS":
      case "COMPLETED":
      case "PAID":
        return "success";
      case "EXPIRED":
      case "FAILED":
      case "CANCELLED":
      case "ERROR":
        return "error";
      case "SUSPENDED":
      case "PENDING_APPROVAL":
      case "WARNING":
        return "warning";
      case "PENDING":
      case "PROCESSING":
      case "INFO":
        return "info";
      case "INACTIVE":
      case "OFFLINE":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case "ACTIVE":
      case "SUCCESS":
      case "COMPLETED":
        return <ActiveIcon fontSize="small" />;
      case "EXPIRED":
      case "FAILED":
      case "CANCELLED":
        return <ExpiredIcon fontSize="small" />;
      case "SUSPENDED":
      case "PENDING_APPROVAL":
        return <SuspendedIcon fontSize="small" />;
      case "PENDING":
      case "PROCESSING":
        return <PendingIcon fontSize="small" />;
      case "PAID":
        return <PaymentIcon fontSize="small" />;
      case "ERROR":
        return <ErrorIcon fontSize="small" />;
      case "WARNING":
        return <WarningIcon fontSize="small" />;
      case "INFO":
        return <InfoIcon fontSize="small" />;
      case "INACTIVE":
      case "OFFLINE":
        return <TimeIcon fontSize="small" />;
      default:
        return <TimeIcon fontSize="small" />;
    }
  };

  return (
    <Chip
      icon={getStatusIcon(status)}
      label={status}
      color={getStatusColor(status)}
      size={size}
      {...chipProps}
    />
  );
};
