import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
  Grid
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import OpenNotification from '../ShowNotification';

// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';


import { EditAssociate } from '../../axiosInstances/Api';
import {
  GetURLForUpload
} from '../../components/Projects/AddProject/Index';
import { ProfileImageComponent } from '../pages/Auth/Register/EditBuilderGroup';
import UploadFile from '../../components/Upload/UploadFile';

function EditRegisterAssociate({ associate }) {
  const navigate = useNavigate();
  const [profileUrl, setProfileUrl] = useState(associate?.profile_image);
  const [submitting, setFormSubmitting] = useState(false);
  const [associateRoleId, setAssociateRoleId] = useState('');
  const [profileError, setProfileError] = useState(false);
  const { t } = useTranslation();
  const updateUrl = (result) => {
    if (result[0].url) {
      setProfileError(false);
    }
    setProfileUrl(result[0].url);
  };
  let roles = [];
  let groups = [];
  let cities = [];
  roles = useSelector((state) => state.role.data);
  groups = useSelector((state) => state.group.data);
  cities = useSelector((state) => state.cities.data);
  
  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  
  
  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        setFormSubmitting(false);
        navigate('/builder-dashboard/associate');
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };
    

  useEffect(() => {
    if (roles?.length > 0) {
      let id = roles
        ?.filter((item) => item.name === 'ASSOCIATE_ADMIN')
        .map((item) => item._id);
      setAssociateRoleId(id[0]);
    }
  }, [roles, groups, cities]);

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
      <Formik
        initialValues={{
          firstName: associate?.first_name,
          lastName: associate?.last_name,
          email: associate?.email,
          phoneNumber: associate?.phoneNumber,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string()
            .max(255)
            .required(t('First name is required')),
          lastName: Yup.string()
            .max(255)
            .required(t('Last name is required')),
          email: Yup.string()
            .email(t('Invalid email address'))
            .max(255)
            .required(t('Email address is required')),
          // phoneNumber: Yup.string()
          //   .max(255)
          //   .required(t('The Phone number field is required'))
          phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required(
            t('Phone number is required')
          ),
        })}
        onSubmit={async (values, { resetForm }) =>
          {
            if (profileError) {
              return;
            }
            setFormSubmitting(true);
            await EditAssociate(
              values,
              associateRoleId,
              profileUrl,
              associate?._id
            )
              .then((response) => {
                if (response?.status === 200 || response?.status === 201) { 
                  let sucessMessage = 'Sucessfully Edited Associate';
                  // showNotification(sucessMessage, notificationType.SUCCESS);
                  setOpenNoti(true); 
      setSuccessMessage(sucessMessage);
                  resetForm();
                } else {
                  let errorMessage = response?.response?.data?.message;
                  // showNotification(errorMessage, notificationType.ERROR);
                  setErrorMessage(errorMessage);
                  setOpenNoti(true);
                  setFormSubmitting(false);
                }
              })
              .catch((error) => {
                let errorMessage =
                  error?.response?.data?.message || 'Something went wrong';
                // showNotification(errorMessage, notificationType.ERROR);
                setErrorMessage(errorMessage);
                setOpenNoti(true);
                setFormSubmitting(false);
              });
          }
        }
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
                columnGap: 4
              }}
            >
              <TextField
                error={Boolean(touched.firstName && errors.firstName)}
                margin="normal"
                helperText={touched.firstName && errors.firstName}
                label={t('First Name')}
                name="firstName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                variant="outlined"
              />

              <TextField
                error={Boolean(touched.lastName && errors.lastName)}
                margin="normal"
                helperText={touched.lastName && errors.lastName}
                label={t('Last Name')}
                name="lastName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                variant="outlined"
              />
            </Box>
            <TextField
              error={Boolean(touched.email && errors.email)}
              fullWidth
              margin="normal"
              helperText={touched.email && errors.email}
              label={t('Email address')}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.phoneNumber && errors.phoneNumber)}
              fullWidth
              margin="normal"
              helperText={touched.phoneNumber && errors.phoneNumber}
              label={t('Phone Number')}
              name="phoneNumber"
              onBlur={handleBlur}
              onChange={handleChange}
              type="tel"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={values.phoneNumber}
              variant="outlined"
            />
            <Box
            >
              <Typography mb={1} mr={2} mt={2}>
                Upload profile picture
                </Typography>
                <Grid container>
                  <Grid xs={6} md={4} style={{display:'flex', justifyContent:'start', alignItems:'center'}}>
                    <UploadFile
                      title="Upload profile picture"
                      handleChange={(e) => {
                        // GetURLForUpload(e, updateUrl);
                        uploadData(e,updateUrl)   
                      }}
                      name={profileUrl}
                    />
                  </Grid>
                  <Grid  xs={6} md={8}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
              <Button
                sx={{
                  mt: 3
                }}
                color="primary"
                disabled={isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
              >
                {submitting ? (
                  <CircularProgress size={25} color="inherit" thickness={3.6} />
                ) : (
                  t('Save')
                )}
              </Button>
              <Button
                sx={{
                  mt: 3
                }}
                fullWidth
                variant="outlined"
                onClick={() => {
                  navigate('/builder-dashboard/associate');
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
}

export default EditRegisterAssociate;
