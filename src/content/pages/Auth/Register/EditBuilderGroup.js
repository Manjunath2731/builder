import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Button,
  CardMedia,
  TextField,
  Box,
  FormHelperText,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  IconButton,
  Card,
  Container,
  styled,
} from '@mui/material';
import { State, City } from 'country-state-city';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import OpenNotification from 'src/content/ShowNotification';

import FormControl from '@mui/material/FormControl';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close'
import { EditBuilderGroup } from '../../../../axiosInstances/Api';
import EditRegisterUser from '../Register/EditRegisterJWT';
import { resetGroupAndUser } from '../../../../slices/groups';
import {
  GetURLForUpload,
  handleRemoveFromS3
} from '../../../../components/Projects/AddProject/Index';
import DeleteConfirmation from '../../../../content/delete-alert/DeleteAlert';
import UploadFile from '../../../../components/Upload/UploadFile';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  () => `
  display: flex;
  width: 100%;
  flex: 1;
  padding: 20px;
`
);

export const ProfileImageComponent = ({ src, alt, setProfileUrl }) => {
  const [isDelete, setDelete] = useState(false);
  const [url, setUrl] = useState('');
  const handleRemove = (url) => {
    setDelete(true);
    setUrl(url);
  };

  const handleDeleteCompleted = () => {
    setDelete(false);
    handleRemoveFromS3(url).then((response) => {
      if (response) {
        setProfileUrl('');
      }
    });
  };

  const handleClose = () => {
    setDelete(false);
  };

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
      <Box sx={{ position: 'relative', width: '150px', }}>
        <CardMedia
          component="img"
          sx={{
            display: 'block',
            height: 'auto',
            maxHeight: '150px',
            width: '150px',
            maxWidth: '150px',
            border: '1px solid #E3EAF5',
            borderRadius: 'inherit',
            zIndex: 5,
            // ml: 2
          }}
          image={src}
          alt={alt !== '' ? alt : '...'}
        />

        <button
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
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
            handleRemove(src);
          }}
        >
          &times;
        </button>
      </Box>
    </>
  );
};
const countryId = 'IN';
function EditRegisterBuilder({ group }) {
  let builderId = group?._id;
  const dispatch = useDispatch();
  const [payloadData, setPayLoadData] = useState({});
  const [profileUrl, setProfileUrl] = useState(group?.logo);
  const [submitting, setFormSubmitting] = useState(false);
  const [formContinued, setFormContinued] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const updateUrl = (result) => {
    if (result[0].url) {
      setProfileError(false);
    }
    setProfileUrl(result[0].url);
  };
  let user = {};
  user = useSelector((state) => state.group.userDataByGroupId);
  useEffect(() => {}, [group]);

  useEffect(() => {
    setStates(
      State.getStatesOfCountry(countryId).map((state) => ({
        label: state.name,
        value: state.isoCode,
        ...state
      }))
    );
    setCities(
      City.getCitiesOfState(countryId, group?.state).map((city) => ({
        label: city.name,
        value: city.name,
        ...city
      }))
    );
  }, []);
  const handleClose = () => {
    if(showAdminForm){
      setShowAdminForm(false);
      handleAdmin();
      return;
    }
    dispatch(resetGroupAndUser());
    navigate('/builder-dashboard/builder');
  };
  const handleAdmin = () => {
    setAdmin(!isAdmin);
  };

  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  
  
  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        navigate('/builder-dashboard/builder');
        dispatch(resetGroupAndUser());

      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
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
    <>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
            <Card
              sx={{
                mt: 3,
                px: 4,
                pt: 5,
                pb: 3
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      mb: 1
                    }}
                  >
                    {t(!isAdmin ? 'Edit builder' : 'Edit User Info')}
                  </Typography>
                  <IconButton onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t(
                    !isAdmin
                      ? 'Fill in the fields below to edit builder account.'
                      : 'Fill in the fields below to edit user account.'
                  )}
                </Typography>
              </Box>
              {!showAdminForm ? (
                <Formik
                  initialValues={{
                    name: group?.name,
                    shortName: group?.short_name,
                    address: group?.address,
                    city: group?.city,
                    state: group?.state,
                    submit: null,
                    ...payloadData
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .max(255)
                      .required(t('Company name is required')),
                    shortName: Yup.string()
                      .max(255)
                      .required(t('Name is required')),
                    city: Yup.string()
                      .max(255)
                      .required(t('City is required')),
                    address: Yup.string()
                      .max(255)
                      .required(t('Address is required'))
                  })}
                  onSubmit={async (values, { resetForm }) => {
                    if (profileError || city) {
                      return;
                    }

                    const payload = {
                      name: values.name,
                      city: values.city,
                      state: values.state,
                      address: values.address,
                      shortName: values.shortName,
                      logo: profileUrl
                    };
                    setPayLoadData(payload);
                    if (!formContinued) {
                      setFormSubmitting(true);
                      await EditBuilderGroup(group?._id, payload).then(
                        (response) => {
                          if (
                            response?.status === 200 ||
                            response?.status === 201
                          ) {
                            let sucessMessage = 'Sucessfully Edited Builder';
                            // showNotification(
                            //   sucessMessage,
                            //   notificationType.SUCCESS
                            // );
                            setFormSubmitting(false);
                            setOpenNoti(true); 
                            setSuccessMessage(sucessMessage);
                       
                            resetForm();
                          } else {
                            let errorMessage =
                              response?.response?.data?.message ||
                              'Something went wrong';
                            // showNotification(
                            //   errorMessage,
                            //   notificationType.ERROR
                            // );
                            setErrorMessage(errorMessage);
                            setOpenNoti(true);
                            setFormSubmitting(false);
                            setFormContinued(false);
                            setShowAdminForm(false);
                            dispatch(resetGroupAndUser());
                          }
                        }
                      );
                    } else if (formContinued) {
                      resetForm();
                      setShowAdminForm(true);
                      handleAdmin();
                    }
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values
                  }) => (
                    <form noValidate onSubmit={handleSubmit}>
                      <Box
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 9
                        }}
                      >
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            margin="normal"
                            helperText={touched.name && errors.name}
                            label={t('Builder Name*')}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            variant="outlined"
                            disabled
                          />
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            error={Boolean(
                              touched.shortName && errors.shortName
                            )}
                            margin="normal"
                            helperText={touched.shortName && errors.shortName}
                            label={t('Short Name*')}
                            name="shortName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.shortName}
                            variant="outlined"
                          />
                        </FormControl>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 1,
                          marginTop: 2
                        }}
                      >
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="demo-simple-select-label">
                            State
                          </InputLabel>
                          <Select
                            error={Boolean(touched.state && errors.state)}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={values.state}
                            label="State"
                            name="state"
                            onChange={(e) => {
                              handleChange(e);
                              setCities(
                                City.getCitiesOfState(
                                  countryId,
                                  e.target.value
                                ).map((city) => ({
                                  label: city.name,
                                  value: city.name,
                                  ...city
                                }))
                              );
                              setCity(true);
                            }}
                          >
                            {states.length
                              ? states.map((state) => (
                                  <MenuItem value={state.value}>
                                    {state.label}
                                  </MenuItem>
                                ))
                              : null}
                          </Select>
                        </FormControl>

                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="demo-simple-select-label">
                            City
                          </InputLabel>
                          <Select
                            error={Boolean(touched.city && (errors.city || city))}
                            helperText={touched.city && (errors.city || city)}                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={values.city}
                            label="Age"
                            name="city"
                            onChange={(e)=>{
                              handleChange(e);
                              setCity(false);
                            }}
                          >
                            {cities.length
                              ? cities.map((city) => (
                                  <MenuItem value={city.value}>
                                    {city.label}
                                  </MenuItem>
                                ))
                              : null}
                          </Select>
                          {city && (
                            <FormHelperText error="true">
                              City is required
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                      <TextField
                        error={Boolean(touched.address && errors.address)}
                        fullWidth
                        margin="normal"
                        helperText={touched.address && errors.address}
                        label={t('Registered Address*')}
                        name="address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.address}
                        variant="outlined"
                      />

                      <Box>
                        <Typography mb={1} mr={2} mt={1}>
                          Upload company logo*
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
                              title="Upload company logo*"
                              handleChange={(e) => {
                                // GetURLForUpload(e, updateUrl);
                                uploadData(e,updateUrl)
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
                      {profileError && (
                        <FormHelperText error="true">
                          This field is required
                        </FormHelperText>
                      )}
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        {group?.id !== '' && group?.id !== undefined && (
                          <>
                            <Button
                              sx={{
                                mt: 3,
                                mr: 3
                              }}
                              color="primary"
                              disabled={isSubmitting}
                              onClick={() => {
                                if (!profileUrl || profileUrl.length === 0) {
                                  setProfileError(true);
                                  return;
                                }
                                setFormContinued(false);
                              }}
                              type="submit"
                              fullWidth
                              size="large"
                              variant="contained"
                            >
                              {submitting && !formContinued ? (
                                <CircularProgress
                                  size={25}
                                  color="inherit"
                                  thickness={3.6}
                                />
                              ) : (
                                t('Save & Exit')
                              )}
                            </Button>
                          </>
                        )}
                        <Button
                          sx={{
                            mt: 3
                          }}
                          color="primary"
                          disabled={isSubmitting}
                          onClick={() => {
                            if (!profileUrl || profileUrl.length === 0) {
                              setProfileError(true);
                              return;
                            }
                            setFormContinued(true);
                          }}
                          type="submit"
                          fullWidth
                          size="large"
                          variant="contained"
                        >
                          {submitting && formContinued ? (
                            <CircularProgress
                              size={25}
                              color="inherit"
                              thickness={3.6}
                            />
                          ) : (
                            t('Next')
                          )}
                        </Button>
                      </Box>
                    </form>
                  )}
                </Formik>
              ) : (
                <EditRegisterUser
                  setShowAdminForm={setShowAdminForm}
                  builderId={builderId}
                  payloadData={payloadData}
                  user={user}
                />
              )}
            </Card>
          </Container>
        </TopWrapper>
      </MainContent>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
}

export default EditRegisterBuilder;
