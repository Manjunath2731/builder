import React, { useState } from 'react';
import moment from 'moment';
import {
  Card,
  Box,
  styled,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import { resendInvite } from '../../axiosInstances/Api';
import SendConfirmation from './confirmation';
import OpenNotification from '../ShowNotification';

const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      border-radius: 0px;
      z-index: 5;
  
      border: 0.2px solid #cedbef;
      `
);
const PendingInviteesCard = ({ id, name, phoneNumber, date, email }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmation, setConfirmation] = useState(false);

  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      // if (!errorMessage) {
      //   // navigate(`/team/${selectedTab}`);
      // }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const handleResendInvite = () => {
    setIsLoading(true);
    setConfirmation(true);
      handleSave();
};
  const closeConfirmSave = () => {
    setConfirmation(false);
    setIsLoading(false);
  };

  const apiCall = () => {
    const via = [
      { label: 'email', value: email },
      { label: 'phoneNumber', value: phoneNumber }
    ];
    via.map((item) => {
      if (item.value !== null && item.value !== undefined) {
        const payload = {
          [`${item.label}`]: `${item.value}`
        };
        resendInvite(payload).then((response) => {
          if (response.status === 200 || response.status === 201) {
            let sucessMessage = `Sucessfully Invited`;
            // showNotification(sucessMessage, notificationType.SUCCESS);
            setOpenNoti(true); 
            setSuccessMessage(sucessMessage);
            setIsLoading(false);
            
          } else {
            const errorMessage = 'Something went wrong';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            setIsLoading(false);
          }
        });
      }
      return '';
    });
  };
  const handleSave = async () => {
    setConfirmation(false);
    await apiCall();
  };

  return (
    <React.Fragment>
      <CardWrapper id={id}>
        <Box sx={{ px: 6, py: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Typography variant="h4">{name}</Typography>
              <Typography>{email}</Typography>
              <Typography>{phoneNumber}</Typography>
              
            </Box>
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
              onClick={handleResendInvite}
            >
              Resend Invite 
            </Button>
          </Box>
          <Typography variant="subtitle1" mt={3}>
            Invite sent on {moment(date).format('MMMM Do YYYY')}
          </Typography>
        </Box>
      </CardWrapper>
      {isConfirmation ? (
        <div>
          <SendConfirmation
            openConfirmSave={isConfirmation}
            closeConfirmSave={closeConfirmSave}
            handleSave={handleSave}
          />
        </div>
      ) : null}
       <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </React.Fragment>
  );
};
export default PendingInviteesCard;
