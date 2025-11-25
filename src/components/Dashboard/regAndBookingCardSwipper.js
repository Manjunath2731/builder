
import React from 'react';
import 'react-slideshow-image/dist/styles.css';

import {
  Box,
  styled
} from '@mui/material';

import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import MeetingCard from '../../content/meetings-n-visits/meetingCard.js';
import {
  renderDate
} from '../../content/meetings-n-visits/commanFunctions';
import { toUpperMutliple } from '../../utils/utilits';

SwiperCore.use([Navigation, Pagination]);

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

const RegAndBookingCardSwipper = ({req,type}) => {
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
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ dynamicBullets: true, clickable: false }}
      >
        {req?.map((item, index) => {
          let { client, meetingDate, project,metaData } = item;
          return (
            <React.Fragment key={index}>
              <SwiperSlide>
                <Box>
                  <MeetingCard
                    mainText={toUpperMutliple(client?.name)}
                    description={`${toUpperMutliple(project?.name)} - ${toUpperMutliple(metaData?.projectSubType)}`}
                    dateTime={renderDate(meetingDate)}
                    data={item}
                    type={type}
                    style={{width:"100%"}}
                  />
                </Box>
              </SwiperSlide>
            </React.Fragment>
          );
        })}
      </Swiper>
    </SwiperWrapper>
  </>
  )
}

export default RegAndBookingCardSwipper