import { createSlice } from "@reduxjs/toolkit";



const authslice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    islogged: false,
    isloading: true,
  },

  reducers: {
    adduser: (state, action) => {
       console.log(action.payload); 
      state.user = action.payload;
      
      (state.islogged = true), (state.isloading = false);

       
       
    },

    

    removeuser: (state) => {
      state.user = null;
      state.islogged = false;
      state.isloading = false;
    },
  },
});


export const {adduser,removeuser}=authslice.actions

export default authslice.reducer;
