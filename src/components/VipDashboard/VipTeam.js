import React, { useEffect } from 'react';
import { Card, Box, Typography, Divider, Avatar } from '@mui/material';
import { addDashboardClientData } from 'src/slices/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Loader from 'src/UI/Loader/Loader.js';
// import "./index.css";

const VipTeam = () => {
          const dispatch = useDispatch();

          const clientData = useSelector(
                    (state) => state.dashboard?.clientDashboardData
          );

          useEffect(async () => {
                    dispatch(addDashboardClientData());
          }, []);

          if (_.isEmpty(clientData)) {
                    return <Loader />;
          }

          return (

                    <Box sx={{ py: 2 }}>

                              <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>YOUR TEAM</Typography>
                              <Card sx={{ backgroundColor: 'white', mt: 1 }} >
                                        <Box style={{ display: 'flex', flexDirection: 'row', }} id="Box-channel">
                                                  <Box py={4}>
                                                            <Box >
                                                                      <Typography sx={{ fontSize: "13px", fontWeight: 700, textAlign: 'center', color: "#8769AA" }}> Today's Meetings</Typography>

                                                                      <Box px={6} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                                                                <Typography sx={{ fontSize: "22px", fontWeight: "bold", color: "#8769AA", mt: 3.5 }}> 3456</Typography>
                                                                                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0078E9", mt: 0.5 }}>View All</Typography>

                                                                      </Box>
                                                            </Box>
                                                  </Box>
                                                  <Divider orientation="vertical" flexItem />

                                                  <Box tyle={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} id="Yc-image-ml2" px={5}>
                                                            <Box sx={{ mt: 2 }} >
                                                                      <Typography variant="h6" style={{ fontSize: "12px", fontWeight: 600 }}>Most Active Team Member</Typography>
                                                            </Box>
                                                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: "50px" }} sx={{ mt: 1, }} id="team-image" py={2} >
                                                                      {[...Array(6)].map((_, index) => {
                                                                                return (
                                                                                          <>
                                                                                                    <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} id="Yc-image-mr2">
                                                                                                              <Box id="Yc-image-box"
                                                                                                                        sx={{
                                                                                                                                  display: 'flex',
                                                                                                                                  justifyContent: 'center',
                                                                                                                                  alignItems: 'center',
                                                                                                                                  width: 100,
                                                                                                                                  height: 100,
                                                                                                                                  borderRadius: '50%',
                                                                                                                                  backgroundColor: 'rgb(240, 240, 240)',

                                                                                                                        }}>
                                                                                                                        <Avatar id="Yc-image" alt={clientData?.topChannelPartner[index]?.first_name} src={clientData?.topChannelPartner[index]?.profileImage} sx={{ width: 80, height: 80 }} />
                                                                                                              </Box>
                                                                                                              <Typography sx={{ mt: 0.5, color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }}>{clientData.yourChannelPartner[index]?.first_name ? `${clientData?.yourChannelPartner[index]?.first_name} ${clientData?.yourChannelPartner[index]?.last_name}` : 'NA'}</Typography>
                                                                                                    </Box>
                                                                                          </>
                                                                                );
                                                                      })}
                                                            </Box>
                                                  </Box>
                                        </Box>
                              </Card>
                    </Box>
          );
};

export default VipTeam;
