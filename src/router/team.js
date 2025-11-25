import { Suspense, lazy } from 'react';
// import { Navigate } from 'react-router-dSom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Broadcast

const Team = Loader(lazy(() => import('src/content/team/team')));
const AddTeamMember = Loader(lazy(() => import('src/content/team/addTeamMember')));
const AddCRMMember = Loader(lazy(() => import('src/content/team/addCRMMembers')));
const teamRoutes = [
  {
    path: '/',
    element: <Team />
  },
  {
    path: '/:selectedTab',
    element: <Team />
  },
  {
    path: '/add-member/:selectedTab',
    element: <AddTeamMember />
  },
  {
    path: '/add-crm-member',
    element: <AddCRMMember />
  },
  {
    path: '/add-member/:selectedTab/:action/:userID',
    element: <AddTeamMember />
  },
  //   {
  //     path: 'broadcast',
  //     element: <Broadcast />
  //   }
];

export default teamRoutes;
