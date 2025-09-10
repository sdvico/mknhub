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
import InputAdornment from "@mui/material/InputAdornment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormLabel from "@mui/material/FormLabel";
import { Drawer, DrawerHeader } from "../../drawer";
import type { IPlan, Nullable } from "../../../interfaces";

type Props = {
  action: "create" | "edit";
};

export const PlanDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();

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
  } = useForm<IPlan, HttpError, Nullable<IPlan>>({
    defaultValues: {
      name: "",
      price: 0,
      durationMonths: 1,
      description: "",
      isActive: true,
    },
    refineCoreProps: {
      resource: "subscriptions/plans",
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        onDrawerCLose();
      },
    },
  });

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
        title={t(`plans.titles.${props.action}`)}
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
              {t("plans.fields.name")}
            </FormLabel>
            <TextField
              {...register("name", {
                required: t("errors.required.field", {
                  field: "Name",
                }),
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
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
              {t("plans.fields.price")}
            </FormLabel>
            <TextField
              {...register("price", {
                required: t("errors.required.field", {
                  field: "Price",
                }),
                valueAsNumber: true,
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
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
              required
            >
              {t("plans.fields.durationMonths")}
            </FormLabel>
            <TextField
              {...register("durationMonths", {
                required: t("errors.required.field", {
                  field: "Duration",
                }),
                valueAsNumber: true,
                min: 1,
              })}
              error={!!errors.durationMonths}
              helperText={errors.durationMonths?.message}
              margin="none"
              size="small"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {t("plans.fields.months")}
                  </InputAdornment>
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
              {t("plans.fields.description")}
            </FormLabel>
            <TextField
              {...register("description")}
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
              {t("plans.fields.isActive.label")}
            </FormLabel>
            <Controller
              control={control}
              name="isActive"
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
                  <ToggleButton size="small" value={true}>
                    {t("plans.fields.isActive.true")}
                  </ToggleButton>
                  <ToggleButton size="small" value={false}>
                    {t("plans.fields.isActive.false")}
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
              resource="subscriptions/plans"
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
    </Drawer>
  );
};
