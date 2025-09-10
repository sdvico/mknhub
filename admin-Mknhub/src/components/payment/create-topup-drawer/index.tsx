import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  useApiUrl,
  useCustomMutation,
  useGetToPath,
  useGo,
  useNotification,
  useTranslate,
} from "@refinedev/core";
import { useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useSearchParams } from "react-router";
import type { IDevice, IPlan } from "../../../interfaces";
import { Drawer, DrawerHeader } from "../../drawer";

type Props = {
  open: boolean;
  onClose: () => void;
  deviceImei?: string;
};

export const CreateTopupDrawer = (props: Props) => {
  const { open, onClose, deviceImei } = props;
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { open: openNotification } = useNotification();

  const { mutate, isLoading } = useCustomMutation<any>();

  const onDrawerClose = () => {
    onClose();
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      imei: deviceImei || "",
      planId: "",
      userId: "admin", // Default admin user
      skipPayment: true,
      paymentMethod: "CASH",
      note: "",
    },
  });

  useEffect(() => {
    const imei = getValues("imei");
    if (deviceImei && deviceImei !== imei) {
      setValue("imei", deviceImei);
    }
  }, [deviceImei]);

  const selectedPlanId = watch("planId");

  // Fetch devices for autocomplete - chỉ khi không có deviceImei
  const { autocompleteProps: deviceAutocompleteProps } =
    useAutocomplete<IDevice>({
      resource: "devices",
      onSearch: (value) => [
        {
          field: "imei",
          operator: "contains",
          value,
        },
      ],
      queryOptions: {
        enabled: !deviceImei, // Chỉ fetch khi không có deviceImei
      },
    });

  // Fetch device info khi có deviceImei để hiển thị thông tin
  const { queryResult: deviceInfo } = useAutocomplete<IDevice>({
    resource: "devices",
    onSearch: (value) => [
      {
        field: "imei",
        operator: "eq",
        value: deviceImei || "",
      },
    ],
    queryOptions: {
      enabled: !!deviceImei, // Chỉ fetch khi có deviceImei
    },
  });

  // Fetch plans for autocomplete
  const { autocompleteProps: planAutocompleteProps } = useAutocomplete<IPlan>({
    resource: "subscriptions/plans",
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });

  // Auto-calculate amount when plan is selected
  const handlePlanChange = (plan: IPlan | null) => {
    if (plan) {
      setValue("note", `Payment for ${plan.name.toLowerCase()} plan`);
    }
  };

  const onSubmit = async (values: any) => {
    console.log("values---", values);

    try {
      mutate(
        {
          url: `topup/create-paid`,
          method: "post",
          values: {
            imei: values.imei,
            planId: values.planId,
            userId: values.userId,
            skipPayment: values.skipPayment,
            paymentMethod: values.paymentMethod,
          },
        },
        {
          onSuccess: (result) => {
            console.log("data---", result);
            if (result.data.success) {
              openNotification?.({
                type: "success",
                message: t("notifications.createSuccess"),
                description: `TopUp ID: ${result.data.topUpId}`,
              });
              // Reset form and close drawer
              reset();
              onDrawerClose();
              // Refresh the page or trigger a refetch
              window.location.reload();
            } else {
              openNotification?.({
                type: "error",
                message: t("notifications.error"),
                description:
                  result.data?.error ||
                  t("errors.unknown", "Unknown error occurred"),
              });
            }
          },
          onError: (error) => {
            console.log("error---", error);
          },
        }
      );
      // const response = await fetch(`${apiUrl}/payments/create-paid`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     imei: values.imei,
      //     planId: values.planId,
      //     userId: values.userId,
      //     skipPayment: values.skipPayment,
      //     paymentMethod: values.paymentMethod,
      //   }),
      // });
      // const result = await response.json();
    } catch (error) {
      console.error("Error creating topup:", error);
      openNotification?.({
        type: "error",
        message: t("notifications.error"),
        description: t(
          "errors.createFailed",
          "Failed to create topup. Please try again."
        ),
      });
    }
  };

  return (
    <Drawer
      sx={{
        "& .MuiDrawer-paper": {
          width: { sm: "100%", md: 500 },
        },
      }}
      PaperProps={{
        sx: {
          width: { sm: "100%", md: 500 },
        },
      }}
      anchor="right"
      open={open}
      onClose={onDrawerClose}
    >
      <DrawerHeader
        title={t("topup.titles.create")}
        onCloseClick={onDrawerClose}
      />
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack
          direction="column"
          gap={3}
          sx={{
            overflow: "auto",
            padding: "24px",
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
              {t("topup.fields.device")}
            </FormLabel>
            <Controller
              control={control}
              name="imei"
              rules={{
                required: t("errors.required.field", {
                  field: t("topup.fields.device"),
                }),
              }}
              render={({ field }) =>
                deviceImei ? (
                  // Nếu có deviceImei, hiển thị trực tiếp
                  <Box>
                    <TextField
                      value={field.value}
                      margin="none"
                      size="small"
                      disabled
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    />
                    {deviceInfo?.data?.data?.[0] && (
                      <Box sx={{ mt: 0.5 }}>
                        {deviceInfo.data.data[0].name && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            Name: {deviceInfo.data.data[0].name}
                          </Typography>
                        )}
                        {deviceInfo.data.data[0].plateNumber && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            Plate: {deviceInfo.data.data[0].plateNumber}
                          </Typography>
                        )}
                        {deviceInfo.data.data[0].shipName && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            Ship: {deviceInfo.data.data[0].shipName}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                ) : (
                  // Nếu không có deviceImei, hiển thị autocomplete
                  <Autocomplete
                    {...deviceAutocompleteProps}
                    value={
                      deviceAutocompleteProps.options?.find(
                        (device) => device.imei === field.value
                      ) || null
                    }
                    onChange={(_, value) => {
                      field.onChange(value?.imei || "");
                    }}
                    getOptionLabel={(item) => {
                      return item.imei
                        ? `${item.imei}${item.name ? ` - ${item.name}` : ""}`
                        : "";
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option?.imei === value?.imei
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.imei}
                        helperText={errors.imei?.message}
                        margin="none"
                        size="small"
                        placeholder={t("topup.fields.device")}
                        required
                      />
                    )}
                  />
                )
              }
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
              {t("topup.fields.plan")}
            </FormLabel>
            <Controller
              control={control}
              name="planId"
              rules={{
                required: t("errors.required.field", {
                  field: t("topup.fields.plan"),
                }),
              }}
              render={({ field }) => (
                <Autocomplete
                  {...planAutocompleteProps}
                  value={
                    planAutocompleteProps.options?.find(
                      (plan) => plan.id === field.value
                    ) || null
                  }
                  onChange={(_, value) => {
                    field.onChange(value?.id || "");
                    handlePlanChange(value);
                  }}
                  getOptionLabel={(item) => {
                    return item.name
                      ? `${item.name} - ${new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}`
                      : "";
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.planId}
                      helperText={errors.planId?.message}
                      margin="none"
                      size="small"
                      placeholder={t("topup.fields.plan")}
                    />
                  )}
                />
              )}
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
            >
              {t("topup.fields.note")}
            </FormLabel>
            <TextField
              {...control.register("note")}
              margin="none"
              size="small"
              multiline
              minRows={2}
              maxRows={3}
              placeholder={t("topup.fields.note")}
            />
          </FormControl>
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "24px",
            gap: 2,
            marginTop: "auto",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            color="secondary"
            variant="outlined"
            size="medium"
            onClick={onDrawerClose}
            disabled={isSubmitting}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="medium"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting
              ? t("buttons.loading", "Loading...")
              : t("topup.actions.add")}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
