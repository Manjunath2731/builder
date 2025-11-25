// import React, { useEffect } from 'react';
// import ReactApexChart from "react-apexcharts";
// import { Card, Box, Typography, Divider, } from '@mui/material';
// import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
// import { getYourVisit } from 'src/slices/dashboard';
// import { useDispatch, useSelector } from 'react-redux';
// import "./index.css";

// const YourVists = () => {
//   const dispatch = useDispatch();

//   const visitData = useSelector((state) => state.dashboard?.yourvisit);

//   useEffect(async () => {
//     dispatch(getYourVisit());
//   }, []);

//   const lineStyle1 = {
//     width: "50px",
//     height: "7px",
//     backgroundColor: '#0078E9',
//     '&:hover': {
//       backgroundColor: '#0078E9',
//       opacity: [0.9, 0.8, 0.7],
//     },

//     marginTop: "22px",
//     borderRadius: "5px",
//     marginLeft: "15px"
//   };
//   const lineStyle2 = {
//     width: "50px",
//     height: "7px",
//     backgroundColor: '#7FBBF4',
//     '&:hover': {
//       backgroundColor: '#7FBBF4',
//       opacity: [0.9, 0.8, 0.7],
//     },

//     marginTop: "22px",
//     borderRadius: "5px",
//     marginLeft: "15px"
//   };
//   // Sample data
//   const series = [
//     {
//       name: "Your Visits",
//       data: visitData?.past15daysyour?.map(i => i.count),
//       color: '#0078E9'
//     },
//     {
//       name: "Total Visits",
//       data: visitData?.past15daystotal?.map(i => i.count),
//       color: '#7FBBF4'
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
//     <Box sx={{ py: 2, ml: 3 }} id="vists">

//       <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>YOUR VISITS</Typography>
//       <Card sx={{ mt: 1 }} id="card-visits">
//         <Box>
//           <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
//             <Box style={{ display: 'flex', flexDirection: 'row' }}>
//               <Box style={{ marginLeft: "5px" }} >
//                 <Box sx={lineStyle1} />
//                 <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "15px", marginTop: "5px" }}>Your Visits</Typography>
//                 <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{visitData?.yourclientvisit}</Typography>
//               </Box>
//               <Box style={{ marginLeft: "45px" }}  >
//                 <Box sx={lineStyle2} />
//                 <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "15px", marginTop: "5px" }}>Total Visits</Typography>
//                 <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{visitData?.totalclientvisit}</Typography>
//               </Box>
//             </Box>
//             <Box style={{ marginRight: "35px" }} >
//               <Typography variant="h6" style={{ fontSize: "12px",  marginTop: "30px", color: '#8C8C8C' }}>From:{formattedDate} to {formattedDatetoday}</Typography>
//             </Box>
//           </Box>
//         </Box>
//         <Box style={{ marginTop: "-21px" }} id="chart-vists">
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
//             0 upcoming visits
//           </Typography>
//           <ChevronRightTwoToneIcon
//             sx={{ fontSize: "24px", fontWeight: '100', color: "#0B7DE9" }}
//           />
//         </Box>

//       </Card>
//     </Box>
//   );
// }

// export default YourVists;


// YourVisits.js
import React from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, Box, Typography, Divider } from '@mui/material';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import "./index.css";

export const YourVists = () => {
  // Hardcoded data
  const visitData = {
    yourclientvisit: 145,
    totalclientvisit: 320,
    past15daysyour: [
      { count: 8 }, { count: 12 }, { count: 10 }, { count: 15 }, { count: 9 },
      { count: 11 }, { count: 14 }, { count: 10 }, { count: 13 }, { count: 16 },
      { count: 12 }, { count: 9 }, { count: 11 }, { count: 10 }, { count: 5 }
    ],
    past15daystotal: [
      { count: 18 }, { count: 22 }, { count: 20 }, { count: 25 }, { count: 19 },
      { count: 21 }, { count: 24 }, { count: 20 }, { count: 23 }, { count: 26 },
      { count: 22 }, { count: 19 }, { count: 21 }, { count: 20 }, { count: 15 }
    ]
  };

  const lineStyle1 = {
    width: "50px",
    height: "7px",
    backgroundColor: '#0078E9',
    marginTop: "22px",
    borderRadius: "5px",
    marginLeft: "15px"
  };

  const lineStyle2 = {
    width: "50px",
    height: "7px",
    backgroundColor: '#7FBBF4',
    marginTop: "22px",
    borderRadius: "5px",
    marginLeft: "15px"
  };

  const series = [
    {
      name: "Your Visits",
      data: visitData?.past15daysyour?.map(i => i.count),
      color: '#0078E9'
    },
    {
      name: "Total Visits",
      data: visitData?.past15daystotal?.map(i => i.count),
      color: '#7FBBF4'
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
    <Box sx={{ py: 2, ml: 3 }} id="vists">
      <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>YOUR VISITS</Typography>
      <Card sx={{ mt: 1 }} id="card-visits">
        <Box>
          <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ marginLeft: "5px" }}>
                <Box sx={lineStyle1} />
                <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "15px", marginTop: "5px" }}>Your Visits</Typography>
                <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{visitData?.yourclientvisit}</Typography>
              </Box>
              <Box style={{ marginLeft: "45px" }}>
                <Box sx={lineStyle2} />
                <Typography variant="h6" style={{ fontSize: "12px", marginLeft: "15px", marginTop: "5px" }}>Total Visits</Typography>
                <Typography variant="h6" style={{ fontSize: "24px", fontWeight: 'bold', marginLeft: "15px", marginTop: "-5px" }}>{visitData?.totalclientvisit}</Typography>
              </Box>
            </Box>
            <Box style={{ marginRight: "35px" }}>
              <Typography variant="h6" style={{ fontSize: "12px", marginTop: "30px", color: '#8C8C8C' }}>From:{formattedDate} to {formattedDatetoday}</Typography>
            </Box>
          </Box>
        </Box>
        <Box style={{ marginTop: "-21px" }} id="chart-vists">
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
            0 upcoming visits
          </Typography>
          <ChevronRightTwoToneIcon sx={{ fontSize: "24px", fontWeight: '100', color: "#0B7DE9" }} />
        </Box>
      </Card>
    </Box>
  );
}

 export default YourVists;