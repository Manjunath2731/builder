import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Loader from 'src/UI/Loader/Loader.js';
import {
  Box,
  Avatar,
  useTheme,
  Divider,
  Typography,
  CardMedia
} from '@mui/material';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ModalWrapper from 'src/UI/ModalWrapper/ModalWrapper';
import OpenNotification from '../ShowNotification';

export const SigleItem = ({ title, subtitle, optional = '' }) => {
  const theme = useTheme();
  return (
    <Box mx={1} my={2}>
      <Typography sx={{ display: 'flex', alignItems: 'baseline' }} variant="h6">
        <Typography
          sx={{
            fontSize: `${theme.typography.pxToRem(19)}`,
            // color: '#c0beb6',

            ml: 2
          }}
          variant="h6"
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: `${theme.typography.pxToRem(17)}`
          }}
          variant="subtitle2"
        >
          {optional}
        </Typography>
        <Typography
          sx={{
            fontSize: `${theme.typography.pxToRem(19)}`,
            fontWeight: 'bold',
            pl: 0.5
          }}
          variant="h6"
        >
          :
        </Typography>
      </Typography>

      <Typography
        sx={{
          fontSize: `${theme.typography.pxToRem(19)}`,
          mb: 1,
          mx: 2
        }}
        variant="h3"
      >
        {subtitle}
      </Typography>
    </Box>
  );
};
const BuilderDetailModal = ({ open, handleClose, closeDetail }) => {

  const [openNoti, setOpenNoti] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const theme = useTheme();
  const typographyStyle = {
    fontSize: `${theme.typography.pxToRem(15)}`
  };
  let group = useSelector((state) => state.group.groupDataById);
  let user = useSelector((state) => state.group.userDataByGroupId);
  const toUpper = (str) => {
    let result = '';
    if (str !== null && str !== undefined) {
      result = str.charAt(0).toUpperCase() + str.slice(1);
    } else {
      result = '';
    }
    return result;
  };

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
    const valueToCopy = type === 'number' ? user[0]?.phoneNumber : user[0]?.email;

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
      <ModalWrapper
        open={open}
        handleClose={handleClose}
        title={
          <Typography
            variant="h4"
            sx={{ fontSize: `${theme.typography.pxToRem(20)}` }}
          >
            Builder Details
          </Typography>
        }
        closeModal={closeDetail}
      >
        <Divider />
        {_.isEmpty(group) && <Loader sx={{ mt: 5 }} />}
        {!_.isEmpty(group) && (
          <Box px={4} py={2}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontSize: `${theme.typography.pxToRem(20)}`,
                  color: theme.palette.primary.dark,
                  fontWeight: 'bold'
                }}
              >
                Company{' '}
              </Typography>
              <Box
                sx={{
                  pt: 3,
                  pb: 4,
                  display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: 94,
                    height: 94,
                    resizeMode: 'contain',
                    objectFit: 'fill'
                  }}
                  alt="Company Logo"
                  src={group?.logo}
                />
                <Box sx={{ ml: 5, width: '100%', flexDirection: 'column' }}>
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap'
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontSize: `${theme.typography.pxToRem(18)}`,
                          color: '#28a745'
                        }}
                      >
                        {group?.name?.length > 40 ? `${group?.name.slice(0, 40)}...` : group?.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 1, mt: 1 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                      mt: 1
                    }}
                  >
                    <Typography variant="h5" sx={{ typographyStyle }}>
                      Short Name :
                    </Typography>
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                      {group?.short_name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline'
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        mt: 1
                      }}
                    >
                      Address:
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        ml: 1,
                        maxWidth: '60%', // Limit the width to prevent overflow
                        overflowWrap: 'break-word', // Allow long words to break
                      }}
                    >
                      {group?.address &&
                        group.address.match(new RegExp(`.{1,35}`, 'g')).join('\u200B')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                      mt: 1
                    }}
                  >
                    <Typography variant="h5" sx={{ typographyStyle }}>
                      City :
                    </Typography>
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                      {group?.city}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {!_.isEmpty(user) && (
              <Box>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: `${theme.typography.pxToRem(20)}`,
                    color: theme.palette.primary.dark,
                    fontWeight: 'bold'
                  }}
                >
                  Admin{' '}
                </Typography>
                <Box
                  sx={{
                    pt: 3,
                    pb: 4,
                    display: 'flex',
                    flexDirection: 'row'
                  }}
                >
                  <Avatar
                    sx={{
                      width: 84,
                      height: 84,
                      resizeMode: 'contain'
                    }}
                    alt="Profile Image"
                    src={user[0]?.profileImage}
                  />
                  <Box sx={{ ml: 5, width: '100%', flexDirection: 'column' }}>
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h4"
                          sx={{ typographyStyle }}
                        >{`${toUpper(user[0]?.firstName)} ${toUpper(
                          user[0]?.lastName
                        )}`}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle1" sx={{ typographyStyle }}>
                      {user[0]?.designation}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1, cursor: 'pointer' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                        onClick={() => copy('number')}
                      >
                        <LocalPhoneOutlinedIcon
                          fontSize="large"
                          sx={{ color: '#1cc45f' }}
                        />
                        <Typography variant="h5" sx={{ ml: 1 }}>
                          {user[0]?.phoneNumber}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          ml: 4,
                          alignItems: 'center'
                        }}
                        onClick={() => copy('email')}
                      >
                        <EmailOutlinedIcon
                          fontSize="large"
                          sx={{ color: theme.palette.primary.dark }}
                        />
                        <Typography variant="h5" sx={{ ml: 1 }}
                        >
                          {user[0]?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}

        <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
      </ModalWrapper>
    </>
  );
};

export default BuilderDetailModal;
