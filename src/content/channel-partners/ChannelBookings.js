import React, { useEffect } from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, Box, Typography, Divider, } from '@mui/material';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import { useDispatch, useSelector } from 'react-redux';
import { getYourBookings } from 'src/slices/channelPartner';
// import "./index.css";

const ChannelBookings = ({brokerId}) => {

  const dispatch = useDispatch();

  const bookingsData = useSelector((state) => state.channelPartner?.yourbooking);

  useEffect(async () => {
    dispatch(getYourBookings(brokerId));
  }, []);

//   const lineStyle1 = {
//     width: "50px",
//     height: "7px",
//     backgroundColor: '#49D0DA',
//     '&:hover': {
//       backgroundColor: '#49D0DA',
//       opacity: [0.9, 0.8, 0.7],
//     },

//     marginTop: "22px",
//     borderRadius: "5px",
//     marginLeft: "15px"
//   };
//   const lineStyle2 = {
//     width: "50px",
//     height: "7px",
//     backgroundColor: '#A4E7EC',
//     '&:hover': {
//       backgroundColor: '#A4E7EC',
//       opacity: [0.9, 0.8, 0.7],
//     },

//     marginTop: "22px",
//     borderRadius: "5px",
//     marginLeft: "15px"
//   };
  // Sample data
  const series = [
    {
      name: "Your Visits",
      data: bookingsData?.past12MonthsTotalss?.map(i => i.count),
      color: '#49D0DA'
    },
    // {
    //   name: "Total Visits",
    //   data: bookingsData?.past15daystotal?.map(i => i.count),
    //   color: '#A4E7EC'
    // }
  ];
  const Months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // const currentMonthIndex = new Date().getMonth();
  // let selectedMonths;

  // if (currentMonthIndex >= 9) {
  //   const monthsToShow = 3; 
  //   selectedMonths = allMonths.slice(currentMonthIndex - monthsToShow + 1, currentMonthIndex + 1);
  // } else {
  //   selectedMonths = allMonths.slice(0, 9); 
  // }

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
      categories:Months
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

//   const today = new Date();

//   let fifteenDaysAgo = new Date();
//   fifteenDaysAgo.setDate(today.getDate() - 15);

//   const formattedDate = fifteenDaysAgo.toLocaleDateString("en-US", {
//     day: "numeric",
//     month: "short",
//   });

//   const formattedDatetoday = today.toLocaleDateString("en-US", {
//     day: "numeric",
//     month: "short",
//   });

  return (
    <Box sx={{ py: 2}} id="bookings">

      <Typography sx={{ fontWeight: 'bold',fontSize:"13px", }}>BOOKINGS</Typography>
      <Card sx={{ mt: 1.5 ,height:"auto" }} id="channel-booking">
        <Box>
          <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ marginLeft: "5px" }} >
              {/* <Box sx={lineStyle1} /> */}
              <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "10px", marginTop: "20px" }}>Total</Typography>
                <Typography  style={{ fontSize: "20px", marginLeft: "10px",fontWeight:"bold"}}>{bookingsData?.totalbooking}</Typography>
                {/* <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{bookingsData?.yourtotalbooking}</Typography> */}
              </Box>
              {/* <Box style={{ marginLeft: "45px" }}  >
                <Box sx={lineStyle2} />
                <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "15px", marginTop: "5px" }}>Total Bookings</Typography>
                <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{bookingsData?.totalbookinng}</Typography>
              </Box> */}
            </Box>
            <Box style={{ marginRight: "35px" ,cursor:"pointer" }} >
                <Typography  style={{ fontSize: "13.5px", marginLeft: "15px", marginTop: "30px",color:"#489EEF",}} sx={{fontWeight: '600'}}>View all</Typography>

              {/* <Typography variant="h6" style={{ fontSize: "12px",  marginTop: "30px", color: '#8C8C8C' }}>From:{formattedDate} to {formattedDatetoday}</Typography> */}
            </Box>
          </Box>
        </Box>
        <Box style={{ marginTop: "-21px" }} id= "chart-booking">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={200}
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
          <Typography style={{ color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold', textDecoration: 'underline', }} >
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

export default ChannelBookings;