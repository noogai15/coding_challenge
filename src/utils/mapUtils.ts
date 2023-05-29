import { Feature, FeatureCollection } from "geojson";
import { LatLngExpression } from "leaflet";

export function getLatLng(feature: Feature): LatLngExpression | undefined {
  if (feature.geometry.type === "Point") {
    return [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] as LatLngExpression;
  }
}

export function getCoordinates(collection: FeatureCollection): Array<LatLngExpression> {
  return collection.features.reduce((coordinates: Array<LatLngExpression>, feature: Feature) => {
    const latLng = getLatLng(feature);
    if (latLng) coordinates.push(latLng);
    return coordinates;
  }, []);
}
