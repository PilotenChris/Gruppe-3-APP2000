import { configureStore } from '@reduxjs/toolkit';
import userCarReducer from './userCarSlice';
import userMarkSelectReducer from './userMarkSelectSlice';
import userSettingReducer from './userSettingSlice';

// Chris
// The redux store for the Car, Markers and Settings
export default configureStore({
    reducer: {
        userCar: userCarReducer,
        userMarkSelect: userMarkSelectReducer,
        userSetting: userSettingReducer,
    },
});