import { createSlice } from "@reduxjs/toolkit";

const userSettingSlice = createSlice({
    name: 'userSetting',
    initialState: [],
    reducers: {
        addUserSetting: (state) => {
            const newUserSetting = {
                season: 1.0,
            };
            state.push(newUserSetting);
        },
        updateSeason: (state, action) => {
            const { season } = action.payload;
            if (state.length > 0) {
                state[0].season = season;
            }
        }
    },
});

export const { addUserSetting, updateSeason } = userSettingSlice.actions;
export default userSettingSlice.reducer;