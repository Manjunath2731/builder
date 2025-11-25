import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';

import {
  Grid,
  Box,
  Checkbox,
  InputLabel,
  TextField,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
  Card,
  styled,
  useTheme,
  Typography
} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { showNotification } from 'src/utils/commonUtility';
import { notificationType } from 'src/constants/NotificationType';
import { useSelector, useDispatch } from 'react-redux';
import PeopleCard from './PeopleCard';
import { browseButton } from '../../components/Projects/AddProject/Index';
import { InviteBroker } from '../../axiosInstances/Api';
import { getAllBrokers} from '../../slices/Events';
import { CardWrapper, SearchInputWrapper } from './EventDetails';

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
const getValidValue = (str) => {
  if (str !== null && str !== undefined) {
    return str;
  }
  return '';
};
const inviteFormValues = {
  emailAddress: '',
  uploadEmailCSV: '',
  inviteurl: ''
};
export const AlphabetsFilter = ({ onAlphabetClick }) => {
  const [selectedletter, setSelectedLetter] = useState('All');
  const theme = useTheme();

  let result = [];
  result.push(
    <Box
      sx={{
        background: '#eeeeee',
        py: 0.6,
        textAlign: 'center',
        px: 2,
        cursor: 'pointer'
      }}
      onClick={() => {
        onAlphabetClick('All');
        setSelectedLetter('All');
      }}
    >
      <Typography
        variant="h5"
        color={selectedletter === 'All' ? '' : theme.palette.primary.main}  
      >
        All
      </Typography>
    </Box>
  );
  for (let i = 65; i < 91; i++) {
    let letter = String.fromCharCode(i);
    result.push(
      <Box
      id={letter}
        sx={{
          background: '#eeeeee',
          py: 0.6,
          px: 2,
          textAlign: 'center',
          cursor: 'pointer'
        }}
        onClick={() => {
          onAlphabetClick(letter);
          setSelectedLetter(letter);
        }}
      >
        <Typography
          variant="h5"
          key={i}
          color={selectedletter === letter ? '' : theme.palette.primary.main}        
        >
          {letter}
        </Typography>
      </Box>
    );
  }
  return result;
};
const Invite = ({ inviteUrl = '', eventId ,invitees}) => {
  const theme = useTheme();
  const [inviteFormDetail, setInviteFormDetial] = useState(inviteFormValues);
  const [searchValue, setSearchValue] = useState('');
  const [tempTeam, setTempTeam] = useState([]);
  const [selectedBrokerList, setSelectedBrokerList] = useState([]);
  const [brokers, setbrokers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState([]);
  const navigate = useNavigate();
  const [selectedSend, setSelectedSend] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const handleSendViaSelected = (name) => {
    setSelectedSend(name);
  };
  const dispatch = useDispatch();
  const [file, setFile] = useState('');
  let Allbrokers = useSelector((state) => state.event.brokers);
  const handleBrokerSelected = (event, brokerId, email) => {
    if (!selectedBrokerList.includes(brokerId)) {
      setSelectedBrokerList((prevSelected) => [...prevSelected, brokerId]);
      setSelectedEmail((prevSelected) => [...prevSelected, email]);
      handleEmailChange(selectedEmail, email, true);
    } else {
      setSelectedBrokerList((prevSelected) =>
        prevSelected.filter((id) => id !== brokerId)
      );
      setSelectedEmail((prevSelected) =>
        prevSelected.filter((mail) => mail !== email)
      );
      handleEmailChange(selectedEmail, email);
    }
  };
  const onAlphabetClick = (letter = 'All') => {
    const searchKey = letter.toLowerCase();
    if (searchKey === 'all') {
      setTempTeam(brokers);
    } else {
      const filteredData = brokers.filter((el) => {
        if (el.first_name?.toLowerCase().charAt(0) === searchKey) {
          return true;
        }
        return false;
      });
      setTempTeam(filteredData);
    }
  };
  const handleSearchChange = async (event) => {
    event.preventDefault();

    if (event.target.value === '') {
      setTempTeam(brokers);
      setSearchValue('');
    } else {
      setSearchValue(event.target.value);
      filterWorkOrders(event.target.value);
    }
  };
  const filterWorkOrders = (key = '') => {
    const searchKey = key.toLowerCase();
    const filteredData = brokers.filter((el) => {
      if (
        getValidValue(el.first_name)?.toLowerCase().indexOf(searchKey) !== -1 ||
        getValidValue(el.last_name)?.toLowerCase().indexOf(searchKey) !== -1
      ) {
        return true;
      }
      return false;
    });
    setTempTeam(filteredData);
  };
  const toUpper = (str) => {
    let result = '';
    if (str !== null && str !== undefined) {
      result = str.charAt(0).toUpperCase() + str.slice(1);
    } else {
      result = '';
    }
    return result;
  };
  const handleEmailChange = (selectedEmail, email, selected = false) => {
    let emailArray = [...selectedEmail];
    if (!selected) {
      emailArray = selectedEmail.filter((mail) => mail !== email);
    } else {
      emailArray.push(email);
    }
    let emailstring = emailArray.join(',');
    setInviteFormDetial({ ...inviteFormDetail, emailAddress: emailstring });
  };

  const handleSave = async () => {
    setIsLoading(true);
    if(selectedSend=== 'csv' && inviteFormDetail?.inviteurl ){
      showNotification('Upload CSV File', notificationType.ERROR);
      setIsLoading(false);
      return 
    }
    if(selectedSend=== 'email' && inviteFormDetail?.emailAddress === '' ){
      showNotification('Select Emails ', notificationType.ERROR);
      setIsLoading(false);
      return 
    }
    
    const formData = new FormData();
    if (selectedSend === 'csv') {
      formData.append('inviteFile', file);
      formData.append('type', 'csv');
      formData.append('inviteLink', inviteFormDetail.inviteurl);
    } else {
      formData.append('values', inviteFormDetail?.emailAddress);
      formData.append('type', 'email');
      formData.append('inviteLink', inviteFormDetail.inviteurl);
    }
    await InviteBroker(eventId, formData).then((response) => {
      if (response?.status === 200 || response?.status === 201) {
        let sucessMessage = `Sucessfully Invited`;
        showNotification(sucessMessage, notificationType.SUCCESS);
        setIsLoading(false);
      }
      else {
        let errorMessage = 'Something went wrong';
        showNotification(errorMessage, notificationType.ERROR);
        setIsLoading(false);
      }
    });
    navigate('/events_polls');
  };
  const handleCancel = () => {
    navigate('/events_polls');
  };
  const copy = () => {
    const el = document.createElement('input');
    el.value = inviteFormDetail.inviteurl;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showNotification('Copied!', notificationType.SUCCESS);
  };
  const getBrokers =(broker)=>{
    let filteredBroker = invitees.filter(item => broker?.id === item?.id);
    return filteredBroker?.length === 0 
  }
  useEffect(() => {
    if(invitees?.length > 0){
      let filteredBrokers = Allbrokers.filter(item => getBrokers(item,invitees))
      setbrokers(filteredBrokers)
      setTempTeam(filteredBrokers);
    }
    else{
      setbrokers(Allbrokers)
      setTempTeam(Allbrokers);  
    }
    setInviteFormDetial({ ...inviteFormDetail, inviteurl: inviteUrl });
  }, [Allbrokers]);

  const userData = JSON.parse(window.localStorage.getItem('user'));
  useEffect(() => {
    dispatch(getAllBrokers(userData?.builderCompany[0]));
  }, []);
  return (
    <>
      <Box sx={{ml: 4, pt: 4, pl: { xs: 5, lg: 0 }, pr: { xs: 5, md: 7 } }}>
        <Box>
          <Typography variant="h4" mb={2} component="h3" gutterBottom>
          Select Channel Partners to Invite
          </Typography>
        </Box>
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={7}>
              <CardWrapper sx={{ minwidth: 275, minHeight: 500 }}>
                <Box display="flex" alignItems="center">
                  <Box
                    flexGrow={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ borderBottom: 1, borderColor: 'divider', pt: 2 }}
                  >
                    <Grid container spacing={4}>
                      <Grid item xs={5}>
                        <form>
                          <Box flexGrow={1} display="flex" alignItems="center">
                            <SearchTwoToneIcon
                              sx={{
                                mx: 2,
                                color: theme.colors.secondary.main
                              }}
                            />
                            <SearchInputWrapper
                              value={searchValue}
                              onChange={handleSearchChange}
                              autoFocus
                              placeholder="Type name to search..."
                              fullWidth
                            />
                          </Box>
                        </form>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                <Grid container>
                  <Grid item xs={1}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <AlphabetsFilter onAlphabetClick={onAlphabetClick} />
                    </Box>
                  </Grid>
                  <Grid item xs={11}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {tempTeam?.map((item) => {
                        let radioDesign = true;
                        const isBrokerSelected = selectedBrokerList.includes(
                          item._id
                        );
                        return (
                          <PeopleCard
                            radioDesign={radioDesign}
                            id={item?._id}
                            name={`${toUpper(item?.first_name)} ${toUpper(
                              item.last_name
                            )}`}
                            isBrokerSelected={isBrokerSelected}
                            designation={toUpper(item.designation)}
                            handleRadioSelected={handleBrokerSelected}
                            email={item.email}
                            profileUrl={item?.profileImage}
                          />
                        );
                      })}
                    </Box>
                  </Grid>
                </Grid>
              </CardWrapper>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Box>
                <Card sx={{ pl: 2, pr: 2 }}>
                  <Box
                    autoComplete="off"
                    mt={2}
                   
                    sx={{ display: 'flex', flexDirection: 'column', py: 3 , mx:{xs:5, md:3,xl:5} }}
                  >
                    <Typography mb={3}> You can also invite via</Typography>
                    <Box width="100%">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'flex-start'
                        }}
                      >
                        <Checkbox
                          checked={selectedSend === 'email'}
                          onChange={() => handleSendViaSelected('email')}
                          value={selectedSend === 'email'}
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<RadioButtonCheckedIcon />}
                        />
                        <InputLabel >Email Address</InputLabel>
                      </Box>

                      <TextField
                        id="emailAddress"
                        name="emailAddress"
                        multiline
                        rows={7}
                        variant="outlined"
                        fullWidth
                        value={inviteFormDetail.emailAddress}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        mt:2
                      }}
                    >
                      <Checkbox
                        checked={selectedSend === 'csv'}
                        onChange={() => handleSendViaSelected('csv')}
                        value={selectedSend === 'csv'}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<RadioButtonCheckedIcon />}
                      />
                      <Typography>
                        Upload CSV for email address
                      </Typography>
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
                        {file?.name}
                      </Typography>

                      <label
                        htmlFor="contained-button-file-uploadEmailCSV"
                        id="upload-button-uploadEmailCSV"
                      >
                        <Input
                          accept="image/*"
                          id="contained-button-file-uploadEmailCSV"
                          multiple
                          onChange={(e) => {
                            setFile(e.target.files[0]);
                          }}
                          name="uploadEmailCSV"
                          type="file"
                        />
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={
                            <img
                              src="/static/images/logo/projectIcons/browse-file-icon.svg"
                              alt=""
                              style={{ width: 30, height: 30 }}
                            />
                          }
                          sx={browseButton}
                        >
                          Browse file
                        </Button>
                      </label>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    autoComplete="off"
                    sx={{ display: 'flex', flexDirection: 'column', py: 3, mx:{xs:5, md:3,xl:5} }}
                  >
                    <Typography mb={1}> Share Event Link </Typography>
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
                          maxWidth: {xs:'70%',md:'60%',xl:'70%'},
                          mr: 1,
                          alignSelf: 'center'
                        }}
                      >
                        {inviteFormDetail.inviteurl}
                      </Typography>

                      <Button
                        variant="outlined"
                        component="span"
                        onClick={copy}
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
                            url={inviteFormDetail.inviteurl}
                          >
                            <FacebookIcon size={32} round />
                          </FacebookShareButton>
                        </IconButtonWrapper>
                      </Tooltip>
                      <Tooltip arrow placement="top" title="Twitter">
                        <IconButtonWrapper>
                          <TwitterShareButton
                            title="Invite Link"
                            url={inviteFormDetail.inviteurl}
                          >
                            <TwitterIcon size={32} round />
                          </TwitterShareButton>
                        </IconButtonWrapper>
                      </Tooltip>
                      <Tooltip arrow placement="top" title="Whatsapp">
                        <IconButtonWrapper>
                          <WhatsappShareButton
                            title="Invite Link"
                            url={inviteFormDetail.inviteurl}
                            separator=" -- "
                          >
                            <WhatsappIcon size={32} round />
                          </WhatsappShareButton>
                        </IconButtonWrapper>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    my={3}
                    sx={{ display: 'flex', flexDirection: 'row', columnGap: 2, mx:{xs:5, md:3,xl:5} }}
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
                      onClick={handleSave}
                    >
                      Send Invite
                    </Button>
                    <Button
                      variant="outlined"
                      disabled={isLoading}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default Invite;
