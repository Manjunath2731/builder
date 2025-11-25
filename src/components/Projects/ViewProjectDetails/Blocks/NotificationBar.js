import React from 'react';
import moment from 'moment';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  useTheme
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { toUpperMutliple } from '../../../../utils/utilits';

export const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
       background:  ${theme.colors.alpha.trueWhite[100]};
  
        width: ${theme.spacing(3.5)};
        height: ${theme.spacing(3.5)};
  `
);
export const NotificationNumberWrapper = styled(Avatar)(
  ({ theme }) => `
       background: #e85e31;
  color: ${theme.colors.alpha.trueWhite[100]};
        width: ${theme.spacing(3)};
        height: ${theme.spacing(3)};
  `
);
const ColorList = ['#52b156'];
export const EventCard = ({ color, data }) => {
  const theme = useTheme();
  return (
    <>
      <Card sx={{ background: color, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 2,
            alignItems: ' flex-end'
          }}
        >
          <Box>
            <Typography
              sx={{ color: ` ${theme.colors.alpha.trueWhite[100]}` }}
              variant="subtitle2"
            >
              UPCOMING EVENT
            </Typography>
            <Typography
              sx={{ color: ` ${theme.colors.alpha.trueWhite[100]}` }}
              variant="h5"
              py={1}
            >
              {toUpperMutliple(data?.title)}
            </Typography>
            <Typography
              sx={{ color: ` ${theme.colors.alpha.trueWhite[100]}` }}
              variant="subtitle2"
            >
              {data?.venue?.address}
            </Typography>
            <Typography
              sx={{ color: ` ${theme.colors.alpha.trueWhite[100]}` }}
              variant="subtitle2"
            >
              {moment(data?.eventTime?.startTime).format('MMM Do YYYY')}, at{' '}
              {moment(data?.eventTime?.startTime).format('h:mm a')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex' }}>
            <AvatarWrapper
              sx={{
                color: theme.palette.success.light
              }}
            >
              <NavigateNextIcon fontSize="small" />
            </AvatarWrapper>
          </Box>
        </Box>
      </Card>
    </>
  );
};
export const NotificationList = () => {
  return (
    <Box>
      <Box
        my={1}
        py={0.5}
        px={0.5}
        sx={{ background: `#d8e0ed`, alignItems: 'center' }}
      >
        <Typography> Today, oct 12 </Typography>
      </Box>
      {ColorList.map((color, index) => {
        return (
          <React.Fragment key={index}>
            <Box>
              <ListItem>
                <ListItemAvatar
                  sx={{
                    minWidth: 'auto',
                    mt: 1,
                    mr: 2,
                    mb: 2
                  }}
                >
                  <Avatar
                    sx={{
                      width: 45,
                      height: 45
                    }}
                  />
                </ListItemAvatar>
                <ListItemText disableTypography>
                  <Typography variant="h4">Rose</Typography>
                  <Typography variant="subtitle2">
                    Invitation Accepted
                  </Typography>
                </ListItemText>
              </ListItem>
            </Box>
            {index + 1 < ColorList.length && <Divider />}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

const NotificationBar = ({ upcomingEvent }) => {
  const theme = useTheme();
  return (
    <>
      {ColorList.map((color) => {
        return (
          <Box key={color}>
            {upcomingEvent.length ? (
              <EventCard color={color} data={upcomingEvent} />
            ) : (
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 20
                }}
              >
                <Typography
                  mb={2}
                  sx={{
                    fontSize: `${theme.typography.pxToRem(15)}`,
                    fontWeight: 'normal',
                    color: '#a3a3a3',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  No Notifications to show
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </>
  );
};
export default NotificationBar;
