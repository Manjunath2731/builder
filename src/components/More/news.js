import React, { useEffect, useState } from 'react';
import {
  Box,
  styled,
  alpha,
  Grid,
  useTheme,
  CardContent,
  Card, CardMedia, Button, TextField, CircularProgress, Modal
} from '@mui/material';
import Typography from '@mui/material/Typography';
// import DeleteIcon from '@mui/icons-material/Delete';
import InputBase from '@mui/material/InputBase';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import { ProfileImageComponent } from 'src/content/pages/Auth/Register/EditBuilderGroup';

import { createNews } from 'src/axiosInstances/Api';
import { useDispatch, useSelector } from 'react-redux';
import { deleteNews, editNews, getNews } from 'src/slices/center';
import OpenNotification from 'src/content/ShowNotification';

import { isSuperAdmin, isAssociateAdmin } from 'src/helpers/userHelpers';
import DeleteConfirmation from 'src/content/delete-alert/DeleteAlert';
import { DropDownFilter } from '../../content/channel-partners/DropDownFilter';
import { GetURLForUpload } from '../Projects/AddProject/Index';
import UploadFile from '../Upload/UploadFile';


const SearchInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(15)};
    max-width:'80px'
    // width: 100%;
`);
const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      z-index: 5;
      &:hover {
        z-index: 6;
        box-shadow: 
        0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
        0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
        0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
        0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
        cursor:pointer;
    }
     `
);

const NewsCard = ({ id, city, heading, title, discription, img }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState(img);
  const [isDelete, setDelete] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      // if (!errorMessage) {

      // }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const updateUrl = (result) => {
    setProfileUrl(result[0].url);
  };

  const [state, setState] = useState({
    city,
    heading,
    title,
    description: discription,
  });

  const uploadOnSubmit = async (id) => {
    setLoading(true)
    const payload = {
      ...state,
      img: profileUrl
    }

    try {
      const response = await editNews(id, payload);
      let sucessMessage = response.data.message;
      // showNotification(sucessMessage, notificationType.SUCCESS);
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
      setLoading(false);
      dispatch(getNews());
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
      const response = await deleteNews(id);
      let sucessMessage = response.data.message;
      setDelete(false);
      // showNotification(sucessMessage, notificationType.SUCCESS);
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
      dispatch(getNews());
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
    <>
      <CardWrapper sx={{ ml: 4, display: "flex", height: 240 }} id="22">
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <CardContent sx={{ flex: "1 0 auto", width: "80%" }}>
            <Typography component="div" variant="h5" sx={{ fontSize: 17 }}>
              {heading}
            </Typography>
            <Typography variant="h4" sx={{ mt: 2 }} gutterBottom>
              {title}
            </Typography>
            <Typography
              sx={{
                mt: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
              }}
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {discription}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", mt: 3 }}>
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ cursor: 'pointer', fontSize: 13, mt: 2 }}
                onClick={() => (window.open('https://www.google.com/', '_blank', 'noreferrer'))}>
                Read Full Article
              </Typography>

              <Box sx={{ display: 'flex', mt: 1 }}>
                {(isAssociateAdmin() || isSuperAdmin()) && (
                  <Box>
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
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        Delete
                      </Typography>
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
          <Box sx={{ p: 2.5 }}>
            <CardMedia
              component="img"
              height="200px"
              width="240px"
              image={img}
              alt="Live from space album cover"
            />
          </Box>
        </Box>


        {isDelete && (
          <DeleteConfirmation
            openConfirmDelete={isDelete}
            closeConfirmDelete={handleDeleteClose}
            handleDeleteCompleted={() => handleDelete(id)}
            selectedId={id}
            title="builder"
          />
        )}
      </CardWrapper>

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
            Edit News
          </Typography>
          <TextField
            label='City'
            name='city'
            onChange={(event) => handleInputChange(event)}
            value={state.city}
          />
          <TextField
            label='Heading'
            name='heading'
            onChange={(event) => handleInputChange(event)}
            value={state.heading}
          />
          <TextField
            label='Title'
            name='title'
            onChange={(event) => handleInputChange(event)}
            value={state.title}
          />
          <TextField
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            onChange={(event) => handleInputChange(event)}
            value={state.description}
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
              onClick={() => uploadOnSubmit(id)}
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
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  )
}

const news = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      // if (!errorMessage) {
      //   dispatch(getNews());
      //   handleClose();
      // }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const updateUrl = (result) => {
    console.log(result[0].url)
    setProfileUrl(result[0].url);
  };

  const [state, setState] = useState({
    city: '',
    heading: '',
    title: '',
    description: ''
  });

  const uploadOnSubmit = async () => {
    setLoading(true)
    const payload = {
      ...state,
      img: profileUrl
    }

    try {
      const response = await createNews(payload);
      let sucessMessage = response.data.message;
      // showNotification(sucessMessage, notificationType.SUCCESS);
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
      setLoading(false);
      dispatch(getNews());
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
  let NewsList = useSelector((state) => state.center?.news);

  useEffect(() => {
    dispatch(getNews());
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
      } else if (files[0]?.type.startsWith('video/')) {
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
    <>
      <Box sx={{ py: 4, pl: { xs: 4, lg: 0 }, pr: { xs: 4, md: 7 } }}>

        <Box display="flex" alignItems="center">
          <Box>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(15)}`,
                mt: 2,
                mb: 3,
                ml: 4,
              }}
              variant="h4">
              NEWS
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            mb: 3,
            columnGap: 2, ml: 4
          }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              mb: 3,
              columnGap: 2
            }}
          >
            <DropDownFilter
              name="City"
              initialValue="none"
              disabled />
            <Box
              display="flex"
              alignItems="center"
              sx={{ border: "1px solid lightgray", borderRadius: '10px', pl: 1, backgroundColor: "white" }}>
              <SearchTwoToneIcon
                sx={{
                  mr: 1.3,
                  color: theme.colors.secondary.main,
                  fontSize: '30px'
                }} />
              <SearchInputWrapper
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
                  width: '8rem',
                  height: '40px',
                  fontSize: '12px',
                  // fontFamily: 'Helvetica Neue medium lite'
                }}
                onClick={handleOpen}
              >
                Add News
              </Button>
            }
          </Box>
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
              Add News
            </Typography>
            <TextField
              label='City'
              name='city'
              onChange={(event) => handleInputChange(event)}
              value={state.city}
            />
            <TextField
              label='Heading'
              name='heading'
              onChange={(event) => handleInputChange(event)}
              value={state.heading}
            />
            <TextField
              label='Title'
              name='title'
              onChange={(event) => handleInputChange(event)}
              value={state.title}
            />
            <TextField
              id="description"
              name="description"
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              onChange={(event) => handleInputChange(event)}
              value={state.description}
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
        <Box sx={{ mt: 5 }} >
          <Grid container spacing={2} >
            {
              NewsList?.map((item) => {
                return (
                  <Grid item xs={12} md={10}>
                    <NewsCard
                      city={item.city}
                      id={item._id}
                      heading={item.heading}
                      title={item.title}
                      discription={item.description}
                      img={item.img}
                    />
                  </Grid>
                );
              })
            }
          </Grid>
        </Box>
      </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
};

export default news;
