import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLogin, useTranslate } from "@refinedev/core";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router";
import {
  FinefoodsLogoIcon,
  FinefoodsLogoText,
} from "../../components/icons/finefoods-logo";

interface LoginFormValues {
  username: string;
  password: string;
}

export const CustomLogin: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { mutate: login, isLoading } = useLogin<LoginFormValues>();
  const translate = useTranslate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: "admin",
      password: "Sd@2023",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('images/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 2,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          {/* Logo */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap={2}
            mb={4}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <FinefoodsLogoText
                style={{
                  color: "#1976d2",
                  width: "200px",
                  height: "auto",
                }}
              />
            </Link>
          </Box>

          {/* Title */}
          <Typography
            component="h1"
            variant="h5"
            align="center"
            color="primary"
            fontWeight={700}
            sx={{ mb: 3 }}
          >
            {translate("pages.login.title", "Đăng nhập vào tài khoản")}
          </Typography>

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Username Field */}
            <Controller
              name="username"
              control={control}
              rules={{
                required: translate(
                  "pages.login.errors.requiredUsername",
                  "Tên đăng nhập là bắt buộc"
                ),
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={translate("pages.login.username", "Tên đăng nhập")}
                  variant="outlined"
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  autoComplete="username"
                />
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              rules={{
                required: translate(
                  "pages.login.errors.requiredPassword",
                  "Mật khẩu là bắt buộc"
                ),
              }}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={!!errors.password}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    {translate("pages.login.password", "Mật khẩu")}
                  </InputLabel>
                  <OutlinedInput
                    {...field}
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label={translate("pages.login.password", "Mật khẩu")}
                  />
                  {errors.password && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1.5 }}
                    >
                      {errors.password.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              {isLoading
                ? translate("pages.login.signin", "Đang đăng nhập...")
                : translate("pages.login.signin", "Đăng nhập")}
            </Button>

            {/* Info Alert */}
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Demo:</strong> admin / ***
              </Typography>
            </Alert>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
