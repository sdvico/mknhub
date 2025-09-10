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
} from "@mui/material";
import { useNotification, useCreate, useTranslate } from "@refinedev/core";
import type {
  INotificationType,
  ICreateNotificationType,
} from "../../interfaces/notification-type";

interface NotificationTypeCreateModalProps {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
}

export const NotificationTypeCreateModal: React.FC<
  NotificationTypeCreateModalProps
> = ({ modalProps }) => {
  const t = useTranslate();
  const { isOpen, onClose } = modalProps;
  const { open } = useNotification();
  const { mutate } = useCreate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ICreateNotificationType>();

  const onSubmit = handleSubmit(async (data: FieldValues) => {
    try {
      const createData = data as ICreateNotificationType;
      await mutate({
        resource: "notification-types",
        values: createData,
      });

      open?.({
        type: "success",
        message: t("notificationTypes.create.success", {
          defaultValue: "Notification type created successfully",
        }),
      });
      reset();
      onClose();
    } catch (error) {
      open?.({
        type: "error",
        message: t("notificationTypes.create.error", {
          defaultValue: "Failed to create notification type",
        }),
      });
    }
  });

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t("notificationTypes.create.title", {
          defaultValue: "Create Notification Type",
        })}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
          <TextField
            {...register("code", {
              required: t("validation.required", "Code is required"),
              maxLength: {
                value: 50,
                message: t("validation.maxLength", {
                  defaultValue: "Code cannot exceed 50 characters",
                  max: 50,
                }) as any,
              },
              pattern: {
                value: /^[A-Z][A-Z0-9_]*$/,
                message:
                  "Code must be uppercase letters, numbers, and underscores, starting with a letter",
              },
            })}
            label={t("notificationTypes.form.code.label", {
              defaultValue: "Code",
            })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!errors.code}
            helperText={errors.code?.message as string}
            placeholder={t("notificationTypes.form.code.placeholder", {
              defaultValue: "Enter code (e.g., WEATHER_ALERT)",
            })}
          />

          <TextField
            {...register("name", {
              required: "Name is required",
              maxLength: {
                value: 255,
                message: "Name cannot exceed 255 characters",
              },
            })}
            label={t("notificationTypes.form.name.label", {
              defaultValue: "Name",
            })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message as string}
            placeholder={t("notificationTypes.form.name.placeholder", {
              defaultValue: "Enter name",
            })}
          />

          <TextField
            {...register("form_type", {
              maxLength: {
                value: 50,
                message: "Form type cannot exceed 50 characters",
              },
            })}
            label={t("notificationTypes.form.form_type.label", {
              defaultValue: "Form Type",
            })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!errors.form_type}
            helperText={errors.form_type?.message as string}
            placeholder={t("notificationTypes.form.form_type.placeholder", {
              defaultValue: "Enter form type (optional)",
            })}
          />

          <TextField
            {...register("icon", {
              maxLength: {
                value: 50,
                message: "Icon cannot exceed 50 characters",
              },
            })}
            label={t("notificationTypes.form.icon.label", {
              defaultValue: "Icon",
            })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!errors.icon}
            helperText={errors.icon?.message as string}
            placeholder={t("notificationTypes.form.icon.placeholder", {
              defaultValue: "Enter icon class name (optional)",
            })}
          />

          <TextField
            {...register("color", {
              maxLength: {
                value: 20,
                message: "Color cannot exceed 20 characters",
              },
              pattern: {
                value: /^(#[0-9A-Fa-f]{6}|[a-z-]+)$/,
                message: "Color must be a hex code or valid color name",
              },
            })}
            label={t("notificationTypes.form.color.label", {
              defaultValue: "Text Color",
            })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!errors.color}
            helperText={errors.color?.message as string}
            placeholder={t("notificationTypes.form.color.placeholder", {
              defaultValue: "Enter text color (e.g., #FF0000 or red)",
            })}
          />

          <TextField
            {...register("background_color", {
              maxLength: {
                value: 20,
                message: "Background color cannot exceed 20 characters",
              },
              pattern: {
                value: /^(#[0-9A-Fa-f]{6}|[a-z-]+)$/,
                message:
                  "Background color must be a hex code or valid color name",
              },
            })}
            label={t("notificationTypes.form.background_color.label", {
              defaultValue: "Background Color",
            })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!errors.background_color}
            helperText={errors.background_color?.message as string}
            placeholder={t(
              "notificationTypes.form.background_color.placeholder",
              {
                defaultValue:
                  "Enter background color (e.g., #FFEEEE or lightred)",
              }
            )}
          />

          <TextField
            {...register("title", {
              maxLength: {
                value: 255,
                message: "Title cannot exceed 255 characters",
              },
            })}
            label={t("notificationTypes.form.title.label", {
              defaultValue: "Title",
            })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message as string}
            placeholder="Enter title (optional)"
          />

          <TextField
            {...register("template_message")}
            label={t("notificationTypes.form.template_message.label", {
              defaultValue: "Template Message",
            })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            multiline
            minRows={3}
            error={!!errors.template_message}
            helperText={errors.template_message?.message as string}
            placeholder={t(
              "notificationTypes.form.template_message.placeholder",
              { defaultValue: "Enter template message (optional)" }
            )}
          />

          <TextField
            {...register("next_action", {
              maxLength: {
                value: 255,
                message: "Next action cannot exceed 255 characters",
              },
            })}
            label={t("notificationTypes.form.next_action.label", {
              defaultValue: "Next Action",
            })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!errors.next_action}
            helperText={errors.next_action?.message as string}
            placeholder={t("notificationTypes.form.next_action.placeholder", {
              defaultValue: "Enter next action (optional)",
            })}
          />

          <TextField
            type="number"
            inputProps={{ step: 1 }}
            {...register("priority", {
              valueAsNumber: true,
              validate: (value) =>
                value === undefined || value === null || Number.isInteger(value)
                  ? true
                  : "Priority must be an integer",
            })}
            label={t("notificationTypes.form.priority.label", {
              defaultValue: "Priority",
            })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!errors.priority}
            helperText={errors.priority?.message as string}
            placeholder={t("notificationTypes.form.priority.placeholder", {
              defaultValue: "Enter priority (optional)",
            })}
          />

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>{t("common.cancel", "Hủy")}</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {t("notificationTypes.actions.createType", "Create Type")}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
