import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, } from 'react-redux';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import {
  Card,
  Box,
  styled,
  Avatar,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import {
  // getBrokersDetailById,
  getCompanyDetailById,
  getBrokerClientDetailsById
} from '../../slices/channelPartner.js';
import OpenNotification from '../ShowNotification/index.js';

const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      border-radius: 0px;
      z-index: 5;
    
      border: 0.2px solid #cedbef;
      `
);

const BrokerCard = ({
  name,
  number,
  email,
  id,
  profileUrl,
  companyName,
  companyId,
  assignRM,
  addedByYou,
  nameRM = '',
}) => {
  let avatarName = '';
  if (name && name.includes(' ')) {
    avatarName = name.split(' ');
    avatarName = avatarName.shift().charAt(0) + avatarName.pop().charAt(0);
    avatarName = avatarName.toUpperCase();

  }

  // let assignRMDetails = {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

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

  const handleDetailClick = () => {
    // dispatch(getBrokersDetailById(id));
    if (companyId !== null && companyId !== undefined && companyId !== '') {
      dispatch(getCompanyDetailById(companyId));
    }
    dispatch(getBrokerClientDetailsById(id));
    navigate(`/channel_partners/broker-Detail/${id}/${companyId}`);
  };
  useEffect(() => {
    // if (assignRM) {
    //   dispatch(getBrokersDetailById(assignRM));
    // }
  }, []);
  // assignRMDetails = useSelector(
  //   (state) => state.channelPartner.brokerDetailById
  // );
  const copy = (type) => {
    const el = document.createElement('input');
    el.value = type === 'number' ? number : email;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // showNotification('Copied!', notificationType.SUCCESS);
    setOpenNoti(true); 
    setSuccessMessage('Copied!');
  };
  return (
    <CardWrapper id={id}>
      <Box
        sx={{
          pl: { xs: 4, md: 2, xl: 4 },
          pt: 3,
          pb: 2,
          pr: { xs: 3, md: 2, xl: 3 },
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        {profileUrl ? (
          <Avatar
            sx={{
              width: { xs: 112, md: 100, xl: 112 },
              height: { xs: 112, md: 100, xl: 112 },
              border: '14px solid #f4f4f4'
            }}
            alt="Remy Sharp"
            src={profileUrl}
          />
        ) : (
          <Avatar
            sx={{
              width: { xs: 112, md: 100, xl: 112 },
              height: { xs: 112, md: 100, xl: 112 },
              bgcolor: '#DBDBDB',
              fontSize: '35px'
            }}
          >
            {avatarName}
          </Avatar>
        )}
        <Box
          sx={{
            ml: 2,
            width: '100%'
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box>
              <Typography variant="h5">{name}</Typography>
            </Box>
            {/* {!addedByYou ? ( */}
            <Button
              variant="contained"
              size="small"
              onClick={handleDetailClick}
              sx={{
                height: 24,
                width: 64,
                borderRadius: 0.5,
                marginRight: 1
              }}
            >
              <Typography variant="body2">Details</Typography>
            </Button>
            {/* ) : null} */}
          </Box>
          {!companyName && (
            <Typography variant="subtitle1" color="#838383">
              No Company Associated with this broker
            </Typography>
          )}{' '}
          {companyName && (
            <Typography variant="subtitle1" color="#838383">
              {companyName}
            </Typography>
          )}
          {assignRM && !addedByYou && (
            <Typography variant="subtitle1" color="#1cc45f" mb={1}>
              {assignRM &&
                `RM: ${nameRM}`}
            </Typography>
          )}
          {!assignRM && !addedByYou && (
            <Typography variant="subtitle1" color={theme.palette.grey[400]}>
              RM has not been assigned
            </Typography>
          )}
          <hr
            style={{
              borderTop: 'dashed 2px',
              color: '#e6edf7',
              borderBottom: ' 0px'
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              columnGap: { xs: 5, md: 2, xl: 4, lg: 2 },
              rowGap: { xs: 2 },
              mt: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <img src="/static/images/logo/call-icon-green.svg" alt="call" />
              <Typography
                variant="subtitle1"
                sx={{ ml: 1, cursor: 'pointer' }}
                onClick={() => copy('number')}
              >
                {number || 'N/A'}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <img src="/static/images/logo/email-icon-green.svg" alt="email" />
              <Typography
                variant="subtitle1"
                sx={{ ml: 1, cursor: 'pointer' }}
                onClick={() => copy('email')}
              >
                {email || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </CardWrapper>
  );
};

export default BrokerCard;
