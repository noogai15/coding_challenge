import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Feature, FeatureCollection } from "geojson";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { ReactNode, useEffect, useState } from "react";
import { fetchGeoJson } from "./api";
import { inputLabelStyle, selectStyle } from "./componentStyles";
import CustomMap from "./components/CustomMap";
import "./styles.css";

const defaultMarkerIcon: L.Icon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconSize: new L.Point(25, 41),
  className: "default-icon",
});

const selectedMarkerIcon: L.Icon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
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

  function handleGeoJsonChange(event: SelectChangeEvent<number>, child: ReactNode): void {
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
            <FormControl variant="outlined" fullWidth>
              <InputLabel sx={inputLabelStyle} id="geoJson_select_label">
                GeoJSON Data
              </InputLabel>
              <Select autoWidth sx={selectStyle} onChange={handleGeoJsonChange}>
                <MenuItem value={0}>UK Children Centres</MenuItem>
                <MenuItem value={1}>UK Fire Stations</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="markers_wrapper">
            {currentFeatureCollection && (
              <FormControl fullWidth>
                <InputLabel sx={inputLabelStyle}>Marker</InputLabel>
                <Select autoWidth defaultValue={0} onChange={handleMarkerChange} sx={selectStyle}>
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
        <CustomMap
          initPos={initPos}
          currentFeatureCollection={currentFeatureCollection}
          markerIndex={markerIndex}
          defaultMarkerIcon={defaultMarkerIcon}
          selectedMarkerIcon={selectedMarkerIcon}
        ></CustomMap>
      </div>
    </div>
  );
}
