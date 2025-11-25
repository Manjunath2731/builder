import React,{useEffect,useState} from 'react';
import { Box, useTheme,Typography } from '@mui/material';
import Chart from 'react-apexcharts';

const ChartDesign = ({ bgColor, barColor, data, totalDays ,heightChart,isXAxis}) => {
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
    colors: [ barColor],
    fill: {
      opacity: 1
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '15px'
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
        show: true
      },
      labels: {
        show: isXAxis ==='true' ,
        style: {
          colors: theme.palette.common.white
        }
      }
    },
    yaxis: {
      tickAmount: 6,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        style: {
          colors: theme.palette.common.white
        }
      }
    }
  };
  const chartData = [
    {
      name: 'Visitors',
      type: 'column',
      data: []
    }
  ];
  const [chartOptionsState,setOptions] = useState(chartOptions);
  const [chartDataSeries,setChartDataSeries] = useState(chartData);
  useEffect(()=>{
    setOptions(prevState=>({
      ...prevState,
      labels: totalDays
    }))
    let tempData = [...chartDataSeries];
    let tempDataItem = {...tempData[0]};
    tempDataItem.data = [...data];
    tempData[1] = tempDataItem
    setChartDataSeries(tempData);
  },[data,totalDays])
  return (
    <>
      <Box
        sx={{
          height: '100%',
          width:'100%',
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
          {data.length>0?(
            <Chart
            options={chartOptionsState}
            series={chartDataSeries}
            type="bar"
            height={heightChart}
          />
          ): <Box
          sx={{
            padding:'32px',
            background: '#0067c7',
            color: '#fbd25a'
          }}
        ><Typography sx={{ fontWeight: 'bold',marginLeft:'42%' }}>No Data Found</Typography></Box>}
        </Box>
      </Box>
    </>
  );
};

export default ChartDesign;
