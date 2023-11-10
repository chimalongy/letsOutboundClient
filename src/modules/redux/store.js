import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import userReducer from "./userDataSlice"
import emailReducer from "./userEmailsSlice"
import outboundReducer from "./userOutboundsSlice"
import taskReducer from "./userTasksSlice"

const taskPersist = {
    key: 'userTasks',
    storage,
};
const outboundPersist = {
    key: 'userOutbounds',
    storage,
};
const emailPersist = {
    key: 'userEmails',
    storage,
};
const userPersist = {
    key: 'userData',
    storage,
};


const loggedUserData = persistReducer(userPersist, userReducer);
const loggedUserEmails = persistReducer(emailPersist, emailReducer);
const loggedUserOutbounds = persistReducer(outboundPersist, outboundReducer);
const loggedUserTasks = persistReducer(taskPersist, taskReducer);

export const store = configureStore({
    reducer: {
        user: loggedUserData,
        userEmails:loggedUserEmails,  
        userOutbounds:loggedUserOutbounds,  
        userTasks:loggedUserTasks,  
        devTools: process.env.NODE_ENV !== 'production',
        middleware: [thunk]
    }
});

export const persistor = persistStore(store);