import React, { useState, useEffect } from 'react';
import { Box, styled, useTheme, Grid, CardContent, Divider, Card, alpha, Button, Modal, CircularProgress, TextField } from '@mui/material';
import InputBase from '@mui/material/InputBase';
// import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@material-ui/styles';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import Typography from "@mui/material/Typography";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { isAssociateAdmin, isSuperAdmin } from 'src/helpers/userHelpers';
import OpenNotification from 'src/content/ShowNotification';

// import { notificationType } from 'src/constants/NotificationType';
// import { showNotification } from 'src/utils/commonUtility';
import { createGovtPolices } from 'src/axiosInstances/Api';
import { deleteGovtPolices, editGovtPolices, getGovtPolices } from 'src/slices/center';
import { useDispatch, useSelector } from 'react-redux';
import DeleteConfirmation from 'src/content/delete-alert/DeleteAlert';

import { DropDownFilter } from '../../content/channel-partners/DropDownFilter';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 1,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2
};


const SearchInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(15)};
    max-width:'80px'
    // width: 100%;
`
);
const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      z-index: 5;
      &:hover {
        z-index: 6;
        box-shadow: 
        0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
        0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
        0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
        0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
        cursor:pointer;
    }
    
      `
);

const LINES_TO_SHOW = 2;

const useStyles = makeStyles({
  multiLineEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": LINES_TO_SHOW,
    "-webkit-box-orient": "vertical"
  }
});


// const list = [1, 2, 3, 4, 5];

const PolicesCard = ({ item }) => {
  const classes = useStyles();
  const { _id, city, title, description, category } = item;
  const [isDelete, setDelete] = useState(false);
  const [state, setState] = useState({
    city,
    category,
    title,
    description
  });
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);

  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      // if (!errorMessage) {
      //   navigate(`/team/${selectedTab}`);
      // }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteGovtPolices(id);
      let sucessMessage = response.data.message;
      dispatch(getGovtPolices());
      setDelete(false);
      // showNotification(sucessMessage, notificationType.SUCCESS);
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
    } catch (error) {
      // showNotification(error.message, notificationType.ERROR);
      setErrorMessage(error.message);
      setOpenNoti(true);
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async () => {
    setLoading(true)
    const payload = {
      ...state
    }

    try {
      const response = await editGovtPolices(_id, payload);
      let sucessMessage = response.data.message;
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
      // showNotification(sucessMessage, notificationType.SUCCESS);
      setLoading(false);
      dispatch(getGovtPolices());
      handleClose();
    } catch (error) {
      // showNotification(error.message, notificationType.ERROR);
      setErrorMessage(error.message);
      setOpenNoti(true);
      setLoading(false);
    }
  }

  const handleDeleteClose = () => {
    setDelete(false);
  };

  return (
    <>
      <CardWrapper sx={{ ml: 4, height: 260 }}>
        <CardContent >
          <Box id="policyGov" style={{ position: 'relative' }} >
            <Typography variant="h3">
              {title}
            </Typography>
            <Typography variant="h5">
              {city}
            </Typography>
            <Typography variant="h4" sx={{ mt: 2 }}>
              {category}
            </Typography>
            <Typography variant="body2" maxWidth="50" sx={{ mt: 3 }} className={classes.multiLineEllipsis}>
              {description}
            </Typography>
         

          </Box>
          <Box>
          <Divider sx={{ my: 2, mx: -2 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} id="govPolicy" style={{
            bottom: 3,
          }}>
            <Typography variant="subtitle2" color="primary"
              sx={{ cursor: 'pointer', fontSize: 13 }}
              onClick={() => (window.open('https://www.google.com/', '_blank', 'noreferrer'))}>
              Read Full Policy
            </Typography>
            <Box
              sx={{ display: 'flex' }}
            >
              {
                (isAssociateAdmin() || isSuperAdmin()) && <Box>
                  <Button
                  variant="contained"
                  size="small"
                  sx={{
                      height: 26,
                      width: 64,
                      borderRadius: 0.5,
                      marginRight: 1
                  }}
                    onClick={() => handleOpen(_id)}
                  >
                    Edit
                  </Button>
                  <Button
                     variant="contained"
                     size="small"
                     sx={{
                         height: 26,
                         width: 64,
                         borderRadius: 0.5,
                         marginRight: 1,
                         backgroundColor: '#f34423',
                         '&:hover': { background: '#f34423' }
                     }}
                    onClick={() => setDelete(true)}
                  >
                    <Typography variant="body2"
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      Delete
                    </Typography>
                  </Button>
                </Box>
              }
            </Box>
          </Box>
        </CardContent>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{ zIndex: 7 }}
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h1"
              mt={2}
            >
              Edit Govt. Policies
            </Typography>
            <TextField
              label='City'
              name='city'
              onChange={(event) => handleInputChange(event)}
              value={state.city}
            />
            <TextField
              label='Category'
              name='category'
              onChange={(event) => handleInputChange(event)}
              value={state.category}
            />
            <TextField
              label='Title'
              name='title'
              onChange={(event) => handleInputChange(event)}
              value={state.title}
            />
            <TextField
              id="description"
              name="description"
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              onChange={(event) => handleInputChange(event)}
              value={state.description}
            />
            <Box
              position="relative"
              xs={{ bottom: '6px' }}
              md={{ bottom: '0px' }}
              xl={{ bottom: '0px' }}
            >
              <Button
                variant="contained"
                onClick={() => handleOnSubmit()}
              >
                {isLoading ? (
                  <CircularProgress
                    size={22}
                    style={{
                      color: 'white'
                    }}
                  />
                ) : (
                  'Edit'
                )}
              </Button>
              <Button
                sx={{ ml: 2 }}
                variant="outlined"
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </Button>

            </Box>
          </Box>

        </Modal>
        {isDelete && (
          <DeleteConfirmation
            openConfirmDelete={isDelete}
            closeConfirmDelete={handleDeleteClose}
            handleDeleteCompleted={() => handleDelete(_id)}
            selectedId={_id}
            title="builder"
          />
        )}
      </CardWrapper>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  )
}

const Govtpolices = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [state, setState] = useState({
    city: '',
    category: '',
    title: '',
    description: ''
  });

  const handleOpen = () => {
    setOpen(true)
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };

  const handleInputChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      // if (!errorMessage) {
      //   navigate(`/team/${selectedTab}`);
      // }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };


  const handleOnSubmit = async () => {
    setLoading(true)
    const payload = {
      ...state
    }

    try {
      const response = await createGovtPolices(payload);
      setState({
        city: '',
        category: '',
        title: '',
        description: ''
      })
      let sucessMessage = response.data.message;
      // showNotification(sucessMessage, notificationType.SUCCESS);
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
      setLoading(false);
      dispatch(getGovtPolices());
      handleClose();
    } catch (error) {
      // showNotification(error.message, notificationType.ERROR);
      setErrorMessage(error.message);
      setOpenNoti(true);
      setLoading(false);
    }
  }
  const list = useSelector((state) => state.center?.govtpolices);

  useEffect(() => {
    dispatch(getGovtPolices());
  }, [])

  return (
    <>
      <Box
        sx={{ py: 4, pl: { xs: 4, lg: 0 }, pr: { xs: 4, md: 7 } }}
      >
        <Box display="flex" alignItems="center">
          <Box>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(15)}`,
                mt: 2,
                mb: 3,
                ml: 4
              }}
              variant="h4"
            >
              GOVERNMENT POLICIES
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              mb: 2,
              columnGap: 2, ml: 4
            }}>
            <DropDownFilter
              name="City"
              initialValue="Mumbai" />
            <DropDownFilter
              name="Category"
              initialValue="All"
              disabled />
            <Box
              display="flex"
              alignItems="center"
              sx={{ border: "1px solid lightgray", borderRadius: '10px', pl: 1, backgroundColor: "white" }}
            >
              <SearchTwoToneIcon
                sx={{
                  mr: 1.3,
                  color: theme.colors.secondary.main,
                  fontSize: '30px'
                }}
              />
              <SearchInputWrapper
                autoFocus
                placeholder="Search"
                fullWidth
              />
            </Box>
          </Box>
          <Box>
            {
              (isAssociateAdmin() || isSuperAdmin()) && <Button
                variant="contained"
                startIcon={<AddCircleIcon fontSize="medium" />}
                sx={{ mb: 1 }}
                style={{
                  width: '12rem',
                  height: '40px',
                  fontSize: '12px',
                  // fontFamily: 'Helvetica Neue medium lite'
                }}
                onClick={handleOpen}
              >
                Add Govt. Policies
              </Button>
            }
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ zIndex: 7 }}
          >
            <Box sx={style}>
              <Typography
                id="modal-modal-title"
                variant="h4"
                component="h1"
                mt={2}
              >
                Add Govt. Policies
              </Typography>
              <TextField
                label='City'
                name='city'
                onChange={(event) => handleInputChange(event)}
                value={state.city}
              />
              <TextField
                label='Category'
                name='category'
                onChange={(event) => handleInputChange(event)}
                value={state.category}
              />
              <TextField
                label='Title'
                name='title'
                onChange={(event) => handleInputChange(event)}
                value={state.title}
              />
              <TextField
                id="description"
                name="description"
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                onChange={(event) => handleInputChange(event)}
                value={state.description}
              />
              <Box
                position="relative"
                xs={{ bottom: '6px' }}
                md={{ bottom: '0px' }}
                xl={{ bottom: '0px' }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleOnSubmit()}
                >
                  {isLoading ? (
                    <CircularProgress
                      size={22}
                      style={{
                        color: 'white'
                      }}
                    />
                  ) : (
                    'Add'
                  )}
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="outlined"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Cancel
                </Button>

              </Box>
            </Box>

          </Modal>
        </Box>
        <Box sx={{ mt: 5 }}>
          <Grid container spacing={2} >
            {
              list?.map((item) => {
                return (
                  <Grid item xs={12} md={5} lg={5.5} xl={4}>
                    <PolicesCard
                      item={item}
                    />
                  </Grid>
                );
              })
            }
          </Grid>
        </Box>
      </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  )
}

export default Govtpolices;