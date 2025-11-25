import React from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, Box, Typography, Divider, } from '@mui/material';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import { useSelector } from 'react-redux';

const YourProjectBookings = () => {

  const bookingsData = useSelector((state) => state.projectList.booking);

  const lineStyle1 = {
    width: "50px",
    height: "7px",
    backgroundColor: '#49D0DA',
    '&:hover': {
      backgroundColor: '#49D0DA',
      opacity: [0.9, 0.8, 0.7],
    },

    marginTop: "22px",
    borderRadius: "5px",
    marginLeft: "15px"
  };
  const lineStyle2 = {
    width: "50px",
    height: "7px",
    backgroundColor: '#A4E7EC',
    '&:hover': {
      backgroundColor: '#A4E7EC',
      opacity: [0.9, 0.8, 0.7],
    },

    marginTop: "22px",
    borderRadius: "5px",
    marginLeft: "15px"
  };
  const series = [
    {
      name: "Your Visits",
      data: bookingsData?.past15daysyour?.map(i => i.count),
      // data: [31, 40, 28, 51,45, 32, 34, 52, 41,12,34,60, 42, 109, 100],
      color: '#49D0DA'
    },
    {
      name: "Total Visits",
      data: bookingsData?.past15daystotal?.map(i => i.count),
      // data: [11, 32, 45, 32, 34, 52, 41,45, 32, 34, 52, 41,12,34,60,],
      color: '#A4E7EC'
    }
  ];

  const options = {
    chart:{
          type: 'area',
          height: 'auto',
          stacked: true,
        },
        plotOptions: {
          area: {
            horizontal: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
    xaxis: {
      categories: [
        "1",
        " 2",
        " 3",
        " 4",
        " 5",
        " 6",
        " 7",
        " 8",
        " 9",
        " 10",
        " 11",
        " 12",
        " 13",
        " 14",
        " 15"
      ]
    },
    yaxis: {
      show: false,
      title: {
        text: "Data"
      }
    },
    legend: {
      position: "top"
    },
  };

  const today = new Date();

  let fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(today.getDate() - 15);

  const formattedDate = fifteenDaysAgo.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  const formattedDatetoday = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  return (
    <Box>

      <Typography sx={{ fontWeight: 'bold',fontSize:"13px" }}>YOUR BOOKINGS</Typography>
      <Card sx={{ mt: 1 }} id="your-booking">
        <Box>
          <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ marginLeft: "5px" }} >
                <Box sx={lineStyle1} />
                <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "15px", marginTop: "5px" }}>Your's</Typography>
                <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{bookingsData?.yourtotalbooking}</Typography>
              </Box>
              <Box style={{ marginLeft: "12px" }}  >
                <Box sx={lineStyle2} />
                <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "15px", marginTop: "5px" }}>Total </Typography>
                <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{bookingsData?.totalbookinng}</Typography>
              </Box>
            </Box>
            <Box style={{ marginRight: "35px" }} >
              <Typography variant="h6" style={{ fontSize: "12px", marginTop: "30px", color: '#8C8C8C' }}>From:{formattedDate} to {formattedDatetoday}</Typography>
            </Box>
          </Box>
        </Box>
        <Box style={{ marginTop: "-21px" }} >
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={160}
          />
          <style>{`
          .apexcharts-toolbar {
            display: none !important;
          }
          .apexcharts-legend-marker,
          .apexcharts-legend-text {
            display: none !important;
          }
        
        `}</style>
        </Box>
        <Divider />
        <Box style={{ display: 'flex', flexDirection: 'row', padding: "11px", marginLeft: "12px" }}>
          <Typography style={{ color: "#0B7DE9", fontSize: "14px", fontWeight: 'bold', textDecoration: 'underline', }} >
            0 potential bookings
          </Typography>
          <ChevronRightTwoToneIcon
            sx={{ fontSize: "24px", fontWeight: '100', color: "#0B7DE9" }}
          />
        </Box>

      </Card>
    </Box>
  );
}

export default YourProjectBookings;