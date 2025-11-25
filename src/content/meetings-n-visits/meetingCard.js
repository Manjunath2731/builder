import React, { useState } from 'react';
import {
  Box,
  Card,
  Divider,
  Typography,
  useTheme,
  Avatar,
  styled
} from '@mui/material';
import { useDispatch } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { getYourNotification } from 'src/slices/dashboard.js';
import {
  meetCardStatusChange,
  regAndBookingCardStatusChange,
  editMeetings
} from '../../axiosInstances/Api.js';
import { toUpperMutliple } from '../../utils/utilits';
import {
  getbookingCard,
  // getregistrationCard,
  addMeetingCard,
  addMeetings
} from '../../slices/meetings';
import OpenNotification from '../ShowNotification/index.js';

export const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
  `
);

const MeetingCard = ({
  mainText,
  description,
  dateTime,
  data,
  ShowShareIcons = false,
  type = 'clientVisit'
}) => {
  const userData = JSON.parse(window.localStorage.getItem('user'));
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        // navigate(`/team/${selectedTab}`);
        dispatch(addMeetingCard());
        dispatch(addMeetings());
        dispatch(getbookingCard());
        dispatch(getYourNotification());
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const handleStatusChange = async (status) => {
    setIsLoading(true);
    const payload = {
      status
    };
    const userPayload = {
      id: userData?.userId,
      name: userData?.userName,
      phoneNumber: userData?.phone,
      email: userData?.email,
      status
    };
    if (type === 'clientVisit') {
      await meetCardStatusChange(data?._id, payload).then((response) => {
        if (response?.status === 200 || response?.status === 201) {
          editMeetings(data?._id, userPayload).then((responseStat) => {
            if (responseStat === 200 || responseStat === 201) {
              let sucessMessage = `Sucessfully ${toUpperMutliple(status)} `;
              // showNotification(sucessMessage, notificationType.SUCCESS);
              setOpenNoti(true);
              setSuccessMessage(sucessMessage);
              setIsLoading(false);

            }
          });
        } else {
          const errorMessage = 'Something went wrong';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
          setIsLoading(false);
        }
      });
    } else {
      await regAndBookingCardStatusChange(
        data?.clientId?._id,
        type,
        status.toUpperCase()
      ).then((response) => {
        if (response?.status === 200 || response?.status === 201) {
          let sucessMessage = `Sucessfully ${toUpperMutliple(status)} `;
          // showNotification(sucessMessage, notificationType.SUCCESS);
          setOpenNoti(true);
          setSuccessMessage(sucessMessage);
          setIsLoading(false);

          // dispatch(getregistrationCard());
        } else {
         const  errorMessage = 'Something went wrong';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
          setIsLoading(false);
        }
      });
    }
  };


  return (
    <>
      <Card
        variant="outlined"
        sx={{
          height: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            py: 2,
            pr: 4,
            pl: 2,
            background: '#fff1c9',
            flexWrap: 'wrap'
          }}
        >
          <Typography
            sx={{
              fontSize: `${theme.typography.pxToRem(14)}`
            }}
            variant="h4"
          >
            {type === 'clientVisit'
              ? data.meetingType === 'WALKIN'
                ? `Walk In Requested by  `
                : 'Client Visit Requested by  '
              : type === 'registration'
                ? 'Registration Requested by  '
                : 'Booking Requested by  '}
          </Typography>
          <Typography
            sx={{
              fontSize: `${theme.typography.pxToRem(14)}`,
              ml: 0.5,
              color: '#499ae0'
            }}
            variant="h4"
          >
            {mainText}
          </Typography>
        </Box>

        <Divider />
        <Box
          mt={1}
          p={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box mr={2}>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(14)}`
              }}
              variant="subtitle1"
            >
              {description}
            </Typography>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(14)}`,
                mb: 1
              }}
              variant="subtitle1"
            >
              {dateTime}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start'

            }}
          >
            <AvatarWrapper
              sx={{
                background: theme.colors.success.lighter,
                color: theme.palette.success.main,
                mr: 1,
                cursor: 'pointer',
                disabled: isLoading
              }}
              onClick={() => {
                handleStatusChange('ACCEPTED');
              }}
            >
              {ShowShareIcons ? (
                <ShareOutlinedIcon fontSize="large" />
              ) : (
                <CheckIcon fontSize="medium" />
              )}
            </AvatarWrapper>

            <AvatarWrapper
              sx={{
                background: theme.colors.error.lighter,
                color: theme.palette.error.main,
                cursor: 'pointer',
                disabled: isLoading
              }}
              onClick={() => {
                handleStatusChange('REJECTED');
              }}
            >
              <ClearIcon fontSize="medium" />
            </AvatarWrapper>
          </Box>
        </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />

      </Card>
    </>
  );
};

export default MeetingCard;
