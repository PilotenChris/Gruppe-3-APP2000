import './Map.css';
import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { addUserMarkSelect } from './redux/userMarkSelectSlice';
import { updateLatLng } from './redux/userCarSlice';

const center = { lat: 59.911491, lng: 10.757933 } //midlertidig koordinat

function Map() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedStations, setSelectedStations] = useState([]);

  const dispatch = useDispatch();
  const carInfo = useSelector((state)=> state.userCar[0]);

  const handleMapIdle = () => {
    const bounds = map.getBounds();
    getChargerJson(bounds);
  }

  useEffect(() => {
    if (map) {
      map.addListener('idle', handleMapIdle);
    }
  }, [map]);

  const [circlePos, setCirclePos] = useState(null);
  const [circleRad, setCircleRad] = useState(null);

  const handleMapClick = (ev) => {
    const {latLng} = ev;
    const { lat, lng } = latLng.toJSON();
    dispatch(updateLatLng({
      lat: lat,
      lng: lng,
    }));
    setCirclePos(latLng.toJSON());
    //setCircleRad();
  };

  const getChargerJson = (bounds) => {
    let idList = '';
    if (markers.length > 0) {
      for (let i = 0; i < markers.length; i++) {
        if (i > 0 && markers[i].id !== '') {
          idList += ',';
        }
        if (markers[i].id) {
          idList += markers[i].id;
        }
      }
    }
  
    const ne = bounds.getNorthEast().toString();
    const sw = bounds.getSouthWest().toString();
  
    const body = {
      bounds: { ne, sw },
      existingIds: idList
    };
  
    fetch("http://localhost:3030/charger-stations", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((data) => parseJsonResponse(data))
    .catch((err) => console.error(err.message));
  };
  

  const parseJsonResponse = (data) => {
    const newMarkers = [];
    if (data && data.length >= 1) {
      for (let i = 0; i < data.length; i++) {
        const markerData = data[i];
        newMarkers.push({
          id: markerData.id,
          latlng: markerData.latlng,
          content: {
            name: markerData.name,
            connector: markerData.connector,
            adress: markerData.adress,
            description: markerData.description,
            maxChargingCapacity: markerData.maxChargingCapacity,
            alreadyadded: markerData.alreadyadded
          },
        });
      }
    }
    setMarkers([...markers, ...newMarkers]);
  }

  const handleStationClick = (marker) => {
    const isSelected = selectedStations.some((station) => station.id === marker.id);

    if (isSelected) {
      const updatedStations = selectedStations.filter((station) => station.id !== marker.id);
      setSelectedStations(updatedStations);
    } else {
      const newStation = {
        id: marker.id,
        lat: marker.latlng.lat,
        lng: marker.latlng.lng,
        maxChargingCapacity: marker.content.maxChargingCapacity,
      };
      setSelectedStations([...selectedStations, newStation]);
    }
  };
  
  

  const {isLoaded} = useLoadScript({
    googleMapsApiKey: "AIzaSyACqMueWvLFhHETTGHO27NgnjTCBstiZWo",
  })

  // Function to hide components on map
  const options = {
    disableDefaultUI: true,
    zoom: false,
  }

  if (!isLoaded) {
    return <div>...Loading...</div>;
  }
    return (
       <div className="screen">
        <div className="map-container">
          <GoogleMap
            options={options}
            center={center}
            zoom={10}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            onLoad={(map) => setMap(map)}
            onClick={handleMapClick}>
            {markers.map((marker) => (
              <React.Fragment key={marker.id}>
                <Marker
                  position={marker.latlng}
                  onClick={() => handleStationClick(marker)}
                />
                {selectedStations.some((station) => station.id === marker.id) && (
                  <Circle
                    center={marker.latlng}
                    radius={1000}
                    options={{
                      strokeColor: '#FF0000',
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: '#FF0000',
                      fillOpacity: 0.35,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
            {selectedMarker ? (
              <InfoWindow
                position={selectedMarker.latlng}
                onCloseClick={() => setSelectedMarker(null)}>
                  <div>
                    <h2>{selectedMarker.content.name}</h2>
                    <p>{selectedMarker.content.description}</p>
                    <p>{selectedMarker.content.adress}</p>
                    <p>Connector: {selectedMarker.content.connector}</p>
                    <p>Charging Capacity: {selectedMarker.content.maxChargingCapacity}</p>
                  </div>
              </InfoWindow>
            ) : null}
            {circlePos &&(
                <Circle
                    center={circlePos}
                    // 0.75 is just to get closer to the right range
                    radius={(((carInfo.range)*1000)*0.75)*1} // The number 1 is the procentage og battery
                    options={{
                      strokeColor: '#FF0000',
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: '#FF0000',
                      fillOpacity: 0.35,
                    }}
                />
            )}
          </GoogleMap>
        </div>
       </div>
  );
}

export default Map;