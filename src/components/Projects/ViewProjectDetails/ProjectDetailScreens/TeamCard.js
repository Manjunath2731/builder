import React from 'react';
import { showNotification } from 'src/utils/commonUtility';
import { notificationType } from 'src/constants/NotificationType';
import { Card, Box, styled, Avatar, Typography } from '@mui/material';

const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      border-radius: 0px;
      z-index: 5;
    
      border: 0.2px solid #cedbef;
      `
);

const TeamCard = ({ name, number, email, id, profileUrl, isActive = true }) => {
  let avatarName = '';
  if (name && name.includes(' ')) {
    avatarName = name.split(' ');
    avatarName = avatarName.shift().charAt(0) + avatarName.pop().charAt(0);
    avatarName = avatarName.toUpperCase();
  }
  const copy = (type) => {
    const el = document.createElement('input');
    el.value = type === 'number' ? number : email;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showNotification('Copied!', notificationType.SUCCESS);
  };
  return (
    <>
      <CardWrapper id={id} sx={{ width: '100%', height: '100%' }}>
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
                height: { xs: 112, md: 100, xl: 112 }
              }}
              alt="Remy Sharp"
              src={profileUrl}
            />
          ) : (
            <Avatar
              sx={{
                width: { xs: 100, md: 100, xl: 100 },
                height: { xs: 100, md: 100, xl: 100 },
                padding: 3,
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
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: 1
                }}
              >
                <Typography variant="h5">{name}</Typography>
                {!isActive && (
                  <Typography variant="h5" sx={{ color: '#f24743' }}>
                    Deactivated
                  </Typography>
                )}
              </Box>
            </Box>
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
                  sx={{ ml: 1 }}
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
                <img
                  src="/static/images/logo/email-icon-green.svg"
                  alt="email"
                />
                <Typography
                  variant="subtitle1"
                  onClick={() => copy('email')}
                  sx={{
                    ml: 1,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: { xs: '90%' }
                  }}
                >
                  {email || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardWrapper>
    </>
  );
};

export default TeamCard;
