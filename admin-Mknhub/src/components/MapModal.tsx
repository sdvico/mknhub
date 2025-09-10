import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import MapView from "./MapView";

interface MapModalProps {
  open: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  title?: string;
}

export const MapModal: React.FC<MapModalProps> = ({
  open,
  onClose,
  lat,
  lng,
  title = "Bản đồ vị trí",
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ height: "500px", width: "100%" }}>
          <MapView lat={lat} lng={lng} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};
