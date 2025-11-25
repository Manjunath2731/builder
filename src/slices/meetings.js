import { createSlice } from '@reduxjs/toolkit';
// import _ from 'lodash';
import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';
// import axiosInstance from 'src/axiosInstances/AxiosApiInstance';
// import axios from 'src/utils/axios';

const initialState = {
  data: [],
  brokers: [],
  brokersBygroup: [],
  users: [],
  projects: [],
  meetingCard: [],
  requestMeetingCard: [],
  walkin: [],
  bookingCard: [],
  registrationCard: [],
  clientVisit: [],
  projectListBuilder:[],
  userBuilderId: []
};

const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    addMeetings(state, action) {
      state.data = action.payload;
    },
    addBrokers(state, action) {
      state.brokers = action.payload;
    },
    addBrokersBygroupId(state, action) {
      state.brokersBygroup = action.payload;
    },
    addUsers(state, action) {
      state.users = action.payload;
    },
    addProjects(state, action) {
      state.projects = action.payload;
    },
    addMeetingCard(state, action) {
      // state.requestMeetingCard = action.payload;
      state.meetingCard = action.payload;
    },
    getbookingCard(state, action) {
      state.bookingCard = action.payload;
    },
    getregistrationCard(state, action) {
      state.registrationCard = action.payload;
    },
    meetingCards(state, action) {
      if (action.payload.length) {
        state.meetingCard = state.meetingCard.concat(action.payload);
        // [...state.meetingCard, ...action.payload];
      }
    },    
    getProjectByBuilderId(state,action){
      state.projectListBuilder = action.payload;
    },
    getClientVisit(state, action) {
      state.data = action.payload;
    },
    getUserByGroupId(state, action) {
      state.userBuilderId = action.payload;
    },
    getTeammemberByGroupId(state, action) {
      if (action.payload.length) {
        state.userBuilderId = state.userBuilderId.concat(action.payload);
      }
    }
  }
});
// export const { addRoles } = authSlice.actions;
export const meetingReducer = meetingSlice.reducer;

export const addMeetings = () => async (dispatch) => {
  try {
    const response = await axiosAPIInstanceProject.get('/meetings');
    // dispatch(meetingSlice.actions.addMeetings(response.data));
    dispatch(getClientVisit(response.data));
  } catch (e) {
    console.log(e);
  }
};
export const addBrokers = () => async (dispatch) => {
  try {
    const response = await axiosAPIInstanceProject.get(
      '/users/totalUsers?userType=broker'
    );
    dispatch(meetingSlice.actions.addBrokers(response.data.data));
  } catch (e) {
    console.log(e);
  }
};

export const addBrokersBygroupId = () => async (dispatch) => {
  try {
    const response = await axiosAPIInstanceProject.get(
      '/users/totalBroker?userType=broker'
    );
    console.log("response.data.data",response.data.data);
    dispatch(meetingSlice.actions.addBrokersBygroupId(response.data.data));
  } catch (e) {
    console.log(e);
  }
};

export const addUsers = () => async (dispatch) => {
  try {
    const response = await axiosAPIInstanceProject.get(
      '/users/totalUsers?userType=builder'
    );
    dispatch(meetingSlice.actions.addUsers(response.data.data));
  } catch (e) {
    console.log(e);
  }
};

export const getUsersByGroupId = (groupId) => async (dispatch) => {
  try {
    const response = await axiosAPIInstanceProject.get(
      `/users/getUserByRole?roleName=ADMIN&companyID=${groupId}`
    );
    dispatch(meetingSlice.actions.getUserByGroupId(response.data.data));
    const responseData = await axiosAPIInstanceProject.get(
      `/users/getUserByRole?roleName=TEAM_MEMBER&companyID=${groupId}`
    );
    dispatch(
      meetingSlice.actions.getTeammemberByGroupId(responseData.data.data)
    );
  } catch (e) {
    console.log(e);
  }
};

export const addProjects = () => async (dispatch) => {
  try {
    const response = await axiosAPIInstanceProject.get('/project');
    dispatch(meetingSlice.actions.addProjects(response.data));
  } catch (e) {
    console.log(e);
  }
};

export const getProjectByBuilderId=(groupId)=>async(dispatch)=>{
  const response = await axiosAPIInstanceProject.get(`/project/group/${groupId}`);
  dispatch(meetingSlice.actions.getProjectByBuilderId(response.data));
}


export const addMeetingCard = () => async (dispatch) => {
  try {
    const response = await axiosAPIInstanceProject.get(
      '/meetings/getLatestMeetings?meetingType=CLIENTVISIT&status=Requested'
    );
    
    dispatch(meetingSlice.actions.addMeetingCard(response.data));
    // dispatch(meetingCards());
  } catch (e) {
    console.log(e);
  }
};

export const getbookingCard = () => async (dispatch) => {
  try {
    const response = await axiosAPIInstanceProject.get('booking/getBooking');
    dispatch(meetingSlice.actions.getbookingCard(response.data));
  } catch (e) {
    console.log(e);
  }
};
export const getregistrationCard = () => async (dispatch) => {
  try {
    const response = await axiosAPIInstanceProject.get(
      'booking/getRegistration'
    );
    dispatch(meetingSlice.actions.getregistrationCard(response.data));
  } catch (e) {
    console.log(e);
  }
};

export const meetingCards = () => async (dispatch) => {
  try {
    const response = await axiosAPIInstanceProject.get(
      '/meetings/getLatestMeetings?meetingType=WALKIN&status=Requested'
    );
    dispatch(meetingSlice.actions.meetingCards(response.data));
  } catch (e) {
    console.log(e);
  }
};
export const getClientVisit = (meetingdata) => async (dispatch) => {
  try {
    const response = await axiosAPIInstanceProject.get(
      'meetings/getClientVisits'
    );
    console.log(response.data, 'getClientVisit');
    let acceptedRequest = response?.data.filter(
      (item) => item?.status === 'Accepted'
    );
    let allMeetings = meetingdata.concat(acceptedRequest);
    dispatch(meetingSlice.actions.getClientVisit(allMeetings));
  } catch (e) {
    console.log(e);
  }
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

export default meetingSlice;
