import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  useTheme,
  Typography,
  TextField,
  Button,
  Grid,
  Modal,
  CircularProgress,
  TableCell
} from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { compareAsc } from 'date-fns';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import DeleteConfirmation from 'src/components/Projects/Drafts/DeleteConfirmation';
import { canReassignBroker } from '../../helpers/permissionHelper';

import {
  addMeetings,
  addBrokers,
  addUsers
} from '../../slices/meetings';
import { editMeetings } from '../../axiosInstances/Api';

import { getProjectList } from '../../slices/ProjectList';

import { toUpper } from '../../utils/utilits';
import OpenNotification from '../ShowNotification';

const SigleItem = ({ title, subtitle, theme }) => {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: `${theme.typography.pxToRem(13)}`,
          color: '#c0beb6',
          mt: 3,
          mx: 2
        }}
        variant="h5"
      >
        {title}:
      </Typography>
      <Typography
        sx={{
          fontSize: `${theme.typography.pxToRem(15)}`,
          mb: 1,
          mx: 2
        }}
        variant="h4"
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

const CalendarInfo = ({
  date,
  startTime,
  endtime,
  broker,
  agenda,
  notes,
  prevData,
  handleDeleteMeeting
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [editClicked, setEditClicked] = useState(false);
  const [startDateValue, setStartDateValue] = useState(
    new Date(prevData.startTime)
  );
  const [endDateValue, setEndDateValue] = useState(new Date(prevData.endTime));
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectDeleteId, setSelectDeleteId] = useState('');
  const brokers = useSelector((state) => state.meeting?.brokers);
  const ProjectList = useSelector((state) => state.projectList.projectListData);
  const weekDay = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ];
  const getValidValue = (str) => {
    if (str !== null && str !== undefined) {
      return str;
    }
    return '';
  };
  const [isLoading, setIsLoading] = useState(false);
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

  const [state, setState] = useState({
    agenda: getValidValue(prevData?.agenda),
    notes: getValidValue(prevData?.notes),
    broker: getValidValue(prevData?.broker[0]?.id),
    user: getValidValue(prevData?.builderId),
    project: getValidValue(prevData?.projectId)
  });
  const handleDelete = async (id) => {
    setOpenDeleteConfirmation(false);
    handleDeleteMeeting(id);
  };
  const handleConfirmDelete = () => {
    setOpenDeleteConfirmation(true);
  };
  const closeConfirmDelete = () => {
    setOpenDeleteConfirmation(false);
  };
  const handleClose = () => {
    setEditClicked(false);
  };
  function handleInputChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  }
  const getDisabled = (val) => {
    if (val) return { disabled: true };
    return {};
  };
  const filterBroker = (brokerId) => {
    const tempBroker = brokers.filter((item) => item.id === brokerId);
    let payload = [];
    tempBroker.forEach((item) => {
      let tempo = {
        id: item.id,
        name: `${item.first_name} ${item.last_name}`,
        phoneNumber: '+919834567825',
        email: item.email,
        status: 'Invited'
      };
      payload.push(tempo);
    });
    return payload;
  };
  const handleAddMeeting = async () => {
    let payload = {
      meetingDate: startDateValue.toISOString(),
      startTime: startDateValue.toISOString(),
      endTime: endDateValue.toISOString(),
      dayOfWeek: weekDay[startDateValue.getUTCDay()],
      broker: filterBroker(state.broker),
      agenda: state.agenda,
      notes: state.notes
    };
    if (state.project !== '') {
      payload.projectId = state.project;
    }
    setIsLoading(true);
    const response = await editMeetings(prevData?._id, payload);
    if (response === 200 || response === 201) {
      let sucessMessage = 'Sucessfully Edited Meeting';
      setOpenNoti(true); 
      setSuccessMessage(sucessMessage);
      setIsLoading(false);
    
    }
    else {
      const errorMessage = 'Something went wrong';
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      setIsLoading(false);
    }
  };
  const canEditBroker = canReassignBroker();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 1,
    height: '60%',
    p: 2
  };
  const EditModal = (open, handleClose) => {
    return (
      <>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h4" component="h1">
              Edit Meeting
            </Typography>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: 25
                  }}
                >
                  <Grid container columnSpacing={8} rowSpacing={4}>
                    <Grid item xs={6}>
                      <Box width="100%">
                        <DateTimePicker
                          label="Start Time"
                          value={startDateValue}
                          minDateTime={new Date()}
                          onChange={(date) => {
                            if (
                              compareAsc(startDateValue, endDateValue) === 1
                            ) {
                              setEndDateValue(date);
                            }
                            setStartDateValue(date);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box width="100%">
                        <DateTimePicker
                          label="End Time"
                          value={endDateValue}
                          minDateTime={new Date(startDateValue)}
                          onChange={(date) => {
                            setEndDateValue(date);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box width="100%">
                        <TextField
                          margin="normal"
                          label="Agenda"
                          name="agenda"
                          onChange={(event) => handleInputChange(event)}
                          value={state.agenda}
                          variant="outlined"
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box width="100%">
                        <TextField
                          margin="normal"
                          label="Notes"
                          name="notes"
                          onChange={(event) => handleInputChange(event)}
                          value={state.notes}
                          variant="outlined"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box width="100%">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Broker
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            name="broker"
                            id="demo-simple-select"
                            value={state.broker}
                            label="Broker"
                            onChange={(event) => handleInputChange(event)}
                            {...getDisabled(!canEditBroker)}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {brokers.map((item) => {
                              return (
                                <MenuItem
                                  value={item.id}
                                >{`${item.first_name} ${item.last_name}`}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box width="100%">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Project
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
                            {ProjectList?.map((item) => {
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
                  </Grid>
                </Box>
              </LocalizationProvider>
              <Box mt={5} mb={10}>
                <Button variant="contained" onClick={() => handleAddMeeting()}>
                  {isLoading ? (
                    <CircularProgress
                      size={22}
                      style={{
                        color: 'white'
                      }}
                    />
                  ) : (
                    'Save'
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
      </>
    );
  };
  useEffect(() => {
    dispatch(addBrokers());
    dispatch(addUsers());
    dispatch(getProjectList());
  }, []);
  return (
    <>
      <TableCell>
        <SigleItem title="Date" subtitle={date} theme={theme} />
      </TableCell>
      <TableCell>
        <SigleItem
          title="Time"
          subtitle={`${startTime} to ${endtime}`}
          theme={theme}
        />
      </TableCell>
      <TableCell>
        <SigleItem title="Broker" subtitle={toUpper(broker)} theme={theme} />
      </TableCell>
      <TableCell>
        <SigleItem title="Agenda" subtitle={toUpper(agenda)} theme={theme} />
      </TableCell>
      <TableCell>
        <SigleItem title=" Notes" subtitle={toUpper(notes)} theme={theme} />
      </TableCell>
      <TableCell>
        <Box>
          <Typography
            sx={{
              fontSize: `${theme.typography.pxToRem(13)}`,
              color: '#c0beb6',
              mt: 3,
              mx: 2
            }}
            variant="h5"
          >
            Actions:
          </Typography>
          <Box style={{ display: 'flex', flexDirection: 'row' }}>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(15)}`,
                color: '#3c96e8',
                cursor: 'pointer',
                mb: 1,
                mx: 2
              }}
              variant="h4"
              onClick={() => {
                setEditClicked(true);
              }}
            >
              Edit
            </Typography>
            |
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(15)}`,
                color: '#3c96e8',
                cursor: 'pointer',
                mb: 1,
                mx: 2
              }}
              variant="h4"
              onClick={() => {
                setSelectDeleteId(prevData?._id);
                handleConfirmDelete();
              }}
            >
              Cancel
            </Typography>
          </Box>
        </Box>
      </TableCell>
      {editClicked && EditModal(editClicked, handleClose)}
      {openDeleteConfirmation && (
        <DeleteConfirmation
          openConfirmDelete={openDeleteConfirmation}
          closeConfirmDelete={closeConfirmDelete}
          handleDeleteCompleted={handleDelete}
          title="Meeting"
          selectedId={selectDeleteId}
        />
      )}
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />

    </>
  );
};

export default CalendarInfo;
