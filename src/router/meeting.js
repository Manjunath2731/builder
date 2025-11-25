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

const Meeting = Loader(
  lazy(() => import('src/content/meetings-n-visits/meetingDashboard'))
);
// const CreateBroadcast = Loader(
//   lazy(() => import('src/content/broadcast/createBroadcast'))
// );
// const AddBroadcast = Loader(
//   lazy(() => import('src/content/broadcast/addBroadcast'))
// );
const meetingRoutes = [
  {
    path: '/',
    element: <Meeting />
  }
];

export default meetingRoutes;
