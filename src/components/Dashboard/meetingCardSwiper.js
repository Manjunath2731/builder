import React from 'react';
import 'react-slideshow-image/dist/styles.css';
import {
  Box,
  IconButton,
  styled
} from '@mui/material';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import MeetingCard from '../../content/meetings-n-visits/meetingCard.js';
import {
  toUpper,
  renderDate
} from '../../content/meetings-n-visits/commanFunctions';

SwiperCore.use([Navigation, Pagination]);

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
        margin-bottom: ${theme.spacing(1.5)};
        border-radius: 100px;

        &:hover {
          color: ${theme.palette.primary.main};
          background: ${theme.colors.alpha.trueWhite[100]};
        }

        &.MuiSwipe-left-card {
          left: ${theme.spacing(1.5)};
        }

        &.MuiSwipe-right-card {
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
const MeetingCardSwiper = ({ meetings, projects,type }) => {
  const getProjectName = (id) => {

    let projectName = projects.filter((item) => item._id === id);
    return projectName[0]?.name || '';
  };
  return (
    <>
      <SwiperWrapper
        id="meetingCardSwiper"
        sx={{
          mx: 'auto',
          maxWidth: '100%',
          minWidth: '100%',
          position: 'relative',
          py: 0
        }}
      >
        <Swiper
          spaceBetween={40}
          slidesPerView={1}
          pagination={{ dynamicBullets: true, clickable: false }}
        >
          {meetings?.map((item, index) => {
            let { organizer, meetingDate, projectId } = item;
            return (
              <React.Fragment key={index}>
                <SwiperSlide>
                  <Box>
                    <MeetingCard
                      mainText={toUpper(organizer?.name)}
                      description={getProjectName(projectId)}
                      dateTime={renderDate(meetingDate)}
                      data={item}
                      type={type}
                    />
                  </Box>
                </SwiperSlide>
              </React.Fragment>
            );
          })}
        </Swiper>
        <SwipeIndicator
          className="MuiSwipe-root MuiSwipe-left-card"
          key="meetingCardSwiper"
        >
          <ChevronLeftTwoToneIcon />
        </SwipeIndicator>
        <SwipeIndicator
          className="MuiSwipe-root MuiSwipe-right-card"
          key="meetingCardSwiper"
        >
          <ChevronRightTwoToneIcon />
        </SwipeIndicator>
      </SwiperWrapper>
    </>
  );
};
export default MeetingCardSwiper;
