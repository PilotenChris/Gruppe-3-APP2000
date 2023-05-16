import './Map.css';
import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const center = { lat: 59.911491, lng: 10.757933 } //midlertidig koordinat

function Map() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleMapIdle = () => {
    const bounds = map.getBounds();
    getChargerJson(bounds);
  }

  useEffect(() => {
    if (map) {
      map.addListener('idle', handleMapIdle);
    }
  }, [map]);

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
            address: markerData.address,
            description: markerData.description,
            alreadyadded: markerData.alreadyadded
          },
        });
      }
    }
    setMarkers([...markers, ...newMarkers]);
  }
  
  

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
            onLoad={(map) => setMap(map)}> 
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.latlng}
                onClick={() => {
                  setSelectedMarker(marker);
                }}
              />
            ))}
            {selectedMarker ? (
              <InfoWindow
                position={selectedMarker.latlng}
                onCloseClick={() => setSelectedMarker(null)}>
                  <div>
                    <h2>{selectedMarker.content.name}</h2>
                    <p>{selectedMarker.content.description}</p>
                    <p>{selectedMarker.content.address}</p>
                    <p>Connector: {selectedMarker.content.connector}</p>
                  </div>
              </InfoWindow>
            ) : null}
          </GoogleMap>
        </div>
       </div>
  );
}

export default Map;