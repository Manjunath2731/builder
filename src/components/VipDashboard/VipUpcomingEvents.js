import React, { useState } from 'react';
import moment from 'moment';
import { Card, Box, Typography, Divider, useTheme, Grid, styled } from '@mui/material';
import Chart from 'react-apexcharts';
import "./Vip.css";

// import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
// import { useDispatch,  } from 'react-redux';

const BoxLegend = styled('span')(
          ({ theme }) => `
         
         width: ${theme.spacing(1.5)};
         height: ${theme.spacing(1.5)};
         display: inline-block;
         margin-right: ${theme.spacing(0.5)};
         `
);

const VipUpcomingEvents = () => {

          //   const dispatch = useDispatch();
          const theme = useTheme();
          const mockEvents = [
                    {
                              title: 'Sample Event 1',
                              eventTime: {
                                        startTime: '2023-09-01T10:00:00',
                                        endTime: '2023-09-01T12:00:00',
                              },
                              totalAccepted: 25,
                              totalRejected: 10,
                              totalMayBe: 5,
                              totalNoReply: 20,
                    },
          ];

          const [events, setEvents] = useState(mockEvents);
          console.log("setevents", setEvents)

          //   const filterEvent = (eventsArray) => {
          //           let UpcomingEvents = [];
          //           eventsArray?.map((item) => {
          //             const { eventTime } = item;
          //             if (compareAsc(new Date(eventTime.endTime), new Date()) !== -1) {
          //               UpcomingEvents.push(item);
          //             }
          //             return item;
          //           });

          //           setEvents(UpcomingEvents);
          //         };

          const expenses = {
                    datasets: [
                              {
                                        backgroundColor: ['#00C45F', '#F3512F', '#FFD352', '#B8D3BB']
                              }
                    ],
                    text: '425',
                    labels: ['Accepted', 'Rejected', 'Maybe', 'No Response']
          };

          const chartOptions = {
                    chart: {
                              background: 'transparent',
                              stacked: false,
                              toolbar: {
                                        show: false
                              }
                    },
                    plotOptions: {
                              pie: {
                                        donut: {
                                                  size: '76%',
                                                  labels: {
                                                            show: true,
                                                            total: {
                                                              show: true,
                                                              label: 'Current Attendees',
                                                              color: theme.palette.text.primary, 
                                                              fontSize: '10px', 
                                                              fontWeight: 'bold', 
                                                              width:"5%"
                                                              
                                                            }
                                                          }
                                        }
                              }
                    },
                    colors: [
                              '#00C45F', '#F3512F', '#FFD352', '#B8D3BB'
                    ],
                    dataLabels: {
                              enabled: false,
                              formatter(val) {
                                        return `${val}%`;
                              },
                              dropShadow: {
                                        enabled: true,
                                        top: 1,
                                        left: 1,
                                        blur: 0.5,
                                        color: theme.colors.alpha.black[50],
                                        opacity: 1
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

          const chartSeries = [
                    events[0]?.totalAccepted || 0,
                    events[0]?.totalRejected || 0,
                    events[0]?.totalMayBe || 0,
                    events[0]?.totalNoReply || 0
          ];


          return (
                    <Box sx={{ py: 2 }} id="bookings">

                              <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>UPCOMING EVENT</Typography>
                              <Card sx={{ mt: 1 }} >
                                        <Box style={{ display: 'flex', flexDirection: 'row' }}>
                                                  <Box py={4} id="VipUpcoming">
                                                            <Box >
                                                                      <Typography sx={{ fontSize: "13px", fontWeight: 700, textAlign: 'center', color: "#00B055" }}> Upcoming Events</Typography>

                                                                      <Box px={6} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} id="VipEventsAll">
                                                                                <Typography sx={{ fontSize: "22px", fontWeight: "bold", color: "#00B055", mt: 3.5 }}id="Event-No"> 56</Typography>
                                                                                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#00B055", mt: 3.5,textDecoration: "underline" }} id="Event-All">View All</Typography>

                                                                      </Box>
                                                            </Box>
                                                  </Box>



                                                  <Divider orientation="vertical" flexItem />
                                                  <Box sx={{ py: 2 }} px={5}  id="vipChart">


                                                            {events.length ? (
                                                                      <Box
                                                                                sx={{
                                                                                          display: 'flex',
                                                                                          justifyContent: 'flex-start',
                                                                                          alignItems: 'center',
                                                                                          // width: '100%'
                                                                                }}
                                                                      >


                                                                                <Box
                                                                                          sx={{ display: 'flex', flexDirection: 'column' }}
                                                                                >
                                                                                          <Box sx={{width:"20%"}}>
                                                                                          <Typography sx={{
                                                                                                    backgroundColor: "#FFBE00", fontSize: "11px",    width: "fit-content",
                                                                                                    height: "auto",
                                                                                                    borderRadius: "15px",
                                                                                                    textAlign: "center",
                                                                                                    paddingRight: "10px",
                                                                                                    paddingLeft: "10px",fontWeight:"bold"
                                                                                          }}> ONGOING...</Typography>
                                                                                          </Box>
                                                                                         
                                                                                          <Typography>{events[0]?.title}</Typography>
                                                                                          <Typography mb={2} style={{ fontSize: '12px' }}>
                                                                                                    {moment(events[0]?.eventTime?.startTime).format(
                                                                                                              'MMMM Do YYYY'
                                                                                                    )}
                                                                                                    , at{' '}
                                                                                                    {moment(events[0]?.eventTime?.startTime).format(
                                                                                                              'h:mm a'
                                                                                                    )}{' '}
                                                                                                    to{' '}
                                                                                                    {moment(events[0]?.eventTime?.endTime).format(
                                                                                                              ' h:mm a'
                                                                                                    )}
                                                                                          </Typography>
                                                                                          <Grid container spacing={0.2}>
                                                                                                    {expenses.labels.map((label, i) => (
                                                                                                              <Grid item xs={6}>
                                                                                                                        <Typography id="text"
                                                                                                                                  key={label}
                                                                                                                                  variant="body2"
                                                                                                                                  sx={{
                                                                                                                                            py: 0.5,
                                                                                                                                            display: 'flex',
                                                                                                                                            alignItems: 'center',
                                                                                                                                            columnGap: 0.5
                                                                                                                                  }}
                                                                                                                        >
                                                                                                                                  <BoxLegend
                                                                                                                                            style={{
                                                                                                                                                      background: `${expenses.datasets[0].backgroundColor[i]}`,
                                                                                                                                                      fontSize: '0.9em'
                                                                                                                                            }}
                                                                                                                                  />
                                                                                                                                  {label}: {chartSeries[i]}
                                                                                                                        </Typography>
                                                                                                              </Grid>
                                                                                                    ))}
                                                                                          </Grid>
                                                                                </Box>
                                                                                <Box px={5} id="VipCharts">
                                                                                          <Box style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} id="chart">
                                                                                                    <Typography sx={{fontSize:"11px"}} id="chart-upd">
                                                                                                              (Last Updated : 2mins ago )
                                                                                                    </Typography>
                                                                                                    <Box sx={{mt:2}}>
                                                                                          <Chart id="charts"
                                                                                                    height={155}
                                                                                                    options={chartOptions}
                                                                                                    series={chartSeries}
                                                                                                    type="donut"
                                                                                          />
                                                                                          </Box>
                                                                                          </Box>
                                                                                </Box>
                                                                      </Box>
                                                            ) : (
                                                                      <Box
                                                                                sx={{
                                                                                          display: 'flex',
                                                                                          justifyContent: 'center',
                                                                                          alignItems: 'center',
                                                                                          width: '100%',
                                                                                          py: 10
                                                                                }}
                                                                      >
                                                                                <Typography variant="h4">
                                                                                          No Upcoming Events{' '}
                                                                                </Typography>
                                                                      </Box>
                                                            )}
                                                  </Box>
                                        </Box>
                              </Card>
                    </Box>
          );
}

export default VipUpcomingEvents;