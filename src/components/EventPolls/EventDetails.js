import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { compareAsc } from 'date-fns';
import {
  Grid,
  Box,
  Tab,
  Tabs,
  Button,
  Card,
  alpha,
  styled,
  InputBase,
  useTheme,
  CardMedia,
  Typography
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Loader from 'src/UI/Loader/Loader.js';
import { getEventById } from '../../axiosInstances/Api';
import { getAllBrokers } from '../../slices/Events';
import PeopleCard from './PeopleCard';
import Invite from './InviteScreen';

export const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      border-radius: 8px;
      z-index: 5;
      box-shadow: 
      0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
      0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
      0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
      0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
    `
);
export const SearchInputWrapper = styled(InputBase)(
  ({ theme }) => `
      font-size: ${theme.typography.pxToRem(18)};
      height: 60px;
      width: 100%;
  `
);

const EventDetails = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { eventId } = useParams();
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [invite, setInvite] = useState(false);
  const [tempBrokers, setTempBrokers] = useState([]);
  const [eventDetail, setEventDetail] = useState({});
  const [invitees, setInvitees] = useState([]);
  const tabs = [
    { label: 'Attending', value: 'attending' },
    { label: 'Maybe', value: 'maybe' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'No Reply', value: 'noReply' }
  ];
  const [currentTab, setCurrentTab] = useState(tabs[0]?.value);
  const handleTabChange = (_event, value) => {
    let TabFiltered = invitees?.filter((item) => item.status === value);
    setTempBrokers(TabFiltered);
    setCurrentTab(value);
  };
  const navigate = useNavigate();
  const userData = JSON.parse(window.localStorage.getItem('user'));
  const handleSearchChange = async (event) => {
    event.preventDefault();

    if (event.target.value === '') {
      let TabFiltered = invitees?.filter((item) => item.status === currentTab);
      setTempBrokers(TabFiltered);
      setSearchValue('');
    } else {
      setSearchValue(event.target.value);
      filterWorkOrders(event.target.value);
    }
  };
  const filterWorkOrders = (key = '') => {
    const searchKey = key.toLowerCase();
    const filteredData = tempBrokers.filter((el) => {
      if (el.name?.toLowerCase().indexOf(searchKey) !== -1) {
        return true;
      }
      return false;
    });
    setTempBrokers(filteredData);
  };
  const isPast = (eventDetail) => {
    const { eventTime } = eventDetail;
    if (compareAsc(new Date(eventTime?.endTime), new Date()) === -1) {
      return true;
    }
    return false;
  };
  const renderDate = (object) => {
    let dateStart = new Date(object?.eventTime?.startTime).toLocaleDateString(
      'en-us',
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }
    );
    let dateEnd = new Date(object?.eventTime?.startTime).toLocaleDateString(
      'en-us',
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }
    );
    let Starttime = getTime(object?.eventTime?.startTime);
    let endtime = getTime(object?.eventTime?.endTime);
    return `${dateStart} , at ${Starttime} to ${dateEnd} ,at ${endtime}`;
  };
  const getTime = (date) => {
    return new Date(date).toLocaleTimeString('en-us', {
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  useEffect(() => {
    dispatch(getAllBrokers(userData?.userId));
    setLoading(true);
    getEventById(eventId).then((result) => {
      setEventDetail(result);
      setInvitees(result?.invitees);
      let FilterBrokers = result?.invitees.filter(
        (item) => item.status === currentTab
      );
      setTempBrokers(FilterBrokers);
      setLoading(false);
    });
  }, []);
  console.log(eventDetail?.venue?.geoLocation)
  return (
    <>
      {!invite ? (
        <>
          <Box sx={{ ml: 4, pt: 4, pl: { xs: 5, lg: 0 }, pr: { xs: 5, md: 7 } }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              mt={2}
              mb={4}
              columnGap={1}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                sx={{ cursor: 'pointer' }}
                color={theme.palette.primary.main}
                onClick={() => {
                  navigate(`/events_polls`);
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
                <Typography
                  variant="h4"
                  sx={{ fontSize: `${theme.typography.pxToRem(15)}` }}
                >
                  {isPast(eventDetail)
                    ? 'PAST EVENTS '
                    : 'UPCOMING EVENTS '}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ color: '#b2b2b3' }}
              >{` / ${eventDetail.title}`}</Typography>
            </Box>
            <Box>
              {loading ? (
                <Loader />
              ) : (
                <Grid container columnSpacing={3} rowSpacing={5}>
                  <Grid item xs={12} md={4}>
                    <CardWrapper
                      minwidth={640}
                      maxwidth={740}
                      sx={{
                        height: 500,

                        mr: { xs: 0, md: 3 }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="100%"
                        width="auto"
                        sx={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          left: 0,
                          top: 0,
                          borderRadius: 'inherit',
                          zIndex: 5
                        }}
                        image={eventDetail.eventInviteDoc}
                        alt="..."
                      />
                    </CardWrapper>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderBottom: 1,
                          borderColor: 'divider',
                          mb: 2
                        }}
                      >
                        <Typography variant="h3">
                          Event Details
                        </Typography>
                      </Box>
                      <Box mt={2}>
                        <Typography variant="h4" mt={2}>
                          {eventDetail.title || ''}
                        </Typography>
                        <Typography variant="subtitle2" mt={2}>
                          {renderDate(eventDetail)}
                        </Typography>

                        <Typography variant="subtitle2" mt={2}>
                          {eventDetail?.description}
                        </Typography>
                        <Typography variant="subtitle2" mt={2}>
                          {eventDetail?.venue?.address}
                        </Typography>
                        <LocationOnIcon onClick={() => window.open(`https://maps.google.com?q=${eventDetail?.venue?.geoLocation[0]?.coordinates[0]},${eventDetail?.venue?.geoLocation[0]?.coordinates[1]}`) }/>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: 1,
                        borderColor: 'divider',
                        mb: 2
                      }}
                    >
                      <Tabs
                        aria-label="events"
                        onChange={handleTabChange}
                        value={currentTab}
                      >
                        {tabs.map((tab) => {
                          return (
                            <Tab
                              label={tab.label}
                              value={tab.value}
                              key={tab.label}
                            />
                          );
                        })}
                      </Tabs>
                      <Box >
                        {!isPast(eventDetail) && (
                          <Button
                            variant="contained"
                            startIcon={<AddCircleIcon fontSize="medium" />}
                            onClick={() => {
                              setInvite(true);
                            }}
                          >
                            Invite More
                          </Button>
                        )}
                      </Box>
                    </Box>
                    <CardWrapper sx={{ minwidth: 275, minHeight: 450 }}>
                      {tempBrokers.length === 0 ? (
                        <>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              textAlign: 'center',
                              fontSize: `${theme.typography.pxToRem(30)}`,
                              mt: 10
                            }}
                          >
                            No Invitees to show
                          </Typography>
                        </>
                      ) : (
                        <>
                          <form>
                            <Box display="flex" alignItems="center">
                              <Box
                                flexGrow={1}
                                display="flex"
                                alignItems="center"
                                sx={{ borderBottom: 1, borderColor: 'divider' }}
                              >
                                <SearchTwoToneIcon
                                  sx={{
                                    mx: 2,
                                    color: theme.colors.secondary.main
                                  }}
                                />
                                <SearchInputWrapper
                                  value={searchValue}
                                  onChange={handleSearchChange}
                                  autoFocus
                                  placeholder="Type name to search..."
                                  fullWidth
                                />
                              </Box>
                            </Box>
                          </form>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {tempBrokers.map((item) => {
                              return (
                                <PeopleCard
                                  id={item?.id}
                                  name={item?.name}
                                  designation={item?.designation}
                                  profileUrl={item?.profileImage}
                                  giftStatus={item?.giftStatus}
                                  email={item.email}
                                />
                              );
                            })}
                          </Box>
                        </>
                      )}
                    </CardWrapper>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Invite
            inviteUrl={eventDetail.eventInviteDoc}
            eventId={eventId}
            invitees={eventDetail?.invitees}
          />
        </>
      )}
    </>
  );
};
export default EventDetails;
