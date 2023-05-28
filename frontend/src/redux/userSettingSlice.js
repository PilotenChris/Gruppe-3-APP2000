import { createSlice } from "@reduxjs/toolkit";

// Chris
// Redux slice for car
const userSettingSlice = createSlice({
    name: 'userSetting',
    initialState: {
        season: '',
    },
    reducers: {
        setUserSetting: (state, action) => {
            state.season = action.payload;
        },
        updateSeason: (state, action) => {
            state.season = action.payload;
        }
    },
});

export const { setUserSetting, updateSeason } = userSettingSlice.actions;
export default userSettingSlice.reducer;