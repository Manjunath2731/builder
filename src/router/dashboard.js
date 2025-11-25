import { Suspense, lazy } from 'react';
// import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );


  const Dashboard = Loader(lazy(() => import('src/components/Dashboard/index')));
  const Dashboards = [
    // {
    //     path: '/',
    //     element: <Navigate to="published" replace />
    //   },
      {
        path: '/',
        element: <Dashboard />
      },
      

      
  ]
  export default  Dashboards