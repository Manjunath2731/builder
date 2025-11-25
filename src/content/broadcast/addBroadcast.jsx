import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import moment from 'moment';
import {
  Box,
  Card,
  styled,
  Grid,
  InputLabel,
  Button,
  useTheme,
  Typography,
  TextField,
  Select,
  Radio,
  MenuItem,
  // CardMedia,
  Divider, //  Card, Divider,
  CircularProgress
} from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import { DateTimePicker } from '@mui/lab';
import { DatePicker } from '@mui/lab';
// import { notificationType } from 'src/constants/NotificationType';
import { useDispatch, useSelector } from 'react-redux';
// import { showNotification } from 'src/utils/commonUtility';
import FormControl from '@mui/material/FormControl';
import { categoryName } from 'src/constants/BroadcastConstants';
import { createBroadcast, updateBroadcast } from '../../axiosInstances/Api';
import {
  UploadFileVertical,
  GetURLForUpload,
  handleRemoveFromS3,
} from '../../components/Projects/AddProject/Index';
import { getUserBroadcastData } from '../../slices/broadcast';
import { addProjects } from '../../slices/meetings';
// ImageComponent
// import {  VideoComponent } from '../../components/Projects/AddProject/ProjectMediaForm';
// import {MediaScrollBar} from '../../components/Projects/ViewProjectDetails/ProjectDetailScreens/ProjectMedia';
import TimePicker from '../../components/EventPolls/TimePicker';
import OpenNotification from '../ShowNotification';


const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      z-index: 5;
      height:100%;
      width: 97%;
      }
    `
);
const errorValues = {
  details: false
}
export const GetResultFileArray = (arrayResult) => {
  let files = arrayResult.map(result => ({
    label: result?.originalFileName || '',
    url: result?.url || '',
    contentType: result?.contentType || '',
    formType: result?.type || ''
  }))
  return files.length > 0 ? files : [];
}

const AddBroadcast = () => {
  const params = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  // const title = useSelector((state) => state.broadcast.broadcastTitle);

  const editBroadCast = useSelector((state) => state.broadcast.userBroadcast);

  const [editUser, setEditUser] = useState(false);
  const [state, setState] = useState({
    select_project: '',
    broadcast_title: '',
    broadcast_description: '',
    add_link: '',
    broadcast_frequency: 'immediate'
  });
  const [uploadBroadCast, setUploadBroadCast] = useState([]);
  const [indexImages, setIndexImages] = useState(-1);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [startTimeValue, setStartTimeValue] = useState(moment());
  const [formError, setError] = useState(errorValues);
  const [projectList, setProjectList] = useState([]);
  // const [selectedProject,setSelectedProject] = useState({});
  const category = useSelector((state) => state.broadcast.broadcastType);
  const project = useSelector((state) => state.meeting?.projects);

  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        navigate(`/broadcast`);;
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  useEffect(async () => {
    if (params.broadCastID) {
      dispatch(getUserBroadcastData(params.broadCastID));
      setEditUser(true);
    }
    addProjects();
  }, [])


  useEffect(() => {
    if (project.length) {
      const finalList = project.filter((item) => item.status === 'PUBLISHED');
      setProjectList(finalList);
    }
  }, [project, category]);

  useEffect(() => {
    if (editUser && editBroadCast.length > 0) {
      setState({
        select_project: editBroadCast[0]?.projectId,
        broadcast_title: editBroadCast[0]?.title,
        broadcast_description: editBroadCast[0].description,
        add_link: editBroadCast[0].link,
        broadcast_frequency: editBroadCast[0].delivery
      })
      const result = editBroadCast[0].content.map((d) => {
        return {
          label: d.label,
          url: d.downloadLink,
          contentType: d.contentType,
        }
      })

      setUploadBroadCast(result);
      setStartDateValue(editBroadCast[0].deliveryTime);
      setStartTimeValue(moment(editBroadCast[0].deliveryTime));
    }
  }, [editUser, editBroadCast, project])

  const handleInputChange = (evt) => {
    const value = evt.target.value;
    if (evt.target.name === 'broadcast_title' && evt.target.value !== '') {
      setError(formError => ({ ...formError, details: false }))
    }
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  // delete function
  const handleImageDelete = (name, url, indexImages, setIndex) => {
    handleRemoveFromS3(url).then((response) => {
      if (response) {
        const ImagesArray = [...uploadBroadCast];
        ImagesArray.splice(indexImages, 1);
        setIndex(ImagesArray.length - 1);

        setUploadBroadCast(ImagesArray);
      }
    });
  };

  const updateURlImages = (result) => {
    console.log(result);
    let files = GetResultFileArray(result);
    let ImagesArray = [...uploadBroadCast];
    Array.prototype.push.apply(ImagesArray, files);
    const filtered = ImagesArray.filter(Boolean);
    console.log("filtered",filtered)
    setUploadBroadCast(filtered);
    // setLoading(false);
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

  const createBroadcastOnSubmit = async () => {
    console.log(getjointZValue(
      startDateValue,
      startTimeValue
    ))
    if (!state.broadcast_title) {
      setError(formError => ({ ...formError, details: true }))
      return;
    }
    const upload = uploadBroadCast.map((item) => ({
      downloadLink: item?.url,
      label: item?.label,
      contentType: item?.contentType
    }));
    let startTime = getjointZValue(
      startDateValue,
      startTimeValue
    );
    if (state.select_project === "none") {
      state.select_project = null
    }
    const payload = {
      title: state.broadcast_title,
      description: state.broadcast_description,
      projectId: state.select_project ? state.select_project : undefined,
      content: upload,
      delivery: state.broadcast_frequency,
      link: state.add_link || '',
      category,
      deliveryTime: startTime
    };

    setIsLoading(true);
    if (
      !payload.title ||
      !(payload.description ||
        payload?.content[0]?.downloadLink)
    ) {
      setIsLoading(false);
      let errorMessage = 'Please fill out the form';
      // showNotification(errorMessage, notificationType.ERROR);
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      return;
    }
    const response = await createBroadcast(payload);
    if (response === 200 || response === 201) {
      let sucessMessage = 'Sucessfully Created Broadcast';
      // showNotification(sucessMessage, notificationType.SUCCESS);
      // navigate(`/broadcast`);
      // setIsLoading(false);
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
      setIsLoading(false);

    } else if (response === 400) {
      let errorMessage = 'Unable to create Broadcast';
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      let errorMessage = 'Something went wrong';
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      setIsLoading(false);
    }
  };

  const updateBroadcastOnSubmit = async (broadCastId) => {
    console.log(getjointZValue(
      startDateValue,
      startTimeValue
    ))
    if (!state.broadcast_title) {
      setError(formError => ({ ...formError, details: true }))
      return;
    }
    const upload = uploadBroadCast.map((item) => ({
      downloadLink: item?.url,
      label: item?.label,
      contentType: item?.contentType
    }));
    let startTime = getjointZValue(
      startDateValue,
      startTimeValue
    );
    if (state.select_project === "none") {
      state.select_project = null
    }
    const payload = {
      title: state.broadcast_title,
      description: state.broadcast_description,
      projectId: state.select_project ? state.select_project : undefined,
      content: upload.length > 0 ? upload : null,
      delivery: state.broadcast_frequency,
      link: state.add_link || '',
      category,
      deliveryTime: startTime
    };

    setIsLoading(true);
    if (
      !payload.title ||
      !(payload.description ||
        payload?.content[0]?.downloadLink)
    ) {
      setIsLoading(false);
      let errorMessage = 'Please fill out the form';
      // showNotification(errorMessage, notificationType.ERROR);
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      return;
    }
    const response = await updateBroadcast(broadCastId, payload);
    if (response.status === 204) {
      let sucessMessage = 'Broadcast Updated';
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
      setIsLoading(false);
    } else if (response.status === 400) {
      let errorMessage = 'Unable to update broadcast';
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      let errorMessage = 'Something went wrong';
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      setIsLoading(false);
    }
  };

  const uploadData = (e, updateURlImages, indexImages) => {

    // const { name, id } = e.target;
    let files = e.target.files || e.dataTransfer.files;
    // let nameType = name || id;
    // const userData = JSON.parse(window.localStorage.getItem('user'));

    // let fileBoolean = true;
    // let compressedData;

    // if (files) {
    //   const isSVG = files[0].type === 'image/svg+xml';
    //   const isZIP = files[0].type === 'application/zip' || files[0].type === 'application/x-zip-compressed';
  
    //   if (isSVG || isZIP || files[0].size > 1024 * 1024 * 200) {
    //     const errorMessage = 'SVG and ZIP files are not allowed. Please upload a different file.';
    //     setErrorMessage(errorMessage);
    //     setOpenNoti(true);
    //     return;
    //   }
    // }
    if (files) {
      if (files[0]?.type === 'application/pdf') {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          // alert("pdf error")
          const errorMessage = 'Document file should not exceed 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (
        files[0]?.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Document file should not exceed 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (files[0]?.type.startsWith('image/')) {
        if (files[0].size > 1024 * 1024 * 2) {
          // fileBoolean = false;
          // alert("IMage error")
          const errorMessage = 'Image size should not exceed 2MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (files[0]?.type === 'application/vnd.ms-powerpoint' ||
        files[0]?.type === 'application/vnd.ms-powerpoint' ||
        files[0]?.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Document file should not exceed 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (
        files[0]?.type === 'application/msword' ||
        files[0]?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Document file should not exceed 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (files[0].type.startsWith('video/')) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Video file should not exceed 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      }
    }
    GetURLForUpload(
      e,
      updateURlImages, indexImages

    );
  }
  // console.log("updateBroadcast",updateBroadcast);

  return (
    <>
      <Box sx={{ py: 2, pl: { xs: 5, lg: 6 }, pr: { xs: 5, md: 6 } }} >
        {
          !editUser ?
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              cursor="pointer"
              onClick={() => {
                navigate('/broadcast/create-broadcast');
              }}
              mb={1}
            >
              <ArrowBackIosNewIcon fontSize="small" sx={{cursor:"pointer"}}  />
              <Typography
                sx={{
                  fontSize: `${theme.typography.pxToRem(15)}`,
                }}
                variant="h4"
              >
                CREATE BROADCAST
              </Typography>
            </Box>
            :
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              cursor="pointer"
              onClick={() => {
                navigate('/broadcast');
              }}
              mb={1}
            >
              <ArrowBackIosNewIcon fontSize="small" sx={{cursor:"pointer"}} />
              <Typography
                sx={{
                  fontSize: `${theme.typography.pxToRem(15)}`,
                }}
                variant="h4"
              >
                EDIT BROADCAST
              </Typography>
            </Box>
        }
        <CardWrapper sx={{ mt: 3 }}>
          <Box autoComplete="off" my={1} mx={9} mt={4}>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(15)}`,
                mb: 1
              }}
              variant="subtitle1"
            >
              {editUser ? "" : "2 of 2"}
            </Typography>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(17)}`,
                mb: 3,
                mt: 1
              }}
              variant="h2"
            >
              {/*  */}
              {categoryName[category]?.split("_").join(" ")}
            </Typography>
            <Grid container columnSpacing={6} rowSpacing={4}>
              <Grid item xs={12} md={6}>
                <Box width="100%" mb={4}>
                  <TextField
                    id="broadcast_title"
                    name="broadcast_title"
                    label="Broadcast Title*"
                    variant="outlined"
                    fullWidth
                    onChange={(event) => handleInputChange(event)}
                    value={state.broadcast_title} // Make sure this value is set
                    placeholder="Enter Broadcast Title"
                    helperText={formError.details ? 'This field is required' : ''}
                    error={formError.details}
                  />
                </Box>
                <Box width="100%" mb={4}>
                  <TextField
                    id="broadcast_description"
                    name="broadcast_description"
                    label="Broadcast Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    onChange={(event) => handleInputChange(event)}
                    value={state.broadcast_description}
                  />
                </Box>
                <Box width="100%" mb={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select Project</InputLabel>
                    <Select
                      label="select project"
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                      value={state.select_project}
                      name="select_project"
                    >
                      <MenuItem key={1} value="none">
                        <Box ml={2} display="inline-block">
                          Select
                        </Box>
                      </MenuItem>
                      {projectList.map((item) => {
                        return (
                          <MenuItem value={item._id}>{item.name}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
                <Box width="100%" mb={2}>
                  <TextField
                    id="add_link"
                    name="add_link"
                    label="Add Link"
                    variant="outlined"
                    fullWidth
                    onChange={(event) => handleInputChange(event)}
                    value={state.add_link}
                  />
                </Box>
                <Box>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="broadcast_frequency"
                      onChange={(event) => handleInputChange(event)}
                      value={state.broadcast_frequency}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <FormControlLabel
                          value="immediate"
                          control={<Radio />}
                          label="Immediate"
                        />
                        <FormControlLabel
                          value="scheduleBroadcast"
                          control={<Radio />}
                          label="Schedule Broadcast"
                        />
                      </Box>
                    </RadioGroup>
                  </FormControl>
                </Box>
                {state?.broadcast_frequency === 'scheduleBroadcast' && (
                  <Box width="100%" sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }} my={1}>
                    <DatePicker
                      // label="Basic example"
                      id="Schedule"
                      label="Schedule"
                      name="Schedule"
                      minDate={new Date()}
                      value={startDateValue}
                      onChange={(startDate) => {
                        setStartDateValue(startDate);
                      }}
                      renderInput={(params) => (
                        <TextField fullWidth {...params} />
                      )}
                    />
                    <TimePicker
                      style={{
                        width: '-webkit-fill-available'
                      }}
                      label="Schedule Time"
                      value={startTimeValue}
                      isToday={getIsToDay()}
                      startTime={moment()}
                      onChange={(newValue) => {
                        setStartTimeValue(newValue);
                      }}
                      minuteStep={5}
                    />
                    {/* <DateTimePicker
                      label="Schedule"
                      value={startDateValue}
                      inputFormat="dd/MM/yyyy hh:mm"
                      minDateTime={new Date()}
                      onChange={(startDate) => {
                        setStartDateValue(startDate);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    /> */}
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>Upload Broadcast</Typography>


                <UploadFileVertical
                  nameNonTitle={`projectimages${indexImages}`}
                  // setIndex={setIndexImages}
                  title=""
                                    handleChange={(e) => {
                    // GetURLForUpload(e, updateURlImages, indexImages);
                    uploadData(e, updateURlImages, indexImages)


                  }}
                  handleDelete={(url, inputName, index) => {
                    handleImageDelete(inputName, url, index, setIndexImages
                    );
                  }}
                  name={uploadBroadCast}
                  createBroadcast={1}
                />

              </Grid>
            </Grid>
            <Divider />
            <Box mt={5} mb={10}>
              {
                !editUser ?
                  <Button
                    variant="contained"
                    onClick={() => {
                      createBroadcastOnSubmit();
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress
                        size={22}
                        style={{
                          color: 'white'
                        }}
                      />
                    ) : (
                      'Create Broadcast'
                    )}
                  </Button>
                  :
                  <Button
                    variant="contained"
                    onClick={() => {
                      updateBroadcastOnSubmit(params.broadCastID);
                    }}
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
              }
              <Button
                sx={{ ml: 2 }}
                variant="outlined"
                onClick={() => {
                  navigate(`/broadcast`);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardWrapper>
      </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
};

export default AddBroadcast;
