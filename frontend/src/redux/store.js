import { configureStore } from '@reduxjs/toolkit';
import userCarReducer from './userCarSlice';
import userMarkSelectReducer from './userMarkSelectSlice';
import userSettingReducer from './userSettingSlice';

export default configureStore({
    reducer: {
        userCar: userCarReducer,
        userMarkSelect: userMarkSelectReducer,
        userSetting: userSettingReducer,
    },
});