import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { roleReducer } from 'src/slices/roles';
import { groupReducer } from 'src/slices/groups';
import { projectReducer } from 'src/slices/project_forms';
import { teamReducer } from 'src/slices/team';
import { meetingReducer } from 'src/slices/meetings';
import { eventReducer } from 'src/slices/Events';
import { channelPartnerReducer } from 'src/slices/channelPartner';
import { broadcastReducer } from 'src/slices/broadcast';
import { projectListReducer } from 'src/slices/ProjectList';
import { dashboardReducer } from 'src/slices/dashboard';
import { authReducer } from 'src/slices/auth';
import { citiesReducer } from 'src/slices/cities';
import { associateReducer } from 'src/slices/Associate';
import { centerReducer } from 'src/slices/center';

const store = configureStore({
  reducer: {
    role: roleReducer,
    group: groupReducer,
    project: projectReducer,
    team: teamReducer,
    meeting: meetingReducer,
    event: eventReducer,
    channelPartner: channelPartnerReducer,
    broadcast: broadcastReducer,
    projectList: projectListReducer,
    dashboard: dashboardReducer,
    auth: authReducer,
    cities: citiesReducer,
    associate: associateReducer,
    center: centerReducer
  }
});

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();

export default store;
