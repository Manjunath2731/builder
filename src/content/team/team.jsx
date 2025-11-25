import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { TabPanel, TabList, TabContext } from '@mui/lab';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import {
  Grid,
  Box,
  Tab,
  Button,
  Card,
  alpha,
  styled,
  InputBase,
  useTheme,
  Typography
  //  Divider
} from '@mui/material';
import { isCrmMember } from 'src/helpers/userHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { getCRM, getTeams } from '../../slices/team';
import { addRoles } from '../../slices/roles';
import TeamInfoCard from './teamCard';
import { canAddCRMMembers, canAddMembers } from '../../helpers/permissionHelper';
import { DropDownFilter } from '../channel-partners/DropDownFilter';
import { getProjectByBuilderId } from '../../slices/ProjectList';


const CardWrapper = styled(Card)(
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

// const TeamCardWrapper = styled(Card)(
//   ({ theme }) => `
//     transition: ${theme.transitions.create(['box-shadow'])};
//     position: relative;
//     z-index: 5;
//     width: 50%;
//     box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px;
// //   `
// );

const SearchInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(18)};
    height: 60px;
    width: 100%;
`
);
// import PageHeader from '../PageHeader';

function Teamdashboard() {
  const userData = JSON.parse(window.localStorage.getItem('user'));
  // let isCRM = isCrmMember();
  const { selectedTab } = useParams();

  const [FilterValue, setFilterValue] = useState({
    Projects: 'All',
  });
  const [projectNameList, setProjectNameList] = useState([]);
  const [filterMemberData, setFilterMemberData] = useState([]);

  const [tabValue, setValue] = useState(!isCrmMember() ? '1' : '2');
  const [count, setCount] = useState({ team: 0, crm: 0 });
  const navigate = useNavigate();
  const isInclude = (list, item) => {
    if (!list.length) return 0;
    let tempList = [...list]
    let user = (list.filter((i, index) => {
      if (i?._id?.includes(item)) {
        tempList.splice(index, 1);
        return true
      }
      return false
    }));
    return { user, tempList }
  }
  const filterTeamByProject = (userIdList, teams) => {
    let teamData = []
    userIdList.reduce(
      (accumulator, currentValue) => {
        if (!currentValue) return accumulator;
        let userLatest = [...accumulator];
        let { user, tempList } = isInclude(userLatest, currentValue);
        if (user?.length) teamData.push(user[0]);
        return tempList
      },
      teams);
    return teamData;

  }
  const handleFilter = (event) => {
    const { name, value } = event.target;
    let filterValueUpdate = { ...FilterValue };
    filterValueUpdate[name] = value;
    let member = tabValue === '1' ? team : tempCRMTeam;
    setFilterValue(filterValueUpdate);
    if (value === 'All') {
      setFilterMemberData(member);
      setTempTeam(member)
    } else {
      let list = tabValue === '1' ? value?.rmList : value?.crmList
      let data = filterTeamByProject(list, member);
      console.log({ data })
      setFilterMemberData(data);
      setTempTeam(data)
    }
  };
  const getValidValue = (str) => {
    if (str !== null && str !== undefined) {
      return str;
    }
    return '';
  };
  const handleChange = (event, newValue) => {
    if (newValue === '1') {
      navigate('/team/teams')
    }
    else {
      navigate('/team/crm')
    }
    setValue(newValue);
    setSearchValue('');
    getTempTeam(team, tempCRMTeam);
    // getFilteredTeams(newValue);
  };
  // const getFilteredTeams = (tabValue) => {
  //   let filterData;
  //   let crmTeamId = teamTypes?.filter(
  //     (item) => getValidValue(item?.name)?.toLowerCase() === 'crm'
  //   );
  //   console.log({ teamTypes });
  //   console.log({ crmTeamId });
  //   if (tabValue === '2') {
  //     console.log('crm');
  //     console.log({ teams });
  //     filterData = teams.filter(
  //       (item) => getValidValue(item.user.team_id) === crmTeamId[0]?.id
  //     );
  //     setCount({ ...count, crm: filterData?.length })
  //     filterData.map((item) => console.log(item.team_id));
  //     console.log(filterData);
  //   setTempCRMTeam  (filterData)
  //   } else {
  //     console.log('others');
  //     filterData = teams.filter(
  //       (item) => getValidValue(item.user?.team_id) !== crmTeamId[0]?.id
  //     );
  //     console.log(filterData);
  //     setCount({ ...count, team: filterData?.length })
  //     setTeam(filterData);
  //   }
  //   console.log(filterData);
  //   setTempTeam(filterData)
  // };
  let ProjectList = [];

  const dispatch = useDispatch();
  ProjectList = useSelector((state) => state.projectList.projectListBuilder);
  useEffect(() => {
    // dispatch(addTeams(userData.group[0].id));
    dispatch(addRoles());
    dispatch(getTeams());
    dispatch(getCRM());
    // dispatch(addTeamTypes());
    dispatch(getProjectByBuilderId(userData.builderCompany[0]));

    setValue(selectedTab === 'crm' ? '2' : '1');
    // getFilteredTeams(selectedTab ==='crm' ? '2' :'1');
  }, []);
  useEffect(() => {
    if (ProjectList.length !== 0) {
      let projectName = ProjectList.filter(
        (item) => item.status === 'PUBLISHED'
      ).map((item) => ({
        label: item.name,
        id: {
          _id: item._id,
          name: item.name,
          crmList: item?.crmManager?.map(x => x),
          rmList: item?.relationManager?.map(x => x)
        }
      }));
      setProjectNameList(projectName);
    }
  },
    [ProjectList])

  // let teams = [];
  // let teamTypes = [];

  let teamList = [];
  let crmList = [];

  teamList = useSelector((state) => state.team.teamList);
  crmList = useSelector((state) => state.team.crmList);
  // teamTypes = useSelector((state) => state.team.teams);
  // teams = useSelector((state) => state.team.data);
  const getTempTeam = (crmList, teamList) => {
    if (selectedTab === 'crm') {
      setTempTeam(crmList);
    }
    else {
      setTempTeam(teamList);
    }
  }
  useEffect(() => {
    // console.log({ teams });
    if (teamList?.length > 0) {
      setTeam(teamList)
      setCount({ ...count, team: teamList?.length })
    }
    if (crmList?.length > 0) {
      setCount({ ...count, crm: crmList?.length })
      setTempCRMTeam(crmList)
    }
    getTempTeam(crmList, teamList);
    // getFilteredTeams(1);
  }, [teamList, crmList]);

  const handleSearchChange = async (event) => {
    event.preventDefault();

    if (event.target.value === '') {
      setTempTeam(filterMemberData);
      setSearchValue('');
    } else {
      setSearchValue(event.target.value);
      filterTeamMember(event.target.value);
    }
  };
  const handleCRMSearchChange = async (event) => {
    event.preventDefault();

    if (event.target.value === '') {
      setTempTeam(filterMemberData);
      setSearchValue('');
    } else {
      setSearchValue(event.target.value);
      filterCrmMember(event.target.value);
    }
  };

  const filterTeamMember = (key = '') => {
    const searchKey = key.toLowerCase();
    const filteredData = filterMemberData.filter((el) => {
      const fullName = `${getValidValue(el.first_name).toLowerCase()} ${getValidValue(el.last_name).toLowerCase()}`;
      return fullName.indexOf(searchKey) !== -1;
    });
    setTempTeam(filteredData);
  };


  const filterCrmMember = (key = '') => {
    const searchKey = key.toLowerCase();
    const filteredData = filterMemberData.filter((el) => {
      const fullName = `${getValidValue(el.first_name).toLowerCase()} ${getValidValue(el.last_name).toLowerCase()}`;
      return fullName.indexOf(searchKey) !== -1;
    });
    setTempTeam(filteredData);
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
  const [team, setTeam] = useState([]);
  const [tempCRMTeam, setTempCRMTeam] = useState([]);
  const theme = useTheme();
  const isAddTeam = canAddMembers();
  const isCrmAddTeam = canAddCRMMembers();

  useEffect(() => {
    let member = tabValue === '1' ? team : tempCRMTeam;

    setFilterMemberData(member);
    setTempTeam(member)
  }, [team, tempCRMTeam, tabValue])

  return (
    <>
      <Helmet>
        <title>Teams</title>
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
          TEAMS
        </Typography>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={tabValue}>
            <Box
              container
              sx={{
                borderBottom: isAddTeam ? 1 : '',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                pb: isAddTeam ? 1 : 0,
                flexWrap: 'wrap'
              }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                {!isCrmMember() ? <Tab label="Team" value="1" /> : ''}

                {!isCrmMember() && <Tab label="CRM Department" value="2" />}
              </TabList>
              {/* && value === '1' */}
              {
                tabValue === '1' ?
                  isAddTeam ? (
                    <Button
                      variant="contained"
                      startIcon={<AddCircleIcon fontSize='medium' />}
                      // sx={{ mb: 1, mr: 2 }}
                      onClick={() => {
                        if (tabValue === '1') {
                          navigate(`/team/add-member/teams`);
                        } else {
                          navigate(`/team/add-member/crm`);
                        }
                      }}
                    >Add New Member
                      {/* {value === '1' && 'Add New Member'} */}
                    </Button>
                  ) : (
                    ''
                  ) :
                  isCrmAddTeam ? (
                    <Button
                      variant="contained"
                      startIcon={<AddCircleIcon fontSize='medium' />}
                      // sx={{ mb: 1, mr: 2 }}
                      onClick={() => {
                        if (tabValue === '1') {
                          navigate(`/team/add-member/teams`);
                        } else {
                          navigate(`/team/add-member/crm`);
                        }
                      }}
                    >Add New Member
                      {/* {value === '1' && 'Add New Member'} */}
                    </Button>
                  ) : (
                    ''
                  )
                }
            </Box>
            {!isCrmMember() ? (
              <TabPanel value="1" sx={{ px: 0 }}>
                {(team.length === 0 && count?.team === 0) ? (
                  <>
                    <Box
                      // height="100%"
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
                        {' '}
                        No Team Member To Show{' '}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <CardWrapper sx={{ minWidth: 275, minHeight: 500 }}>
                    <form>
                      <Box display="flex" alignItems="center"
                        justifyContent='space-between' py={1}
                        px={3}
                        sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Box
                          flexGrow={1}
                          display="flex"
                          alignItems="center"
                        // sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                          <SearchTwoToneIcon
                            sx={{
                              mr: 2,
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
                        <Box >
                          <DropDownFilter
                            name="Projects"
                            value={FilterValue.Projects}
                            onchange={handleFilter}
                            menuItems={projectNameList}
                            initialValue="All"
                            isValueId={0}
                          />
                        </Box>

                      </Box>
                    </form>
                    {tempTeam.length === 0 && (<Box
                      // height="100%"
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
                        {' '}
                        No Team Member matched{' '}
                      </Typography>
                    </Box>)}
                    <Grid container sx={{ gridAutoRows: '1fr' }}>
                      {/* <Box sx={{ display: 'flex', flexWrap: 'wrap' }}> */}
                      {tempTeam.map((item) => {
                        let teamData = item;                  
                        return userData.userId !== teamData._id && (
                          <Grid
                            item
                            key={item?._id}
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            xxl={4}
                          // sx={{height:'100%'}}
                          >
                            <TeamInfoCard
                              id={teamData._id}
                              name={`${toUpper(teamData?.first_name)} ${toUpper(
                                teamData?.last_name
                              )}`}
                              designation={toUpper(teamData.designation)}
                              address={toUpper(teamData.address)}
                              number={teamData.phoneNumber}
                              email={teamData.email}
                              profileUrl={teamData.profileImage}
                              isEditAllowed={isAddTeam}
                              isActive={teamData.is_active}
                            />
                          </Grid>
                        );
                        /* console.log({teamData}) */
                      })}
                      {/* </Box> */}
                    </Grid>
                  </CardWrapper>)}
              </TabPanel>
            ) : (
              ''
            )}

            <TabPanel value="2" sx={{ px: 0 }}>
              {(tempCRMTeam.length === 0 && count?.crm === 0) ? (
                <>
                  <Box
                    // height="100%"
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
                      {' '}
                      No CRM Member To Show{' '}
                    </Typography>
                  </Box>
                </>
              ) : (
                <CardWrapper sx={{ minWidth: 275, minHeight: 500 }}>
                  <form>
                    <Box display="flex" alignItems="center"
                      justifyContent='space-between' py={1}
                      px={3}
                      sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Box
                        flexGrow={1}
                        display="flex"
                        alignItems="center"
                      // sx={{ borderBottom: 1, borderColor: 'divider' }}
                      >
                        <SearchTwoToneIcon
                          sx={{
                            mr: 2,
                            color: theme.colors.secondary.main
                          }}
                        />
                        <SearchInputWrapper
                          value={searchValue}
                          onChange={handleCRMSearchChange}
                          autoFocus
                          placeholder="Type name to search..."
                          fullWidth
                        />
                      </Box>
                      <Box>
                        <DropDownFilter
                          name="Projects"
                          value={FilterValue.Projects}
                          onchange={handleFilter}
                          menuItems={projectNameList}
                          initialValue="All"
                          isValueId={0}
                        />
                      </Box>
                    </Box>
                  </form>
                  {tempTeam.length === 0 && (<Box
                    // height="100%"
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
                      {' '}
                      No CRM Member matched{' '}
                    </Typography>
                  </Box>)}
                  <Grid container sx={{ gridAutoRows: '1fr' }}>
                    {/* <Box sx={{ display: 'flex', flexWrap: 'wrap' }}> */}
                    {tempTeam.map((item) => {
                      let teamData = item;
                      return  userData.userId !== teamData._id && (
                        <Grid
                          item
                          key={teamData?.id}
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          xxl={4}
                        // sx={{height:'100%'}}
                        >
                          <TeamInfoCard
                            id={teamData._id}
                            name={`${toUpper(teamData.first_name)} ${toUpper(
                              teamData.last_name
                            )}`}
                            designation={toUpper(teamData.designation)}
                            address={toUpper(teamData.address)}
                            number={teamData.phoneNumber}
                            email={teamData.email}
                            profileUrl={teamData.profileImage}
                            // teamData={teamData}
                            // isCrm='true'
                            // isCrmLogged={isCRM}
                            isEditAllowed={isCrmAddTeam}
                            isActive={teamData.is_active}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                  {/* </Box> */}
                </CardWrapper>)}
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          {/* <Block1 /> */}
        </Grid>
      </Grid>
    </>
  );
}

export default Teamdashboard;
