import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Dashboard from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import CategoryIcon from "@mui/icons-material/Category";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Authenticated, Refine } from "@refinedev/core";
import { KBarProvider } from "@refinedev/kbar";
import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  useNotificationProvider,
} from "@refinedev/mui";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { authProvider } from "./authProvider";
import { Header, Title } from "./components";
import { ColorModeContextProvider } from "./contexts";
import customDataProvider from "./dataProvider";
import { useAutoLoginForDemo } from "./hooks";
import { CustomLogin } from "./pages/auth/CustomLogin";
import { DashboardPage } from "./pages/dashboard";
import { DeviceList } from "./pages/devices";
import { CustomerList } from "./pages/users";
import { ShipNotificationList } from "./pages/ship-notifications";
import {
  NotificationTypeList,
  NotificationTypeEdit,
} from "./pages/notification-types";
import { ShipList } from "./pages/ships";
import { SvgIcon } from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ReportIcon from "@mui/icons-material/Report";
import { FeedbackList } from "./pages/feedbacks/list";
import { ReportList } from "./pages/reports/list";
import BusinessIcon from "@mui/icons-material/Business";
import { AgencyList } from "./pages/agencies/list";


const App: React.FC = () => {
  // This hook is used to automatically login the user.
  // We use this hook to skip the login page and demonstrate the application more quickly.
  const { loading } = useAutoLoginForDemo();

  const { t, i18n } = useTranslation();
  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <KBarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={customDataProvider}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                breadcrumb: false,
                useNewQueryKeys: true,
              }}
              notificationProvider={useNotificationProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: t("nav.dashboard", { defaultValue: "Dashboard" }),
                    icon: <Dashboard />,
                  },
                },
                {
                  name: "users",
                  list: "/users",
                  meta: {
                    icon: <AccountCircleOutlinedIcon />,
                    label: t("nav.users", { defaultValue: "Users" }),
                  },
                },
                {
                  name: "ship-notifications",
                  list: "/ship-notifications",
                  meta: {
                    icon: <NotificationsIcon />,
                    label: t("nav.shipNotifications", {
                      defaultValue: "Ship Notifications",
                    }),
                  },
                },
                {
                  name: "ships",
                  list: "/ships",
                  meta: {
                    icon: <DirectionsBoatIcon />,
                    label: t("nav.ships", { defaultValue: "Ships" }),
                  },
                },
                {
                  name: "notification-types",
                  list: "/notification-types",
                  meta: {
                    icon: <CategoryIcon />,
                    label: t("nav.notificationTypes", {
                      defaultValue: "Notification Types",
                    }),
                  },
                },
                {
                  name: "feedbacks",
                  list: "/feedbacks",
                  meta: {
                    icon: <FeedbackIcon />,
                    label: t("nav.feedbacks", { defaultValue: "Feedbacks" }),
                  },
                },
                {
                  name: "reports",
                  list: "/reports",
                  meta: {
                    icon: <ReportIcon />,
                    label: t("nav.reports", { defaultValue: "Reports" }),
                  },
                },
                {
                  name: "agencies",
                  list: "/agencies",
                  meta: {
                    icon: <BusinessIcon />,
                    label: t("nav.agencies", { defaultValue: "Agencies" }),
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-routes"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2 Header={Header} Title={Title}>
                        <Box
                          sx={{
                            maxWidth: "1200px",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        >
                          <Outlet />
                        </Box>
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="/users" element={<CustomerList />} />
                  <Route path="/devices" element={<DeviceList />} />
                  <Route path="/ships" element={<ShipList />} />
                  <Route
                    path="/ship-notifications"
                    element={<ShipNotificationList />}
                  />
                  <Route
                    path="/notification-types"
                    element={<NotificationTypeList />}
                  />
                  <Route
                    path="/notification-types/:id/edit"
                    element={<NotificationTypeEdit />}
                  />
                  <Route path="/feedbacks" element={<FeedbackList />} />
                  <Route path="/reports" element={<ReportList />} />
                  <Route path="/agencies" element={<AgencyList />} />
                </Route>

                <Route
                  element={
                    <Authenticated key="auth-pages" fallback={<Outlet />}>
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<CustomLogin />} />
                </Route>

                <Route
                  element={
                    <Authenticated key="catch-all">
                      <ThemedLayoutV2 Header={Header} Title={Title}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </KBarProvider>
    </BrowserRouter>
  );
};

export default App;
