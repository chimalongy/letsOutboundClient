import { createSlice } from '@reduxjs/toolkit'

const initialData={
    _id:"",
    firstName:"",
    lastName: "",
    email:"",
    password:"",
    token:""
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: initialData
    },
    reducers: {
        login: (state, action) => {
            state.userData = action.payload;
        },
        logout: (state, action) => {
            state.userData = initialData;
        },
    },

})

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;