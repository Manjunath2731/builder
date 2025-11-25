import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  useTheme,
  InputBase,
  styled,
  alpha,
  Card,
  Grid,
  // Avatar,
  Button,
  Modal,
  TextField,
  CircularProgress,
  CardMedia
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { format } from 'date-fns';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import OpenNotification from 'src/content/ShowNotification';

// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import { ProfileImageComponent } from 'src/content/pages/Auth/Register/EditBuilderGroup';

import { isAssociateAdmin, isSuperAdmin } from 'src/helpers/userHelpers';
import { createDeedWriter } from 'src/axiosInstances/Api';
import { deleteDeedWriter, editDeedWriter, getDeedWriter } from 'src/slices/center';
import DeleteConfirmation from 'src/content/delete-alert/DeleteAlert';
import { useDispatch, useSelector } from 'react-redux';
import { DropDownFilter } from '../../content/channel-partners/DropDownFilter';
import UploadFile from '../Upload/UploadFile';

// import { ProfileImageComponent } from '../Projects/AddProject/BasicInfoForm';

import { GetURLForUpload } from '../Projects/AddProject/Index';

// let darkYellowish = '#e4bd4a';
// let green = '#5cb256';
// let darkGreen = '#4a944e';

const SearchInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(15)};
    max-width:'80px'
    // width: 100%;
`
);
const CardWrapper = styled(Card)(
  ({ theme }) => `
    transition: ${theme.transitions.create(['box-shadow'])};
    position: relative;
    border-radius: 8px;
    z-index: 5;
    box-shadow: 
    0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
    0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
    0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
    0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
  `
);

const CardWrappers = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      border-radius: 0px;
      z-index: 5;
      width: 100%;
      height: 100%;
      border: 0.2px solid #cedbef;
      `
);
export const CardActions = styled(Box)(
  ({ theme }) => `
    position: absolute;
    left: ${theme.spacing(1)};
    bottom: ${theme.spacing(0)};
    right:${theme.spacing(1)};
    z-index: 7;
  `
);
export const Label = styled(Box)(
  ({ theme }) => `
    
    color: ${theme.palette.common.black};
    text-transform: uppercase;
    font-size: ${theme.typography.pxToRem(12)};
    font-weight: bold;
    line-height: 23px;
    
    padding: ${theme.spacing(0.3, 1.2)};
    margin :${theme.spacing(0, 2)};
    border-radius: 5px;
    width: -moz-fit-content;
    width: fit-content;
  `
);
const WriterCard = ({
  name,
  phoneNumber,
  id,
  email,
  city,
  category,
  profileImage,
  designation,
  experience,
  isVerified,
  createdAt,
  updatedAt
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState(profileImage);
  const [isDelete, setDelete] = useState(false);

  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      // if (!errorMessage) {
      //   navigate(`/team/${selectedTab}`);
      // }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const [state, setState] = useState({
    city,
    category,
    name,
    designation,
    experience,
    phoneNumber,
    email,
    isVerified,
    profileImage,
    createdAt,
    updatedAt
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const updateUrl = (result) => {
    setProfileUrl(result[0].url);
  };
  let avatarName = '';
  if (name && name.includes(' ')) {
    avatarName = name.split(' ');
    avatarName = avatarName.shift().charAt(0) + avatarName.pop().charAt(0);
    avatarName = avatarName.toUpperCase();
  }

  const copy = (type) => {
    const el = document.createElement('input');
    el.value = type === 'number' && phoneNumber;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // showNotification('Copied!', notificationType.SUCCESS);
    setOpenNoti(true);
    setSuccessMessage('Copied!');
  };

  const uploadOnSubmit = async () => {
    setLoading(true)
    const payload = {
      ...state,
      profileImage: profileUrl
    }

    try {
      const response = await editDeedWriter(id, payload);
      let sucessMessage = response.data.message;
      // showNotification(sucessMessage, notificationType.SUCCESS);
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
      setLoading(false);
      dispatch(getDeedWriter());
      handleClose();
    } catch (error) {
      // showNotification(error.message, notificationType.ERROR);
      setErrorMessage(error.message);
      setOpenNoti(true);
      setLoading(false);
    }
  }

  const handleInputChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
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
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  };


  const handleDelete = async (id) => {
    try {
      const response = await deleteDeedWriter(id);
      let sucessMessage = response.data.message;
      setDelete(false);
      // showNotification(sucessMessage, notificationType.SUCCESS);
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);

      dispatch(getDeedWriter());
    } catch (error) {
      // showNotification(error.message, notificationType.ERROR);
      setErrorMessage(error.message);
      setOpenNoti(true);
    }
  }

  const handleDeleteClose = () => {
    setDelete(false);
  };

  const uploadData = (e, updateUrl) => {

    // const { name, id } = e.target;
    let files = e.target.files || e.dataTransfer.files;
    // let nameType = name || id;
    // const userData = JSON.parse(window.localStorage.getItem('user'));

    // let fileBoolean = true;
    // let compressedData;
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
      updateUrl

    );
  }

  return (
    <CardWrappers id={id}
      sx={{ height: '100%' }}
    // sx={{ ml: 4, background: isVerified ? green : '', width: "auto" }}
    >
      <Box
        sx={{
          pl: { xs: 4, md: 2, xl: 3 },
          pt: 3,
          pb: 2,
          pr: { xs: 3, md: 2, xl: 2 },
          display: 'flex',
          flexDirection: 'row',
        }}

      >
        {profileImage ? (
          // <Avatar
          //   sx={{
          //     width: { xs: 145, md: 145, xl: 145 },
          //     height: { xs: 145, md: 145, xl: 145 },
          //     border: isVerified
          //       ? `12px solid ${darkGreen}`
          //       : '12px solid #f4f4f4'
          //   }}
          //   alt="Remy Sharp"
          //   src={profileImage}
          // />
          <CardMedia
            sx={{
              width: 94,
              height: 94,
              resizeMode: 'contain',
              objectFit: 'fill'
            }}
            alt="Company Logo"
            image={profileImage}

          />
        ) : (
          // <Avatar
          //   sx={{
          //     width: { xs: 145, md: 145, xl: 145 },
          //     height: { xs: 145, md: 145, xl: 145 },
          //     bgcolor: '#DBDBDB',
          //     fontSize: '33px'
          //   }}
          // >
          //   {avatarName}
          // </Avatar>
          <CardMedia
            sx={{
              width: 94,
              height: 94,
              resizeMode: 'contain',
              objectFit: 'fill'
            }}
            alt="Company Logo"
            image={avatarName}

          />
        )}
        {/* {isVerified && (
              <CardActions>
                <Label sx={{ background: darkYellowish }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 0.3
                    }}
                  >
                    <VerifiedUserIcon fontSize="small" />
                    VERIFIED
                  </Box>
                </Label>
              </CardActions>
            )} */}
        <Box
          sx={{ ml: 3, width: '100%', flexDirection: 'column' }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'flex-start'
            }}
          >
            <Box>
              <Typography variant="h5" color={isVerified ? 'white' : ''}>
                {name.length > 25 ? `${name.slice(0, 25)}...` : name}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", mt: 0.5 }}>
                <Typography
                  variant="subtitle1"
                  color={isVerified ? 'white' : '#838383'}
                >
                  {designation}
                </Typography>{' '}
                <Typography
                  variant="subtitle1"
                  sx={{ ml: 2 }}
                  color={isVerified ? 'white' : '#838383'}
                >
                  {`${experience} Years Exp`}
                </Typography>
              </Box>

            </Box>

            {
              (isAssociateAdmin() || isSuperAdmin()) && <Box
                sx={{ display: 'flex', mb: 1, justifyContent: 'flex-end', alignItems: 'center' }}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    height: 26,
                    width: 64,
                    borderRadius: 0.5,
                    marginRight: 1
                  }}
                  onClick={() => handleOpen(id)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    height: 26,
                    width: 64,
                    borderRadius: 0.5,
                    marginRight: 1,
                    backgroundColor: '#f34423',
                    '&:hover': { background: '#f34423' }
                  }}
                  onClick={() => setDelete(true)}
                >
                  <Typography variant="body2"
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    Delete
                  </Typography>
                </Button>
              </Box>
            }
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              style={{ zIndex: 10 }}
            >
              <Box sx={style}>
                <Typography
                  id="modal-modal-title"
                  variant="h4"
                  component="h1"
                  mt={2}
                >
                  Add Deed Writer
                </Typography>
                <Grid container columnSpacing={2} rowSpacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label='City'
                      name='city'
                      onChange={(event) => handleInputChange(event)}
                      value={state.city}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label='Category'
                      name='category'
                      onChange={(event) => handleInputChange(event)}
                      value={state.category}
                    />
                  </Grid>
                </Grid>
                <TextField
                  label='Name'
                  name='name'
                  onChange={(event) => handleInputChange(event)}
                  value={state.name}
                />
                <Grid container columnSpacing={2} rowSpacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label='Designation'
                      name='designation'
                      onChange={(event) => handleInputChange(event)}
                      value={state.designation}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label='experience'
                      name='experience'
                      onChange={(event) => handleInputChange(event)}
                      value={state.experience}
                    />
                  </Grid>
                </Grid>
                <TextField
                  label='Phone Number'
                  name='phoneNumber'
                  onChange={(event) => handleInputChange(event)}
                  value={state.phoneNumber}
                />
                <TextField
                  label='Email'
                  name='email'
                  onChange={(event) => handleInputChange(event)}
                  value={state.email}
                />
                <Box>
                  <Typography mb={1} mr={2} mt={1}>
                    Upload Image*
                  </Typography>
                  <Grid container>
                    <Grid
                      xs={6}
                      md={4}
                      style={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center'
                      }}
                    >
                      <UploadFile
                        title="Upload Image*"
                        handleChange={(e) => {
                          // GetURLForUpload(e, updateUrl);
                          uploadData(e, updateUrl)
                        }}
                        name={profileUrl}
                      />
                    </Grid>
                    <Grid xs={6} md={8}>
                      {profileUrl !== '' &&
                        profileUrl !== undefined &&
                        profileUrl !== null && (
                          <ProfileImageComponent
                            src={profileUrl}
                            alt="profile Image"
                            setProfileUrl={setProfileUrl}
                          />
                        )}
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  position="relative"
                  xs={{ bottom: '6px' }}
                  md={{ bottom: '0px' }}
                  xl={{ bottom: '0px' }}
                >
                  <Button
                    variant="contained"
                    onClick={() => uploadOnSubmit()}
                  >
                    {isLoading ? (
                      <CircularProgress
                        size={22}
                        style={{
                          color: 'white'
                        }}
                      />
                    ) : (
                      'Edit'
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
            </Modal>
          </Box>
          <hr
            style={{
              borderTop: 'dashed 2px',
              color: '#e6edf7',
              borderBottom: ' 0px'
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              // justifyContent:'space-between',
              mt: 2
            }}
          >

            <Typography> <b>Created on</b> : {format(new Date(createdAt), 'dd MMM yyyy')}</Typography>
            <Typography sx={{ ml: 2 }}> <b>Last modified</b> : {format(new Date(updatedAt), 'dd MMM yyyy')}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              // justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mt: 1
              }}
            >
              <img src="/static/images/logo/call-icon-green.svg" alt="call" style={{ width: "1.5em", height: "1.5em" }} />
              <Typography
                variant="subtitle1"
                sx={{ ml: 1 }}
                onClick={() => copy('Phone Number')}
                color={isVerified ? 'white' : '#838383'}
              >
                {phoneNumber || 'N/A'}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mt: 1,
                ml: 7.5,
              }}
            >
              <img src="/static/images/logo/email-icon-green.svg" alt="email" style={{ width: "1.5em", height: "1.5em" }} />
              <Typography
                variant="subtitle1"
                sx={{ ml: 1 }}
                onClick={() => copy('email')}
                color={isVerified ? 'white' : '#838383'}
              >
                {email || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* {(isAssociateAdmin() || isSuperAdmin()) && <hr
          style={{
            borderTop: 'solid 2px',
            color: '#e6edf7',
            borderBottom: ' 0px'
          }}
        />} */}

      {isDelete && (
        <DeleteConfirmation
          openConfirmDelete={isDelete}
          closeConfirmDelete={handleDeleteClose}
          handleDeleteCompleted={() => handleDelete(id)}
          selectedId={id}
          title="builder"
        />
      )}
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </CardWrappers>
  );
};


const DeedDocumentWriters = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const updateUrl = (result) => {
    setProfileUrl(result[0].url);
  };

  const [state, setState] = useState({
    city: "",
    category: "",
    name: "",
    designation: "",
    experience: "",
    phoneNumber: "",
    email: "",
    isVerified: "",
    profileImage: "",
    createdAt: "",
    updatedAt: ""
  });
  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      // if (!errorMessage) {
      //   navigate(`/team/${selectedTab}`);
      // }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const uploadOnSubmit = async () => {
    setLoading(true)
    const payload = {
      ...state,
      profileImage: profileUrl
    }

    try {
      const response = await createDeedWriter(payload);
      setState({
        city: "",
        category: "",
        name: "",
        designation: "",
        experience: "",
        phoneNumber: "",
        email: "",
        isVerified: "",
        profileImage: "",
        createdAt: "",
        updatedAt: ""
      });
      setProfileUrl()
      let sucessMessage = response.data.message;
      // showNotification(sucessMessage, notificationType.SUCCESS);
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
      setLoading(false);
      dispatch(getDeedWriter());
      handleClose();
    } catch (error) {
      // showNotification(error.message, notificationType.ERROR);
      setErrorMessage(error.message);
      setOpenNoti(true);
      setLoading(false);
    }
  }

  const handleInputChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
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
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  };

  let ListWriters = useSelector((state) => state.center?.deedwriter);

  useEffect(() => {
    dispatch(getDeedWriter());
  }, []);

  const uploadData = (e, updateUrl) => {

    // const { name, id } = e.target;
    let files = e.target.files || e.dataTransfer.files;
    // let nameType = name || id;
    // const userData = JSON.parse(window.localStorage.getItem('user'));

    // let fileBoolean = true;
    // let compressedData;
    if (files) {
      if (files[0]?.type === 'application/pdf') {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          // alert("pdf error")
          const errorMessage = 'Document file should not exceeds 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (
        files[0]?.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Document file should not exceeds 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (files[0]?.type.startsWith('image/')) {
        if (files[0].size > 1024 * 1024 * 2) {
          // fileBoolean = false;
          // alert("IMage error")
          const errorMessage = 'Image size should not exceeds 2MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (files[0]?.type === 'application/vnd.ms-powerpoint' ||
        files[0]?.type === 'application/vnd.ms-powerpoint' ||
        files[0]?.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Document file should not exceeds 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (
        files[0]?.type === 'application/msword' ||
        files[0]?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Document file should not exceeds 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (files[0].type.startsWith('video/')) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Video file should not exceeds 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      }
    }

    GetURLForUpload(
      e,
      updateUrl

    );
  }
  return (
    <React.Fragment>
      <Box
        // display="flex"
        // alignItems={{ xs: 'stretch', md: 'center' }}
        // flexDirection={{ xs: 'row', md: 'row' }}
        sx={{ py: 4, pl: { xs: 4, lg: 0 }, pr: { xs: 4, md: 7 } }}
      >
        <Box display="flex" alignItems="center">
          <Box>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(15)}`,
                mt: 2,
                mb: 3,
                ml: 4
              }}
              variant="h4"
            >
              DEED/DOCUMENT WRITERS
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              columnGap: 2,
              ml: 4
            }}
          >
            <DropDownFilter
              name="City"
              // value={FilterValue.Projects}
              // onchange={handleFilter}
              // menuItems={projectNameList}
              initialValue="All"
            />
            <DropDownFilter
              name="Category"
              disabled
              // value={FilterValue.City}
              // onchange={handleFilter}
              // menuItems={cityList}
              initialValue="Any"
            />

            <Box
              // flexGrow={1}
              display="flex"
              alignItems="center"
              sx={{ border: "1px solid lightgray", borderRadius: '10px', pl: 1, backgroundColor: "white" }}
            >
              <SearchTwoToneIcon
                // fontSize='large'
                sx={{
                  mr: 1.3,
                  color: theme.colors.secondary.main,
                  fontSize: '30px'
                }}
              />
              <SearchInputWrapper
                // value={searchValue}
                // onChange={handleSearchChange}
                autoFocus
                placeholder="Search"
                fullWidth
              />
            </Box>
          </Box>
          <Box>
            {
              (isAssociateAdmin() || isSuperAdmin()) && <Button
                variant="contained"
                startIcon={<AddCircleIcon fontSize="medium" />}
                sx={{ mb: 1 }}
                style={{
                  width: '12rem',
                  height: '40px',
                  fontSize: '12px',
                  // fontFamily: 'Helvetica Neue medium lite'
                }}
                onClick={handleOpen}
              >
                Add Deed Writers
              </Button>
            }
          </Box>
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
                Add Deed Writer
              </Typography>
              <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={6} >
                  <TextField
                    fullWidth
                    label='City'
                    name='city'
                    onChange={(event) => handleInputChange(event)}
                    value={state.city}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Category'
                    name='category'
                    onChange={(event) => handleInputChange(event)}
                    value={state.category}
                  />
                </Grid>
              </Grid>
              <TextField
                label='Name'
                name='name'
                onChange={(event) => handleInputChange(event)}
                value={state.name}
              />
              <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Designation'
                    name='designation'
                    onChange={(event) => handleInputChange(event)}
                    value={state.designation}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='experience'
                    name='experience'
                    onChange={(event) => handleInputChange(event)}
                    value={state.experience}
                  />
                </Grid>
              </Grid>
              <TextField
                label='Phone Number'
                name='phoneNumber'
                onChange={(event) => handleInputChange(event)}
                value={state.phoneNumber}
              />
              <TextField
                label='Email'
                name='email'
                onChange={(event) => handleInputChange(event)}
                value={state.email}
              />
              <Box>
                <Typography mb={1} mr={2} mt={1}>
                  Upload Image*
                </Typography>
                <Grid container>
                  <Grid
                    xs={6}
                    md={4}
                    style={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'center'
                    }}
                  >
                    <UploadFile
                      title="Upload Image*"
                      handleChange={(e) => {
                        // GetURLForUpload(e, updateUrl);
                        uploadData(e, updateUrl)
                      }}
                      name={profileUrl}
                    />
                  </Grid>
                  <Grid xs={6} md={8}>
                    {profileUrl !== '' &&
                      profileUrl !== undefined &&
                      profileUrl !== null && (
                        <ProfileImageComponent
                          src={profileUrl}
                          alt="profile Image"
                          setProfileUrl={setProfileUrl}
                        />
                      )}
                  </Grid>
                </Grid>
              </Box>
              <Box
                position="relative"
                xs={{ bottom: '6px' }}
                md={{ bottom: '0px' }}
                xl={{ bottom: '0px' }}
              >
                <Button
                  variant="contained"
                  onClick={() => uploadOnSubmit()}
                >
                  {isLoading ? (
                    <CircularProgress
                      size={22}
                      style={{
                        color: 'white'
                      }}
                    />
                  ) : (
                    'Add'
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
          </Modal>
        </Box>
        {/* <Box sx={{ mt: 5 }}> */}
        {/*         
          <Grid container spacing={2}>
            {ListWriters.map((item) => {
              return (
                <Grid item xs={12} md={5} lg={5.5} xl={5}>
                  <WriterCard
                    name={item?.name}
                    phoneNumber={item?.phoneNumber}
                    id={item?._id}
                    email={item.email}
                    profileImage={item?.profileImage}
                    designation={item?.designation}
                    experience={item?.experience}
                    isVerified={item?.isVerified}
                    city={item.city}
                    category={item.category}
                  />
                </Grid>
              );
            })}
          </Grid> */}
        <CardWrapper sx={{ minWidth: 275, minHeight: "fit-content", mt: 3, ml: 4 }} >
          {ListWriters.length ? (
            <Grid container sx={{ gridAutoRows: '1fr' }}>
              {ListWriters.map((item) => {
                return (
                  <Grid
                    item
                    key={item?.id}
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xxl={4}
                  >
                    <WriterCard
                      name={item?.name}
                      phoneNumber={item?.phoneNumber}
                      id={item?._id}
                      email={item.email}
                      profileImage={item?.profileImage}
                      designation={item?.designation}
                      experience={item?.experience}
                      isVerified={item?.isVerified}
                      city={item.city}
                      category={item.category}
                      createdAt={item?.createdAt}
                      updatedAt={item?.updatedAt}
                    />
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              textAlign="center "
              sx={{
                padding: '35px',
                margin: 'auto'
              }}
            >
              <Typography
                variant="h3"
                pt={10}
                sx={{ color: theme.palette.grey[500] }}
                textAlign="center"
              >
                {' '}
                No Builder To Show{' '}
              </Typography>
            </Box>)}

        </CardWrapper>
        {/* </Box> */}
      </Box >
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </React.Fragment >
  );
};
export default DeedDocumentWriters;
