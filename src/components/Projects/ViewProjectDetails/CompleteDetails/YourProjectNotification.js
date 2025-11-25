import React, { useEffect, useState } from "react";
import { Box, Divider, Typography, Avatar, useTheme } from "@mui/material";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
// import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { notificationType } from 'src/constants/NotificationType';
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router";
import { editMeetings, meetCardStatusChange, regAndBookingCardStatusChange } from "src/axiosInstances/Api";
import { showNotification } from "src/utils/commonUtility";
import { toUpperMutliple } from "src/utils/utilits";
import { getProjectDetailsById, getProjectNotification } from "src/slices/ProjectList";
// import "./index.css";


function YourProjectNotification() {
  const dispatch = useDispatch();
  //   const navigate = useNavigate();
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleArrowIconClick = () => {
    setShowDetails(!showDetails);
  };
  const handleArrowClick = () => {
    setShowRegistrations(!showRegistrations);
  };
  const handleArrowIcon = () => {
    setShowBookings(!showBookings);
  };

  const details = useSelector((state) => state.projectList.projectDetails);
  let projectData = useSelector((state) => state.projectList.projectByIdData);
  let notification = useSelector((state) => state.projectList.notification);

  const userData = JSON.parse(window.localStorage.getItem('user'));
  const handleStatusChange = async (status, id) => {
    setIsLoading(true);
    const payload = {
      status
    };

    const userPayload = {
      id: userData?.userId,
      name: `${userData?.first_name} ${userData?.last_name}`,
      phoneNumber: userData?.phoneNumber,
      email: userData?.email,
      status
    };

    await meetCardStatusChange(id, payload).then((response) => {
      if (response?.status === 200 || response?.status === 201) {
        editMeetings(id, userPayload).then((responseStat) => {
          if (responseStat === 200 || responseStat === 201) {
            let sucessMessage = `Sucessfully ${toUpperMutliple(status)} `;
            showNotification(sucessMessage, notificationType.SUCCESS);
            setIsLoading(false);
          }
        });
      }
      else {
        let errorMessage = 'Something went wrong';
        showNotification(errorMessage, notificationType.ERROR);
        setIsLoading(false);
      }
    });
  };

  const handleBookingStatusChange = async (status, id, type) => {
    setIsLoading(true);
    console.log(status, id)
    // booking
    await regAndBookingCardStatusChange(
      id,
      type,
      status.toUpperCase()
    ).then((response) => {
      if (response?.status === 200 || response?.status === 201) {
        let sucessMessage = `Sucessfully ${toUpperMutliple(status)} `;
        showNotification(sucessMessage, notificationType.SUCCESS);
        setIsLoading(false);
      } else {
        let errorMessage = 'Something went wrong';
        showNotification(errorMessage, notificationType.ERROR);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    dispatch(getProjectDetailsById(projectData._id));
    dispatch(getProjectNotification(projectData._id));
  }, [isLoading]);

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
  
  const groupedData = groupDataByDate(notification);

  return (
    <>
      <Box id="notification"
        py={2}
        px={3}
        sx={{
          backgroundColor: '#E9EEF4',
          height: '100%',
        }}
      >
       <Box
          id="notifi-box1"
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
              id="notifi-title1"
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
                 {details?.clientVisitrequest?.length}
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
          details?.clientVisitrequest?.map((data) => {
            return (
              <Box
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
                id="show-details1"
              >
                <Box sx={{ ml: { xs: 2, sm: 3 }, flex: 1 }}>
                  <Typography style={{ fontSize: "11px", fontWeight: "bold" }} sx={{ mt: { xs: 1.5, sm: 0 } }}>
                    {`Visit Requested by ${data?.organizer?.first_name} ${data?.organizer?.last_name}`}
                  </Typography>
                  <Typography style={{ fontSize: "10px", color: "#939494" }}>
                    {new Date(data?.meetingDate).toLocaleString("en-US", {
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
                    {data?.client?.name}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }}>
                    {data?.projectId?.name?.toUpperCase()}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }}>2BHK, 1850 SqFt</Typography>
                </Box>
                <Box sx={{ mt: { xs: 2, sm: 6 }, mr: { xs: 0, sm: 2 }, disabled: isLoading }} id="check1">
                  <CheckCircleRoundedIcon
                    sx={{ fontSize: 32, fontWeight: "100", color: "#00C45F" }}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleStatusChange("ACCEPTED", data?._id);
                    }}
                  />
                  <CancelRoundedIcon
                    sx={{ fontSize: 32, fontWeight: "100", color: "#F3512F", ml: 0.5 }}
                    id="cross"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleStatusChange("REJECTED", data?._id);
                    }}
                  />
                </Box>
              </Box>
            )
          })
        }
        <Box py={1} >
        <Box
            id="notifi-box2"
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
                id="notifi-title2"
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
                  {details?.registartionRequest?.length}
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
            details?.registartionRequest?.map(data => {
              return (
                <Box
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
                id="show-details1"
              >
                <Box sx={{ ml: { xs: 2, sm: 4 }, flex: 1 }}>
                  <Typography style={{ fontSize: "11px", fontWeight: "bold" }} sx={{ mt: { xs: 1.5, sm: 0 } }}>
                    {`Registration Requested by ${data?.clientId?.broker?.first_name} ${data?.clientId?.broker?.last_name}`}
                  </Typography>
                  <Typography style={{ fontSize: "10px", color: "#939494" }}>
                    {new Date(data?.createdAt).toLocaleString("en-US", {
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
                    {data?.clientId?.name}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }}>
                    {`${data?.clientId?.project?.name}`}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }}>2BHK, 1850 SqFt</Typography>
                </Box>
                <Box sx={{ mt: { xs: 2, sm: 6 }, mr: { xs: 0, sm: 2 }, disabled: isLoading }} id="check1">
                  <CheckCircleRoundedIcon
                    sx={{ fontSize: 32, fontWeight: "100", color: "#00C45F" }}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleBookingStatusChange('ACCEPTED', data?.clientId?._id, "registration");
                    }}
                  />
                  <CancelRoundedIcon
                    sx={{ fontSize: 32, fontWeight: "100", color: "#F3512F", ml: 0.5 }}
                    id="cross"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleBookingStatusChange('REJECTED', data?.clientId?._id, "registration");
                    }}
                  />
                </Box>
              </Box>
              )
            })
          }
        </Box>
        <Box mb={1}>
        <Box
            id="notifi-box3"
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
                id="notifi-title3" 
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
                  {details?.bookingRequest?.length}
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
            details?.bookingRequest?.map(data => {
              return (
                <Box
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
                id="show-details1"
              >
                <Box sx={{ ml: { xs: 2, sm: 4 }, flex: 1 }}>
                  <Typography style={{ fontSize: "11px", fontWeight: "bold" }} sx={{ mt: { xs: 1.5, sm: 0 } }}>
                     {`Booking Requested by ${data?.clientId?.broker?.first_name} ${data?.clientId?.broker?.last_name}`}
                  </Typography>
                  <Typography style={{ fontSize: "10px", color: "#939494" }}>
                    {new Date(data?.createdAt).toLocaleString("en-US", {
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
                   {data?.clientId?.name}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }}>
                    {`${data?.clientId?.project?.name}`}
                  </Typography>
                  <Typography style={{ fontSize: "11px" }}>2BHK, 1850 SqFt</Typography>
                </Box>
                <Box sx={{ mt: { xs: 2, sm: 6 }, mr: { xs: 0, sm: 2 }, disabled: isLoading }} id="check1">
                  <CheckCircleRoundedIcon
                    sx={{ fontSize: 32, fontWeight: "100", color: "#00C45F" }}
                    style={{ cursor: "pointer" }}
                   onClick={() => {
                                        handleBookingStatusChange('ACCEPTED', data?.clientId?._id, "booking");
                                      }}
                  />
                  <CancelRoundedIcon
                    sx={{ fontSize: 32, fontWeight: "100", color: "#F3512F", ml: 0.5 }}
                    id="cross"
                    style={{ cursor: "pointer" }}
                   onClick={() => {
                                        handleBookingStatusChange('REJECTED', data?.clientId?._id, "booking");
                                      }}
                  />
                </Box>
              </Box>
              )
            })
          }
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", mt: 3 }}>
          <Typography
            py={1}
            sx={{
              fontSize: `${theme.typography.pxToRem(14)}`,
              fontWeight: 'bold'
            }}
          >
            {' '}
            PROJECT NOTIFICATIONS{' '}
          </Typography>
          <Box
            sx={{
              width: '27px',
              height: '27px',
              borderRadius: '50%',
              backgroundColor: '#E85E31',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: "5px",
              marginTop: "5px"

            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: "white",
              }}
            >
              {notification.length}
            </Typography>
          </Box>

        </Box>

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
                    <Avatar alt="Travis Howard" src={item.profileImage} sx={{ width: 60, height: 60 }} />
                  </Box>
                  <Box sx={{ ml: 1, display: "flex", justifyContent: 'center', alignItems: 'center' }} >
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


        {/* <Box>
          <Box sx={{
            width: "100%",
            backgroundColor: "#D8E0ED",
            height: "30px",
            borderRadius: "6px",
            mt: 1.5
          }}>
            <Box style={{ display: 'flex', flexDirection: 'row' }} sx={{ p: "6px" }}>
              <Typography>
                Today
              </Typography>
              <Typography sx={{ ml: 1 }}>
                June 30
              </Typography>
            </Box>

          </Box>
          <Box sx={{ mt: 1 }} style={{ display: 'flex', flexDirection: 'row' }}>
            <Box>
              <Avatar alt="Travis Howard" src="/static/images/person/User11.png" sx={{ width: 60, height: 60 }} />
            </Box>
            <Box sx={{ ml: 1, mt: 1 }}>
              <Typography style={{ fontSize: "13px", color: "#3D3D3D" }}>
                Prakash Choudhary hello friend Desgin A Dashboard
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 1, borderTop: '2px dotted #B3C1D6', }} />
          <Box sx={{ mt: 1 }} style={{ display: 'flex', flexDirection: 'row' }}>
            <Box>
              <Avatar alt="Travis Howard" src="/static/images/person/User11.png" sx={{ width: 60, height: 60 }} />
            </Box>
            <Box sx={{ ml: 1, mt: 1 }}>
              <Typography style={{ fontSize: "13px", color: "#3D3D3D" }}>
                Prakash Choudhary
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 1.5, borderTop: '2px dotted #B3C1D6', }} />

        </Box>
        <Box>
          <Box sx={{
            width: "100%",
            backgroundColor: "#D8E0ED",
            height: "30px",
            borderRadius: "6px",

          }}>
            <Box style={{ display: 'flex', flexDirection: 'row' }} sx={{ p: "6px" }}>

              <Typography>
                June 30
              </Typography>
            </Box>

          </Box>
          <Box sx={{ mt: 1 }} style={{ display: 'flex', flexDirection: 'row' }}>
            <Box>
              <Avatar alt="Travis Howard" src="/static/images/person/User11.png" sx={{ width: 60, height: 60 }} />
            </Box>
            <Box sx={{ ml: 1, mt: 1 }}>
              <Typography style={{ fontSize: "13px", color: "#3D3D3D" }}>
                Prakash Choudhary
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 1.5, borderTop: '2px dotted #B3C1D6', }} />
          <Box sx={{ mt: 1 }} style={{ display: 'flex', flexDirection: 'row' }}>
            <Box>
              <Avatar alt="Travis Howard" src="/static/images/person/User11.png" sx={{ width: 60, height: 60 }} />
            </Box>
            <Box sx={{ ml: 1, mt: 1 }}>
              <Typography style={{ fontSize: "13px", color: "#3D3D3D" }}>
                Prakash Choudhary
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 1.5, borderTop: '2px dotted #B3C1D6', }} />

        </Box> */}
      </Box>
    </>
  );
}

export default YourProjectNotification;
