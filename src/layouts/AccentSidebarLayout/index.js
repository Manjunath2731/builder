import { Box, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
// import ThemeSettings from 'src/components/ThemeSettings';

import Sidebar from './Sidebar';
import Header from './Header';


const AccentSidebarLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  // console.log(location.pathname);


  return (
    <>
      <Header />
    {location.pathname ==="/vip-dashboard" ? null : <Sidebar />}  
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          display: 'flex',
          pt: `${theme.header.height}`,
          [theme.breakpoints.up('lg')]: {
            pl: `${theme.sidebar.width}`
          },
          maxWidth:'100%',
          overflowX:'hidden'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {/* <div id='snackBar' sx={{  position: 'fixed',width:'100%', zIndex:999,}} /> */}
          <Box flexGrow={1}>
            <Outlet />
          </Box>
        </Box>
        {/* <ThemeSettings /> */}
      </Box>
    </>
  );
};

export default AccentSidebarLayout;
