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

const Broadcast = Loader(lazy(() => import('src/content/broadcast/broadcast')));
const CreateBroadcast = Loader(
  lazy(() => import('src/content/broadcast/createBroadcast'))
);
const AddBroadcast = Loader(
  lazy(() => import('src/content/broadcast/addBroadcast'))
);
const broadcastRoutes = [
  {
    path: '/',
    element: <Broadcast />
  },
  {
    path: '/create-broadcast',
    element: <CreateBroadcast />
  },
  {
    path: '/add-broadcast',
    element: <AddBroadcast />
  },
  {
    path: '/add-broadcast/edit/:broadCastID',
    element: <AddBroadcast />
  },
];

export default broadcastRoutes;
