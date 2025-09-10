import Chip, { type ChipProps } from "@mui/material/Chip";
import { useTranslate } from "@refinedev/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import { useTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import type { IUser } from "../../../interfaces";

type Props = {
  value: boolean | number | undefined;
} & ChipProps;

export const CustomerStatus = ({ value, ...rest }: Props) => {
  const { palette } = useTheme();
  const isDarkMode = palette.mode === "dark";

  const t = useTranslate();

  const isActive = value === true || value === 1;
  const color = isActive ? (isDarkMode ? green[200] : green[800]) : "default";
  const icon: ChipProps["icon"] = value ? (
    <CheckCircleIcon
      sx={{
        fill: isDarkMode ? green[200] : green[600],
      }}
    />
  ) : (
    <PauseCircleOutlineOutlinedIcon color="action" />
  );

  return (
    <Chip
      {...rest}
      label={
        isActive
          ? t("users.fields.isActive.true")
          : t("users.fields.isActive.false")
      }
      size="small"
      sx={{
        borderColor: color,
        color: color,
      }}
      icon={icon}
      variant="outlined"
    />
  );
};
