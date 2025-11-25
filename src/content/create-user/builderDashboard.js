import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate ,useParams} from 'react-router';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
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
} from '@mui/material';
import Loader from 'src/UI/Loader/Loader.js';
import { isSuperAdmin } from 'src/helpers/userHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { addTeams, addTeamTypes } from '../../slices/team';
import { addRoles } from '../../slices/roles';
import { addGroups } from '../../slices/groups';
import { toUpper } from '../../content/meetings-n-visits/commanFunctions';
import BuilderCard from './BuilderCard.js';
import AssociateCard from './AssociateCard.js';
import { getCities } from '../../slices/cities';
import {
  getAssociate,
} from '../../slices/Associate.js';

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

const SearchInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(18)};
    height: 60px;
    width: 100%;
`
);

function BuilderDashboardReports() {
  const userData = JSON.parse(window.localStorage.getItem('user'));
  const {tabName} = useParams();
  const [value, setValue] = useState('1');
  const [associateList, setAssociateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const getValidValue = (str) => {
  //   if (str !== null && str !== undefined) {
  //     return str;
  //   }
  //   return '';
  // };
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if(newValue==='2'){
      navigate(`/builder-dashboard/associate`)
    }else{
      navigate(`/builder-dashboard/builder`)
    }
  };

  const dispatch = useDispatch();
  const getTab =()=>{
   if(tabName==='associate'){
    setValue('2');
     return }
     setValue('1') 
  }
  useEffect(() => {
    getTab()
    setLoading(true)
    dispatch(addTeams(userData?.builderCompany[0]));
    dispatch(addRoles());
    dispatch(addTeamTypes());
    dispatch(addGroups());
    dispatch(getCities());
    dispatch(getAssociate());
    setLoading(false)
  }, []);

  let teams = [];
  let teamTypes = [];
  let associates = [];
  associates=useSelector((state) => state.associate.allAssociates);
  teamTypes = useSelector((state) => state.team.teams);
  teams = useSelector((state) => state.group.data);
  useEffect(() => {
    setAssociateList(associates);
    setTempTeam(teams);
  }, [teams, teamTypes,associates]);
  const handleNull = (str) => {
    if (str !== null && str !== undefined) {
      return str;
    }
    return '';
  };
  const handleAssociateSearchChange = async (event) => {
    event.preventDefault();

    if (event.target.value === '') {
      setAssociateList(associates);
      setAssociateSearch('');
    } else if(event.target.value.length< 3){
      setAssociateList(associates);
      setAssociateSearch(event.target.value);
    }else if(event.target.value.length >= 3){
      setAssociateSearch(event.target.value);
      filterAssociate(event.target.value);
    }
  };
  
  const filterAssociate = (key = '') => {
    key = key.toLowerCase();
    if(key.length >= 3){
      const matchingItems = associates.filter((item) => {
        const fullName = `${item.firstName.toLowerCase()} ${item.lastName.toLowerCase()}`;
        if(fullName.includes(key)){
          return true;
        }
        return false;
      });

      setAssociateList(matchingItems);
    }
  };

  const handleSearchChange = async (event) => {
    event.preventDefault();

    if (event.target.value === '') {
      setTempTeam(teams);
      setSearchValue('');
    } else if(event.target.value.length < 3 ){
      setTempTeam(teams);
      setSearchValue(event.target.value);
    }else if(event.target.value.length >= 3 ){
      setSearchValue(event.target.value);
      filterWorkOrders(event.target.value);
    }
  };

  const filterWorkOrders = (key = '') => {
    key = key.toLowerCase();
    if(key.length >= 3){
      const matchingItems = teams.filter((item) => {
        const fullName = `${item.name.toLowerCase()}}`;
        if(fullName.includes(key)){
          return true;
        }
        return false;
      });

      setTempTeam(matchingItems);
    }
  };

  const [searchValue, setSearchValue] = useState('');
  const [associateSearch, setAssociateSearch] = useState('')
  const [tempTeam, setTempTeam] = useState([]);
  const theme = useTheme();
  let issuperAdmin =isSuperAdmin()

  return (
    <>
      <Helmet>
        <title>Builder</title>
      </Helmet>
      <Box sx={{ py: 4, pl: { xs: 5, lg: 6 }, pr: { xs: 5, md: 6 } }} >
        <Box sx={{ width: '100%', typography: 'body1' }}>
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
                <Tab label="Builders" value="1" />
                { issuperAdmin &&(<Tab label="Associates" value="2" />)}
              </TabList>
              <Box sx={{display:'flex', alignItems:'center', columnGap:1, rowGap:1}}> 
             {value==='1' &&( <Button
                variant="contained"
                startIcon={<AddTwoToneIcon />}
                sx={{ mt: -2, }}
                onClick={() => navigate(`/create-builder`)}
              >
                Create Builder
              </Button>)}
            { (issuperAdmin  && value==='2') &&(<Button
                variant="contained"
                startIcon={<AddTwoToneIcon />}
                sx={{ mt: -2, }}
                onClick={() => navigate(`/create-associate`)}
              >
                Create Associate
              </Button>)}
                </Box>
            </Box>

            <TabPanel value="1" sx={{ px: 0 }} >
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
                   
                    {tempTeam.length ? (
                      <Grid container sx={{ gridAutoRows:'1fr'}}>
                        {
                           tempTeam.map((item) => {
                            return (
                              <Grid
                              item
                              key={item?.id}
                              xs={12}
                              sm={12}
                              md={6}
                              lg={6}
                              xxl={4}
                            >
                              <BuilderCard
                                item={item}
                                id={item._id}
                                name={`${item?.name.length >18 ? `${item?.name.substring(0, 18)} ...` : item?.name} `}
                                description={item?.description}
                                address={item?.address}
                                city={item?.city}
                                profileUrl={item?.logo}
                                created_at={item?.createdAt}
                                updated_at={item?.updatedAt}
                              />
                               </Grid>
                            );
                          })
                        }
                      </Grid>
                     ):(
                     <Box
                      display="flex"
                      justifyContent="center"
                      textAlign="center "
                      sx={{
                        padding: '35px',
                        margin: 'auto'
                      }}
                    >
                      <Typography
                        variant="h3"
                        pt={10}
                        sx={{ color: theme.palette.grey[500] }}
                        textAlign="center"
                      >
                        {' '}
                        No Builder To Show{' '}
                      </Typography>
                    </Box>)}
                 
                </CardWrapper>
            </TabPanel>
            { issuperAdmin &&(<TabPanel value="2" sx={{ px: 0 }} >
            {loading &&  <Loader /> }
            {!loading &&  (<>
            {associates.length > 0 ? (
              <CardWrapper sx={{ minWidth: 275, minHeight: 275 }}>
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
                      value={associateSearch}
                      onChange={handleAssociateSearchChange}
                      autoFocus
                      placeholder="Type name to search..."
                      fullWidth
                    />
                  </Box>
                </Box>
              </form>
              <Grid container sx={{ gridAutoRows:'1fr'}}>
                {associateList.length >0 ? 
                  (associateList.map((item) => {
                    return (
                      <Grid
                        item
                        key={item?.id}
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        xxl={4}
                        sx={{height:'100%'}}
                      >
                        <AssociateCard
                          key={item?.id}
                          id={item?.id}
                          name={`${toUpper(item?.firstName)} ${toUpper(
                            item?.lastName
                          )}`}
                          number={handleNull(item?.phoneNumber)}
                          email={handleNull(item?.email)}
                          profileUrl={item?.profileImage}
                        />
                      </Grid>
                    );
                  }) ) :(
                    <Box
                    display="flex"
                    justifyContent="center"
                    textAlign="center "
                    sx={{
                      padding: '35px',
                      margin: 'auto'
                    }}
                  >
                    <Typography
                      variant="h3"
                      pt={10}
                      sx={{ color: theme.palette.grey[500] }}
                      textAlign="center"
                    >
                      {' '}
                      No Associate Matched To Show{' '}
                    </Typography>
                  </Box>
                  )} 
               
              </Grid>
              </CardWrapper>
            ) :(
              <>
                    <Box
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
                        No Associate Admin To Show{' '}
                      </Typography>
                    </Box>
                  </>
            )}
            </>) }
            </TabPanel>)}
          </TabContext>
        </Box>
      </Box>
    </>
  );
}

export default BuilderDashboardReports;
