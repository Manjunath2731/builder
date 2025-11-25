import React from 'react';
import {
  Box,
  Card,
  Typography,
  Divider,
  useTheme,
  Link,
  Grid
} from '@mui/material';
import {
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar';
import { useNavigate } from 'react-router';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { AvatarWrapper } from './NotificationBar';

const lavender = '#e1eff1';
const darkslategray = '#1f666d';
const Block2 = ({ data }) => {
  const navigate = useNavigate();
  const list = [
    { label: 'General Updates', value: '653', percentage: '21%' },
    { label: 'Offers for Client', value: '353', percentage: '28%' },
    { label: 'Offers for CP', value: '219', percentage: '21%' },
    { label: 'News Updates', value: '86', percentage: '11%' },
    { label: 'Video Teasers', value: '165', percentage: '9%' },
    { label: 'Misc.', value: '58', percentage: '3%' }
  ];
  const theme = useTheme();
  const ListAlignment = ({ list }) => {
    return (
      <Box>
        <Typography>{list.label}</Typography>
        <Typography
          color={darkslategray}
          sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}
        >
          <Typography variant="h4">{list.value}</Typography>
          <Typography ml={1} color={darkslategray} variant="subtitle2">
            {list.percentage}
          </Typography>
        </Typography>
      </Box>
    );
  };
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
            <Typography variant="h4"> Total Broadcast</Typography>
            <Typography color={darkslategray} variant="h3">
              {data?.totalBroadcast}
            </Typography>
          </Box>
          <Box
            my={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                width: '165px'
              }}
            >
              <CircularProgressbarWithChildren
                background
                circleRatio={1}
                styles={buildStyles({
                  rotation: 1 / 2.2 + 1 / 5.85,
                  trailColor: theme.colors.info.lighter,
                  pathColor: darkslategray,
                  strokeLinecap: 'butt',
                  backgroundColor: theme.palette.common.white
                })}
                strokeWidth={12}
                value={(data?.yourBroadCast / data?.totalBroadcast) * 100}
              >
                <Box
                  sx={{
                    background: theme.palette.common.white,
                    mt: '-10px'
                  }}
                >
                  <Typography
                    variant="h5"
                  >
                    {` Your Broadcast`}
                  </Typography>
                </Box>

                <Typography
                  variant="h3"
                >
                  {data?.yourBroadCast}
                </Typography>
              </CircularProgressbarWithChildren>
            </Box>
          </Box>
          <Box mt={1}>
            <Grid container spacing={2}>
              {list.map((item, index) => {
                return (
                  <React.Fragment key={item.label}>
                    <Grid item xs={4}>
                      <ListAlignment list={item} />
                    </Grid>
                    {(index + 1) % 3 === 0 && !(list.length === index + 1) && (
                      <Grid item xs={12}>
                        <Divider sx={{ borderStyle: 'dashed' }} />{' '}
                      </Grid>
                    )}
                  </React.Fragment>
                );
              })}
            </Grid>
          </Box>
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
            <Link href="/broadcast/">View All Broadcasts</Link>
            <AvatarWrapper
              onclick={() => navigate('/broadcast/')}
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
export default Block2;
