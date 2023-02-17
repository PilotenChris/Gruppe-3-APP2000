import './Map.css';
import React from 'react';
import { useLoadScript, GoogleMap } from '@react-google-maps/api';

const center = { lat: 59.911491, lng: 10.757933 } //midlertidig koordinat

function Map() {

  const {isLoaded} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  })

  if (!isLoaded) {
    return <div>...Loading...</div>;
  }
    return (
       <div class="screen">
        <div class="map-container">
          <GoogleMap
            center={center}
            zoom={10}
            mapContainerStyle={{ width: '100%', height: '100%' }}> 
          </GoogleMap>
        </div>
       </div>
  )
}

export default Map;
