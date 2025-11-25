import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import _ from 'lodash';
import {
  Box,
  Card,
  styled,
  Grid,
  Button,
  useTheme,
  Typography,
  TextField,
  Checkbox,
  CircularProgress,
  Divider,
  // FormHelperText,
  // CardMedia,
  Avatar,
  Switch,
  FormHelperText
} from '@mui/material';
import Badge from '@mui/material/Badge';
// import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import Loader from 'src/UI/Loader/Loader.js';
import DeleteConfirmation from 'src/components/Projects/Drafts/DeleteConfirmation';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
// import { showNotification } from 'src/utils/commonUtility';
import { useDispatch, useSelector } from 'react-redux';
// import { notificationType } from 'src/constants/NotificationType';
import {
  createTeamMember,
  editTeamMember,
  assignRMToProject,
  // isUserActive,
  projectByRM,
  assignCRMToProject,
  projectByCRM
} from '../../axiosInstances/Api';
import MultipleSelect from '../../content/blocks/Multiselect/mutliSelect';
import {
  addPermission,
  addTeams,
  // addTeamTypes,
  getTeamById
} from '../../slices/team';
import { addUsers } from '../../slices/meetings';
import {
  UploadProfileImage,
  GetURLForUpload,
  handleRemoveFromS3
} from '../../components/Projects/AddProject/Index';
import { getProjectByBuilderId } from '../../slices/ProjectList';
import { addRoles } from '../../slices/roles';
import { toUpperMutliple } from '../../utils/utilits';
import OpenNotification from '../ShowNotification';

const USERDATA = JSON.parse(window.localStorage.getItem('user'));
const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      z-index: 5;
      height:100%;
      width: 97%;
      display: flex;
      justify-content: center;
      }
    `
);

const errors = {
  name: false,
  mobileNumber: false,
  email: false,
  projectId: false
};

const AddTeamMember = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { action, userID, selectedTab } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState(errors);
  const editTeam = useSelector((state) => state.team.teamById);
  const [checked, setChecked] = React.useState(true);
  const [permission, setPermission] = useState([]);
  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleSwitchChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    dispatch(getTeamById(userID));
    dispatch(getProjectByBuilderId(USERDATA.builderCompany[0]));
    dispatch(addPermission());
    // dispatch(addTeamTypes());
    dispatch(addUsers());
    dispatch(addRoles());
    dispatch(addTeams(USERDATA.builderCompany[0]));
    if (
      action === 'Edit' &&
      userID !== '' &&
      !(_.isEmpty(editTeam) && editTeam._id === userID)
    ) {
      if (selectedTab === 'teams') {
        projectByRM(userID).then((result) => {
          console.log({ result })
          setProject(Array.isArray(result?.data) ? result?.data.map((x) => ({ label: x?.name, value: x._id })) : []);
        });
      }
      if (selectedTab === 'crm') {
        projectByCRM(userID).then((result) => {
          setProject(Array.isArray(result?.data) ? result?.data.map((x) => ({ label: x?.name, value: x._id })) : []);
        });
      }
    }
  }, []);

  let permissionList = [];
  let teamTypes = [];
  let projects = [];
  let teamMemberId = useSelector((state) => state.role.data).filter(
    (e) => e.name === 'TEAM_MEMBER'
  );
  let crmMemberRoleId = useSelector((state) => state.role.data).filter(
    (e) => e.name === 'CRM_MEMBER'
  );


  permissionList = useSelector((state) => state.team.permission);
  teamTypes = useSelector((state) => state.team.teams);
  projects = useSelector((state) => state.projectList.projectListBuilder).map(x => ({
    value: x?._id,
    label: toUpperMutliple(x?.name)
  }));

  const [openDeleteImageConfirmation, setOpenDeleteImageConfirmation] =
    useState(false);
  const handleImageRemove = () => {
    setOpenDeleteImageConfirmation(true);
  };
  const closeConfirmImageDelete = () => {
    setOpenDeleteImageConfirmation(false);
  };
  const handleImageDelete = (url) => {
    setOpenDeleteImageConfirmation(false);
    handleRemoveFromS3(url).then((response) => {
      if (response) {
        setProfileUrl('');
      }
    });
  };
  useEffect(() => {
    if (
      action === 'Edit' &&
      userID !== '' &&
      !(_.isEmpty(editTeam) && editTeam._id === userID)
    ) {
      const { designation, permissions } = editTeam;
      setName(`${editTeam.first_name} ${editTeam.last_name}`);
      setProfileUrl(editTeam.profileImage);
      setEmail(editTeam.email);
      setPhone(editTeam.phoneNumber);
      setChecked(editTeam.is_active === true);
      if (Array.isArray(permissions)) {
        let permissionIds = permissions.map((item) => item?._id);
        setState(permissionIds);
      }
      setDesignation(designation);

      setIsEditing(true);
    }
    if (selectedTab === 'crm') {
      let permission = permissionList.filter(
        (item) => item.name === "addCRMMember" || item.name === "deleteCRMMember"
      );
      setPermission(permission);
    } else {
      setPermission(permissionList);
    }
  }, [permissionList, teamTypes, editTeam]);
  const [state, setState] = useState([]);
  const selectedSome = state.length > 0 && state.length < permission.length;
  const selectedAll = state.length === permission.length;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      let filterId = permission.map((e) => {
        return e._id;
      });
      setState(filterId);
    } else {
      setState([]);
    }
  };

  const handleChange = (event) => {
    if (event.target.checked) {
      setState([...state, event.target.id]);
    } else {
      let tempVar = state.filter((e) => e !== event.target.id);
      setState(tempVar);
    }
  };
  const handleMultipleDDChange = (e) => {
    console.log({ e, project });
    // if (Array.isArray(e) && e.length) {
    //   setFormErrors((formErrors) => ({ ...formErrors, projectId: false }));
    // }
    setProject(e);
  };
  const updateUrl = (result) => {
    setProfileUrl(result[0].url);
  };

  //
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [project, setProject] = useState('none');
  const [designation, setDesignation] = useState('');
  const userData = JSON.parse(window.localStorage.getItem('user'));
  const AssignProjects = (roleId, rmPayload, selectedProject) => {
    return Promise.all([...selectedProject].map((projecId) => assignAPI(roleId, rmPayload, projecId)));
  }
  const assignAPI = async (roleId, rmPayload, projecId) => {
    if (roleId === crmMemberRoleId[0]._id) {
      await assignCRMToProject(rmPayload, projecId);
    }
    if (roleId === teamMemberId[0]._id) {
      await assignRMToProject(rmPayload, projecId);
    }
  }

  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        navigate(`/team/${selectedTab}`);
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };


  const createTeamMemberOnSubmit = async () => {
    if (!name) {
      setFormErrors((formErrors) => ({ ...formErrors, name: true }));
    }
    if (!email) {
      setFormErrors((formErrors) => ({ ...formErrors, email: true }));
    }
    if (!phone) {
      setFormErrors((formErrors) => ({ ...formErrors, mobileNumber: true }));
    }
    // if (project === 'none' || project.length < 1) {
    //   setFormErrors((formErrors) => ({ ...formErrors, projectId: true }));
    // }

    if (!name || !email || !phone) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const splitName = name.split(" ");
    const firstname = splitName[0];
    const lastname = splitName[1] ? splitName[1] : "";
    let payload = {
      // fullName: name,
      first_name: firstname,
      last_name: lastname,
      email,
      phoneNumber: phone,
      designation,
      permissions: state,
      role: selectedTab === 'teams' ? teamMemberId[0]._id : crmMemberRoleId[0]._id,
      profileImage: profileUrl,
      is_active: checked,
      builderCompany: userData.builderCompany[0],
      project: Array.isArray(project) ? project.map((x) => x.value) : []
    };

    if (isEditing) {
      if (editTeam.email === payload.email) {
        delete payload.email;
      }
      // let response;
      const response = await editTeamMember(userID, payload)
      if (response.status === 200 || response.status === 201) {
        if (payload?.project?.length > 0) {
          const rmPayload = { userId: response.data.data };
          await AssignProjects(payload.role, rmPayload, payload.project);

          // let sucessMessage = 'Sucessfully Edited Team member';
          // showNotification(sucessMessage, notificationType.SUCCESS);
          setOpenNoti(true); 
          setSuccessMessage('Successfully Edited Team member');
          setIsLoading(false);

        } else {
          const rmPayload = { userId: response.data.data };
          await assignAPI(payload.role, rmPayload, false);

          // let sucessMessage = 'Sucessfully Edited Team member';
          // showNotification(sucessMessage, notificationType.SUCCESS);
          setOpenNoti(true); 
          setSuccessMessage('Successfully Edited Team member');
          setIsLoading(false);

          // navigate(`/team/${selectedTab}`);
        }
      } else if (response.status === 400) {
        const errorMessage = response.data.message || 'Something went wrong';
        setErrorMessage(errorMessage); 
        setOpenNoti(true); 
        setIsLoading(false);
      } else {
        const errorMessage = 'Something went wrong';
        setErrorMessage(errorMessage);
        setOpenNoti(true);
        setIsLoading(false);

      }
    } else {
      try {
        const { data } = await createTeamMember(payload);
        const rmPayload = { userId: data.data };
        // const isActivePayload = {
        //   userId: data.data,isActive: checked ? 1 : 0
        // };
        // await isUserActive(isActivePayload);
        await AssignProjects(payload.role, rmPayload, payload.project);
        // let sucessMessage = 'Sucessfully Created Team member';
        // showNotification(sucessMessage, notificationType.SUCCESS);
        setSuccessMessage('Successfully Created Team member');
        setOpenNoti(true);


      } catch (error) {
        let errorMessage = error.response?.data?.message || 'Something went wrong';
        console.error('Error message:', errorMessage);
        setErrorMessage(errorMessage);
        setOpenNoti(true);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const style = {
    paddingBottom: 5.5,
    paddingTop: 6
  };
  if (action === 'Edit' && _.isEmpty(editTeam) && editTeam?._id !== userID) {
    return <Loader />;
  }

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
      <Box sx={{ p: 3, ml: 4 }}>
        <Typography
          sx={{
            fontSize: `${theme.typography.pxToRem(20)}`,
            mb: 1
          }}
          variant="h2"
        >
          {isEditing
            ? `Edit ${selectedTab === 'teams' ? 'Team' : 'CRM'} Member`
            : `Add ${selectedTab === 'teams' ? 'Team' : 'CRM'} Member`}
        </Typography>
        <CardWrapper sx={{ mt: 3, height: 200 }}>
          <Box autoComplete="off" my={1} mx={8} mt={8} sx={{ width: { xs: '100%', md: '70%%', lg: '65%', xxl: '50%' } }}>
            <Grid container columnSpacing={4}>
              <Grid item
                xs={6}
                sx={{ alignSelf: 'center', justifySelf: 'center' }}>
                {profileUrl ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} width='100%' height='100%'>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      badgeContent={
                        <button
                          style={{
                            margin: 'auto',
                            // position: 'absolute',
                            display: 'block',
                            width: '20px',
                            height: '20px',
                            border: 'none',
                            borderRadius: '50%',
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: 'red',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '18px',
                            // right: '5px',
                            // top: '3px',
                            // zIndex: '8'
                          }}
                          type="button"
                          onClick={() => {
                            handleImageRemove();
                          }}
                        >
                          &times;
                        </button>
                      }
                    >
                      <Avatar sx={{
                        width: 210,
                        height: 200,
                        border: `10px solid #eeeeee`,
                      }}
                        alt="Travis Howard"
                        src={profileUrl} />
                    </Badge>
                  </Box>


                ) : (
                  <UploadProfileImage
                    title="Upload profile picture"
                    handleChange={(e) => {
                      // GetURLForUpload(e, updateUrl);
                      uploadData(e,updateUrl)   
                    }}
                    name={profileUrl}
                    style={style}
                    profileUrl={profileUrl}
                  />
                )}
              </Grid>
              <Grid item
                xs={6} >
                <Grid container columnSpacing={4} rowSpacing={2}>
                  <Grid item xs={12} >
                    <TextField
                      id="phone_no"
                      name="phone_no"
                      label="Mobile Number*"
                      variant="outlined"
                      fullWidth
                      onChange={(event) => {
                        if (event.target.value !== '') {
                          setFormErrors((formErrors) => ({
                            ...formErrors,
                            mobileNumber: false
                          }));
                        }
                        if (event.target.value.length > 10) {
                          let errorMessage =
                            'Phone Number must contain only 10 digits';
                          // showNotification(
                          //   errorMessage,
                          //   notificationType.ERROR
                          // ;
                          setErrorMessage(errorMessage);
                          setOpenNoti(true);
                          return;
                        }
                        setPhone(event.target.value);
                      }}
                      value={phone}
                      error={formErrors?.mobileNumber}
                      helperText={
                        formErrors?.mobileNumber ? 'This field is required' : ''
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="Official EmailId"
                      name="emailId"
                      label="Official Email Id *"
                      variant="outlined"
                      fullWidth
                      onChange={(event) => {
                        if (event.target.value !== '') {
                          setFormErrors((formErrors) => ({
                            ...formErrors,
                            email: false
                          }));
                        }
                        setEmail(event.target.value);
                      }}
                      error={formErrors?.email}
                      helperText={
                        formErrors?.email ? 'This field is required.' : ''
                      }
                      value={email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="designation"
                      name="designation"
                      label="Designation"
                      variant="outlined"
                      fullWidth
                      onChange={(event) => {
                        setDesignation(event.target.value);
                      }}
                      value={designation}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container rowSpacing={2} columnSpacing={4} mt={2}>
              <Grid item xs={6} >
                <TextField
                  id="employee_name"
                  name="employee_name"
                  label="Employee Name*"
                  variant="outlined"
                  fullWidth
                  onChange={(event) => {
                    if (event.target.value !== '') {
                      setFormErrors((formErrors) => ({
                        ...formErrors,
                        name: false
                      }));
                    }
                    setName(event.target.value);
                  }}
                  error={formErrors?.name}
                  helperText={formErrors?.name ? 'This field is required.' : ''}
                  value={name}
                />
              </Grid>
              <Grid item xs={6}>
                <Box width="100%">
                  <FormControl fullWidth variant="outlined">
                    {/* <InputLabel>Project *</InputLabel>
                    <Select
                      label="Project"
                      onChange={(event) => {
                        setProject(event.target.value);
                      }}
                      value={project}
                      name="project"
                    >
                      <MenuItem key={1} value="none">
                        <Box ml={2} display="inline-block">
                          Select
                        </Box>
                      </MenuItem>
                      {projects.map((item) => {
                        return (
                          <MenuItem key={item._id} value={item._id}>
                            <Box ml={2} display="inline-block">
                              {toUpper(item.name)}
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select> */}

                    <MultipleSelect
                      value={project}
                      data={projects}
                      handleChange={handleMultipleDDChange}
                      placeholder={<div>Project</div>}
                    />
                  </FormControl>
                  {formErrors?.projectId && (
                    <FormHelperText error="false">
                      This field is required.
                    </FormHelperText>
                  )
                  }
                </Box>
              </Grid>
            </Grid>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(15)}`,
                mt: 3
              }}
              variant="h6"
            >
              USER PERMISSIONS
            </Typography>
            <FormControl sx={{ mt: 1 }} component="fieldset" variant="standard">
              <FormGroup>
                {permission.length > 1 && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedAll}
                        onChange={(event) => handleSelectAll(event)}
                        name="selectAll"
                        indeterminate={selectedSome}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    label="Select All"
                  />
                )}
                <Grid container spacing={1}>
                  {permission.map((item) => {
                    let isSelected = state.includes(item._id);
                    return (
                      <Grid item xs={permission.length > 2 ? permission.length > 1 ? 4 : 12 : permission.length <= 2 ? 6 : 12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id={item._id}
                              checked={isSelected}
                              onChange={handleChange}
                              name={item.name}
                            />
                          }
                          label={
                            item.name === 'reassignRM'
                              ? 'Reassign RM'
                              : item.description
                          }
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </FormGroup>
            </FormControl>
            <Divider sx={{ my: 2 }} />
            {isEditing && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    mt: 2
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: checked ? '#6bbb3e' : '#f24743' }}
                  >
                    {checked ? 'Active' : 'Deactive'}
                  </Typography>
                  <Switch
                    defaultChecked
                    color="success"
                    // sx={{color:checked?'#6bbb3e':'#f24743'}}
                    checked={checked}
                    onChange={handleSwitchChange}
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
              </>
            )}
            <Box mt={5} mb={5}>
              <Button
                variant="contained"
                onClick={() => {
                  createTeamMemberOnSubmit();

                }}
              >
                {isLoading ? (
                  <CircularProgress
                    size={22}
                    style={{
                      color: 'white'
                    }}
                  />
                ) : isEditing ? (
                  ' Save Changes '
                ) : (
                  'Add Member'
                )}
              </Button>
              <Button
                sx={{ ml: 2 }}
                variant="outlined"
                onClick={() => {
                  navigate(`/team/${selectedTab}`);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardWrapper>
      </Box>
      {openDeleteImageConfirmation && (
        <DeleteConfirmation
          openConfirmDelete={openDeleteImageConfirmation}
          closeConfirmDelete={closeConfirmImageDelete}
          handleDeleteCompleted={handleImageDelete}
          title="Profile Image"
          selectedId={profileUrl}
        />
      )}
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
};

export default AddTeamMember;
