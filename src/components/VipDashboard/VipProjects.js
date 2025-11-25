import React, { useEffect } from 'react';
import { Card, Box, Typography, Divider, CardMedia } from '@mui/material';
import { getYourProject } from 'src/slices/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import "./Vip.css";

const VipProjects = () => {
  const dispatch = useDispatch();
  const yourProject = useSelector((state) => state.dashboard.yourproject);

  useEffect(() => {
    dispatch(getYourProject());
  }, []);

  return (
    <Box sx={{ py: 2 }}>
      <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>PROJECTS</Typography>
      <Card sx={{ backgroundColor: 'white', mt: 1 }}>
        <Box style={{ display: 'flex', flexDirection: 'row' }}>
          <Box py={4}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, textAlign: 'center',  }}> Total Projects</Typography>
              <Box px={6} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Typography sx={{ fontSize: "22px", fontWeight: "bold",  mt: 3.5 }}> 3456</Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0078E9", mt: 0.5 }}>View All</Typography>
              </Box>
            </Box>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} px={5}>
            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: "50px" }} sx={{ mt: 1 }} py={2} id="VipProjects">
              {[...Array(5)].map((_, index) => (
                <Box key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography style={{ fontSize: "12px", fontWeight: 600 }}>Most Viewed Projects</Typography>
                  <CardMedia
                    component="img"
                    sx={{
                      width: 95,
                      height: 95,
                      objectFit: 'fill',
                      cursor: "pointer",
                      mt: 1.5
                    }}
                    id={`project-most-${index}`} // Use a unique ID for each CardMedia
                    alt="Company Logo"
                    src={yourProject?.mostviewproject?.logo}
                  />
                  <Typography style={{ fontSize: "12px", fontWeight: 600, color: "#C4C4C4" }} sx={{ mt: 1 }}>256 broker accessed</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default VipProjects;
