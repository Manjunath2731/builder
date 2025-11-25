import { createSlice } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';
import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';
import {getRMList} from 'src/utils/utilits';

const initialState = {
  brokers: [],
  brokersByBuilderId: [],
  pendingInviteList: [],
  addedByYouList: [],
  cities: [],
  brokerDetailById: {},
  rmList: [],
  companyDetails: {},
  brokerClientDetailsById: {},
  topChannelPartners: [],
  channelPartnerType: {},
  notes: {},
  totalBrokers: [],
  assignUser: {},
  topBrokers: [],
  notification: []
};

const channelPartnerSlice = createSlice({
  name: 'channelPartner',
  initialState,
  reducers: {
    getAllBrokers(state, action) {
      state.brokers = action.payload;
    },
    AddBrokersList(state, action) {
      state.brokersByBuilderId = action.payload;
      if(action.payload){
        state.rmList = getRMList(action.payload)
      }
    },
    getPendingInviteList(state, action) {
      state.pendingInviteList = action.payload;
    },
    AddedByYouList(state, action) {
      state.addedByYouList = action.payload;
    },
    getCities(state, action) {
      state.cities = action.payload;
    },
    getBrokersDetailById(state, action) {
      state.brokerDetailById = action.payload;
      // state.rmList = [];
      // state.rmList.push(action.payload);
    },
    getCompanyDetailById(state, action) {
      state.companyDetails = action.payload;
    },
    getBrokerClientDetailsById(state, action) {
      state.brokerClientDetailsById = action.payload;
    },
    deleteSliceData(state, action) {
      state.brokerDetailById = action.payload;
      state.companyDetails = action.payload;
      state.brokerClientDetailsById = action.payload;
    },
    getChannelPartners(state, action) {
      state.topChannelPartners = action.payload;
    },
    getChannelPartnerType(state, action) {
      state.channelPartnerType = action.payload;
    },
    addNotes(state, action) {
      state.notes = action.payload;
    },
    getTotalBrokers(state, action) {
      state.totalBrokers = action.payload;
    },
    assignUser(state, action) {
      state.assignUser = action.payload;
    },
    getTopBrokers(state, action) {
      state.topBrokers = action.payload;
    },
    getYourVisits(state, action) {
      state.yourvisit = action.payload;
    },
    getYourRegistrations(state, action) {
      state.yourregistration = action.payload;
    },
    getYourBookings(state, action) {
      state.yourbooking = action.payload;
    },
    getNotification(state, action) {
      state.notification = action.payload;
    },
  }
});

export const channelPartnerReducer = channelPartnerSlice.reducer;

export const getAllBrokers = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get('/channelPartner/company');
  dispatch(channelPartnerSlice.actions.getAllBrokers(response.data));
};
export const AddBrokersList = (id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/users/brokers/${id}`);
  dispatch(channelPartnerSlice.actions.AddBrokersList(response.data.data));
};

export const addNotes = (userId) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/notes/${userId}`);
  dispatch(channelPartnerSlice.actions.addNotes(response?.data));
};
export const postNotes = async (payload) => {
  await axiosAPIInstanceProject.post(`/notes`, payload);
};
export const updateNotes = async (payload) => {
await axiosAPIInstanceProject.put(
    `/notes/${payload.userId}`,
    payload
  );
};

export const getPendingInviteList = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/broker/getPendingInvites`);
  dispatch(
    channelPartnerSlice.actions.getPendingInviteList(response.data.data)
  );
};
export const AddedByYouList = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/broker/addedByYou`);
  dispatch(channelPartnerSlice.actions.AddedByYouList(response.data));
};
export const deleteChannelPartner = async (partnerId) => {
  await axiosAPIInstanceProject.delete(
    `/broker/removeChannelPartner/${partnerId}`
  );
};
export const getCities = () => async (dispatch) => {
  const response = await axiosApiInstance.get(`/groups/cities`);
  dispatch(channelPartnerSlice.actions.getCities(response?.data));
};
export const getBrokersDetailById = (userId) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/users/user/${userId}`);
  dispatch(
    channelPartnerSlice.actions.getBrokersDetailById(response?.data?.data)
  );
};
export const getCompanyDetailById = (companyId) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/company/${companyId}`);
  dispatch(channelPartnerSlice.actions.getCompanyDetailById(response?.data));
};
export const getBrokerClientDetailsById = (userId) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(
    `/meetings/channelPartner/${userId}`
  );
  dispatch(
    channelPartnerSlice.actions.getBrokerClientDetailsById(response?.data)
  );
};
export const deleteSliceData = () => (dispatch) => {
  const response = {};
  dispatch(channelPartnerSlice.actions.deleteSliceData(response));
};
export const getChannelPartners = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(
    `/channelPartner/topChannelPartner`
  );
  dispatch(channelPartnerSlice.actions.getChannelPartners(response?.data));
};
export const getChannelPartnerType = () => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(
    `/channelPartner/typePartner`
  );
  dispatch(channelPartnerSlice.actions.getChannelPartnerType(response.data));
};

export const totalUsers = (groupId) => async (dispatch) => {
  const response = await axiosApiInstance.get(
    `/users/getOtherBrokers/${groupId}`
  );
  dispatch(channelPartnerSlice.actions.getTotalBrokers(response.data));
};

export const assignUser = async (payload) => {
  await axiosAPIInstanceProject.post(
    `/broker/assignToAnotherMember`,
    payload
  );
};

export const getTopChannelPartners = () => async (dispatch) => {
  const response = await axiosApiInstance.get('/users/getTopBrokers');
  dispatch(channelPartnerSlice.actions.getTopBrokers(response?.data?.data));
};

export const getYourVisits = (brokerId) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/broker/yourvisit/${brokerId}`);
  dispatch(channelPartnerSlice.actions.getYourVisits(response.data));
};

export const getYourRegistrations = (brokerId) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/broker/yourregistration/${brokerId}`);
  dispatch(channelPartnerSlice.actions.getYourRegistrations(response.data));
};

export const getYourBookings = (brokerId) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/broker/yourbooking/${brokerId}`);
  dispatch(channelPartnerSlice.actions.getYourBookings(response.data));
};

export const getNotification = (brokerId) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/broker/notification/${brokerId}`);
  dispatch(channelPartnerSlice.actions.getNotification(response.data.notification));
};

export default channelPartnerSlice;
