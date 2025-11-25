// import Authenticated from 'src/components/Authenticated';
// import { Navigate } from 'react-router-dom';

// import EditUser from 'src/content/EditBuilder/index';
// // import TermsCondtions from 'src/content/pages/Auth/TermsConditions/TermsCondtions';


// // import BoxedSidebarLayout from 'src/layouts/BoxedSidebarLayout';
// // import DocsLayout from 'src/layouts/DocsLayout';
// // import BaseLayout from 'src/layouts/BaseLayout';
// // import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';
// import AccentSidebarLayout from 'src/layouts/AccentSidebarLayout';
// // import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
// // import CollapsedSidebarLayout from 'src/layouts/CollapsedSidebarLayout';
// // import BottomNavigationLayout from 'src/layouts/BottomNavigationLayout';
// // import TopNavigationLayout from 'src/layouts/TopNavigationLayout';
// // import { isSuperAdmin } from 'src/helpers/userHelpers';
// import {
//   isSuperAdmin,
//   isCrmMember,
//   isAssociateAdmin,
//   isProjectOnly,
//   isVipAdmin,
//   isBuilder,
//   isTeamMember
// } from 'src/helpers/userHelpers';
// import Error401 from 'src/components/401';
// import accountRoutes from './account';
// import broadcastRoutes from './broadcast';
// import meetingRoutes from './meeting';
// import ProjectBoard from './projectBoard';
// import EventPolls from './EventPolls';
// import Dashboards from './dashboard';
// import VipDashboards from './vipDashboard';
// // import dashboardsRoutes from './dashboards';
// import blocksRoutes from './blocks';
// import managementRoutes from './management';
// import CreateBuilder from '../content/create-user/createBuilder';
// import EditAssociate from '../content/create-user/EditAssociate';
// import CreateAssociate from '../content/create-user/CreateAssociate';
// import EditBuilder from '../content/create-user/EditBuilder';
// import BuilderDashboardReports from '../content/create-user/builderDashboard';
// import CreateUser from '../content/create-user/createUser';
// import teamRoutes from './team';
// import channelPartnerRoutes from './channelPartner';
// import more from './more';

// const router = () => {
//   let superaAdmin = isSuperAdmin();
//   let associate = isAssociateAdmin();
//   let crmMember = isCrmMember();
//   let projectOnly = isProjectOnly();
//   let vipAdmin = isVipAdmin();
//   let admin = isBuilder();
//   let teamMember = isTeamMember();

//   let routeName =
//     superaAdmin || associate
//       ? 'builder-dashboard'
//       : crmMember
//         ? 'team/crm'
//         : projectOnly ? 'projects/published' : vipAdmin ? 'vip-dashboard' : 'dashboards';
//   let finalRoute = [
//     {
//       path: 'account',
//       children: accountRoutes
//     },


//     {
//       path: '*',
//       element: (
//         <Authenticated>
//           <AccentSidebarLayout />
//         </Authenticated>
//       ),
//       children: [
//         {
//           path: '/',
//           element: <Navigate to={routeName} replace />
//         },
//         (admin || teamMember) && {
//           path: 'dashboards',
//           children: Dashboards
//         },
//         {
//           path: 'blocks',
//           children: blocksRoutes
//         },
//         {
//           path: 'management',
//           children: managementRoutes
//         },
//         (admin || teamMember) && {
//           path: 'broadcast',
//           children: broadcastRoutes
//         },
//         vipAdmin && {
//           path: 'vip-dashboard',
//           children: VipDashboards
//         },
//         !vipAdmin && {
//           path: 'vip-dashboard',
//           element: <Error401 />
//         },
//         {
//           path: 'team',
//           children: teamRoutes
//         },
//         {
//           path: 'events_polls',
//           children: EventPolls
//         },
//         (superaAdmin || associate) && {
//           path: 'builder-dashboard/',
//           element: <BuilderDashboardReports />
//         },
//         (superaAdmin || associate) && {
//           path: 'builder-dashboard/:tabName',
//           element: <BuilderDashboardReports />
//         },
//         (superaAdmin || associate) && {
//           path: 'create-builder',
//           element: <CreateBuilder />
//         },
//         (superaAdmin) && {
//           path: 'create-associate',
//           element: <CreateAssociate />
//         },
//         (superaAdmin) && {
//           path: 'edit-associate/:AssociateId',
//           element: <EditAssociate />
//         },
//         (superaAdmin || associate) && {
//           path: 'Edit-builder/:BuilderId',
//           element: <EditBuilder />
//         },
//         ((!superaAdmin || !associate) || (crmMember || projectOnly || vipAdmin)) && {
//           path: '*',
//           element: <Error401 />
//         },
//         {
//           path: 'edit-profile',
//           element: <EditUser />
//         },
//         {
//           path: 'create-user',
//           element: <CreateUser />
//         },
//         (admin || teamMember || projectOnly) && {
//           path: 'projects',
//           children: ProjectBoard
//         },
//         (admin || teamMember) && {
//           path: 'meeting',
//           children: meetingRoutes
//         },
//         (admin || teamMember) && {
//           path: 'channel_partners',
//           children: channelPartnerRoutes
//         },
//         ((!admin || !teamMember) || (crmMember || superaAdmin || associate || projectOnly || vipAdmin)) && {
//           path: '*',
//           element: <Error401 />
//         },
//         {
//           path: 'more',
//           children: more
//         },
//         // crmMember && {
//         //   path: 'team/crm',
//         //   element: <r/>
//         // },
//         crmMember && {
//           path: ['dashboards','broadcast', 'projects', 'meeting', 'vip-dashboard'],
//           element: <Error401 />
//         }
//         // {
//         //   path: 'terms-conditions',
//         //   element: <TermsCondtions/>
//         // },

//       ]
//     }
//   ];
//   return finalRoute;
// };

// export default router;

import Authenticated from 'src/components/Authenticated';
import { Navigate } from 'react-router-dom';

import EditUser from 'src/content/EditBuilder/index';
import AccentSidebarLayout from 'src/layouts/AccentSidebarLayout';
import {
  isSuperAdmin,
  isCrmMember,
  isAssociateAdmin,
  isProjectOnly,
  isVipAdmin,
  isBuilder,
  isTeamMember
} from 'src/helpers/userHelpers';
import Error401 from 'src/components/401';
import accountRoutes from './account';
import broadcastRoutes from './broadcast';
import meetingRoutes from './meeting';
import ProjectBoard from './projectBoard';
import EventPolls from './EventPolls';
import Dashboards from './dashboard';
import VipDashboards from './vipDashboard';
import blocksRoutes from './blocks';
import managementRoutes from './management';
import CreateBuilder from '../content/create-user/createBuilder';
import EditAssociate from '../content/create-user/EditAssociate';
import CreateAssociate from '../content/create-user/CreateAssociate';
import EditBuilder from '../content/create-user/EditBuilder';
import BuilderDashboardReports from '../content/create-user/builderDashboard';
import CreateUser from '../content/create-user/createUser';
import teamRoutes from './team';
import channelPartnerRoutes from './channelPartner';
import more from './more';

const router = () => {
  // Get user data from localStorage for hardcoded auth
  const userDataString = localStorage.getItem('user');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userInfo = userData?.user || userData;
  const userRole = userInfo?.roleName || userInfo?.role || 'admin';

  // For hardcoded auth, we'll set default role checks
  // You can modify these based on what role you want to test
  let superaAdmin = isSuperAdmin() || userRole === 'SUPER_ADMIN';
  let associate = isAssociateAdmin() || userRole === 'ASSOCIATE_ADMIN';
  let crmMember = isCrmMember() || userRole === 'CRM_MEMBER';
  let projectOnly = isProjectOnly() || userRole === 'PROJECT_ONLY';
  let vipAdmin = isVipAdmin() || userRole === 'VIP_ADMIN';
  let admin = isBuilder() || userRole === 'admin' || userRole === 'BUILDER';
  let teamMember = isTeamMember() || userRole === 'TEAM_MEMBER';

  // HARDCODED: For testing, let's make admin role have access to everything
  // Remove these lines when you want strict role checking
  if (userRole === 'admin') {
    admin = true;
    teamMember = true;
  }

  let routeName =
    superaAdmin || associate
      ? 'builder-dashboard'
      : crmMember
        ? 'team/crm'
        : projectOnly ? 'projects/published' : vipAdmin ? 'vip-dashboard' : 'dashboards';
  
  let finalRoute = [
    {
      path: 'account',
      children: accountRoutes
    },

    {
      path: '*',
      element: (
        <Authenticated>
          <AccentSidebarLayout />
        </Authenticated>
      ),
      children: [
        {
          path: '/',
          element: <Navigate to={routeName} replace />
        },
        (admin || teamMember) && {
          path: 'dashboards',
          children: Dashboards
        },
        {
          path: 'blocks',
          children: blocksRoutes
        },
        {
          path: 'management',
          children: managementRoutes
        },
        (admin || teamMember) && {
          path: 'broadcast',
          children: broadcastRoutes
        },
        vipAdmin && {
          path: 'vip-dashboard',
          children: VipDashboards
        },
        !vipAdmin && {
          path: 'vip-dashboard',
          element: <Error401 />
        },
        {
          path: 'team',
          children: teamRoutes
        },
        {
          path: 'events_polls',
          children: EventPolls
        },
        (superaAdmin || associate) && {
          path: 'builder-dashboard/',
          element: <BuilderDashboardReports />
        },
        (superaAdmin || associate) && {
          path: 'builder-dashboard/:tabName',
          element: <BuilderDashboardReports />
        },
        (superaAdmin || associate) && {
          path: 'create-builder',
          element: <CreateBuilder />
        },
        (superaAdmin) && {
          path: 'create-associate',
          element: <CreateAssociate />
        },
        (superaAdmin) && {
          path: 'edit-associate/:AssociateId',
          element: <EditAssociate />
        },
        (superaAdmin || associate) && {
          path: 'Edit-builder/:BuilderId',
          element: <EditBuilder />
        },
        {
          path: 'edit-profile',
          element: <EditUser />
        },
        {
          path: 'create-user',
          element: <CreateUser />
        },
        (admin || teamMember || projectOnly) && {
          path: 'projects',
          children: ProjectBoard
        },
        (admin || teamMember) && {
          path: 'meeting',
          children: meetingRoutes
        },
        (admin || teamMember) && {
          path: 'channel_partners',
          children: channelPartnerRoutes
        },
        {
          path: 'more',
          children: more
        },
        crmMember && {
          path: ['dashboards','broadcast', 'projects', 'meeting', 'vip-dashboard'],
          element: <Error401 />
        }
      ].filter(Boolean) // Remove false/undefined entries
    }
  ];
  return finalRoute;
};

export default router;
