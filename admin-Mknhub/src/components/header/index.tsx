import Brightness4Icon from "@mui/icons-material/Brightness4";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  useGetIdentity,
  useGetLocale,
  useSetLocale,
  useTranslate,
} from "@refinedev/core";
import {
  HamburgerMenu,
  type RefineThemedLayoutV2HeaderProps,
} from "@refinedev/mui";
import { useContext, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router";
import { ColorModeContext } from "../../contexts";
import i18n from "../../i18n";
import type { IIdentity } from "../../interfaces";

interface IOptions {
  label: string;
  avatar?: ReactNode;
  link: string;
  category: string;
}

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = () => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<IOptions[]>([]);
  const { mode, setMode } = useContext(ColorModeContext);

  const changeLanguage = useSetLocale();
  const locale = useGetLocale();
  const currentLocale = locale();
  const { data: user } = useGetIdentity<IIdentity | null>();

  const t = useTranslate();

  const location = useLocation();
  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/ship-notifications"))
      return t("nav.shipNotifications", { defaultValue: "Ship notifications" });
    if (path.startsWith("/notification-types"))
      return t("nav.notificationTypes", { defaultValue: "Notification types" });
    if (path.startsWith("/users"))
      return t("nav.users", { defaultValue: "Users" });
    if (path === "/" || path.startsWith("/dashboard"))
      return t("nav.dashboard", { defaultValue: "Dashboard" });
    return "";
  }, [location.pathname]);

  return (
    <AppBar
      color="default"
      position="sticky"
      elevation={0}
      sx={{
        "& .MuiToolbar-root": {
          minHeight: "64px",
        },
        height: "64px",
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) => theme.palette.background.default,
        backdropFilter: "saturate(180%) blur(8px)",
        WebkitBackdropFilter: "saturate(180%) blur(8px)",
      }}
    >
      <Toolbar
        sx={{
          paddingLeft: {
            xs: "0",
            sm: "16px",
            md: "24px",
          },
        }}
      >
        <Box
          minWidth="40px"
          minHeight="40px"
          marginRight={{
            xs: "0",
            sm: "16px",
          }}
          sx={{
            "& .MuiButtonBase-root": {
              marginLeft: 0,
              marginRight: 0,
            },
          }}
        >
          <HamburgerMenu />
        </Box>

        <Stack
          direction="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          gap={{
            xs: "8px",
            sm: "24px",
          }}
        >
          <Stack direction="row" flex={1} alignItems="center">
            {pageTitle && (
              <Typography variant="h6" fontWeight={700}>
                {pageTitle}
              </Typography>
            )}
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: "8px",
              sm: "24px",
            }}
          >
            <Select
              size="small"
              // disableUnderline
              defaultValue={currentLocale}
              slotProps={{
                input: {
                  "aria-label": "Without label",
                },
              }}
              variant="outlined"
              sx={{
                width: {
                  xs: "120px",
                  sm: "160px",
                },
                backgroundColor: "#fff",
                borderRadius: 2,
              }}
            >
              {[...(i18n.languages ?? [])].sort().map((lang: string) => (
                <MenuItem
                  selected={currentLocale === lang}
                  key={lang}
                  defaultValue={lang}
                  onClick={() => {
                    changeLanguage(lang);
                  }}
                  value={lang}
                >
                  <Typography color="text.secondary">
                    {lang === "en"
                      ? "English"
                      : lang === "de"
                      ? "Deutsch"
                      : "Tiếng Việt"}
                  </Typography>
                </MenuItem>
              ))}
            </Select>

            <IconButton
              onClick={() => {
                setMode();
              }}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "transparent" : "#00000014",
              }}
            >
              {mode === "dark" ? (
                <BrightnessHighIcon />
              ) : (
                <Brightness4Icon
                  sx={{
                    fill: "#000000DE",
                  }}
                />
              )}
            </IconButton>

            {/* <Stack
              direction="row"
              gap={{
                xs: "8px",
                sm: "16px",
              }}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                fontSize={{
                  xs: "12px",
                  sm: "14px",
                }}
                variant="subtitle2"
              >
                {user?.name}
              </Typography>
              <Avatar src={user?.avatar} alt={user?.name} />
            </Stack> */}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
