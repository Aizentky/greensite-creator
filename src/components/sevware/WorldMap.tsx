import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useMemo } from "react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Minimal ISO alpha-2 → English country name (covers values returned by cf-ipcountry).
const ALPHA2_TO_NAME: Record<string, string> = {
  US: "United States of America", GB: "United Kingdom", DE: "Germany", FR: "France",
  IT: "Italy", ES: "Spain", PT: "Portugal", NL: "Netherlands", BE: "Belgium",
  PL: "Poland", SE: "Sweden", NO: "Norway", FI: "Finland", DK: "Denmark",
  IE: "Ireland", CH: "Switzerland", AT: "Austria", CZ: "Czechia", GR: "Greece",
  RO: "Romania", HU: "Hungary", UA: "Ukraine", RU: "Russia", TR: "Turkey",
  CA: "Canada", MX: "Mexico", BR: "Brazil", AR: "Argentina", CL: "Chile",
  CO: "Colombia", PE: "Peru", VE: "Venezuela", CN: "China", JP: "Japan",
  KR: "South Korea", IN: "India", PK: "Pakistan", BD: "Bangladesh",
  ID: "Indonesia", PH: "Philippines", VN: "Vietnam", TH: "Thailand",
  MY: "Malaysia", SG: "Singapore", AU: "Australia", NZ: "New Zealand",
  ZA: "South Africa", EG: "Egypt", NG: "Nigeria", KE: "Kenya", MA: "Morocco",
  DZ: "Algeria", TN: "Tunisia", SA: "Saudi Arabia", AE: "United Arab Emirates",
  IL: "Israel", IR: "Iran", IQ: "Iraq", SY: "Syria",
};

export type CountryCount = { country: string; count: number };

export function normalizeCountry(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v) return null;
  if (v.length === 2 && ALPHA2_TO_NAME[v.toUpperCase()]) return ALPHA2_TO_NAME[v.toUpperCase()];
  return v;
}

export function WorldMap({ counts }: { counts: Record<string, number> }) {
  const max = useMemo(() => Math.max(1, ...Object.values(counts)), [counts]);
  const lookup = useMemo(() => {
    const m: Record<string, number> = {};
    for (const [k, v] of Object.entries(counts)) m[k.toLowerCase()] = v;
    return m;
  }, [counts]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-background/40">
      <ComposableMap
        projectionConfig={{ scale: 145 }}
        width={900}
        height={420}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = String(geo.properties.name || "");
              const c = lookup[name.toLowerCase()] || 0;
              const intensity = c / max;
              const fill = c
                ? `color-mix(in oklab, hsl(var(--primary, 220 90% 60%)) ${Math.round(20 + intensity * 70)}%, transparent)`
                : "hsl(var(--muted, 220 14% 20%) / 0.35)";
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="hsl(var(--border, 220 10% 30%))"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "hsl(var(--primary, 220 90% 60%) / 0.9)" },
                    pressed: { outline: "none" },
                  }}
                >
                  <title>{c ? `${name}: ${c} login${c === 1 ? "" : "s"}` : name}</title>
                </Geography>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}