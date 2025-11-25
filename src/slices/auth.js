import { createSlice } from '@reduxjs/toolkit';
// import _ from 'lodash';

// import axios from 'src/utils/axios';

const initialState = {
  data: JSON.parse(window.localStorage.getItem('user'))
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addUserInfo(state, action) {
      state.data = action.payload;
    }
  }
});
export const { addUserInfo } = authSlice.actions;

export const authReducer = authSlice.reducer;

export default authSlice;
