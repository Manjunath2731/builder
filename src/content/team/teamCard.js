import React, { useState } from 'react';
import {
  Card,
  Box,
  styled,
  Avatar,
  Typography,
  //   useTheme
  //  Divider
  Button
} from '@mui/material';
// import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
// import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { getTeamById, } from '../../slices/team';
import OpenNotification from '../ShowNotification';

const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      border-radius: 0px;
      z-index: 5;
      width: 100%;
      height: 100%;
      border: 0.2px solid #cedbef;
      `
);

const TeamInfoCard = ({
  name,
  designation,
  // address,
  number,
  email,
  id,
  profileUrl,
  // isCrmLogged =false,
  // isCrm=false,
  isEditAllowed = true,
  isActive = true,
  // teamData
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTab } = useParams();
  // const [edit ,setEdit] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleEdit = () => {
    // dispatch(deleteSliceData());
    dispatch(getTeamById());
    navigate(`/team/add-member/${selectedTab}/Edit/${id}`)
  };

  let avatarName = name.match(/\b(\w)/g);
  avatarName.join('');

  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const copy = (type) => {
    const valueToCopy = type === 'number' ? number : email;

    const el = document.createElement('input');
    el.value = valueToCopy;
    document.body.appendChild(el);
    el.select();

    document.execCommand('copy');
    setOpenNoti(true);
    setSuccessMessage('Copied!');

    document.body.removeChild(el);
  };


  return (
    <>
      <CardWrapper id={id} sx={{ height: '100%' }}>

        <Box
          sx={{
            paddingLeft: '20px',
            paddingTop: '45px',
            paddingBottom: '36px',
            // pr: 5,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {profileUrl ? (<Avatar
            // component={RouterLink}
            // to="#"
            sx={{
              width: { xs: 112, md: 100, xl: 112 },
              height: { xs: 112, md: 100, xl: 112 },
              bottom: '15px'
            }}
            alt="Remy Sharp"
            src={profileUrl}
          />) : <Avatar sx={{
            width: { xs: 112, md: 100, xl: 112 },
            height: { xs: 112, md: 100, xl: 112 },
            padding: 6,
            bgcolor: '#DBDBDB',
            fontSize: '35px'
          }} >{avatarName}</Avatar>}

          <Box sx={{ ml: 5, width: '100%' }}>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                // flexWrap: 'wrap',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: 1 }}>
                <Typography variant="h5">{name}</Typography>
                {!isActive && <Typography variant="h5" sx={{ color: '#f24743' }}>Deactivated</Typography>}
              </Box>
              {isEditAllowed && (<Button
                variant="contained"
                size="small"
                //   onClick={()=>{navigate('/channel_partners/broker-Detail')}}
                sx={{
                  height: 26,
                  width: 64,
                  borderRadius: 0.5,
                  marginRight: 5
                }}
                onClick={() => handleEdit()}
              >
                <Typography variant="body2" >
                  Edit
                </Typography>
              </Button>)}
            </Box>
            {/* <Typography variant="h5">{name}</Typography> */}
            <Typography variant="subtitle1" sx={{
              marginTop: '10px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              maxWidth: { xs: '400px', md: '250px', lg: '260px', xl: '400px', }
            }}>
              {designation}
              {/* {address && '- '} */}
              {/* {address} */}
            </Typography>
            <Box sx={{
              display: 'flex', flexDirection: 'row', mt: 1, justifyContent: 'flex-start', flexWrap: 'wrap',
              columnGap: { xs: 5, md: 2, xl: 4, lg: 2 },
              rowGap: { xs: 2 },
              cursor: 'pointer'
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                onClick={() => copy('number')}
              >
                {/* <LocalPhoneOutlinedIcon /> */}
                <img src="/static/images/logo/call-icon-green.svg" alt='call' />
                <Typography variant="subtitle1" sx={{ ml: 1 }}>
                  {number}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                onClick={() => copy('email')}
              >
                <img src="/static/images/logo/email-icon-green.svg" alt='email' />
                {/* <EmailOutlinedIcon /> */}
                <Typography variant="subtitle1" sx={{ ml: 1, fontSize: '0.9em' }}>
                  {email}
                </Typography>
              </Box>
            </Box>
          </Box>

        </Box>

        <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
      </CardWrapper>
      {/* {edit && <AddTeamMember editTeam={teamData}/>} */}
    </>


  );
};

export default TeamInfoCard;
