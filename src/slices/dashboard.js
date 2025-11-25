import { createSlice } from '@reduxjs/toolkit';
// import _ from 'lodash';
// import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';
import axiosAPIInstanceProject from '../axiosInstances/axiosInstanceProject';

// import axios from 'src/utils/axios';

const initialState = {
  data: [],
  clientVisits: [],
  clientDashboardData: {},
  dashboardBroadcast: {},
  clientVisitsMonthly: {},
  yourproject: {},
  yourvisit: {},
  yourregistration: {},
  yourbooking: {},
  notification: {},
  allnotification:[]
};

const dashboardSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    addRoles(state, action) {
      state.data = action.payload;
    },
    addClientVisits(state, action) {
      state.clientVisits = action.payload;
    },
    addDashboardClientData(state, action) {
      state.clientDashboardData = action.payload;
    },
    addDashboardBroadcast(state, action) {
      state.dashboardBroadcast = action.payload;
    },
    getYourProject(state, action) {
      state.yourproject = action.payload;
    },
    getYourVisit(state, action) {
      state.yourvisit = action.payload;
    },
    getYourNotification(state, action) {
      state.notification = action.payload;
    },
    getYourRegistration(state, action) {
      state.yourregistration = action.payload;
    },
    getYourBooking(state, action) {
      state.yourbooking = action.payload;
    },
    getClientVisitMonthly(state, action) {
      state.clientVisitsMonthly = {}
      state.clientVisitsMonthly = action.payload;
    },
    getAllNotifications(state, action) {
      state.allnotification = action.payload;
    },
  }
});
// export const { addRoles } = authSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;

export const addRoles = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/roles');
  dispatch(dashboardSlice.actions.addRoles(response.data.data));
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
export const addDashboardClientData = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/dashboard');
  dispatch(dashboardSlice.actions.addDashboardClientData(response.data));
};

export const getYourProject = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/dashboard/yourproject');
  dispatch(dashboardSlice.actions.getYourProject(response.data));
};

export const getYourVisit = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/dashboard/yourvisit');
  dispatch(dashboardSlice.actions.getYourVisit(response.data));
};

export const getYourRegistration = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/dashboard/yourregistration');
  dispatch(dashboardSlice.actions.getYourRegistration(response.data));
};

export const getAllNotifications = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/dashboard/notification');
  dispatch(dashboardSlice.actions.getAllNotifications(response.data));
};




export const getYourNotification = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/users/notification/requested');
  dispatch(dashboardSlice.actions.getYourNotification(response.data.result));
};

export const getYourBooking = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/dashboard/yourbooking');
  dispatch(dashboardSlice.actions.getYourBooking(response.data));
};


export const addDashboardBroadcast = (roleName, projectBy) => async (dispatch) => {
  if (roleName === 'TEAM_MEMBER' && projectBy.length > 0) {
    const response = await axiosAPIInstanceProject.get('/dashboard/broadcast/teammember');
    dispatch(dashboardSlice.actions.addDashboardBroadcast(response.data));
  } else {
    const response = await axiosAPIInstanceProject.get('/dashboard/broadcast/admin');
    dispatch(dashboardSlice.actions.addDashboardBroadcast(response.data));
  }
};

export const addClientVisits = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/dashboard/clientVisits');
  dispatch(dashboardSlice.actions.addClientVisits(response.data));
};

export const clientVisitByMonth = (payload) => async (dispatch) => {
  const { startDate, endDate } = payload;
  const response = await axiosAPIInstanceProject.post(
    '/clientVisits/dashboardData',
    {
      fromDate: startDate?.toISOString(),
      toDate: endDate?.toISOString()
    }
  );
  dispatch(dashboardSlice.actions.getClientVisitMonthly(response.data));
};

export default dashboardSlice;
