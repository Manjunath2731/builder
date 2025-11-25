import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import OpenNotification from 'src/content/ShowNotification';

// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  createBuilderandUser
} from '../../../../axiosInstances/Api';
import {
  GetURLForUpload
} from '../../../../components/Projects/AddProject/Index';
import { ProfileImageComponent } from './EditBuilderGroup';
import UploadFile from '../../../../components/Upload/UploadFile';

function RegisterUser({ payloadData }) {
  const navigate = useNavigate();
  const updateUrl = (result) => {
    if (result[0].url) {
      setProfileError(false);
    }
    setProfileUrl(result[0].url);
  };
  const [profileUrl, setProfileUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [submitting, setFormSubmitting] = useState(false);

  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        navigate('/builder-dashboard/builder');
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const { t } = useTranslation();
  let roles = [];
  let groups = [];
  roles = useSelector((state) => state.role.data);
  let filteredRole = roles.filter((el) => el?.name === 'ADMIN');
  groups = useSelector((state) => state.group.data);
  useEffect(() => { }, [roles, groups]);

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
    <Box>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          vipmail:'',
          roleId: filteredRole[0]?.id,
          password: '',
          designation: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(t('Invalid email address'))
            .max(255)
            .required(t('Email is required')),
          firstName: Yup.string()
            .max(255)
            .required(t('First name is required')),
          lastName: Yup.string()
            .max(255)
            .matches(/^(\S+$)/, '* This field cannot contain blankspaces')
            .required(t('Last name is required')),
          password: Yup.string()
            .min(8)
            .max(255)
            .required(t('Password is required')),
          phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required(
            t('Phone number is required')
          ),
          designation: Yup.string()
            .max(255)
            .required(t('Destination is required'))
        })}
        onSubmit={async (values, { resetForm }) => {
          if (profileError) {
            return;
          }
          setFormSubmitting(true);

          let user = {
            ...values,
            userType: "builder",
            roleId: filteredRole[0]?._id,
            profileImage: profileUrl
          }

          await createBuilderandUser({ group: payloadData, user }).then(async (response) => {
            if (
              response?.status === 200 ||
              response?.status === 201
            ) {
              let sucessMessage = 'Sucessfully Created User';
              // showNotification(
              //   sucessMessage,
              //   notificationType.SUCCESS
              // );
              setOpenNoti(true);
              setSuccessMessage(sucessMessage);
              setFormSubmitting(false);
              resetForm();


            } else {
              let errorMessage =
                response?.response?.data?.message ||
                'Something went wrong';
              // showNotification(errorMessage, notificationType.ERROR);
              setErrorMessage(errorMessage);
              setOpenNoti(true);
              setFormSubmitting(false);
            }
          })
            .catch((error) => {
              let errorMessage =
                error?.response?.data?.message ||
                'Something went wrong';
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
                gap: 5
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
            <TextField
              error={Boolean(touched.designation && errors.designation)}
              fullWidth
              margin="normal"
              helperText={touched.designation && errors.designation}
              label={t('Designation')}
              name="designation"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.designation}
              variant="outlined"
            />

            <TextField
              error={Boolean(touched.email && errors.email)}
              fullWidth
              margin="normal"
              helperText={touched.email && errors.email}
              label={t('VIP admin email address')}
              name="vipmail"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.vipmail}
              variant="outlined"
            />

            <TextField
              error={Boolean(touched.password && errors.password)}
              fullWidth
              margin="normal"
              helperText={touched.password && errors.password}
              label={t('Password')}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              variant="outlined"
            />
            <Box
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <FormControlLabel
                label="Show Password"
                control={
                  <Checkbox
                    checked={showPassword}
                    onChange={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                }
              />
            </Box>

            <Box
            >
              <Typography mb={1} mr={2}>
                Upload profile picture
              </Typography>
              <Grid container>
                <Grid xs={6} md={4} style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                  <UploadFile
                    title="Upload profile picture"
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
            <Button
              sx={{
                mt: 3
              }}
              color="primary"
              disabled={isSubmitting}
              type="submit"
              fullWidth
              size="large"
              variant="contained"
            >
              {submitting ? (
                <CircularProgress size={25} color="inherit" thickness={3.6} />
              ) : (
                t('Create builder account')
              )}
            </Button>
          </form>
        )}
      </Formik>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />

    </Box>
  );
}

export default RegisterUser;
