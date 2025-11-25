// import React,{useEffect} from 'react';
// import ReactApexChart from "react-apexcharts";
// import { Card, Box, Typography, Divider, } from '@mui/material';
// import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
// import { useDispatch, useSelector } from 'react-redux';
// import { getYourRegistration } from 'src/slices/dashboard';
// import "./index.css";

// const YourRegistrations = () => {
//   const dispatch = useDispatch();

//   const registrationData = useSelector((state) => state.dashboard?.yourregistration);

//   useEffect(async () => {
//     dispatch(getYourRegistration());
//   }, []);


//   const lineStyle1 = {
//     width: "50px",
//     height: "7px",
//     backgroundColor: '#CF99CA',
//     '&:hover': {
//       backgroundColor: '#CF99CA',
//       opacity: [0.9, 0.8, 0.7],
//     },

//     marginTop: "22px",
//     borderRadius: "5px",
//     marginLeft: "15px"
//   };
//   const lineStyle2 = {
//     width: "50px",
//     height: "7px",
//     backgroundColor: '#E7CCE4',
//     '&:hover': {
//       backgroundColor: '#E7CCE4',
//       opacity: [0.9, 0.8, 0.7],
//     },

//     marginTop: "22px",
//     borderRadius: "5px",
//     marginLeft: "15px"
//   };
//   // Sample data
//   const series = [
//     {
//       name: "Your Registrations",
//       data: registrationData?.past15daysyour?.map(i => i.count),
//       color: '#CF99CA'
//     },
//     {
//       name: "Total Registrations",
//       data: registrationData?.past15daystotal?.map(i => i.count),
//       color: '#E7CCE4'
//     }
//   ];

//   const options = {
//     chart: {
//       type: "bar",
//       height: 160,
//       stacked: true // Enable stacking of bars
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: "20%",
//         endingShape: "rounded",
//         borderRadius: 4
//       }
//     },
//     dataLabels: {
//       enabled: false
//     },
//     xaxis: {
//       categories: [
//         "1",
//         " 2",
//         " 3",
//         " 4",
//         " 5",
//         " 6",
//         " 7",
//         " 8",
//         " 9",
//         " 10",
//         " 11",
//         " 12",
//         " 13",
//         " 14",
//         " 15"
//       ]
//     },
//     yaxis: {
//       show: false,
//       title: {
//         text: "Data"
//       }
//     },
//     legend: {
//       position: "top"
//     },
//   };

//   const today = new Date();

//   let fifteenDaysAgo = new Date();
//   fifteenDaysAgo.setDate(today.getDate() - 15);

//   const formattedDate = fifteenDaysAgo.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });

//   const formattedDatetoday = today.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });

//   return (
//     <Box sx={{ py: 2 }}>

//       <Typography sx={{ fontWeight: 'bold',fontSize:"13px" }}>YOUR REGISTRATIONS</Typography>
//       <Card sx={{ mt: 1 }} id= "card-resg" >
//         <Box>
//           <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
//             <Box style={{ display: 'flex', flexDirection: 'row' }}>
//               <Box style={{ marginLeft: "5px" }} >
//                 <Box sx={lineStyle1} />
//                 <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "15px", marginTop: "5px" }}>Your Registrations</Typography>
//                 <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{registrationData?.yourtotalregistartion}</Typography>
//               </Box>
//               <Box style={{ marginLeft: "45px" }}  >
//                 <Box sx={lineStyle2} />
//                 <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "15px", marginTop: "5px" }}>Total Registrations</Typography>
//                 <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{registrationData?.totalregistartion}</Typography>
//               </Box>
//             </Box>
//             <Box style={{ marginRight: "35px" }} >
//               <Typography variant="h6" style={{ fontSize: "12px",  marginTop: "30px", color: '#8C8C8C' }}>From:{formattedDate} to {formattedDatetoday}</Typography>
//             </Box>
//           </Box>
//         </Box>
//         <Box style={{ marginTop: "-21px" }} id= "chart-resg">
//           <ReactApexChart
//             options={options}
//             series={series}
//             type="bar"
//             height={160}
//           />
//           <style>{`
//           .apexcharts-toolbar {
//             display: none !important;
//           }
//           .apexcharts-legend-marker,
//           .apexcharts-legend-text {
//             display: none !important;
//           }
        
//         `}</style>
//         </Box>
//         <Divider />
//         <Box style={{ display: 'flex', flexDirection: 'row', padding: "11px", marginLeft: "12px" }}>
//           <Typography style={{ color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold', textDecoration: 'underline', }} >
//             0 potential registrations
//           </Typography>
//           <ChevronRightTwoToneIcon
//             sx={{ fontSize: "24px", fontWeight: '100', color: "#0B7DE9" }}
//           />
//         </Box>

//       </Card>
//     </Box>
//   );
// }

// export default YourRegistrations;

import React from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, Box, Typography, Divider } from '@mui/material';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import "./index.css";

const YourRegistrations = () => {
  // Hardcoded data
  const registrationData = {
    yourtotalregistartion: 87,
    totalregistartion: 245,
    past15daysyour: [
      { count: 5 }, { count: 7 }, { count: 6 }, { count: 9 }, { count: 5 },
      { count: 8 }, { count: 10 }, { count: 6 }, { count: 7 }, { count: 9 },
      { count: 6 }, { count: 5 }, { count: 7 }, { count: 6 }, { count: 4 }
    ],
    past15daystotal: [
      { count: 15 }, { count: 17 }, { count: 16 }, { count: 19 }, { count: 15 },
      { count: 18 }, { count: 20 }, { count: 16 }, { count: 17 }, { count: 19 },
      { count: 16 }, { count: 15 }, { count: 17 }, { count: 16 }, { count: 14 }
    ]
  };

  const lineStyle1 = {
    width: "50px",
    height: "7px",
    backgroundColor: '#CF99CA',
    marginTop: "22px",
    borderRadius: "5px",
    marginLeft: "15px"
  };

  const lineStyle2 = {
    width: "50px",
    height: "7px",
    backgroundColor: '#E7CCE4',
    marginTop: "22px",
    borderRadius: "5px",
    marginLeft: "15px"
  };

  const series = [
    {
      name: "Your Registrations",
      data: registrationData?.past15daysyour?.map(i => i.count),
      color: '#CF99CA'
    },
    {
      name: "Total Registrations",
      data: registrationData?.past15daystotal?.map(i => i.count),
      color: '#E7CCE4'
    }
  ];

  const options = {
    chart: {
      type: "bar",
      height: 160,
      stacked: true
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
      categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]
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
    month: "short",
    day: "numeric",
  });

  const formattedDatetoday = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Box sx={{ py: 2 }}>
      <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>YOUR REGISTRATIONS</Typography>
      <Card sx={{ mt: 1 }} id="card-resg">
        <Box>
          <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ marginLeft: "5px" }}>
                <Box sx={lineStyle1} />
                <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "15px", marginTop: "5px" }}>Your Registrations</Typography>
                <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{registrationData?.yourtotalregistartion}</Typography>
              </Box>
              <Box style={{ marginLeft: "45px" }}>
                <Box sx={lineStyle2} />
                <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "15px", marginTop: "5px" }}>Total Registrations</Typography>
                <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{registrationData?.totalregistartion}</Typography>
              </Box>
            </Box>
            <Box style={{ marginRight: "35px" }}>
              <Typography variant="h6" style={{ fontSize: "12px", marginTop: "30px", color: '#8C8C8C' }}>From:{formattedDate} to {formattedDatetoday}</Typography>
            </Box>
          </Box>
        </Box>
        <Box style={{ marginTop: "-21px" }} id="chart-resg">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
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
          <Typography style={{ color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold', textDecoration: 'underline' }}>
            0 potential registrations
          </Typography>
          <ChevronRightTwoToneIcon sx={{ fontSize: "24px", fontWeight: '100', color: "#0B7DE9" }} />
        </Box>
      </Card>
    </Box>
  );
}

export default YourRegistrations;