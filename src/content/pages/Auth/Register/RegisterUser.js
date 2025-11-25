import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Button,
  TextField,
  Box,
  MenuItem,
  CircularProgress
} from '@mui/material';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { showNotification } from 'src/utils/commonUtility';
import { notificationType } from 'src/constants/NotificationType';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { createUser } from '../../../../axiosInstances/Api';
import {
  UploadProfileImage,
  GetURLForUpload
} from '../../../../components/Projects/AddProject/Index';

function RegisterUser() {

  const updateUrl = (result) => {
    setProfileUrl(result[0].url);
  };
  const { t } = useTranslation();
  const userData = JSON.parse(window.localStorage.getItem('user'));
  const [selectedRoleOption, setSelectedRoleOption] = useState(
    '6d09a216-7325-4e77-b3a9-3f89e4405ec2'
  );

  const [profileUrl, setProfileUrl] = useState('');
  const [selectedGroupOption, setSelectedGroupOption] = useState(
    userData.groupId
  );
  const [submitting, setFormSubmitting] = useState(false);
  let roles = [];
  let groups = [];
  roles = useSelector((state) => state.role.data);
  groups = useSelector((state) => state.group.data);

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        groupId: selectedGroupOption,
        roleId: selectedRoleOption,
        password: '',
        address: '',
        designation: '',
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
        password: Yup.string()
          .min(8)
          .max(255)
          .required(t('The password field is required')),
        phoneNumber: Yup.string()
          .max(255)
          .required(t('The Phone number field is required')),
        groupId: Yup.string().max(255).required(t('Group Id is required')),
        roleId: Yup.string().max(255).required(t('Role id is required')),
        designation: Yup.string()
          .max(255)
          .required(t('The destination field is required')),
        address: Yup.string()
          .max(255)
          .required(t('The address field is required'))
      })}
      onSubmit={async (
        values
      ) => {
        const response = await createUser(
          values,
          selectedGroupOption,
          selectedRoleOption
        );
        if (response === 200 || response === 201) {
          let sucessMessage = 'Sucessfully Created User';
          showNotification(sucessMessage, notificationType.SUCCESS);
          setFormSubmitting(false);
        } else if (response === 400) {
          let errorMessage = 'Email Address Exists in Database.';
          showNotification(errorMessage, notificationType.ERROR);
          setFormSubmitting(false);
        } else {
          let errorMessage = 'Something went wrong';
          showNotification(errorMessage, notificationType.ERROR);
          setFormSubmitting(false);
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
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
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
          <Box sx={{ my: 1 }}>
            <Select
              fullWidth
              disabled
              name="groupId"
              margin="normal"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedGroupOption}
              label="Group"
              onChange={(e) => setSelectedGroupOption(e.target.value)}
            >
              <MenuItem value="none">Select Group</MenuItem>
              {groups?.map((item) => {
                return <MenuItem value={item.id}>{item.name}</MenuItem>;
              })}
            </Select>
          </Box>

          <Box sx={{ my: 1 }}>
            <Select
              fullWidth
              disabled
              name="roleId"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedRoleOption}
              label="Role"
              onChange={(e) => setSelectedRoleOption(e.target.value)}
            >
              <MenuItem value="none">Select Role</MenuItem>
              {roles?.map((item) => {
                return <MenuItem value={item.id}>{item.name}</MenuItem>;
              })}
            </Select>
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
            error={Boolean(touched.password && errors.password)}
            fullWidth
            margin="normal"
            helperText={touched.password && errors.password}
            label={t('Password')}
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.address && errors.address)}
            fullWidth
            margin="normal"
            helperText={touched.address && errors.address}
            label={t('Address')}
            name="address"
            onBlur={handleBlur}
            onChange={handleChange}
            type="text"
            value={values.address}
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
          <Box style={{ display: 'flex', flexDirection: 'row' }}>
            <UploadProfileImage
              title="Upload profile pic"
              handleChange={(e) => {
                GetURLForUpload(e, updateUrl);
              }}
              name={profileUrl}
            />
          </Box>
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
              t('Create user account')
            )}
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default RegisterUser;
