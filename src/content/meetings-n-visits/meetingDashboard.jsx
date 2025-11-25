import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  useTheme,
  Typography,
  Modal,
  TextField,
  Grid,
  styled,
  CircularProgress,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import moment from 'moment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import { canAddMeeting } from 'src/helpers/permissionHelper.js';
import { getYourNotification } from 'src/slices/dashboard.js';
import MeetingCard from './meetingCard.js';
import MultipleSelect from '../../content/blocks/Multiselect/mutliSelect';
import { createMeeting } from '../../axiosInstances/Api';
import { renderDate } from './commanFunctions.js';
import CalendarView from './calendar';
import TimePicker from '../../components/EventPolls/TimePicker/index';
import {
  addMeetings,
  addBrokers,
  addUsers,
  // addProjects,
  addMeetingCard,
  getUsersByGroupId,
  addBrokersBygroupId,
  getProjectByBuilderId
} from '../../slices/meetings';
import OpenNotification from '../ShowNotification/index.js';

SwiperCore.use([Navigation, Pagination]);

const errors = {
  title: false,
  project: false,
  broker: false
};

const SwiperWrapper = styled(Box)(
  ({ theme }) => `
        .swiper-pagination {
          .swiper-pagination-bullet {
            background: ${theme.palette.primary.main};
            opacity: 1;
    
            &.swiper-pagination-bullet-active {
              background: lightgray;
              width: 16px;
              border-radius: 6px;
            }
          }
        }
    `
);
function MeetingDashboard() {
  const dispatch = useDispatch();
  let broker = useSelector((state) => state.meeting.brokersBygroup);
  useEffect(() => {
    dispatch(addMeetings());
    dispatch(addBrokers());
    dispatch(addUsers());
    dispatch(getProjectByBuilderId(userData.builderCompany[0]));
    dispatch(addMeetingCard());
    dispatch(getUsersByGroupId());
    dispatch(addBrokersBygroupId());
    dispatch(getYourNotification());
  }, []);

  let meetings = [];
  // let brokersBygroup = useSelector((state) => state.meeting?.brokersBygroup);

  meetings = useSelector((state) => state.meeting?.meetingCard);

  // let notification = useSelector((state) => state.dashboard.notification);

  const project = useSelector((state) => state.meeting?.projectListBuilder);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [startTimeValue, setStartTimeValue] = useState(moment());
  const [endTimeValue, setEndTimeValue] = useState(moment());
  const [brokerList, setBrokerList] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const userData = JSON.parse(window.localStorage.getItem('user'));
  const weekDay = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({

    agenda: '',
    notes: '',
    broker: [],
    user: '',
    project: '',
   
  });
  const [formErrors, setFormErrors] = useState(errors);

  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        // navigate(`/team/${selectedTab}`);
        dispatch(addMeetings());
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };


  useEffect(() => {
    if (broker.length) {
      let tempBroker = broker.map((item) => {
        return {
          value: item._id,
          label: `${item?.first_name} ${item?.last_name ? item?.last_name : ''}`
        };
      });
      setBrokerList(tempBroker);
    }
  }, [broker.length]);

  useEffect(() => {
    handleChangeTime(moment());
  }, []);
  const getjointZValue = (selectedDate, selecteTime) => {
    const date = moment(selectedDate).format('YYYY/MM/DD');
    let time = moment(selecteTime).format('HH:mm');
    let timeAndDate = moment(`${date} ${time}`);
    return new Date(timeAndDate).toISOString();
  };
  const getIsToDay = () => {
    let today = moment(new Date()).format('YYYY/MM/DD');
    let selectedday = moment(startDateValue).format('YYYY/MM/DD');
    return today === selectedday;
  };
  const handleChangeTime = (newValue) => {
    setStartTimeValue(newValue);
    const dateStr = new Date(newValue);
    const endDate = new Date(newValue);
    const tempTime = endDate?.setMinutes(dateStr?.getMinutes() + 30);
    setEndTimeValue(moment(tempTime));
  };
  function handleInputChange(evt) {
    const value = evt.target.value;
    if (evt.target.name === 'agenda' || evt.target.value !== '') {
      setFormErrors((formErrors) => ({ ...formErrors, title: false }));
    }
    if (evt.target.name === 'broker' || evt.target.value !== '') {
      setFormErrors((formErrors) => ({ ...formErrors, broker: false }));
    }
    setState({
      ...state,
      [evt.target.name]: value
    });
  }
  const filterBroker = (brokerParams) => {
    let payload = [];
    if (brokers.length) {
      for (let i = 0; i < brokerParams.length; i++) {
        const tempBroker = broker.filter((item) => item._id === brokerParams[i].value);
        tempBroker.forEach((item) => {
          let tempo = {
            id: item._id,
            name: `${item.first_name} ${item.last_name ? item?.last_name : ''}`,
            phoneNumber: item?.phoneNumber,
            email: item.email,
            status: 'Invited'
          };
          payload.push(tempo);
        });
      }
    }
    return payload;
  };
  const getProjectName = (id) => {
    let projectName = project.filter((item) => item._id === id);
    return projectName[0]?.name || '';
  };

  const handleAddMeeting = async () => {
    if (!state.agenda) {
      setFormErrors((formErrors) => ({ ...formErrors, title: true }));
    }

    if (brokers.length === 0) {
      setFormErrors((formErrors) => ({ ...formErrors, broker: true }));
    }

    if (!state.agenda || !brokers) {
      return;
    }

    let startTime = getjointZValue(startDateValue, startTimeValue);
    let endTime = getjointZValue(startDateValue, endTimeValue);
    let payload = {
      meetingDate: startTime,
      startTime,
      endTime,
      dayOfWeek: weekDay[startDateValue.getUTCDay()],
      broker: filterBroker(brokers),
      agenda: state.agenda,
      notes: state.notes,
      builderCompany: userData.builderCompany[0]
    };

    if (state.project !== '') {
      payload.projectId = state.project;
    }
    setIsLoading(true);
    if (payload.broker.length > 0) {
      const response = await createMeeting(payload);
      if (response === 200 || response === 201) {
        // let sucessMessage = 'Successfully Created Meeting';
        // showNotification(sucessMessage, notificationType.SUCCESS);
        setOpenNoti(true); // Open the notification modal
        setSuccessMessage('Successfully Created Meeting');
        setIsLoading(false);
        dispatch(addMeetings());
        handleClose();
      } else if (response === 400) {
       
        const errorMessage = 'Meeting Exists in Database.' || 'Something went wrong';
        setErrorMessage(errorMessage); // Set error message
        setOpenNoti(true); // Open the notification modal
        setIsLoading(false);
      } else {
        const errorMessage = response.data.message || 'Something went wrong';
        setErrorMessage(errorMessage); // Set error message
        setOpenNoti(true); // Open the notification modal
        setIsLoading(false);
      }
    } else {
      setIsLoading(false)
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 1,
    p: 2
  };
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  const handleOpen = () => {
    setOpen(true);
    setStartDateValue(new Date());
    setStartTimeValue(moment());
    setEndTimeValue(moment());
    setBrokers([]); 
    setState({
      ...state,
      agenda: '',
      notes: '',
      project: ''
    });
  };
  const handleClose = () => {
    setFormErrors(errors);
    setOpen(false);
    setState({
      agenda: '',
      notes: '',
      broker: [],
      user: '',
      project: ''
    });
  };
  const handleMultipleDDChange = (e) => {
    // if (Array.isArray(e) && e.length) {
    //   setFormErrors((formErrors) => ({ ...formErrors, broker: false }));
    // }
    // setState((prevState) => ({
    //   ...prevState,
    //   broker: Array.isArray(e) ? e.map((x) => x.value) : []
    // }));
    setBrokers(e)
  };
  console.log("meetingsmeetings", meetings)
  const isAddMeeting = canAddMeeting()
  return (
    <>
      <Helmet>
        <title>Meetings and Visits</title>
      </Helmet>
      <Box
        sx={{
          ml: 4,
          height: '90%',
          width: '100%',
          pl: { xs: 5, lg: 0 },
          pr: { xs: 5, md: 7 }
        }}
      >
        <Box
          sx={{
            py: 4,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography
            sx={{
              fontSize: `${theme.typography.pxToRem(15)}`,
              mb: 1,
              mt: 1
            }}
            variant="h4"
          >
            MEETINGS & VISITS
          </Typography>

          {isAddMeeting && <Button
            variant="contained"
            startIcon={<AddCircleIcon fontSize="medium" />}
            onClick={() => handleOpen()}
          >
            Add New Meeting
          </Button>
          }
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ zIndex: 7 }}
          >
            <Box sx={style}>
              <Typography
                id="modal-modal-title"
                variant="h4"
                component="h1"
                mt={2}
              >
                Add Meeting
              </Typography>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box
                    style={{
                      marginTop: 25
                    }}
                  >
                    <Grid container columnSpacing={2} rowSpacing={2}>
                      <Grid item xs={7}>
                        <Box width="100%">
                          <TextField
                            fullWidth
                            margin="normal"
                            label="Meeting Title"
                            name="agenda"
                            required
                            onChange={(event) => handleInputChange(event)}
                            value={state.agenda}
                            variant="outlined"
                            error={formErrors?.title}
                          />
                          {formErrors?.title && (
                            <span style={{ color: '#d32f2f' }}>
                              This field is required
                            </span>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={5}>
                        <Box width="100%" sx={{ mt: '15px' }}>
                          <DatePicker
                            label="Date"
                            value={startDateValue}
                            minDate={new Date()}
                            onChange={(date) => {
                              setStartDateValue(date);
                            }}
                            renderInput={(params) => (
                              <TextField fullWidth {...params} />
                            )}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={7}>
                        <Box width="100%">
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Link Project
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={state.project}
                              name="project"
                              label="Project"
                              onChange={(event) => handleInputChange(event)}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {project?.map((item) => {
                                return (
                                  <MenuItem value={item._id}>
                                    {item.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={5}>
                        <Box width="100%">
                          <TimePicker
                            value={startTimeValue}
                            style={{ width: '-webkit-fill-available' }}
                            startTime={moment()}
                            isToday={getIsToDay()}
                            onChange={(newValue) => {
                              handleChangeTime(newValue);
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box width="100%">
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            margin="normal"
                            label="Notes"
                            name="notes"
                            onChange={(event) => handleInputChange(event)}
                            value={state.notes}
                            variant="outlined"
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box width="100%">
                          <FormControl fullWidth variant="outlined">
                            <MultipleSelect
                              data={brokerList}
                              value={brokers}
                              handleChange={handleMultipleDDChange}
                              placeholder='Channel Partner *'
                            />
                            {formErrors?.broker && (
                              <span style={{ color: '#d32f2f' }}>
                                This field is required
                              </span>
                            )}
                          </FormControl>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </LocalizationProvider>
                <Box mb={5} position="relative" top="25px">
                  <Divider sx={{ borderBottomWidth: 5 }} />
                </Box>
                <Box
                  position="relative"
                  xs={{ bottom: '6px' }}
                  md={{ bottom: '0px' }}
                  xl={{ bottom: '0px' }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleAddMeeting()}
                  >
                    {isLoading ? (
                      <CircularProgress
                        size={22}
                        style={{
                          color: 'white'
                        }}
                      />
                    ) : (
                      'Create Meeting'
                    )}
                  </Button>
                  <Button
                    sx={{ ml: 2 }}
                    variant="outlined"
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
        </Box>
        <>
          <Box my={2} sx={{ ml: { xs: -1, md: 2 }, mr: { xs: -1, md: 0 } }}>
            <SwiperWrapper
              sx={{
                position: 'relative',
                py: 0,
                ml: { xs: -3.5, sm: 0, md: -3.5 }
              }}
            >
              <Swiper
                spaceBetween={1}
                slidesPerView={1}
                // loop
                navigation={{
                  nextEl: '.MuiSwipe-right',
                  prevEl: '.MuiSwipe-left'
                }}
                breakpoints={{
                  500: {
                    slidesPerView: 1,
                    spaceBetween: 0
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 0
                  },
                  1200: {
                    slidesPerView: 3,
                    spaceBetween: 0
                  },
                  1920: {
                    slidesPerView: 4,
                    spaceBetween: 0
                  }
                }}
                pagination={{ dynamicBullets: true, clickable: true }}
              >
                {meetings.length > 0 && meetings?.map((item, index) => {
                  let { organizer, meetingDate, projectId } = item;
                  return (
                    <SwiperSlide>
                      <Box sx={{ mx: { xs: 1.5 } }} key={index}>
                        <MeetingCard
                          mainText={`${organizer.first_name} ${organizer.last_name}`}
                          description={getProjectName(projectId)}
                          dateTime={renderDate(meetingDate)}
                          data={item}
                        />
                      </Box>
                    </SwiperSlide>
                  );
                })}

                {/* {notification?.totalregistartion?.length > 0 && notification?.totalregistartion?.map((data, index) => {
                  // let { organizer, meetingDate, projectId } = item;
                  // console.log("datadatadatadatadatadatadatadatadatadatadata",data);
                  return (
                    <SwiperSlide>
                      <Box sx={{ mx: { xs: 1.5 } }} key={index}>
                        <MeetingCard
                          mainText={`${data?.clientId?.broker?.first_name} ${data?.clientId?.broker?.last_name}`}
                          description={data?.clientId?.project?.name}
                          dateTime={renderDate(data?.createdAt)}
                          data={data}
                          type='registration'
                        />
                      </Box>
                    </SwiperSlide>
                  );
                })}

                {notification?.totalbooking?.length > 0 && notification?.totalbooking?.map((data, index) => {
                  // let { organizer, meetingDate, projectId } = item;
                  // console.log("datadatadatadatadatadatadatadatadatadatadata",data);
                  return (
                    <SwiperSlide>
                      <Box sx={{ mx: { xs: 1.5 } }} key={index}>
                        <MeetingCard
                          mainText={`${data?.clientId?.broker?.first_name} ${data?.clientId?.broker?.last_name}`}
                          description={data?.clientId?.project?.name}
                          dateTime={renderDate(data?.createdAt)}
                          data={data}
                          type='booking'
                        />
                      </Box>
                    </SwiperSlide>
                  );
                })} */}
              </Swiper>
            </SwiperWrapper>
          </Box>
        </>

        <Box
          sx={{
            width: '100%',
            typography: 'body1',
            mt: meetings.length > 0 ? 4 : 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start'
            }}
          >
            <CalendarView />
          </Box>
        </Box>
      </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />

    </>
  );
}

export default MeetingDashboard;
