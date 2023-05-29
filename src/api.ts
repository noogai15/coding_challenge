import { FeatureCollection } from "geojson";

export async function fetchData(urls: Array<string>): Promise<Array<FeatureCollection>> {
  const collection: Array<FeatureCollection> = [];
  urls.forEach(async (url) => {
    collection.push(await fetchGeoJson(url));
  });
  return collection;
}
export async function fetchGeoJson(url: RequestInfo): Promise<FeatureCollection> {
  const response = await fetch(url);
  const geoJson: FeatureCollection = await response.json();
  return geoJson;
}
