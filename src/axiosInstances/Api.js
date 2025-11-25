import axiosApiInstance from './AxiosApiInstance';
import axiosAPIInstanceProject from './axiosInstanceProject';
import axiosUpload from './AxiosUpload';

/** 
 *  @todo Wrap all the api call in promise and make the according changes
* */

export const CreateBuilderGroup = async (payload) => {
  let response;
  response = await axiosAPIInstanceProject.post('/groups/', payload);

  return response;
};
export const EditBuilderGroup = async (groupId, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosAPIInstanceProject.put(`groups/${groupId}`, payload);
      resolve(response)
    } catch (error) {
      reject(error);
    }
  })
};
export const createAssociate = async (value, roleId, profileUrl) => {
  const BUILDER = 'builder';
  let response;
  try {
    response = await axiosAPIInstanceProject.post('/auth/associate/register', {
      roleId,
      // groupId,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      profileImage: profileUrl,
      phoneNumber: value.phoneNumber,
      password: value.password,
      userType: BUILDER
    });
  } catch (error) {
    response = error;
  }
  return response;
};
export const EditAssociate = async (value, roleId, profileUrl, userId) => {
  const BUILDER = 'builder';
  let response;
  try {
    response = await axiosAPIInstanceProject.put(`/users/${userId}`, {
      roleId,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      profileImage: profileUrl,
      phoneNumber: value.phoneNumber,
      userType: BUILDER
    });
  } catch (error) {
    response = error;
  }
  return response;
};
export const deleteBuilder = async (id) => {
  const response = await axiosAPIInstanceProject.delete(`/groups/${id}`);
  return response.status;
};
export const createBuilder = async (value, groupId, roleId, profileUrl) => {
  const BUILDER = 'builder';
  let response;
  try {
    response = await axiosAPIInstanceProject.post('/auth/admin/register', {
      roleId,
      groupId,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      profileImage: profileUrl,
      phoneNumber: value.phoneNumber,
      password: value.password,
      designation: value.designation,
      userType: BUILDER
    });
  } catch (error) {
    response = error;
  }
  return response;
};
export const editBuilder = async (
  value,
  groupId,
  roleId,
  profileUrl,
  userId
) => {
  const BUILDER = 'builder';
  let response;
  try {
    response = await axiosAPIInstanceProject.put(`/users/${userId}`, {
      roleId,
      groupId,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      profileImage: profileUrl,
      phoneNumber: value.phoneNumber,
      designation: value.designation,
      userType: BUILDER
    });
  } catch (error) {
    response = error;
  }
  return response;
};

export const userSession = async () => {
  const response = await axiosAPIInstanceProject.get('/auth/activesession');
  return response.data;
}

export const createUser = async (value, groupId, roleId, profileUrl) => {
  const response = await axiosApiInstance.post('/auth/register', {
    roleId,
    groupId,
    firstName: value.firstName,
    lastName: value.lastName,
    email: value.email,
    profileImage: profileUrl,
    phoneNumber: value.phoneNumber,
    password: value.password,
    address: value.address,
    designation: value.designation
  });
  return response.status;
};

export const editUser = async (payload) => {
  let response;
  try {
    let { userId } = payload;
    const urll = `users/${userId}`;
    response = await axiosAPIInstanceProject.put(urll, payload);
    return response;
  } catch (error) {
    console.log(error);
    response = error?.response;
  }
  return response;
};

export const forgotPassword = async (email) => {
  const response = await axiosApiInstance.post('/resetPassword/resetLink', {
    email
  });
  return response.data;
};
export const sendNewPassword = async (email) => {
  const response = await axiosAPIInstanceProject.post(
    '/resetPassword/sendnewPassword',
    {
      email
    }
  );
  return response.data;
};

export const GetProjectsDetail = async (setProjects, setLoading) => {
  setLoading(true);
  try {
    const response = await axiosAPIInstanceProject.get('/project');
    setProjects(response.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
export const DeleteProject = async (id) => {
  const response = await axiosAPIInstanceProject.delete(`/project/${id}`);
  return response.status;
};

export const DeleteBroadcast = async (id) => {
  const response = await axiosAPIInstanceProject.delete(`/broadcasts/${id}`);
  return response;
};

export const updateBroadcast = async (broadCastId, payload) => {
  const response = await axiosAPIInstanceProject.put(`/broadcasts/${broadCastId}`, payload);
  return response;
};

export const createTeamMember = (value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosAPIInstanceProject.post('/teams/createTeamMember', value);
      resolve(response)
    } catch (error) {
      // console.log(error.response)
      reject(error);
    }
  })
};
export const editTeamMember = async (id, value) => {
  let response;
  try {
    response = await axiosAPIInstanceProject.put(`teams/editTeamMember/${id}`, value);
  } catch (error) {
    response = error?.response;
  }
  return response;
};

export const GetUploadFileUrl = async (payload, config) => {
  let UrlData;
  try {
    if (config) {
      const { data } = await axiosUpload.post('/upload', { files: payload }, config);
      UrlData = data.message;
    } else {
      const { data } = await axiosUpload.post('/upload', { files: payload });
      UrlData = data.message;
    }
  } catch (error) {
    console.log(error);
  }
  return UrlData;
};

export const getAPiBase64 = async (payload) => {
  let response;
  console.log("payloadpayloadpayloadpayload",payload)
  try {
    response = await axiosAPIInstanceProject.post('/auth/compress', { files: payload });
    console.log("datadatadatadatadatadatadatadata",response.data);
  } catch (error) {
    console.log(error);
  }
  return response.data.base64WithFileType;
};



export const CreateEvent = async (payload) => {
  let response;
  try {
    response = await axiosAPIInstanceProject.post('/events', payload);
  } catch (error) {
    console.log(error);
  }
  return response;
};
export const getEvent = async () => {
  let eventData;
  try {
    const { data } = await axiosAPIInstanceProject.get(
      '/events?skip=0&limit=1000'
    );
    eventData = data[0].data;
  } catch (error) {
    console.log(error);
  }
  return eventData;
};
export const getUpcomingEvent = async () => {
  let eventData;
  try {
    const { data } = await axiosAPIInstanceProject.get(
      '/events/upcomingEvents'
    );
    eventData = data?.data;
  } catch (error) {
    console.log(error);
  }
  return eventData;
};
export const getPastEvent = async () => {
  let eventData;
  try {
    const { data } = await axiosAPIInstanceProject.get('/events/pastEvents');
    eventData = data?.data;
  } catch (error) {
    console.log(error);
  }
  return eventData;
};
export const getEventById = async (eventId) => {
  let eventData;
  try {
    const { data } = await axiosAPIInstanceProject.get(`/events/${eventId}`);
    eventData = data;
  } catch (error) {
    console.log(error);
  }
  return eventData;
};
export const getEventCategory = async () => {
  let eventCategory;
  try {
    const { data } = await axiosAPIInstanceProject.get(`/events/eventCategory`);
    eventCategory = data;
  } catch (error) {
    console.log(error);
  }
  return eventCategory;
};

export const getAllBrokers = async () => {
  let BrokerArray;
  try {
    const { data } = await axiosApiInstance.get(
      `/users/totalUsers?userType=broker`
    );
    BrokerArray = data.data;
  } catch (error) {
    console.log(error);
  }
  return BrokerArray;
};
export const InviteBroker = async (eventId, payload) => {
  let response;
  try {
    response = await axiosAPIInstanceProject.post(
      `/events/inviteBroker/${eventId}`,
      payload
    );
  } catch (error) {
    console.log(error);
  }
  return response;
};

export const createMeeting = async (payload) => {
  const response = await axiosAPIInstanceProject.post(
    '/meetings/create',
    payload
  );
  return response.status;
};

export const createBroadcast = async (payload) => {
  try {
    const response = await axiosAPIInstanceProject.post('/broadcasts', payload);
    return response.status;
  } catch (error) {
    return error;
  }
};
export const deleteFromS3 = async (keyPath) => {
  const bodyParams = { keyPath };
  let message;
  try {
    const { data } = await axiosUpload.delete('/upload/deleteFromS3', {
      data: bodyParams
    });
    message = data.message;
  } catch (error) {
    console.log(error);
  }
  return message;
};

export const feedAction = async (actionType, payload) => {
  await axiosAPIInstanceProject.post(
    `/media/counter?action=${actionType}`,
    payload
  );
};
export const DeleteFeedAction = async (referenceId) => {
  await axiosAPIInstanceProject.delete(
    `/media/remove?action=like&referenceId=${referenceId}`
  );
};
export const editMeetings = async (id, payload) => {
  const response = await axiosAPIInstanceProject.put(
    `/meetings/changeSchedule/${id}`,
    payload
  );
  return response.status;
};

export const meetCardStatusChange = async (id, payload) => {
  let response;
  try {
    response = await axiosAPIInstanceProject.put(
      `clientVisits/${id}/status`,
      payload
    );
  } catch (error) {
    console.log(error);
  }

  return response;
};
export const regAndBookingCardStatusChange = async (clientId, type, status) => {
  let response;
  try {
    response = await axiosAPIInstanceProject.put(
      `booking/statusPending?clientId=${clientId}&type=${type}&status=${status}`
    );
  } catch (error) {
    console.log(error);
  }

  return response;
};
export const resendInvite = async (payload) => {
  const response = await axiosAPIInstanceProject.post(`broker/resendInvite`, payload);
  return response;
};

export const createNews = async (payload) => {
  try {
    const response = await axiosAPIInstanceProject.post(`center/news`, payload);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export const createCircleRate = async (payload) => {
  try {
    const response = await axiosAPIInstanceProject.post(`center/circlerate`, payload);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export const createGovtPolices = async (payload) => {
  try {
    const response = await axiosAPIInstanceProject.post(`center/govtpolices`, payload);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export const createSampleDocs = async (payload) => {
  try {
    const response = await axiosAPIInstanceProject.post(`center/sampledocs`, payload);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export const createMaps = async (payload) => {
  try {
    const response = await axiosAPIInstanceProject.post(`center/maps`, payload);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export const createDeedWriter = async (payload) => {
  try {
    const response = await axiosAPIInstanceProject.post(`center/deedwriter`, payload);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export const createBankDsas = async (payload) => {
  try {
    const response = await axiosAPIInstanceProject.post(`center/bankdsas`, payload);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export const sendBrokerInvite = async (payload) => {
  try {
    return await axiosAPIInstanceProject.post(`broker/sendBrokerInvite`, payload);
  } catch (error) {
    throw new Error(error.message)
  }
};

export const getReferralCode = async () => {
  try {
    return await axiosAPIInstanceProject.get(`broker/referral`);
  } catch (error) {
    throw new Error(error.message)
  }
};

export const DeleteMeetings = async (meetingId) => {
  const response = await axiosAPIInstanceProject.delete(`/meetings/cancelMeeting/${meetingId}`);
  return response.status;
};

// export const deleteMeetings = async (id) => {
//   const response = await axiosAPIInstanceProject.delete(
//     `/meetings/cancelMeeting/${id}`,
//   );
//   return response.status;
// };


export const ResetPasswordAPI = async (payload) => {
  const response = await axiosApiInstance.post(`resetPassword`, payload);
  return response.status;
};
export const ResetPasswordAPIWithoutToken = async (payload) => {
  const response = await axiosAPIInstanceProject.post(
    `resetPassword/forgetPassword`,
    payload
  );
  return response.status;
};
export const GetBroadCastByProjectId = async (id, setBroadCast, setLoading) => {
  setLoading(true);
  let response;
  try {
    response = await axiosAPIInstanceProject.get(`broadcasts/project/${id}`);
    if (response?.data !== undefined && response?.data !== null) {
      setBroadCast(response?.data);
    }
  } catch (error) {
    response = error;
    setLoading(false);
  } finally {
    setLoading(false);
  }
  return response;
};

export const assignRMToProject = async (payload, projectId) => {
  let response;
  try {
    response = await axiosAPIInstanceProject.put(
      `/project/assign/relationManager/${projectId}`,
      payload
    );
  } catch (error) {
    console.log(error);
  }
  return response;
};
export const assignCRMToProject = async (payload, projectId) => {
  let response;
  try {
    response = await axiosAPIInstanceProject.put(
      `/project/assign/crmManager/${projectId}`,
      payload
    );
  } catch (error) {
    response = error;
  }
  return response;
};
export const isUserActive = async (payload) => {
  let response;
  try {
    response = await axiosApiInstance.put(`/users/deactivateUser`, payload);
  } catch (error) {
    console.log(error);
  }
  return response;
};

export const projectByRM = async (userId) => {
  let response;
  try {
    response = await axiosAPIInstanceProject.get(
      `/project/getProjectByRelationManager/${userId}`
    );
  } catch (error) {
    console.log(error);
  }
  return response;
};
export const projectByCRM = async (userId) => {
  let response;
  try {
    response = await axiosAPIInstanceProject.get(
      `/project/getProjectByCRMManager/${userId}`
    );
  } catch (error) {
    console.log(error);
  }
  return response;
};

export const sharePDF = async (broadcastId) => {
  let response;
  try {
    response = await axiosAPIInstanceProject.get(
      `/broadcasts/${broadcastId}/export`
    );
  } catch (error) {
    response = error;
  }
  return response;
};

export const checkUserExists = async (value) => {
  const BUILDER = 'builder';
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosApiInstance.post(
        '/auth/check-duplicate-user',
        {
          ...value,
          userType: BUILDER
        }
      );
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const createBuilderandUser = async (value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosAPIInstanceProject.post(
        '/auth/admin/register',
        value
      );
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};