import {
  type HttpError,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
  useNotification,
} from "@refinedev/core";
import { DeleteButton, useAutocomplete } from "@refinedev/mui";
import { useSearchParams } from "react-router";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormLabel from "@mui/material/FormLabel";
import { Drawer, DrawerHeader } from "../../drawer";
import type { ITopUp, IDevice, IPlan, Nullable } from "../../../interfaces";

type Props = {
  action: "create" | "edit";
};

export const PaymentDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { open } = useNotification();

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
  } = useForm<ITopUp, HttpError, Nullable<ITopUp>>({
    defaultValues: {
      amount: 0,
      note: "",
      status: "CREATED",
      imei: "",
      planId: "",
    },
    refineCoreProps: {
      resource: "topup",
      action: props.action,
      redirect: false,
      onMutationSuccess: (data: any) => {
        // Check if this is a create action and we have a paymentUrl
        if (props.action === "create" && data?.data?.paymentUrl) {
          // Show success notification
          open?.({
            type: "success",
            message: t("notifications.createSuccess"),
            description: t("topup.messages.redirectToPayment"),
          });

          // Redirect to payment URL
          setTimeout(() => {
            window.open(data.data.paymentUrl, "_blank");
            onDrawerCLose();
          }, 1500);
        } else {
          // Normal success flow for edit
          open?.({
            type: "success",
            message: t("notifications.success"),
          });
          onDrawerCLose();
        }
      },
      onMutationError: (error: any) => {
        open?.({
          type: "error",
          message: t("notifications.error"),
          description: error?.response?.data?.error || error?.message,
        });
      },
    },
  });

  const selectedPlanId = watch("planId");

  // Fetch devices for autocomplete
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
      setValue("amount", plan.price);
      setValue("note", `Thanh toán gói cước ${plan.name.toLowerCase()}`);
    }
  };

  // Custom submit for create action to add userId
  const handleSubmit = async (values: any) => {
    if (props.action === "create") {
      // For create, transform data to match API expectations
      const submitData = {
        imei: values.imei,
        planId: values.planId,
        userId: "admin", // You can get this from auth context
      } as any;
      onFinish(submitData);
    } else {
      // For edit, use normal flow
      onFinish(values);
    }
  };

  return (
    <Drawer
      sx={{
        "& .MuiDrawer-paper": {
          width: { sm: "100%", md: 600 },
        },
      }}
      PaperProps={{
        sx: {
          width: { sm: "100%", md: 600 },
        },
      }}
      anchor="right"
      open
      onClose={onDrawerCLose}
    >
      <DrawerHeader
        title={t(`topup.titles.${props.action}`)}
        onCloseClick={onDrawerCLose}
      />
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
            padding: "24px",
          }}
        >
          {props.action === "create" && (
            <>
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
                      field: "Device",
                    }),
                  }}
                  render={({ field }) => (
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
                  required
                >
                  {t("topup.fields.plan")}
                </FormLabel>
                <Controller
                  control={control}
                  name="planId"
                  rules={{
                    required: t("errors.required.field", {
                      field: "Plan",
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
            </>
          )}

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
              {t("topup.fields.amount")}
            </FormLabel>
            <TextField
              {...register("amount", {
                required: t("errors.required.field", {
                  field: "Amount",
                }),
                valueAsNumber: true,
              })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
              margin="none"
              size="small"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">VND</InputAdornment>
                ),
              }}
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
              {...register("note")}
              margin="none"
              size="small"
              multiline
              minRows={3}
              maxRows={5}
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
              {t("topup.fields.status")}
            </FormLabel>
            <Controller
              control={control}
              name="status"
              rules={{
                required: t("errors.required.field", {
                  field: "Status",
                }),
              }}
              render={({ field }) => (
                <ToggleButtonGroup
                  color="primary"
                  {...field}
                  exclusive
                  sx={{
                    "& .MuiToggleButton-root": {
                      flex: 1,
                    },
                  }}
                >
                  <ToggleButton size="small" value="CREATED">
                    {t("enum.topupStatuses.CREATED")}
                  </ToggleButton>
                  <ToggleButton size="small" value="PAID">
                    {t("enum.topupStatuses.PAID")}
                  </ToggleButton>
                  <ToggleButton size="small" value="FAILED">
                    {t("enum.topupStatuses.FAILED")}
                  </ToggleButton>
                  <ToggleButton size="small" value="CANCELLED">
                    {t("enum.topupStatuses.CANCELLED")}
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            />
            {errors.status && (
              <FormHelperText error>{errors.status.message}</FormHelperText>
            )}
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
              resource="topup"
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
              e.preventDefault();
              handleSubmit(getValues());
            }}
          >
            {t("buttons.save")}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
