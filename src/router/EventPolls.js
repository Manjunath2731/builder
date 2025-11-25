import { Suspense, lazy } from 'react';
// import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

  const EventsPolls = Loader(lazy(() => import('src/components/EventPolls/index')));
  const AddEvent = Loader(lazy(() => import('src/components/EventPolls/AddEvent')));
  const EventDetails = Loader(lazy(() => import('src/components/EventPolls/EventDetails')));
  const EventInvite = Loader(lazy(() => import('src/components/EventPolls/InviteScreen')));
  const EventPolls = [
    // {
    //     path: '/',
    //     element: <Navigate to="published" replace />
    //   },
      {
        path: '/',
        element: <EventsPolls />
      },
      {
        path: '/Add_Event',
        element: <AddEvent />
      },
      {
        path: '/Event_Details/:eventId',
        element: <EventDetails />
      },
      {
        path: '/Event_Invite',
        element: <EventInvite />
      }

      
  ]
  export default  EventPolls