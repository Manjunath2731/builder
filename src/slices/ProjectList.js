import { createSlice } from '@reduxjs/toolkit';
// import _ from 'lodash';
import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';
// import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';
// import axios from 'src/utils/axios';

const initialState = {
  projectListData: [],
  projectByIdData:{},
  BroadCastByProjectId:[],
  projectListBuilder:[],
  projectDetails:[],
  teams:[],
  crmTeam:[],
  rmByProjectId:[],
  projectEvent:[],
  clientvisit:{},
  registration: {},
  booking:{},
  projectcp:{},
  projectType:'',
  projectClientVisit:[],
  notification:[],
};

const ProjectList = createSlice({
  name: 'projectList',
  initialState,
  reducers: {
    getProjectList(state, action) {
      state.projectListData = action.payload;
    },
    getProjectByBuilderId(state,action){
      state.projectListBuilder = action.payload;
    },
    getProjectById(state,action) {
      state.projectByIdData = action.payload;
      state.rmByProjectId=action.payload?.relationManager
    },
    resetProjectById(state,action) {
      state.projectByIdData = {};
      state.BroadCastByProjectId = action.payload;
      state.projectDetails = action.payload;
      state.crmTeam = action.payload;
      state.teams = action.payload;
      state.projectEvent = action.payload;
      state.projectClientVisit = action.payload;
    },
    BroadCastByProjectId(state,action) {
      state.BroadCastByProjectId = action.payload;
    },
    getProjectDetailsById(state,action){
      state.projectDetails = action.payload;
    },
    setProjectType(state,action){
      state.projectType = action.payload;
    },
    getProjectClientVisist(state,action){
      state.clientvisit = action.payload;
    },
    getProjectRegistration(state,action){
      state.registration = action.payload;
    },
    getProjectBooking(state,action){
      state.booking = action.payload;
    },
    getProjectCp(state,action){
      state.projectcp = action.payload;
    },
    getProjectEvents(state,action){
      state.projectEvent = action.payload;
    },
    getProjectClientVisit(state,action){
      state.projectClientVisit = action.payload;
    },
    getProjectTeamsById(state,action){
      state.teams = action.payload;
    },
    getProjectCRMTeamsById(state,action){
      state.crmTeam = action.payload;
    },
    getProjectNotification(state,action){
      state.notification = action.payload;
    },
  }
});
// export const { getProjectList } = authSlice.actions;
export const projectListReducer = ProjectList.reducer;

export const getProjectList = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/project');
  dispatch(ProjectList.actions.getProjectList(response.data));
};

export const getProjectByBuilderId=(groupId)=>async(dispatch)=>{
  const response = await axiosAPIInstanceProject.get(`/project/group/${groupId}`);
  dispatch(ProjectList.actions.getProjectByBuilderId(response.data));
}

export const setProjectType = (data) => (dispatch) =>{
  dispatch(ProjectList.actions.setProjectType(data));
}

export const getProjectById = (Id) => async (dispatch) => {
  dispatch(resetProjectById(Id));
  const response = await axiosAPIInstanceProject.get(`/project/${Id}`);
  dispatch(ProjectList.actions.getProjectById(response.data));
  dispatch(BroadCastByProjectId(Id));
  dispatch(getProjectDetailsById(Id));
  dispatch(getProjectEvents(Id));
  dispatch(getProjectClientVisist(Id));
  dispatch(getProjectRegistration(Id));
  dispatch(getProjectBooking(Id));
  dispatch(getProjectCp(Id));
};
export const resetProjectById = () => async (dispatch) => {
  const response = [];
  dispatch(ProjectList.actions.resetProjectById(response));

};
export const BroadCastByProjectId = (Id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/broadcasts/project/${Id}`);
  dispatch(ProjectList.actions.BroadCastByProjectId(response.data));
};

export const getProjectClientVisist = (Id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/project/yourvisit/${Id}`);
  dispatch(ProjectList.actions.getProjectClientVisist(response.data));
};

export const getProjectRegistration = (Id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/project/yourregistration/${Id}`);
  dispatch(ProjectList.actions.getProjectRegistration(response.data));
};

export const getProjectBooking = (Id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/project/yourbooking/${Id}`);
  dispatch(ProjectList.actions.getProjectBooking(response.data));
};

export const getProjectCp = (Id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/project/yourcp/${Id}`);
  dispatch(ProjectList.actions.getProjectCp(response.data));
};

export const getProjectDetailsById = (Id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/project/projectDetails/${Id}`);
  dispatch(ProjectList.actions.getProjectDetailsById(response.data));
};

export const getProjectNotification = (Id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/project/notification/${Id}`);
  dispatch(ProjectList.actions.getProjectNotification(response.data));
};

export const getProjectTeamsById = (teamIds) => async (dispatch) => {
  Promise.all([...teamIds].map(async(teamId) =>{
  let response = await axiosAPIInstanceProject.get(`/users/user/${teamId}`);
  return response?.data?.data
  
})).then(res=> {
  dispatch(ProjectList.actions.getProjectTeamsById(res));
})
};
export const getProjectCRMTeamsById = (crmIds) => async (dispatch) => {
  Promise.all([...crmIds].map(async(crmIds) =>{
  let response = await axiosAPIInstanceProject.get(`/users/user/${crmIds}`);
  return response?.data?.data
  
})).then(res=> {
  dispatch(ProjectList.actions.getProjectCRMTeamsById(res));
})
};
export const getProjectEvents = (Id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/events/getByProjectId/${Id}`);
  dispatch(ProjectList.actions.getProjectEvents(response.data));
};
export const getProjectClientVisit = (Id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/meetings/getByProjectId/${Id}`);
  dispatch(ProjectList.actions.getProjectClientVisit(response.data));
};

export default ProjectList;
