import { FeatureCollection } from "geojson";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "../styles.css";
import { getCoordinates } from "../utils/mapUtils";

interface MapProps {
  initPos: LatLngExpression;
  currentFeatureCollection: FeatureCollection | undefined;
  markerIndex: number;
  selectedMarkerIcon: L.Icon;
  defaultMarkerIcon: L.Icon;
}

const CustomMap: React.FC<MapProps> = ({
  initPos,
  currentFeatureCollection,
  markerIndex,
  selectedMarkerIcon,
  defaultMarkerIcon,
}) => {
  return (
    <MapContainer
      center={initPos}
      zoom={9}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {currentFeatureCollection &&
        getCoordinates(currentFeatureCollection).map((coordinate, index) => (
          <Marker
            key={index}
            icon={index === markerIndex ? selectedMarkerIcon : defaultMarkerIcon}
            position={coordinate}
          ></Marker>
        ))}
      )
    </MapContainer>
  );
};

export default CustomMap;
