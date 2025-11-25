import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';
import './snackbar.css';

const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);
export const ShowSnackBar = (message, variant) => {
  const Snackbar = () => {
    const { enqueueSnackbar } = useSnackbar();
    enqueueSnackbar(message, { variant, autoHideDuration: 1000 });
    return null;
  };
  ReactDOM.render(
    <SnackbarProvider
      sx={{
        width: { xs: 920, md: 800, lg: '1200px', xl: '1600px', xxl: '1600px' },
        // mt:7.6,width:"50%"
      }}
      maxSnack={3}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    >
      <Snackbar />
    </SnackbarProvider>,
    mountPoint
  );
};
