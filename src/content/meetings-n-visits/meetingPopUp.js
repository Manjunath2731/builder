import React, { forwardRef, useState, useEffect } from 'react';
import {
  IconButton,
  Box,
  Slide,
  Button,
  Dialog,
  styled,
  Typography,
  useTheme,
  TextField,
  CircularProgress
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import { canAddMeeting, canDeleteMeeting } from 'src/helpers/permissionHelper';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import MultipleSelect from '../../content/blocks/Multiselect/mutliSelect';
import { isValid, toUpperMutliple } from '../../utils/utilits';
import { DeleteMeetings, editMeetings } from '../../axiosInstances/Api';
import {
  addMeetings,
  // addBrokers,
  addUsers,
  addBrokersBygroupId
} from '../../slices/meetings';
import { getTeams } from '../../slices/team';
import OpenNotification from '../ShowNotification';

const DialogWrapper = styled(Dialog)(
  () => `
        .MuiDialog-paper {
          overflow: visible;
        }
  `
);
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const MeetingPopUp = ({ openConfirm, closeConfirm, data, handleEdit }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [noteOpen, setNoteOpen] = useState(false);
  const [brokerOpen, setBrokerOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [brokerList, setBrokerList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const broker = useSelector((state) => state.meeting?.brokersBygroup);
  const team = useSelector((state) => state.team?.teamList);
  const [isLoading, setIsLoading] = useState(false);
  const userData = JSON.parse(window.localStorage.getItem('user'));


  const [state, setState] = useState({
    notes: '',
    broker: [],
    teamMember: '',
    project: ''
  });

  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
   
  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        closeConfirm();
        dispatch(addMeetings());
        // navigate(`/team/${selectedTab}`);
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const handleDelete = async (id) => {
    const response = await DeleteMeetings(id);
    if (response === 202) {
      // let sucessMessage = 'Meeting Cancelled';
      // showNotification(sucessMessage, notificationType.SUCCESS);
      // setIsLoading(false);
      setOpenNoti(true); 
      setSuccessMessage('Meeting Cancelled');
      setIsLoading(false);
      
      // dispatch(addMeetings());
    } else {
      // let errorMessage = 'Something went wrong';
      // showNotification(errorMessage, notificationType.ERROR);
      // setIsLoading(false);
      const errorMessage = 'Something went wrong';
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      setIsLoading(false);

    }
  }

  const isDetailEdit = () => {
    return state?.notes !== '' || state?.broker.length > 0 || state?.teamMember;
  };
  const getItem = (id, selectedBroker) => {
    let matchedlist = selectedBroker.filter((item) => item.id === id);
    return matchedlist.length === 0;
  };
  const getSelectedBrokerIds = (selectedBroker, brokerList) => {
    let requiredbrokerList = [];
    requiredbrokerList = brokerList.filter((item) => {
      let filteredBroker = getItem(item._id, selectedBroker);
      if (filteredBroker) {
        return true;
      }
      return false;
    });
    return requiredbrokerList;
  };
  useEffect(() => {
    if (broker.length) {
      let brokerList = getSelectedBrokerIds(data?.broker, broker);
      let tempBroker = brokerList.map((item) => {
        return {
          value: item._id,
          label: `${item?.first_name} ${item?.last_name ? item?.last_name : ''}`
        };
      });
      setBrokerList(tempBroker);
    }
    if(data.projectId){
      setState({
        ...state,
        project:data.projectId
      })
    }
    if (team.length && data.projectId) {
      let tempteam = team.filter((t) =>
    data.projectId.relationManager.includes(t._id)
);
      setTeamList(tempteam);
    }else{
      setTeamList(team);
    }
  }, [broker.length, team]);

  useEffect(() => {
    dispatch(addBrokersBygroupId(userData.builderCompany[0]));
    dispatch(addUsers());
    dispatch(getTeams());
  }, []);

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
            phoneNumber: item.phoneNumber,
            email: item.email,
            status: 'Invited'
          };
          payload.push(tempo);
        });
      }
    }
    return payload;
  };
  const dateChanger = (dateString, type) => {
    let time = '';
    let date = '';
    if (type === 'time') {
      time = new Date(dateString)
        .toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        .toLowerCase();
      return time;
    }
    date = new Date(dateString).toDateString();
    return date;
  };
  const getBrokersName = (brokerArr) => {
    let brokerName;
    if (brokerArr?.length > 0) {
      brokerName = brokerArr?.map((item) => {
        let name = item?.name.split(' ');
        return `${name[0]} ${isValid(name[1]) ? name[1] : ''}`;
      });
    }

    return brokerName?.length > 0
      ? brokerName.join(' , ')
      : 'No brokers invited yet';
  };
  function handleInputChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  }
  const handleMultipleDDChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      broker: Array.isArray(e) ? e : []
    }));
  };
  const handleSave = async () => {
    let newBrokers = filterBroker(state.broker);
    let prevbroker = data?.broker;
    let payload = {
      meetingDate: data?.meetingDate,
      startTime: data?.startTime,
      endTime: data?.endTime,
      dayOfWeek: data?.dayOfWeek,
      broker: prevbroker.concat(newBrokers),
      agenda: data?.agenda,
      notes: data?.notes.length > 0 ? data?.notes : state.notes,
      builderCompany: userData.builderCompany[0]
    };
    if (state?.teamMember) {
      payload.organizer = state?.teamMember
    }

    if (state.project !== '') {
      payload.projectId = data?.projectId;
    }
    setIsLoading(true);
    const response = await editMeetings(data?._id, payload);
    if (response === 200 || response === 201) {
      let sucessMessage = 'Sucessfully Edited Meeting';
      console.log('stateteam',state?.teamMember)
      if(state?.teamMember){
         sucessMessage = 'Sucessfully Edited and Ressigned the meeting';
      }

      setOpenNoti(true); 
      setSuccessMessage(sucessMessage);
      setIsLoading(false);
      // showNotification(sucessMessage, notificationType.SUCCESS);
      // dispatch(addMeetings());
      // closeConfirm();
    } else {
      const errorMessage = 'Something went wrong';
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      setIsLoading(false);
    }
  };
  const isAddMeeting = canAddMeeting();
  const isDeleteMeeting = canDeleteMeeting();
  return (
    <>
      <DialogWrapper
        open={openConfirm}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirm}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            px: 2,
            pt: 1
          }}
        >
          <IconButton onClick={closeConfirm}>
            <CloseIcon fontSize="large" sx={{ color: 'divider' }} />
          </IconButton>
        </Box>
        <Box sx={{ px: 5 }}>
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>
              {toUpperMutliple(data.agenda)}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'lighter',
                font: 'Helvetica Neue Medium'
              }}
            >
              {dateChanger(data?.meetingDate, 'date')} - at{' '}
              {dateChanger(data?.startTime, 'time')}
            </Typography>
          </Box>
          <Box sx={{ pt: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'normal',
                font: 'Helvetica Neue Medium',
                mb: 0.5
              }}
            >
              Notes
            </Typography>
            {data?.notes.length > 0 ? (
              <Typography
                variant="h4"
                sx={{
                  font: 'Helvetica Neue Medium'
                }}
              >
                {data?.notes}
              </Typography>
            ) : (
              <>
                {!noteOpen ? (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        columnGap: 1
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          font: 'Helvetica Neue Medium',
                          color: '#c0c1c3'
                        }}
                      >
                        No notes added,
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        onClick={() => {
                          setNoteOpen(true);
                        }}
                        sx={{
                          fontWeight: 600,
                          font: 'Helvetica Neue Medium',
                          color: theme.palette.primary.main,
                          cursor: 'pointer'
                        }}
                      >
                        Add now
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="subtitle2"
                      onClick={() => {
                        setNoteOpen(false);
                        setState({
                          ...state,
                          notes: ''
                        });
                      }}
                      sx={{
                        fontWeight: 600,
                        font: 'Helvetica Neue Medium',
                        color: theme.palette.error.main,
                        cursor: 'pointer'
                      }}
                    >
                      Click to close
                    </Typography>
                    <Box width="100%" sx={{ mt: -1 }}>
                      <TextField
                        fullWidth
                        multiline
                        margin="normal"
                        label="Notes"
                        name="notes"
                        onChange={(event) => handleInputChange(event)}
                        value={state.notes}
                        variant="outlined"
                      />
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>

          <Box sx={{ py: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'normal',
                font: 'Helvetica Neue Medium',
                mb: 0.5
              }}
            >
              Channel Partner Invited
            </Typography>

            <Typography variant="h4">{getBrokersName(data.broker)}</Typography>
            {!brokerOpen ? (
              new Date() <= new Date(data.meetingDate) && <Typography
                variant="subtitle2"
                onClick={() => {
                  setBrokerOpen(true);
                }}
                sx={{
                  fontWeight: 600,
                  font: 'Helvetica Neue Medium',
                  color: theme.palette.primary.main,
                  cursor: 'pointer'
                }}
              >
                Invite more Channel Partner
              </Typography>
            ) : (
              <>
                <Typography
                  variant="subtitle2"
                  onClick={() => {
                    setBrokerOpen(false);
                    setState({
                      ...state,
                      broker: []
                    });
                  }}
                  sx={{
                    fontWeight: 600,
                    font: 'Helvetica Neue Medium',
                    color: theme.palette.error.main,
                    cursor: 'pointer',
                    mb: 0.5
                  }}
                >
                  Click to close
                </Typography>
                <FormControl fullWidth required>
                  <MultipleSelect
                    data={brokerList}
                    value={state?.broker}
                    handleChange={handleMultipleDDChange}
                    placeholder={<div>Broker</div>}
                  />
                </FormControl>
              </>
            )}
          </Box>
        </Box>
        {new Date() <= new Date(data.meetingDate) && <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            columnGap: 1,
            background: '#f5f8fd',
            borderTop: 1.5,
            borderBottom: 1.5,
            borderColor: 'divider',
            px: 5,
            py: 2,
            mt: 2
          }}
        >
          {!teamOpen ? (
            <>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'normal',
                  font: 'Helvetica Neue Medium'
                }}
              >
                Not available?
              </Typography>
              <Typography
                variant="h4"
                onClick={() => {
                  setTeamOpen(true);
                }}
                sx={{
                  fontWeight: 600,
                  font: 'Helvetica Neue Medium',
                  color: theme.palette.primary.main,
                  cursor: 'pointer'
                }}
              >
                Reassign to a team member
              </Typography>
            </>
          ) : (
            <>
              <Box width="100%">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    columnGap: 1,
                    rowGap: 1,
                    mb: 0.5
                  }}
                >
                  <InputLabel
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      font: 'Helvetica Neue Medium'
                    }}
                  >
                    Select Team Member
                  </InputLabel>
                  <Typography
                    variant="subtitle2"
                    onClick={() => {
                      setTeamOpen(false);
                      setState({
                        ...state,
                        teamMember: ''
                      });
                    }}
                    sx={{
                      fontWeight: 600,
                      font: 'Helvetica Neue Medium',
                      color: theme.palette.error.main,
                      cursor: 'pointer'
                    }}
                  >
                    Click to close
                  </Typography>
                </Box>
                <FormControl fullWidth required>
                  <Select
                    labelId="demo-simple-select-label"
                    name="teamMember"
                    id="demo-simple-select"
                    value={state.teamMember}
                    placeholder="Team Member"
                    onChange={(event) => handleInputChange(event)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {teamList.map((item) => {
                      return (
                        <MenuItem
                          value={item._id}
                        >{`${item.first_name} ${item.last_name}`}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </>
          )}
        </Box>}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            px: 5,
            py: 3
          }}
        >
          {!isDetailEdit() ? (
              new Date() <= new Date(data.meetingDate) && (
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                {isAddMeeting && <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleEdit()}
                  sx={{
                    mr: 2,
                  }}
                >
                  Edit
                </Button>
                }

                {isDeleteMeeting && <Button variant="outlined" fullWidth onClick={() => handleDelete(data._id)}>
                  Delete
                </Button>}
              </Box>
            )
          ) : (
            <Button
              variant="contained"
              fullWidth
              startIcon={isLoading ? <CircularProgress size="1rem" /> : null}
              disabled={isLoading}
              onClick={() => {
                handleSave();
              }}
            >
              {' '}
              Save changes
            </Button>
          )}
        </Box>

      </DialogWrapper>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
};

export default MeetingPopUp;
