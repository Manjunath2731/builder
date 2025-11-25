// import React, { useEffect, useState } from "react";
// import { Box, Divider, Typography, useTheme, Avatar } from "@mui/material";
// import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
// import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
// import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
// import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
// import { notificationType } from 'src/constants/NotificationType';
// import { useDispatch, useSelector } from "react-redux";
// import { getAllNotifications, getYourNotification } from "src/slices/dashboard";
// import { useNavigate } from "react-router";
// import { editMeetings, meetCardStatusChange, regAndBookingCardStatusChange } from "src/axiosInstances/Api";
// import { showNotification } from "src/utils/commonUtility";
// import { convertDate, toUpperMutliple } from "src/utils/utilits";
// import "./index.css";


// function NotificationDashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const [showDetails, setShowDetails] = useState(false);
//   const [showRegistrations, setShowRegistrations] = useState(false);
//   const [showBookings, setShowBookings] = useState(false);
//   const [showAll, setShowAll] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleArrowIconClick = () => {
//     setShowDetails(!showDetails);
//   };
//   const handleArrowClick = () => {
//     setShowRegistrations(!showRegistrations);
//   };
//   const handleArrowIcon = () => {
//     setShowBookings(!showBookings);
//   };
//   const handleViewAll = () => {
//     setShowAll(true);
//   };

//   useEffect(() => {
//     dispatch(getYourNotification());
//     dispatch(getAllNotifications())
//   }, []);

//   const userData = JSON.parse(window.localStorage.getItem('user'));

//   const handleStatusChange = async (status, id) => {
//     setIsLoading(true);
//     const payload = {
//       status
//     };

//     const userPayload = {
//       id: userData?.userId,
//       name: `${userData?.first_name} ${userData?.last_name}`,
//       phoneNumber: userData?.phoneNumber,
//       email: userData?.email,
//       status
//     };

//     await meetCardStatusChange(id, payload).then((response) => {
//       if (response?.status === 200 || response?.status === 201) {
//         editMeetings(id, userPayload).then((responseStat) => {
//           if (responseStat === 200 || responseStat === 201) {
//             let sucessMessage = `Sucessfully ${toUpperMutliple(status)} `;
//             showNotification(sucessMessage, notificationType.SUCCESS);
//             setIsLoading(false);
//           }
//         });
//       }
//       else {
//         let errorMessage = 'Something went wrong';
//         showNotification(errorMessage, notificationType.ERROR);
//         setIsLoading(false);
//       }
//     });
//   };

//   const handleBookingStatusChange = async (status, id, type) => {
//     setIsLoading(true);
//     console.log(status, id)
//     // booking
//     await regAndBookingCardStatusChange(
//       id,
//       type,
//       status.toUpperCase()
//     ).then((response) => {
//       if (response?.status === 200 || response?.status === 201) {
//         let sucessMessage = `Sucessfully ${toUpperMutliple(status)} `;
//         showNotification(sucessMessage, notificationType.SUCCESS);
//         setIsLoading(false);
//       } else {
//         let errorMessage = 'Something went wrong';
//         showNotification(errorMessage, notificationType.ERROR);
//         setIsLoading(false);
//       }
//     });
//   };

//   const notification = useSelector((state) => state.dashboard.notification);
//   const allnotification = useSelector((state) => state.dashboard.allnotification);

//   const options = {
//     month: 'long',
//     day: 'numeric',
//     year: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: true
//   };

//   const groupDataByDate = (dataArray) => {
//     const groupedData = {};

//     dataArray.forEach((item) => {
//       const date = new Date(item.createdAt).toLocaleDateString();
//       if (!groupedData[date]) {
//         groupedData[date] = [];
//       }
//       groupedData[date].push(item);
//     });

//     return groupedData;
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const currentDate = new Date();
//     let data;
//     if (date.toDateString() === currentDate.toDateString()) {
//       data = `Today ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
//     } else {
//       data = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
//     }
//     return data;
//   };

//   useEffect(() => {
//     dispatch(getYourNotification());
//   }, [isLoading]);

//   const groupedData = groupDataByDate(allnotification);

//   return (
//     <>
//       <Box id="notification"
//         py={2}
//         px={3}
//         sx={{
//           backgroundColor: '#E9EEF4',
//           height: '100%',
//         }}
//       >

//         <Box
//           id="notifi-box1"
//           sx={{
//             width: "95%",
//             backgroundColor: "#FDFEFF",
//             height: "45px",
//             borderRadius: "10px",
//             border: "1.5px solid #0078E9",
//             boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//           }}
//         >
//           <Box style={{ display: 'flex', alignItems: 'center' }}>
//             <Typography
//               style={{ color: '#605843', fontSize: "12px", fontWeight: 'bold', marginLeft: '1.5rem' }}
//               id="notifi-title1"
//             >
//               New Client Visit Request
//             </Typography>
//           </Box>
//           <Box style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem' }}>
//             <Box
//               sx={{
//                 width: '27px',
//                 height: '27px',
//                 borderRadius: '50%',
//                 backgroundColor: '#0078E9',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 marginRight: '6px',
//               }}
//             >
//               <Typography
//                 variant="body1"
//                 sx={{
//                   fontSize: '12px',
//                   fontWeight: 'bold',
//                   color: 'white',
//                 }}
//               >
//                 {notification?.totalclientvisit?.length}
//               </Typography>
//             </Box>
//             {showDetails ? (
//               <KeyboardArrowUpRoundedIcon
//                 sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
//                 onClick={handleArrowIconClick}
//               />
//             ) : (
//               <KeyboardArrowDownRoundedIcon
//                 sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
//                 onClick={handleArrowIconClick}
//               />
//             )}
//           </Box>
//         </Box>

//         {showDetails &&
//           notification?.totalclientvisit?.map((data) => {
//             return (
//               <Box
//                 sx={{
//                   width: "95%",
//                   backgroundColor: "#F4F7FA",
//                   height: "115px",
//                   borderRadius: "10px",
//                   mt: 1.5,
//                   display: "flex",
//                   flexDirection: { xs: "column", sm: "row" },
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//                 id="show-details1"
//               >
//                 <Box sx={{ ml: { xs: 2, sm: 3 }, flex: 1 }}>
//                   <Typography style={{ fontSize: "11px", fontWeight: "bold" }} sx={{ mt: { xs: 1.5, sm: 0 } }}>
//                     {`Visit Requested by ${data?.organizer?.first_name} ${data?.organizer?.last_name}`}
//                   </Typography>
//                   <Typography style={{ fontSize: "10px", color: "#939494" }}>
//                     {new Date(data?.meetingDate).toLocaleString("en-US", {
//                       month: "long",
//                       day: "numeric",
//                       year: "numeric",
//                       hour: "numeric",
//                       minute: "numeric",
//                       hour12: true,
//                       timeZone: "Asia/Kolkata",
//                     })}
//                   </Typography>
//                   <Typography style={{ fontSize: "11px" }} sx={{ mt: 1 }}>
//                     {data?.client?.name}
//                   </Typography>
//                   <Typography style={{ fontSize: "11px" }}>
//                     {data?.projectId?.name?.toUpperCase()}
//                   </Typography>
//                   <Typography style={{ fontSize: "11px" }}>2BHK, 1850 SqFt</Typography>
//                 </Box>
//                 <Box sx={{ mt: { xs: 2, sm: 6 }, mr: { xs: 0, sm: 2 }, disabled: isLoading }} id="check1">
//                   <CheckCircleRoundedIcon
//                     sx={{ fontSize: 32, fontWeight: "100", color: "#00C45F" }}
//                     style={{ cursor: "pointer" }}
//                     onClick={() => {
//                       handleStatusChange("ACCEPTED", data?._id);
//                     }}
//                   />
//                   <CancelRoundedIcon
//                     sx={{ fontSize: 32, fontWeight: "100", color: "#F3512F", ml: 0.5 }}
//                     id="cross"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => {
//                       handleStatusChange("REJECTED", data?._id);
//                     }}
//                   />
//                 </Box>
//               </Box>



//             )
//           })
//         }
//         <Box py={1} >
//           <Box
//             id="notifi-box2"
//             sx={{
//               width: "95%",
//               backgroundColor: "#FDFEFF",
//               height: "45px",
//               borderRadius: "10px",
//               border: "1.5px solid #CF99CA",
//               boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
//               display: 'flex',
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',

//             }}
//           >
//             <Box style={{ display: 'flex', alignItems: 'center' }}>
//               <Typography
//                 style={{ color: '#605843', fontWeight: 'bold', fontSize: "12px", marginLeft: '1.5rem' }}
//                 id="notifi-title2"
//               >
//                 Client Registration Request
//               </Typography>
//             </Box>
//             <Box style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem' }}>
//               <Box
//                 sx={{
//                   width: '27px',
//                   height: '27px',
//                   borderRadius: '50%',
//                   backgroundColor: '#CF99CA',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginRight: '6px',
//                 }}
//               >
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     fontSize: '12px',
//                     fontWeight: 'bold',
//                     color: 'white',
//                   }}
//                 >
//                   {notification?.totalregistartion?.length}
//                 </Typography>
//               </Box>
//               {showRegistrations ? (
//                 <KeyboardArrowUpRoundedIcon
//                   sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
//                   onClick={handleArrowClick}
//                 />
//               ) : (
//                 <KeyboardArrowDownRoundedIcon
//                   sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
//                   onClick={handleArrowClick}
//                 />
//               )}
//             </Box>
//           </Box>

//           {showRegistrations &&
//             notification?.totalregistartion?.map(data => {
//               return (
//                 <Box
//                   sx={{
//                     width: "95%",
//                     backgroundColor: "#F4F7FA",
//                     height: "115px",
//                     borderRadius: "10px",
//                     mt: 1.5,
//                     display: "flex",
//                     flexDirection: { xs: "column", sm: "row" },
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                   id="show-details1"
//                 >
//                   <Box sx={{ ml: { xs: 2, sm: 4 }, flex: 1 }}>
//                     <Typography style={{ fontSize: "11px", fontWeight: "bold" }} sx={{ mt: { xs: 1.5, sm: 0 } }}>
//                       {`Registration Requested by ${data?.clientId?.broker?.first_name} ${data?.clientId?.broker?.last_name}`}
//                     </Typography>
//                     <Typography style={{ fontSize: "10px", color: "#939494" }}>
//                       {new Date(data?.createdAt).toLocaleString("en-US", {
//                         month: "long",
//                         day: "numeric",
//                         year: "numeric",
//                         hour: "numeric",
//                         minute: "numeric",
//                         hour12: true,
//                         timeZone: "Asia/Kolkata"
//                       })}
//                     </Typography>
//                     <Typography style={{ fontSize: "11px" }} sx={{ mt: 1 }}>
//                       {data?.clientId?.name}
//                     </Typography>
//                     <Typography style={{ fontSize: "11px" }}>
//                       {`${data?.clientId?.project?.name}`}
//                     </Typography>
//                     <Typography style={{ fontSize: "11px" }}>2BHK, 1850 SqFt</Typography>
//                   </Box>
//                   <Box sx={{ mt: { xs: 2, sm: 6 }, mr: { xs: 0, sm: 2 }, disabled: isLoading }} id="check1">
//                     <CheckCircleRoundedIcon
//                       sx={{ fontSize: 32, fontWeight: "100", color: "#00C45F" }}
//                       style={{ cursor: "pointer" }}
//                       onClick={() => {
//                         handleBookingStatusChange('ACCEPTED', data?.clientId?._id, "registration");
//                       }}
//                     />
//                     <CancelRoundedIcon
//                       sx={{ fontSize: 32, fontWeight: "100", color: "#F3512F", ml: 0.5 }}
//                       id="cross"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => {
//                         handleBookingStatusChange('REJECTED', data?.clientId?._id, "registration");
//                       }}
//                     />
//                   </Box>
//                 </Box>

//               )
//             })
//           }
//         </Box>
//         <Box mb={1}>
//           <Box
//             id="notifi-box3"
//             sx={{
//               width: "95%",
//               backgroundColor: "#FDFEFF",
//               height: "45px",
//               borderRadius: "10px",
//               border: "1.5px solid #49D0DA",
//               boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
//               display: 'flex',
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Box style={{ display: 'flex', alignItems: 'center' }}>
//               <Typography
//                 style={{ color: '#605843', fontWeight: 'bold', fontSize: "12px", marginLeft: '1.5rem' }}
//                 id="notifi-title3" 
//               >
//                 Booking Request
//               </Typography>
//             </Box>
//             <Box style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem' }}>
//               <Box
//                 sx={{
//                   width: '27px',
//                   height: '27px',
//                   borderRadius: '50%',
//                   backgroundColor: '#49D0DA',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginRight: '6px',
//                 }}
//               >
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     fontSize: '12px',
//                     fontWeight: 'bold',
//                     color: 'white',
//                   }}
//                 >
//                   {notification?.totalbooking?.length}
//                 </Typography>
//               </Box>
//               {showBookings ? (
//                 <KeyboardArrowUpRoundedIcon
//                   sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
//                   onClick={handleArrowIcon}
//                 />
//               ) : (
//                 <KeyboardArrowDownRoundedIcon
//                   sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
//                   onClick={handleArrowIcon}
//                 />
//               )}
//             </Box>
//           </Box>

//           {showBookings &&
//             notification?.totalbooking?.map(data => {
//               return (
//                 <Box
//                 sx={{
//                   width: "95%",
//                   backgroundColor: "#F4F7FA",
//                   height: "115px",
//                   borderRadius: "10px",
//                   mt: 1.5,
//                   display: "flex",
//                   flexDirection: { xs: "column", sm: "row" },
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//                 id="show-details1"
//               >
//                 <Box sx={{ ml: { xs: 2, sm: 4 }, flex: 1 }}>
//                   <Typography style={{ fontSize: "11px", fontWeight: "bold" }} sx={{ mt: { xs: 1.5, sm: 0 } }}>
//                      {`Booking Requested by ${data?.clientId?.broker?.first_name} ${data?.clientId?.broker?.last_name}`}
//                   </Typography>
//                   <Typography style={{ fontSize: "10px", color: "#939494" }}>
//                     {new Date(data?.createdAt).toLocaleString("en-US", {
//                                         month: "long",
//                                         day: "numeric",
//                                         year: "numeric",
//                                         hour: "numeric",
//                                         minute: "numeric",
//                                         hour12: true,
//                                         timeZone: "Asia/Kolkata"
//                                       })} 
//                   </Typography>
//                   <Typography style={{ fontSize: "11px" }} sx={{ mt: 1 }}>
//                    {data?.clientId?.name}
//                   </Typography>
//                   <Typography style={{ fontSize: "11px" }}>
//                     {`${data?.clientId?.project?.name}`}
//                   </Typography>
//                   <Typography style={{ fontSize: "11px" }}>2BHK, 1850 SqFt</Typography>
//                 </Box>
//                 <Box sx={{ mt: { xs: 2, sm: 6 }, mr: { xs: 0, sm: 2 }, disabled: isLoading }} id="check1">
//                   <CheckCircleRoundedIcon
//                     sx={{ fontSize: 32, fontWeight: "100", color: "#00C45F" }}
//                     style={{ cursor: "pointer" }}
//                    onClick={() => {
//                                         handleBookingStatusChange('ACCEPTED', data?.clientId?._id, "booking");
//                                       }}
//                   />
//                   <CancelRoundedIcon
//                     sx={{ fontSize: 32, fontWeight: "100", color: "#F3512F", ml: 0.5 }}
//                     id="cross"
//                     style={{ cursor: "pointer" }}
//                    onClick={() => {
//                                         handleBookingStatusChange('REJECTED', data?.clientId?._id, "booking");
//                                       }}
//                   />
//                 </Box>
//               </Box>
              
//               )
//             })
//           }
//         </Box>
//         <Typography
//           py={1}
//           sx={{
//             fontSize: `${theme.typography.pxToRem(14)}`,
//             fontWeight: 'bold'
//           }}
//         >
//           {' '}
//           NOTIFICATIONS{' '}
//         </Typography>
//         <Box
//           sx={{
//             mt: 0.5,
//             width: "100%",
//             backgroundColor: "#4991F4",
//             height: showAll ? "auto" : "auto",
//             borderRadius: "10px",
//           }}
//           id="main-box"
//         >
//           <Box
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-around", // Use space-between to push the boxes to the left and right
//               alignItems: "center", // Vertically center the content
//             }}
//           >
//             <Typography
//               style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}
//               sx={{ mt: 2, }}
//               id="upcoming"
//             >
//               Your Upcoming Client Visits ({notification?.upcomingclientvisit?.length})
//             </Typography>
//             <KeyboardArrowUpRoundedIcon
//               sx={{ fontSize: 30, fontWeight: "100", color: "white", mt: 1, cursor: "pointer" }}
//             />
//           </Box>
//           <Divider sx={{ mt: 1.5, backgroundColor: "#8EBBF8" }} />
//           {notification?.upcomingclientvisit?.slice(0, 2).map((cv) => {
//             return (
//               <>
//                 <Box style={{ display: "flex", flexDirection: "row" }} id="Box1">
//                   <Box
//                     id="today-time"
//                     sx={{
//                       padding: "12px",
//                       marginTop: "9px",
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "space-around",
//                       alignItems: "center",
//                       width: "32%",
//                       backgroundColor: "#E9EEF4",
//                       height: "92px",
//                       borderRadius: "10px",
//                       marginLeft: "15px",
//                     }}
//                   >
//                     <Typography sx={{ color: "#047AE9", fontWeight: "bold", fontSize: "12px" }}>
//                       {convertDate(cv?.meetingDate).dateLabel}
//                     </Typography>
//                     <Typography sx={{ color: "#047AE9", fontWeight: "bold", fontSize: "12px" }}>
//                       {convertDate(cv?.meetingDate).timeLabel}
//                     </Typography>
//                   </Box>
//                   <Box sx={{ ml: 2, mt: 1 }}>
//                     <Typography style={{ fontSize: "12px", fontWeight: "bold", color: "white" }} sx={{ mt: 1 }}>
//                       {cv?.projectId?.name}
//                     </Typography>

//                     <Typography style={{ fontSize: "11px", color: "white" }}>
//                       {`${cv?.organizer?.first_name} ${cv?.organizer?.last_name}`}
//                     </Typography>
//                     <Typography style={{ fontSize: "11px", color: "white" }} sx={{ mt: 1 }}>
//                       {cv?.client?.name}
//                     </Typography>
//                     <Typography style={{ fontSize: "11px", color: "white" }}>
//                       2BHK, 1850 SqFt
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Divider sx={{ mt: 1.5, borderTop: "2px dotted #8EBBF8" }} />
//               </>
//             );
//           })}
//           {notification?.upcomingclientvisit?.slice(2).map((cv) => {
//             return (
//               <>
//                 {showAll && (
//                   <>
//                     <Box style={{ display: "flex", flexDirection: "row" }} id="Box3">
//                       <Box
//                         id="today-time"
//                         sx={{
//                           padding: "12px",
//                           marginTop: "9px",
//                           display: "flex",
//                           flexDirection: "column",
//                           justifyContent: "center",
//                           alignItems: "center",
//                           width: "32%",
//                           backgroundColor: "#E9EEF4",
//                           height: "92px",
//                           borderRadius: "10px",
//                           marginLeft: "15px",
//                         }}
//                       >
//                         <Typography sx={{ color: "#047AE9", fontWeight: "bold", fontSize: "12px" }}>
//                           {convertDate(cv?.meetingDate).dateLabel}
//                         </Typography>
//                         <Typography sx={{ color: "#047AE9", fontWeight: "bold", fontSize: "12px" }}>
//                           {convertDate(cv?.meetingDate).timeLabel}
//                         </Typography>
//                       </Box>
//                       <Box sx={{ ml: 2, mt: 1 }}>
//                         <Typography style={{ fontSize: "12px", fontWeight: "bold", color: "white" }} sx={{ mt: 1 }}>
//                           {cv?.projectId?.name}
//                         </Typography>

//                         <Typography style={{ fontSize: "11px", color: "white" }}>
//                           {`${cv?.organizer?.first_name} ${cv?.organizer?.last_name}`}
//                         </Typography>
//                         <Typography style={{ fontSize: "11px", color: "white" }} sx={{ mt: 1 }}>
//                           {cv?.client?.name}
//                         </Typography>
//                         <Typography style={{ fontSize: "11px", color: "white" }}>
//                           2BHK, 1850 SqFt
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <Divider sx={{ mt: 1.5, borderTop: "2px dotted #8EBBF8" }} />
//                   </>
//                 )}
//               </>
//             );
//           })}
//           {notification?.upcomingclientvisit?.length >= 2 && (
//             <>
//               <Divider sx={{ mt: 1.5, backgroundColor: "#8EBBF8" }} />
//               <Box
//                 style={{ color: "white", display: "flex", flexDirection: "row", justifyContent: "center" }}
//                 sx={{ mt: 0.8, ml: 2 }}
//               >
//                 {!showAll && (
//                   <Typography
//                     style={{ fontSize: "12px", fontWeight: "bold", color: "white", cursor: "pointer" }}
//                     onClick={handleViewAll}
//                   >
//                     View All
//                   </Typography>
//                 )}
//                 {showAll && (
//                   <Typography
//                     style={{ fontSize: "12px", fontWeight: "bold", color: "white", cursor: "pointer" }}
//                     onClick={() => setShowAll(false)}
//                   >
//                     View Less
//                   </Typography>
//                 )}
//                 <ChevronRightTwoToneIcon sx={{ fontSize: 26, fontWeight: "100", mt: "-4px", ml: "-2px", cursor: "pointer" }} />
//               </Box>
//             </>
//           )}
//         </Box>

//         <Box sx={{
//           width: "100%",
//           backgroundColor: "#F5D06E",
//           height: "auto",
//           borderRadius: "10px",
//           mt: 1.5,
          
//           cursor: 'pointer'
//         }}
//           onClick={() => { navigate('/events_polls') }}
//         >
//           <Box>
//             <Box sx={{ p: "12px"}}>
//               <Typography style={{ fontSize: "12px", fontWeight: "bold" }} >
//                 Upcoming Events ({notification?.totalupcomingevent})
//               </Typography>
//             </Box>
//             <Divider sx={{ backgroundColor: '#F8E0A0' }} />
//             <Box sx={{ ml: "14px"}}>

//               <Typography style={{ fontSize: "12px", fontWeight: "bold" }} sx={{ mt: 1.5 }}>
//                 {notification?.upcomingevent?.title}
//               </Typography>
//               <Typography style={{ fontSize: "12px" }}>
//                 {notification?.upcomingevent?.description}
//               </Typography>
//               <Typography style={{ fontSize: "12px" }} sx={{ py: 1.5 }}>
//                 {notification?.upcomingevent?.eventTime?.startTime && new Date(notification?.upcomingevent?.eventTime?.startTime).toLocaleString('en-Us', options)}
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//         <Box>
//           {Object.keys(groupedData).map((date) => (
//             <React.Fragment key={date}>
//               <Box
//                 sx={{
//                   width: "100%",
//                   backgroundColor: "#D8E0ED",
//                   height: "30px",
//                   borderRadius: "6px",
//                   mt: 1.5
//                 }}
//               >
//                 <Box
//                   style={{ display: 'flex', flexDirection: 'row' }}
//                   sx={{ p: '6px' }}
//                 >
//                   <Typography sx={{ ml: 1 }}>{formatDate(date)}</Typography>
//                 </Box>
//               </Box>
//               {groupedData[date].map((item) => (
//                 <Box
//                   key={item._id}
//                   sx={{ mt: 1 }}
//                   style={{ display: 'flex', flexDirection: 'row' }}
//                 >
//                   <Box>
//                     <Avatar alt="Travis Howard" src={item.profileImage} sx={{ width: 60, height: 60 }} />
//                   </Box>
//                   <Box sx={{ ml: 1, display: "flex", justifyContent: 'center', alignItems: 'center' }} >
//                     <Typography style={{ fontSize: "13px", color: "#3D3D3D" }}>
//                       {item.message}
//                     </Typography>
//                   </Box>
//                 </Box>
//               ))}
//               <Divider sx={{ mt: 1, borderTop: '2px dotted #B3C1D6' }} />
//             </React.Fragment>
//           ))}
//         </Box>
//         {/* <Box>
//           <Box sx={{
//             width: "100%",
//             backgroundColor: "#D8E0ED",
//             height: "30px",
//             borderRadius: "6px",
//             mt: 1.5
//           }}>
//             <Box style={{ display: 'flex', flexDirection: 'row' }} sx={{ p: "6px" }}>
//               <Typography>
//                 Today
//               </Typography>
//               <Typography sx={{ ml: 1 }}>
//                 June 30
//               </Typography>
//             </Box>

//           </Box>
//           <Box sx={{ mt: 1 }} style={{ display: 'flex', flexDirection: 'row' }}>
//             <Box>
//               <Avatar alt="Travis Howard" src="/static/images/person/User11.png" sx={{ width: 60, height: 60 }} />
//             </Box>
//             <Box sx={{ ml: 1, mt: 1 }}>
//               <Typography style={{ fontSize: "13px", color: "#3D3D3D" }}>
//                 Prakash Choudhary hello friend Desgin A Dashboard
//               </Typography>
//             </Box>
//           </Box>
//           <Divider sx={{ mt: 1, borderTop: '2px dotted #B3C1D6', }} />
//           <Box sx={{ mt: 1 }} style={{ display: 'flex', flexDirection: 'row' }}>
//             <Box>
//               <Avatar alt="Travis Howard" src="/static/images/person/User11.png" sx={{ width: 60, height: 60 }} />
//             </Box>
//             <Box sx={{ ml: 1, mt: 1 }}>
//               <Typography style={{ fontSize: "13px", color: "#3D3D3D" }}>
//                 Prakash Choudhary
//               </Typography>
//             </Box>
//           </Box>
//           <Divider sx={{ mt: 1.5, borderTop: '2px dotted #B3C1D6', }} />

//         </Box>
//         <Box>
//           <Box sx={{
//             width: "100%",
//             backgroundColor: "#D8E0ED",
//             height: "30px",
//             borderRadius: "6px",

//           }}>
//             <Box style={{ display: 'flex', flexDirection: 'row' }} sx={{ p: "6px" }}>

//               <Typography>
//                 June 30
//               </Typography>
//             </Box>

//           </Box>
//           <Box sx={{ mt: 1 }} style={{ display: 'flex', flexDirection: 'row' }}>
//             <Box>
//               <Avatar alt="Travis Howard" src="/static/images/person/User11.png" sx={{ width: 60, height: 60 }} />
//             </Box>
//             <Box sx={{ ml: 1, mt: 1 }}>
//               <Typography style={{ fontSize: "13px", color: "#3D3D3D" }}>
//                 Prakash Choudhary
//               </Typography>
//             </Box>
//           </Box>
//           <Divider sx={{ mt: 1.5, borderTop: '2px dotted #B3C1D6', }} />
//           <Box sx={{ mt: 1 }} style={{ display: 'flex', flexDirection: 'row' }}>
//             <Box>
//               <Avatar alt="Travis Howard" src="/static/images/person/User11.png" sx={{ width: 60, height: 60 }} />
//             </Box>
//             <Box sx={{ ml: 1, mt: 1 }}>
//               <Typography style={{ fontSize: "13px", color: "#3D3D3D" }}>
//                 Prakash Choudhary
//               </Typography>
//             </Box>
//           </Box>
//           <Divider sx={{ mt: 1.5, borderTop: '2px dotted #B3C1D6', }} />

//         </Box> */}
//       </Box>
//     </>
//   );
// }

// export default NotificationDashboard;


import React, { useState } from "react";
import { Box, Divider, Typography, Avatar } from "@mui/material";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

// Dummy data
const dummyNotification = {
  totalclientvisit: [
    {
      _id: "1",
      organizer: {
        first_name: "John",
        last_name: "Smith"
      },
      meetingDate: "2025-12-15T14:30:00",
      client: {
        name: "Robert Johnson"
      },
      projectId: {
        name: "sunrise heights"
      }
    }
  ],
  totalregistartion: [
    {
      _id: "2",
      clientId: {
        broker: {
          first_name: "Sarah",
          last_name: "Williams"
        },
        name: "Michael Brown",
        project: {
          name: "Ocean View Apartments"
        },
        _id: "client_2"
      },
      createdAt: "2025-12-14T10:00:00"
    }
  ],
  totalbooking: [
    {
      _id: "3",
      clientId: {
        broker: {
          first_name: "David",
          last_name: "Miller"
        },
        name: "Emily Davis",
        project: {
          name: "Garden Residency"
        },
        _id: "client_3"
      },
      createdAt: "2025-12-13T16:45:00"
    }
  ],
  upcomingclientvisit: [
    {
      _id: "4",
      meetingDate: "2025-12-20T11:00:00",
      organizer: {
        first_name: "James",
        last_name: "Wilson"
      },
      client: {
        name: "Lisa Anderson"
      },
      projectId: {
        name: "Skyline Towers"
      }
    },
    {
      _id: "5",
      meetingDate: "2025-12-22T15:30:00",
      organizer: {
        first_name: "Mary",
        last_name: "Taylor"
      },
      client: {
        name: "Tom Martinez"
      },
      projectId: {
        name: "Riverside Plaza"
      }
    }
  ],
  upcomingevent: {
    title: "Annual Property Expo 2025",
    description: "Join us for the biggest real estate exhibition of the year",
    eventTime: {
      startTime: "2025-12-25T09:00:00"
    }
  },
  totalupcomingevent: 1
};

const dummyAllNotification = [
  {
    _id: "6",
    message: "Prakash Choudhary commented on the Q4 Sales Report",
    createdAt: "2025-12-14T09:30:00",
    profileImage: null
  },
  {
    _id: "7",
    message: "Jennifer Lee shared a new document with you",
    createdAt: "2025-12-13T14:20:00",
    profileImage: null
  }
];

function NotificationDashboard() {
  const [showDetails, setShowDetails] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleArrowIconClick = () => {
    setShowDetails(!showDetails);
  };
  const handleArrowClick = () => {
    setShowRegistrations(!showRegistrations);
  };
  const handleArrowIcon = () => {
    setShowBookings(!showBookings);
  };
  const handleViewAll = () => {
    setShowAll(true);
  };

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    let dateLabel = "";
    if (date.toDateString() === today.toDateString()) {
      dateLabel = "Today";
    } else {
      dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    const timeLabel = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    return { dateLabel, timeLabel };
  };

  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  const groupDataByDate = (dataArray) => {
    const groupedData = {};
    dataArray.forEach((item) => {
      const date = new Date(item.createdAt).toLocaleDateString();
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(item);
    });
    return groupedData;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const currentDate = new Date();
    let data;
    if (date.toDateString() === currentDate.toDateString()) {
      data = `Today ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
    } else {
      data = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }
    return data;
  };

  const groupedData = groupDataByDate(dummyAllNotification);

  const getInitials = (message) => {
    const words = message.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  return (
    <Box
      py={2}
      px={3}
      sx={{
        backgroundColor: '#E9EEF4',
        minHeight: '100vh',
      }}
    >
      {/* Client Visit Request */}
      <Box
        sx={{
          width: "95%",
          backgroundColor: "#FDFEFF",
          height: "45px",
          borderRadius: "10px",
          border: "1.5px solid #0078E9",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            style={{ color: '#605843', fontSize: "12px", fontWeight: 'bold', marginLeft: '1.5rem' }}
          >
            New Client Visit Request
          </Typography>
        </Box>
        <Box style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem' }}>
          <Box
            sx={{
              width: '27px',
              height: '27px',
              borderRadius: '50%',
              backgroundColor: '#0078E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '6px',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {dummyNotification.totalclientvisit.length}
            </Typography>
          </Box>
          {showDetails ? (
            <KeyboardArrowUpRoundedIcon
              sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
              onClick={handleArrowIconClick}
            />
          ) : (
            <KeyboardArrowDownRoundedIcon
              sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
              onClick={handleArrowIconClick}
            />
          )}
        </Box>
      </Box>

      {showDetails &&
        dummyNotification.totalclientvisit.map((data) => {
          return (
            <Box
              key={data._id}
              sx={{
                width: "95%",
                backgroundColor: "#F4F7FA",
                height: "115px",
                borderRadius: "10px",
                mt: 1.5,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ ml: { xs: 2, sm: 3 }, flex: 1 }}>
                <Typography style={{ fontSize: "11px", fontWeight: "bold" }} sx={{ mt: { xs: 1.5, sm: 0 } }}>
                  {`Visit Requested by ${data.organizer.first_name} ${data.organizer.last_name}`}
                </Typography>
                <Typography style={{ fontSize: "10px", color: "#939494" }}>
                  {new Date(data.meetingDate).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    timeZone: "Asia/Kolkata",
                  })}
                </Typography>
                <Typography style={{ fontSize: "11px" }} sx={{ mt: 1 }}>
                  {data.client.name}
                </Typography>
                <Typography style={{ fontSize: "11px" }}>
                  {data.projectId.name.toUpperCase()}
                </Typography>
                <Typography style={{ fontSize: "11px" }}>2BHK, 1850 SqFt</Typography>
              </Box>
              <Box sx={{ mt: { xs: 2, sm: 6 }, mr: { xs: 0, sm: 2 } }}>
                <CheckCircleRoundedIcon
                  sx={{ fontSize: 32, fontWeight: "100", color: "#00C45F", cursor: "pointer" }}
                />
                <CancelRoundedIcon
                  sx={{ fontSize: 32, fontWeight: "100", color: "#F3512F", ml: 0.5, cursor: "pointer" }}
                />
              </Box>
            </Box>
          );
        })}

      {/* Registration Request */}
      <Box py={1}>
        <Box
          sx={{
            width: "95%",
            backgroundColor: "#FDFEFF",
            height: "45px",
            borderRadius: "10px",
            border: "1.5px solid #CF99CA",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              style={{ color: '#605843', fontWeight: 'bold', fontSize: "12px", marginLeft: '1.5rem' }}
            >
              Client Registration Request
            </Typography>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem' }}>
            <Box
              sx={{
                width: '27px',
                height: '27px',
                borderRadius: '50%',
                backgroundColor: '#CF99CA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '6px',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {dummyNotification.totalregistartion.length}
              </Typography>
            </Box>
            {showRegistrations ? (
              <KeyboardArrowUpRoundedIcon
                sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
                onClick={handleArrowClick}
              />
            ) : (
              <KeyboardArrowDownRoundedIcon
                sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
                onClick={handleArrowClick}
              />
            )}
          </Box>
        </Box>

        {showRegistrations &&
          dummyNotification.totalregistartion.map(data => {
            return (
              <Box
                key={data._id}
                sx={{
                  width: "95%",
                  backgroundColor: "#F4F7FA",
                  height: "115px",
                  borderRadius: "10px",
                  mt: 1.5,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ ml: { xs: 2, sm: 4 }, flex: 1 }}>
                  <Typography style={{ fontSize: "11px", fontWeight: "bold" }} sx={{ mt: { xs: 1.5, sm: 0 } }}>
                    {`Registration Requested by ${data.clientId.broker.first_name} ${data.clientId.broker.last_name}`}
                  </Typography>
                  <Typography style={{ fontSize: "10px", color: "#939494" }}>
                    {new Date(data.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      timeZone: "Asia/Kolkata"
                    })}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }} sx={{ mt: 1 }}>
                    {data.clientId.name}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }}>
                    {data.clientId.project.name}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }}>2BHK, 1850 SqFt</Typography>
                </Box>
                <Box sx={{ mt: { xs: 2, sm: 6 }, mr: { xs: 0, sm: 2 } }}>
                  <CheckCircleRoundedIcon
                    sx={{ fontSize: 32, fontWeight: "100", color: "#00C45F", cursor: "pointer" }}
                  />
                  <CancelRoundedIcon
                    sx={{ fontSize: 32, fontWeight: "100", color: "#F3512F", ml: 0.5, cursor: "pointer" }}
                  />
                </Box>
              </Box>
            );
          })}
      </Box>

      {/* Booking Request */}
      <Box mb={1}>
        <Box
          sx={{
            width: "95%",
            backgroundColor: "#FDFEFF",
            height: "45px",
            borderRadius: "10px",
            border: "1.5px solid #49D0DA",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              style={{ color: '#605843', fontWeight: 'bold', fontSize: "12px", marginLeft: '1.5rem' }}
            >
              Booking Request
            </Typography>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem' }}>
            <Box
              sx={{
                width: '27px',
                height: '27px',
                borderRadius: '50%',
                backgroundColor: '#49D0DA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '6px',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {dummyNotification.totalbooking.length}
              </Typography>
            </Box>
            {showBookings ? (
              <KeyboardArrowUpRoundedIcon
                sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
                onClick={handleArrowIcon}
              />
            ) : (
              <KeyboardArrowDownRoundedIcon
                sx={{ fontSize: 30, fontWeight: '100', cursor: "pointer" }}
                onClick={handleArrowIcon}
              />
            )}
          </Box>
        </Box>

        {showBookings &&
          dummyNotification.totalbooking.map(data => {
            return (
              <Box
                key={data._id}
                sx={{
                  width: "95%",
                  backgroundColor: "#F4F7FA",
                  height: "115px",
                  borderRadius: "10px",
                  mt: 1.5,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ ml: { xs: 2, sm: 4 }, flex: 1 }}>
                  <Typography style={{ fontSize: "11px", fontWeight: "bold" }} sx={{ mt: { xs: 1.5, sm: 0 } }}>
                    {`Booking Requested by ${data.clientId.broker.first_name} ${data.clientId.broker.last_name}`}
                  </Typography>
                  <Typography style={{ fontSize: "10px", color: "#939494" }}>
                    {new Date(data.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      timeZone: "Asia/Kolkata"
                    })}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }} sx={{ mt: 1 }}>
                    {data.clientId.name}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }}>
                    {data.clientId.project.name}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }}>2BHK, 1850 SqFt</Typography>
                </Box>
                <Box sx={{ mt: { xs: 2, sm: 6 }, mr: { xs: 0, sm: 2 } }}>
                  <CheckCircleRoundedIcon
                    sx={{ fontSize: 32, fontWeight: "100", color: "#00C45F", cursor: "pointer" }}
                  />
                  <CancelRoundedIcon
                    sx={{ fontSize: 32, fontWeight: "100", color: "#F3512F", ml: 0.5, cursor: "pointer" }}
                  />
                </Box>
              </Box>
            );
          })}
      </Box>

      <Typography py={1} sx={{ fontSize: "14px", fontWeight: 'bold' }}>
        NOTIFICATIONS
      </Typography>

      {/* Upcoming Client Visits */}
      <Box
        sx={{
          mt: 0.5,
          width: "100%",
          backgroundColor: "#4991F4",
          height: showAll ? "auto" : "auto",
          borderRadius: "10px",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Typography
            style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}
            sx={{ mt: 2 }}
          >
            Your Upcoming Client Visits ({dummyNotification.upcomingclientvisit.length})
          </Typography>
          <KeyboardArrowUpRoundedIcon
            sx={{ fontSize: 30, fontWeight: "100", color: "white", mt: 1, cursor: "pointer" }}
          />
        </Box>
        <Divider sx={{ mt: 1.5, backgroundColor: "#8EBBF8" }} />

        {dummyNotification.upcomingclientvisit.slice(0, 2).map((cv) => {
          return (
            <React.Fragment key={cv._id}>
              <Box style={{ display: "flex", flexDirection: "row" }}>
                <Box
                  sx={{
                    padding: "12px",
                    marginTop: "9px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "32%",
                    backgroundColor: "#E9EEF4",
                    height: "92px",
                    borderRadius: "10px",
                    marginLeft: "15px",
                  }}
                >
                  <Typography sx={{ color: "#047AE9", fontWeight: "bold", fontSize: "12px" }}>
                    {convertDate(cv.meetingDate).dateLabel}
                  </Typography>
                  <Typography sx={{ color: "#047AE9", fontWeight: "bold", fontSize: "12px" }}>
                    {convertDate(cv.meetingDate).timeLabel}
                  </Typography>
                </Box>
                <Box sx={{ ml: 2, mt: 1 }}>
                  <Typography style={{ fontSize: "12px", fontWeight: "bold", color: "white" }} sx={{ mt: 1 }}>
                    {cv.projectId.name}
                  </Typography>
                  <Typography style={{ fontSize: "11px", color: "white" }}>
                    {`${cv.organizer.first_name} ${cv.organizer.last_name}`}
                  </Typography>
                  <Typography style={{ fontSize: "11px", color: "white" }} sx={{ mt: 1 }}>
                    {cv.client.name}
                  </Typography>
                  <Typography style={{ fontSize: "11px", color: "white" }}>
                    2BHK, 1850 SqFt
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mt: 1.5, borderTop: "2px dotted #8EBBF8" }} />
            </React.Fragment>
          );
        })}

        {dummyNotification.upcomingclientvisit.slice(2).map((cv) => {
          return (
            <React.Fragment key={cv._id}>
              {showAll && (
                <>
                  <Box style={{ display: "flex", flexDirection: "row" }}>
                    <Box
                      sx={{
                        padding: "12px",
                        marginTop: "9px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "32%",
                        backgroundColor: "#E9EEF4",
                        height: "92px",
                        borderRadius: "10px",
                        marginLeft: "15px",
                      }}
                    >
                      <Typography sx={{ color: "#047AE9", fontWeight: "bold", fontSize: "12px" }}>
                        {convertDate(cv.meetingDate).dateLabel}
                      </Typography>
                      <Typography sx={{ color: "#047AE9", fontWeight: "bold", fontSize: "12px" }}>
                        {convertDate(cv.meetingDate).timeLabel}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2, mt: 1 }}>
                      <Typography style={{ fontSize: "12px", fontWeight: "bold", color: "white" }} sx={{ mt: 1 }}>
                        {cv.projectId.name}
                      </Typography>
                      <Typography style={{ fontSize: "11px", color: "white" }}>
                        {`${cv.organizer.first_name} ${cv.organizer.last_name}`}
                      </Typography>
                      <Typography style={{ fontSize: "11px", color: "white" }} sx={{ mt: 1 }}>
                        {cv.client.name}
                      </Typography>
                      <Typography style={{ fontSize: "11px", color: "white" }}>
                        2BHK, 1850 SqFt
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 1.5, borderTop: "2px dotted #8EBBF8" }} />
                </>
              )}
            </React.Fragment>
          );
        })}

        {dummyNotification.upcomingclientvisit.length >= 2 && (
          <>
            <Divider sx={{ mt: 1.5, backgroundColor: "#8EBBF8" }} />
            <Box
              style={{ color: "white", display: "flex", flexDirection: "row", justifyContent: "center" }}
              sx={{ mt: 0.8, ml: 2 }}
            >
              {!showAll && (
                <Typography
                  style={{ fontSize: "12px", fontWeight: "bold", color: "white", cursor: "pointer" }}
                  onClick={handleViewAll}
                >
                  View All
                </Typography>
              )}
              {showAll && (
                <Typography
                  style={{ fontSize: "12px", fontWeight: "bold", color: "white", cursor: "pointer" }}
                  onClick={() => setShowAll(false)}
                >
                  View Less
                </Typography>
              )}
              <ChevronRightTwoToneIcon sx={{ fontSize: 26, fontWeight: "100", mt: "-4px", ml: "-2px", cursor: "pointer" }} />
            </Box>
          </>
        )}
      </Box>

      {/* Upcoming Events */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#F5D06E",
          height: "auto",
          borderRadius: "10px",
          mt: 1.5,
          cursor: 'pointer'
        }}
      >
        <Box>
          <Box sx={{ p: "12px" }}>
            <Typography style={{ fontSize: "12px", fontWeight: "bold" }}>
              Upcoming Events ({dummyNotification.totalupcomingevent})
            </Typography>
          </Box>
          <Divider sx={{ backgroundColor: '#F8E0A0' }} />
          <Box sx={{ ml: "14px" }}>
            <Typography style={{ fontSize: "12px", fontWeight: "bold" }} sx={{ mt: 1.5 }}>
              {dummyNotification.upcomingevent.title}
            </Typography>
            <Typography style={{ fontSize: "12px" }}>
              {dummyNotification.upcomingevent.description}
            </Typography>
            <Typography style={{ fontSize: "12px" }} sx={{ py: 1.5 }}>
              {dummyNotification.upcomingevent.eventTime.startTime && new Date(dummyNotification.upcomingevent.eventTime.startTime).toLocaleString('en-Us', options)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Recent Notifications */}
      <Box>
        {Object.keys(groupedData).map((date) => (
          <React.Fragment key={date}>
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#D8E0ED",
                height: "30px",
                borderRadius: "6px",
                mt: 1.5
              }}
            >
              <Box
                style={{ display: 'flex', flexDirection: 'row' }}
                sx={{ p: '6px' }}
              >
                <Typography sx={{ ml: 1 }}>{formatDate(date)}</Typography>
              </Box>
            </Box>
            {groupedData[date].map((item) => (
              <Box
                key={item._id}
                sx={{ mt: 1 }}
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <Box>
                  {item.profileImage ? (
                    <Avatar alt="User" src={item.profileImage} sx={{ width: 60, height: 60 }} />
                  ) : (
                    <Avatar sx={{ width: 60, height: 60, bgcolor: '#4991F4' }}>
                      {getInitials(item.message)}
                    </Avatar>
                  )}
                </Box>
                <Box sx={{ ml: 1, display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                  <Typography style={{ fontSize: "13px", color: "#3D3D3D" }}>
                    {item.message}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Divider sx={{ mt: 1, borderTop: '2px dotted #B3C1D6' }} />
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

export default NotificationDashboard;