import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  styled,
  useTheme,
  IconButton,
  Grid
} from '@mui/material';
import Chart from 'react-apexcharts';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

SwiperCore.use([Navigation, Pagination]);

const grey = '#ebebeb';
const dusty = '#e0e0e0';

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
      margin-top: ${theme.spacing(-5.5)};
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
const ChartLegends = ({ title, num, percentile }) => {
  const theme = useTheme();
  return (
    <Box py={2}>
      <Typography>{title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography
          sx={{
            mr: 2,
            fontSize: `${theme.typography.pxToRem(19)}`,
            color: theme.palette.primary.dark,
            fontWeight: 'bold'
          }}
        >
          {num}
        </Typography>
        <Typography
          sx={{
            fontSize: `${theme.typography.pxToRem(13)}`,
            color: theme.palette.grey[700],
            fontWeight: 'bold'
          }}
        >
          {percentile} %
        </Typography>
      </Box>
    </Box>
  );
};
const TotalBrokerCard = ({
  channelPartners,
  channelPartnersType,
  topBrokerListState
}) => {
  const [type, setType] = useState('topChannelPartner');
  const theme = useTheme();
  const expenses = {
    datasets: [
      {
        backgroundColor: ['##00427f', '#0070dc', '#55abfb', '#d1d6da']
      }
    ],
    labels: ['Platnium ', 'Gold ', 'Diamond ', 'Silver ']
  };

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: true,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,

            total: {
              show: true,
              label: 'Total',
              color: theme.colors.alpha.black[100],
              fontWeight: 'bold'
            }
          }
        }
      }
    },
    colors: ['#00427f', '#0070dc', '#55abfb', '#d1d6da'],
    dataLabels: {
      enabled: false,
      formatter(val) {
        return `${val}%`;
      },
      dropShadow: {
        enabled: false,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },

    labels: expenses.labels,
    legend: {
      labels: {
        colors: theme.colors.alpha.black[100]
      },
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };
  let { diamondPartner, goldPartner, platinumPartner, silverPartner } =
    channelPartnersType;
  const chartSeries = [
    platinumPartner?.value,
    goldPartner?.value,
    diamondPartner?.value,
    silverPartner?.value
  ];

  return (
    <>
      <Card sx={{ marginBottom: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={12} md={7} lg={6} sx={{ background: grey }}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid
                  xs={12}
                  sm={3}
                  md={3}
                  lg={3}
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}
                  >
                    <ChartLegends
                      title="Diamond Partners"
                      num={diamondPartner?.value}
                      percentile={diamondPartner?.percent}
                    />
                    <ChartLegends
                      title="Platnium Partners"
                      num={platinumPartner?.value}
                      percentile={platinumPartner?.percent}
                    />
                  </Box>
                </Grid>
                <Grid
                  xs={12}
                  sm={5}
                  md={6}
                  lg={6}
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Chart
                    height={220}
                    options={chartOptions}
                    series={chartSeries}
                    type="donut"
                  />
                </Grid>
                <Grid
                  xs={12}
                  sm={3}
                  md={3}
                  lg={3}
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}
                  >
                    {' '}
                    <ChartLegends
                      title="Gold Partners"
                      num={goldPartner?.value}
                      percentile={goldPartner?.percent}
                    />
                    <ChartLegends
                      title="Silver Partners"
                      num={silverPartner?.value}
                      percentile={silverPartner?.percent}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={6} sx={{ background: dusty }}>
            <Box py={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', lg: 'column', xl: 'row' },
                  justifyContent: {
                    xs: 'space-between',
                    lg: 'flex-start',
                    xl: 'space-between'
                  }
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: `${theme.typography.pxToRem(15)}`,
                      mb: 2,
                      ml: 4
                    }}
                    variant="h4"
                  >
                    CHANNEL PARTNERS
                  </Typography>
                </Box>
                <Box sx={{ ml: { xs: 0, lg: 4, xl: 0 }, mr: 3, mt: -1 }}>
                  <FormControl fullWidth variant="outlined">
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value);
                      }}
                    >
                      <FormControlLabel
                        value="topChannelPartner"
                        control={<Radio />}
                        label="Top Partner"
                      />
                      <FormControlLabel
                        value="newChannelPartner"
                        control={<Radio />}
                        label="New Partner"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Box>
              <SwiperWrapper
                sx={{
                  mx: 'auto',
                  maxWidth: '100%',
                  position: 'relative',
                  py: 1.5,
                  px: { xs: 1, sm: 8 }
                }}
              >
                <Swiper
                  spaceBetween={500}
                  slidesPerView={1}
                  navigation={{
                    nextEl: '.MuiSwipe-right',
                    prevEl: '.MuiSwipe-left'
                  }}
                  breakpoints={{
                    576: {
                      slidesPerView: 3,
                      spaceBetween: 0
                    },
                    800: {
                      slidesPerView: 2,
                      spaceBetween: 0
                    },
                    1200: {
                      slidesPerView: 3,
                      spaceBetween: 0
                    },
                    1400: {
                      slidesPerView: 3,
                      spaceBetween: 0
                    },
                    1600: {
                      slidesPerView: 4,
                      spaceBetween: 0
                    },
                    1900: {
                      slidesPerView: 5,
                      spaceBetween: 0
                    }
                  }}
                  pagination={{ dynamicBullets: true, clickable: true }}
                >
                  {type === 'topChannelPartner' &&
                    channelPartners.map((item) => {
                      return (
                        <React.Fragment key={item?._id}>
                          <SwiperSlide>
                            <Box
                              px={3}
                              pb={3}
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Avatar
                                sx={{
                                  width: 88,
                                  height: 88,
                                  border: ' 8px solid #f0f0f0'
                                }}
                                alt="Remy Sharp"
                                src={item?.profilePic}
                              />
                              <Typography
                                sx={{
                                  pt: 1,
                                  color: theme.palette.primary.dark,
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis'
                                }}
                                gutterBottom
                                variant="subtitle2"
                              >
                                {item?.name}
                              </Typography>
                            </Box>
                          </SwiperSlide>
                        </React.Fragment>
                      );
                    })}
                  {type === 'newChannelPartner' &&
                    topBrokerListState.map((item) => {
                      return (
                        <React.Fragment key={item?._id}>
                          <SwiperSlide>
                            <Box
                              px={3}
                              pb={3}
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Avatar
                                sx={{
                                  width: 88,
                                  height: 88,
                                  border: ' 8px solid #f0f0f0'
                                }}
                                alt="Remy Sharp"
                                src={item?.profile_image}
                              />
                              <Typography
                                sx={{
                                  pt: 1,
                                  color: theme.palette.primary.dark,
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis'
                                }}
                                gutterBottom
                                variant="subtitle2"
                              >
                                {`${item?.first_name} ${
                                  item?.last_name ? item?.last_name : ''
                                }`}
                              </Typography>
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
          </Grid>
        </Grid>
      </Card>
    </>
  );
};
export default TotalBrokerCard;
