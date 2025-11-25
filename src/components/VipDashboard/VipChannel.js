import React, { useEffect } from 'react';
import { Card, Box, Typography, Divider, Avatar } from '@mui/material';
import { addDashboardClientData } from 'src/slices/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Loader from 'src/UI/Loader/Loader.js';
import "./Vip.css";

const VipChannel = () => {
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

                              <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>CHANNEL PARTNERS</Typography>
                              <Card sx={{ backgroundColor: '#EBEBEB', mt: 1 }} >
                                        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }} id="Box-channel">
                                                  <Box py={7} id="VipChannel">
                                                            <Box style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                                                      <Typography sx={{ fontSize: "13px" }}> Total</Typography>
                                                                      <Typography sx={{ fontSize: "22px", fontWeight: "bold" }}> 3456</Typography>
                                                                      <Typography sx={{
                                                                                backgroundColor: "white", fontSize: "11px", width: "auto",
                                                                                height: "auto",
                                                                                borderRadius: "15px",
textAlign:"center",
                                                                                paddingRight: "12px",
                                                                                paddingLeft: "12px"
                                                                      }}>23 NEW</Typography>
                                                            </Box>


                                                  </Box>
                                                  <Divider orientation="vertical" flexItem />
                                                  <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} id="Yc-image-ml1" >
                                                            <Box sx={{ mt: 2 }} >
                                                                      <Typography variant="h6" style={{ fontSize: "12px", fontWeight: 600 }}>Recently Added Channel Partners</Typography>
                                                            </Box>
                                                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: "40px" }} sx={{ mt: 1 }} id="show-image" py={2} >
                                                                      {[...Array(3)].map((_, index) => {
                                                                                return (
                                                                                          <>
                                                                                                    <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} id="Yc-image-mr1" >
                                                                                                              <Box id="Yc-image-box" sx={{
                                                                                                                        display: 'flex',
                                                                                                                        justifyContent: 'center',
                                                                                                                        alignItems: 'center',
                                                                                                                        width: 100,
                                                                                                                        height: 100,
                                                                                                                        borderRadius: '50%',
                                                                                                                        backgroundColor: 'rgb(240, 240, 240)',
                                                                                                              }}>
                                                                                                                        <Avatar id="Yc-image" alt={clientData?.yourChannelPartner[index]?.first_name} src={clientData?.yourChannelPartner[index]?.profileImage} sx={{ width: 80, height: 80 }} />
                                                                                                              </Box>
                                                                                                              <Typography sx={{ mt: 0.5, color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }}>{clientData.yourChannelPartner[index]?.first_name ? `${clientData?.yourChannelPartner[index]?.first_name} ${clientData?.yourChannelPartner[index]?.last_name}` : 'NA'}</Typography>
                                                                                                    </Box>
                                                                                          </>
                                                                                );
                                                                      })}
                                                            </Box>
                                                  </Box>
                                                  <Divider orientation="vertical" flexItem />
                                                  <Box tyle={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} id="Yc-image-ml2" >
                                                            <Box sx={{ mt: 2 }} >
                                                                      <Typography variant="h6" style={{ fontSize: "12px", fontWeight: 600 }}>Most Active Channel Partners</Typography>
                                                            </Box>
                                                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: "40px" }} sx={{ mt: 1, }} id="show-image1"  py={2}>
                                                                      {[...Array(3)].map((_, index) => {
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

export default VipChannel;
