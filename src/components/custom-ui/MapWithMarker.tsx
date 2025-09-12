"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DraggableMarker({
  position,
  setPosition,
  isMarkerDraggable = true,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  isMarkerDraggable?: boolean;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <div>
      <Marker
        position={position}
        icon={pinIcon}
        draggable={isMarkerDraggable}
      />
      <RecenterMap position={position} />
    </div>
  );
}
// 👇 helper to recenter the map
function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16); // zoom 16
    }
  }, [position, map]);
  return null;
}
export default function MapWithMarker({
  position,
  setPosition,
  isMarkerDraggable,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  isMarkerDraggable?: boolean;
}) {
  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom={false}
      className="h-64 w-full rounded-lg z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker
        position={position}
        setPosition={setPosition}
        isMarkerDraggable={isMarkerDraggable}
      />
    </MapContainer>
  );
}
