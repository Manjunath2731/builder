import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Grid,
  CircularProgress,
  Divider,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { compareAsc } from 'date-fns';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TimePicker from 'src/components/EventPolls/TimePicker/index.js';
import MultipleSelect from '../../content/blocks/Multiselect/mutliSelect';
import { isValid } from '../../utils/utilits';
import { editMeetings } from '../../axiosInstances/Api';
import {
  addMeetings,
  addBrokers,
  addUsers,
  addProjects,
  addMeetingCard
} from '../../slices/meetings';
import OpenNotification from '../ShowNotification';

let meetings = [];

const errors = {
  title: false,
  project: false,
  broker: false
};
function EditMeeting({ prevData, open, handleDetailClose }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addMeetings());
    dispatch(addBrokers());
    dispatch(addUsers());
    dispatch(addProjects());
    dispatch(addMeetingCard());
  }, []);
  const getValidValue = (str) => {
    if (str !== null && str !== undefined) {
      return str;
    }
    return '';
  };
  const getBrokerList = (brokerArr) => {
    let tempBroker = [];
    if (brokerArr.length > 0) {
      tempBroker = brokerArr.map((item) => {
        let name = item?.name.split(' ');
        return {
          value: item.id,
          label: `${name[0]} ${isValid(name[1]) ? name[1] : ''}`
        };
      });
    }
    return tempBroker;
  };
  const broker = useSelector((state) => state.meeting?.brokersBygroup );
  meetings = useSelector((state) => state.meeting?.meetingCard);
  const project = useSelector((state) => state.meeting?.projectListBuilder);
  const [startDateValue, setStartDateValue] = useState(
    new Date(prevData.startTime)
  );
  const [startTimeValue, setStartTimeValue] = useState(
    moment(prevData.startTime)
  );
  const [endTimeValue, setEndTimeValue] = useState(moment(prevData.endTime));
  const [brokerList, setBrokerList] = useState([]);
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
    agenda: getValidValue(prevData?.agenda),
    notes: getValidValue(prevData?.notes),
    broker: getBrokerList(prevData?.broker),
    user: getValidValue(prevData?.builderId),
    project: prevData?.projectId?._id
  });
  const [formErrors, setFormErrors] = useState(errors);
  

  const handleTime = (newValue) => {
    setStartTimeValue(newValue);
    const dateStr = new Date(newValue);
    const endDate = new Date(newValue);
    const tempTime = endDate?.setMinutes(dateStr?.getMinutes() + 30);
    setEndTimeValue(moment(tempTime));
  };
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
  useEffect(() => {}, [meetings]);
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
    if (broker.length) {
      for (let i = 0; i < brokerParams.length; i++) {
        const tempBroker = broker.filter(
          (item) => item._id === brokerParams[i]?.value
        );
        tempBroker.forEach((item) => {
          let tempo = {
            id: item._id,
            name: `${item.first_name} ${item.last_name}`,
            phoneNumber: item?.phone_number,
            email: item.email,
            status: 'Invited'
          };
          payload.push(tempo);
        });
      }
    }
    return payload;
  };

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
      handleClose();
      }
    }
  };
  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };
    
  const handleAddMeeting = async () => {
    if (!state.agenda) {
      setFormErrors((formErrors) => ({ ...formErrors, title: true }));
    }
    if (!state.broker) {
      setFormErrors((formErrors) => ({ ...formErrors, broker: true }));
    }
    if (!state.agenda || !state.broker) {
      return;
    }
    let startTime = getjointZValue(startDateValue, startTimeValue);
    let endTime = getjointZValue(startDateValue, endTimeValue);
    let payload = {
      meetingDate: startTime,
      startTime,
      endTime,
      dayOfWeek: weekDay[startDateValue.getUTCDay()],
      broker: filterBroker(state.broker),
      agenda: state.agenda,
      notes: state.notes,
      builderCompany: userData.builderCompany[0]
    };
    if (state.project !== '') {
      payload.projectId = state.project;
    }
    setIsLoading(true);
    const response = await editMeetings(prevData?._id, payload);
    if (response === 200 || response === 201) {
      let sucessMessage = 'Sucessfully Edited Meeting';
      // showNotification(sucessMessage, notificationType.SUCCESS);
      // setIsLoading(false);
      setOpenNoti(true); 
      setSuccessMessage(sucessMessage);
      setIsLoading(false);
      
    } else {
      const errorMessage = 'Something went wrong';
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      setIsLoading(false);
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
  const handleClose = () => {
    setFormErrors(errors);
    handleDetailClose();
  };
  const handleMultipleDDChange = (e) => {
    if (Array.isArray(e) && e.length) {
      setFormErrors((formErrors) => ({ ...formErrors, broker: false }));
    }
    setState((prevState) => ({
      ...prevState,
      broker: Array.isArray(e) ? e : []
    }));
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ zIndex: 7 }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h1">
            Edit Meeting
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
                          if (compareAsc(startDateValue, date) === 1) {
                            setStartTimeValue(moment());
                          }
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
                              <MenuItem value={item._id}>{item.name}</MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={5}>
                    <Box width="100%">
                      <TimePicker
                        style={{
                          width: '-webkit-fill-available',
                          borderRadius: '16px',
                          height: '50px'
                        }}
                        value={startTimeValue}
                        isToday={getIsToDay()}
                        startTime={moment()}
                        onChange={(newValue) => {
                          handleTime(newValue);
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
                      <FormControl fullWidth required>
                        <MultipleSelect
                          data={brokerList}
                          value={state?.broker}
                          handleChange={handleMultipleDDChange}
                          placeholder='Channel Partner *'
                        />
                        {formErrors?.broker && (
                          <FormHelperText error="true">
                            This Field is Required
                          </FormHelperText>
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
                  'Save Changes'
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
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
}

export default EditMeeting;
