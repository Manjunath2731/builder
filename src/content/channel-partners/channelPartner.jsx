import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { TabPanel, TabList, TabContext } from '@mui/lab';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Tab,
  Button,
  Card,
  alpha,
  styled,
  InputBase,
  useTheme,
  Typography,
  Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addTeams } from '../../slices/team';
import { addRoles } from '../../slices/roles';
import { getProjectList } from '../../slices/ProjectList';
import TotalBrokerCard from './totalBrokerCard';
import BrokerCard from './brokerCard';
import { AlphabetsFilter } from '../../components/EventPolls/InviteScreen';
import PendingInvitees from './PendingInviteesCard';
import { getAllBrokers } from '../../slices/Events';
import {
  AddBrokersList,
  getPendingInviteList,
  AddedByYouList,
  getChannelPartners,
  getChannelPartnerType,
  getTopChannelPartners
} from '../../slices/channelPartner.js';
import { DropDownFilter } from './DropDownFilter';

const useStyles = makeStyles(() => ({
  root: {
    '&::-webkit-scrollbar': {
      height: 8
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: `inset 0 0 15px rgba(0, 0, 0, 0.3)`
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#98b9d6'
    }
  }
}));
const CardWrapper = styled(Card)(
  ({ theme }) => `
    transition: ${theme.transitions.create(['box-shadow'])};
    position: relative;
    border-radius: 8px;
    z-index: 5;
    padding: 0;
    box-shadow: 
    0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
    0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
    0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
    0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
  `
);

const SearchInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(12)};
    height: 60px;
    width: 100%;`
);
const PlaceHolder = ({ text }) => {
  const theme = useTheme();
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        width="100%"
      >
        <Typography
          variant="h4"
          pt={10}
          sx={{ color: theme.palette.grey[500] }}
          textAlign="center"
        >
          {text}
        </Typography>
      </Box>
    </>
  );
};

function channelPartner() {
  const classes = useStyles();
  const [value, setValue] = useState('1');
  const [FilterValue, setFilterValue] = useState({
    Projects: 'All',
    City: 'Any',
    RM: 'All'
  });
  const [projectNameList, setProjectNameList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [rmList, setrmList] = useState([]);
  const [channelPartnerList, setPartnerList] = useState([]);
  const [topBrokerListState, setBrokerList] = useState([]);
  const [graphPIEchart, setGraphPIEchart] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(window.localStorage.getItem('user'));
  const handleChange = (event, newValue) => {
    setSearchValue('');
    setValue(newValue);
  };
  const handleFilter = (event) => {
    const { name, value } = event.target;
    let filterValueUpdate = { ...FilterValue };
    filterValueUpdate[name] = value;
    setFilterValue(filterValueUpdate);
    handleFilterBoardcast(filterValueUpdate);
  };

  const handleFilterRM = (event) => {
    const { name, value } = event.target;
    let filterValueUpdate = { ...FilterValue };
    filterValueUpdate[name] = value;
    setFilterValue(filterValueUpdate);
    handleFilterRMResult(filterValueUpdate);
  };
  const handleFilterBoardcast = (filterValueUpdate) => {
    if (filterValueUpdate.City === 'Any') {
      setTempTeam(Brokerslist);
      return;
    }
    let data = Brokerslist.filter(
      (item) => item?.city === filterValueUpdate.City
    );
    setTempTeam(data);
  };
  const handleFilterRMResult = (filterValueUpdate) => {
    if (filterValueUpdate.RM === 'All') {
      setTempTeam(Brokerslist);
      return;
    }
    console.log(Brokerslist, "Ddddddddddd", filterValueUpdate?.RM);
    let data = Brokerslist.filter(
      (item) => item?.assign_RM?._id === filterValueUpdate?.RM
    );
    setTempTeam(data);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addTeams(userData?.builderCompany[0]));
    dispatch(AddBrokersList(userData?.builderCompany[0]));
    dispatch(addRoles());
    dispatch(getPendingInviteList());
    dispatch(AddedByYouList());
    dispatch(getProjectList());
    dispatch(getAllBrokers(userData?.userId));
    dispatch(getChannelPartners());
    dispatch(getChannelPartnerType());
    dispatch(getTopChannelPartners());
    setGraphPIEchart(false)
  }, []);

  let Brokerslist = [];
  let ProjectList = [];
  let PendingInvite = [];
  let AddedByYou = [];
  let Cities = [];
  let channelPartners = [];
  let channelPartnersType = {};
  let RMList = [];
  let topBrokerList = [];
  Brokerslist = useSelector((state) => state.channelPartner.brokersByBuilderId);
  ProjectList = useSelector((state) => state.projectList.projectListData);
  PendingInvite = useSelector(
    (state) => state.channelPartner.pendingInviteList
  );
  AddedByYou = useSelector((state) => state.channelPartner.addedByYouList);

  channelPartners = useSelector(
    (state) => state.channelPartner.topChannelPartners
  );
  channelPartnersType = useSelector(
    (state) => state.channelPartner.channelPartnerType
  );
  RMList = useSelector((state) => state.channelPartner.rmList);
  topBrokerList = useSelector((state) => state.channelPartner.topBrokers);
  useEffect(() => {
    setTempTeam(Brokerslist);
    setpendingList(PendingInvite);
    setAddedbyYou(AddedByYou);
    if (RMList.length > 0) {
      setrmList(RMList);
    }
    if (ProjectList.length !== 0) {
      let projectName = ProjectList.filter(
        (item) => item.status === 'PUBLISHED'
      ).map((item) => ({
        label: item.name,
        id: item._id
      }));
      setProjectNameList(projectName);
    }
  }, [ProjectList, Brokerslist, channelPartners, channelPartnersType, RMList]);

  // useEffect(() => {
  //   if (Brokerslist.length) {
  //     Cities = Brokerslist.map((item) => {
  //       return { id: item?.user?.city, label: item?.user?.city };
  //     });
  //     setCityList(Cities);
  //   }
  // }, [Brokerslist]);


  useEffect(() => {
    if (Brokerslist.length) {
      const uniqueArr = Brokerslist.reduce((accumulator, currentValue) => {
        const index = accumulator.findIndex(obj => obj.city === currentValue.city);
        if (index === -1) {
          accumulator.push(currentValue);
        }
        return accumulator;
      }, []);
      Cities = uniqueArr.map((item) => {
        return { id: item?.city, label: item.city }

      });
      setCityList(Cities);
    }
  }, [Brokerslist]);

  useEffect(() => {
    if (topBrokerList.length) {
      topBrokerList = topBrokerList.slice(0, 5);
      setBrokerList(topBrokerList);
    }
  }, [topBrokerList]);

  useEffect(() => {
    if (channelPartners.length >= 0) {
      channelPartners = channelPartners.filter((item) => {
        return Brokerslist.find((list) => {
          return list?._id !== item?._id;
        });
      });
      channelPartners = Brokerslist.map((item) => {
        const fullName = `${item?.first_name} ${item.last_name}`;
        return {
          _id: item?._id,
          name: fullName,
          profilePic: item.profileImage
        };
      });
      setPartnerList(channelPartners);
    }
  }, [channelPartners]);

  const onBrokerAlphabetClick = (letter = 'All') => {
    const searchKey = letter.toLowerCase();
    if (searchKey === 'all') {
      setTempTeam(Brokerslist);
    } else {
      const filteredData = Brokerslist.filter((el) => {
        if (
          handleNull(el?.first_name).toLowerCase().charAt(0) === searchKey
        ) {
          return true;
        }
        return false;
      });
      setTempTeam(filteredData);
    }
    setSearchValue('');
  };
  const onAddedByYouAlphabetClick = (letter = 'All') => {
    const searchKey = letter.toLowerCase();
    if (searchKey === 'all') {
      setAddedbyYou(AddedByYou);
    } else {
      const filteredData = AddedByYou.filter((el) => {
        if (handleNull(el?.first_name).toLowerCase().charAt(0) === searchKey) {
          return true;
        }
        return false;
      });
      setAddedbyYou(filteredData);
    }
    setSearchValue('');
  };
  const onPendingInviteAlphabetClick = (letter = 'All') => {
    const searchKey = letter.toLowerCase();
    if (searchKey === 'all') {
      setpendingList(PendingInvite);
    } else {
      const filteredData = PendingInvite.filter((el) => {
        if (handleNull(el?.name).toLowerCase().charAt(0) === searchKey) {
          return true;
        }
        return false;
      });
      setpendingList(filteredData);
    }
    setSearchValue('');
  };

  const handleBrokerSearchChange = async (event) => {
    event.preventDefault();

    if (event.target.value === '') {
      setTempTeam(Brokerslist);
      setSearchValue('');
    } else {
      setSearchValue(event.target.value);
      filterBrokers(event.target.value);
    }
  };
  const handleAddedByYouSearchChange = async (event) => {
    event.preventDefault();

    if (event.target.value === '') {
      setAddedbyYou(AddedByYou);
      setSearchValue('');
    } else {
      setSearchValue(event.target.value);
      filterAddedByYou(event.target.value);
    }
  };
  const handlePendingSearchChange = async (event) => {
    event.preventDefault();

    if (event.target.value === '') {
      setpendingList(PendingInvite);
      setSearchValue('');
    } else {
      setSearchValue(event.target.value);
      filterPendingInvitee(event.target.value);
    }
  };

  const handleNull = (str) => {
    if (str !== null && str !== undefined) {
      return str;
    }
    return '';
  };
  const filterBrokers = (key = '') => {
    const searchKey = key.toLowerCase();
    const filteredData = Brokerslist.filter((el) => {
      const fullName = `${el.first_name.toLowerCase()} ${el.last_name.toLowerCase()}`;
      return fullName.indexOf(searchKey) !== -1;
    });
    setTempTeam(filteredData);
  };

  const filterAddedByYou = (key = '') => {
    const searchKey = key.toLowerCase();

    const filteredData = AddedByYou.filter((el) => {
      const fullName = `${el.first_name.toLowerCase()} ${el.last_name.toLowerCase()}`;
      return fullName.indexOf(searchKey) !== -1;
    });

    setAddedbyYou(filteredData);
  };
  const filterPendingInvitee = (key = '') => {
    const searchKey = key.toLowerCase();
    const filteredData = PendingInvite.filter((el) => {
      if (handleNull(el.name)?.toLowerCase().indexOf(searchKey) !== -1) {
        return true;
      }
      return false;
    });
    setpendingList(filteredData);
  };

  const toUpper = (str) => {
    let result = '';
    if (str !== null && str !== undefined) {
      result = str.charAt(0).toUpperCase() + str.slice(1);
    } else {
      result = '';
    }
    return result;
  };

  const [searchValue, setSearchValue] = useState('');
  const [tempTeam, setTempTeam] = useState([]);
  const [pendingList, setpendingList] = useState([]);
  const [addedbyYou, setAddedbyYou] = useState([]);

  // console.log(Brokerslist, "Brokerslist")
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <title>Channel Partners</title>
      </Helmet>
      <Box sx={{ ml: 4, py: 4, pl: { xs: 5, lg: 0 }, pr: { xs: 5, md: 6 } }}>
        <Typography
          sx={{
            fontSize: `${theme.typography.pxToRem(13)}`,
            mb: 3,
            mt: 2
          }}
          variant="h4"
        >
          CHANNEL PARTNERS
        </Typography>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box
              container
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap'
              }}
            >
              <TabList
                scrollButtons="true"
                variant="scrollable"
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="All Channel Partners" value="1" />
                <Tab label="Added by you" value="2" />
                <Tab label={`Pending Invites (${PendingInvite?.length})`} value="3" />
              </TabList>

              <Button
                variant="contained"
                startIcon={<AddCircleIcon fontSize="medium" />}
                sx={{ mb: 1, mt: { xs: 2, sm: 0 } }}
                onClick={() => {
                  navigate(`/channel_partners/add-broker`);
                }}
              >
                Add New Partner
              </Button>
            </Box>
            <TabPanel value="1" sx={{ px: 0 }}>
              {graphPIEchart && channelPartnerList.length > 0 &&
                !_.isEmpty(channelPartnersType) && (
                  <Grid container>
                    <Grid item xs={12}>
                      <TotalBrokerCard
                        channelPartners={channelPartnerList}
                        channelPartnersType={channelPartnersType}
                        topBrokerListState={topBrokerListState}
                      />
                    </Grid>
                  </Grid>
                )}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  mb: 2,
                  columnGap: 4
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
                  name="City"
                  disabled
                  value={FilterValue.City}
                  onchange={handleFilter}
                  menuItems={cityList}
                  initialValue="Any"
                />

                <DropDownFilter
                  name="RM"
                  value={FilterValue.RM}
                  onchange={handleFilterRM}
                  menuItems={rmList}
                  initialValue="All"
                />
              </Box>
              <CardWrapper sx={{ minWidth: 275, minHeight: 500 }}>
                <form>
                  <Box display="flex" alignItems="center">
                    <Box
                      flexGrow={1}
                      display="flex"
                      alignItems="center"
                      sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                      <SearchTwoToneIcon
                        fontSize="medium"
                        sx={{
                          ml: { xs: 3, md: 3, xl: 5 },
                          mr: 1,
                          color: theme.palette.common.black,
                          fontWeight: 'bold'
                        }}
                      />
                      <SearchInputWrapper
                        value={searchValue}
                        onChange={handleBrokerSearchChange}
                        autoFocus
                        placeholder="Type channel partner name to search..."
                        fullWidth
                        sx={{ color: theme.palette.common.black }}
                      />
                    </Box>
                  </Box>
                </form>
                <Box
                  className={classes.root}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    background: '#eeeeee',
                    p: 2,
                    pl: { xs: 3, md: 1, xl: 3 },
                    overflowX: 'auto',
                    scrollbarWidth: 'thin'
                  }}
                >
                  <AlphabetsFilter onAlphabetClick={onBrokerAlphabetClick} />
                </Box>
                <Grid container>
                  {Brokerslist?.length > 0 ? (
                    tempTeam.length > 0 ? (
                      tempTeam.map((item) => {
                        let teamData = item;
                        return (
                          <Grid
                            item
                            key={teamData._id}
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            xxl={4}
                          >
                            <BrokerCard
                              key={teamData._id}
                              id={teamData._id}
                              name={`${toUpper(teamData.first_name)} ${toUpper(
                                teamData.last_name
                              )}`}
                              designation={toUpper(teamData?.designation)}
                              address={toUpper(teamData?.address)}
                              number={handleNull(teamData.phoneNumber)}
                              email={teamData?.email}
                              profileUrl={teamData?.profile_image}
                              companyName={teamData?.companyName}
                              companyId={teamData?.company_id}
                              assignRM={teamData?.assign_RM}
                              nameRM={`${toUpper(teamData?.assign_RM?.first_name)} ${toUpper(
                                teamData?.assign_RM?.last_name
                              )}`}
                            />
                          </Grid>
                        );
                      })
                    ) : (
                      <PlaceHolder text=" No Channel partner to matched" />
                    )
                  ) : (
                    <PlaceHolder text=" No Channel partner to show" />
                  )}
                </Grid>
              </CardWrapper>
            </TabPanel>
            <TabPanel value="2" sx={{ px: 0 }}>
              <CardWrapper sx={{ minWidth: 275, minHeight: 500 }}>
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
                          ml: { xs: 3, md: 3, xl: 5 },
                          mr: 1,
                          color: theme.palette.common.black,
                          fontWeight: 'bold'
                        }}
                      />
                      <SearchInputWrapper
                        value={searchValue}
                        onChange={handleAddedByYouSearchChange}
                        autoFocus
                        placeholder="Type channel partner name to search..."
                        fullWidth
                      />
                    </Box>
                  </Box>
                </form>
                <Box
                  className={classes.root}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    background: '#eeeeee',
                    p: 2,
                    pb: { xs: 2, xl: 0 },
                    overflowX: 'auto',
                    scrollbarWidth: 'none'
                  }}
                >
                  <AlphabetsFilter
                    onAlphabetClick={onAddedByYouAlphabetClick}
                  />
                </Box>
                <Grid container>
                  {AddedByYou?.length > 0 ? (
                    addedbyYou.length > 0 ? (
                      addedbyYou.map((item) => {
                        let teamData = item;
                        return (
                          <Grid
                            item
                            key={teamData._id}
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            xxl={4}
                          >
                            <BrokerCard
                              key={teamData._id}
                              id={teamData._id}
                              name={`${toUpper(teamData?.first_name)} ${toUpper(
                                teamData?.last_name
                              )}`}
                              designation={toUpper(teamData.designation)}
                              address={toUpper(teamData.address)}
                              number={teamData.phoneNumber}
                              email={teamData.email}
                              profileUrl={teamData.profileImage}
                              companyId={teamData.company_id}
                              addedByYou="true"
                            />
                          </Grid>
                        );
                      })
                    ) : (
                      <PlaceHolder text=" No Channel partner matched " />
                    )
                  ) : (
                    <PlaceHolder text=" No Channel partner added by you" />
                  )}
                </Grid>
              </CardWrapper>
            </TabPanel>
            <TabPanel value="3" sx={{ px: 0 }}>
              <CardWrapper sx={{ minWidth: 275, minHeight: 500 }}>
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
                          ml: { xs: 3, md: 3, xl: 5 },
                          mr: 1,
                          color: theme.palette.common.black,
                          fontWeight: 'bold'
                        }}
                      />
                      <SearchInputWrapper
                        value={searchValue}
                        onChange={handlePendingSearchChange}
                        autoFocus
                        placeholder="Type channel partner name to search..."
                        fullWidth
                      />
                    </Box>
                  </Box>
                </form>
                <Box
                  className={classes.root}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    background: '#eeeeee',
                    p: 2,
                    overflowX: 'auto',
                    scrollbarWidth: 'none'
                  }}
                >
                  <AlphabetsFilter
                    onAlphabetClick={onPendingInviteAlphabetClick}
                  />
                </Box>

                <Grid container>
                  {PendingInvite?.length > 0 ? (
                    pendingList.length > 0 ? (
                      pendingList?.map((item) => {
                        let teamData = item;
                        return (
                          <Grid
                            item
                            key={teamData._id}
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            xl={4}
                          >
                            <PendingInvitees
                              key={teamData._id}
                              id={teamData._id}
                              name={`${toUpper(teamData?.name)}`}
                              phoneNumber={teamData.phoneNumber}
                              email={teamData.email}
                              date={teamData.createdAt || null}
                            />
                          </Grid>
                        );
                      })
                    ) : (
                      <PlaceHolder text=" No pending invites matched " />
                    )
                  ) : (
                    <PlaceHolder text=" No pending invites" />
                  )}
                </Grid>
              </CardWrapper>
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </>
  );
}

export default channelPartner;
