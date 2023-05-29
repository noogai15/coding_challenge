import { FeatureCollection } from "geojson";

export async function fetchGeoJson(url: RequestInfo): Promise<FeatureCollection> {
  const response = await fetch(url);
  const geoJson: FeatureCollection = await response.json();
  return geoJson;
}
