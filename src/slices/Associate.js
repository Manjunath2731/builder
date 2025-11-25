import { createSlice } from '@reduxjs/toolkit';
// import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';
import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';

const initialState = {
  allAssociates: [],
  associatesById: {}
};

const associateSlice = createSlice({
  name: 'associate',
  initialState,
  reducers: {
    getAssociate(state, action) {
      state.allAssociates = action.payload;
    },
    getAssociateById(state, action) {
      state.associatesById = action.payload;
    },
    deleteSliceData(state, action) {
      state.associatesById = action.payload;
    }
  }
});

export const associateReducer = associateSlice.reducer;

export const getAssociate = () => async (dispatch) => {
  dispatch(deleteSliceData());
  let response;
  try {
    response = await axiosAPIInstanceProject.get(
      `/users/getUserByRole?roleName=ASSOCIATE_ADMIN`
    );
  } catch (error) {
    response = error;
  }
  dispatch(associateSlice.actions.getAssociate(response?.data?.data || []));
};
export const getAssociateById = (Id) => async (dispatch) => {
  console.log(Id);
  const response = await axiosAPIInstanceProject.get(`/users/user/${Id}`);
  dispatch(associateSlice.actions.getAssociateById(response.data.data));
};
export const deleteSliceData = () => (dispatch) => {
  const response = {};
  dispatch(associateSlice.actions.deleteSliceData(response));
};

export const deleteAssociate = async (Id) => {
  let response;
  try {
    response = await axiosAPIInstanceProject.delete(`/users/${Id}`);
  } catch (error) {
    response = error;
  }
  return response;
};
