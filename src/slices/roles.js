import { createSlice } from '@reduxjs/toolkit';
// import _ from 'lodash';
// import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';
import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';

// import axios from 'src/utils/axios';

const initialState = {
  data: []
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    addRoles(state, action) {
      state.data = action.payload;
    }
  }
});
// export const { addRoles } = authSlice.actions;
export const roleReducer = roleSlice.reducer;

export const addRoles = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/roles');
  dispatch(roleSlice.actions.addRoles(response.data.data));
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

export default roleSlice;
