"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    description?: string;
    onClick?: () => void;
  }>;
}

export default function Map({ 
  center = [51.3890, 35.6892], // Tehran coordinates
  zoom = 10,
  onLocationSelect,
  markers = []
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example",
      style: "mapbox://styles/mapbox/streets-v12",
      center: center,
      zoom: zoom,
      language: "fa" // Persian language
    });

    map.current.on("load", () => {
      setIsLoaded(true);
    });

    // Add click handler for location selection
    if (onLocationSelect) {
      map.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        onLocationSelect(lat, lng);
      });
    }

    // Add markers
    markers.forEach(marker => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.cssText = `
        background-color: #3b82f6;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-gray-900">${marker.title}</h3>
            ${marker.description ? `<p class="text-sm text-gray-600 mt-1">${marker.description}</p>` : ''}
          </div>
        `);

      new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [center, zoom, onLocationSelect, markers]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-500">در حال بارگذاری نقشه...</div>
        </div>
      )}
    </div>
  );
}
