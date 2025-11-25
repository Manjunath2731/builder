import React, { useEffect } from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, Box, Typography, Divider, } from '@mui/material';
// import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import { useDispatch, useSelector } from 'react-redux';
import { getYourBooking } from 'src/slices/dashboard';
import "./Vip.css";

const ClientVisits = () => {

  const dispatch = useDispatch();

  const bookingsData = useSelector((state) => state.dashboard?.yourbooking);

  useEffect(async () => {
    dispatch(getYourBooking());
  }, []);


  const series = [
    {
      name: "Clent Visits",
      data: bookingsData?.past15daysyour?.map(i => i.count),
      color: '#0078E9'
    },
    // {
    //   name: "Total Visits",
    //   data: bookingsData?.past15daystotal?.map(i => i.count),
    //   color: '#A4E7EC'
    // }
  ];

  const options = {
    chart: {
      type: "bar",
      height: 160,
      stacked: true // Enable stacking of bars
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
        endingShape: "rounded",
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
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

  // const today = new Date();

  // let fifteenDaysAgo = new Date();
  // fifteenDaysAgo.setDate(today.getDate() - 15);

  // const formattedDate = fifteenDaysAgo.toLocaleDateString("en-US", {
  //   day: "numeric",
  //   month: "short",
  // });

  // const formattedDatetoday = today.toLocaleDateString("en-US", {
  //   day: "numeric",
  //   month: "short",
  // });

  return (
    <Box sx={{ py: 2}} id="bookings">

      <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>CLIENT VISITS</Typography>
      <Card sx={{ mt: 1 }} id="Vipcard">
          <Box  style={{ display: 'flex', flexDirection: 'row' }}>
            <Box  py={4}>
              <Box >
            <Typography sx={{ fontSize: "13px",fontWeight: 700,textAlign: 'center', color: "#0078E9"}}> Today's Visits</Typography>

            <Box px={6} style={{ display: 'flex' ,alignItems: 'center', flexDirection: 'column'}}>
              <Typography sx={{ fontSize: "22px", fontWeight: "bold", color: "#0078E9", mt: 3.5 }}> 3456</Typography>
              <Typography  sx={{ fontSize: "13px", fontWeight: 700, color: "#0078E9", mt: 3.5 }}>View All</Typography>

              </Box>
            </Box>
            </Box>
          
           
           
          <Divider orientation="vertical" flexItem />
          <Box style={{ display: 'flex',  flexDirection: 'column',width:"100%" }}  px={5}>
            <Typography sx={{fontsize:"13px",mt:4}} > Last 15 Days visits</Typography>
              <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={150}
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
          </Box>





      </Card>
    </Box>
  );
}

export default ClientVisits;