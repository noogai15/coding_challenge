// TODO: Use MUI framework for UI components

// TODO: construct types for GeoJSON data
// Alternatively, you can import and use pre-defined from `@types/geojson`
// type CustomJSON = ...;

// TODO: Install dependencies for the assignment along with their TypeScript type definitions:
// - Leaflet: A JS library for creating interactive 2D maps.
// - React Leaflet: A React wrapper around the Leaflet JS library.
// - MUI: Material UI, a React UI component library. https://mui.com/

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { FeatureCollection } from "geojson";
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
  iconUrl: "http://leafletjs.com/examples/custom-icons/leaf-green.png",
  iconSize: new L.Point(25, 41),
  className: "default-icon",
});

export default function App() {
  const urlChildrenCentres =
    "https://dataworks.calderdale.gov.uk/download/20q09/7c0/Calderdale%20childrens%20centres.geojson";
  const urlFireStations =
    "https://dataworks.calderdale.gov.uk/download/e7w4j/ch9/Fire_Stations.geojson";

  const [currentFeatureCollection, setCurrentFeatureCollection] = useState<FeatureCollection>();
  const [dataCollection, setDataCollection] = useState<Array<FeatureCollection>>();
  const [markerIndex, setMarkerIndex] = useState<number>(0);
  const [position, setPosition] = useState<LatLngExpression>([
    53.79532842135068, -1.7699038084392222,
  ]);

  useEffect(() => {
    let collection: Array<FeatureCollection> = [];
    fetchGeoJson(urlChildrenCentres)
      .then((data) => {
        collection.push(data);
      })
      .then(() => {
        fetchGeoJson(urlFireStations).then((data) => {
          collection.push(data);
          setDataCollection(collection);
        });
      });
  }, []);

  function handleDataChange(event: SelectChangeEvent<number>, child: ReactNode): void {
    setCurrentFeatureCollection(dataCollection![event.target.value as number]);
  }

  function handleMarkerChange(event: SelectChangeEvent<number>, child: ReactNode): void {
    setMarkerIndex(event.target.value as number);
  }

  return (
    <div className="App">
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
                        {item.properties["Children Centre Boundary"] || item.properties["STATION"]}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          )}
        </div>
      </div>
      <div className="map_wrapper">
        <MapContainer
          center={position}
          zoom={9}
          scrollWheelZoom={false}
          style={{
            height: "600px",
            marginTop: "80px",
            marginBottom: "90px",
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {currentFeatureCollection &&
            getLatLong(currentFeatureCollection).map((coordinate, index) => (
              <Marker
                icon={index === markerIndex ? markerIconGreen : markerIcon}
                position={coordinate as LatLngExpression}
              ></Marker>
            ))}
          )
        </MapContainer>
      </div>

      {/* TODO: */}
      {/* Implement a mechanism to switch between the GeoJSON data to be displayed.*/}
      {/* Buttons are recommended (e.g. one button per fetched GeoJSON data) but any
      component type or method can be used. */}
      {/* ----------------------------------------------------------------------------- */}
      {/* TODO:  */}
      {/* The GeoJSON format (https://geojson.org/) uses JSON to encode various types of
      geographical information using 2D geometry and properties.
      Implement a mechanism to list the 'features' contained in the selected GeoJSON
      data and a way for users to select a specific one to have it highlighted on the map. */}
      {/* ----------------------------------------------------------------------------- */}
      {/* TODO: */}
      {/* Add a custom Leaflet Map component here */}
      {/* <CustomMap ....> */}
    </div>
  );

  function getLatLong(collection: FeatureCollection): Array<LatLngExpression> {
    let coordinates: Array<LatLngExpression> = [];
    collection.features.map((feature) => {
      if (feature.geometry.type === "Point") {
        coordinates.push([
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
        ] as LatLngExpression);
      }
    });
    return coordinates;
  }

  async function fetchGeoJson(url: RequestInfo): Promise<FeatureCollection> {
    let geoJson: FeatureCollection = await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    return geoJson;
  }
}
