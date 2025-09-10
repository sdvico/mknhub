import {
  type HttpError,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
} from "@refinedev/core";
import { DeleteButton } from "@refinedev/mui";
import { useSearchParams } from "react-router";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormLabel from "@mui/material/FormLabel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Drawer, DrawerHeader } from "../../drawer";
import type { IUser, Nullable } from "../../../interfaces";
import { useState, useEffect } from "react";
import { useCustom } from "@refinedev/core";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  SignalCellularAlt as SignalIcon,
} from "@mui/icons-material";

type Props = {
  action: "create" | "edit";
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface CustomerDevicesTabProps {
  username: string;
  onDeviceClick: (device: any) => void;
}

const CustomerDevicesTab: React.FC<CustomerDevicesTabProps> = ({
  username,
  onDeviceClick,
}) => {
  const [page, setPage] = useState(1);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const { data: devicesData, isLoading } = useCustom({
    url: "devices",
    method: "get",
    config: {
      query: {
        plateNumber: username,
        page,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    },
    queryOptions: {
      enabled: !!username,
    },
  });

  useEffect(() => {
    if (devicesData?.data) {
      setDevices(Array.isArray(devicesData.data) ? devicesData.data : []);
      setTotalPages((devicesData as any)?.pagination?.totalPages || 1);
      setTotal((devicesData as any)?.pagination?.total || 0);
    }
  }, [devicesData]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "success":
        return "success";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          User Devices ({total})
        </Typography>
      </Box>

      {devices.length === 0 ? (
        <Alert severity="info">No devices found for this user.</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>IMEI</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Model</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Ship</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Data Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Package</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Expiry</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {device.imei || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>{device.model || "N/A"}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {device.shipName || device.plateNumber || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          device.deviceStatus || device.status || "Unknown"
                        }
                        color={
                          getStatusColor(
                            device.deviceStatus || device.status
                          ) as any
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={device.dataStatus || "Unknown"}
                        color={getStatusColor(device.dataStatus) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {device.packageName || "No Package"}
                        </Typography>
                        {device.currentFee && (
                          <Typography variant="caption" color="text.secondary">
                            ${device.currentFee}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(device.expiryDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => onDeviceClick(device)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Location">
                          <IconButton size="small">
                            <LocationIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Signal">
                          <IconButton size="small">
                            <SignalIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export const CustomerDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const [tabValue, setTabValue] = useState(0);

  const onDrawerCLose = () => {
    go({
      to:
        searchParams.get("to") ??
        getToPath({
          action: "list",
        }) ??
        "",
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const {
    control,
    refineCore: { formLoading, queryResult, onFinish },
    saveButtonProps,
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<IUser, HttpError, Nullable<IUser>>({
    defaultValues: {
      username: "",
      fullname: "",
      phone: "",
      state: 1,
      enable: true,
    },
    refineCoreProps: {
      resource: "users",
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        onDrawerCLose();
      },
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeviceClick = (device: any) => {
    // Handle device click - could open a modal or navigate to device details
    console.log("Device clicked:", device);
  };

  const currentUsername = watch("username") || "";

  return (
    <Drawer
      sx={{
        "& .MuiDrawer-paper": {
          width: { sm: "100%", md: 800 },
        },
      }}
      PaperProps={{
        sx: {
          width: { sm: "100%", md: 800 },
        },
      }}
      anchor="right"
      open
      onClose={onDrawerCLose}
    >
      <DrawerHeader
        title={t(`users.titles.${props.action}`)}
        onCloseClick={onDrawerCLose}
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="customer tabs"
        >
          <Tab label="Customer Info" />
          {props.action === "edit" && <Tab label="Devices" />}
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
          autoComplete="off"
        >
          <Stack
            direction="column"
            gap={3}
            sx={{
              overflow: "auto",
            }}
          >
            <FormControl fullWidth>
              <FormLabel
                sx={{
                  marginBottom: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  color: "text.primary",
                }}
                required
              >
                {t("users.fields.username")}
              </FormLabel>
              <TextField
                {...register("username", {
                  required: t("errors.required.field", {
                    field: "Username",
                  }),
                })}
                error={!!(errors as any).username}
                helperText={(errors as any).username?.message}
                margin="none"
                size="small"
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel
                sx={{
                  marginBottom: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  color: "text.primary",
                }}
                required
              >
                {t("users.fields.fullname")}
              </FormLabel>
              <TextField
                {...register("fullname", {
                  required: t("errors.required.field", {
                    field: "Full name",
                  }),
                })}
                error={!!(errors as any).fullname}
                helperText={(errors as any).fullname?.message}
                margin="none"
                size="small"
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel
                sx={{
                  marginBottom: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  color: "text.primary",
                }}
                required
              >
                {t("users.fields.phone")}
              </FormLabel>
              <TextField
                {...register("phone", {
                  required: t("errors.required.field", {
                    field: "Phone",
                  }),
                })}
                error={!!(errors as any).phone}
                helperText={(errors as any).phone?.message}
                margin="none"
                size="small"
                type="tel"
              />
            </FormControl>

            {/* removed legacy gsm */}

            {/* removed legacy gender */}

            <FormControl fullWidth>
              <FormLabel
                sx={{
                  marginBottom: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  color: "text.primary",
                }}
              >
                {t("users.fields.state")}
              </FormLabel>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <ToggleButtonGroup
                    color="primary"
                    exclusive
                    value={field.value}
                    onChange={(_, val) => field.onChange(val)}
                    sx={{
                      "& .MuiToggleButton-root": {
                        flex: 1,
                      },
                    }}
                  >
                    <ToggleButton size="small" value={1}>
                      Active
                    </ToggleButton>
                    <ToggleButton size="small" value={0}>
                      Inactive
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </FormControl>
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "24px",
              gap: 2,
              marginTop: "auto",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            {props.action === "edit" && (
              <DeleteButton
                resource="users"
                recordItemId={queryResult?.data?.data?.id}
                size="medium"
                sx={{
                  marginRight: "auto",
                }}
                onSuccess={() => {
                  onDrawerCLose();
                }}
              />
            )}
            <Button
              color="secondary"
              variant="outlined"
              size="medium"
              onClick={onDrawerCLose}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              {...saveButtonProps}
              size="medium"
              onClick={(e) => {
                saveButtonProps.onClick?.(e);
              }}
            >
              {t("buttons.save")}
            </Button>
          </Box>
        </Box>
      </TabPanel>

      {props.action === "edit" && (
        <TabPanel value={tabValue} index={1}>
          <CustomerDevicesTab
            username={currentUsername}
            onDeviceClick={handleDeviceClick}
          />
        </TabPanel>
      )}
    </Drawer>
  );
};
