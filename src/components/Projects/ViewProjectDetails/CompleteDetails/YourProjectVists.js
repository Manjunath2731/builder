import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, Box, Typography, Divider } from '@mui/material';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import { useSelector } from 'react-redux';

const YourProjectVists = () => {

  const visitData = useSelector((state) => state.projectList.clientvisit);

  const series = [
//     {
//       name: 'Your Visits',
//       data: visitData?.past15daysyour?.map((i) => i.count),
//     },
//     {
//       name: 'Total Visits',
//       data: visitData?.past15daystotal?.map((i) => i.count),
//     },
{
          name: 'Your Visits',
          data: visitData?.past15daysyour?.map((i) => i.count),
          color: '#0078E9'
        },
        {
          name: 'Total Visits',
          data: visitData?.past15daystotal?.map((i) => i.count),
          color: '#7FBBF4'
        },
  ];

  const options = {
    chart: {
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
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
      ],
    },
    yaxis: {
      show: false,
      title: {
        text: 'Data',
      },
    },
    legend: {
      position: 'top',
    },
  };

  const today = new Date();

  let fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(today.getDate() - 15);

  const formattedDate = fifteenDaysAgo.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const formattedDatetoday = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Box >
      <Typography sx={{ fontWeight: 'bold', fontSize: '13px' }}>YOUR VISITS</Typography>
      <Card sx={{ mt: 1 }} id="your-project">
        <Box>
          <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ marginLeft: '5px' }}>
                <Box sx={{ width: '50px', height: '7px', backgroundColor: '#0078E9', marginTop: '22px', borderRadius: '5px', marginLeft: '15px' }} />
                <Typography variant="h6" style={{ fontSize: '12px', marginLeft: '15px', marginTop: '5px', width: '100%' }}>
                  Your's
                </Typography>
                <Typography variant="h6" style={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '15px', marginTop: '-5px' }}>
                  {visitData?.yourclientvisit}
                </Typography>
              </Box>
              <Box style={{ marginLeft: '12px' }}>
                <Box sx={{ width: '50px', height: '7px', backgroundColor: '#7FBBF4', marginTop: '22px', borderRadius: '5px', marginLeft: '15px' }} />
                <Typography variant="h6" style={{ fontSize: '12px', marginLeft: '15px', marginTop: '5px', width: '100%' }}>
                  Total
                </Typography>
                <Typography variant="h6" style={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '15px', marginTop: '-5px' }}>
                  {visitData?.totalclientvisit}
                </Typography>
              </Box>
            </Box>
            <Box style={{ marginRight: '35px' }}>
              <Typography variant="h6" style={{ fontSize: '12px', marginTop: '30px', color: '#8C8C8C' }}>
                From: {formattedDate} to {formattedDatetoday}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box style={{ marginTop: '-21px' }}>
          <ReactApexChart options={options} series={series} type="area" height={160} />
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
        <Box style={{ display: 'flex', flexDirection: 'row', padding: '11px', marginLeft: '12px' }}>
          <Typography style={{ color: '#0B7DE9', fontSize: '14px', fontWeight: 'bold', textDecoration: 'underline' }}>
            0 upcoming visits
          </Typography>
          <ChevronRightTwoToneIcon sx={{ fontSize: '24px', fontWeight: '100', color: '#0B7DE9' }} />
        </Box>
      </Card>
    </Box>
  );
};

export default YourProjectVists;
