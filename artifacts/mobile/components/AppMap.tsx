import React from "react";
import { View, Image, StyleSheet, Platform } from "react-native";

export type LatLng = { latitude: number; longitude: number };

type Props = {
  region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
  style?: any;
  markers?: Array<{ id: string; coordinate: LatLng; color?: string; title?: string }>;
  polyline?: { coordinates: LatLng[]; color?: string; width?: number };
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
  pointerEvents?: any;
};

function deltaToZoom(delta: number) {
  if (delta <= 0.005) return 16;
  if (delta <= 0.01) return 15;
  if (delta <= 0.02) return 14;
  if (delta <= 0.05) return 13;
  if (delta <= 0.1) return 12;
  if (delta <= 0.25) return 11;
  return 10;
}

// Convert lat/lng to fractional tile coords
function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y };
}

const TILE_SIZE = 256;
const c = React.createElement as any;

type WebMapProps = Props;

function WebMap({ region, style, markers, polyline }: WebMapProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    update();
    const ro = new (window as any).ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const flatten = (s: any): any => {
    if (!s) return {};
    if (Array.isArray(s)) return s.reduce((acc, cur) => ({ ...acc, ...flatten(cur) }), {});
    return s;
  };
  const flatStyle = flatten(style);

  const zoom = deltaToZoom(region.latitudeDelta);
  const center = latLngToTile(region.latitude, region.longitude, zoom);

  // Determine tile range to cover container size
  const tilesX = size ? Math.ceil(size.w / TILE_SIZE) + 2 : 4;
  const tilesY = size ? Math.ceil(size.h / TILE_SIZE) + 2 : 3;
  const halfX = Math.floor(tilesX / 2);
  const halfY = Math.floor(tilesY / 2);

  const centerTileX = Math.floor(center.x);
  const centerTileY = Math.floor(center.y);

  // Pixel offset of viewport center from center-tile top-left
  const offsetXInCenterTile = (center.x - centerTileX) * TILE_SIZE;
  const offsetYInCenterTile = (center.y - centerTileY) * TILE_SIZE;

  const containerW = size?.w ?? 0;
  const containerH = size?.h ?? 0;

  const tiles: any[] = [];
  if (size) {
    const n = Math.pow(2, zoom);
    for (let dx = -halfX; dx <= halfX; dx++) {
      for (let dy = -halfY; dy <= halfY; dy++) {
        const tx = centerTileX + dx;
        const ty = centerTileY + dy;
        if (ty < 0 || ty >= n) continue;
        const wrappedX = ((tx % n) + n) % n;
        const left = containerW / 2 - offsetXInCenterTile + dx * TILE_SIZE;
        const top = containerH / 2 - offsetYInCenterTile + dy * TILE_SIZE;
        tiles.push(
          c("img", {
            key: `${zoom}-${tx}-${ty}`,
            src: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${ty}.png`,
            alt: "",
            crossOrigin: "anonymous",
            style: {
              position: "absolute",
              left,
              top,
              width: TILE_SIZE,
              height: TILE_SIZE,
              userSelect: "none",
              pointerEvents: "none",
            },
          }),
        );
      }
    }
  }

  // Convert lat/lng to pixel position within container
  const llToPixel = (coord: LatLng) => {
    const t = latLngToTile(coord.latitude, coord.longitude, zoom);
    const px = containerW / 2 + (t.x - center.x) * TILE_SIZE;
    const py = containerH / 2 + (t.y - center.y) * TILE_SIZE;
    return { px, py };
  };

  const polylineEl =
    polyline && polyline.coordinates.length >= 2 && size
      ? c(
          "svg",
          {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: containerW,
              height: containerH,
              pointerEvents: "none",
            },
          },
          c("polyline", {
            points: polyline.coordinates
              .map((coord) => {
                const p = llToPixel(coord);
                return `${p.px.toFixed(1)},${p.py.toFixed(1)}`;
              })
              .join(" "),
            fill: "none",
            stroke: polyline.color ?? "#3B82F6",
            strokeWidth: polyline.width ?? 4,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }),
        )
      : null;

  const markerEls = (markers ?? []).map((m) => {
    if (!size) return null;
    const p = llToPixel(m.coordinate);
    const color = m.color ?? "#3B82F6";
    return c("div", {
      key: m.id,
      style: {
        position: "absolute",
        left: p.px - 9,
        top: p.py - 9,
        width: 18,
        height: 18,
        borderRadius: 9,
        background: color,
        border: "3px solid #fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        pointerEvents: "none",
      },
    });
  });

  return c(
    "div",
    {
      ref: containerRef,
      style: {
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#E8F0F5",
        ...flatStyle,
      },
    },
    ...tiles,
    polylineEl,
    ...markerEls,
  );
}

export default function AppMap(props: Props) {
  if (Platform.OS === "web") {
    return <WebMap {...props} />;
  }
  return (
    <View style={[styles.wrap, props.style]}>
      <View style={StyleSheet.absoluteFillObject} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", backgroundColor: "#E8F0F5" },
});
