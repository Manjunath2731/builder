import React, { useEffect, useState } from 'react';
import { Card,} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSelector } from 'react-redux';
import { toUpper } from '../../utils/utilits';
import MeetingPopUp from './meetingPopUp';
import EditMeeting from './EditMeeting';
import ClientVisitPopup from './ClientVisitPopup';
import './calender.css';


moment.locale('en-GB');
const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [openModal, setOpenModal] = useState(false);
  const [time ,setTime] =useState();
  const [openClientModal, setOpenClientModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedEventEnd, setSelectedEventEnd] = useState({});
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setSelectedEvent({});
  };
  const handleEdit = () => {
    closeModal();
    setOpen(true);
  };
  const closeModal = () => {
    setOpenModal(false);
  };
  const closeClientModal = () => {
    setOpenClientModal(false);
  };
  let meetings = [];
  meetings = useSelector((state) => state.meeting?.data);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    extractEvents(meetings);
  }, [meetings]);

  const getEndTime = (newValue) => {
    const dateStr = new Date(newValue);
    const endDate = new Date(newValue);
    const tempTime = endDate?.setMinutes(dateStr?.getMinutes() + 60);
    return new Date(moment(tempTime));
   };
  const extractEvents = (data) => {
    if (data.length) {
      let tempDate = data?.map((item) => {
        return {
          title: item.agenda ? toUpper(item.agenda) : item.meetingType === "CLIENTVISIT" ? "CLIENT VISIT" : "WALK IN",
          allDay: false,
          start: new Date(item?.startTime),
          end: new Date(item?.endTime).getTime()
            ? new Date(item?.endTime)
            : getEndTime(item.startTime),
          id: item?._id,
          data: item,
          meetingType: item?.meetingType
        };
      });
      setEvents(tempDate);
    }
  };
  const now = new Date();
  now.setDate(now.getDate());
  now.setHours(8);
  now.setMinutes(0);
  now.setMilliseconds(0);
  const handleSelected = (e) => {
    setSelectedEvent(e?.data);
    if (e?.meetingType === 'CLIENTVISIT' || e?.meetingType === 'WALKIN') {
      setOpenClientModal(true);
      setSelectedEventEnd(e?.end);
    } else {
      setOpenModal(true);
    }
  };
  
  
  const eventStyleGetter =(event)=>{
    // const backgroundColor = event?.meetingType === 'CLIENTVISIT' ? '#00a8ff' : 'orange';
    let style = {
      backgroundColor: 'orange',
      color: 'white',
      borderRadius: '0px',
      border: 'none'
    }
  
    if (event.meetingType === 'CLIENTVISIT') {
      style.backgroundColor = '#1985eb'
    } else if (event.meetingType === 'WALKIN') {
      style.backgroundColor = '#19c86c'
    }
    return { style}
  }
  useEffect (()=>{
    setInterval(function() {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit",hour12:false});
      setTime(currentTime);
    }, 1000);
    setTimeout(function(){
      let div = document.getElementsByClassName('rbc-current-time-indicator').item(0);
      // console.log(div);
      let z = document.getElementsByClassName('getTimenow').item(0);
      div.appendChild(z);
      z.classList.add('getTimenowCss')
    })
  },[])
  
  return (
    <>
      <Card sx={{ width: { xs: '100%', md: '100%' }, height: '570px', p: 2 }}>
       <div className='getTimenow'>
        {time}
       </div>

    <Calendar
          events={events}
          step={30}
          view="week"
          views={['week']}
          defaultDate={new Date()}
          localizer={localizer}
          min={localizer.startOf(now)}
          onSelectEvent={handleSelected}
          eventPropGetter={eventStyleGetter}
        />
      </Card>
      {openModal && (
        <MeetingPopUp
          openConfirm={openModal}
          closeConfirm={closeModal}
          data={selectedEvent}
          handleEdit={handleEdit}
        />
      )}
      {open && (
        <EditMeeting
          prevData={selectedEvent}
          open={open}
          handleDetailClose={handleClose}
          editType="button"
        />
      )}
      {openClientModal && (
        <ClientVisitPopup
          openConfirm={openClientModal}
          closeConfirm={closeClientModal}
          data={selectedEvent}
          endTime={selectedEventEnd}
        />
      )}
    </>
  );
};

export default CalendarView;
