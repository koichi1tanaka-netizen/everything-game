import { notFound } from "next/navigation";
import TownLocation from "@/components/TownLocation";
import { TOWN_LOCATIONS } from "@/lib/gameData";

// URL slug -> TOWN_LOCATIONS key (only differs for craft-store, since the
// key is camelCase but the URL uses a hyphen)
const SLUG_MAP: Record<string, string> = {
  park: "park",
  school: "school",
  stadium: "stadium",
  "craft-store": "craftStore",
  police: "police",
  library: "library",
  cafe: "cafe",
};

export default function TownLocationPage({ params }: { params: { location: string } }) {
  const key = SLUG_MAP[params.location];
  const config = key ? TOWN_LOCATIONS[key] : undefined;

  if (!config) notFound();

  return <TownLocation config={config} />;
}