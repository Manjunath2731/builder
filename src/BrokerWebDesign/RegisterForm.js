import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Button,
  TextField,
  Typography,
  Link,
  Box,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { showNotification } from 'src/utils/commonUtility';
import { notificationType } from 'src/constants/NotificationType';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { createBuilder } from '../../../../axiosInstances/Api';

function RegisterUser({ setShowAdminForm, builderId }) {
  const navigate = useNavigate();
  const [submitting, setFormSubmitting] = useState(false);
  const { t } = useTranslation();
  let roles = [];
  let groups = [];
  roles = useSelector((state) => state.role.data);
  let filteredRole = roles.filter((el) => el?.name === 'ADMIN');
  groups = useSelector((state) => state.group.data);
  useEffect(() => {}, [roles, groups]);
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          py: 2
        }}
      >
        <Typography variant="h4">Register with Builder Broadcast</Typography>
        <Link> Login</Link>
      </Box>
      <Formik
        initialValues={{
          name: '',
          company: '',
          email: '',
          phoneNumber: '',
          designation: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(t('The email provided should be a valid email address'))
            .max(255)
            .required(t('The email field is required')),
          name: Yup.string()
            .max(255)
            .required(t('The Full Name field is required')),
          company: Yup.string()
            .max(255)
            .required(t('The Company field is required')),
          phoneNumber: Yup.number().required(
            t('The Phone number field is required')
          ),
          designation: Yup.string()
            .max(255)
            .required(t('The destination field is required'))
        })}
        onSubmit={async (values, { resetForm }) =>
          {
            setFormSubmitting(true);
            await createBuilder(
              values,
              builderId,
              filteredRole[0]?.id
            ).then((response) => {
              if (response?.status === 200 || response?.status === 201) {
                let sucessMessage = 'Sucessfully Created User';
                showNotification(sucessMessage, notificationType.SUCCESS);
                setFormSubmitting(false);
                setShowAdminForm(false);
                navigate('/builder-dashboard');
                resetForm();
              } else {
                let errorMessage =
                  response?.response?.data?.message || 'Something went wrong';
                showNotification(errorMessage, notificationType.ERROR);
                setFormSubmitting(false);
              }
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
            <TextField
              error={Boolean(touched.name && errors.name)}
              margin="normal"
              helperText={touched.name && errors.name}
              label={t('Full Name')}
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              variant="outlined"
            />

            <TextField
              error={Boolean(touched.company && errors.company)}
              margin="normal"
              helperText={touched.company && errors.company}
              label={t('Company')}
              name="company"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.company}
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
                t('Register')
              )}
            </Button>
          </form>
        )}
      </Formik>
      <Box
        width="100%"
        sx={{
          background: '#dae7f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Typography> Have an invitation code ?</Typography>
        <Link>Click here</Link>
      </Box>
    </Box>
  );
}

export default RegisterUser;
