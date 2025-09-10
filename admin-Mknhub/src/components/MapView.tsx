import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix lỗi icon không hiển thị do webpack/vite không resolve được đường dẫn mặc định
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  lat?: number;
  lng?: number;
  height?: string;
}

export default function MapView({
  lat = 10.762622,
  lng = 106.660172,
  height = "500px",
}: MapViewProps) {
  const position: [number, number] = [lat, lng];
  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={position}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div>
              <strong>Tọa độ:</strong> {lat.toFixed(6)}, {lng.toFixed(6)}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
