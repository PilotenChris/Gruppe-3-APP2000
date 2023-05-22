import { createSlice } from '@reduxjs/toolkit';

const userCarSlice = createSlice({
    name: 'userCar',
    initialState: [
        { car: 'Tesla', type: 'Model 3', version: 'Long Range', maxRange: 570, range: 500, battCap: 75, charSpeed: 250, lat: '', lng: '', exRange: '', charMIN: 15 },
    ],
    reducers: {
        addUserCar: (state, action) => {
            const newUserCar = {
                car: action.payload.car,
                type: '',
                version: '',
                maxRange: '',
                range: '',
                battCap: '',
                charSpeed: '',
                lat: '',
                lng: '',
                exRange: '',
                charMIN: '',
            };
            state.splice(0, state.length);
            state.push(newUserCar);
        },
        updateType: (state, action) => {
            const { type } = action.payload;
            if (state.length > 0) {
                state[0].type = type;
            }
        },
        updateVersion: (state, action) => {
            const { version } = action.payload;
            if (state.length > 0) {
                state[0].version = version;
            }
        },
        updateInfo: (state, action) => {
            const { battCap, charSpeed } = action.payload;
            if (state.length > 0) {
                state[0].battCap = battCap;
                state[0].charSpeed = charSpeed;
            }
        },
        updateRange: (state, action) => {
            const { range } = action.payload;
            if (state.length > 0) {
                state[0].range = range;
            }
        },
        updateLatLng: (state, action) => {
            const { lat, lng } = action.payload;
            if (state.length > 0) {
                state[0].lat = lat;
                state[0].lng = lng;
            }
        },
        updateExRange: (state, action) => {
            const { exRange } = action.payload;
            if (state.length > 0) {
                if (state[0].exRange > 0) {
                    state[0].exRange += exRange;
                } else {
                    state[0].exRange = exRange;
                }
            }
        },
        updateCharMIN: (state, action) => {
            const { charMIN } = action.payload;
            if (state.length > 0) {
                state[0].charMIN = charMIN;
            }
        },
        updateMaxRange: (state, action) => {
            const { maxRange } = action.payload;
            if (state.length > 0) {
                state[0].maxRange = maxRange;
            }
        },
    },
});

export const { addUserCar, updateType, updateVersion, updateInfo, updateRange, updateLatLng, updateExRange, updateCharMIN } = userCarSlice.actions;
export default userCarSlice.reducer;