import React from 'react';
import { Box, useTheme } from '@mui/material';
import Chart from 'react-apexcharts';

const ChartDesignDashboard = ({ bgColor, data, totalDays }) => {
  const theme = useTheme();
  let chartOptions = {
    theme: {
      mode: theme.palette.mode
    },
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#FBD25A', theme.colors.error.main],
    fill: {
      opacity: 1
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '20%'
      }
    },
    labels: [],
    dataLabels: {
      enabled: false
    },
    grid: {
      strokeDashArray: 5,
      borderColor: theme.palette.divider
    },
    legend: {
      show: false
    },
    xaxis: {
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.common.white
        }
      }
    },
    yaxis: {
      show: false,
      tickAmount: 6,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.common.white
        }
      }
    }
  };
  chartOptions.labels = [...totalDays];
  const chartData = [
    {
      name: 'Visitors',
      type: 'column',
      data: []
    }
  ];
  chartData[0].data = [...data];
  return (
    <>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: bgColor
        }}
      >
        <Box
          sx={{
            p: 1
          }}
        >
          <Chart
            options={chartOptions}
            series={chartData}
            type="bar"
            height={250}
            width={630}
          />
        </Box>
      </Box>
    </>
  );
};

export default ChartDesignDashboard;
