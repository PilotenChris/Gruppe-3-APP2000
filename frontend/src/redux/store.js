import { configureStore } from '@reduxjs/toolkit';
import userCarReducer from './userCarSlice';
import userMarkSelectReducer from './userMarkSelectSlice';

export default configureStore({
    reducer: {
        userCar: userCarReducer,
        userMarkSelect: userMarkSelectReducer,
    },
});