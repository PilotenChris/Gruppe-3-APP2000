import { configureStore } from '@reduxjs/toolkit';
import userCarReducer from './userCarSlice';

export default configureStore({
    reducer: {
        userCar: userCarReducer,
    },
});