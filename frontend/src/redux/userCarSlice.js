import { createSlice } from '@reduxjs/toolkit';

const userCarSlice = createSlice({
    name: 'userCar',
    initialState: [],
    reducers: {
        addUserCar: (state, action) => {
            const newUserCar = {
                car: action.payload.car,
                type: action.payload.type,
                version: action.payload.version,
                range: '',
                lat: '',
                lng: '',
                exRange: '',
            };
            state.splice(0, state.length);
            state.push(newUserCar);
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
                state[0].exRange = exRange;
            }
        },
    },
});

export const { addUserCar, updateRange, updateLatLng, updateExRange } = userCarSlice.actions;
export default userCarSlice.reducer;