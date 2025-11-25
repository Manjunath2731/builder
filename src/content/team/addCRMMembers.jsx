import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Card,
  styled,
  Grid,
  InputLabel,
  Button,
  useTheme,
  Typography,
  TextField,
  Select,
  MenuItem,
  //   Checkbox,
  CircularProgress,
  Divider //  Card, Divider
} from '@mui/material';

import FormControl from '@mui/material/FormControl';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
import { showNotification } from 'src/utils/commonUtility';
import { useDispatch, useSelector } from 'react-redux';
import { notificationType } from 'src/constants/NotificationType';
import { createTeamMember } from '../../axiosInstances/Api';
import { addPermission, addTeamTypes } from '../../slices/team';
import { addUsers } from '../../slices/meetings';

import {
  UploadProfileImage,
  GetURLForUpload
} from '../../components/Projects/AddProject/Index';

const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      z-index: 5;
      height:100%;
      width: 97%;
      }
    `
);

const AddTeamMember = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addPermission());
    dispatch(addTeamTypes());
    dispatch(addUsers());
  }, []);

  let permission = [];
  let teamTypes = [];
  const user = useSelector((state) => state.meeting?.users);
  permission = useSelector((state) => state.team.permission);
  teamTypes = useSelector((state) => state.team.teams);
  useEffect(() => {}, [permission, teamTypes]);

  const updateUrl = (result) => {
    setProfileUrl(result[0].url);
  };
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('none');
  const [ReportTo, setReportTo] = useState('none');
  const userData = JSON.parse(window.localStorage.getItem('user'));
  const getValidValue = (str) => {
    if (str !== null && str !== undefined) {
      return str;
    }
    return '';
  };

  const getCRMId = (teamTypes) => {
    let crmType = teamTypes.filter(
      (item) => getValidValue(item.name)?.toLowerCase() === 'crm'
    );
    return crmType[0]._id;
  };
  const createCRMMemberOnSubmit = async () => {
    setIsLoading(true);
    let payload = {
      fullName: name,
      email,
      phoneNumber: phone,
      designation,
      teamId: getCRMId(teamTypes),
      profileImage: profileUrl,
      address,
      builderCompany: userData.builderCompany[0]
    };
    const response = await createTeamMember(payload);

    if (response) {
      navigate(`/team`);
    }
    if (response === 200 || response === 201) {
      let sucessMessage = 'Sucessfully Created Team member';
      showNotification(sucessMessage, notificationType.SUCCESS);
      setIsLoading(false);
    } else if (response === 400) {
      // let errorMessage = 'Member Already Exist.';
      let errorMessage = response?.data || 'Something went wrong';
      showNotification(errorMessage, notificationType.ERROR);
      // showNotification(errorMessage, notificationType.ERROR);
      setIsLoading(false);
    } else {
      let errorMessage = 'Something went wrong';
      showNotification(errorMessage, notificationType.ERROR);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ paddingTop: 2, paddingLeft: 4 }}>
        <Typography
          sx={{
            fontSize: `${theme.typography.pxToRem(20)}`,
            mb: 1
          }}
          variant="h2"
        >
          Add CRM Members
        </Typography>
        <CardWrapper sx={{ mt: 3 }}>
          <Box autoComplete="off" my={1} mx={9} mt={8}>
            <Grid container columnSpacing={8} rowSpacing={4}>
              <Grid item xs={6}>
                <Box width="100%">
                  <TextField
                    id="employee_name"
                    name="employee_name"
                    label="Employee Name"
                    variant="outlined"
                    fullWidth
                    onChange={(event) => setName(event.target.value)}
                    value={name}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box width="100%">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Designation</InputLabel>
                    <Select
                      label="designation"
                      onChange={(event) => {
                        setDesignation(event.target.value);
                      }}
                      value={designation}
                      name="designation"
                    >
                      <MenuItem key={1} value="none">
                        <Box ml={2} display="inline-block">
                          Select
                        </Box>
                      </MenuItem>
                      <MenuItem key={1} value="sales manager">
                        <Box ml={2} display="inline-block">
                          Sales Manger
                        </Box>
                      </MenuItem>
                      <MenuItem key={2} value="pr manager">
                        <Box ml={2} display="inline-block">
                          PR Manger
                        </Box>
                      </MenuItem>
                      <MenuItem key={2} value="software developer">
                        <Box ml={2} display="inline-block">
                          Software Developer
                        </Box>
                      </MenuItem>
                      <MenuItem key={2} value="procurment manger">
                        <Box ml={2} display="inline-block">
                          Procurment manager
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box width="100%">
                  <TextField
                    id="phone_no"
                    name="phone_no"
                    label="Phone no"
                    variant="outlined"
                    fullWidth
                    onChange={(event) => setPhone(event.target.value)}
                    value={phone}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box width="100%">
                  <TextField
                    id="Official EmailId"
                    name="emailId"
                    label="Official EmailId"
                    variant="outlined"
                    fullWidth
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box width="100%">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Reports to</InputLabel>
                    <Select
                      label="reports-to"
                      onChange={(event) => {
                        setReportTo(event.target.value);
                      }}
                      value={ReportTo}
                      name="reports-to"
                      // disabled
                    >
                      <MenuItem key={1} value="none">
                        <Box ml={2} display="inline-block">
                          Select
                        </Box>
                      </MenuItem>
                      {user.map((item) => {
                        return (
                          <MenuItem
                            value={item.id}
                          >{`${item.first_name} ${item.last_name}`}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <Typography
                    sx={{
                      fontSize: `${theme.typography.pxToRem(15)}`,
                      mb: 0
                    }}
                    variant="subtitle1"
                  >
                    Note: You need to add managers first
                  </Typography>
                </Box>
              </Grid>
              {/* </Grid> */}
              {/* <Grid container columnSpacing={8} rowSpacing={4} mt={0}> */}
              <Grid item xs={6}>
                <Box width="100%">
                  <TextField
                    id="Address"
                    name="address"
                    label="Address"
                    variant="outlined"
                    fullWidth
                    onChange={(event) => setAddress(event.target.value)}
                    value={address}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box width="100%">
                  <UploadProfileImage
                    title="Upload profile pic"
                    handleChange={(e) => {
                      GetURLForUpload(e, updateUrl);
                    }}
                    name={profileUrl}
                  />
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Box mt={5} mb={10}>
              <Button
                variant="contained"
                onClick={() => createCRMMemberOnSubmit()}
              >
                {isLoading ? (
                  <CircularProgress
                    size={22}
                    style={{
                      color: 'white'
                    }}
                  />
                ) : (
                  'Add CRM members'
                )}
              </Button>
              <Button
                sx={{ ml: 2 }}
                variant="outlined"
                onClick={() => {
                  navigate(`/team`);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardWrapper>
      </Box>
    </>
  );
};

export default AddTeamMember;
