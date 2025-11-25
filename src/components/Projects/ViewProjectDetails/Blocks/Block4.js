import React from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Divider,
  styled,
  useTheme,
  IconButton,
  Link
} from '@mui/material';
import {
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar';
import { useNavigate } from 'react-router';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { AvatarWrapper } from './NotificationBar';

SwiperCore.use([Navigation, Pagination]);

const grey = '#ebebeb';
const darkslategray = '#1f666d';
const trailGreyColor = '#d2d2d2';

const SwipeIndicator = styled(IconButton)(
  ({ theme }) => `
      @media (max-width: ${theme.breakpoints.values.sm}px) {
          display: none;
      }
      transition: ${theme.transitions.create(['background', 'color'])};
      color: ${theme.palette.primary.main};
      position: absolute;
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
      top: 50%;
      margin-top: ${theme.spacing(-3.5)};
      border-radius: 100px;
  
      &:hover {
        color: ${theme.palette.primary.main};
        background: ${theme.colors.alpha.trueWhite[100]};
      }
  
      &.MuiSwipe-left {
        left: ${theme.spacing(1.5)};
      }
      
      &.MuiSwipe-right {
        right: ${theme.spacing(1.5)};
      }
  `
);

const SwiperWrapper = styled(Box)(
  ({ theme }) => `
      .swiper-pagination {
        .swiper-pagination-bullet {
          background: ${theme.palette.primary.main};
          opacity: 1;
  
          &.swiper-pagination-bullet-active {
            background: ${theme.palette.primary.main};
            width: 16px;
            border-radius: 6px;
          }
        }
      }
  `
);
const Block4 = () => {
  const navigate = useNavigate();
  const people = [0, 1, 2, 3];
  const theme = useTheme();
  return (
    <>
      <Card sx={{ background: grey, height: 525, position: 'relative' }}>
        <Box p={2} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h4"> Total Brokers</Typography>
            <Typography color={darkslategray} variant="h3">
              521
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
                width: '155px'
              }}
            >
              <CircularProgressbarWithChildren
                circleRatio={1}
                styles={buildStyles({
                  rotation: 1 / 2.2 + 1 / 5.85,
                  trailColor: trailGreyColor,
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
                  <Typography
                    variant="h5">
                    {` Your Brokers`}
                  </Typography>
                </Box>

                <Typography
                  variant="h3"
                >
                  124
                </Typography>
              </CircularProgressbarWithChildren>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
              Top Channel Partners of this project
            </Typography>
          </Box>
          <Box mt={1}>
            <SwiperWrapper
              sx={{
                mx: 'auto',
                maxWidth: 500,
                position: 'relative',
                py: 2,
                px: { xs: 2, sm: 8 }
              }}
            >
              <Swiper
                spaceBetween={500}
                slidesPerView={1}
                loop
                navigation={{
                  nextEl: '.MuiSwipe-right',
                  prevEl: '.MuiSwipe-left'
                }}
                pagination={{ dynamicBullets: true, clickable: true }}
              >
                {people.map((item) => {
                  return (
                    <React.Fragment key={item}>
                      <SwiperSlide>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Avatar
                            sx={{
                              width: 84,
                              height: 84
                            }}
                            alt="Remy Sharp"
                            src="/static/images/avatars/3.jpg"
                          />
                          <Typography
                            sx={{
                              pt: 1,
                              color: theme.palette.primary.dark
                            }}
                            gutterBottom
                            variant="subtitle2"
                          >
                            {`Remy Sharp ${item}`}
                          </Typography>
                          <Box p={1.5}> </Box>
                        </Box>
                      </SwiperSlide>
                    </React.Fragment>
                  );
                })}
              </Swiper>
              <SwipeIndicator className="MuiSwipe-root MuiSwipe-left">
                <ChevronLeftTwoToneIcon />
              </SwipeIndicator>
              <SwipeIndicator className="MuiSwipe-root MuiSwipe-right">
                <ChevronRightTwoToneIcon />
              </SwipeIndicator>
            </SwiperWrapper>
          </Box>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <Divider />
          <Box
            my={2}
            px={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Link href="/channel_partners">View All Brokers</Link>
            <AvatarWrapper
              onClick={() => {
                navigate('/channel_partners');
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
export default Block4;
