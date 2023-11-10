import { createSlice } from '@reduxjs/toolkit'

const initialData = {
    tasks: [
        
    ]
}

export const taskSlice = createSlice({
    name: 'userTasks',
    initialState: {
        userTasks: initialData
    },
    reducers: {
        setUserTasks: (state, action) => {
            state.userTasks = action.payload;
        },
        unsetUserTasks: (state, action) => {
            state.Tasks = initialData;
        },
        addUserTask: (state, action) => {
            state.userTasks.push(action.payload);
        },

    },

})

export const { setUserTasks, unsetUserTasks, addUserTask} = taskSlice.actions;
export default taskSlice.reducer;