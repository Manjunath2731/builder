import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

  const News = Loader(lazy(() => import('src/components/More/news')));
  const CircleRate = Loader(lazy(() => import('src/components/More/CirleRates')));
  const GovtPolices = Loader(lazy(() => import('src/components/More/govtpolices')));
  const DeedDocumentWriters = Loader(lazy(() => import('src/components/More/DeedDocumentWriters')));
  const SampleDocumentsDeeds = Loader(lazy(() => import('src/components/More/SampleDocumentsDeeds')));
  const Maps = Loader(lazy(() => import('src/components/More/Maps')));
  const Banks = Loader(lazy(() => import('src/components/More/Banks')));



  const more = [
    {
        path: '/news',
        element: <News/>
      },
      {
        path: '/circlerate',
        element: <CircleRate/>
      },
      { 
        path: '/govtpolices',
        element: <GovtPolices/>
      },
      {
        path: '/sampleDocumentsDeeds',
        element: <SampleDocumentsDeeds/>
      },
      { 
        path: '/deedDocumentWriters',
        element: <DeedDocumentWriters />
      },
      { 
        path: '/maps',
        element: <Maps />
      },
      { 
        path: '/bank',
        element: <Banks />
      }
  ]

  export default more;