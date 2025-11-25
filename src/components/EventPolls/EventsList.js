import React, { useState, useEffect } from 'react';
import 'react-slideshow-image/dist/styles.css';
import Chart from 'react-apexcharts';
import { useNavigate } from 'react-router';
import { compareAsc } from 'date-fns';
import {
  Box,
  Button,
  Card,
  Tabs,
  Tab,
  CardMedia,
  Grid,
  Typography,
  IconButton,
  Divider,
  styled,
  useTheme,
  // Link
} from '@mui/material';
import {
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Loader from 'src/UI/Loader/Loader.js';
import { CardWrapper } from '../Projects/Projects';
import { AvatarWrapper } from '../Projects/ViewProjectDetails/Blocks/NotificationBar';
import { getUpcomingEvent, getPastEvent } from '../../axiosInstances/Api';
import { canCreateEvent } from '../../helpers/permissionHelper';

SwiperCore.use([Navigation, Pagination]);

const SwipeIndicator = styled(IconButton)(
  ({ theme }) => `
      @media (max-width: ${theme.breakpoints.values.sm}px) {
          display: none;
      }
      transition: ${theme.transitions.create(['background', 'color'])};
      color: ${theme.palette.primary.main};
      position: absolute;
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
      top: 50%;
      margin-top: ${theme.spacing(-3.5)};
      border-radius: 100px;
  
      &:hover {
        color: ${theme.palette.primary.main};
        background: ${theme.colors.alpha.trueWhite[100]};
      }
  
      &.MuiSwipe-left {
        left: ${theme.spacing(1.5)};
      }
      
      &.MuiSwipe-right {
        right: ${theme.spacing(1.5)};
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
            background: ${theme.palette.primary.main};
            width: 16px;
            border-radius: 6px;
          }
        }
      }
  `
);
const getEventStatus = (event) => {
  const { eventTime } = event;
  if (
    compareAsc(new Date(eventTime.startTime), new Date()) === -1 &&
    compareAsc(new Date(eventTime.endTime), new Date()) === 1
  ) {
    return true;
  }
  return false;
};
const renderDate = (object) => {
  let startdate = new Date(object?.eventTime?.startTime).toLocaleDateString(
    'en-us',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
  );
  let endDate = new Date(object?.eventTime?.endTime).toLocaleDateString(
    'en-us',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
  );
  let Starttime = getTime(object?.eventTime?.startTime);

  let endtime = getTime(object?.eventTime?.endTime);
  return `${startdate} , at ${Starttime} to ${endDate} , at ${endtime}`;
};
const getTime = (date) => {
  return new Date(date).toLocaleTimeString('en-us', {
    hour: 'numeric',
    minute: 'numeric'
  });
};
const EventDetails = ({ event }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const list = [
    { label: 'Accepted', value: event.totalAccepted },
    { label: 'Maybe', value: event.totalMayBe },
    { label: 'Rejected', value: event.totalRejected }
  ];

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,

            total: {
              show: true,
              label: 'Total Invitees',
              color: theme.colors.alpha.black[100],
              fontWeight: 'bold'
            }
          }
        }
      }
    },
    colors: ['#52b156', '#fbd25a', '#c13419', '#d3d3d3'],
    dataLabels: {
      enabled: false,
      formatter(val) {
        return `${val}%`;
      },
      dropShadow: {
        enabled: false,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },

    legend: {
      labels: {
        colors: theme.colors.alpha.trueWhite[100]
      },
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const chartSeries = [
    event.totalAccepted,
    event.totalMayBe,
    event.totalRejected,
    event.totalNoReply
  ];
  return (
    <>
      <Card sx={{ height: '100%' }}>
        <Box p={2}>
          <Typography>{event.title}</Typography>
          <Typography>{renderDate(event)}</Typography>
          <Box sx={{ background: '#f2f2f2', mt: 3, px: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Box>
                  <Chart
                    height={200}
                    options={chartOptions}
                    series={chartSeries}
                    type="donut"
                  />
                </Box>
              </Grid>
              <Grid item xs={4} alignSelf="center">
                <Box>
                  {list.map((item) => {
                    return (
                      <Box>
                        <Typography>{item.label}</Typography>
                        <Typography
                          sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>

            <Divider />
            <Typography sx={{ py: { xs: 3, md: 2 }, px: { xs: 2, md: 0 } }}>
              {event.totalNoReply} brokers have not replied yet
            </Typography>
          </Box>
          <Box
            mt={2}
            mb={3}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              cursor: 'pointer'
            }}
            onClick={() => {
              navigate(`/events_polls/Event_Details/${event?.eventId}`)
            }
            }
          >
            <Box sx={{ color: theme.palette.primary.dark }}>
              Event Details
            </Box>
            <AvatarWrapper
              sx={{
                color: theme.palette.primary.dark,
                // background: theme.palette.primary.dark,
                mx: 1
              }}
            >
              <NavigateNextIcon fontSize="small" />
            </AvatarWrapper>
          </Box>
        </Box>
      </Card>
    </>
  );
};
const EventLiveDetails = ({ event, pastevent = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        background: '#52b156',
        color: theme.palette.common.white,
        height: '100%'
      }}
    >
      <Box p={2}>
        <Typography>{event.title}</Typography>
        <Typography>{renderDate(event)}</Typography>
        <Card sx={{ my: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Box
                sx={{
                  width: { xs: '100px', md: '80px' }
                }}
              >
                <CircularProgressbarWithChildren
                  circleRatio={1}
                  styles={buildStyles({
                    rotation: 1 / 2.2 + 1 / 5.85,
                    trailColor: theme.colors.info.lighter,
                    pathColor: '#52b156',
                    strokeLinecap: 'butt'
                  })}
                  strokeWidth={14}
                  value={
                    (event.totalAccepted / event.totalInvitations) * 100 || 0
                  }
                >
                  <Box
                    sx={{
                      mt: '-12px'
                    }}
                  >
                    <Typography variant="h5">
                      {(event.totalAccepted / event.totalInvitations) * 100 ||
                        0}
                      %
                    </Typography>
                  </Box>
                </CircularProgressbarWithChildren>
              </Box>
              <Box ml={1}>
                <Typography variant="h5">
                  {pastevent ? 'Live Attended' : 'Live Attendance'}
                </Typography>
                <Typography variant="h3">{event.totalAccepted}</Typography>
              </Box>
            </Box>
            <AvatarWrapper
              sx={{
                color: theme.palette.common.white,
                background: '#52b156',
                mx: 2
              }}
            >
              <NavigateNextIcon fontSize="small" />
            </AvatarWrapper>
          </Box>
        </Card>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            columnGap: 4
          }}
        >
          <Box>
            <Typography>Total Invites</Typography>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h3.fontSize' }}>
              {event?.totalInvitations}
            </Typography>
          </Box>
          <Box>
            <Typography>Rejected</Typography>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h3.fontSize' }}>
              {event.totalRejected}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Typography> {event.totalNoReply} brokers did not reply</Typography>
        <Divider sx={{ my: 1.5 }} />
        <Box
          mt={2}
          mb={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            cursor: 'pointer'
          }}
          onClick={() =>
            navigate(`/events_polls/Event_Details/${event?.eventId}`)
          }
        >
          <Typography>Event Details</Typography>
          <AvatarWrapper
            sx={{
              color: '#52b156',
              background: theme.palette.common.white,
              mx: 2
            }}
          >
            <NavigateNextIcon fontSize="small" />
          </AvatarWrapper>
        </Box>
      </Box>
    </Card>
  );
};

const EventsList = ({ addTitle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const canAddEvent = canCreateEvent();
  const Eventtabs = [
    { label: 'Upcoming Events', value: 'upcoming_events' },
    { label: 'Past Events', value: 'past_events' },
  ];
  const [currentTab, setCurrentTab] = useState(Eventtabs[0]?.label);
  const [eventList, setEventList] = useState([]);
  const [pasteventList, setPastEventList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadmore, setLoadMore] = useState(6);

  const handleTabChange = (e, value) => {
    setCurrentTab(value);
  };

  const renderDate = (object) => {
    let dateStart = new Date(object?.eventTime?.startTime).toLocaleDateString(
      'en-us',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    );
    // let dateEnd = new Date(object?.eventTime?.startTime).toLocaleDateString(
    //   'en-us',
    //   {
    //     month: 'short',
    //     day: 'numeric',
    //     year: 'numeric'
    //   }
    // );
    let Starttime = getTime(object?.eventTime?.startTime);
    // let endtime = getTime(object?.eventTime?.endTime);
    return `${dateStart} at ${Starttime}`;
  };

  useEffect(() => {
    setIsLoading(true);
    getUpcomingEvent().then((result) => {
      setEventList(result || []);
    });
    getPastEvent().then((result) => {
      setPastEventList(result || []);
    });
    setIsLoading(false);
  }, []);

  const handleCardClick = (eventId) => {
    navigate(`/events_polls/Event_Details/${eventId}`);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000)
  // }, [isLoading])
  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Box sx={{ ml: 4, pl: { xs: 4, lg: 0 }, pr: { xs: 4, md: 5 } }}>
        <Box sx={{
          borderBottom: 1, borderColor: 'divider', display: 'flex',
          justifyContent: 'space-between', pb: 1
        }}>
          <Tabs
            aria-label="events"
            value={currentTab}
            onChange={handleTabChange}
          >
            {/* <Tab label="Upcoming Events" value="upcoming_events" />
            <Tab label="Past Events" value="past_events" /> */}
            {Eventtabs.map((tab) => {
              return (
                <Tab label={tab.label} value={tab.label} />
              );
            })}
          </Tabs>
          <Box>
            {canAddEvent || 1 ? (
              <Button
                variant="contained"
                startIcon={<AddCircleIcon fontSize='medium' />}
                onClick={() => {
                  navigate(`/events_polls/${addTitle.value}`);
                }}
              >
                Add New {addTitle.label}
              </Button>
            ) : (
              ''
            )}
          </Box>
        </Box>
        {
          // isLoading ? <Loader />
          // :
          <Grid container spacing={4}>
            {(currentTab === 'Upcoming Events' ? eventList : pasteventList)
              ?.length === 0 && (
                <Grid item xs={12} sx={{ alignSelf: 'center' }}>
                  <Typography
                    variant="h3"
                    pt={10}
                    sx={{ color: theme.palette.grey[500] }}
                    textAlign="center"
                  >
                    No Events to Show
                  </Typography>
                </Grid>
              )}
            {(currentTab === 'Upcoming Events' ? eventList : pasteventList.slice(0, loadmore))?.map(
              (item) => {
                let isEventLive = getEventStatus(item);

                return (
                  <>
                    <Grid item xs={12} lg={4} xl={3}>
                      <CardWrapper
                        minwidth={740}
                        maxwidth={730}
                        sx={{
                          minHeight: 410,
                          maxHeight: 410
                        }}

                        onClick={() => handleCardClick(item?.eventId)}
                      // onClick ={() =>
                      //   navigate(`/events_polls/Event_Details/${item?.eventId}`)
                      // }
                      >
                        <SwiperWrapper
                          sx={{
                            mx: 'auto',
                            maxWidth: '100%',
                            position: 'relative',
                            py: 0
                          }}
                        >
                          <Swiper
                            spaceBetween={500}
                            slidesPerView={1}
                            loop
                            navigation={{
                              nextEl: '.MuiSwipe-right',
                              prevEl: '.MuiSwipe-left'
                            }}
                            pagination={{ dynamicBullets: true, clickable: true }}
                          >
                            <React.Fragment>
                              <SwiperSlide>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'row'
                                  }}
                                >
                                  <Box sx={{
                                    display: "flex",
                                    flexDirection: 'column',
                                    height: '100%'
                                  }}>
                                    <CardMedia
                                      component="img"
                                      height="80%"
                                      width="auto"
                                      sx={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '80%',
                                        objectFit: "fill",
                                        left: 0,
                                        top: 0,
                                        borderRadius: 'inherit',
                                        zIndex: 5,
                                        background: theme.palette.common.white
                                      }}
                                      image={item.eventInviteDoc}
                                      alt="..."
                                    />
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        width: '50%',
                                        height: '20%',
                                        zIndex: '6',
                                        left: 20,
                                        bottom: -8,
                                        fontWeight: 'bold',
                                        fontSize: 16
                                      }}
                                    >
                                      <Typography variant='h4'>{item.title}</Typography>
                                      <Typography variant="subtitle1">
                                        {renderDate(item)}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  {isEventLive ? (
                                    <EventLiveDetails event={item} />
                                  ) : (
                                    <EventDetails event={item} />
                                  )}
                                </Box>
                              </SwiperSlide>
                            </React.Fragment>
                            {isEventLive && currentTab === 'Upcoming Events' && (
                              <React.Fragment >
                                <SwiperSlide>
                                  <Box sx={{ height: '100%' }}>
                                    <EventLiveDetails event={item} />
                                  </Box>
                                </SwiperSlide>
                              </React.Fragment>
                            )}
                            {!isEventLive && currentTab === 'Upcoming Events' && (
                              <React.Fragment >
                                <SwiperSlide>
                                  <Box sx={{ height: '100%' }}>
                                    <EventDetails event={item} />
                                  </Box>
                                </SwiperSlide>
                              </React.Fragment>
                            )}
                            {currentTab === 'Past Events' && (
                              <React.Fragment >
                                <SwiperSlide>
                                  <Box sx={{ height: '100%' }}>
                                    <EventLiveDetails
                                      pastevent="true"
                                      event={item}
                                    />
                                  </Box>
                                </SwiperSlide>
                              </React.Fragment>
                            )}
                          </Swiper>
                          <SwipeIndicator className="MuiSwipe-root MuiSwipe-left">
                            <ChevronLeftTwoToneIcon />
                          </SwipeIndicator>
                          <SwipeIndicator className="MuiSwipe-root MuiSwipe-right">
                            <ChevronRightTwoToneIcon />
                          </SwipeIndicator>
                        </SwiperWrapper>
                      </CardWrapper>
                    </Grid>
                  </>
                );
              }
            )}
          </Grid>
        }
        {
          pasteventList.length >= loadmore && currentTab !== 'Upcoming Events' &&
          <Button
            variant="contained"
            onClick={() => setLoadMore(prev => prev + 6)}
            sx={{
              position: 'absolute',
              marginTop: 3,   
              marginBottom: 2,
              right: 50    
            }}
          >
            Load More
          </Button>
        }
      </Box>
    </>
  );
};
export default EventsList;
