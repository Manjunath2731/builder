import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Box,
  Typography,
  Divider,
  CardMedia,
  useTheme
} from '@mui/material';

import { CardWrapper, CardActions, Label } from '../Projects';
import { ProjectStatus } from '../constants/index';

const PreLaunchProject = () => {
  const theme = useTheme();
  const [preLaunchList, setPreLaunchList] = useState([]);
  const { projectListData } = useSelector((state) => state.projectList);
  const getPreLaunchList = (projects) => {
    let filteredProject = projects?.filter((project) => {
      return project?.status === 'PRELAUNCH';
    });
    setPreLaunchList(filteredProject);
  };
  const getTag = (taglabel) => {
    let tag = ProjectStatus.filter((item) => item.value === taglabel);
    return tag[0];
  };
  useEffect(() => {
    getPreLaunchList(projectListData);
  }, [projectListData]);
  return (
    <>
      <Box sx={{ ml:4, pl: { xs: 5, lg: 0 }, pr: { xs: 5, md: 7 } }}>
        {preLaunchList.length === 0 && (
          <>
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
                No Pre-Launch Project To Show
              </Typography>
            </Box>
          </>
        )}
        <Grid container spacing={4}>
          {preLaunchList.map((card, index) => {
            let tagsLabel = getTag(card.projectStatus);
            return (
              <React.Fragment key={index}>
                <Grid item xs={12} md={4} lg={4} xl={3}>
                  <CardWrapper
                  >
                    <Box
                      p={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: `${theme.typography.pxToRem(16)}`
                          }}
                          variant="h3"
                        >
                          {card.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: `${theme.typography.pxToRem(14)}`,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            width: '150px'
                          }}
                          variant="subtitle1"
                        >
                          {card?.address}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: `${theme.typography.pxToRem(14)}`,
                            color: theme.palette.primary.dark
                          }}
                          variant="subtitle1"
                        >
                          {card?.projectType}
                        </Typography>
                      </Box>
                      <CardMedia
                        component="img"
                        sx={{
                          width: 84,
                          height: 64,
                          objectFit: 'cover',
                          border: '1px solid #E3EAF5'
                        }}
                        alt="Company Logo"
                        src={card?.logo}
                      />
                    </Box>
                    <Box
                      sx={{
                        position: 'relative'
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="230"
                        image="/static/images/projectImage/project4.jpg"
                        alt="/static/images/projectImage/project4.jpg"
                        sx={{ objectFit: 'fill' }}
                      />
                      <CardActions>
                        <Label sx={{ background: tagsLabel.color }}>
                          {tagsLabel.label}
                        </Label>
                      </CardActions>
                    </Box>

                    <Divider pt={1} />
                  </CardWrapper>
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};
export default PreLaunchProject;
