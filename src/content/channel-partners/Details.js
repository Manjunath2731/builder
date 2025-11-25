import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { toUpper, toUpperMutliple } from 'src/utils/utilits';
// import { showNotification } from 'src/utils/commonUtility.js';
// import { notificationType } from 'src/constants/NotificationType.js';
import DeleteConfirmation from 'src/components/Projects/Drafts/DeleteConfirmation.js';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Loader from 'src/UI/Loader/Loader.js';

import {
  Grid,
  Box,
  Avatar,
  Divider,
  Card,
  styled,
  useTheme,
  Typography,
  Button,
  TextField,
  CircularProgress
} from '@mui/material';
// import {
//   CircularProgressbarWithChildren,
//   buildStyles
// } from 'react-circular-progressbar';
import "./Details.css";



// import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import {
  getBrokersDetailById,
  getCompanyDetailById,
  getBrokerClientDetailsById,
  deleteSliceData,
  deleteChannelPartner,
  postNotes,
  addNotes,
  updateNotes,
  // totalUsers,
  assignUser,
  getNotification
} from '../../slices/channelPartner.js';
import DetailsPopup from '../../components/Details-popup/detailsPopup';
import ChannelVists from './ChannelVists.js';
import ChannelRegistrations from './ChannelRegistrations.js';
import ChannelBookings from './ChannelBookings.js';
import OpenNotification from '../ShowNotification';



// const defaultTimelineData = [
//   {
//     key: 1,
//     count: "20",
//     date: "23 Aug",
//     title: "School Graduation",
//     location: "Company XYZ",
//     description: "Worked on various projects...",
//   },
//   {
//     key: 2,
//     count: "20",
//     date: "23 Aug",
//     title: "School Graduation",
//     location: "Company XYZ",
//     description: "Worked on various projects...",
//   },
//   {
//     key: 3,
//     count: "20",
//     date: "23 Aug",
//     title: "School Graduation",
//     location: "Company XYZ",
//     description: "Worked on various projects...",
//   },
//   {
//     key: 4,
//     count: "20",
//     date: "23 Aug",
//     title: "School Graduation",
//     location: "Company XYZ",
//     description: "Worked on various projects...",
//   },
//   {
//     key: 5,
//     count: "20",
//     date: "23 Aug",
//     title: "School Graduation",
//     location: "Company XYZ",
//     description: "Worked on various projects...",
//   },


// ];



export const isValid = (str) => {
  if (
    str !== null &&
    str !== undefined &&
    str !== '' &&
    str !== 'null' &&
    str !== 'undefined'
  ) {
    return true;
  }
  return false;
};
const renderDate = (str) => {
  let date = new Date(str).toLocaleDateString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  return date;
};
const DotLegend = styled('span')(
  ({ theme }) => `
        border-radius: 22px;
        width: ${theme.spacing(1.5)};
        height: ${theme.spacing(1.5)};
        display: inline-block;
        margin-right: ${theme.spacing(0.5)};
        border: ${theme.colors.alpha.white[100]} solid 2px;
    `
);

// const CircularProgressBar = ({ progressColor, item }) => {
//   const theme = useTheme();
//   const { label, value, total } = item;
//   let nameList = label.split(' ').slice();
//   return (
//     <>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           rowGap: 1.5
//         }}
//       >
//         <Box
//           sx={{
//             width: { lg: '140px', xs: '100px', md: '125px' }
//           }}
//         >
//           <CircularProgressbarWithChildren
//             circleRatio={1}
//             styles={buildStyles({
//               rotation: 1 / 2.2 + 1 / 5.85,
//               trailColor: theme.palette.grey[300],
//               pathColor: progressColor,
//               strokeLinecap: 'butt'
//             })}
//             strokeWidth={14}
//             value={(value / total) * 100}
//           >
//             <Box
//               sx={{
//                 mt: '-12px'
//               }}
//             >
//               <Typography variant="h3">{value}</Typography>
//             </Box>
//           </CircularProgressbarWithChildren>
//         </Box>
//         <Box>
//           {nameList.map((item, index) => {
//             return <Typography key={index}>{item}</Typography>;
//           })}
//         </Box>
//       </Box>
//     </>
//   );
// };
// const NamePhone = ({ name, phone }) => {
//   const theme = useTheme();
//   return (
//     <>
//       <Typography sx={{ fontSize: `${theme.typography.pxToRem(17)}` }}>
//         {name}
//       </Typography>
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'flex-start'
//         }}
//       >
//         <LocalPhoneOutlinedIcon fontSize="large" sx={{ color: '#1cc45f' }} />
//         <Typography sx={{ fontSize: `${theme.typography.pxToRem(17)}` }} ml={1}>
//           {phone}
//         </Typography>
//       </Box>
//     </>
//   );
// };
const NumberView = ({ num, document }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      <Typography
        sx={{
          fontSize: `${theme.typography.pxToRem(15)}`,
          fontWeight: num ? "bold" : "",
          color: num ? "black" : "#A0A0A0",
          ml: 1,
        }}
      >
        {num || 'Not Yet Uploaded'}
      </Typography>
      <Typography
        sx={{
          fontSize: `${theme.typography.pxToRem(15)}`,
          fontWeight: "bold",
          color: theme.palette.primary.main,
          cursor: 'pointer'
        }}
        ml={1}
        onClick={() => {
          const win = window.open(document);
          win.focus();
        }}
      >
        {document && 'View'}
      </Typography>
    </Box>
  );
};
const Details = () => {




  const navigate = useNavigate();
  const theme = useTheme();
  const { brokerId, companyId } = useParams();
  // const [clientList, setClientList] = useState([]);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectDeleteId, setSelectDeleteId] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isSubmitting, setIsSubbmitting] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isAssign, setAssign] = useState(false);
 
  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  
  
  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        navigate(`/channel_partners`);
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };


  const handleConfirmDelete = () => {
    setOpenDeleteConfirmation(true);
  };
  const closeConfirmDelete = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleDelete = async (id) => {
    setOpenDeleteConfirmation(false);
    await deleteChannelPartner(id)
      .then(() => {
        
        // showNotification(
        //   'Sucessfully Deleted channel partner',
        //   notificationType.SUCCESS
        // );
      setOpenNoti(true); 
      setSuccessMessage( 'Sucessfully Deleted channel partner');
      // setIsLoading(false);
      })
      .catch((error) => {
        let errorMessage =
          error?.response?.data?.message || 'Something went wrong';
        // showNotification(errorMessage, notificationType.ERROR);
        setErrorMessage(errorMessage);
        setOpenNoti(true);
      });
  };


  const dispatch = useDispatch();

  let brokerDetail = {};
  let brokerClientDetails = {};
  let companyDetails = {};
  let totalBrokers = [];
  brokerDetail = useSelector((state) => state.channelPartner.brokerDetailById);
  brokerClientDetails = useSelector(
    (state) => state.channelPartner.brokerClientDetailsById
  );
  const notesData = useSelector((state) => state?.channelPartner?.notes);
  companyDetails = useSelector((state) => state.channelPartner.companyDetails);
  totalBrokers = useSelector((state) => state.channelPartner.totalBrokers);
  const notification = useSelector((state) => state.channelPartner.notification);
  console.log("notification", notification);

  const handleSave = async () => {
    setIsSubbmitting(true);
    if (!notesData?.notes) {
      await postNotes({ notes, userId: brokerId })
        .then(() => {
          dispatch(addNotes(brokerId));
          let sucessMessage = 'Sucessfully Created Notes';
          // showNotification(sucessMessage, notificationType.SUCCESS);
          setOpenNoti(true); 
          setSuccessMessage(sucessMessage);
          setIsSubbmitting(false);
          setShowNotes(false);
        })
        .catch((error) => {
          setNotes('');
          let errorMessage =
            error?.response?.data?.message || 'Something went wrong';
          // showNotification(errorMessage, notificationType.ERROR);
          setErrorMessage(errorMessage);
        setOpenNoti(true);
          setIsSubbmitting(false);
        });
    } else {
      await updateNotes({ notes, userId: brokerId })
        .then(() => {
          dispatch(addNotes(brokerId));
          let sucessMessage = 'Sucessfully saved the Notes';
          // showNotification(sucessMessage, notificationType.SUCCESS);
          setOpenNoti(true); 
          setSuccessMessage(sucessMessage);
          setIsSubbmitting(false);
          setShowNotes(false);
        })
        .catch((error) => {
          setNotes('');
          let errorMessage =
            error?.response?.data?.message || 'Something went wrong';
          // showNotification(errorMessage, notificationType.ERROR);
          setErrorMessage(errorMessage);
          setOpenNoti(true);
          setIsSubbmitting(false);
        });
    }
  };
  useEffect(() => {
    dispatch(getBrokersDetailById(brokerId));
    if (_.isEmpty(brokerDetail)) {
      if (isValid(companyId)) {
        dispatch(getCompanyDetailById(companyId));
      }
      dispatch(getBrokerClientDetailsById(brokerId));
    }
    dispatch(getNotification(brokerId));
  }, []);
  useEffect(() => {
    dispatch(addNotes(brokerId));
    if (notesData?.notes) {
      setNotes(notesData?.notes);
    } else {
      setNotes('');
    }
  }, [notesData?.notes]);

  // useEffect(() => {
  //   dispatch(totalUsers(brokerId));
  // }, []);

  const handleAssign = async (userId) => {
    setAssign(true);
    const email = brokerDetail?.email;
    const phoneNumber = brokerDetail?.phoneNumber;

    await assignUser({ brokerId, userId, email, phoneNumber })
      .then(() => {
        let sucessMessage = 'Sucessfully Assigned';
        // showNotification(sucessMessage, notificationType.SUCCESS);
        setOpenNoti(true); 
        setSuccessMessage(sucessMessage);
      })
      .catch(() => {
        let errorMessage = `Already assigned with the same builder`;
        // showNotification(errorMessage, notificationType.ERROR);
        setErrorMessage(errorMessage);
        setOpenNoti(true);
        setAssign(false);
        setOpen(false);
      });
    setOpen(false);
    setAssign(false);
  };
  const copy = (type) => {
    const el = document.createElement('input');
    el.value = type === 'number' ? brokerDetail?.number : brokerDetail?.email;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // showNotification('Copied!', notificationType.SUCCESS);
    setOpenNoti(true); 
    setSuccessMessage('Copied!');
  };
  // useEffect(() => {
  //   if (!_.isEmpty(brokerClientDetails)) {
  //     setClientList([
  //       {
  //         label: 'Client Visits',
  //         value: brokerClientDetails?.clientVisitAccepted,
  //         total: brokerClientDetails?.totalClientVisit
  //       },
  //       {
  //         label: 'Client Registration',
  //         value: brokerClientDetails?.registrationAccepted,
  //         total: brokerClientDetails?.totalRegistration
  //       },
  //       {
  //         label: 'Client Bookings',
  //         value: brokerClientDetails?.bookingAccepted,
  //         total: brokerClientDetails?.totalBooking
  //       }
  //     ]);
  //   }
  // }, [brokerDetail, brokerClientDetails, companyDetails]);

  const companyDetailList = [
    { label: 'Builders Connected', value: companyDetails?.connectedBuilders, total: 180 },
    { label: 'Team Members', value: companyDetails?.teammember, total: 50 }
  ];

  if (_.isEmpty(brokerDetail) || _.isEmpty(brokerClientDetails)) {
    return <Loader />;
  }
  return (
    <>
      <Box sx={{ pl: { xs: 4, lg: 0 }, pr: { xs: 4, md: 4 }, ml: 4 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          cursor="pointer"
          mt={4}
          mb={1}
          columnGap={1}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            sx={{ cursor: 'pointer' }}
            color={theme.palette.primary.main}
            onClick={() => {
              navigate('/channel_partners');
              dispatch(deleteSliceData());
            }}
          >
            <ArrowBackIosNewIcon fontSize="16px" />
            <Typography
              variant="h4"
              sx={{ fontSize: `${theme.typography.pxToRem(13)}` }}
            >
              CHANNEL PARTNER REGISTERED WITH YOU
            </Typography>
          </Box>

          <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>
            {` / ${toUpper(brokerDetail?.first_name).toUpperCase()} ${toUpper(
              brokerDetail?.last_name
            ).toUpperCase()}`}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
              <Card sx={{ backgroundColor: '#EBEBEB', }} >
                <Box sx={{ py: { xs: 2, xl: 3 }, px: { xs: 3, xl: 6 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      <Avatar
                        sx={{
                          width: { sm: 90, xl: 118 },
                          height: { sm: 90, xl: 118 },
                          border: '11px solid #f4f4f4'
                        }}
                        alt="Remy Sharp"
                        src={brokerDetail?.profile_image}
                      />
                      <Box ml={3}>
                        <Typography variant="h4">{`${toUpper(
                          brokerDetail?.first_name
                        )} ${toUpper(brokerDetail?.last_name)}`}</Typography>
                        <Typography
                          sx={{
                            fontSize: `${theme.typography.pxToRem(15)}`,
                            mb: 1
                          }}
                          color="#6A6A6A"
                        >
                          {/* Company: */}
                          {toUpperMutliple(
                            brokerDetail.companyName
                          )}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { lg: 'row', xs: 'column' },
                            justifyContent: 'flex-start',
                            columnGap: 4
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}
                          >
                            {/* <LocalPhoneOutlinedIcon
                              sx={{
                                color: '#1cc45f',
                                fontSize: { xs: 'small', xl: 'large' }
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: `${theme.typography.pxToRem(17)}`
                              }}
                              ml={1}
                            >
                              {brokerDetail?.phoneNumber}
                            </Typography> */}
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                mt: 1.5
                              }}
                            >
                              <img src="/static/images/logo/call-icon-green.svg" alt="call" />
                              <Typography
                                variant="subtitle1"
                                sx={{ ml: 1, cursor: 'pointer', fontWeight: "bold" }}
                                onClick={() => copy('number')}
                              >
                                {brokerDetail?.phoneNumber || 'N/A'}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                ml: 2,
                                mt: 1.5
                              }}
                            >
                              <img src="/static/images/logo/email-icon-green.svg" alt="email" />
                              <Typography
                                variant="subtitle1"
                                sx={{ ml: 1, cursor: 'pointer', fontWeight: "bold" }}
                                onClick={() => copy('email')}
                              >
                                {brokerDetail?.email || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box>
                      <Typography>Last Login</Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start'
                        }}
                      >
                        <Typography mr={1} sx={{ color: "#A0A0A0" }}>Online Right Now </Typography>
                        <DotLegend
                          style={{
                            background: `${theme.colors.success.main}`
                          }}
                        />
                      </Box>
                      <Typography sx={{ mt: 3 }}> Member Since</Typography>
                      <Typography sx={{ color: "#A0A0A0" }}>
                        {renderDate(brokerDetail?.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>




              </Card>
              <Box sx={{ display: "flex", flexDirection: "row" }} mt={2}>
                <Grid item xs={12} lg={4} xl={4} mr={2}>
                  <ChannelVists brokerId={brokerId} />
                </Grid>
                <Grid item xs={12} lg={4} xl={4} mr={2}>
                  <ChannelRegistrations brokerId={brokerId} />
                </Grid>
                <Grid item xs={12} lg={4} xl={4} >
                  <ChannelBookings brokerId={brokerId} />
                </Grid>
              </Box>

              <Box py={3} pb={8}>
                <Typography sx={{ fontsize: "20px", fontWeight: "bold" }}> Name Timeline</Typography>
                <VerticalTimeline>
                  {notification.map((element) => {
                    const isWorkIcon = element?.icon === "work";
                    const date = new Date(element?.createdAt);

                    const months = [
                      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];

                    const day = date.getDate();
                    const month = months[date.getMonth()];

                    const formattedDate = `${day} ${month}`;

                    return (
                      <VerticalTimelineElement
                        key={element.key}
                        dateClassName="date"
                        iconStyle={
                          isWorkIcon ? { background: "#D8E0ED" } : { background: "#D8E0ED" }
                        }
                      >
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography sx={{ fontsize: "20px", fontWeight: "bold" }} id="count">
                              {element.count}
                            </Typography>
                            <Typography id="description">{formattedDate}</Typography >
                          </Box>
                          <Divider orientation="vertical" flexItem />
                          <Box>
                            {/* <Typography className="vertical-timeline-element-count" sx={{
                              backgroundColor: "#49D0DA", textAlign: "center", borderRadius: "3px", width: "fit-content",
                              padding: "5px"
                            }}>
                              {element.title}
                            </Typography>
                            <Typography className="vertical-timeline-element-count" sx={{ fontSize: "13px", mt: 0.5 }}>
                              {element.location}
                            </Typography>  */}
                            <Typography className="vertical-timeline-element-count" sx={{ fontSize: "13px" }}>
                              {element.message}
                            </Typography>
                          </Box>

                        </Box>




                      </VerticalTimelineElement>
                    );
                  })}
                </VerticalTimeline>
              </Box>


            </Grid>
            {isOpen ? (
              <DetailsPopup
                open={isOpen}
                onClose={() => {
                  setOpen(!isOpen);
                }}
                totalBrokers={totalBrokers}
                handleAssign={handleAssign}
                isAssign={isAssign}
              />
            ) : null}
            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
              <Card sx={{ backgroundColor: '#E2EAF2', }}  >
                <Box py={1.5} px={3}>

                  {!isValid(companyId) ? (
                    <>
                      <Box
                        display="flex"
                        justifyContent="center"
                        textAlign="center "
                      >
                        <Typography
                          pt={5}
                          sx={{
                            color: theme.palette.grey[500],
                            fontSize: {
                              xs: theme.typography.pxToRem(20),
                              xl: theme.typography.pxToRem(20)
                            }
                          }}
                          textAlign="center"
                        >
                          No Company Associated with this broker
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: "flex", flexDirection: "row" }} px={1}>
                        <Typography
                          my={1}
                          variant="h4"
                          sx={{ fontSize: `${theme.typography.pxToRem(17)}` }}
                        >
                          {toUpperMutliple(brokerDetail.companyName)}
                        </Typography>
                        <Typography
                          my={1.2}
                          sx={{
                            fontSize: `${theme.typography.pxToRem(12)}`, color: "#A0A0A0", ml: 0.5
                          }}
                        >
                          {`(${toUpper(companyDetails?.type)})`}
                        </Typography>
                      </Box>
                      <Box px={1}>
                        <Typography>
                          {companyDetails?.address}
                        </Typography>
                        <Typography> {companyDetails?.state}</Typography>
                      </Box>

                      <Box
                        sx={{
                          py: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          columnGap: 6,
                          flexDirection: 'row'
                        }}
                      >
                        {companyDetailList.map((item, index) => {
                          return (
                            <React.Fragment key={index}>
                              {/* <CircularProgressBar
                                progressColor="#1cc45f"
                                item={item}
                              /> */}
                              <Box px={1} py={1}
                                sx={{
                                  width: 180,
                                  height: 80,
                                  backgroundColor: '#F2F5F9',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'left',
                                  flexDirection: "column",
                                  borderRadius: "10px"
                                }}>
                                <Typography sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}>
                                  {item.label}
                                </Typography>
                                <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                                  {item?.value}
                                </Typography>
                              </Box>
                            </React.Fragment>


                          );
                        })}
                      </Box>
                      <Box>
                        <Grid container spacing={1} px={1}>

                          <Grid item xs={5} py={1.5}>
                            <Typography variant="h6">Contact Number:</Typography>
                          </Grid>
                          {isValid(companyDetails?.gstNumber) && (
                            <Grid item xs={7} py={1.5}>
                              <NumberView
                                num={companyDetails?.gstNumber}
                                document={companyDetails?.gstDocument}
                              />
                            </Grid>
                          )}

                          <Grid item xs={5} py={1.5}>
                            <Typography variant="h6">GST Number:</Typography>
                          </Grid>
                          {isValid(companyDetails?.gstNumber) && (
                            <Grid item xs={7} py={1.5}>
                              <NumberView
                                num={companyDetails?.gstNumber}
                                document={companyDetails?.gstDocument}
                              />
                            </Grid>
                          )}

                          <Grid item xs={5} py={1.5}>
                            <Typography variant="h6">RERA Number:</Typography>
                          </Grid>
                          <Grid item xs={7} py={1.5}>
                            <NumberView
                              num={companyDetails?.reraNumber}
                              document={companyDetails?.reraDocument}
                            />
                          </Grid>

                          <Grid item xs={5} py={1.5}>
                            <Typography variant="h6">PAN Number:</Typography>
                          </Grid>
                          {isValid(companyDetails?.panNumber) && (
                            <Grid item xs={7} py={1.5}>
                              <NumberView
                                num={companyDetails?.panNumber}
                                document={companyDetails?.panDocument}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Box>

                    </>
                  )}
                </Box>
              </Card>
              <Box>

                {!_.isEmpty(notesData) && !showNotes && (

                  <Box py={1.5}>
                    <Box sx={{ display: "flex", flexDirection: "row" }} py={0.7}>
                      <Typography lineHeight="2" sx={{ fontWeight: "bold", fontSize: `${theme.typography.pxToRem(16)}`, }}>
                        NOTES
                      </Typography>
                      <Typography py={1} px={0.5} sx={{
                        fontSize: `${theme.typography.pxToRem(12)}`, color: "#A0A0A0"
                      }}>
                        (Only visible to you)
                      </Typography>
                    </Box>
                    <Box px={2} py={2} sx={{
                      width: "100%",
                      height: "auto",
                      backgroundColor: '#EBEBEB',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'left',
                      flexDirection: "column",
                      borderRadius: "10px"
                    }}>
                      <Typography lineHeight="2">
                        {notesData?.notes}
                      </Typography>
                      <Typography
                        onClick={() => setShowNotes(true)}
                        sx={{
                          color: theme.palette.primary.main,
                          cursor: 'pointer', mt: 0.5
                        }}
                      >
                        Edit
                      </Typography>
                    </Box>

                    {/* <Typography variant="h4" lineHeight="2"> NOTES (ONLY VISIBLE TO YOU)</Typography>
                    <Typography lineHeight='2'> {notesData?.notes}</Typography>
                    <Typography
                      onClick={() => setShowNotes(true)}
                      sx={{
                        color: theme.palette.primary.main,
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </Typography> */}
                  </Box>
                )}
                {_.isEmpty(notesData) && (
                  <Box py={1.5} >
                    <Box sx={{ display: "flex", flexDirection: "row" }} py={0.7}>
                      <Typography lineHeight="2" sx={{ fontWeight: "bold", fontSize: `${theme.typography.pxToRem(16)}`, }}>
                        NOTES
                      </Typography>
                      <Typography py={1} px={0.5} sx={{
                        fontSize: `${theme.typography.pxToRem(12)}`, color: "#A0A0A0"
                      }}>
                        (Only visible to you)
                      </Typography>
                    </Box>
                    <Box px={2} py={2} sx={{
                      width: "100%",
                      height: "auto",
                      backgroundColor: '#EBEBEB',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'left',
                      flexDirection: "column",
                      borderRadius: "10px"
                    }}>
                      <Typography lineHeight="2">
                        You have not added any notes for this partner yet.
                      </Typography>
                      <Typography
                        lineHeight="2"
                        onClick={() => setShowNotes(true)}
                        sx={{
                          color: theme.palette.primary.main,
                          cursor: 'pointer'
                        }}
                      >
                        Add now
                      </Typography>
                    </Box>

                  </Box>
                )}

                <Box>
                  {showNotes && (
                    <Grid item xs={12}>
                      <Box py={1.5}>
                        <Box width="100%" mb={2} mt={2}>
                          <TextField
                            id="notes"
                            name="notes"
                            label="Notes"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            onChange={(event) => setNotes(event.target.value)}
                            value={notes}
                          />
                        </Box>
                        <Button
                          variant="contained"
                          startIcon={
                            isSubmitting ? (
                              <CircularProgress size="1rem" />
                            ) : null
                          }
                          disabled={isSubmitting || notes === '' || !showNotes}
                          onClick={() => handleSave()}
                        >
                          {notesData?.notes ? 'Save' : 'Add'}
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{ ml: 2 }}
                          onClick={() => {
                            setShowNotes(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Box>
                <Divider />
                <Box
                  py={1.5}
                  px={2}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: `${theme.typography.pxToRem(14)}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setOpen(!isOpen);
                    }}
                  >
                    Assign this partner to other team member
                  </Typography>
                  {/* <Button
                    color="error"
                    sx={{ ml: 2 }}
                    variant="contained"
                    onClick={() => {
                      setSelectDeleteId(brokerId);
                      handleConfirmDelete();
                    }}
                  >
                    Delete
                  </Button> */}
                </Box>
                <Divider />
                <Box py={1.5}
                  px={2}>
                  <Typography
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: `${theme.typography.pxToRem(14)}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectDeleteId(brokerId);
                      handleConfirmDelete();
                    }}

                  >
                    Revoke access of this partner
                  </Typography>
                </Box>
                <Divider />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {openDeleteConfirmation && (
        <DeleteConfirmation
          openConfirmDelete={openDeleteConfirmation}
          closeConfirmDelete={closeConfirmDelete}
          handleDeleteCompleted={handleDelete}
          title="channel partner"
          selectedId={selectDeleteId}
        />
      )}
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />

    </>
  );
};
export default Details;
