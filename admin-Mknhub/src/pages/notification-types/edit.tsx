import React from "react";
import { useForm } from "@refinedev/react-hook-form";
import type { FieldValues } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useNotification, useTranslate } from "@refinedev/core";
import type {
  INotificationType,
  ICreateNotificationType,
} from "../../interfaces/notification-type";

export const NotificationTypeEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { open } = useNotification();
  const t = useTranslate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    refineCore: { queryResult, onFinish },
  } = useForm<INotificationType, any, ICreateNotificationType>({
    refineCoreProps: {
      resource: "notification-types",
      action: "edit",
      id,
    },
  });

  const onSubmit = handleSubmit(async (data: FieldValues) => {
    try {
      await onFinish(data as ICreateNotificationType);
      open?.({
        type: "success",
        message: t("notifications.success.update", {
          defaultValue: "Updated successfully",
        }),
      });
      navigate("/notification-types");
    } catch (error) {
      open?.({
        type: "error",
        message: t("notifications.error.internalError", {
          defaultValue: "Internal error",
        }),
      });
    }
  });

  const loading = queryResult?.isLoading;

  return (
    <Dialog open onClose={() => navigate(-1)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t("notificationTypes.titles.edit", {
          defaultValue: "Edit Notification Type",
        })}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ mt: 2 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    height: 16,
                    width: 140,
                    bgcolor: "#eee",
                    borderRadius: 1,
                    mb: 1,
                  }}
                />
                <Box
                  sx={{
                    height: 40,
                    width: "100%",
                    bgcolor: "#eee",
                    borderRadius: 1,
                  }}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
            <TextField
              {...register("code", {
                required: t("validation.required", {
                  defaultValue: "This field is required",
                }),
                maxLength: {
                  value: 50,
                  message: t("validation.maxLength", {
                    max: 50,
                    defaultValue: "Maximum length is {{max}}",
                  }),
                },
                pattern: {
                  value: /^[A-Z][A-Z0-9_]*$/,
                  message: t("validation.codePattern", {
                    defaultValue:
                      "Code must be uppercase letters, numbers, and underscores, starting with a letter",
                  }),
                },
              })}
              label={t("notificationTypes.fields.code", {
                defaultValue: "Code",
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="normal"
              error={!!errors.code}
              helperText={errors.code?.message as string}
              placeholder={t("notificationTypes.placeholders.code", {
                defaultValue: "Enter code (e.g., WEATHER_ALERT)",
              })}
              disabled={loading}
            />

            <TextField
              {...register("name", {
                required: t("validation.required", {
                  defaultValue: "This field is required",
                }),
                maxLength: {
                  value: 255,
                  message: t("validation.maxLength", {
                    max: 255,
                    defaultValue: "Maximum length is {{max}}",
                  }),
                },
              })}
              label={t("notificationTypes.fields.name", {
                defaultValue: "Name",
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message as string}
              placeholder={t("notificationTypes.placeholders.name", {
                defaultValue: "Enter name",
              })}
              disabled={loading}
            />

            <TextField
              {...register("form_type", {
                maxLength: {
                  value: 50,
                  message: t("validation.maxLength", {
                    max: 50,
                    defaultValue: "Maximum length is {{max}}",
                  }),
                },
              })}
              label={t("notificationTypes.fields.form_type", {
                defaultValue: "Form Type",
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="normal"
              error={!!errors.form_type}
              helperText={errors.form_type?.message as string}
              placeholder={t("notificationTypes.placeholders.form_type", {
                defaultValue: "Enter form type (optional)",
              })}
              disabled={loading}
            />

            <TextField
              {...register("icon", {
                maxLength: {
                  value: 50,
                  message: t("validation.maxLength", {
                    max: 50,
                    defaultValue: "Maximum length is {{max}}",
                  }),
                },
              })}
              label={t("notificationTypes.fields.icon", {
                defaultValue: "Icon",
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="normal"
              error={!!errors.icon}
              helperText={errors.icon?.message as string}
              placeholder={t("notificationTypes.placeholders.icon", {
                defaultValue: "Enter icon class name (optional)",
              })}
              disabled={loading}
            />

            <TextField
              {...register("color", {
                maxLength: {
                  value: 20,
                  message: t("validation.maxLength", {
                    max: 20,
                    defaultValue: "Maximum length is {{max}}",
                  }),
                },
                pattern: {
                  value: /^(#[0-9A-Fa-f]{6}|[a-z-]+)$/,
                  message: t("validation.colorPattern", {
                    defaultValue:
                      "Color must be a hex code or valid color name",
                  }),
                },
              })}
              label={t("notificationTypes.fields.color", {
                defaultValue: "Text Color",
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="normal"
              error={!!errors.color}
              helperText={errors.color?.message as string}
              placeholder={t("notificationTypes.placeholders.color", {
                defaultValue: "Enter text color (e.g., #FF0000 or red)",
              })}
              disabled={loading}
            />

            <TextField
              {...register("background_color", {
                maxLength: {
                  value: 20,
                  message: t("validation.maxLength", {
                    max: 20,
                    defaultValue: "Maximum length is {{max}}",
                  }),
                },
                pattern: {
                  value: /^(#[0-9A-Fa-f]{6}|[a-z-]+)$/,
                  message: t("validation.bgColorPattern", {
                    defaultValue:
                      "Background color must be a hex code or valid color name",
                  }),
                },
              })}
              label={t("notificationTypes.fields.background_color", {
                defaultValue: "Background Color",
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="normal"
              error={!!errors.background_color}
              helperText={errors.background_color?.message as string}
              placeholder={t(
                "notificationTypes.placeholders.background_color",
                {
                  defaultValue:
                    "Enter background color (e.g., #FFEEEE or lightred)",
                }
              )}
              disabled={loading}
            />

            <TextField
              {...register("title", {
                maxLength: {
                  value: 255,
                  message: t("validation.maxLength", {
                    max: 255,
                    defaultValue: "Maximum length is {{max}}",
                  }),
                },
              })}
              label={t("notificationTypes.fields.title", {
                defaultValue: "Title",
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="normal"
              error={!!errors.title}
              helperText={errors.title?.message as string}
              placeholder={t("notificationTypes.placeholders.title", {
                defaultValue: "Enter title (optional)",
              })}
              disabled={loading}
            />

            <TextField
              {...register("template_message")}
              label={t("notificationTypes.fields.template_message", {
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
                "notificationTypes.placeholders.template_message",
                { defaultValue: "Enter template message (optional)" }
              )}
              disabled={loading}
            />

            <TextField
              {...register("next_action", {
                maxLength: {
                  value: 255,
                  message: t("validation.maxLength", {
                    max: 255,
                    defaultValue: "Maximum length is {{max}}",
                  }),
                },
              })}
              label={t("notificationTypes.fields.next_action", {
                defaultValue: "Next Action",
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="normal"
              error={!!errors.next_action}
              helperText={errors.next_action?.message as string}
              placeholder={t("notificationTypes.placeholders.next_action", {
                defaultValue: "Enter next action (optional)",
              })}
              disabled={loading}
            />

            <TextField
              type="number"
              inputProps={{ step: 1 }}
              {...register("priority", {
                valueAsNumber: true,
                validate: (value) =>
                  value === undefined ||
                  value === null ||
                  Number.isInteger(value)
                    ? true
                    : t("validation.integer", {
                        defaultValue: "Must be an integer",
                      }),
              })}
              label={t("notificationTypes.fields.priority", {
                defaultValue: "Priority",
              })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="normal"
              error={!!errors.priority}
              helperText={errors.priority?.message as string}
              placeholder={t("notificationTypes.placeholders.priority", {
                defaultValue: "Enter priority (optional)",
              })}
              disabled={loading}
            />

            <DialogActions sx={{ mt: 3 }}>
              <Button onClick={() => navigate(-1)}>
                {t("buttons.cancel", { defaultValue: "Cancel" })}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || loading}
              >
                {t("buttons.save", { defaultValue: "Save" })}
              </Button>
            </DialogActions>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
