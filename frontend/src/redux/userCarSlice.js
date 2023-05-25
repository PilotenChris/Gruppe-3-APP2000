import { createSlice } from '@reduxjs/toolkit';

const userCarSlice = createSlice({
    name: 'userCar',
    initialState: [],
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
        removeExRange: (state, action) => {
            const { exRange } = action.payload;
            if (state.length > 0) {
                if (state[0].exRange > 0) {
                    state[0].exRange -= exRange;
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
        resetUserCar: (state) => {
            state.splice(0, state.length);
        },
        resetUserCarType: (state) => {
            state[0].type = '';
        },
        resetUserCarVersion: (state) => {
            state[0].version = '';
        },
        resetUserCarMaxRange: (state) => {
            state[0].maxRange = '';
        },
    },
});

export const { addUserCar, updateType, updateVersion, updateInfo, updateRange, updateLatLng, removeExRange, updateExRange, updateCharMIN, updateMaxRange, resetUserCar, resetUserCarType, resetUserCarVersion, resetUserCarMaxRange } = userCarSlice.actions;
export default userCarSlice.reducer;