import { createSlice } from '@reduxjs/toolkit';
// import _ from 'lodash';
import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';
import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';

// import axios from 'src/utils/axios';

const initialState = {
  data: [],
  permission: [],
  teams: [],
  teamById: {},
  teamList:[],
  crmList:[]
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    addTeams(state, action) {
      state.data = action.payload;
    },
    addPermission(state, action) {
      state.permission = action.payload;
    },
    addTeamTypes(state, action) {
      state.teams = action.payload;
    },
    getTeamById(state, action) {
      state.teamById = action.payload;
    },
    deleteSliceData(state, action) {
      state.teamById = action.payload;
    },
    getTeams(state, action) {
      state.teamList = action.payload;
    },
    getCRM(state, action) {
      state.crmList = action.payload;
    },
  }
});
// export const { addRoles } = authSlice.actions;
export const teamReducer = teamSlice.reducer;

export const addTeams = (builderId) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/users/builders/${builderId}`);
  dispatch(teamSlice.actions.addTeams(response.data.data));
};
export const getTeams = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`users/getUsers?roleName=TEAM_MEMBER&userType=builder`);
  dispatch(teamSlice.actions.getTeams(response.data));
};
export const getCRM = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`users/getUsers?roleName=CRM_MEMBER&userType=builder`);
  dispatch(teamSlice.actions.getCRM(response.data));
};
export const getTeamById = (teamId) => async (dispatch) => {
  dispatch(deleteSliceData());
  const response = await axiosAPIInstanceProject.get(`/teams/teamMember/${teamId}`);
  console.log("response",response)
  dispatch(teamSlice.actions.getTeamById(response.data));
};
export const deleteSliceData = () => (dispatch) => {
  const response = {};
  dispatch(teamSlice.actions.deleteSliceData(response));
};

export const addPermission = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/permission');
  dispatch(teamSlice.actions.addPermission(response.data.data));
};

export const addTeamTypes = () => async (dispatch) => {
  const response = await axiosApiInstance.get('/teams');
  dispatch(teamSlice.actions.addTeamTypes(response.data.data));
};

export const deleteTeamMembers = async (teamMemberId) => {
  await axiosApiInstance.delete(
    `/teams/removeTeamMember/${teamMemberId}`
  );
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

export default teamSlice;
