import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Box,
  Tab,
  Button,
  useTheme,
  Typography,
  Card
} from '@mui/material';
import { TabPanel, TabList, TabContext } from '@mui/lab';
import { compareAsc, subDays } from 'date-fns';
import _ from 'lodash';
// import moment from 'moment';
import { DateRange } from 'react-date-range';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
// import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
// import Loader from 'src/UI/Loader/Loader.js';
import {
  SortObjectOnTimeBasisLatest,
  mergeObjectOfArray
} from 'src/utils/utilits';
import { canCreateBroadcast } from 'src/helpers/permissionHelper';
import FeedCard from 'src/components/Projects/ViewProjectDetails/Blocks/FeedCard';
// import { Swiper } from 'swiper/react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getTeams } from 'src/slices/team';
import FilterCard from './filterCard';
import { addBroadcast, addMyBroadcast } from '../../slices/broadcast';
import { addDashboardBroadcast } from '../../slices/dashboard';
import { DropDownFilter } from '../channel-partners/DropDownFilter';
import { addProjects } from '../../slices/meetings';
import { getProjectList } from '../../slices/ProjectList';
// import PageHeader from '../PageHeader';

export const renderDate = (dateOZ) => {
  let newdate = new Date(dateOZ).toLocaleDateString('en-us', {
    month: 'short',
    day: 'numeric'
  });
  return `${newdate}`;
};

function DashboardReports() {
  const [value, setValue] = useState('1');
  const theme = useTheme();
  const navigate = useNavigate();
  const [broadCast, setBroadCast] = useState([]);
  const [yourBroadCast, setYourBroadCast] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addBroadcast());
    dispatch(addMyBroadcast());
    dispatch(addProjects());
    dispatch(getProjectList());
    dispatch(getTeams());
    dispatch(addDashboardBroadcast());
  }, []);

  let broadcast = [];
  let myBroadcast = {};
  const lastDate = useSelector((state) => state?.dashboard?.dashboardBroadcast);
  broadcast = useSelector((state) => state.broadcast.data);
  myBroadcast = useSelector((state) => state.broadcast.myBroadcast);
  const user = useSelector((state) => state.team?.teamList);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const InitialFilterValue = {
    Projects: 'All',
    By: 'All',
    'Date Range': 'All'
  };
  const { state } = useLocation();
  // const { id } = state;
  console.log("id, color", state?.id);
  const [selectedCard, setSelectedCard] = useState(state?.id || 'ALL_BROADCAST');
  const [FilterValue, setFilterValue] = useState(InitialFilterValue);
  const [projectNameList, setProjectNameList] = useState([]);
  const [userList, seUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: subDays(new Date(), 14),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [loadmore, setLoadMore] = useState(6);
  // const [dateValueFilter,setDateValueFilter]= useState([null, null]);
  const handleCardChange = (card) => {
    setSelectedCard(card);
    setBroadCast(broadcast[card] || []);
    setFilterValue(InitialFilterValue);
  };
  const handleFilter = (event) => {
    console.log(">>>>>>>>>", event)
    const { name, value } = event.target;
    let filterValueUpdate = { ...FilterValue };
    filterValueUpdate[name] = value;
    console.log({ filterValueUpdate })
    setFilterValue(filterValueUpdate);
    handleFilterBoardcast(filterValueUpdate);
  };


  const handleFilterDate = (ranges) => {
    let filterValueUpdate = { ...FilterValue };
    filterValueUpdate['Date Range'] = ranges;
    console.log({ filterValueUpdate })
    setFilterValue(filterValueUpdate);
    handleFilterBoardcast(filterValueUpdate);
  };

  const isInDateRange = (dateToCompare, dateRange) => {
    const endDate = new Date(dateRange[0].endDate);
    endDate.setDate(endDate.getDate() + 1);
    if (
      compareAsc(new Date(dateToCompare), new Date(endDate)) === -1 &&
      compareAsc(new Date(dateToCompare), new Date(dateRange[0].startDate)) === 1
    ) {
      return true;
    }
    return false;
  };


  const filterMethods = [
    (item, filterValueUpdate) => {
      if (filterValueUpdate.Projects === 'All') {
        return true;
      }
      return item?.projectId === filterValueUpdate?.Projects;
    },
    (item, filterValueUpdate) => {
      if (filterValueUpdate.By === 'All') {
        return true;
      }
      console.log(item?.author, "filterValueUpdate?.Projects", filterValueUpdate?.By);
      return item?.author?._id.includes(filterValueUpdate?.By);
    },
    (item, filterValueUpdate) => {
      if (filterValueUpdate['Date Range'] === 'All') {
        return true;
      }
      return isInDateRange(item.deliveryTime, filterValueUpdate['Date Range']);
    }
  ];

  const handleFilterBoardcast = (filterValueUpdate) => {
    let filteredArray = [];
    if (selectedCard in broadcast) {
      filteredArray = broadcast[selectedCard].filter((item) => {
        for (let i = 0; i < filterMethods.length; i++) {
          if (!filterMethods[i](item, filterValueUpdate)) {
            return false;
          }
        }
        return true;
      });
      setBroadCast(filteredArray);
    }
  };
  const getLength = (broadcast, type) => {
    let length = broadcast[type]?.length ? broadcast[type]?.length : 0;
    return length;
  };
  let ProjectList = [];
  ProjectList = useSelector((state) => state.projectList.projectListData);

  useEffect(() => {
    setBroadCast(broadcast[selectedCard]);
    if (ProjectList.length !== 0) {
      let projectName = ProjectList.filter(
        (item) => item.status === 'PUBLISHED'
      ).map((item) => ({
        label: item.name,
        id: item._id
      }));
      setProjectNameList(projectName);
      let useList = user.map((item) => ({
        label: `${item.first_name} ${item.last_name ? item.last_name : ''}`,
        id: item._id
      }));
      seUserList(useList);
    }
    mergeObjectOfArray(myBroadcast).then((result) => {
      let sortedBroadcast = SortObjectOnTimeBasisLatest(result);
      setYourBroadCast(sortedBroadcast);
    });
  }, [(ProjectList, broadcast)]);
  // get the target element to toggle
  const refOne = useRef(null);

  useEffect(() => {
    // event listeners
    document.addEventListener('keydown', hideOnEscape, true);
    document.addEventListener('click', hideOnClickOutside, true);
  }, []);

  // hide dropdown on ESC press
  const hideOnEscape = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Hide on outside click
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };


  return (
    <>
      <Helmet>
        <title>Broadcast</title>
      </Helmet>
      <Box sx={{ ml: 4, py: 4, pl: { xs: 5, lg: 0 }, pr: { xs: 5, md: 7 } }}>
        <Typography
          sx={{
            fontSize: `${theme.typography.pxToRem(15)}`,
            mb: 3,
            mt: 2
          }}
          variant="h4"
        >
          BROADCASTS
        </Typography>
        <Box
          sx={{
            width: '100%',
            typography: 'body1'
          }}
        >
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="All Broadcast" value="1" />
                <Tab label="Your Broadcast" value="2" />
              </TabList>
              {canCreateBroadcast() ? (
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon fontSize="medium" />}
                  sx={{ mb: 1 }}
                  // style={{
                  //   width: '183px',
                  //   height: '40px',
                  //   fontSize: '12px',
                  //   // fontFamily: 'Helvetica Neue medium lite'
                  // }}
                  onClick={() => {
                    navigate(`/broadcast/create-broadcast`);
                  }}
                >
                  Add New Broadcast
                </Button>
              ) : (
                ''
              )}
            </Box>
            <TabPanel value="1" sx={{ px: 0 }}>
              {/* <Swiper
                slidesPerView={1}
                navigation={{
                  nextEl: '.MuiSwipe-right',
                  prevEl: '.MuiSwipe-left'
                }}
              //   pagination={{ dynamicBullets: true, clickable: true }}
              // > */}
              <Grid container>
                <Grid item xs={12} lg={10} xl={9}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      columnGap: { xs: 1, md: 2, xl: 2 }
                      // marginLeft: '-30px'
                    }}
                  >
                    <FilterCard
                      mainText="ALL_BROADCAST"
                      count={getLength(broadcast, 'ALL_BROADCAST')}
                      description={`Avg Broadcasting Time ${Math.round((lastDate?.generalUpdates?.average +
                        lastDate?.offerBrokers?.average +
                        lastDate?.offerBuyers?.average +
                        lastDate?.projectUpdates?.average +
                        lastDate?.eventPolls?.average) / 5)} hrs`}
                      handleCardChange={handleCardChange}
                      selectedCard={selectedCard}
                    />
                    <FilterCard
                      mainText="GENERAL_UPDATES"
                      count={getLength(broadcast, 'GENERAL_UPDATES')}
                      description={`Avg Broadcasting Time ${Math.round(lastDate?.generalUpdates?.average)} hrs`}
                      handleCardChange={handleCardChange}
                      selectedCard={selectedCard}
                    />
                    <FilterCard
                      mainText="OFFER_BROKERS"
                      count={getLength(broadcast, 'OFFER_BROKERS')}
                      description={`Avg Broadcasting Time ${Math.round(lastDate?.offerBrokers?.average)} hrs`}
                      handleCardChange={handleCardChange}
                      selectedCard={selectedCard}
                    />
                    <FilterCard
                      mainText="OFFER_BUYERS"
                      count={getLength(broadcast, 'OFFER_BUYERS')}
                      description={`Avg Broadcasting Time ${Math.round(lastDate?.offerBuyers?.average)} hrs`}
                      handleCardChange={handleCardChange}
                      selectedCard={selectedCard}
                    />
                    <FilterCard
                      mainText="PROJECT_UPDATES"
                      count={getLength(broadcast, 'PROJECT_UPDATES')}
                      description={`Avg Broadcasting Time ${Math.round(lastDate?.projectUpdates?.average)} hrs`}
                      handleCardChange={handleCardChange}
                      selectedCard={selectedCard}
                    />
                    <FilterCard
                      mainText="EVENTS_POLLS"
                      count={getLength(broadcast, 'EVENTS_POLLS')}
                      description={`Avg Broadcasting Time ${Math.round(lastDate?.eventPolls?.average)} hrs`}
                      handleCardChange={handleCardChange}
                      selectedCard={selectedCard}
                    />
                  </Box>
                </Grid>

                {/* </Swiper> */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      mt: 3,
                      columnGap: 2
                    }}
                  >
                    <DropDownFilter
                      name="Projects"
                      value={FilterValue.Projects}
                      onchange={handleFilter}
                      menuItems={projectNameList}
                      initialValue="All"
                    />

                    <DropDownFilter
                      name="By"
                      value={FilterValue.By}
                      onchange={handleFilter}
                      menuItems={userList}
                      initialValue="All"
                    />
                    <div className="calendarWrap">
                      <Card
                        sx={{
                          border: 0,
                          '&:hover': { border: 0 },
                          borderRadius: '5px',
                          backgroundColor: '#dbe5f3',
                          outline: '0px'
                        }}
                      >
                        <Button
                          sx={{
                            borderRadius: '5px',
                            backgroundColor: '#dbe5f3',
                            color: '#514557',
                            '&:hover': {
                              borderRadius: '5px',
                              backgroundColor: '#dbe5f3'
                            }
                            // m: '-2px'
                          }}
                          endIcon={<ArrowDropDownIcon sx={{ mx: 1 }} />}
                          size="large"
                          className="inputBox"
                          onClick={() => {
                            setOpen((open) => !open);
                          }}
                        >
                          Date Range :
                          {` ${renderDate(range[0].startDate)} - ${renderDate(
                            range[0].endDate
                          )}`}
                        </Button>
                      </Card>
                      <div ref={refOne}>
                        {open && (
                          <Card
                            sx={{
                              position: 'absolute',
                              zIndex: 99,
                              right: { xs: 0, md: 'auto' }
                            }}
                          >
                            <DateRange
                              onChange={(item) => {
                                setRange([item.selection])
                                handleFilterDate([item.selection]);
                              }}
                              editableDateInputs="true"
                              moveRangeOnFirstSelection="false"
                              ranges={range}
                              months={1}
                              direction="horizontal"
                              className="calendarElement"
                            />
                          </Card>
                        )}
                      </div>
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={10} xl={9}>
                  <Box mt={3} height="100%">
                    {broadCast?.length < 1 && (
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
                        <React.Fragment key={index}>
                          <FeedCard item={item} />
                        </React.Fragment>
                      );
                    })}
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="2" sx={{ px: 0 }}>
              <Grid container>
                <Grid item xs={12} xl={9}>
                  <Box>
                    {_.isEmpty(myBroadcast) && (
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
                    {yourBroadCast.slice(0, loadmore).map((item, index) => {
                      return (
                        <React.Fragment key={index}>
                          <FeedCard item={item} />
                        </React.Fragment>
                      );
                    })}
                  </Box>
                  {
                    yourBroadCast.length >= loadmore &&
                    <Button
                      variant="contained"
                      onClick={() => setLoadMore(prev => prev + 6)}
                      sx={{
                        position: 'absolute',
                        marginTop: 3,
                        marginBottom: 2,
                        right: 60
                      }}
                    >
                      Load More
                    </Button>
                  }
                </Grid>
              </Grid>
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </>
  );
}

export default DashboardReports;
