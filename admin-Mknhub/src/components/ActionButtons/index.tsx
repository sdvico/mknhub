import React, { useState } from "react";
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Stack,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

export interface ActionItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: "inherit" | "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  disabled?: boolean;
}

export interface ActionButtonsProps {
  actions: ActionItem[];
  maxVisible?: number;
  size?: "small" | "medium" | "large";
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  actions,
  maxVisible = 2,
  size = "small",
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const visibleActions = actions.slice(0, maxVisible);
  const hiddenActions = actions.slice(maxVisible);

  if (actions.length === 0) {
    return null;
  }

  if (actions.length <= maxVisible) {
    return (
      <Stack direction="row" spacing={1}>
        {actions.map((action, index) => (
          <Tooltip key={index} title={action.label}>
            <IconButton
              size={size}
              onClick={action.onClick}
              color={action.color || "primary"}
              disabled={action.disabled}
            >
              {action.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
    );
  }

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        {visibleActions.map((action, index) => (
          <Tooltip key={index} title={action.label}>
            <IconButton
              size={size}
              onClick={action.onClick}
              color={action.color || "primary"}
              disabled={action.disabled}
            >
              {action.icon}
            </IconButton>
          </Tooltip>
        ))}
        <Tooltip title="More actions">
          <IconButton
            size={size}
            onClick={handleClick}
            color="default"
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {hiddenActions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              action.onClick();
              handleClose();
            }}
            disabled={action.disabled}
          >
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
