import { Suspense, lazy } from 'react';
// import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );


  const VipDashboard = Loader(lazy(() => import('src/components/VipDashboard/VipDashboard')));
  const VipDashboards = [
  
      {
        path:"/",
        element:<VipDashboard/>
      }
      

      
  ]
  export default  VipDashboards