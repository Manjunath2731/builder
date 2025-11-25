import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import {
  Grid,
  Box,
  Card,
  Typography,
  Divider,
  Button,
  CardMedia,
  Stack,
  useTheme
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import ProjectSideBar from './Blocks/ProjectSideBar';
import NotificationBar from './Blocks/NotificationBar';
import Block2 from './Blocks/Block2';
import Block3 from './Blocks/Block3';
import Block4 from './Blocks/Block4';

const BookingDocument = () => {
  const theme = useTheme();
  const docList = [
    { label: 'Document CheckList', updated: '12 May, 2021' },
    { label: 'Booking Form', updated: '15 May, 2021' }
  ];
  return (
    <React.Fragment>
      <Box
        p={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h4">BOOKING INFO</Typography>
        <Button variant="contained">Edit Booking Info</Button>
      </Box>
      <Grid container spacing={3}>
        {docList.map((item, index) => {
          return (
            <Grid item xs={4} key={index}>
              <Card>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <img style={{ height: 120 }} alt="..." />

                  <Typography pt={2} variant="h5">
                    {item.label}
                  </Typography>
                  <Typography pb={2} variant="subtitle2">
                    {`Last updated on ${item.updated}`}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    background: `${theme.colors.alpha.black[10]}`
                  }}
                />
                <Stack
                  direction="row"
                  divider={
                    <Divider
                      sx={{
                        background: `${theme.colors.alpha.black[10]}`
                      }}
                      orientation="vertical"
                      flexItem
                    />
                  }
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={0}
                >
                  <Box
                    p={2}
                    sx={{
                      display: 'flex',
                      alignitems: 'center',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <DownloadIcon fontSize="medium" />
                    <Typography ml={1}>Download</Typography>
                  </Box>
                  <Box
                    p={2}
                    sx={{
                      display: 'flex',
                      alignitems: 'center',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <ShareOutlinedIcon fontSize="medium" />
                    <Typography ml={1}>Share</Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </React.Fragment>
  );
};

const BookingInfo = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [project, setProject] = useState();
  let projectData = useSelector((state) => state.projectList.projectByIdData);
  useEffect(() => {
    setProject(projectData);
  }, [projectData]);
  return (
    <>
      <Box p={2}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          cursor="pointer"
          onClick={() => {
            navigate('/projects');
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
          <Typography variant="h4">
            {' '}
            {project?.projectType?.toUpperCase()} PROJECTS
          </Typography>
        </Box>
        <Box
          py={1}
          px={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h3">{project?.name}</Typography>
          <Box>
            <CardMedia
              component="img"
              image={project?.logo}
              alt="..."
              sx={{
                width: 120,
                height: 74
              }}
            />
          </Box>
        </Box>
        <Divider />
        <Grid container>
          <Grid item xs={9} md={9}>
            <Box p={2}>
              <Grid
                sx={{
                  px: 4
                }}
                container
                spacing={4}
              >
                <Grid item xs={4}>
                  <Block2 />
                </Grid>
                <Grid item xs={4}>
                  <Block3 />
                </Grid>
                <Grid item xs={4}>
                  <Block4 />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={4}>
                    <Grid item xs={3}>
                      <ProjectSideBar />
                    </Grid>
                    <Grid item xs={9}>
                      <Grid item xs={12}>
                        <BookingDocument />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid xs={3} md={3}>
            <Box
              sx={{
                backgroundColor: `${theme.colors.primary.lighter}`,
                height: '100%'
              }}
            >
              <Box p={4}>
                <NotificationBar />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default BookingInfo;
