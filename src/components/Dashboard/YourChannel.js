// import React, { useEffect } from 'react';
// import { Card, Box, Typography, Divider, Avatar } from '@mui/material';
// import { addDashboardClientData } from 'src/slices/dashboard';
// import { useDispatch, useSelector } from 'react-redux';
// import _ from 'lodash';
// import Loader from 'src/UI/Loader/Loader.js';
// import "./index.css";

// const YourChannel = () => {
//     const dispatch = useDispatch();

//     const lineStyleCha1 = {
//         width: 7,
//         height: 53,
//         backgroundColor: '#0078E9',
//         '&:hover': {
//             backgroundColor: '#0078E9',
//             opacity: [0.9, 0.8, 0.7],
//         },

//         marginTop: "30px",
//         borderRadius: "5px",
//         ml: 1
//     };

//     const lineStyleCha2 = {
//         width: 7,
//         height: 45,
//         backgroundColor: '#888888',
//         '&:hover': {
//             backgroundColor: '#888888',
//             opacity: [0.9, 0.8, 0.7],
//         },

//         marginTop: "23px",
//         borderRadius: "5px",
//         ml: 1
//     };

//     const clientData = useSelector(
//         (state) => state.dashboard?.clientDashboardData
//     );

//     useEffect(async () => {
//         dispatch(addDashboardClientData());
//     }, []);

//     if (_.isEmpty(clientData)) {
//         return <Loader />;
//     }

//     return (

//         <Box sx={{ py: 2 }}>

//             <Typography sx={{ fontWeight: 'bold',fontSize:"13px" }}>YOUR CHANNEL PARTNERS</Typography>
//             <Card sx={{ backgroundColor: '#EBEBEB', mt: 1 }} >
//                 <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }} id="Box-channel">
//                     <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} >
//                         <Box style={{ display: 'flex', flexDirection: 'row' }}>
//                             <Box sx={lineStyleCha1} id="line1" />
//                             <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} sx={{ ml: 1.3 }}>
//                                 <Box sx={{ mt: 3 }} style={{ color: "#51575C" }} id="cha1" >

//                                     <Typography variant="h6" style={{ fontSize: "12px" }}>Your</Typography>
//                                     <Typography variant="h6" style={{ fontSize: "12px", marginTop: "-5.5px" }}>Channel Partners</Typography>
//                                     <Box style={{ display: 'flex', flexDirection: 'row' }}>
//                                         <Typography variant="h6" style={{ fontSize: "25px", fontWeight: 'bold', marginTop: "-8.5px" }}>{clientData.yourChannelPartner.length}</Typography>
//                                         <Box style={{
//                                             backgroundColor: "white",
//                                             height: "16px",
//                                             width: "48px",
//                                             borderRadius: "8px",
//                                             marginLeft: "5px"
//                                         }}>
//                                             <Typography style={{ fontSize: "10px", textAlign: "center" }} >{` ${clientData.newCpCount.length} NEW`}</Typography>
//                                         </Box>
//                                     </Box>
//                                 </Box>
//                             </Box>
//                         </Box>
//                         <Box style={{ display: 'flex', flexDirection: 'row' }}>
//                             <Box sx={lineStyleCha2} id="line2" />
//                             <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} sx={{ ml: 1.3 }}>
//                                 <Box sx={{ mt: 2, mb: 2 }} style={{ color: "#51575C" }} id="chal2">
//                                     <Typography variant="h6" style={{ fontSize: "12px" }}>Total</Typography>
//                                     <Typography variant="h6" style={{ fontSize: "12px", marginTop: "-5.5px" }}>Channel Partners</Typography>
//                                     <Typography variant="h6" style={{ fontSize: "20px", fontWeight: 'bold', marginTop: "-5.5px" }}>{clientData.totalChannelPartner.length}</Typography>
//                                 </Box>
//                             </Box>
//                         </Box>
//                     </Box>
//                     <Divider orientation="vertical" flexItem />
//                     <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} id="Yc-image-ml1">
//                         <Box sx={{ mt: 2 }} >
//                             <Typography variant="h6" style={{ fontSize: "12px", fontWeight: 600 }}>Recently Added Channel Partners</Typography>
//                         </Box>
//                         <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',columnGap:"40px" }} sx={{ mt: 1 }}id="show-image" >
//                             {[...Array(3)].map((_, index) => {
//                                 return (
//                                     <>
//                                         <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}id="Yc-image-mr1" >
//                                             <Box  id="Yc-image-box"sx={{
//                                                 display: 'flex',
//                                                 justifyContent: 'center',
//                                                 alignItems: 'center',
//                                                 width: 100,
//                                                 height: 100,
//                                                 borderRadius: '50%',
//                                                 backgroundColor: 'rgb(240, 240, 240)',
//                                             }}>
//                                                 <Avatar  id="Yc-image"  alt={clientData?.yourChannelPartner[index]?.first_name} src={clientData?.yourChannelPartner[index]?.profileImage} sx={{ width: 80, height: 80 }} />
//                                             </Box>
//                                             <Typography sx={{ mt: 0.5, color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }}>{clientData.yourChannelPartner[index]?.first_name ? `${clientData?.yourChannelPartner[index]?.first_name} ${clientData?.yourChannelPartner[index]?.last_name}` : 'NA'}</Typography>
//                                         </Box>
//                                     </>
//                                 );
//                             })}
//                         </Box>
//                     </Box>
//                     <Divider orientation="vertical" flexItem />
//                     <Box tyle={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} id="Yc-image-ml2" >
//                         <Box sx={{ mt: 2 }} >
//                             <Typography variant="h6" style={{ fontSize: "12px", fontWeight: 600 }}>Most Active Channel Partners</Typography>
//                         </Box>
//                         <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',columnGap:"40px" }} sx={{ mt: 1, }}id="show-image1">
//                             {[...Array(3)].map((_, index) => {
//                                 return (
//                                     <>
//                                         <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}} id="Yc-image-mr2">
//                                             <Box id="Yc-image-box"
//                                             sx={{
//                                                 display: 'flex',
//                                                 justifyContent: 'center',
//                                                 alignItems: 'center',
//                                                 width: 100,
//                                                 height: 100,
//                                                 borderRadius: '50%',
//                                                 backgroundColor: 'rgb(240, 240, 240)',
                                                
//                                             }}>
//                                                 <Avatar  id="Yc-image" alt={clientData?.topChannelPartner[index]?.first_name} src={clientData?.topChannelPartner[index]?.profileImage} sx={{ width: 80, height: 80 }} />
//                                             </Box>
//                                             <Typography sx={{ mt: 0.5, color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }}>{clientData.yourChannelPartner[index]?.first_name ? `${clientData?.yourChannelPartner[index]?.first_name} ${clientData?.yourChannelPartner[index]?.last_name}` : 'NA'}</Typography>
//                                         </Box>
//                                     </>
//                                 );
//                             })}
//                         </Box>
//                     </Box>
//                 </Box>
//             </Card>
//         </Box>
//     );
// };

// export default YourChannel;


import React, { useEffect, useState } from 'react';
import { Card, Box, Typography, Divider, Avatar } from '@mui/material';
import { addDashboardClientData } from 'src/slices/dashboard';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import Loader from 'src/UI/Loader/Loader.js';
import "./index.css";

// HARDCODED CHANNEL PARTNER DATA
const HARDCODED_CLIENT_DATA = {
    yourChannelPartner: [
        {
            id: 1,
            first_name: 'John',
            last_name: 'Smith',
            email: 'john.smith@example.com',
            profileImage: '/static/images/person/User7.png',
            status: 'active',
            joinedDate: '2024-11-01'
        },
        {
            id: 2,
            first_name: 'Sarah',
            last_name: 'Johnson',
            email: 'sarah.johnson@example.com',
            profileImage: '/static/images/person/User8.png',
            status: 'active',
            joinedDate: '2024-11-10'
        },
        {
            id: 3,
            first_name: 'Michael',
            last_name: 'Williams',
            email: 'michael.williams@example.com',
            profileImage: '/static/images/person/User9.png',
            status: 'active',
            joinedDate: '2024-11-15'
        },
        {
            id: 4,
            first_name: 'Emily',
            last_name: 'Brown',
            email: 'emily.brown@example.com',
            profileImage: '/static/images/person/User11.png',
            status: 'active',
            joinedDate: '2024-10-20'
        },
        {
            id: 5,
            first_name: 'David',
            last_name: 'Davis',
            email: 'david.davis@example.com',
            profileImage: '/static/images/person/User12.png',
            status: 'active',
            joinedDate: '2024-10-05'
        }
    ],
    totalChannelPartner: [
        { id: 1, name: 'Partner 1' },
        { id: 2, name: 'Partner 2' },
        { id: 3, name: 'Partner 3' },
        { id: 4, name: 'Partner 4' },
        { id: 5, name: 'Partner 5' },
        { id: 6, name: 'Partner 6' },
        { id: 7, name: 'Partner 7' },
        { id: 8, name: 'Partner 8' },
        { id: 9, name: 'Partner 9' },
        { id: 10, name: 'Partner 10' },
        { id: 11, name: 'Partner 11' },
        { id: 12, name: 'Partner 12' }
    ],
    newCpCount: [
        { id: 1, name: 'New Partner 1' },
        { id: 2, name: 'New Partner 2' },
        { id: 3, name: 'New Partner 3' }
    ],
    topChannelPartner: [
        {
            id: 101,
            first_name: 'Robert',
            last_name: 'Martinez',
            email: 'robert.martinez@example.com',
          profileImage: '/static/images/person/User11.png',
            activity_score: 95,
            total_leads: 45
        },
        {
            id: 102,
            first_name: 'Jennifer',
            last_name: 'Garcia',
            email: 'jennifer.garcia@example.com',
           profileImage: '/static/images/person/User12.png',
            activity_score: 88,
            total_leads: 38
        },
        {
            id: 103,
            first_name: 'William',
            last_name: 'Rodriguez',
            email: 'william.rodriguez@example.com',
            profileImage: '/static/images/person/User10.png',
            activity_score: 82,
            total_leads: 32
        }
    ]
};

const YourChannel = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [clientData, setClientData] = useState({});

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

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Set hardcoded data
            setClientData(HARDCODED_CLIENT_DATA);

            // Optional: Still dispatch Redux action if needed
            try {
                dispatch(addDashboardClientData());
            } catch (error) {
                console.log('Redux action skipped or failed:', error);
            }

            setLoading(false);
        };

        initializeData();
    }, [dispatch]);

    if (loading || _.isEmpty(clientData)) {
        return <Loader />;
    }

    return (
        <Box sx={{ py: 2 }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>YOUR CHANNEL PARTNERS</Typography>
            <Card sx={{ backgroundColor: '#EBEBEB', mt: 1 }} >
                <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }} id="Box-channel">
                    <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} >
                        <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <Box sx={lineStyleCha1} id="line1" />
                            <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} sx={{ ml: 1.3 }}>
                                <Box sx={{ mt: 3 }} style={{ color: "#51575C" }} id="cha1" >
                                    <Typography variant="h6" style={{ fontSize: "12px" }}>Your</Typography>
                                    <Typography variant="h6" style={{ fontSize: "12px", marginTop: "-5.5px" }}>Channel Partners</Typography>
                                    <Box style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Typography variant="h6" style={{ fontSize: "25px", fontWeight: 'bold', marginTop: "-8.5px" }}>
                                            {clientData.yourChannelPartner.length}
                                        </Typography>
                                        <Box style={{
                                            backgroundColor: "white",
                                            height: "16px",
                                            width: "48px",
                                            borderRadius: "8px",
                                            marginLeft: "5px"
                                        }}>
                                            <Typography style={{ fontSize: "10px", textAlign: "center" }}>
                                                {` ${clientData.newCpCount.length} NEW`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <Box sx={lineStyleCha2} id="line2" />
                            <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} sx={{ ml: 1.3 }}>
                                <Box sx={{ mt: 2, mb: 2 }} style={{ color: "#51575C" }} id="chal2">
                                    <Typography variant="h6" style={{ fontSize: "12px" }}>Total</Typography>
                                    <Typography variant="h6" style={{ fontSize: "12px", marginTop: "-5.5px" }}>Channel Partners</Typography>
                                    <Typography variant="h6" style={{ fontSize: "20px", fontWeight: 'bold', marginTop: "-5.5px" }}>
                                        {clientData.totalChannelPartner.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} id="Yc-image-ml1">
                        <Box sx={{ mt: 2 }} >
                            <Typography variant="h6" style={{ fontSize: "12px", fontWeight: 600 }}>
                                Recently Added Channel Partners
                            </Typography>
                        </Box>
                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: "40px" }} sx={{ mt: 1 }} id="show-image" >
                            {[...Array(3)].map((_, index) => {
                                const partner = clientData?.yourChannelPartner[index];
                                if (!partner) return null;
                                
                                return (
                                    <Box key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} id="Yc-image-mr1" >
                                        <Box id="Yc-image-box" sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgb(240, 240, 240)',
                                        }}>
                                            <Avatar 
                                                id="Yc-image" 
                                                alt={partner?.first_name} 
                                                src={partner?.profileImage} 
                                                sx={{ width: 80, height: 80 }}
                                            >
                                                {partner?.first_name?.charAt(0)}{partner?.last_name?.charAt(0)}
                                            </Avatar>
                                        </Box>
                                        <Typography sx={{ mt: 0.5, color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }}>
                                            {partner?.first_name ? `${partner?.first_name} ${partner?.last_name}` : 'NA'}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }} id="Yc-image-ml2" >
                        <Box sx={{ mt: 2 }} >
                            <Typography variant="h6" style={{ fontSize: "12px", fontWeight: 600 }}>
                                Most Active Channel Partners
                            </Typography>
                        </Box>
                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: "40px" }} sx={{ mt: 1, }} id="show-image1">
                            {[...Array(3)].map((_, index) => {
                                const partner = clientData?.topChannelPartner[index];
                                if (!partner) return null;
                                
                                return (
                                    <Box key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} id="Yc-image-mr2">
                                        <Box id="Yc-image-box" sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgb(240, 240, 240)',
                                        }}>
                                            <Avatar 
                                                id="Yc-image" 
                                                alt={partner?.first_name} 
                                                src={partner?.profileImage} 
                                                sx={{ width: 80, height: 80 }}
                                            >
                                                {partner?.first_name?.charAt(0)}{partner?.last_name?.charAt(0)}
                                            </Avatar>
                                        </Box>
                                        <Typography sx={{ mt: 0.5, color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }}>
                                            {partner?.first_name ? `${partner?.first_name} ${partner?.last_name}` : 'NA'}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default YourChannel;