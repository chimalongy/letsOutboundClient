import { createSlice } from '@reduxjs/toolkit'

const initialData = {
    emails: [
        
    ]
}

export const emailSlice = createSlice({
    name: 'userEmails',
    initialState: {
        userEmails: initialData
    },
    reducers: {
        setUserEmails: (state, action) => {
            state.userEmails = action.payload;
        },
        unsetUserEmails: (state, action) => {
            state.userEmails = initialData;
        },
        addUserEmail: (state, action) => {
            state.userEmails.push(action.payload);
        },

    },

})

export const { setUserEmails, unsetUserEmails, addUserEmail} = emailSlice.actions;
export default emailSlice.reducer;