import { createSlice } from '@reduxjs/toolkit';
// import _ from 'lodash';
// import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';
import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';
import {
  SortObjectOnTimeBasisLatest,
} from 'src/utils/utilits';
// import axios from 'src/utils/axios';

const initialState = {
  data: [],
  myBroadcast: {},
  broadcastType: '',
  broadcastTitle:'',
  userBroadcast:''
};

const broadcastSlice = createSlice({
  name: 'broadcast',
  initialState,
  reducers: {
    addBroadcast(state, action) {
      let response = JSON.parse(JSON.stringify(action.payload));
      let allBroadcast=[];
      Object.keys(response).map(item => Array.prototype.push.apply(allBroadcast, response[item])) 
      response.ALL_BROADCAST = SortObjectOnTimeBasisLatest(allBroadcast)
      state.data = response;
    },
    addMyBroadcast(state, action) {
      state.myBroadcast = action.payload;
    },
    updateBroadcastCategory(state, action) {
      state.broadcastType = action.payload;
      state.broadcastTitle = '';
    },
    updateBroadcastTitle(state, action) {
      state.broadcastTitle = action.payload.title;
      state.broadcastType = action.payload.category;
      console.log(action.payload,'broadcast title payload')
    },
    getUserBroadcast(state, action) {
      state.userBroadcast = action.payload
      console.log(action.payload,'broadcast title payload')
    }
  }
});
// export const { addRoles } = authSlice.actions;
export const broadcastReducer = broadcastSlice.reducer;

export const addBroadcast = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(
    '/broadcasts/getAll/broadcast'
  );
  dispatch(broadcastSlice.actions.addBroadcast(response.data));
};

export const addMyBroadcast = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/broadcasts/myBroadcast');
  dispatch(
    broadcastSlice.actions.addMyBroadcast(response.data)
  );
  console.log(response.data,'mybroadcast')
};

export const getUserBroadcastData = (id) => async (dispatch) => {
  console.log(id,"id")
  const response = await axiosAPIInstanceProject.get(`/broadcasts/${id}`);
  console.log(response.data,'getBroadcast')
  dispatch(
    broadcastSlice.actions.getUserBroadcast(response.data)
  );
};

export const updateBroadcastCategory = (category) => async (dispatch) => {
  dispatch(broadcastSlice.actions.updateBroadcastCategory(category));
};
export const updateBroadcastTitle = (title,category) => async (dispatch) => {
  dispatch(broadcastSlice.actions.updateBroadcastTitle({title,category}));
};

// export const addRoles = (data) => async (dispatch) => {
//   const response = await axios.post('/api/calendar/meetings/create', data);

//   dispatch(slice.actions.createEvent(response.data));
// };

// export const selectEvent = (eventId) => async (dispatch) => {
//   dispatch(slice.actions.selectEvent({ eventId }));
// };

// export const updateEvent = (eventId, update) => async (dispatch) => {
//   const response = await axios.post('/api/calendar/meetings/update', {
//     eventId,
//     update
//   });

//   dispatch(slice.actions.updateEvent(response.data));
// };

// export const deleteEvent = (eventId) => async (dispatch) => {
//   await axios.post('/api/calendar/meetings/delete', {
//     eventId
//   });

//   dispatch(slice.actions.deleteEvent({ eventId }));
// };

// export const selectRange = (start, end) => (dispatch) => {
//   dispatch(
//     slice.actions.selectRange({
//       start: start.getTime(),
//       end: end.getTime()
//     })
//   );
// };

// export const openDrawerPanel = () => (dispatch) => {
//   dispatch(slice.actions.openDrawerPanel());
// };

// export const closeDrawerPanel = () => (dispatch) => {
//   dispatch(slice.actions.closeDrawerPanel());
// };

export default broadcastSlice;
