import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

  const Projects = Loader(lazy(() => import('src/components/Projects')));
 const ProjectBoardCast =Loader(lazy(() => import('src/components/Projects/ViewProjectDetails/ProjectBoardCast.js')));
//  const BookingInfo=Loader(lazy(() => import('src/components/Projects/ViewProjectDetails/BookingInfo.js')));
 const AddProject=Loader(lazy(() => import('src/components/Projects/AddProject/Index.js')));
 const PreLaunchBriefing = Loader(lazy(() => import('src/components/Projects/PreLaunchBriefing/index')));
 const Drafts = Loader(lazy(() => import('src/components/Projects/Drafts/index')));
//  pre_launch_briefing

  const ProjectBoard = [
    {
        path: '/',
        element: <Navigate to="published" replace />
      },
      {
        path: '/published',
        element: <Projects />
      },
      {
        path: '/pre_launch_briefing',
        element: <PreLaunchBriefing />
      },
      {
        path: '/drafts',
        element: <Drafts />
      },
      {
        path: '/Add_Project',
        element: <AddProject />
      },
      {
        path: '/Add_Project/:action/:formName',
        element: <AddProject />
      },
      {
        path: '/:selectedTab/:projectId',
        element: <ProjectBoardCast />
      },

      // {
      //   path: '/project_broadcasts/:projectId',
      //   element: <ProjectBoardCast />
      // },
      // {
      //   path: '/booking_info/:projectId',
      //   element: <BookingInfo />
      // },
  ]
  export default  ProjectBoard