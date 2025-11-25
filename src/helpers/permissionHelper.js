import { useSelector } from 'react-redux';

const canCreateBroadcast = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  } else if (userData?.permissions.some(permission => permission.name === 'addBroadcast')) {
    output = true;
  }
  return output;
};
// TODO(Biswa): edit project will get added after the screens are done
const canEditProject = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  } else if (userData?.permissions.some(permission => permission.name === 'addProject')) {
    output = true;
  }
  return output;
};

const canReassignBroker = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  } else if (userData?.permissions.includes('reassignRM')) {
    output = true;
  }
  return output;
};

const canCreateEvent = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  } else if (userData?.permissions.some(permission => permission.name === 'addEvent')) {
    output = true;
  }
  return output;
};
// TODO(Biswa)
const canDownloadReports = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  } else if (userData?.permissions.some(permission => permission.name === 'downloadReports')) {
    output = true;
  }
  return output;
};
const canAddCRMMembers = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  } else if (userData?.permissions.some(permission => permission.name === 'addCRMMember')) {
    output = true;
  }
  return output;
};

const canAddMeeting = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  } else if (userData?.permissions.some(permission => permission.name === 'addMeetings')) {
    output = true;
  }
  return output;
};

const canDeleteMeeting = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  } else if (userData?.permissions.some(permission => permission.name === 'deleteMeetings')) {
    output = true;
  }
  return output;
};

const canAddMembers = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  } else if (userData?.permissions.some(permission => permission.name === 'addMember')) {
    output = true;
  }
  return output;
};

const canCreateProject = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  } else if (userData?.permissions.some(permission => permission.name === 'addProject')) {
    output = true;
  }
  return output;
};
// TODO(Biswa)
const canCreatePolls = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  } else if (userData?.permissions.includes('createPolls')) {
    output = true;
  }
  return output;
};

export {
  canCreateBroadcast,
  canEditProject,
  canReassignBroker,
  canCreateEvent,
  canDownloadReports,
  canAddMembers,
  canCreateProject,
  canCreatePolls,
  canAddCRMMembers,
  canAddMeeting,
  canDeleteMeeting
};
