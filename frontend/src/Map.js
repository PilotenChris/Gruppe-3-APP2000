import './Map.css';
import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { addUserMarkSelect, deleteUserMarkSelect, resetUserMark } from './redux/userMarkSelectSlice';
import { updateLatLng } from './redux/userCarSlice';

const center = { lat: 59.911491, lng: 10.757933 } //midlertidig koordinat

function Map() {
	const [map, setMap] = useState(null);
	const [markers, setMarkers] = useState([]);
	const [selectedMarker, setSelectedMarker] = useState(null);
	const [selectedStations, setSelectedStations] = useState([]);
	const [carMarker, setCarMarker] = useState(null);

	// Deviation for range on map to get closer to real life range,
	// based on observations on other websites
	const rangeDeviation = 0.75;

	const dispatch = useDispatch();
	const carInfo = useSelector((state)=> state.userCar[0]);
	const userMarkInfo = useSelector((state) => state.userMarkSelect);
	const userSettingInfo = useSelector((state) => state.userSetting);

	// Gets the calculated range of the selected marker by id
	// Chris
	const getRangeById = (id) => {
		const object = userMarkInfo.find((marker) => marker.id === id);
		return object ? object.range : null;
	};


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

	// Set the car starting point on the map and in the Redux store
	// Chris & Kevin
	const handleMapClick = (ev) => {
		if (carInfo.type && carInfo.version && carInfo.maxRange && carInfo.range) {
			const {latLng} = ev;
			const { lat, lng } = latLng.toJSON();
			dispatch(updateLatLng({
			lat: lat,
			lng: lng,
			}));
			dispatch(resetUserMark());
			setSelectedStations([]);
			setCirclePos(latLng.toJSON());
			setCarMarker({ lat, lng });
		}
	};

	// Get all charging stations and details, from our REST API
	// Chris
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

	// Parse the Json sent from our REST API to show stations detail
	// Chris
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
	};

	// Adds/removes the selected stations from the map and the Redux store
	// Chris
	const handleStationClick = (marker) => {
		const isSelected = selectedStations.some((station) => station.id === marker.id);

		if (isSelected) {
			const updatedStations = selectedStations.filter((station) => station.id !== marker.id);
			setSelectedStations(updatedStations);
			dispatch(deleteUserMarkSelect({ id: marker.id}));
		} else {
			// Checks if the Redux store has enough data needed before adding stations
			if (carInfo.type && carInfo.version && carInfo.maxRange && carInfo.range && 
				carInfo.battCap && carInfo.charSpeed && carInfo.lat && carInfo.lng &&
				carInfo.charMIN) {
				
				let distanceM = 0;
				let addRangeM = 0;
				let rangeM = 0;
				let checkRange = 0;
				const maxChargeM = getCharCap(marker.content.maxChargingCapacity);
				// Checks if there are any stations inside the Redux store 
				// before calculating range from the car/station for the next station
				if (selectedStations.length === 0) {
					distanceM = mapPointDistanceCalculator(carInfo.lat, carInfo.lng, marker.latlng.lat, marker.latlng.lng);
					addRangeM = getAddRange(carInfo.charMIN, maxChargeM, carInfo.charSpeed, carInfo.battCap, carInfo.maxRange, distanceM, carInfo.range);
					rangeM = addRangeM + getRangeMarker(carInfo.range, distanceM);
					checkRange = carInfo.range;
				} else {
					const lastStation = selectedStations[selectedStations.length - 1];
					distanceM = mapPointDistanceCalculator(lastStation.lat, lastStation.lng, marker.latlng.lat, marker.latlng.lng);
					addRangeM = getAddRange(carInfo.charMIN, maxChargeM, carInfo.charSpeed, carInfo.battCap, carInfo.maxRange, distanceM, getRangeById(lastStation.id));
					rangeM = addRangeM + getRangeMarker(getRangeById(lastStation.id), distanceM);
					checkRange = getRangeById(lastStation.id);
					console.log(distanceM);
					console.log(checkRange);
				}
				// Checks if the station is out of range or not
				if (distanceM <= (checkRange*rangeDeviation)) {
					const newStation = {
						id: marker.id,
						lat: marker.latlng.lat,
						lng: marker.latlng.lng,
					};
					dispatch(addUserMarkSelect({
						id: marker.id,
						lat: marker.latlng.lat,
						lng: marker.latlng.lng,
						distance: distanceM,
						range: rangeM,
						maxCharge: maxChargeM,
						addedRange: addRangeM,
					}));
					setSelectedStations([...selectedStations, newStation]);
				}
			}
			setSelectedMarker(marker);
		}
	};

	// Get the range left after getting to the station
	// Chris
	const getRangeMarker = (rangeMC, distanceMC) => {
		let rangeM = null;
		rangeM = rangeMC - distanceMC;
		return rangeM;
	};

	// Calculate the charged range
	// Chris
	const getAddRange = (charMinC, maxChargeM, charSpeedC, battCapC, maxRangeC, distanceMC, rangeMC) => {
		let rangeLeft = rangeMC - distanceMC;
		let newRange = null;
		const rangeKmPerKwh = maxRangeC/battCapC;

		if (maxChargeM > charSpeedC) {
			newRange = (charSpeedC*(charMinC/60))*rangeKmPerKwh;
		} else {
			newRange = (maxChargeM*(charMinC/60))*rangeKmPerKwh;
		}
		const maxAllowedCharged = maxRangeC - rangeLeft;
		if (maxAllowedCharged > newRange) {
			return newRange;
		} else {
			return (newRange - maxAllowedCharged);
		}
	};

	// Extract the charging capasity from the string given from the NOBIL API
	// Chris
	const getCharCap = (charCapString) => {
		const regex = /([\d,.]+)\s*kW/;
		const capacityMatch = charCapString.match(regex);
		if (capacityMatch && capacityMatch.length > 1) {
			const capacityValue = capacityMatch[1].replace(',','.');
			return parseFloat(capacityValue);
		}
		return null;
	};

	// Calculate distanse between the starting point and the selected station on the map
	// by using the Haversine formula
	// Chris
	const mapPointDistanceCalculator = (lat1, lng1, lat2, lng2) => {
		const toRad = (value) => (value * Math.PI) / 180;
		const earthRadius = 6371; // Earth radius in kilometers

		const dLat = toRad(lat2 - lat1);
		const dLng = toRad(lng2 - lng1);

		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = earthRadius * c;

		return distance;
	};

	const blueMarkerIcon = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';

	const {isLoaded} = useLoadScript({
		googleMapsApiKey: "AIzaSyACqMueWvLFhHETTGHO27NgnjTCBstiZWo",
	})

	// Function to hide components on map
	const options = {
		disableDefaultUI: true,
		zoom: false,
	}
	// Kevin mostly google API & Chris mostly integrating NOBIL stations to the map
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
				{carMarker && (
					<Marker
						position={carMarker}
						icon={{
							url: 'http://maps.google.com/mapfiles/kml/pal2/icon47.png',
						}}
					/>
				)}
				{markers.map((marker) => (
				<React.Fragment key={marker.id}>
					<Marker
					position={marker.latlng}
					onClick={() => handleStationClick(marker)}
					icon={{
						url: selectedStations.some((station) => station.id === marker.id)
							? blueMarkerIcon : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
					}}
					/>
					{selectedStations.some((station) => station.id === marker.id) && (
					<Circle
						center={marker.latlng}
						radius={((getRangeById(marker.id)*1000)*rangeDeviation)*userSettingInfo.season}
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
						<p>Kontakttype: {selectedMarker.content.connector}</p>
						<p>Ladekapasitet: {selectedMarker.content.maxChargingCapacity}</p>
					</div>
				</InfoWindow>
				) : null}
				{circlePos &&(
					<Circle
						center={circlePos}
						radius={(((carInfo.range)*1000)*rangeDeviation)*userSettingInfo.season}
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
};

export default Map;