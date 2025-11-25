import * as Yup from 'yup';
import { Formik } from 'formik';
import FormControl from '@mui/material/FormControl';
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Grid,
  styled,
  Container,
  Card,
  IconButton
} from '@mui/material';
import OpenNotification from 'src/content/ShowNotification';

import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { State, City } from 'country-state-city';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import RegisterUser from '../Register/RegisterJWT';
import { GetURLForUpload } from '../../../../components/Projects/AddProject/Index';
import { ProfileImageComponent } from './EditBuilderGroup';
import UploadFile from '../../../../components/Upload/UploadFile';
import { addRoles } from '../../../../slices/roles';
import { addGroups } from '../../../../slices/groups';

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

const countryId = 'IN';
function RegisterBuilder() {
  const [profileUrl, setProfileUrl] = useState('');
  const [submitting, setFormSubmitting] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [payloadData, setPayLoadData] = useState({});
  const [profileError, setProfileError] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [profileData, setProfileData] = useState({});
  const { t } = useTranslation();
  const updateUrl = (result) => {
    if (result[0].url) {
      setProfileError(false);
    }
    setProfileUrl(result[0].url);
  };
  let roles = [];
  let groups = [];

  roles = useSelector((state) => state.role.data);
  groups = useSelector((state) => state.group.data);
  useEffect(() => {}, [roles, groups, cities]);

  useEffect(() => {
    setStates(
      State.getStatesOfCountry(countryId).map((state) => ({
        label: state.name,
        value: state.isoCode,
        ...state
      }))
    );
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    dispatch(addRoles());
    dispatch(addGroups());
  }, []);

  const handleClose = () => {
    if(showAdminForm){
      setShowAdminForm(false);
      handleAdmin();
      return;
    }
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
      <Helmet>
        <title>Create Builder</title>
      </Helmet>
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
                    {t(
                      !isAdmin ? 'Create builder' : 'Add user for this builder'
                    )}
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
                      ? 'Fill in the fields below to create builder account.'
                      : 'Fill in the fields below to create user account.'
                  )}
                </Typography>
              </Box>

              {!showAdminForm ? (
                <Formik
                  initialValues={{
                    name: '',
                    description: '',
                    shortName: '',
                    address: '',
                    state: null,
                    city: null,
                    submit: null,
                    ...profileData,
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .max(255)
                      .required(t('Company name is required')),
                    shortName: Yup.string()
                      .max(255)
                      .required(t('Name is required')),
                    state: Yup.string()
                      .max(255)
                      .required(t('State is required')),
                    city: Yup.string()
                      .max(255)
                      .required(t('City is required')),
                    address: Yup.string()
                      .max(255)
                      .required(t('Address is required'))
                  })}
                  onSubmit={async (values, { resetForm }) => {
                    if (profileError) {
                      return;
                    }
                    setFormSubmitting(false);
                    setShowAdminForm(true);
                    handleAdmin();
                    const payload = {
                      name: values.name,
                      city: values.city,
                      state: values.state,
                      address: values.address,
                      shortName: values.shortName,
                      logo: profileUrl
                    };
                    setPayLoadData(payload);
                    setProfileData(payload);
                    resetForm();
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
                          gap: 9,
                          marginTop: 1
                        }}
                      >
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            margin="normal"
                            helperText={touched.name && errors.name}
                            label={t('Company name*')}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            variant="outlined"
                          />
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            error={Boolean(
                              touched.shortName && errors.shortName
                            )}
                            margin="normal"
                            helperText={touched.shortName && errors.shortName}
                            label={t('Display name*')}
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
                          marginTop: 1
                        }}
                      >
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="demo-simple-select-label">
                            State
                          </InputLabel>
                          <Select
                            error={Boolean(touched.state && errors.state)}
                            helperText={touched.state && errors.state}
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
                            error={Boolean(touched.city && errors.city)}
                            helperText={touched.city && errors.city}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={values.city}
                            label="Age"
                            name="city"
                            onChange={handleChange}
                          >
                            {cities.length
                              ? cities.map((city) => (
                                  <MenuItem value={city.value}>
                                    {city.label}
                                  </MenuItem>
                                ))
                              : null}
                          </Select>
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
                          This is required field
                        </FormHelperText>
                      )}
                      <Button
                        sx={{
                          mt: 3
                        }}
                        color="primary"
                        disabled={isSubmitting}
                        onClick={() => {
                          if (!profileUrl) {
                            setProfileError(true);
                          }
                        }}
                        type="submit"
                        fullWidth
                        size="large"
                        variant="contained"
                      >
                        {submitting ? (
                          <CircularProgress
                            size={25}
                            color="inherit"
                            thickness={3.6}
                          />
                        ) : (
                          t('Next')
                        )}
                      </Button>
                    </form>
                  )}
                </Formik>
              ) : (
                <RegisterUser
                  setShowAdminForm={setShowAdminForm}
                  payloadData={payloadData}
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

export default RegisterBuilder;
