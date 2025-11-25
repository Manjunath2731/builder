// import React, {
//   useEffect,
//   //  useRef, 
//   // useState
// } from 'react';
// // import moment from 'moment';
// import { useDispatch, useSelector } from 'react-redux';
// // import { DateRange } from 'react-date-range';
// // import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import { useNavigate } from 'react-router-dom';
// import {
//   Typography,
//   Box,
//   Divider,
//   Grid,
//   Card,
//   styled,
//   // Button,
//   Avatar,
//   IconButton,
//   // CardMedia,
//   useTheme
// } from '@mui/material';
// import Chart from 'react-apexcharts';
// import { Helmet } from 'react-helmet-async';
// // import {
// //   CircularProgressbarWithChildren,
// //   buildStyles
// // } from 'react-circular-progressbar';
// import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
// import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone';
// import SwiperCore, { Navigation, Pagination } from 'swiper/core';
// import { Swiper, SwiperSlide } from 'swiper/react';
// // import { compareAsc, subDays } from 'date-fns';
// import 'swiper/swiper.min.css';
// import 'swiper/components/navigation/navigation.min.css';
// import 'swiper/components/pagination/pagination.min.css';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// // import { toUpperMutliple } from 'src/utils/utilits.js';
// import _ from 'lodash';
// import Loader from 'src/UI/Loader/Loader.js';
// // import MeetingCardSwiper from './meetingCardSwiper.js';
// import {
//   addMeetingCard,
//   addProjects,
//   getbookingCard,
//   getregistrationCard
// } from '../../slices/meetings';
// import {
//   addClientVisits,
//   addDashboardClientData,
//   addDashboardBroadcast,
//   clientVisitByMonth
// } from '../../slices/dashboard';
// import {
//   // getCompanyDetailById,
//   // getBrokerClientDetailsById
// } from '../../slices/channelPartner.js';

// import { getProjectList } from '../../slices/ProjectList';
// import { getTeams } from '../../slices/team';

// import {
//   // getEvent, 
//   projectByRM
// } from '../../axiosInstances/Api';
// // import ChartDesign from '../../components/Projects/ViewProjectDetails/Blocks/ChartDesign';
// // import { getTimeArray } from '../../utils/utilits';
// // import RegAndBookingCardSwipper from './regAndBookingCardSwipper';
// import NotificationDrawer from '../../components/Projects/ViewProjectDetails/Blocks/NotificationDrawer';
// import "./index.css";
// import YourChannel from './YourChannel.js';
// import YourProjects from './YourProjects.js';
// import YourVists from './YourVists.js';
// import YourRegistrations from './YourRegistrations.js';
// import YourBookings from './YourBookings.js';
// import NotificationDashboard from './NotificationDashboard';
// import InitialDashboard from './InitialDashboard';

// export const CardWrapper = styled(Card)(
//   ({ theme }) => `
//  transition: ${theme.transitions.create(['box-shadow'])};
//  position: relative;
//  border-radius: 8px;
//  z-index: 5;
//  &:hover {
//  z-index: 6;
//  transform:scale(1.02); }
 
//  `
// );

// export const BoxWrapper = styled(Box)(
//   ({ theme }) => `
//       transition: ${theme.transitions.create(['box-shadow'])};
//       position: relative;
//       border-radius: 8px;
//       z-index: 5;
//       &:hover {
//         z-index: 6;
//         transform:scale(1.02); 
//       }
    
//     `
// );
// SwiperCore.use([Navigation, Pagination]);
// const SwipeIndicator = styled(IconButton)(
//   ({ theme }) => `
//         @media (max-width: ${theme.breakpoints.values.sm}px) {
//             display: none;
//         }
//         transition: ${theme.transitions.create(['background', 'color'])};
//         color: ${theme.palette.primary.main};
        
//         position: absolute;
//         z-index:8;
//         width: ${theme.spacing(3)};
//         height: ${theme.spacing(3)};
//         top: 50%;
//         margin-top: ${theme.spacing(-3.5)};
//         border-radius: 100px;
    
//         &:hover {
//           background: transparent;
//         }
    
//         &.MuiSwipe-left {
//           left: ${theme.spacing(-4)};
//         }
        
//         &.MuiSwipe-right {
//           right: ${theme.spacing(-4)};
//         }
//     `
// );

// const SwiperWrapper = styled(Box)(
//   ({ theme }) => `
//  .swiper-pagination {
//  .swiper-pagination-bullet {
//  background: ${theme.palette.primary.main};
//  opacity: 1;
 
//  &.swiper-pagination-bullet-active {
//  background: lightgray;
//  width: 20px;
//  border-radius: 6px;
//  }
//  }
//  }
//  `
// );

// export const AvatarWrapper = styled(Avatar)(
//   ({ theme }) => `
//  color: ${theme.colors.alpha.trueWhite[100]};
 
//  width: ${theme.spacing(3.5)};
//  height: ${theme.spacing(3.5)};
//  `
// );

// export const renderDate = (dateOZ) => {
//   let newdate = new Date(dateOZ).toLocaleDateString('en-us', {
//     month: 'short',
//     day: 'numeric'
//   });
//   return `${newdate}`;
// };

// const BoardCastCard = ({ item, index }) => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const labels1 = item?.Chart?.map(id => id?.date);

//   const formattedDates = [];

//   for (let i = 0; i < labels1?.length; i++) {
//     const date = new Date(labels1[i]);
//     const day = date.toLocaleDateString('en-US', { weekday: 'long' });
//     const formattedDate = `${labels1[i]} ${day}`;
//     formattedDates.push(formattedDate);
//   }


//   const currentDate = new Date();
//   const nonDates = [];
//   for (let i = 0; i < 15; i++) {
//     const date = new Date(currentDate);
//     date.setDate(currentDate.getDate() - i);
//     const formattedDate = date.toISOString().split('T')[0];
//     nonDates.push(formattedDate);
//   }

//   const Box1Options = {
//     chart: {
//       background: 'transparent',
//       toolbar: {
//         show: false
//       },
//       sparkline: {
//         enabled: true
//       },
//       zoom: {
//         enabled: false
//       }
//     },
//     colors: [theme.colors.alpha.trueWhite[100]],
//     dataLabels: {
//       enabled: false
//     },
//     theme: {
//       mode: theme.palette.mode,
//     },
//     stroke: {
//       show: true,
//       colors: [theme.colors.alpha.trueWhite[100]],
//       curve: 'straight',
//       width: 3
//     },
//     legend: {
//       show: false
//     },
//     labels: formattedDates.length > 0 ? formattedDates.reverse() : nonDates.reverse(),
//     xaxis: {
//       labels: {
//         show: false
//       },
//       axisBorder: {
//         show: false
//       },
//       axisTicks: {
//         show: false
//       }
//     },
//     yaxis: {
//       show: false,
//       min: 0
//     },
//   };

//   const data11 = item?.Chart?.map(id => id.count);
//   const Box1Data = [
//     {
//       name: 'Broadcasts - ',
//       data: data11?.length > 0 ? data11?.reverse() : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//     }
//   ];
//   return (
//     <React.Fragment key={index}>
//       <CardWrapper id="broad-card"
//         onClick={() => navigate('/broadcast', { state: { id: item.label_id } })}
//         sx={{
//           background: `linear-gradient(${item.borderColor}, ${item.borderColor2})`,
//           // background: 'red',
//           color: theme.colors.alpha.trueWhite[100],
//           maxWidth: 240,
//           m: 1,
//           mb: 5,
//           width: '100%', // Default width for smaller screens
//           '@media (min-width: 600px)': {
//             width: '90%' // Adjust width for screens with a minimum width of 600px
//           },
//           '@media (min-width: 960px) and (max-width: 1280px)': {
//             maxWidth: '95%',
//             width: '95%' // Adjust width for screens with a minimum width of 960px
//           },
//           '@media (min-width: 1280px) and (max-width: 1600px)': {
//             maxWidth: '92%',
//             width: '92%'
//           },
//           cursor: 'pointer',
//           boxShadow: `0 20px 18px -10px ${item.borderColor2}`
//         }}
//       >
//         <Box p={2} id="box1">
//           <Typography id="label-size"
//             sx={{ fontSize: 'h4,fontSize' }}>{item.label}</Typography>
//           <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
//             <Typography sx={{ fontWeight: 'bold', fontSize: 'h3.fontSize' }}>
//               {item.count}
//             </Typography>
//             <Box style={{
//               backgroundColor: "white",
//               height: "13px",
//               width: "40px",
//               borderRadius: "8px",
//               marginLeft: "7px", marginTop: "-5px"
//             }}>
//               <Typography style={{ fontSize: "9px", textAlign: "center", color: 'black', }} >{`${item.newCount} NEW`}</Typography>
//             </Box>
//             {/* <Typography style={{ fontSize: "0.7rem", marginLeft: '1rem', color: 'black', backgroundColor: 'white', borderRadius: '0.4rem', paddingRight: '0.2rem', paddingLeft: '0.2rem' }} > {`${item.newCount} NEW`} </Typography> */}
//           </Box>
//           <Chart
//             options={Box1Options}
//             series={Box1Data}
//             type="area"
//             height={40}
//           />
//         </Box>
//         <Divider sx={{ backgroundColor: 'white' }} />
//         <Box id="box2"
//           p={2}
//           sx={{
//             display: 'flex',
//             alignItems: 'flex-end',
//             justifyContent: 'space-between'
//           }}
//         >
//           <Box >
//             <Typography id="box3"> Last</Typography>
//             <Typography id="box8"> Broadcasted</Typography>
//           </Box>
//           <Box>
//             <Typography id="box4" sx={{ fontWeight: '100' }}>
//               {item.last_broadcasted}
//             </Typography>
//           </Box>
//         </Box>
//         {/* <Divider sx={{ backgroundColor: 'white' }} />
//         <Box id="box5"
//           p={2}
//           sx={{
//             display: 'flex',
//             alignItems: 'flex-end',
//             justifyContent: 'space-between'
//           }}
//         >
//         <Box >
//             <Typography id="box6">Avg.</Typography>
//             <Typography id="box9">Broadcast Time</Typography>
//           </Box>
//           <Box >
//             <Typography  id="box7" sx={{ fontWeight: 'bold' }}>
//               {item.avg_broadcast_time}
//             </Typography>
//           </Box>
//         </Box> */}
//       </CardWrapper>
//     </React.Fragment>
//   );
// };

// const Dashboard = () => {
//   const theme = useTheme();
//   const dispatch = useDispatch();

//   let userData = useSelector((state) => state?.auth?.data);

//   const project = useSelector((state) => state.meeting?.projects);

//   const dashboardBroadcast = useSelector(
//     (state) => state.dashboard?.dashboardBroadcast
//   );
//   const clientDashboardData = useSelector(
//     (state) => state.dashboard?.clientDashboardData
//   );

//   const projectListData = useSelector(
//     (state) => state.projectList?.projectListData
//   );

//   const teamList = useSelector((state) => state.team.teamList);
//   console.log("clientDashboardData!@#!!!!!!!!!!", clientDashboardData)

//   console.log("clientDashboardData?.topViewedProject", clientDashboardData?.topViewedProject?._id)

//   console.log("Projects", project)
//   console.log("Projectsid", projectListData)

//   const broadcastList = [
//     {
//       label: 'General Updates',
//       label_id: 'GENERAL_UPDATES',
//       count: dashboardBroadcast?.generalUpdates?.count,
//       newCount: dashboardBroadcast?.generalUpdates?.newgeneralUpdates,
//       Chart: dashboardBroadcast?.generalUpdates?.Chart,
//       avg_broadcast_time: dashboardBroadcast?.generalUpdates?.average !== 'NA' ? `${dashboardBroadcast?.generalUpdates?.average} hrs` : 'NA',
//       last_broadcasted: `${dashboardBroadcast?.generalUpdates?.lastBroadcasted}`,
//       borderColor: '#8F74FA',
//       borderColor2: '#736DFF',
//       Box1Data: [
//         {
//           name: 'Orders',
//           data: [43, 65, 32, 54, 76, 65, 54, 22, 34, 10]
//         }
//       ],
//     },
//     {
//       label: 'Offers for Brokers',
//       label_id: 'OFFER_BROKERS',
//       count: dashboardBroadcast?.offerBrokers?.count,
//       newCount: dashboardBroadcast?.offerBrokers?.newofferBrokers,
//       Chart: dashboardBroadcast?.offerBrokers?.Chart,
//       avg_broadcast_time: dashboardBroadcast?.offerBrokers?.average !== 'NA' ? `${dashboardBroadcast?.offerBrokers?.average} hrs` : 'NA',
//       last_broadcasted: `${dashboardBroadcast?.offerBrokers?.lastBroadcasted}`,
//       borderColor: '#f8a38e',
//       borderColor2: '#F7C498',
//       Box1Data: [
//         {
//           name: 'Orders',
//           data: [38, 57, 45, 82, 59, 26, 28, 25, 36, 54]
//         }
//       ],
//     },
//     {
//       label: 'Offers for Buyers',
//       label_id: 'OFFER_BUYERS',
//       count: dashboardBroadcast?.offerBuyers?.count,
//       newCount: dashboardBroadcast?.offerBuyers?.newofferBuyers,
//       Chart: dashboardBroadcast?.offerBuyers?.Chart,
//       avg_broadcast_time: dashboardBroadcast?.offerBuyers?.average !== 'NA' ? `${dashboardBroadcast?.offerBuyers?.average} hrs` : 'NA',
//       last_broadcasted: `${dashboardBroadcast?.offerBuyers?.lastBroadcasted}`,
//       borderColor: '#cf99ca',
//       borderColor2: '#9B77D9',
//       Box1Data: [
//         {
//           name: 'Orders',
//           data: [92, 12, 85, 62, 44, 36, 78, 25, 36, 92]
//         }
//       ],
//     },
//     {
//       label: 'Project Updates',
//       label_id: 'PROJECT_UPDATES',
//       count: dashboardBroadcast?.projectUpdates?.count,
//       newCount: dashboardBroadcast?.projectUpdates?.newprojectUpdates,
//       Chart: dashboardBroadcast?.projectUpdates?.Chart,
//       avg_broadcast_time: dashboardBroadcast?.projectUpdates?.average !== 'NA' ? `${dashboardBroadcast?.projectUpdates?.average} hrs` : 'NA',
//       last_broadcasted: `${dashboardBroadcast?.projectUpdates?.lastBroadcasted}`,
//       borderColor: '#49d0da',
//       borderColor2: '#49a8da',
//       Box1Data: [
//         {
//           name: 'Orders',
//           data: [42, 51, 42, 23, 34, 43, 98, 76, 45, 12]
//         }
//       ],
//     },
//     {
//       label: 'Events & Polls',
//       label_id: 'EVENTS_POLLS',
//       count: dashboardBroadcast?.eventPolls?.count,
//       newCount: dashboardBroadcast?.eventPolls?.neweventPolls,
//       Chart: dashboardBroadcast?.eventPolls?.Chart,
//       avg_broadcast_time: dashboardBroadcast?.eventPolls?.average !== 'NA' ? `${dashboardBroadcast?.eventPolls?.average} hrs` : 'NA',
//       last_broadcasted: `${dashboardBroadcast?.eventPolls?.lastBroadcasted}`,
//       borderColor: '#F5D06E',
//       borderColor2: '#e3c678',
//       Box1Data: [
//         {
//           name: 'Orders',
//           data: [12, 72, 48, 32, 54, 56, 28, 25, 36, 62]
//         }
//       ],
//     }

//   ];

//   useEffect(async () => {
//     const projectByRMV = await projectByRM(userData.userId);
//     dispatch(addMeetingCard());
//     dispatch(getbookingCard());
//     dispatch(getregistrationCard());
//     dispatch(addProjects());
//     dispatch(getProjectList())
//     dispatch(addClientVisits());
//     dispatch(getTeams());
//     dispatch(addDashboardClientData());
//     dispatch(addDashboardBroadcast(userData?.roleName, projectByRMV?.data));
//     dispatch(clientVisitByMonth({ fromDate: null, toDate: null }));
//   }, []);

//   if (_.isEmpty(dashboardBroadcast)) {
//     return <Loader />;
//   }

//   return (
//     <>
//       {projectListData.length === 0 || teamList === 0 ?
//         <InitialDashboard
//           project={projectListData.length}
//           team={teamList.length}
//         />
//         :
//         <>
//           <Helmet>Dashboard</Helmet>
//           <Box pl={1} pr={0}>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2, }}>
//               <Box display={{ md: 'none' }}>
//                 <NotificationDrawer>
//                   <Box
//                     sx={{
//                       backgroundColor: `${theme.colors.primary.lighter}`,
//                       height: '100%'
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         position: 'relative',
//                         right: 0,
//                         zIndex: 999,
//                         width: 400
//                       }}
//                     >
//                       <NotificationDashboard />
//                     </Box>
//                   </Box>
//                 </NotificationDrawer>
//               </Box>
//             </Box>
//             <Grid container>
//               <Grid item xs={12} md={9}>
//                 <Box
//                   sx={{
//                     ml: { xs: '-20px', lg: '0px' },
//                     pl: { xs: 7, lg: 4 },
//                     pr: { xs: 7, md: 4 }
//                   }}
//                 >
//                   <Grid container>
//                     <Grid item xs={12}  >
//                       <Box >
//                         <Typography sx={{ fontWeight: 'bold', fontSize:"13px",mr: 2, mt: 2 }}>
//                           {' '}
//                           YOUR BROADCASTS
//                         </Typography>
//                         <SwiperWrapper
//                           sx={{
//                             position: 'relative',
//                             py: 0,
//                             ml: -1,
//                             cursor: 'pointer'
//                           }}
//                         >
//                           <Swiper
//                             spaceBetween={5}
//                             slidesPerView={1}

//                             navigation={{
//                               nextEl: '.MuiSwipe-right',
//                               prevEl: '.MuiSwipe-left'
//                             }}
//                             breakpoints={{
//                               500: {
//                                 slidesPerView: 3,
//                                 spaceBetween: 5
//                               },

//                               768: {
//                                 slidesPerView: 4,
//                                 spaceBetween: 5,
//                               },
//                               1200: {
//                                 slidesPerView: 4,
//                                 spaceBetween: 5,
//                               },
//                               1600: {
//                                 slidesPerView: 4,
//                                 spaceBetween: 0,
//                               },
//                               1900: {
//                                 slidesPerView: 5,
//                                 spaceBetween: 0
//                               }
//                             }}
//                             pagination={{ dynamicBullets: true, clickable: true }}
//                           >
//                             {broadcastList.map((item, index) => {
//                               return (
//                                 <SwiperSlide>
//                                   <BoardCastCard item={item} index={index} />
//                                 </SwiperSlide>
//                               );
//                             })}
//                           </Swiper>
//                           <SwipeIndicator className="MuiSwipe-root MuiSwipe-left">
//                             <ChevronLeftTwoToneIcon
//                               sx={{ fontSize: 35, fontWeight: '100', }}
//                             />
//                           </SwipeIndicator>
//                           <SwipeIndicator className="MuiSwipe-root MuiSwipe-right">
//                             <ChevronRightTwoToneIcon
//                               sx={{ fontSize: 35, fontWeight: '100', }}
//                             />
//                           </SwipeIndicator>
//                         </SwiperWrapper>
//                       </Box>
//                     </Grid>

//                     <Grid item xs={12} style={{ maxWidth: '100%' }}>
//                       <YourChannel />
//                     </Grid>

//                     <Grid item xs={12} lg={6} style={{ maxWidth: '50%' }} id="card1">
//                       <YourProjects />
//                     </Grid>
//                     <Grid item xs={12} lg={6} style={{ maxWidth: '50%' }} id="card2">
//                       <YourVists />
//                     </Grid>

//                     <Grid item xs={12} lg={6} style={{ maxWidth: '50%' }} id="card3">
//                       <YourRegistrations />
//                     </Grid>
//                     <Grid item xs={12} lg={6} style={{ maxWidth: '50%' }} id ="card4">
//                       <YourBookings />
//                     </Grid>
 
//                   </Grid>
//                 </Box>
//               </Grid>
//               <Box
//                 item
//                 component={Grid}
//                 display={{ xs: 'none', md: 'block' }}
//                 md={3}
//               >
//                 <Box
//                   sx={{
//                     height: '100%'
//                   }}
//                 >
//                   <NotificationDashboard />
//                 </Box>
//               </Box>
//             </Grid>
//           </Box>
//         </>
//       }
//     </>
//   );
// };
// export default Dashboard;
// //

import React, {
  useEffect,
  useState
} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Divider,
  Grid,
  Card,
  styled,
  Avatar,
  IconButton,
  useTheme
} from '@mui/material';
import Chart from 'react-apexcharts';
import { Helmet } from 'react-helmet-async';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import _ from 'lodash';
import Loader from 'src/UI/Loader/Loader.js';
import {
  addMeetingCard,
  addProjects,
  getbookingCard,
  getregistrationCard
} from '../../slices/meetings';
import {
  addClientVisits,
  addDashboardClientData,
  // addDashboardBroadcast,
  clientVisitByMonth
} from '../../slices/dashboard';
import { getProjectList } from '../../slices/ProjectList';
import { getTeams } from '../../slices/team';
import NotificationDrawer from '../../components/Projects/ViewProjectDetails/Blocks/NotificationDrawer';
import "./index.css";
import YourChannel from './YourChannel.js';
import YourProjects from './YourProjects.js';
import YourVists from './YourVists.js';
import YourRegistrations from './YourRegistrations.js';
import YourBookings from './YourBookings.js';
import NotificationDashboard from './NotificationDashboard';
import InitialDashboard from './InitialDashboard';

// HARDCODED DATA
const HARDCODED_BROADCAST_DATA = {
  generalUpdates: {
    count: 45,
    newgeneralUpdates: 5,
    Chart: [
      { date: '2024-11-10', count: 10 },
      { date: '2024-11-11', count: 12 },
      { date: '2024-11-12', count: 15 },
      { date: '2024-11-13', count: 8 },
      { date: '2024-11-14', count: 20 },
      { date: '2024-11-15', count: 18 },
      { date: '2024-11-16', count: 22 },
      { date: '2024-11-17', count: 14 },
      { date: '2024-11-18', count: 16 },
      { date: '2024-11-19', count: 19 },
      { date: '2024-11-20', count: 21 },
      { date: '2024-11-21', count: 17 },
      { date: '2024-11-22', count: 23 },
      { date: '2024-11-23', count: 25 },
      { date: '2024-11-24', count: 28 }
    ],
    average: '2.5',
    lastBroadcasted: '2 hours ago'
  },
  offerBrokers: {
    count: 32,
    newofferBrokers: 3,
    Chart: [
      { date: '2024-11-10', count: 5 },
      { date: '2024-11-11', count: 8 },
      { date: '2024-11-12', count: 6 },
      { date: '2024-11-13', count: 9 },
      { date: '2024-11-14', count: 12 },
      { date: '2024-11-15', count: 10 },
      { date: '2024-11-16', count: 14 },
      { date: '2024-11-17', count: 11 },
      { date: '2024-11-18', count: 15 },
      { date: '2024-11-19', count: 13 },
      { date: '2024-11-20', count: 16 },
      { date: '2024-11-21', count: 12 },
      { date: '2024-11-22', count: 18 },
      { date: '2024-11-23', count: 20 },
      { date: '2024-11-24', count: 22 }
    ],
    average: '3.2',
    lastBroadcasted: '5 hours ago'
  },
  offerBuyers: {
    count: 28,
    newofferBuyers: 4,
    Chart: [
      { date: '2024-11-10', count: 4 },
      { date: '2024-11-11', count: 6 },
      { date: '2024-11-12', count: 8 },
      { date: '2024-11-13', count: 7 },
      { date: '2024-11-14', count: 10 },
      { date: '2024-11-15', count: 9 },
      { date: '2024-11-16', count: 12 },
      { date: '2024-11-17', count: 11 },
      { date: '2024-11-18', count: 14 },
      { date: '2024-11-19', count: 13 },
      { date: '2024-11-20', count: 15 },
      { date: '2024-11-21', count: 14 },
      { date: '2024-11-22', count: 17 },
      { date: '2024-11-23', count: 19 },
      { date: '2024-11-24', count: 21 }
    ],
    average: '2.8',
    lastBroadcasted: '1 day ago'
  },
  projectUpdates: {
    count: 56,
    newprojectUpdates: 8,
    Chart: [
      { date: '2024-11-10', count: 12 },
      { date: '2024-11-11', count: 14 },
      { date: '2024-11-12', count: 16 },
      { date: '2024-11-13', count: 13 },
      { date: '2024-11-14', count: 18 },
      { date: '2024-11-15', count: 20 },
      { date: '2024-11-16', count: 22 },
      { date: '2024-11-17', count: 19 },
      { date: '2024-11-18', count: 24 },
      { date: '2024-11-19', count: 26 },
      { date: '2024-11-20', count: 28 },
      { date: '2024-11-21', count: 25 },
      { date: '2024-11-22', count: 30 },
      { date: '2024-11-23', count: 32 },
      { date: '2024-11-24', count: 35 }
    ],
    average: '1.5',
    lastBroadcasted: '3 hours ago'
  },
  eventPolls: {
    count: 18,
    neweventPolls: 2,
    Chart: [
      { date: '2024-11-10', count: 3 },
      { date: '2024-11-11', count: 4 },
      { date: '2024-11-12', count: 5 },
      { date: '2024-11-13', count: 4 },
      { date: '2024-11-14', count: 6 },
      { date: '2024-11-15', count: 7 },
      { date: '2024-11-16', count: 8 },
      { date: '2024-11-17', count: 6 },
      { date: '2024-11-18', count: 9 },
      { date: '2024-11-19', count: 10 },
      { date: '2024-11-20', count: 11 },
      { date: '2024-11-21', count: 9 },
      { date: '2024-11-22', count: 12 },
      { date: '2024-11-23', count: 14 },
      { date: '2024-11-24', count: 16 }
    ],
    average: '4.0',
    lastBroadcasted: '6 hours ago'
  }
};

const HARDCODED_PROJECT_LIST = [
  { id: 1, name: 'Project Alpha', status: 'active' },
  { id: 2, name: 'Project Beta', status: 'active' },
  { id: 3, name: 'Project Gamma', status: 'pending' }
];

const HARDCODED_TEAM_LIST = [
  { id: 1, name: 'Team A', members: 5 },
  { id: 2, name: 'Team B', members: 8 },
  { id: 3, name: 'Team C', members: 3 }
];

const HARDCODED_CLIENT_DATA = {
  topViewedProject: {
    _id: 'project-123',
    name: 'Premium Towers',
    views: 1250
  }
};

export const CardWrapper = styled(Card)(
  ({ theme }) => `
 transition: ${theme.transitions.create(['box-shadow'])};
 position: relative;
 border-radius: 8px;
 z-index: 5;
 &:hover {
 z-index: 6;
 transform:scale(1.02); }
 
 `
);

export const BoxWrapper = styled(Box)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      border-radius: 8px;
      z-index: 5;
      &:hover {
        z-index: 6;
        transform:scale(1.02); 
      }
    
    `
);

SwiperCore.use([Navigation, Pagination]);

const SwipeIndicator = styled(IconButton)(
  ({ theme }) => `
        @media (max-width: ${theme.breakpoints.values.sm}px) {
            display: none;
        }
        transition: ${theme.transitions.create(['background', 'color'])};
        color: ${theme.palette.primary.main};
        
        position: absolute;
        z-index:8;
        width: ${theme.spacing(3)};
        height: ${theme.spacing(3)};
        top: 50%;
        margin-top: ${theme.spacing(-3.5)};
        border-radius: 100px;
    
        &:hover {
          background: transparent;
        }
    
        &.MuiSwipe-left {
          left: ${theme.spacing(-4)};
        }
        
        &.MuiSwipe-right {
          right: ${theme.spacing(-4)};
        }
    `
);

const SwiperWrapper = styled(Box)(
  ({ theme }) => `
 .swiper-pagination {
 .swiper-pagination-bullet {
 background: ${theme.palette.primary.main};
 opacity: 1;
 
 &.swiper-pagination-bullet-active {
 background: lightgray;
 width: 20px;
 border-radius: 6px;
 }
 }
 }
 `
);

export const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
 color: ${theme.colors.alpha.trueWhite[100]};
 
 width: ${theme.spacing(3.5)};
 height: ${theme.spacing(3.5)};
 `
);

export const renderDate = (dateOZ) => {
  let newdate = new Date(dateOZ).toLocaleDateString('en-us', {
    month: 'short',
    day: 'numeric'
  });
  return `${newdate}`;
};

const BoardCastCard = ({ item, index }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const labels1 = item?.Chart?.map(id => id?.date);

  const formattedDates = [];

  for (let i = 0; i < labels1?.length; i++) {
    const date = new Date(labels1[i]);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = `${labels1[i]} ${day}`;
    formattedDates.push(formattedDate);
  }

  const currentDate = new Date();
  const nonDates = [];
  for (let i = 0; i < 15; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    nonDates.push(formattedDate);
  }

  const Box1Options = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: false
      }
    },
    colors: [theme.colors.alpha.trueWhite[100]],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode,
    },
    stroke: {
      show: true,
      colors: [theme.colors.alpha.trueWhite[100]],
      curve: 'straight',
      width: 3
    },
    legend: {
      show: false
    },
    labels: formattedDates.length > 0 ? formattedDates.reverse() : nonDates.reverse(),
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false,
      min: 0
    },
  };

  const data11 = item?.Chart?.map(id => id.count);
  const Box1Data = [
    {
      name: 'Broadcasts - ',
      data: data11?.length > 0 ? data11?.reverse() : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  ];

  return (
    <React.Fragment key={index}>
      <CardWrapper id="broad-card"
        onClick={() => navigate('/broadcast', { state: { id: item.label_id } })}
        sx={{
          background: `linear-gradient(${item.borderColor}, ${item.borderColor2})`,
          color: theme.colors.alpha.trueWhite[100],
          maxWidth: 240,
          m: 1,
          mb: 5,
          width: '100%',
          '@media (min-width: 600px)': {
            width: '90%'
          },
          '@media (min-width: 960px) and (max-width: 1280px)': {
            maxWidth: '95%',
            width: '95%'
          },
          '@media (min-width: 1280px) and (max-width: 1600px)': {
            maxWidth: '92%',
            width: '92%'
          },
          cursor: 'pointer',
          boxShadow: `0 20px 18px -10px ${item.borderColor2}`
        }}
      >
        <Box p={2} id="box1">
          <Typography id="label-size"
            sx={{ fontSize: 'h4,fontSize' }}>{item.label}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h3.fontSize' }}>
              {item.count}
            </Typography>
            <Box style={{
              backgroundColor: "white",
              height: "13px",
              width: "40px",
              borderRadius: "8px",
              marginLeft: "7px", marginTop: "-5px"
            }}>
              <Typography style={{ fontSize: "9px", textAlign: "center", color: 'black', }} >{`${item.newCount} NEW`}</Typography>
            </Box>
          </Box>
          <Chart
            options={Box1Options}
            series={Box1Data}
            type="area"
            height={40}
          />
        </Box>
        <Divider sx={{ backgroundColor: 'white' }} />
        <Box id="box2"
          p={2}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between'
          }}
        >
          <Box >
            <Typography id="box3"> Last</Typography>
            <Typography id="box8"> Broadcasted</Typography>
          </Box>
          <Box>
            <Typography id="box4" sx={{ fontWeight: '100' }}>
              {item.last_broadcasted}
            </Typography>
          </Box>
        </Box>
      </CardWrapper>
    </React.Fragment>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Get user data from localStorage instead of Redux
  // const userDataString = localStorage.getItem('user');
  // const userData = userDataString ? JSON.parse(userDataString) : null;
  // const userInfo = userData?.user || userData;

  // Use hardcoded data instead of Redux selectors
  const [dashboardBroadcast, setDashboardBroadcast] = useState({});
  const [projectListData, setProjectListData] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [clientDashboardData, setClientDashboardData] = useState({});

  console.log("clientDashboardData!@#!!!!!!!!!!", clientDashboardData);
  console.log("clientDashboardData?.topViewedProject", clientDashboardData?.topViewedProject?._id);

  const broadcastList = [
    {
      label: 'General Updates',
      label_id: 'GENERAL_UPDATES',
      count: dashboardBroadcast?.generalUpdates?.count,
      newCount: dashboardBroadcast?.generalUpdates?.newgeneralUpdates,
      Chart: dashboardBroadcast?.generalUpdates?.Chart,
      avg_broadcast_time: dashboardBroadcast?.generalUpdates?.average !== 'NA' ? `${dashboardBroadcast?.generalUpdates?.average} hrs` : 'NA',
      last_broadcasted: `${dashboardBroadcast?.generalUpdates?.lastBroadcasted}`,
      borderColor: '#8F74FA',
      borderColor2: '#736DFF',
      Box1Data: [
        {
          name: 'Orders',
          data: [43, 65, 32, 54, 76, 65, 54, 22, 34, 10]
        }
      ],
    },
    {
      label: 'Offers for Brokers',
      label_id: 'OFFER_BROKERS',
      count: dashboardBroadcast?.offerBrokers?.count,
      newCount: dashboardBroadcast?.offerBrokers?.newofferBrokers,
      Chart: dashboardBroadcast?.offerBrokers?.Chart,
      avg_broadcast_time: dashboardBroadcast?.offerBrokers?.average !== 'NA' ? `${dashboardBroadcast?.offerBrokers?.average} hrs` : 'NA',
      last_broadcasted: `${dashboardBroadcast?.offerBrokers?.lastBroadcasted}`,
      borderColor: '#f8a38e',
      borderColor2: '#F7C498',
      Box1Data: [
        {
          name: 'Orders',
          data: [38, 57, 45, 82, 59, 26, 28, 25, 36, 54]
        }
      ],
    },
    {
      label: 'Offers for Buyers',
      label_id: 'OFFER_BUYERS',
      count: dashboardBroadcast?.offerBuyers?.count,
      newCount: dashboardBroadcast?.offerBuyers?.newofferBuyers,
      Chart: dashboardBroadcast?.offerBuyers?.Chart,
      avg_broadcast_time: dashboardBroadcast?.offerBuyers?.average !== 'NA' ? `${dashboardBroadcast?.offerBuyers?.average} hrs` : 'NA',
      last_broadcasted: `${dashboardBroadcast?.offerBuyers?.lastBroadcasted}`,
      borderColor: '#cf99ca',
      borderColor2: '#9B77D9',
      Box1Data: [
        {
          name: 'Orders',
          data: [92, 12, 85, 62, 44, 36, 78, 25, 36, 92]
        }
      ],
    },
    {
      label: 'Project Updates',
      label_id: 'PROJECT_UPDATES',
      count: dashboardBroadcast?.projectUpdates?.count,
      newCount: dashboardBroadcast?.projectUpdates?.newprojectUpdates,
      Chart: dashboardBroadcast?.projectUpdates?.Chart,
      avg_broadcast_time: dashboardBroadcast?.projectUpdates?.average !== 'NA' ? `${dashboardBroadcast?.projectUpdates?.average} hrs` : 'NA',
      last_broadcasted: `${dashboardBroadcast?.projectUpdates?.lastBroadcasted}`,
      borderColor: '#49d0da',
      borderColor2: '#49a8da',
      Box1Data: [
        {
          name: 'Orders',
          data: [42, 51, 42, 23, 34, 43, 98, 76, 45, 12]
        }
      ],
    },
    {
      label: 'Events & Polls',
      label_id: 'EVENTS_POLLS',
      count: dashboardBroadcast?.eventPolls?.count,
      newCount: dashboardBroadcast?.eventPolls?.neweventPolls,
      Chart: dashboardBroadcast?.eventPolls?.Chart,
      avg_broadcast_time: dashboardBroadcast?.eventPolls?.average !== 'NA' ? `${dashboardBroadcast?.eventPolls?.average} hrs` : 'NA',
      last_broadcasted: `${dashboardBroadcast?.eventPolls?.lastBroadcasted}`,
      borderColor: '#F5D06E',
      borderColor2: '#e3c678',
      Box1Data: [
        {
          name: 'Orders',
          data: [12, 72, 48, 32, 54, 56, 28, 25, 36, 62]
        }
      ],
    }
  ];

  useEffect(() => {
    // Simulate API calls with hardcoded data
    const initializeDashboard = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set hardcoded data
      setDashboardBroadcast(HARDCODED_BROADCAST_DATA);
      setProjectListData(HARDCODED_PROJECT_LIST);
      setTeamList(HARDCODED_TEAM_LIST);
      setClientDashboardData(HARDCODED_CLIENT_DATA);

      // Optional: Still dispatch Redux actions if needed by child components
      // But they won't make actual API calls
      try {
        dispatch(addMeetingCard());
        dispatch(getbookingCard());
        dispatch(getregistrationCard());
        dispatch(addProjects());
        dispatch(getProjectList());
        dispatch(addClientVisits());
        dispatch(getTeams());
        dispatch(addDashboardClientData());
        dispatch(clientVisitByMonth({ fromDate: null, toDate: null }));
      } catch (error) {
        console.log('Redux actions skipped or failed:', error);
      }

      setLoading(false);
    };

    initializeDashboard();
  }, [dispatch]);

  if (loading || _.isEmpty(dashboardBroadcast)) {
    return <Loader />;
  }

  return (
    <>
      {projectListData.length === 0 || teamList.length === 0 ?
        <InitialDashboard
          project={projectListData.length}
          team={teamList.length}
        />
        :
        <>
          <Helmet>Dashboard</Helmet>
          <Box pl={1} pr={0}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2, }}>
              <Box display={{ md: 'none' }}>
                <NotificationDrawer>
                  <Box
                    sx={{
                      backgroundColor: `${theme.colors.primary.lighter}`,
                      height: '100%'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        right: 0,
                        zIndex: 999,
                        width: 400
                      }}
                    >
                      <NotificationDashboard />
                    </Box>
                  </Box>
                </NotificationDrawer>
              </Box>
            </Box>
            <Grid container>
              <Grid item xs={12} md={9}>
                <Box
                  sx={{
                    ml: { xs: '-20px', lg: '0px' },
                    pl: { xs: 7, lg: 4 },
                    pr: { xs: 7, md: 4 }
                  }}
                >
                  <Grid container>
                    <Grid item xs={12}>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold', fontSize: "13px", mr: 2, mt: 2 }}>
                          YOUR BROADCASTS
                        </Typography>
                        <SwiperWrapper
                          sx={{
                            position: 'relative',
                            py: 0,
                            ml: -1,
                            cursor: 'pointer'
                          }}
                        >
                          <Swiper
                            spaceBetween={5}
                            slidesPerView={1}
                            navigation={{
                              nextEl: '.MuiSwipe-right',
                              prevEl: '.MuiSwipe-left'
                            }}
                            breakpoints={{
                              500: {
                                slidesPerView: 3,
                                spaceBetween: 5
                              },
                              768: {
                                slidesPerView: 4,
                                spaceBetween: 5,
                              },
                              1200: {
                                slidesPerView: 4,
                                spaceBetween: 5,
                              },
                              1600: {
                                slidesPerView: 4,
                                spaceBetween: 0,
                              },
                              1900: {
                                slidesPerView: 5,
                                spaceBetween: 0
                              }
                            }}
                            pagination={{ dynamicBullets: true, clickable: true }}
                          >
                            {broadcastList.map((item, index) => {
                              return (
                                <SwiperSlide key={index}>
                                  <BoardCastCard item={item} index={index} />
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                          <SwipeIndicator className="MuiSwipe-root MuiSwipe-left">
                            <ChevronLeftTwoToneIcon
                              sx={{ fontSize: 35, fontWeight: '100', }}
                            />
                          </SwipeIndicator>
                          <SwipeIndicator className="MuiSwipe-root MuiSwipe-right">
                            <ChevronRightTwoToneIcon
                              sx={{ fontSize: 35, fontWeight: '100', }}
                            />
                          </SwipeIndicator>
                        </SwiperWrapper>
                      </Box>
                    </Grid>

                    <Grid item xs={12} style={{ maxWidth: '100%' }}>
                      <YourChannel />
                    </Grid>

                    <Grid item xs={12} lg={6} style={{ maxWidth: '50%' }} id="card1">
                      <YourProjects />
                    </Grid>
                    <Grid item xs={12} lg={6} style={{ maxWidth: '50%' }} id="card2">
                      <YourVists />
                    </Grid>

                    <Grid item xs={12} lg={6} style={{ maxWidth: '50%' }} id="card3">
                      <YourRegistrations />
                    </Grid>
                    <Grid item xs={12} lg={6} style={{ maxWidth: '50%' }} id="card4">
                      <YourBookings />
                    </Grid>

                  </Grid>
                </Box>
              </Grid>
              <Box
                item
                component={Grid}
                display={{ xs: 'none', md: 'block' }}
                md={3}
              >
                <Box
                  sx={{
                    height: '100%'
                  }}
                >
                  <NotificationDashboard />
                </Box>
              </Box>
            </Grid>
          </Box>
        </>
      }
    </>
  );
};

export default Dashboard;