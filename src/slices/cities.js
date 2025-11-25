import { createSlice } from '@reduxjs/toolkit';
import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';

const initialState = {
  data: []
};
const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    getCities(state, action) {
      state.data = action.payload;
    }
  }
});

export const citiesReducer = citiesSlice.reducer;

export const getCities = () => async (dispatch) => {
  const response = await axiosApiInstance.get('/groups/cities');
  dispatch(citiesSlice.actions.getCities(response.data));
};

export default  citiesSlice;