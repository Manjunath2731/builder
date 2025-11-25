import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import {
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  CircularProgress,
  styled,
  CardMedia,
  InputAdornment,
  Divider
} from '@mui/material';
import DeleteConfirmation from 'src/content/delete-alert/DeleteAlert';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker } from '@mui/lab';
import { showNotification } from 'src/utils/commonUtility';
import { notificationType } from 'src/constants/NotificationType';
import Loader from 'src/UI/Loader/Loader.js';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
// import { toUpperMutliple } from 'src/utils/utilits.js';
import { CreateEvent,
  //  getEventCategory 
  } from '../../axiosInstances/Api';
import { getAllBrokers } from '../../slices/Events';
import {
  GetURLForUpload,
  handleRemoveFromS3,
  browseButton
} from '../Projects/AddProject/Index';
import Invite from './InviteScreen.js';
import { getProjectByBuilderId } from '../../slices/ProjectList';
import { toUpper } from '../../content/meetings-n-visits/commanFunctions';
import TimePicker from './TimePicker';
import EventVenue from './EventVenue';


export const customeButton = {
  height: 32,
  py: 1,
  px: 1,
  borderRadius: 0.5,
  '&:hover': {
    background: '#a82222'
  }
};
export const CardWrapper = styled(Card)(
  ({ theme }) => `
    transition: ${theme.transitions.create(['box-shadow'])};
    position: relative;
    z-index: 5;   
    &:hover {
        z-index: 6;
        transform:scale(1.02);
        cursor:pointer;
    }
   
  `
);
const BgComposed = styled(Box)(
  () => `
    position: relative;
    z-index:7;
  `
);
const InitialValue = {
  title: '',
  eventType: '',
  // eventCategory: '',
  project: '',
  venue: '', // googleMap integated then make it []
  eventDate: new Date(),
  eventTimeFrom: moment(),
  eventTimeTo: moment(),
  description: '',
  eventInviteDoc: { label: '', url: '', contentType: '' },
  eventTeaser: { label: '', url: '', contentType: '' },
  isGiftApplicable: false,
  videoLink: ''
};
export const Input = styled('input')({
  display: 'none'
});
const USERDATA = JSON.parse(window.localStorage.getItem('user'));

const AddEvent = () => {
  let projects = [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(false);
  const [isAddLink, setIsAddLink] = useState(false);
  const userData = JSON.parse(window.localStorage.getItem('user'));
  const [eventFormDetail, setEventFormDetail] = useState(InitialValue);
  const [loading, setLoading] = useState({
    eventInviteDoc: false,
    eventTeaser: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [eventCategoryList, setEventCategoryList] = useState([]);
  const [eventId, setEventId] = useState('');
  const [inviteList, setInviteList] = useState([]);
  const [isDelete, setDelete] = useState(false);
  const [urlobj, setUrl] = useState({ url: '', name: '' });
  useEffect(() => {
    dispatch(getAllBrokers(userData.builderCompany[0]));
    // getEventCategory().then((result) => {
    //   if (result !== undefined) setEventCategoryList(result);
    // });
     dispatch(getProjectByBuilderId(USERDATA.builderCompany[0]));
  }, []);
  const handleDate = (newValue, name) => {
    setEventFormDetail({ ...eventFormDetail, [name]: newValue });
  };
  const handleTime = (newValue, name) => {
    if (name === 'eventTimeFrom') {
      setEventFormDetail({
        ...eventFormDetail,
        eventTimeFrom: newValue,
        eventTimeTo: newValue
      });
    } else {
      setEventFormDetail({ ...eventFormDetail, [name]: newValue });
    }
  };
  const getjointZValue = (selectedDate, selecteTime) => {
    const date = moment(selectedDate).format('YYYY/MM/DD');
    let time = moment(selecteTime).format('HH:mm');
    let timeAndDate = moment(`${date} ${time}`);
    return new Date(timeAndDate).toISOString();
  };
  const updateUrl = (result) => {
    let file = {
      label: result[0]?.originalFileName || '',
      url: result[0]?.url || '',
      contentType: result[0]?.contentType || ''
    };
    setEventFormDetail({ ...eventFormDetail, [result[0].type]: file });
    setLoading({ ...loading, [result[0].type]: false });
  };
  const handleDelete = (url, name) => {
    setDelete(true);
    setUrl({ url, name });
  };
  const handleDeleteCompleted = () => {
    setDelete(false);
    handleRemoveFromS3(urlobj?.url).then((response) => {
      if (response) {
        setEventFormDetail({
          ...eventFormDetail,
          [urlobj?.name]: { label: '', url: '', contentType: '' }
        });
      }
    });
  };
  const handleClose = () => {
    setDelete(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventFormDetail({ ...eventFormDetail, [name]: value });
  };
  // const handleVenue =(address)=>{
  //   setEventFormDetail({ ...eventFormDetail, venue: address });
  // }
  const handleVenue = (address) => {
    setEventFormDetail((prevState) => ({
      ...prevState,
      venue: address,
    }));
  };
  const getIsToDay = () => {
    let today = moment(new Date()).format('YYYY/MM/DD');
    let selectedday = moment(eventFormDetail.eventDate).format('YYYY/MM/DD');
    return today === selectedday;
  };
  const handleSave = async () => {
    let startTime = getjointZValue(
      eventFormDetail?.eventDate,
      eventFormDetail?.eventTimeFrom
    );
    let endTime = getjointZValue(
      eventFormDetail?.eventDate,
      eventFormDetail?.eventTimeTo
    );
    const payload = {
      title: eventFormDetail.title,
      eventType: eventFormDetail.eventType,
      eventCategory: eventFormDetail.eventCategory,
      venue: { address: eventFormDetail.venue },
      project: eventFormDetail.project ? eventFormDetail.project : undefined,
      videoLink: eventFormDetail?.videoLink,
      eventTeaser: eventFormDetail.eventTeaser?.url,
      eventTime: {
        startTime,
        endTime
      },
      description: eventFormDetail.description,
      eventInviteDoc: eventFormDetail.eventInviteDoc?.url,
      isGiftApplicable: eventFormDetail.isGiftApplicable,
      builderCompany: userData.builderCompany[0]
    };
    setIsSubmitting(true);
    await CreateEvent(payload).then((response) => {
      if (response?.status === 200 || response?.status === 201) {
        let sucessMessage = `Sucessfully Event Created`;
        showNotification(sucessMessage, notificationType.SUCCESS);
        setIsSubmitting(false);
        setEventId(response?.data?._id);
        setInviteList(response?.data?.invitees);
        setInvite(true);
      }
      else {
        let errorMessage = 'Something went wrong';
        showNotification(errorMessage, notificationType.ERROR);
        setIsSubmitting(false);
      }
    });
  };
  const handleCancel = () => {
    navigate('/events_polls');
  };
  projects = useSelector((state) => state.projectList.projectListBuilder);
  return (
    <>
      {isDelete && (
        <DeleteConfirmation
          openConfirmDelete={isDelete}
          closeConfirmDelete={handleClose}
          handleDeleteCompleted={handleDeleteCompleted}
          selectedId="0"
        />
      )}
      {!invite ? (
        <>
          <Box sx={{ml: 4, pt: 4, pl: { xs: 5, lg: 0 }, pr: { xs: 5, md: 7 } }}>
            <Box>
              <Typography variant="h3" mb={2} component="h3" gutterBottom>
                CREATE AN EVENT
              </Typography>
            </Box>

            <Card>
              <Box
                sx={{ py: { xs: 3, xl: 5 }, mx: { xs: 5, xl: 6, lg: 4 } }}
                autoComplete="off"
                my={1}
              >
                <Grid
                  container
                  columnSpacing={{ xs: 8, md: 6, lg: 5, xl: 8 }}
                  rowSpacing={4}
                >
                  <Grid item xs={12} md={8}>
                    <Grid
                      container
                      columnSpacing={{ xs: 8, md: 6, lg: 5, xl: 8 }}
                      rowSpacing={4}
                    >
                      <Grid item xs={12} md={6}>
                        <Box width="100%">
                          <InputLabel sx={{ mb: 1 }}>Event Title*</InputLabel>
                          <TextField
                            id="title"
                            name="title"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={eventFormDetail.title}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container rowSpacing={4}>
                          <Grid item xs={12}>
                            <FormControl sx={{ ml: 1 }}>
                              <FormLabel
                                htmlFor="eventTypeRadio"
                                sx={{ mb: 1 }}
                              >
                                Event Type*
                              </FormLabel>

                              <RadioGroup
                                id="eventTypeRadio"
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="eventType"
                                value={eventFormDetail.eventType}
                                onChange={handleChange}
                              >
                                <FormControlLabel
                                  value="general"
                                  control={<Radio />}
                                  label="General Event"
                                />

                                <FormControlLabel
                                  value="projectLinking"
                                  control={<Radio />}
                                  label="Link to a Project"
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          {eventFormDetail.eventType === 'projectLinking' && (
                            <Grid item xs={12}>
                              <Box width="100%">
                                <FormControl fullWidth variant="outlined">
                                  <InputLabel>Project*</InputLabel>
                                  <Select
                                    label="Project"
                                    onChange={(event) => {
                                      const { name, value } = event.target;
                                      setEventFormDetail({
                                        ...eventFormDetail,
                                        [name]: value
                                      });
                                    }}
                                    value={eventFormDetail.project}
                                    name="project"
                                  >
                                    <MenuItem key={1} value="none">
                                      <Box ml={2} display="inline-block">
                                        Select
                                      </Box>
                                    </MenuItem>
                                    {projects.map((item) => {
                                      return (
                                        <MenuItem
                                          key={item._id}
                                          value={item._id}
                                        >
                                          <Box ml={2} display="inline-block">
                                            {toUpper(item.name)}
                                          </Box>
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                      <Box width="100%">
                          <InputLabel sx={{ mb: 1 }}>Description*</InputLabel>
                          <TextField
                            id="description"
                            name="description"
                            multiline
                            rows={12}
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={eventFormDetail.description}
                            // style={{height:"245px"}}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box width="100%">
                          <InputLabel sx={{ mb: 1 }}>Venue*</InputLabel>
                          {/* <TextField
                            id="venue"
                            name="venue"
                            fullWidth
                            onChange={handleChange}
                            value={eventFormDetail.venue}
                            variant="outlined"
                          /> */}
                          <EventVenue handleVenue={handleVenue}/>
                        </Box>
                        
                        <Box>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Grid container spacing={4} >
                            <Grid item xs={12}>
                              <Box width="100%" sx={{mt:3}}>
                                <InputLabel sx={{ mb: 1 }}>
                                  Event Date*{' '}
                                </InputLabel>
                                <DatePicker
                                  // label="Basic example"
                                  id="eventDate"
                                  name="eventDate"
                                  minDate={new Date()}
                                  value={eventFormDetail.eventDate}
                                  onChange={(newValue) => {
                                    handleDate(newValue, 'eventDate');
                                  }}
                                  renderInput={(params) => (
                                    <TextField fullWidth {...params} />
                                  )}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container columnSpacing={2}>
                                <Grid item xs={6}>
                                  <Box width="100%">
                                    <InputLabel sx={{ mb: 1 }}>
                                      Event Start Time*
                                    </InputLabel>
                                    <TimePicker
                                      style={{
                                        width: '-webkit-fill-available'
                                      }}
                                      value={eventFormDetail.eventTimeFrom}
                                      isToday={getIsToDay()}
                                      startTime={moment()}
                                      onChange={(newValue) => {
                                        handleTime(newValue, 'eventTimeFrom');
                                      }}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box width="100%">
                                    <InputLabel sx={{ mb: 1 }}>
                                      Event End Time*
                                    </InputLabel>
                                    <TimePicker
                                      value={eventFormDetail.eventTimeTo}
                                      style={{
                                        width: '-webkit-fill-available'
                                      }}
                                      startTime={eventFormDetail.eventTimeFrom}
                                      endTime="true"
                                      onChange={(newValue) => {
                                        handleTime(newValue, 'eventTimeTo');
                                      }}
                                    />
                                  </Box>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </LocalizationProvider>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Grid container rowSpacing={2}>
                      <Grid item xs={12}>
                        <CardWrapper
                          minwidth={740}
                          maxwidth={740}
                          sx={{
                            height: 250,
                            background: '#eeeeee'
                          }}
                        >
                          {!loading?.eventInviteDoc ? (
                            <BgComposed
                            >
                              {eventFormDetail.eventInviteDoc?.url === '' && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 5
                                  }}
                                >
                                  <Typography sx={{ my: 1 }}>
                                  Upload Event Invite*
                                  </Typography>
                                  <label
                                    htmlFor="contained-button-file-eventInviteDoc"
                                    id="upload-button-eventInviteDoc"
                                  >
                                    <Input
                                      accept="image/*"
                                      id="contained-button-file-eventInviteDoc"
                                      // multiple
                                      onChange={(e) => {
                                        GetURLForUpload(e, updateUrl);
                                        setLoading({
                                          ...loading,
                                          eventInviteDoc: true
                                        });
                                      }}
                                      name="eventInviteDoc"
                                      type="file"
                                      disabled={
                                        eventFormDetail.eventInviteDoc?.url !==
                                        ''
                                      }
                                    />
                                    <Button
                                      variant="contained"
                                      component="span"
                                      startIcon={
                                        <img
                                          src="/static/images/logo/projectIcons/browse-file-icon.svg"
                                          alt=""
                                          style={{ width: 30, height: 30 }}
                                        />
                                      }
                                      sx={browseButton}
                                      disabled={
                                        eventFormDetail.eventInviteDoc?.url !==
                                        ''
                                      }
                                    >
                                      Browse file 
                                    </Button>
                                  </label>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ my: 2, px: 4 }}
                                  >
                                    (JPG, PNG, PDF)
                                  </Typography>
                                </Box>
                              )}
                            </BgComposed>
                          ) : (
                            <Box sx={{ p: 5 }}>
                              <Loader />
                            </Box>
                          )}

                          {eventFormDetail.eventInviteDoc?.url !== '' && (
                            <>
                              <HighlightOffTwoToneIcon
                                onClick={() =>
                                  handleDelete(
                                    eventFormDetail?.eventInviteDoc?.url,
                                    'eventInviteDoc'
                                  )
                                }
                                style={{
                                  cursor: 'pointer',
                                  position: 'absolute',
                                  zIndex: '8',
                                  right: '3px',
                                  top: '3px'
                                }}
                              />
                              <CardMedia
                                width="100%"
                                height="15vw"
                                objectfit="contain"
                                sx={{
                                  position: 'absolute',
                                  width: '100%',
                                  height: '100%',
                                  left: 0,
                                  top: 0,
                                  borderRadius: 'inherit',
                                  zIndex: 5
                                }}
                                image={eventFormDetail.eventInviteDoc?.url}
                              />
                            </>
                          )}
                        </CardWrapper>
                      </Grid>
                      <Grid item xs={12}>
                        <CardWrapper
                          minwidth={740}
                          maxwidth={740}
                          sx={{
                            height: 250,
                            background: '#eeeeee'
                          }}
                        >
                          {!loading?.eventTeaser ? (
                            <BgComposed
                            >
                              {eventFormDetail.eventTeaser?.url === '' && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 3
                                  }}
                                >
                                  <Typography sx={{ my: 1 }}>
                                    Upload Event Teaser
                                  </Typography>
                                  <label
                                    htmlFor="contained-button-file-eventTeaser"
                                    id="upload-button-eventTeaser"
                                  >
                                    <Input
                                      accept="video/mp4,video/x-m4v,video/*"
                                      id="contained-button-file-eventTeaser"
                                      // multiple
                                      onChange={(e) => {
                                        GetURLForUpload(e, updateUrl);
                                        setLoading({
                                          ...loading,
                                          eventTeaser: true
                                        });
                                      }}
                                      name="eventTeaser"
                                      type="file"
                                      disabled={
                                        eventFormDetail.eventTeaser?.url !== ''
                                      }
                                    />
                                    <Button
                                      variant="contained"
                                      component="span"
                                      startIcon={
                                        <img
                                          src="/static/images/logo/projectIcons/browse-file-icon.svg"
                                          alt=""
                                          style={{ width: 30, height: 30 }}
                                        />
                                      }
                                      sx={browseButton}
                                      disabled={
                                        eventFormDetail.eventTeaser?.url !== ''
                                      }
                                    >
                                      Browse file 
                                    </Button>
                                  </label>

                                  <Typography
                                    variant="subtitle2"
                                    sx={{ my: 1, px: 0.5 }}
                                  >
                                    (Video must be less than 11 MB)
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ px: 1 }}
                                  >
                                    or
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      alignSelf: 'center',
                                      columnGap: -1,
                                      px: 1,
                                      mt: 1
                                    }}
                                  >
                                    {isAddLink && (
                                      <Box>
                                        <TextField
                                          name="videoLink"
                                          label="Add Link"
                                          id="add_link"
                                          variant="standard"
                                          size="small"
                                          fullWidth
                                          onChange={(event) =>
                                            handleChange(event)
                                          }
                                          value={eventFormDetail?.videoLink}
                                          InputProps={{
                                            endAdornment: (
                                              <InputAdornment position="end">
                                                <CloseIcon
                                                  onClick={() => {
                                                    setIsAddLink(
                                                      (prev) => !prev
                                                    );
                                                    setEventFormDetail({
                                                      ...eventFormDetail,
                                                      videoLink: ''
                                                    });
                                                  }}
                                                  style={{
                                                    cursor: 'pointer',
                                                    mb: 1,
                                                    fontSize: '17px'
                                                  }}
                                                />
                                              </InputAdornment>
                                            )
                                          }}
                                        />
                                      </Box>
                                    )}
                                    {!isAddLink && (
                                      <Button
                                        variant="contained"
                                        size="small"
                                        sx={customeButton}
                                        onClick={() =>
                                          setIsAddLink((prev) => !prev)
                                        }
                                      >
                                        <Typography variant="body2">
                                          Add link 
                                        </Typography>
                                      </Button>
                                    )}
                                  </Box>
                                </Box>
                              )}
                            </BgComposed>
                          ) : (
                            <Box sx={{ p: 5 }}>
                              <Loader />
                            </Box>
                          )}

                          {eventFormDetail.eventTeaser?.url !== '' && (
                            <>
                              <Box
                                sx={{
                                  position: 'relative',
                                  width: '100%',
                                  height: '100%'
                                }}
                              >
                                <CardMedia
                                  key={eventFormDetail.eventTeaser?.title}
                                  component="iframe"
                                  src={eventFormDetail.eventTeaser?.url}
                                  // allow="autoPlay"
                                  height="100%"
                                  width="auto"
                                  sx={{
                                    my: -1,
                                    display: 'block',
                                    height: { xs: '300px', md: '300px' },
                                    maxHeight: { xs: '300px', md: '480px' },
                                    border: '1px solid #ddd',
                                    borderRadius: 'inherit',
                                    zIndex: 5
                                  }}
                                  alt={eventFormDetail.eventTeaser?.title}
                                />

                                <button
                                  style={{
                                    position: 'absolute',
                                    top: '19px',
                                    right: '3px',
                                    display: 'block',
                                    width: '20px',
                                    height: '22px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: 'red',
                                    cursor: 'pointer',
                                    padding: 0,
                                    fontSize: '22px'
                                  }}
                                  type="button"
                                  onClick={() => {
                                    handleDelete(
                                      eventFormDetail?.eventTeaser?.url,
                                      'eventTeaser'
                                    );
                                  }}
                                >
                                  &times;
                                </button>
                              </Box>
                            </>
                          )}
                        </CardWrapper>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              <Box
                my={3}
                
                sx={{ display: 'flex', flexDirection: 'row', columnGap: 2 ,mx: { xs: 5, xl: 6, lg: 4 }}}
              >
                <Button
                  variant="contained"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={
                    isSubmitting || eventFormDetail.eventInviteDoc?.url === ''
                  }
                  onClick={() => handleSave()}
                >
                  Create & Invite
                </Button>
                <Button
                  variant="outlined"
                  disabled={isSubmitting}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Box>
            </Card>
          </Box>
        </>
      ) : (
        <>
          <Invite
            inviteUrl={eventFormDetail.eventInviteDoc?.url}
            eventId={eventId}
            invitees={inviteList}
          />
        </>
      )}
    </>
  );
};
export default AddEvent;
