import { createSlice } from '@reduxjs/toolkit';
// import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';
// import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';
import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';

const initialState = {
  brokers: [],
  brokerList: []
};

const EventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    getAllBrokers(state, action) {
      state.brokers = action.payload;
    },
    getAllBrokersList(state, action) {
      state.brokerList = action.payload;
    }
  }
});

export const eventReducer = EventSlice.reducer;

export const getAllBrokers = (userId) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/users/brokers/${userId}`);
  dispatch(EventSlice.actions.getAllBrokers(response.data.data));
};

export const getAllBrokerList = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(
    `/users/totalUsers?userType=broker`
  );
  dispatch(EventSlice.actions.getAllBrokersList(response?.data?.data));
};
export default EventSlice;
