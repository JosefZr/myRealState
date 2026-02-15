import { useEffect, useRef } from "react";

const PropertyMap = ({ properties, center, zoom = 4, className = "h-[400px]", singleMarker = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    // Dynamically import leaflet
    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Fix default marker icons
      delete (L.Icon.Default.prototype)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const defaultCenter = center || [39.8283, -98.5795];
      const map = L.map(mapRef.current, { scrollWheelZoom: false }).setView(defaultCenter, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const formatPrice = (price, type, period) => {
        const formatted = price >= 1000000 ? `$${(price / 1000000).toFixed(1)}M` : price >= 1000 ? `$${(price / 1000).toFixed(0)}K` : `$${price.toLocaleString()}`;
        return type === "rent" ? `${formatted}/${period || "mo"}` : formatted;
      };

      properties.forEach((p) => {
        const marker = L.marker([p.latitude, p.longitude]).addTo(map);
        marker.bindPopup(`
          <div style="min-width:180px;font-family:DM Sans,sans-serif">
            <img src="${p.images[0]}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:8px" />
            <strong style="font-size:13px;display:block;margin-bottom:4px">${p.title}</strong>
            <span style="color:#c87c2a;font-weight:700;font-size:15px">${formatPrice(p.price, p.type, p.rentalPeriod)}</span>
            <br/>
            <a href="/property/${p.id}" style="color:#c87c2a;font-size:12px;text-decoration:underline;margin-top:4px;display:inline-block">View Details →</a>
          </div>
        `);
      });

      if (properties.length > 1 && !singleMarker) {
        const bounds = L.latLngBounds(properties.map((p) => [p.latitude, p.longitude]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties, center, zoom, singleMarker]);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={mapRef} className={`rounded-xl overflow-hidden ${className}`} />
    </>
  );
};

export default PropertyMap;
