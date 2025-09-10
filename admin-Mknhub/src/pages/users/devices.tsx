import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  Grid,
  Link,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigation, useShow, useTranslate } from "@refinedev/core";
import { useParams } from "react-router";
import { DeviceList } from "../../components/users/device-list";
import type { IDevice, IUser } from "../../interfaces";

interface DeviceWithInfo extends IDevice {
  shipName?: string;
  plateNumber?: string;
  deviceStatus?: string;
  dataStatus?: string;
  expiryDate?: string | null;
  packageName?: string | null;
  packageDuration?: number | null;
  currentFee?: number | null;
}

export const CustomerDevices = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigation();

  console.log("id", id);

  const t = useTranslate();

  const { queryResult } = useShow<IUser>({
    resource: "users",
    id: id,
  });
  const { data: userData, isLoading } = queryResult;
  const user = userData?.data;

  const handleBackClick = () => {
    navigate.goBack();
  };

  console.log("user---", user);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="body1" color="text.secondary">
          Customer not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleBackClick();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            Back to Customers
          </Link>
          <Typography color="text.primary">Customer Devices</Typography>
        </Breadcrumbs>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {user?.fullname || user?.username}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Customer ID: {user?.id} | Phone: {user?.phone}
            </Typography>
          </Box>

          {/* <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button> */}
        </Box>
      </Box>

      {/* Devices List */}
      <Paper sx={{ p: 3 }}>
        <DeviceList username={user.username || ""} />
        {/* <CustomerDevicesList
          username={customerIdentifier}
          onDeviceClick={handleDeviceClick}
        /> */}
      </Paper>
    </Box>
  );
};
