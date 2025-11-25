import { createSlice } from '@reduxjs/toolkit';
import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';

const initialState = {
  projectId: '',
  data: {},
  coords: []
};

const ProjectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    createProject(state, action) {
      state.data = action.payload;
      state.projectId = action.payload._id;
    },
    AddProjectField(state, action) {
      state.data = action.payload;
    },
    getProjectById(state, action) {
      state.data = action.payload;
      state.projectId = action.payload._id;
    },
    deleteSliceData(state, action) {
      state.data = action.payload;
      state.projectId = '';
    },

    getCoordinates(state, action) {
      state.coords = action.payload;
    }
  }
});

export const projectReducer = ProjectSlice.reducer;

export const createProject = (payload) => async (dispatch) => {
  const { data } = await axiosAPIInstanceProject.post('/project/add', payload);
  dispatch(ProjectSlice.actions.createProject(data));
};

export const AddProjectField =
  (projectId, payload, IsContinueClicked) => async (dispatch) => {
    await axiosAPIInstanceProject.put(`/project/${projectId}`, payload);
    if (IsContinueClicked) {
      dispatch(getProjectById(projectId));
    }
  };

export const getProjectById = (Id) => async (dispatch) => {
  const response = await axiosAPIInstanceProject.get(`/project/${Id}`);
  dispatch(ProjectSlice.actions.getProjectById(response.data));
};
export const deleteSliceData = () => (dispatch) => {
  const response = {};

  dispatch(ProjectSlice.actions.deleteSliceData(response));
};

export const getCoordinates = (coords) => (dispatch) => {
  dispatch(ProjectSlice.actions.getCoordinates(coords));
};
export default ProjectSlice;
