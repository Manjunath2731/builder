import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import EventList from './EventsList';
import { getAllBrokers } from '../../slices/Events';

const EventsPolls = () => {
  const dispatch = useDispatch();

  const headerTitle = [
    { label: 'Event', value: 'Add_Event' },
    { label: 'Poll', value: 'Add_Poll' }
  ];
  const userData = JSON.parse(window.localStorage.getItem('user'));
  useEffect(() => {
    dispatch(getAllBrokers(userData?.userId));
  }, []);

  return (
    <>
      <Helmet>
        <title>Events</title>
      </Helmet>
      <Box sx={{ml: 4, pt: 4, pl: { xs: 5, lg: 0 }, pr: { xs: 5, md: 7 } }}>
        <PageHeader title="EVENTS" addTitle={headerTitle[0]} />
      </Box>
      <EventList  addTitle={headerTitle[0]}/>
    </>
  );
};

export default EventsPolls;
