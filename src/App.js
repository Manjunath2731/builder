import { useRoutes } from 'react-router-dom';
import router from 'src/router';
import { SnackbarProvider } from 'notistack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useAuth from 'src/hooks/useAuth';
import { useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import AppInit from './components/AppInit';
import './assets/fonts/Helvetica Neue Medium Extended.ttf';
import './index.css';
import axiosAPIInstanceProject from './axiosInstances/axiosInstanceProject';

function App() {
  const content = useRoutes(router());
  const auth = useAuth();
  // const [logoutTimer, setLogoutTimer] = useState(null);
  useEffect(() => {
    const handleUnload = async () => {
      const currentTime = new Date().toISOString();
      const startTime = localStorage.getItem('startTime');
      try {
        await axiosAPIInstanceProject.put('/auth/sessionend', {
          startTime,
          endTime: currentTime
        });
      } catch (error) {
        console.error('Failed to send start and end time to backend API:', error);
      }
    };
    const currentTime = new Date().toISOString();
    localStorage.setItem('startTime', currentTime);
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  // useEffect(() => {
  //   // Function to reset the inactivity timer
  //   const resetInactivityTimer = () => {
  //     clearTimeout(logoutTimer);
  //     const timer = setTimeout(logoutUser,  60 * 60 * 1000); // 60 minutes
  //     setLogoutTimer(timer);
  //   };
  //   // Event listeners to detect user activity
  //   document.addEventListener('mousemove', resetInactivityTimer);
  //   document.addEventListener('keypress', resetInactivityTimer);
  //   // Cleanup when the component unmounts
  //   return () => {
  //     clearTimeout(logoutTimer);
  //     document.removeEventListener('mousemove', resetInactivityTimer);
  //     document.removeEventListener('keypress', resetInactivityTimer);
  //   };
  // }, [logoutTimer]);

  // const logoutUser = () => {
  //   auth.logout();
  //   console.log('Logging out due to inactivity...');
  // };

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider
          maxSnack={6}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <CssBaseline />
          {auth.isInitialized ? content : <AppInit />}
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;