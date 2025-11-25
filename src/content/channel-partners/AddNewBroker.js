import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import EmailIcon from '@mui/icons-material/Email';
// import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {
  Grid,
  Box,
  Checkbox,
  InputLabel,
  TextField,
  Divider,
  IconButton,
  CircularProgress,
  Tooltip,
  Button,
  Card,
  styled,
  useTheme,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import { getReferralCode, sendBrokerInvite } from '../../axiosInstances/Api';

import SendConfirmation from './confirmation';
import OpenNotification from '../ShowNotification';

export const Input = styled('input')({
  display: 'none'
});

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
        background: transparent;
        transition: ${theme.transitions.create(['all'])};
        color: ${theme.colors.alpha.black[100]};
        border-radius: 50px;
    
        &:hover {
          background: transparent;
          color: ${theme.colors.alpha.black[100]};
        }
    `
);

const AddNewBroker = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isConfirmation, setConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [payloadState, setPayloadState] = useState({});
  const [companyLink, setCompanyLink] = useState('');


  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  
    
  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        navigate('/channel_partners');
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const sendThroughList = [
    { label: 'Email / Phone Number', icon: EmailIcon, value: 'email_phone' },
    // { label: 'Phone Number', icon: PhoneAndroidIcon, value: 'phone' },
    { label: 'Upload CSV', icon: InsertDriveFileIcon, value: 'csv' }
  ];
  const getConfirmationText = () => {
    const textObj = sendThroughList.filter(
      (item) => item.value === selectedSend
    );
    return textObj[0];
  };
  const [selectedSend, setSelectedSend] = useState('email_phone');
  const copy = () => {
    const el = document.createElement('input');
    el.value = companyLink;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // showNotification('Link Copied !', notificationType.SUCCESS);
    setOpenNoti(true); 
      setSuccessMessage('Link Copied !');
      setIsLoading(false);

  };
  const handleSendViaSelected = (name) => {
    setSelectedSend(name);
  };
  // const initialValue = {
  //   emails: '',
  //   phoneNumber: '',
  //   file: ''
  // };
  const [file, setFile] = useState('');
  // const [input, setInput] = useState(initialValue);
  const [input, setInput] = useState([{ type: '', value: '' }]);



  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    console.log("name", name, "value", value)
    // setInput({ ...input, [name]: value });
    const fields = [...input];
    fields[index] = { ...fields[index], [name]: value };
    console.log(fields);
    setInput(fields);
  };


  const addInputField = () => {
    setInput([...input, { type: '', value: '' }]);
  };

  const removeInputField = (index) => {
    const fields = [...input];
    fields.splice(index, 1);
    setInput(fields);
  };


  const handleFileChange = (e) => {
    const { name } = e.target;
    setFile(e.target.files[0]);
    setInput({ ...input, [name]: e.target.files[0]?.name });
  };

  const handleSendInvitee = async () => {
    const formData = new FormData();
    let payload = {};
    if (selectedSend === 'csv') {
      formData.append('inviteFile', file);
      formData.append('type', 'csv');
      payload = {
        type: 'csv',
        inviteFile: file
      };
    } else {
      payload = {
        type: selectedSend,
        values: input?.map(field => ({
          name: field.name,
          contact: field.contact
        }))
      };
    }
    setPayloadState({ ...payload });
    setConfirmation(true);
  };
  // const handleSendInvitee = async () => {
  //   let payload
  //   if (selectedSend === 'csv') {
  //     payload.inviteFile = file;
  //   }else{
  //     payload = {
  //       type: selectedSend,
  //       values: input?.map(field => ({
  //         name: field.name,
  //         contact: field.contact
  //       }))
  //     };
  //   }

  //   setPayloadState(payload);
  //   setConfirmation(true);
  // };


  const apiCall = async () => {
    // if (
    //   (payloadState?.type === 'phone' || payloadState.type === 'email') &&
    //   !payloadState?.values.length
    // ) {
    //   setIsLoading(false);
    //   let errorMessage = 'Please enter any email to invite the channel partner';
    //   showNotification(errorMessage, notificationType.ERROR);
    //   return;
    // } else if (payloadState.type === 'csv' && !payloadState.inviteFile) {
    //   setIsLoading(false);
    //   let errorMessage = 'Please attach a csv file';
    //   showNotification(errorMessage, notificationType.ERROR);
    //   return;
    // }
    // const formData = new FormData();
    // if (payloadState.type === 'csv') {
    //   formData.append('inviteFile', payloadState.inviteFile);
    //   formData.append('type', 'csv');
    // } else if (payloadState.type === 'email') {
    //   formData.append('type', 'email');
    //   formData.append('values', payloadState.values);
    // } else if (payloadState.type === 'phone') {
    //   formData.append('type', 'phone');
    //   formData.append('values', payloadState.values);
    // }

    setIsLoading(true);
    setConfirmation(false);

    // console.log("payloadState", payloadState)
    if (
      (payloadState?.type === 'email_phone') &&
      !payloadState?.values.length
    ) {
      setIsLoading(false);
      let errorMessage = 'Please enter any email to invite the channel partner';
      // showNotification(errorMessage, notificationType.ERROR);
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      return;
    } else if (payloadState.type === 'csv' && !payloadState.inviteFile) {
      setIsLoading(false);
      let errorMessage = 'Please attach a csv file';
      // showNotification(errorMessage, notificationType.ERROR);
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      return;
    }

    const formData = new FormData();
    console.log("payloadState.values", payloadState.values);
    if (payloadState.type === 'csv') {
      formData.append('inviteFile', payloadState.inviteFile);
      formData.append('type', 'csv');
      apiResponse(formData);
    } else if (payloadState.type === 'email_phone') {
      formData.append('type', payloadState.type);
      payloadState.values.forEach(field => {
        formData.append('value', [field.name, field.contact]);
      })
      apiResponse(payloadState);
    }
  };

  const apiResponse = async (data) => {
    try {
      await sendBrokerInvite(data)
      let sucessMessage = `Sucessfully Invited`;
      // showNotification(sucessMessage, notificationType.SUCCESS);
      setOpenNoti(true); 
      setSuccessMessage(sucessMessage);
      setIsLoading(false);
      
    } catch (e) {
      console.log(e)
      let errorMessage = e.response ? e.response.data.message : 'Something went wrong';
      // showNotification(errorMessage, notificationType.ERROR);
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      setIsLoading(false);
    }
  }

  const handleSave = async () => {
    setIsLoading(true);
    setConfirmation(false);
    await apiCall();
  };
  const closeConfirmSave = () => {
    setConfirmation(false);
    setIsLoading(false);
  };

  const handleCancel = () => {
    navigate(`/channel_partners`);
  };

  useEffect(async () => {
    const refferalLink = await getReferralCode();
    setCompanyLink(`http://65.2.141.38:5000/account/register/${refferalLink.data.referral}`)
  }, []);


  return (
    <>
      <React.Fragment>
        {isConfirmation && (
          <SendConfirmation
            confirmationText={getConfirmationText()}
            openConfirmSave={isConfirmation}
            closeConfirmSave={closeConfirmSave}
            handleSave={handleSave}
          />
        )}
      </React.Fragment>
      <Box sx={{ pr: 3, pt: 3, pl: { xs: 3, lg: 0 }, ml: 4 }}>
        <Box>
          <Typography variant="h4" mb={2} component="h3" gutterBottom>
            INVITE CHANNEL PARTNERS TO YOUR NETWORK
          </Typography>
        </Box>
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={7} lg={6}>
              <Card sx={{ px: 4, pt: 4, pb: 3 }}>
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {' '}
                    Send invitation via
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      columnGap: 4,
                      py: 2
                    }}
                  >
                    {sendThroughList.map((item, index) => {
                      const Icon = item.icon;
                      const isSelected = item?.value === selectedSend;
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSendViaSelected(item?.value)}
                            value={isSelected}
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<RadioButtonCheckedIcon />}
                          />

                          <Icon fontSize="large" color="primary" />
                          <Typography>{item.label}</Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  <Box>
                    {selectedSend === 'email_phone' && (
                      // <Box width="100%">
                      //   <InputLabel sx={{ mb: 1 }}>
                      //     Separate by comma in case of multiple emails
                      //   </InputLabel>
                      //   <TextField
                      //     id="emails"
                      //     name="emails"
                      //     multiline
                      //     rows={7}
                      //     variant="outlined"
                      //     fullWidth
                      //     onChange={handleInputChange}
                      //     value={input?.emails}
                      //   />
                      // </Box>
                      <Box>
                        {input?.map((field, index) => (<Box display="flex" alignItems="center" justifyContent="center" mt={2}>
                          <Box width="40%" mr={2} >
                            <InputLabel sx={{ mb: 1 }}>Name</InputLabel>
                            <TextField
                              id={`type-${index}`}
                              name="name"
                              variant="outlined"
                              fullWidth
                              onChange={(e) => handleInputChange(index, e)}
                              value={field?.name}
                            />
                          </Box>

                          <Box width="60%">
                            <InputLabel sx={{ mb: 1 }}>Enter Email or Phone Number</InputLabel>
                            <TextField
                              id={`value-${index}`}
                              // id="contact"
                              name="contact"
                              variant="outlined"
                              fullWidth
                              onChange={(e) => handleInputChange(index, e)}
                              value={field?.contact}
                            />
                          </Box>
                          {/* {index > 0 && ( */}
                          <IconButton
                            aria-label="Delete"
                            onClick={() => removeInputField(index)}
                            sx={{
                              '&:hover': {
                                background: 'transparent'
                              }
                            }}

                          >
                            <DeleteIcon sx={{ fontSize: "35px", color: "red", marginTop: "25px" }} />
                          </IconButton>
                          {/* )} */}
                        </Box>))}

                        <Box sx={{ mt: 2, fontWeight: "bold", color: "#0078E9", cursor: "pointer" }}>
                          <Typography variant="outlined" onClick={addInputField}>
                            Add More Invite
                          </Typography>
                        </Box>

                      </Box>

                    )}
                    {/* {selectedSend === 'phone' && (
                      <Box width="100%">
                        <InputLabel sx={{ mb: 1 }}>
                          Separate by comma in case of multiple Phone Numbers
                        </InputLabel>
                        <TextField
                          id="phoneNumber"
                          name="phoneNumber"
                          multiline
                          rows={7}
                          variant="outlined"
                          fullWidth
                          onChange={handleInputChange}
                          value={input?.phoneNumber}
                        />
                      </Box>
                    )} */}
                    {selectedSend === 'csv' && (
                      <Box width="100%">
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            textDecoration: 'none'
                          }}
                        >
                          <InputLabel sx={{ mb: 1 }}>Upload CVS</InputLabel>
                          <Box
                            component="div"
                            sx={{ display: 'inline', fontSize: '8pt' }}
                          >

                            <a
                              href="https://builder-broadcast-media.s3.ap-south-1.amazonaws.com/builder-broadcast-media/649c2e673eef0c31bca38ca5/projectimages-1/1691479057/brokerinvite-3566.csv                              "
                              target="_blank"
                              rel="noreferrer"
                              style={{ textDecoration: 'none' }}
                            >
                              Download Sample Template
                            </a>
                          </Box>
                        </Box>

                        <Box
                          width="100%"
                          sx={{
                            background: '#eeeeee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignitems: 'center',
                            cursor: 'pointer',
                            p: 1
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              maxWidth: '260px',
                              mr: 1,
                              alignSelf: 'center'
                            }}
                          >
                            {input?.file}
                          </Typography>

                          <label
                            htmlFor="contained-button-file-uploadCSV"
                            id="upload-button-uploadCSV"
                          >
                            <Input
                              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                              id="contained-button-file-uploadCSV"
                              multiple
                              onChange={handleFileChange}
                              name="file"
                              type="file"
                            />
                            <Button
                              component="span"
                              startIcon={
                                <img
                                  src="/static/images/logo/projectIcons/browse-file-icon.svg"
                                  alt=""
                                  style={{ width: 30, height: 30 }}
                                />
                              }
                              sx={{
                                background: theme.palette.common.white,
                                border: 1,
                                borderRadius: '10px',
                                borderColor: theme.palette.grey[300],
                                color: theme.palette.primary.main,
                                fontWeight: 'normal',
                                '&:hover': {
                                  background: theme.palette.common.white
                                }
                              }}
                            >
                              Browse file
                            </Button>
                          </label>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Divider sx={{ my: 3 }} />
                  <Box
                    sx={{ display: 'flex', flexDirection: 'row', columnGap: 2 }}
                  >
                    <Button
                      variant="contained"
                      startIcon={
                        isLoading ? (
                          <CircularProgress
                            size={22}
                            style={{
                              color: 'black'
                            }}
                          />
                        ) : null
                      }
                      disabled={isLoading}
                      onClick={() => {
                        handleSendInvitee();
                      }}
                    >
                      {selectedSend === 'csv'
                        ? ' Upload & Send Invite'
                        : ' Send Invite'}
                    </Button>
                    <Button variant="outlined" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={7} lg={6}>
              <Card sx={{ px: 4, pt: 4, pb: 3 }}>
                <Box>
                  <Box
                    autoComplete="off"
                    sx={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <Typography mb={1} sx={{ fontWeight: 'bold' }}>
                      Or simply share your company link
                    </Typography>
                    <Box
                      width="100%"
                      sx={{
                        background: '#eeeeee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignitems: 'center',
                        cursor: 'pointer',
                        p: 1
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          maxWidth: '360px',
                          mr: 1,
                          alignSelf: 'center',
                          color: theme.palette.primary.main
                        }}
                      >
                        {companyLink}
                      </Typography>

                      <Button
                        component="span"
                        onClick={copy}
                        sx={{
                          background: theme.palette.common.white,
                          border: 1,
                          borderRadius: '10px',
                          borderColor: theme.palette.grey[300],
                          color: theme.palette.common.black,
                          fontWeight: 'normal',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            background: theme.palette.common.white,
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        Copy Link
                      </Button>
                    </Box>

                    <Typography mb={1} mt={2}>
                      Share via
                    </Typography>
                    <Box display="flex" alignitems="center" mr={1}>
                      <Tooltip arrow placement="top" title="Facebook">
                        <IconButtonWrapper>
                          <FacebookShareButton
                            title="Invite Link"
                            url={companyLink}
                          >
                            <FacebookIcon size={32} round />
                          </FacebookShareButton>
                        </IconButtonWrapper>
                      </Tooltip>
                      <Tooltip arrow placement="top" title="Twitter">
                        <IconButtonWrapper>
                          <TwitterShareButton
                            title="Invite Link"
                            url={companyLink}
                          >
                            <TwitterIcon size={32} round />
                          </TwitterShareButton>
                        </IconButtonWrapper>
                      </Tooltip>
                      <Tooltip arrow placement="top" title="Whatsapp">
                        <IconButtonWrapper>
                          <WhatsappShareButton
                            title="Invite Link"
                            url={companyLink}
                            separator=" -- "
                          >
                            <WhatsappIcon size={32} round />
                          </WhatsappShareButton>
                        </IconButtonWrapper>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
};
export default AddNewBroker;
