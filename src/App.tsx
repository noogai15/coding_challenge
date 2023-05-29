import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Feature, FeatureCollection } from "geojson";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { ReactNode, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "./styles.css";

const markerIcon: L.Icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: new L.Point(25, 41),
  className: "default-icon",
});

const markerIconGreen: L.Icon = new L.Icon({
  iconUrl: "http://leafletjs.com/examples/custom-icons/leaf-red.png",
  iconSize: new L.Point(25, 41),
  className: "default-icon",
});

export default function App() {
  const urlChildrenCentres =
    "https://dataworks.calderdale.gov.uk/download/20q09/7c0/Calderdale%20childrens%20centres.geojson";
  const urlFireStations =
    "https://dataworks.calderdale.gov.uk/download/e7w4j/ch9/Fire_Stations.geojson";

  const [currentFeatureCollection, setCurrentFeatureCollection] = useState<FeatureCollection>();
  const [dataCollection, setDataCollection] = useState<Array<FeatureCollection>>([]);
  const [markerIndex, setMarkerIndex] = useState<number>(0);
  const [initPos, setInitPos] = useState<LatLngExpression>([
    53.79532842135068, -1.7699038084392222,
  ]);

  useEffect(() => {
    async function fetchData() {
      const collection: Array<FeatureCollection> = [];
      const data1 = await fetchGeoJson(urlChildrenCentres);
      collection.push(data1);
      const data2 = await fetchGeoJson(urlFireStations);
      collection.push(data2);
      setDataCollection(collection);
    }
    fetchData();
  }, []);

  function handleDataChange(event: SelectChangeEvent<number>, child: ReactNode): void {
    setCurrentFeatureCollection(dataCollection![event.target.value as number]);
  }

  function handleMarkerChange(event: SelectChangeEvent<number>, child: ReactNode): void {
    setMarkerIndex(event.target.value as number);
  }

  return (
    <div className="App">
      <div className="app_wrapper">
        <h2>List of Children Centres & Fire Stations in the UK</h2>
        <div className="dropdown_wrapper">
          <div className="data_wrapper">
            <FormControl fullWidth>
              <InputLabel id="geoJson_select_label">GeoJSON Data</InputLabel>
              <Select
                labelId="geoJson_select_label"
                id="geoJson_select"
                autoWidth
                label="geoJson_data"
                onChange={handleDataChange}
              >
                <MenuItem value={0}>UK Children Centres</MenuItem>
                <MenuItem value={1}>UK Fire Stations</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="markers_wrapper">
            {currentFeatureCollection && (
              <FormControl fullWidth>
                <InputLabel id="markers_select_label">Marker</InputLabel>
                <Select
                  labelId="markers_select_label"
                  id="marker_select"
                  autoWidth
                  label="markers_data"
                  onChange={handleMarkerChange}
                >
                  {currentFeatureCollection.features.map(
                    (item, index) =>
                      item.properties && (
                        <MenuItem value={index} key={index}>
                          {item.properties["Children Centre Boundary"] ||
                            item.properties["STATION"]}
                        </MenuItem>
                      )
                  )}
                </Select>
              </FormControl>
            )}
          </div>
        </div>
      </div>
      <div className="map_wrapper">
        <MapContainer
          center={initPos}
          zoom={9}
          scrollWheelZoom={false}
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
                icon={index === markerIndex ? markerIconGreen : markerIcon}
                position={coordinate}
              ></Marker>
            ))}
          )
        </MapContainer>
      </div>

      {/* TODO: */}
      {/* Add a custom Leaflet Map component here */}
      {/* <CustomMap ....> */}
    </div>
  );

  function getLatLng(feature: Feature): LatLngExpression | undefined {
    if (feature.geometry.type === "Point") {
      return [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] as LatLngExpression;
    }
  }

  function getCoordinates(collection: FeatureCollection): Array<LatLngExpression> {
    return collection.features.reduce((coordinates: Array<LatLngExpression>, feature: Feature) => {
      const latLng = getLatLng(feature);
      if (latLng) coordinates.push(latLng);
      return coordinates;
    }, []);
  }

  async function fetchGeoJson(url: RequestInfo): Promise<FeatureCollection> {
    const response = await fetch(url);
    const geoJson: FeatureCollection = await response.json();
    return geoJson;
  }
}
