import React from 'react';
import moment from 'moment';
import { Box, Card, Typography, Divider, useTheme, Link } from '@mui/material';
import { useNavigate } from 'react-router';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { AvatarWrapper } from './NotificationBar';
import ChartDesign from './ChartDesign';
import { toUpperMutliple } from '../../../../utils/utilits';

export function dateToFromNowDaily(myDate) {
  // get from-now for this date
  let fromNow = moment(myDate).fromNow();

  // ensure the date is displayed with today and yesterday
  let dayName = moment(myDate).calendar(null, {
    // when the date is closer, specify custom values
    lastWeek: '[Last] dddd',
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    // when the date is further away, use from-now functionality
    sameElse: () => {
      return `[ ${fromNow} ]`;
    }
  });
  return `${dayName} AT ${moment(myDate).format('h:mm a')}`;
}

const lavender = '#e2ecf8';
const darkslategray = '#1f666d';
const Block3 = ({ projectDetails, data, upcomingClientVisit }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <>
      <Card sx={{ background: lavender, height: 525, position: 'relative' }}>
        <Box p={2} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h4"> Client Visits</Typography>
            <Typography color={darkslategray} variant="h3">
              {data?.totalClientVisits}
            </Typography>
          </Box>
          <Box>
            <ChartDesign
              bgColor={lavender}
              barColor={theme.palette.primary.main}
              data={[452, 458, 468, 854, 125, 474]}
              totalDays={[1, 2, 3, 4, 5, 6]}
              heightChart={200}
              isXAxis="false"
            />
          </Box>
          {upcomingClientVisit.length ? (
            <>
              <Box my={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Card>
                  {' '}
                  <Typography px={1} py={1}>
                    <Typography ml={0.5}>
                      {dateToFromNowDaily(upcomingClientVisit?.startTime)}{' '}
                    </Typography>
                  </Typography>
                </Card>
              </Box>
              <Box>
                <Typography variant="h4"> {projectDetails?.name}</Typography>
                <Typography>
                  Client: {toUpperMutliple(upcomingClientVisit?.client?.name)}
                </Typography>
                <Typography>
                  Broker:{' '}
                  {toUpperMutliple(upcomingClientVisit?.organizer?.name)}
                </Typography>
              </Box>
            </>
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
                  textAlign: 'center',
                  py: 4
                }}
              >
                No Upcoming Client Visit to show
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <Divider sx={{ mt: 2 }} />
          <Box
            my={2}
            px={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Link href="/meeting"> Upcoming Visits</Link>
            <AvatarWrapper
              onClick={() => {
                navigate('/meeting');
              }}
              sx={{
                color: theme.palette.primary.main
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
export default Block3;
