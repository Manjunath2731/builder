import React from 'react';
// import { Link } from 'react-router-dom';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Error401 = () => {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
        <Box sx={{ width: '40vw' }}>
          <Typography variant='h1' sx={{ mb: 2.5 }}>
            401
          </Typography>
          <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.5rem !important' }}>
            You are not authorized! <span role="img" aria-label="Locked">🔐</span>
          </Typography>
          <Typography variant='body2'>You don&prime;t have permission to access this page. Go Home!</Typography>
        </Box>
        <img
          alt='error-illustration'
          src='/static/images/pages/401.png'
          style={{
            marginTop: '3rem',
            marginBottom: '3rem',
            height: '450px', // Adjust the height as needed
            '@media (max-width: 1280px)': {
              height: '400px'
            },
            '@media (max-width: 960px)': {
              height: '350px'
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default Error401;
