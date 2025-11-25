import { useSelector } from 'react-redux';

const isSuperAdmin = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'SUPER_ADMIN') {
    output = true;
  }
  return output;
};

const isVipAdmin = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'VIP_ADMIN') {
    output = true;
  }
  return output;
};

const isAssociateAdmin = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ASSOCIATE_ADMIN') {
    output = true;
  }
  return output;
};
const isBuilder = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'ADMIN') {
    output = true;
  }
  return output;
};

const isCrmMember = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'CRM_MEMBER') {
    output = true;
  }
  return output;
};

const isTeamMember = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'TEAM_MEMBER') {
    output = true;
  }
  return output;
};

const isSaleshead = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'SALES_HEAD') {
    output = true;
  }
  return output;
};

const isProjectOnly = () => {
  let userData = useSelector((state) => state?.auth?.data);
  let output = false;
  if (userData?.roleName === 'PROJECT_ONLY') {
    output = true;
  }
  return output;
};

export { isSuperAdmin, isBuilder, isCrmMember, isTeamMember, isAssociateAdmin, isSaleshead, isProjectOnly, isVipAdmin };
