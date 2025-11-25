import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
  Grid,
  FormControl
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import OpenNotification from 'src/content/ShowNotification';

// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { editBuilder, EditBuilderGroup } from '../../../../axiosInstances/Api';
import { ProfileImageComponent } from './EditBuilderGroup';
import { resetGroupAndUser } from '../../../../slices/groups';
import {
  GetURLForUpload
} from '../../../../components/Projects/AddProject/Index';
import UploadFile from '../../../../components/Upload/UploadFile';

function EditRegisterUser({ setShowAdminForm, builderId, user, payloadData }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const updateUrl = (result) => {
    setProfileUrl(result[0].url);
  };
  const [profileUrl, setProfileUrl] = useState(user[0]?.profileImage);
  const [submitting, setFormSubmitting] = useState(false);
  const { t } = useTranslation();
  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        setFormSubmitting(false);
        setShowAdminForm(false);
        navigate('/builder-dashboard');
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };
  let roles = [];
  roles = useSelector((state) => state.role.data);
  let filteredRole = roles.filter((el) => el?.name === 'ADMIN');
  useEffect(() => { }, [user]);

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
          firstName: user[0]?.firstName,
          lastName: user[0]?.lastName,
          email: user[0]?.email,
          phoneNumber: user[0]?.phoneNumber,
          groupId: builderId,
          roleId: filteredRole[0]?.id,
          vipadmin: user[0]?.vipadmin,
          designation: user[0]?.designation,
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
          // phoneNumber: Yup.number().required(
          //   t('The Phone number field is required')
          // ),
          phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required(
            t('Phone number is required')
          ),
          designation: Yup.string()
            .max(255)
            .required(t('Destination is required'))
        })}
        onSubmit={async (values, { resetForm }) => {
          setFormSubmitting(true);
          if (
            user[0]?.id !== undefined &&
            user[0]?.id !== null &&
            user[0]?.id !== ''
          ) {

            try {
              await EditBuilderGroup(builderId, { ...payloadData, vipadmin: values.vipadmin }).then(
                async (response) => {
                  if (response?.status === 200 || response?.status === 201) {
                    await editBuilder(
                      values,
                      builderId,
                      filteredRole[0]?.id,
                      profileUrl,
                      user[0]?.id
                    ).then((response) => {
                      if (
                        response?.status === 200 ||
                        response?.status === 201
                      ) {
                        let sucessMessage = 'Sucessfully Edited Builder';
                        // showNotification(
                        //   sucessMessage,
                        //   notificationType.SUCCESS
                        // );
                        setOpenNoti(true);
                        setSuccessMessage(sucessMessage);

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
                    });
                  } else {
                    let errorMessage =
                      response?.response?.data?.message ||
                      'Something went wrong';
                    // showNotification(errorMessage, notificationType.ERROR);
                    setErrorMessage(errorMessage);
                    setOpenNoti(true);

                    setFormSubmitting(false);
                    dispatch(resetGroupAndUser());
                  }
                }
              );
            } catch (e) {
              let errorMessage = e.response?.data?.message
              setErrorMessage(errorMessage);
              setOpenNoti(true);

              setFormSubmitting(false);
            }
          }
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
            <FormControl fullWidth variant="outlined">
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
            </FormControl>
            <FormControl fullWidth variant="outlined">
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
            </FormControl>
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

            <FormControl fullWidth variant="outlined">
              <TextField
                fullWidth
                margin="normal"
                label={t('VIP admin email address')}
                name="vipadmin"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values.vipadmin}
                variant="outlined"
              />
            </FormControl>
            <Box>
              <Typography mb={1} mr={2} mt={2}>
                Upload profile pic
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
                t('Save')
              )}
            </Button>
          </form>
        )}
      </Formik>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </Box>
  );
}

export default EditRegisterUser;
