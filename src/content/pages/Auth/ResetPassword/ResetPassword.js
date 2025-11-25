import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Button, TextField, CircularProgress } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';
import { useSelector } from 'react-redux';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { showNotification } from 'src/utils/commonUtility';
import { notificationType } from 'src/constants/NotificationType';
import { useTranslation } from 'react-i18next';
import { ResetPasswordAPIWithoutToken } from '../../../../axiosInstances/Api.js';

const ResetPassword = () => {
  const isMountedRef = useRefMounted();
  const { t } = useTranslation();
  const [submitting, setFormSubmitting] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  let userData = useSelector((state) => state.auth.data);
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Formik
      initialValues={{
        newPassword: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        newPassword: Yup.string()
          .max(255)
          .required(t('This is required field.')),
        confirmPassword: Yup.string()
          .max(255)
          .required(t('This is required field.'))
      })}
      onSubmit={async (
        values,
        { setErrors, setStatus, setSubmitting, resetForm }
      ) => {
        const payload = {
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
          email: userData?.email
        };
        try {
          const response = await ResetPasswordAPIWithoutToken(payload);
          if (response === 200 || response === 201) {
            let sucessMessage = 'Sucessfully Password Changed';
            showNotification(sucessMessage, notificationType.SUCCESS);
            setFormSubmitting(false);
            handleLogout();
            resetForm();
          } else {
            let errorMessage =
              response?.data?.errors[0] || 'Something went wrong';
            showNotification(errorMessage, notificationType.ERROR);
          }
          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
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
          <TextField
            error={Boolean(touched.newPassword && errors.newPassword)}
            fullWidth
            margin="normal"
            autoFocus
            helperText={touched.newPassword && errors.newPassword}
            label={t('New Password')}
            name="newPassword"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.newPassword}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            fullWidth
            margin="normal"
            helperText={touched.confirmPassword && errors.confirmPassword}
            label={t('Confirm Password')}
            name="confirmPassword"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.confirmPassword}
            variant="outlined"
          />
          <Button
            sx={{
              mt: 3
            }}
            color="primary"
            onClick={() => setFormSubmitting(true)}
            disabled={
              isSubmitting || values.confirmPassword !== values.newPassword
            }
            type="submit"
            fullWidth
            size="large"
            variant="contained"
          >
            {submitting && !errors ? (
              <CircularProgress size={25} color="inherit" thickness={3.6} />
            ) : (
              t('Change Password')
            )}
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default ResetPassword;
