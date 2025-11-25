import React from 'react';
import { Card, Box, Typography, Divider, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import "./YourProject.css";

const YourChannelProject = () => {

    const lineStyleCha1 = {
        width: 7,
        height: 53,
        backgroundColor: '#0078E9',
        '&:hover': {
            backgroundColor: '#0078E9',
            opacity: [0.9, 0.8, 0.7],
        },

        marginTop: "30px",
        borderRadius: "5px",
        ml: 1
    };

    const lineStyleCha2 = {
        width: 7,
        height: 45,
        backgroundColor: '#888888',
        '&:hover': {
            backgroundColor: '#888888',
            opacity: [0.9, 0.8, 0.7],
        },

        marginTop: "23px",
        borderRadius: "5px",
        ml: 1
    };

    const clientData = useSelector((state) => state.projectList.projectcp);

    return (

        <Box sx={{ py: 2 }}>

            <Typography sx={{ fontWeight: 'bold',fontSize:"13px" }}>CHANNEL PARTNERS IN THIS PROJECT</Typography>
            <Card sx={{ backgroundColor: '#EBEBEB', mt: 1 }} >
                <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }} id="Box-channel">
                    <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' ,}} sx={{ml:-2}}>
                        <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <Box sx={lineStyleCha1} id="line1" />
                            <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} sx={{ ml: 1.3 }}>
                                <Box sx={{ mt: 3 }} style={{ color: "#51575C" }} id="cha1" >

                                    <Typography variant="h6" style={{ fontSize: "12px" }}>Your</Typography>
                                    <Typography variant="h6" style={{ fontSize: "12px", marginTop: "-5.5px" }}>Channel Partners</Typography>
                                    <Box style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Typography variant="h6" style={{ fontSize: "25px", fontWeight: 'bold', marginTop: "-8.5px" }}>{clientData?.yourChannelPartner?.length}</Typography>
                                        <Box style={{
                                            backgroundColor: "white",
                                            height: "16px",
                                            width: "48px",
                                            borderRadius: "8px",
                                            marginLeft: "5px"
                                        }}>
                                            <Typography style={{ fontSize: "10px", textAlign: "center" }} >{` ${clientData?.newCpCount?.length} NEW`}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box style={{ display: 'flex', flexDirection: 'row', }}>
                            <Box sx={lineStyleCha2} id="line2" />
                            <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} sx={{ ml: 1.3 }}>
                                <Box sx={{ mt: 2, mb: 2 }} style={{ color: "#51575C" }} id="chal2">
                                    <Typography variant="h6" style={{ fontSize: "12px" }}>Total</Typography>
                                    <Typography variant="h6" style={{ fontSize: "12px", marginTop: "-5.5px" }}>Channel Partners</Typography>
                                    <Typography variant="h6" style={{ fontSize: "20px", fontWeight: 'bold', marginTop: "-5.5px" }}>{clientData?.totalChannelPartner?.length}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column',}}  id="Yc-image-ml1">
                        <Box sx={{ mt: 2 }} >
                            <Typography variant="h6" style={{ fontSize: "12px", fontWeight: 600 }}>Recently Added Channel Partners</Typography>
                        </Box>
                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',columnGap:"45px"  }} sx={{ mt: 1 }} id="your-image">
                            {[...Array(3)].map((_, index) => {
                                return (
                                    <>
                                        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}id="Yc-image-mr1" >
                                            <Box  id="Yc-image-box"sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 100,
                                                height: 100,
                                                borderRadius: '50%',
                                                backgroundColor: 'rgb(240, 240, 240)',
                                            }}>
                                                <Avatar  id="Yc-image"  alt={clientData?.yourChannelPartner?.[index]?.first_name} src={clientData?.yourChannelPartner?.[index]?.profileImage} sx={{ width: 80, height: 80 }} />
                                            </Box>
                                            <Typography sx={{ mt: 0.5, color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }}>{clientData.yourChannelPartner?.[index]?.first_name ? `${clientData?.yourChannelPartner?.[index]?.first_name} ${clientData?.yourChannelPartner[index]?.last_name}` : 'NA'}</Typography>
                                        </Box>
                                    </>
                                );
                            })}
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box tyle={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }}  id="Yc-image-ml2" >
                        <Box sx={{ mt: 2 }} >
                            <Typography variant="h6" style={{ fontSize: "12px", fontWeight: 600 }}>Most Active Channel Partners</Typography>
                        </Box>
                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',columnGap:"45px"  }} sx={{ mt: 1 }} id="your-image1">
                            {[...Array(3)].map((_, index) => {
                                return (
                                    <>
                                        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}} id="Yc-image-mr2">
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
                                                <Avatar  id="Yc-image" alt={clientData?.topChannelPartner?.[index]?.first_name} src={clientData?.topChannelPartner?.[index]?.profileImage} sx={{ width: 80, height: 80 }} />
                                            </Box>
                                            <Typography sx={{ mt: 0.5, color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }}>{clientData.yourChannelPartner?.[index]?.first_name ? `${clientData?.yourChannelPartner?.[index]?.first_name} ${clientData?.yourChannelPartner[index]?.last_name}` : 'NA'}</Typography>
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

export default YourChannelProject;
