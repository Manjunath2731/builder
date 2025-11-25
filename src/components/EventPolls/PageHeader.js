import React from 'react';
import {
  Typography,
  Box,
  useTheme,
} from '@mui/material';

function PageHeader({ title}) {
   const theme =useTheme();
  return (
    <>
      <Box
        display="flex"
        alignItems={{ xs: 'stretch', md: 'center' }}
        flexDirection={{ xs: 'row', md: 'row' }}
       
      >
        <Box display="flex" alignItems="center">
          <Box>
            <Typography variant="h4"  
             sx={{fontSize: `${theme.typography.pxToRem(15)}`,
             mb: 3, mt: 2}}>
              {title}
            </Typography>
          </Box>
        </Box>
       
      </Box>
    </>
  );
}

export default PageHeader;
