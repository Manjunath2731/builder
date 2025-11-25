import { createSlice } from '@reduxjs/toolkit';

import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';

const initialState = {
    news: [],
    circle: [],
    govtpolices: [],
    sampledocs:[],
    maps:[],
    deedwriter:[],
    bankdsas:[]
};

const centerSlice = createSlice({
    name: 'center',
    initialState,
    reducers: {
        getNews(state, action) {
            state.news = action.payload;
        },
        getCircleRate(state, action) {
            state.circle = action.payload;
        },
        getGovtPolices(state, action) {
            state.govtpolices = action.payload;
        },
        getSampleDocs(state, action) {
            state.sampledocs = action.payload;
        },
        getMaps(state, action) {
            state.maps = action.payload;
        },
        getDeedWriter(state, action) {
            state.deedwriter = action.payload;
        },
        getBankDsas(state, action) {
            state.bankdsas = action.payload;
        },
    }
});

export const centerReducer = centerSlice.reducer;

// ************************ NEWS ******************************

export const getNews = () => async (dispatch) => {
    const response = await axiosAPIInstanceProject.get(`center/news`);
    dispatch(centerSlice.actions.getNews(response.data.payload));
}

export const deleteNews = async (id) => {
    try {
        const response = await axiosAPIInstanceProject.delete(`center/news/${id}`);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export const editNews = async (id, payload) => {
    try {
        const response = await axiosAPIInstanceProject.put(`center/news/${id}`, payload);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

// ************ CIRCLE RATE ********************

export const getCircleRate = () => async (dispatch) => {
    const response = await axiosAPIInstanceProject.get(`center/circlerate`);
    dispatch(centerSlice.actions.getCircleRate(response.data.payload));
}

export const deleteCircleRate = async (id) => {
    try {
        const response = await axiosAPIInstanceProject.delete(`center/circlerate/${id}`);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

// **************** GOVT. POLICES ******************
export const getGovtPolices = () => async (dispatch) => {
    const response = await axiosAPIInstanceProject.get(`center/govtpolices`);
    dispatch(centerSlice.actions.getGovtPolices(response.data.payload));
}

export const editGovtPolices = async (id, payload) => {
    try {
        const response = await axiosAPIInstanceProject.put(`center/govtpolices/${id}`, payload);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export const deleteGovtPolices = async (id) => {
    try {
        const response = await axiosAPIInstanceProject.delete(`center/govtpolices/${id}`);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

// *************************** SAMPLE DOCS *************************************************

export const getSampleDocs = () => async (dispatch) => {
    const response = await axiosAPIInstanceProject.get(`center/sampledocs`);
    dispatch(centerSlice.actions.getSampleDocs(response.data.payload));
}

export const deleteSampleDocs = async (id) => {
    try {
        const response = await axiosAPIInstanceProject.delete(`center/sampledocs/${id}`);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

// ************ MAps ********************

export const getMaps = () => async (dispatch) => {
    const response = await axiosAPIInstanceProject.get(`center/maps`);
    dispatch(centerSlice.actions.getMaps(response.data.payload));
}

export const deleteMaps = async (id) => {
    try {
        const response = await axiosAPIInstanceProject.delete(`center/maps/${id}`);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

// ***************************** Deed Writer *******************************
export const getDeedWriter = () => async (dispatch) => {
    const response = await axiosAPIInstanceProject.get(`center/deedwriter`);
    dispatch(centerSlice.actions.getDeedWriter(response.data.payload));
}

export const deleteDeedWriter = async (id) => {
    try {
        const response = await axiosAPIInstanceProject.delete(`center/deedwriter/${id}`);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export const editDeedWriter = async (id, payload) => {
    try {
        const response = await axiosAPIInstanceProject.put(`center/deedwriter/${id}`, payload);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

// ***************************** bankdsas Writer *******************************
export const getBankDsas = () => async (dispatch) => {
    const response = await axiosAPIInstanceProject.get(`center/bankdsas`);
    dispatch(centerSlice.actions.getBankDsas(response.data.payload));
}

export const deleteBankDsas = async (id) => {
    try {
        const response = await axiosAPIInstanceProject.delete(`center/bankdsas/${id}`);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export const editBankDsas = async (id, payload) => {
    try {
        const response = await axiosAPIInstanceProject.put(`center/bankdsas/${id}`, payload);
        return response;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export default centerSlice;
