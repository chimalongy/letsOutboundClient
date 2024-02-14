import { createSlice } from '@reduxjs/toolkit'

const initialData = {
    scrapings: []
}

export const scrapingslSlice = createSlice({
    name: 'userScrapings',
    initialState: {
        userScrapings: initialData
    },
    reducers: {
        setUserScrapings: (state, action) => {
            state.userScrapings = action.payload;
        },
        unsetUserScrapings: (state, action) => {
            state.userScrapings = initialData;
        }

    },

})

export const { setUserScrapings, unsetUserScrapings } = scrapingslSlice.actions;
export default scrapingslSlice.reducer;