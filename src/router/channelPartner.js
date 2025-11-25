import { Suspense, lazy } from 'react';
// import { Navigate } from 'react-router-dSom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Channel Partner

const ChannelPartner = Loader(
  lazy(() => import('src/content/channel-partners/channelPartner'))
);
const AddNewBroker = Loader(
  lazy(() => import('src/content/channel-partners/AddNewBroker'))
);
const BrokerDetail = Loader(
  lazy(() => import('src/content/channel-partners/Details'))
);


const channelPartnerRoutes = [
  {
    path: '/',
    element: <ChannelPartner />
  },
    {
      path: '/add-broker',
      element: <AddNewBroker />
    },

    {
      path: '/broker-Detail/:brokerId/:companyId',
      element: <BrokerDetail />
    }
];

export default channelPartnerRoutes;
