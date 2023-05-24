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
                maxCharge: action.payload.maxCharge,
                addedRange: action.payload.addedRange,
            };
            state.push(newUserMarkSelect);
        },
        updateRange: (state, action) => {
            const { range } = action.payload;
            if (state.length > 0) {
                state[0].range = range;
            }
        },
        deleteUserMarkSelect: (state, action) => {
            return state.filter((marker)=> marker.id !== action.payload.id);
        },
        resetUserMark: (state) => {
            state.splice(0, state.length);
        },
    },
});

export const { addUserMarkSelect, updateRange, deleteUserMarkSelect, resetUserMark } = userMarkSelectSlice.actions;
export default userMarkSelectSlice.reducer;