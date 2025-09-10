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

interface ReportMapComponentProps {
  lat: number;
  lng: number;
  reportId?: string;
  shipCode?: string;
  reportedAt?: Date;
  description?: string;
  portCode?: string;
}

export const ReportMapComponent: React.FC<ReportMapComponentProps> = ({
  lat,
  lng,
  reportId,
  shipCode,
  reportedAt,
  description,
  portCode,
}) => {
  const position: [number, number] = [lat, lng];

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div>
              <h4>Report Location</h4>
              {shipCode && (
                <div>
                  <strong>Ship:</strong> {shipCode}
                </div>
              )}
              <div>
                <strong>Report ID:</strong> {reportId}
              </div>
              <div>
                <strong>Reported At:</strong>{" "}
                {reportedAt ? new Date(reportedAt).toLocaleString() : "N/A"}
              </div>
              <div>
                <strong>Coordinates:</strong> {lat.toFixed(6)}, {lng.toFixed(6)}
              </div>
              {portCode && (
                <div>
                  <strong>Port:</strong> {portCode}
                </div>
              )}
              {description && (
                <div>
                  <strong>Description:</strong> {description}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
