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
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { toUpperMutliple } from '../../utils/utilits';
import { editMeetings } from '../../axiosInstances/Api';
import { addMeetings, addBrokers, addUsers } from '../../slices/meetings';
import { getProjectById } from '../../slices/ProjectList';
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

const ClientVisitPopup = ({ openConfirm, closeConfirm, data, endTime }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [noteOpen, setNoteOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [rmList, setRMList] = useState([]);
  const project = useSelector((state) => state.meeting?.projects);
  const RMs = useSelector((state) => state.team?.teamList);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    notes: '',
    broker: [],
    RMMember: ''
  });

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
        closeConfirm();
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const isDetailEdit = () => {
    return state?.notes !== '' || state?.broker.length > 0 || state?.RMMember;
  };
  useEffect(() => {
    if (RMs?.length) {
      setRMList(RMs);
    }
  }, [RMs]);

  useEffect(() => {
    dispatch(addBrokers());
    dispatch(addUsers());
    dispatch(getTeams());
    dispatch(getProjectById(data?.projectId));
  }, []);
  const getProjectName = (id) => {

    let projectName = project.filter((item) => item._id === id);
    return projectName[0]?.name || '';
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
  function handleInputChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  }
  const handleSave = async () => {
    console.log(state.RMMember);

    let payload = {
      meetingDate: data?.meetingDate,
      startTime: data?.startTime,
      endTime,
      dayOfWeek: data?.dayOfWeek,
      notes: state.notes?.length > 0 ? state.notes : undefined
    };
    if (state?.RMMember) {
      payload.assignRm = state?.RMMember?._id
    }

    if (state.project !== '') {
      payload.projectId = data?.projectId;
    }
    setIsLoading(true);
    const response = await editMeetings(data?._id, payload);
    if (response === 200 || response === 201) {
      let sucessMessage = 'Sucessfully Edited Client Visit';
      if (state?.RMMember) {
        sucessMessage = 'Sucessfully Edited and Ressigned the Client Visit';
      }

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
            <Typography variant="h3" sx={{ mb: 1 }}>
              {/* {`${data?.meetingType || toUpperMutliple(data?.agenda)} `} */}
              {data.agenda ? toUpperMutliple(data.agenda) : data.meetingType === "CLIENTVISIT" ? "CLIENT VISIT" : "WALK IN"}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'lighter',
                font: 'Helvetica Neue Medium',
                mb: 0.5
              }}
            >
              {getProjectName(data?.projectId)}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'lighter',
                font: 'Helvetica Neue Medium'
              }}
            >
              {dateChanger(data?.meetingDate, 'date')} - at
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
            {data?.notes?.length > 0 ? (
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
              Visit requested by
            </Typography>

            <Typography variant="h4">
              {toUpperMutliple(`${data?.organizer?.first_name} ${data?.organizer?.last_name}`)}
            </Typography>
          </Box>
        </Box>
        {
        new Date() <= new Date(data.meetingDate) && <Box
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
                    Select Relation Manager
                  </InputLabel>
                  <Typography
                    variant="subtitle2"
                    onClick={() => {
                      setTeamOpen(false);
                      setState({
                        ...state,
                        RMMember: ''
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
                    name="RMMember"
                    id="demo-simple-select"
                    value={state.RMMember}
                    placeholder="RM Member"
                    onChange={(event) => handleInputChange(event)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {rmList.map((item) => {
                      return <MenuItem value={item}>{`${item?.first_name} ${item?.last_name}`} </MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Box>
            </>
          )}
        </Box>
        }
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            px: 5,
            py: 3
          }}
        >
          {isDetailEdit() && (
            <>
              <Button
                variant="contained"
                fullWidth
                startIcon={isLoading ? <CircularProgress size="1rem" /> : null}
                disabled={isLoading}
                onClick={() => {
                  handleSave();
                }}
              >
                Save changes
              </Button>
            </>
          )}
        </Box>
      </DialogWrapper>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
};

export default ClientVisitPopup;
