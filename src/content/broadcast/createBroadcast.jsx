import React, { useState } from 'react'; //  { useState }
import {
  Box,
  Card,
  styled,
  //   Grid,
  //   InputLabel,
  //   Button,
  useTheme,
  Typography,
  Button
  //   TextField,
  //   Select,
  //   MenuItem,
  //   Checkbox,
  //   Divider ,
  //  Card, Divider
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {
  GeneralUpdates,
  OffersForBrokers,
  OffersForBuyers,
  ProjectUpdates,
  EventsNPools
} from 'src/constants/BroadcastConstants';
import { updateBroadcastCategory, updateBroadcastTitle } from '../../slices/broadcast';
// import FormControl from '@mui/material/FormControl';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import { TabPanel, TabList, TabContext } from '@mui/lab';

// import PageHeader from '../PageHeader';

const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      z-index: 5;
      height:100%;
      width: 100%;
      }
    `
);



const CreateBroadcast = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showSubType = {
    generalUpdates: true,
    offerBrokers: true,
    offerBuyers: true,
    projectUpdates: true,
    eventPools: true
  };

  const category = {
    GENERAL_UPDATES: 'GENERAL_UPDATES',
    OFFERS_FOR_BROKERS: 'OFFER_BROKERS',
    OFFERS_FOR_BUYERS: 'OFFER_BUYERS',
    PROJECT_UPDATES: 'PROJECT_UPDATES',
    EVENTS_AND_POOLS: 'EVENTS_POLLS'
  };

  const [showAllGeneralUpdates, setShowAllGeneralUpdates] = useState(false);
  const [showAllOffersForBrokers, setShowAllOffersForBrokers] = useState(false);
  const [showAllOffersForBuyers, setShowAllOffersForBuyers] = useState(false);
  const [showAllProjectUpdates, setShowAllProjectUpdates] = useState(false);
  const [showAllEventsNPools, setShowAllEventsNPools] = useState(false);

  const toggleShowAll = (stateSetter) => {
    stateSetter((prevValue) => !prevValue);
  };



  return (
    <>
      <Box sx={{ py: 2, pl: { xs: 5, lg: 6 }, pr: { xs: 5, md: 6 } }} >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start"

          onClick={() => {
            navigate('/broadcast');
          }}
          mb={1}
        >
          <ArrowBackIosNewIcon fontSize="small" sx={{ cursor: "pointer" }} />
          <Typography
            sx={{
              fontSize: `${theme.typography.pxToRem(15)}`,
            }}
            variant="h4"
          >
            CREATE BROADCAST
          </Typography>
        </Box>
        <CardWrapper sx={{ mt: 3 }}>
          <Box autoComplete="off" my={1} mx={6} mt={4}>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(15)}`,
                mb: 1
              }}
              variant="subtitle1"
            >
              1 of 2
            </Typography>

            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(17)}`,
                mb: 1,
                mt: 1
              }}
              variant="h2"
            >
              SELECT BROADCAST TYPE
            </Typography>

            <Box
              sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'flex-start',
                columnGap: 2.0,
                width: '100%'
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Button
                  // variant="outlined"
                  size="large"
                  sx={{
                    mb: 0.25,
                    mr: 2,
                    backgroundColor: '#8F74FA',
                    color: '#ffffff',
                    '&:hover': { color: '#ffffff', backgroundColor: "#a792f7" },
                    width: '100%',
                    textAlign: { xs: 'left', xl: 'center' },
                    lineHeight: 1.5,
                    // paddingRight: { md: '30%', lg: '50%', xl: '1%' }
                  }}
                  onClick={() => {
                    dispatch(updateBroadcastCategory(category.GENERAL_UPDATES));
                    navigate(`/broadcast/add-broadcast`);
                  }}
                >
                  General Updates
                </Button>
                {showSubType?.generalUpdates ? (
                  <Box mb={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        backgroundColor: '#e9e3fd',
                        borderRadius: 0.5,
                        padding: 1,
                        pl: 1.7,
                        mt: 1.5
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: `${theme.typography.pxToRem(12)}`,
                          mb: 0.5,
                          mt: 1
                        }}
                        style={{ color: '#9074fc' }}
                        variant="body1"
                      >
                        Few examples are...
                      </Typography>
                      {/* {GeneralUpdates.map((item) => {
                      return (
                        <Typography
                          sx={{
                            fontSize: `${theme.typography.pxToRem(12)}`,
                            mb: 0.5,
                            mt: 1,
                            '&:hover': {color: '#9074fc'},
                            cursor:'pointer',
                            color: '#736e84',
                          }}
                          variant="body1"
                          onClick={() => {
                    dispatch(updateBroadcastTitle(item,category.GENERAL_UPDATES));
                    navigate(`/broadcast/add-broadcast`);
                  }}
                        >
                          {item}
                        </Typography>
                      );
                    })} */}

                      {GeneralUpdates.map((item, index) => {
                        return (
                          <Typography
                            sx={{
                              fontSize: `${theme.typography.pxToRem(12)}`,
                              mb: 0.5,
                              mt: 1,
                              '&:hover': { color: '#9074fc' },
                              cursor: 'pointer',
                              color: '#736e84',
                              display: (showAllGeneralUpdates || index < 8) ? 'block' : 'none',
                            }}
                            variant="body1"
                            onClick={() => {
                              dispatch(updateBroadcastTitle(item, category.GENERAL_UPDATES));
                              navigate(`/broadcast/add-broadcast`);
                            }}
                          >
                            {item}
                          </Typography>
                        );
                      })}
                      {GeneralUpdates.length > 8 && (
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: `${theme.typography.pxToRem(12)}`,
                            color: '#736e84',
                            cursor: 'pointer',
                            textDecoration: "underline",
                            fontWeight: "bold"

                          }}
                          onClick={() => toggleShowAll(setShowAllGeneralUpdates)}
                        >
                          {showAllGeneralUpdates ? 'Show Close' : 'Show All'}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : null}

              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Button
                  size="large"
                  sx={{
                    mb: 0.25,
                    mr: 2,
                    backgroundColor: '#F8A38E',
                    color: '#6C4339',
                    '&:hover': { color: '#ffffff', backgroundColor: "#fcb5a4" },
                    width: '100%',
                    textAlign: { xs: 'left', xl: 'center' },
                    lineHeight: 1.5,
                    // paddingRight: '30%',
                  }}
                  onClick={() => {
                    dispatch(
                      updateBroadcastCategory(category.OFFERS_FOR_BROKERS)
                    );
                    navigate(`/broadcast/add-broadcast`);
                  }}
                >
                  Offers for Brokers
                </Button>

                {showSubType?.offerBrokers ? (
                  <Box mb={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        backgroundColor: '#feece8',
                        borderRadius: 0.5,
                        padding: 1,
                        pl: 1.7,
                        lineHeight: 1.5, mt: 1.5
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: `${theme.typography.pxToRem(12)}`,
                          mb: 0.5,
                          mt: 1
                        }}
                        style={{ color: '#f9a48f' }}
                        variant="body1"
                      >
                        Few examples are...
                      </Typography>
                      {/* {OffersForBrokers.map((item) => {
                      return (
                        <Typography
                          sx={{
                            fontSize: `${theme.typography.pxToRem(12)}`,
                            mb: 0.5,
                            mt: 1,
                            '&:hover': { color: '#f9a48f' },
                            cursor: 'pointer',
                            color: '#736e84'
                          }}
                          variant="body1"
                          onClick={() => {
                            dispatch(updateBroadcastTitle(item, category.OFFERS_FOR_BROKERS));
                            navigate(`/broadcast/add-broadcast`);
                          }}
                        >
                          {item}
                        </Typography>
                      );
                    })} */}
                      {OffersForBrokers.map((item, index) => {
                        return (
                          <Typography
                            sx={{
                              fontSize: `${theme.typography.pxToRem(12)}`,
                              mb: 0.5,
                              mt: 1,
                              '&:hover': { color: '#f9a48f' },
                              cursor: 'pointer',
                              color: '#736e84',
                              display: (showAllOffersForBrokers || index < 8) ? 'block' : 'none',
                            }}
                            variant="body1"
                            onClick={() => {
                              dispatch(updateBroadcastTitle(item, category.OFFERS_FOR_BROKERS));
                              navigate(`/broadcast/add-broadcast`);
                            }}
                          >
                            {item}
                          </Typography>
                        );
                      })}
                      {OffersForBrokers.length > 8 && (
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: `${theme.typography.pxToRem(12)}`,
                            color: '#736e84',
                            cursor: 'pointer',
                            textDecoration: "underline",
                            fontWeight: "bold"

                          }}
                          onClick={() => toggleShowAll(setShowAllOffersForBrokers)}
                        >
                          {showAllOffersForBrokers ? 'Show Close' : 'Show All'}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : null}
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Button
                  size="large"
                  sx={{
                    mb: 0.25,
                    mr: 2,
                    backgroundColor: '#CF99CA',
                    color: '#584056',
                    '&:hover': { color: '#ffffff', backgroundColor: "#d6a9d1" },

                    textAlign: { xs: 'left', xl: 'center' },
                    lineHeight: 1.5,
                    width: '100%',
                    // paddingRight: { md: '30%', lg: '50%', xl: '1%' }
                  }}
                  onClick={() => {
                    dispatch(
                      updateBroadcastCategory(category.OFFERS_FOR_BUYERS)
                    );
                    navigate(`/broadcast/add-broadcast`);
                  }}
                >
                  Offers for Buyers
                </Button>

                {showSubType?.offerBuyers ? (
                  <Box mb={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        backgroundColor: '#f5ebf4',
                        borderRadius: 0.5,
                        padding: 1,
                        pl: 1.7, mt: 1.5
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: `${theme.typography.pxToRem(12)}`,
                          mb: 0.5,
                          mt: 1
                        }}
                        style={{ color: '#d199ca' }}
                        variant="body1"
                      >
                        Few examples are...
                      </Typography>
                      {/* {OffersForBuyers.map((item) => {
                      return (
                        <Typography
                          sx={{
                            fontSize: `${theme.typography.pxToRem(12)}`,
                            mb: 0.5,
                            mt: 1,
                            '&:hover': { color: '#d199ca' },
                            cursor: 'pointer',
                            color: '#736e84'
                          }}
                          variant="body1"
                          onClick={() => {
                            dispatch(updateBroadcastTitle(item, category.OFFERS_FOR_BUYERS));
                            navigate(`/broadcast/add-broadcast`);
                          }}
                        >
                          {item}
                        </Typography>
                      );
                    })} */}
                      {OffersForBuyers.map((item, index) => {
                        return (
                          <Typography
                            sx={{
                              fontSize: `${theme.typography.pxToRem(12)}`,
                              mb: 0.5,
                              mt: 1,
                              '&:hover': { color: '#d199ca' },
                              cursor: 'pointer',
                              color: '#736e84',
                              display: (showAllOffersForBuyers || index < 8) ? 'block' : 'none',
                            }}
                            variant="body1"
                            onClick={() => {
                              dispatch(updateBroadcastTitle(item, category.OFFERS_FOR_BUYERS));
                              navigate(`/broadcast/add-broadcast`);
                            }}
                          >
                            {item}
                          </Typography>
                        );
                      })}
                      {OffersForBuyers.length > 8 && (

                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: `${theme.typography.pxToRem(12)}`,
                            color: '#736e84',
                            cursor: 'pointer',
                            textDecoration: "underline",
                            fontWeight: "bold"

                          }}
                          onClick={() => toggleShowAll(setShowAllOffersForBuyers)}
                        >
                          {showAllOffersForBuyers ? 'Show Close' : 'Show All'}
                        </Typography>
                      )}

                    </Box>
                  </Box>
                ) : null}
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Button
                  size="large"
                  sx={{
                    mb: 0.25,
                    mr: 2,
                    backgroundColor: '#49D0DA',
                    color: '#255357',
                    '&:hover': { color: '#ffffff', backgroundColor: "#88d5db" },

                    textAlign: { xs: 'left', xl: 'center' },
                    lineHeight: 1.5,
                    width: '100%',
                    // paddingRight: { md: '30%', lg: '50%', xl: '1%' }
                  }}
                  onClick={() => {
                    dispatch(updateBroadcastCategory(category.PROJECT_UPDATES));
                    navigate(`/broadcast/add-broadcast`);
                  }}
                >
                  Project Updates
                </Button>

                {showSubType?.projectUpdates ? (
                  <Box mb={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        backgroundColor: '#daf6f7',
                        borderRadius: 0.5,
                        padding: 1,
                        pl: 1.7, mt: 1.5
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: `${theme.typography.pxToRem(12)}`,
                          mb: 0.5,
                          mt: 1
                        }}
                        style={{ color: '#4bcfd9' }}
                        variant="body1"
                      >
                        Few examples are...
                      </Typography>
                      {/* {ProjectUpdates.map((item) => {
                      return (
                        <Typography
                          sx={{
                            fontSize: `${theme.typography.pxToRem(12)}`,
                            mb: 0.5,
                            mt: 1,
                            '&:hover': { color: '#4bcfd9' },
                            cursor: 'pointer',
                            color: '#736e84'
                          }}
                          variant="body1"
                          onClick={() => {
                            dispatch(updateBroadcastTitle(item, category.PROJECT_UPDATES));
                            navigate(`/broadcast/add-broadcast`);
                          }}
                        >
                          {item}
                        </Typography>
                      );
                    })} */}
                      {ProjectUpdates.map((item, index) => {
                        return (
                          <Typography
                            sx={{
                              fontSize: `${theme.typography.pxToRem(12)}`,
                              mb: 0.5,
                              mt: 1,
                              '&:hover': { color: '#4bcfd9' },
                              cursor: 'pointer',
                              color: '#736e84',
                              display: (showAllProjectUpdates || index < 8) ? 'block' : 'none',
                            }}
                            variant="body1"
                            onClick={() => {
                              dispatch(updateBroadcastTitle(item, category.PROJECT_UPDATES));
                              navigate(`/broadcast/add-broadcast`);
                            }}
                          >
                            {item}
                          </Typography>
                        );
                      })}
                      {ProjectUpdates.length > 8 && (
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: `${theme.typography.pxToRem(12)}`,
                            color: '#736e84',
                            cursor: 'pointer',
                            textDecoration: "underline",
                            fontWeight: "bold"

                          }}
                          onClick={() => toggleShowAll(setShowAllProjectUpdates)}
                        >
                          {showAllProjectUpdates ? 'Show Close' : 'Show All'}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : null}
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Button
                  size="large"
                  sx={{
                    mb: 0.25,
                    mr: 2,
                    backgroundColor: '#F5D06E',
                    color: '#4A4129',
                    '&:hover': { color: '#ffffff', backgroundColor: "#a792f7" },
                    textAlign: { xs: 'left', xl: 'center' },

                    lineHeight: 1.5,
                    width: '100%',
                    // paddingRight: { md: '30%', lg: '50%', xl: '1%' }
                  }}
                  onClick={() => {
                    dispatch(
                      updateBroadcastCategory(category.EVENTS_AND_POOLS)
                    );
                    navigate(`/broadcast/add-broadcast`);
                  }}
                >
                  Events & Polls
                </Button>

                {showSubType?.eventPools ? (
                  <Box mb={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        backgroundColor: '#e9e3fd',
                        borderRadius: 0.5,
                        padding: 1,
                        pl: 1.7, mt: 1.5
                      }}
                    >
                      {' '}
                      <Typography
                        sx={{
                          fontSize: `${theme.typography.pxToRem(12)}`,
                          mb: 0.5,
                          mt: 1
                        }}
                        style={{ color: '#9074fc' }}
                        variant="body1"
                      >
                        Few examples are...
                      </Typography>
                      {/* {EventsNPools.map((item) => {
                      return (
                        <Typography
                          sx={{
                            fontSize: `${theme.typography.pxToRem(12)}`,
                            mb: 0.5,
                            mt: 1,
                            '&:hover': { color: '#9074fc' },
                            cursor: 'pointer',
                            color: '#736e84'
                          }}
                          variant="body1"
                          onClick={() => {
                            dispatch(updateBroadcastTitle(item, category.EVENTS_AND_POOLS));
                            navigate(`/broadcast/add-broadcast`);
                          }}
                        >
                          {item}
                        </Typography>
                      );
                    })} */}
                      {EventsNPools.map((item, index) => {
                        return (
                          <Typography
                            sx={{
                              fontSize: `${theme.typography.pxToRem(12)}`,
                              mb: 0.5,
                              mt: 1,
                              '&:hover': { color: '#9074fc' },
                              cursor: 'pointer',
                              color: '#736e84',
                              display: (showAllEventsNPools || index < 8) ? 'block' : 'none',
                            }}
                            variant="body1"
                            onClick={() => {
                              dispatch(updateBroadcastTitle(item, category.EVENTS_AND_POOLS));
                              navigate(`/broadcast/add-broadcast`);
                            }}
                          >
                            {item}
                          </Typography>
                        );
                      })}
                      {EventsNPools.length > 8 && (
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: `${theme.typography.pxToRem(12)}`,
                            color: '#736e84',
                            cursor: 'pointer',
                            textDecoration: "underline",
                            fontWeight: "bold"
                          }}
                          onClick={() => toggleShowAll(setShowAllEventsNPools)}
                        >
                          {showAllEventsNPools ? 'Show Close' : 'Show All'}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : null}
              </Box>
            </Box>
          </Box>
        </CardWrapper>
      </Box>
    </>
  );
};

export default CreateBroadcast;
