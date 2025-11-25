import React from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Divider,
  styled,
  useTheme
} from '@mui/material';
import {
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar';

export const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
       background:  ${theme.palette.grey[100]};
  
        width: ${theme.spacing(10.5)};
        height: ${theme.spacing(10.5)};
  `
);
const Block1 = () => {
  const theme = useTheme();
  const people = [0, 1, 2, 3];
  return (
    <>
      <Card sx={{ background: '#ebebeb' }}>
        <Box p={3} display="flex" flexDirection="row" alignItems="flex-start">
          <Box px={2} alignItems="center">
            <Box
              sx={{
                width: '165px'
              }}
            >
              <CircularProgressbarWithChildren
                circleRatio={1}
                styles={buildStyles({
                  rotation: 1 / 2.2 + 1 / 5.85,
                  trailColor: theme.colors.info.lighter,
                  pathColor: theme.palette.primary.main,
                  strokeLinecap: 'butt'
                })}
                strokeWidth={12}
                value={(80 / 125) * 100}
              >
                <Box
                  sx={{
                    mt: '-10px'
                  }}
                >
                  <Typography variant="h5">{` your Broker`}</Typography>
                </Box>

                <Typography variant="h3">80</Typography>
              </CircularProgressbarWithChildren>
            </Box>
            <Typography
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: `${theme.typography.pxToRem(16)}`
                }}
              >
                Total Broker
              </Typography>
              <Typography ml={1} variant="h3">
                125
              </Typography>
            </Typography>
          </Box>
          <Divider
            sx={{
              mx: 2
            }}
            variant="fullWidth"
            orientation="vertical"
            flexItem
          />
          <Box py={3} display="flex" flexDirection="column">
            <Typography variant="h4">Top Channel Partners</Typography>
            <Box
              mt={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {people.map((item) => {
                return (
                  <Box
                    key={item}
                    px={3}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <AvatarWrapper>
                      <Avatar
                        sx={{
                          width: 84,
                          height: 84
                        }}
                        alt="Remy Sharp"
                        src="/static/images/avatars/3.jpg"
                      />
                    </AvatarWrapper>

                    <Typography
                      sx={{
                        pt: 1,
                        color: theme.palette.primary.dark
                      }}
                      gutterBottom
                      variant="subtitle2"
                    >
                      Remy Sharp
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default Block1;
