import './Map.css';
import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import jsonp from 'jsonp';

const center = { lat: 59.911491, lng: 10.757933 } //midlertidig koordinat

function Map() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    fetch("http://localhost:3030/api-key")
      .then((response) => response.json())
      .then((data) => setApiKey(data.apiKey));
  }, []);


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
    const apiUrl = `https://nobil.no/api/server/search.php?apikey=${apiKey}&apiversion=3&action=search&type=rectangle&northeast=${ne}&southwest=${sw}&existingids=${idList}`;
  
    jsonp(apiUrl, null, (err, data) => {
      if (err) {
        console.error(err.message);
      } else {
        parseJsonResponse(data);
      }
    });
  };

  const parseJsonResponse = (data) => {
    const newMarkers = [];
    if (map && data.chargerstations.length >= 1) {
      for (let i = 0; i < data.chargerstations.length; i++) {
        const csmd = data.chargerstations[i].csmd;
        if (!csmd.Position) {
          console.error('Charger station position not available');
          continue;
        }
        const arrpunkt = csmd.Position.split(',');
        const editLat = 1.0 * arrpunkt[0].substr(1);
        const editLng = 1.0 * arrpunkt[1].substr(0, arrpunkt[1].length - 1);
        let img = csmd.Image;
        let found = false;
        for (let j = 0; j < markers.length; j++) {
          if (markers[j].id === csmd.International_id) {
            found = true;
          }
        }
        if (!found) {
          let adress = csmd.Street;
          if (csmd.House_number) {
            adress += ' ' + csmd.House_number;
          }
          let connector = null;
          if (csmd.attr && csmd.attr.conn && csmd.attr.conn[1] && csmd.attr.conn[1][4]) {
            connector = csmd.attr.conn[1][4].trans;
          } else if (csmd.attr && csmd.attr.conn && csmd.attr.conn[4]) {
            connector = csmd.attr.conn[4].trans;
          }


          newMarkers.push({
            id: csmd.International_id,
            geolocation: csmd.Position,
            latlng: { lat: editLat, lng: editLng },
            name: csmd.name,
            connector: connector,
            content: (
              <div>
                <div
                  style={{
                    width: '90%',
                    margin: '10px',
                    float: 'left',
                    verticalAlign: 'top',
                  }}
                >
                  <strong>
                    {csmd.name}
                    <br />
                    {adress}
                  </strong>
                  <br />
                  {csmd.Description_of_location}
                  <br />
                  <small>Kontakttype: {connector}</small>
                </div>
              </div>
            ),
            alreadyadded: false
          });
        }
      }
    }
    setMarkers([...markers, ...newMarkers]);
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
                  <div>{selectedMarker.content}</div>
              </InfoWindow>
            ) : null}
          </GoogleMap>
        </div>
       </div>
  );
}

export default Map;
