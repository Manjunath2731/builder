import React, { useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  useTheme
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import CalendarInfo from './calendarInfo';
import { addMeetings } from '../../slices/meetings';
import { DeleteMeetings } from '../../axiosInstances/Api';

function ListView() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const dateChanger = (dateString, type) => {
    let time = '';
    let date = '';
    if (type === 'time') {
      time = new Date(dateString)
        .toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        .toLowerCase();
      return time;
    }
    date = new Date(dateString).toDateString();
    return date;
  };
  let meetings = [];
  meetings = useSelector((state) => state.meeting.data);
  useEffect(() => {}, [meetings]);
  const handleDeleteMeeting = async (id) => {
    await DeleteMeetings(id);
    dispatch(addMeetings());
  };
  return (
    <>
      {meetings.length === 0 && (
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
            No Meetings To Show
          </Typography>
        </Box>
      )}
      <Card sx={{ mr: 4 }}>
        <TableContainer>
          <Table>
            <TableBody>
              {meetings.map((item, index) => {
                return (
                  <TableRow
                    hover
                    key={index}
                    sx={{
                      overflow: 'visible',
                      position: 'relative',
                      pb: 2
                    }}
                  >
                    <CalendarInfo
                      date={dateChanger(item?.startTime, 'date')}
                      startTime={dateChanger(item?.startTime, 'time')}
                      endtime={dateChanger(item?.endTime, 'time')}
                      broker={item?.broker[0]?.name}
                      agenda={item?.agenda}
                      notes={item?.notes}
                      prevData={item}
                      handleDeleteMeeting={handleDeleteMeeting}
                    />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}

export default ListView;
