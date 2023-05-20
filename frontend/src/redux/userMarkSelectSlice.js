import { createSlice } from '@reduxjs/toolkit';

const userMarkSelectSlice = createSlice({
    name: 'userMarkSelect',
    initialState: [],
    reducers: {
        addUserMarkSelect: (state, action) => {
            const newUserMarkSelect = {
                id: action.payload.id,
                lat: action.payload.lat,
                lng: action.payload.lng,
                distance: action.payload.distance,
                range: action.payload.range,
                maxCharge: '',
            };
            state.push(newUserMarkSelect);
        },
        updateDistance: (state, action) => {
            const { distance } = action.payload;
            if (state.length > 0) {
                state[0].distance = distance;
            }
        },
        updateRange: (state, action) => {
            const { range } = action.payload;
            if (state.length > 0) {
                state[0].range = range;
            }
        },
    },
});

export const { addUserMarkSelect } = userMarkSelectSlice.actions;
export default userMarkSelectSlice.reducer;