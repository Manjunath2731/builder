import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../PageHeader';
import PreLaunchProject from './PreLaunchProjectList';

const PreLaunchBriefing = () => {
  return (
    <>
      <Box sx={{ml:4, py: 4, pl: { xs: 5, lg: 0 }, pr: { xs: 5, md: 7 } }}>
        <PageHeader />
      </Box>
      <PreLaunchProject />
    </>
  );
};
export default PreLaunchBriefing;
