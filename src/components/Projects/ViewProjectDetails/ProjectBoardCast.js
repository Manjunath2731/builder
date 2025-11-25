import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import Loader from 'src/UI/Loader/Loader.js';
import {
  Grid,
  Box,
  Typography,
  // Divider,
  CardMedia,
  useTheme,
  Divider
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import NotificationDrawer from '../ViewProjectDetails/Blocks/NotificationDrawer';
import BroadCastFilterCard from './Blocks/BroadCastFilterCard.js';
import { getProjectById } from '../../../slices/ProjectList';
// import Block2 from './Blocks/Block2';
// import Block3 from './Blocks/Block3';
// import Block4 from './Blocks/Block4';
import ProjectSideBar from './Blocks/ProjectSideBar';
import FeedCard from './Blocks/FeedCard';
// import NotificationBar from './Blocks/NotificationBar';
import BasicInfo from '../ViewProjectDetails/ProjectDetailScreens/BasicInfo';
import ProjectBrief from '../ViewProjectDetails/ProjectDetailScreens/ProjectBrief';
import ProjectMedia from '../ViewProjectDetails/ProjectDetailScreens/ProjectMedia';
import PlanLayout from '../ViewProjectDetails/ProjectDetailScreens/PlanLayout';
import PaymentPlans from '../ViewProjectDetails/ProjectDetailScreens/PaymentPlans';
import ApprovedBank from '../ViewProjectDetails/ProjectDetailScreens/ApprovedBank';
import ArchitectConsultants from '../ViewProjectDetails/ProjectDetailScreens/ArchitectConsultants';
import Pricing from '../ViewProjectDetails/ProjectDetailScreens/Pricing';
import Specifications from '../ViewProjectDetails/ProjectDetailScreens/Specifications';
import BookingInfo from '../ViewProjectDetails/ProjectDetailScreens/BookingInfo';
import ProjectTeam from '../ViewProjectDetails/ProjectDetailScreens/ProjectTeam';
import CRMTeam from '../ViewProjectDetails/ProjectDetailScreens/CRMTeam';
import YourChannelProject from './CompleteDetails/YourChannelProject';
import YourProjectNotification from './CompleteDetails/YourProjectNotification';
import YourProjectVists from './CompleteDetails/YourProjectVists';
import YourProjectRegistrations from './CompleteDetails/YourProjectRegistration';
import YourProjectBookings from './CompleteDetails/YourProjectBooking';

SwiperCore.use([Navigation, Pagination]);

const ViewProjectDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const { selectedTab } = useParams();
  const [project, setProject] = useState({});
  const [broadCast, setBroadCast] = useState([]);
  const [broadCastLength, setBroadCastLength] = useState(0);
  const [selectedCard, setSelectedCard] = useState('ALL_BROADCAST');
  let projectData = useSelector((state) => state.projectList.projectByIdData);
  console.log("projectDataaaaaaaaaaaaaaaaaaaaa",projectData)
  let broadcast = useSelector(
    (state) => state.projectList.BroadCastByProjectId
  );
  let eventData = useSelector((state) => state.projectList.projectEvent);
  let clientVisitData = useSelector(
    (state) => state.projectList.projectClientVisit
  );
  const handleCardChange = (card) => {
    setSelectedCard(card);

    if (card === "ALL_BROADCAST") {
      const allValues = [];
      const keys = Object.keys(broadcast);
      keys.forEach((key) => {
        allValues.push(...broadcast[key]);
        
      });
      console.log("allValues",allValues)
      setBroadCast(allValues);
    } else {
      setBroadCast(broadcast[card]);
    }

  };
  console.log("broadcast", broadCast);


  console.log("broadcast", broadCast);


  const getLength = (broadcast, type) => {
    // if(selectedCard === 'ALL_BROADCAST'){
    //   return broadCast.length
    // }
    let length = broadcast[type]?.length ? broadcast[type]?.length : 0;
    return length;
  };
  const broadcastList = [
    {
      value: 'ALL_BROADCAST'
    },
    {
      value: 'GENERAL_UPDATES'
    },
    {
      value: 'OFFER_BROKERS'
    },
    {
      value: 'OFFER_BUYERS'
    },
    {
      value: 'PROJECT_UPDATES'
    },
    {
      value: 'EVENTS_POLLS'
    },
    {
      value: 'ADD_NEW '
    }
  ];

  useEffect(() => {
    if (!_.isEmpty(projectData)) {
      document
        .getElementById('project-info')
        .scrollIntoView({ behavior: 'smooth' });
    }
    dispatch(getProjectById(projectId));
  }, []);
  useEffect(() => {
    if (!_.isEmpty(projectData)) {
      document
        .getElementById('project-info')
        .scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTab]);

  useEffect(() => {
    const allValues = [];
    const keys = Object.keys(broadcast);
    keys.forEach((key) => {
      allValues.push(...broadcast[key]);
      
    });
    setBroadCastLength(allValues.length)
    let all = {
      ...broadcast, ALL_BROADCAST: allValues,
    };
     
    setBroadCast(all[selectedCard]);

    setProject(projectData);

  }, [projectData, broadcast, eventData, clientVisitData]);

  if (_.isEmpty(projectData)) {
    return <Loader />;
  }
  console.log("edw", projectData.projectType)
  return (
    <Box pl={1} pr={0} ml="30px">
      {/* <Box display="flex" alignItems="center" justifyContent="space-between"> */}


      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2, }}>
        <Box display={{ md: 'none' }}>
          <NotificationDrawer>
            <Box
              sx={{
                backgroundColor: `${theme.colors.primary.lighter}`,
                height: '100%'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  right: 0,
                  zIndex: 999,
                  width: 400
                }}
              >
                <YourProjectNotification />
              </Box>
            </Box>
          </NotificationDrawer>
        </Box>
      </Box>
      {/* </Box> */}


      {/* <Divider /> */}
      <Grid container>
        <Grid item xs={12} md={9}>
          <Grid
            sx={{
              pr: 4,
              pl: { xs: 4, lg: 0 },
            }}
            container
            spacing={4}
          >

            <Grid item xs={12}>

              <Box
                py={2}
                display="flex"
                alignItems="center"
                justifyContent="flex-start"

                onClick={() => {
                  navigate('/projects');
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" sx={{ color: "#3593EC", cursor: "pointer", ml: -0.8 }} />
                <Typography sx={{ ml: 2, fontSize: "14px", fontWeight: "bold" }}>
                  {project?.projectType?.toUpperCase()} PROJECTS
                </Typography>
              </Box>
              <Box
                sx={{ mt: -3 }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <Typography sx={{ fontSize: "20px", fontWeight: 600 }} >{project?.name} </Typography>
                  <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#969696", mt: 0.8, ml: 1 }} >- {project?.reraNumber?.[0]?.reraValue}</Typography>
                </Box>

                <Box>
                  <CardMedia
                    component="img"
                    image={project?.logo}
                    alt="..."
                    sx={{
                      width: 120,
                      height: 74,
                      objectFit: 'fill'
                    }}
                  />
                </Box>
              </Box>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <YourChannelProject />
              </Box>
            </Grid>
            <Grid item xs={12} lg={4} xl={4} sx={{ mt: -2 }}>
              <YourProjectVists />
            </Grid>
            <Grid item xs={12} lg={4} xl={4} sx={{ mt: -2 }}>
              <YourProjectRegistrations />
            </Grid>
            <Grid item xs={12} lg={4} xl={4} sx={{ mt: -2 }}>
              <YourProjectBookings />
            </Grid>

            {/* <Grid item xs={12} lg={4} xl={4}>
              <Block2 data={projectDetail} />
            </Grid>
            <Grid item xs={12} lg={4} xl={4}>
              <Block3
                projectDetails={project}
                data={projectDetail}
                isDashboard={false}
                upcomingClientVisit={upcomingClientVisit}
              />
            </Grid>
            <Grid item xs={12} lg={4} xl={4}>
              <Block4 />
            </Grid> */}
            <Grid item xs={12} id="project-info">
              <Grid container spacing={2}>
                <Grid item xs={2.5}>
                  <ProjectSideBar projectType={projectData.projectType === 'pvtbuilder'} />
                </Grid>
                {!_.isEmpty(project) && (
                  <Grid item xs={9.5}>
                    {selectedTab === 'project_broadcasts' && (
                      <>
                        <Box my={1}>
                          <Box>
                            <Swiper
                              spaceBetween={100}
                              slidesPerView={1}
                              breakpoints={{
                                500: {
                                  slidesPerView: 3,
                                  spaceBetween: 0
                                },
                                768: {
                                  slidesPerView: 3,
                                  spaceBetween: 50
                                },
                                1200: {
                                  slidesPerView: 3,
                                  spaceBetween: 0
                                },
                                1300: {
                                  slidesPerView: 4,
                                  spaceBetween: 0
                                },
                                1400: {
                                  slidesPerView: 4,
                                  spaceBetween: 0
                                },
                                1500: {
                                  slidesPerView: 5,
                                  spaceBetween: 0
                                },
                                1600: {
                                  slidesPerView: 5,
                                  spaceBetween: 0
                                },
                                1700: {
                                  slidesPerView: 6,
                                  spaceBetween: 0
                                },

                                2000: {
                                  slidesPerView: 6,
                                  spaceBetween: 0
                                }
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'flex-start',


                                }}
                              >
                                {broadcastList.map((item, index) => {
                                  return (
                                    <React.Fragment key={index}>
                                      <SwiperSlide>
                                        <BroadCastFilterCard
                                          mainText={item?.value}
                                          count={item.value === 'ALL_BROADCAST'?broadCastLength:
                                            getLength(
                                            broadcast,
                                            item?.value
                                          )}
                                          handleCardChange={handleCardChange}
                                          selectedCard={selectedCard}
                                          icon={'icon' in item && item?.icon}
                                        />
                                      </SwiperSlide>
                                    </React.Fragment>
                                  );
                                })}
                              </Box>
                            </Swiper>
                          </Box>
                        </Box>
                        <Box mt={3} height="100%">
                          {_.isEmpty(broadCast) && (
                            <>
                              <Box
                                height="100%"
                                display="flex"
                                justifyContent="center"
                                textAlign="center "
                              >
                                <Typography
                                  variant="h3"
                                  pt={10}
                                  sx={{ color: theme.palette.grey[500] }}
                                  textAlign="center"
                                >
                                  No Broadcast To Show
                                </Typography>
                              </Box>
                            </>
                          )}
                          {broadCast?.map((item, index) => {
                            return (
                              <Grid item xs={12} key={index}>
                                <FeedCard item={item} />
                              </Grid>
                            );
                          })}
                        </Box>
                      </>
                    )}
                    {selectedTab === 'basic_info' && (
                      <>
                        <Grid item xs={12}>
                          <BasicInfo
                            titleName="Project Info"
                            project={project}
                            formName="basic_info"
                          />
                        </Grid>
                      </>
                    )}
                    {selectedTab === 'about_project' && (
                      <>
                        <Grid item xs={12}>
                          <ProjectBrief
                            titleName="About Project"
                            project={project}
                            formName="about_project"
                          />
                        </Grid>
                      </>
                    )}
                    {selectedTab === 'project_media' && (
                      <>
                        <Grid item xs={12}>
                          <ProjectMedia
                            titleName="Project Media"
                            formName="project_media"
                            project={project}
                          />
                        </Grid>
                      </>
                    )}
                    {selectedTab === 'plan_layout' && (
                      <>
                        <Grid item xs={12}>
                          <PlanLayout
                            titleName="Plan Layout"
                            project={project}
                            formName="plan_layout"
                          />
                        </Grid>
                      </>
                    )}
                    {projectData?.projectType !== 'pvtbuilder' && selectedTab === 'payment_plans' && (
                      <>
                      <Grid item xs={12}>
                          <PaymentPlans
                            titleName="Payment Plans"
                            project={project}
                            formName="payment_plans"
                          />
                        </Grid>

                      
                      </>
                    )}
                    {projectData?.projectType !== 'pvtbuilder' && selectedTab === 'approved_banks' && (
                      <>
                        <Grid item xs={12}>
                          <ApprovedBank
                            titleName="Approved Banks"
                            project={project}
                            formName="approved_banks"
                          />
                        </Grid>
                      </>
                    )}
                    {selectedTab === 'architect_&_consultants' && (
                      <>
                        <Grid item xs={12}>
                          <ArchitectConsultants
                            titleName="Architect & Consultants"
                            project={project}
                            formName="architect_&_consultants"
                          />
                        </Grid>
                      </>
                    )}
                    {selectedTab === 'pricing' && (
                      <>
                        <Grid item xs={12}>
                          <Pricing
                            titleName="Pricing"
                            project={project}
                            formName="pricing"
                          />
                        </Grid>
                      </>
                    )}
                    {selectedTab === 'specifications' && (
                      <>
                        <Grid item xs={12}>
                          <Specifications
                            titleName="Project Specifications"
                            project={project}
                            formName="about_project"
                          />
                        </Grid>
                      </>
                    )}
                    {projectData?.projectType !== 'pvtbuilder' && selectedTab === 'booking_info' && (
                      <>
                        <Grid item xs={12}>
                          <BookingInfo
                            titleName="Booking Information"
                            project={project}
                            formName="booking_info"
                          />
                        </Grid>
                      </>
                    )}
                    {selectedTab === 'project_team' && (
                      <>
                        <Grid item xs={12}>
                          <ProjectTeam
                            titleName="Project Team"
                            project={project}
                          // formName="approved_banks"
                          />
                        </Grid>
                      </>
                    )}
                    {selectedTab === 'crm_team' && (
                      <>
                        <Grid item xs={12}>
                          <CRMTeam
                            titleName="CRM Team"
                            project={project}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box item component={Grid} display={{ xs: 'none', md: 'block' }} md={3}>

          <Box sx={{
            height: '100%'
          }}>
            <YourProjectNotification />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};
export default ViewProjectDetails;
