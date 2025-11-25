import { createSlice } from '@reduxjs/toolkit';
// import _ from 'lodash';
// import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';
import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';

// import axios from 'src/utils/axios';

const initialState = {
  data: [],
  groupDataById: {},
  userDataByGroupId: []
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    addGroups(state, action) {
      state.data = action.payload;
    },
    getGroupById(state, action) {
      state.groupDataById = action.payload;
    },
    getUserByGroupId(state, action) {
      state.userDataByGroupId = action.payload;
    },
    resetGroupAndUser(state, action) {
      state.userDataByGroupId = action.payload;
      state.groupDataById = action.payload;
    }
  }
});
// export const { addRoles } = authSlice.actions;
export const groupReducer = groupSlice.reducer;

export const addGroups = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/groups');
  dispatch(groupSlice.actions.addGroups(response.data.data));
};
export const getGroupById = (id) => async (dispatch) => {
  dispatch(resetGroupAndUser());
  const response = await axiosAPIInstanceProject.get(`/groups/${id}`);
  dispatch(groupSlice.actions.getGroupById(response.data));
  dispatch(getUserByGroupId(id));
};
export const getUserByGroupId = (Id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(
    `/users/getUserByRole?roleName=ADMIN&companyId=${Id}`
  );
  dispatch(groupSlice.actions.getUserByGroupId(response.data.data));
};

export const resetGroupAndUser = () => (dispatch) => {
  const response = {};

  dispatch(groupSlice.actions.resetGroupAndUser(response));
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

export default groupSlice;
