"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Sticker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rarity: string;
  points_value: number;
}

interface TacticalMapProps {
  stickers: Sticker[];
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export default function TacticalMap({ stickers }: TacticalMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-surface-light animate-pulse" />;

  const panamaCenter: [number, number] = [8.538, -80.782];

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary": return "#f59e0b"; // Amber
      case "epic": return "#8b5cf6";      // Purple
      case "rare": return "#3b82f6";      // Blue
      default: return "#ffffff";          // White
    }
  };

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={panamaCenter}
        zoom={7}
        style={{ height: "100%", width: "100%", background: "#0a0a0f" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapResizer />
        
        {stickers.map((sticker) => (
          <CircleMarker
            key={sticker.id}
            center={[sticker.latitude, sticker.longitude]}
            pathOptions={{
              color: getRarityColor(sticker.rarity),
              fillColor: getRarityColor(sticker.rarity),
              fillOpacity: 0.6,
              weight: 2
            }}
            radius={8}
          >
            <Popup className="tactical-popup">
              <div className="bg-surface p-2 rounded border border-border text-white">
                <p className="font-bold uppercase text-[10px] tracking-widest text-primary">{sticker.name}</p>
                <p className="text-[9px] text-muted uppercase">Nivel: {sticker.rarity}</p>
                <p className="text-[9px] font-bold">Valor: +{sticker.points_value} PTS</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      {/* HUD Overlays */}
      <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
        <div className="glass-panel p-2 rounded-lg border border-primary/20">
          <p className="text-[10px] font-bold text-primary tracking-widest uppercase">RADAR MILITAR VIVO</p>
          <p className="text-[8px] text-muted uppercase">SECTOR: PANAMÁ CENTRAL</p>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-none">
        <div className="glass-panel p-2 rounded-lg border border-primary/20 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[8px] text-white font-bold uppercase">Enlace Satelital Activo</span>
          </div>
          <p className="text-[8px] text-muted font-mono uppercase">LAT: 8.98° N | LON: 79.52° W</p>
        </div>
      </div>
    </div>
  );
}
