import * as Yup from 'yup';
import { addUserInfo } from 'src/slices/auth';
import _ from 'lodash';
import { Formik } from 'formik';
import {
  Button,
  TextField,
  Box,
  Grid,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { showNotification } from 'src/utils/commonUtility';
import { notificationType } from 'src/constants/NotificationType';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { editUser } from '../../axiosInstances/Api';
import {
  UploadProfileImage,
  GetURLForUpload
} from '../../components/Projects/AddProject/Index';
import { ProfileImageComponent } from '../pages/Auth/Register/EditBuilderGroup';

function EditUserForm({ setShowAdminForm }) {
  const updateUrl = (result) => {
    setProfileUrl(result[0].url);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let userData = useSelector((state) => state.auth.data);

  const [profileUrl, setProfileUrl] = useState(userData?.profileImage);

  const [submitting, setFormSubmitting] = useState(false);
  const { t } = useTranslation();
  
  const RefreshToken = async (data) =>{
    localStorage.removeItem('accessToken');
    localStorage.setItem('accessToken', data.token);
    localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify(data));
  }

  return (
    
    <Box>
      <Formik
        initialValues={{
          firstName: userData?.first_name || userData?.firstName,
          lastName: userData?.last_name || userData?.lastName,
          email: userData?.email,
          phoneNumber: userData?.phone||userData?.phoneNumber,
          photoUrl: profileUrl,
          designation: userData?.designation,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(t('The email provided should be a valid email address'))
            .max(255)
            .required(t('The email field is required')),
          firstName: Yup.string()
            .max(255)
            .required(t('The first name field is required')),
          lastName: Yup.string()
            .max(255)
            .required(t('The last name field is required')),

          phoneNumber: Yup.number().required(
            t('The Phone number field is required')
          ),

          designation: Yup.string()
            .max(255)
            .required(t('The destination field is required'))
        })}
        onSubmit={async (values, { resetForm }) =>

          {
            let payload = {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phoneNumber: values.phoneNumber,
              profileImage: profileUrl,
              designation: values.designation,
              userId: userData?.userId||userData?.id,
              userType: 'builder'
            };

            const response = await editUser(payload);
            // console.log("reesssssss",response?.status);
            if (response.status === 200 || response.status === 204) {
              let sucessMessage = 'Profile Edited Successfully';
              showNotification(sucessMessage, notificationType.SUCCESS);
              let newResponse = _.mapKeys(
                response?.data?.userData,
                (value, key) => _.camelCase(key)
              );
              await RefreshToken(response?.data?.userData);
              dispatch(addUserInfo(newResponse));
              navigate(`/dashboards`);
              setFormSubmitting(false);
              setShowAdminForm(false);
              resetForm();
            }else{
              // console.log("ress",response)
              let errorMessage =
                response?.data?.message || 'Something went wrong';
              showNotification(errorMessage, notificationType.ERROR);
              setFormSubmitting(false);
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
            &nbsp;
            <Grid item xs={6} style={{ display: 'flex' }}>
              {!profileUrl && <Box style={{ width: '100%' }}>
                <Box>
                  <UploadProfileImage
                    title="Upload profile pic"
                    handleChange={(e) => {
                      GetURLForUpload(e, updateUrl);
                    }}
                    name={profileUrl}
                  />
                </Box>
              </Box>}
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
            <Button
              sx={{
                mt: 3
              }}
              color="primary"
              disabled={isSubmitting}
              onClick={() => setFormSubmitting(true)}
              type="submit"
              fullWidth
              size="large"
              variant="contained"
            >
              {submitting ? (
                <CircularProgress size={25} color="inherit" thickness={3.6} />
              ) : (
                t('Save Profile')
              )}
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default EditUserForm;
