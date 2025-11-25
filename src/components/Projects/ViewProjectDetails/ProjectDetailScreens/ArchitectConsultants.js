import React from 'react';
import _ from 'lodash';
import { Grid, Box, Typography, useTheme, Divider } from '@mui/material';
import { SigleItem, TitleComponent } from './index';
import { toUpperMutliple } from '../../../../utils/utilits';

const ArchitectConsultants = ({ titleName, project, formName }) => {
  const theme = useTheme();
  let { architect } = project;
  return (
    <Box>
      <TitleComponent title={titleName} formName={formName} />
      <SigleItem title="Project Architect" subtitle={architect[0]?.name} />
      <Typography
        onClick={() => {
          window.open(`${architect[0]?.link}`);
        }}
        sx={{
          color: theme.palette.primary.main,
          cursor: 'pointer',
          font: 'Helvetica Neue Medium',
          mt: 1
        }}
      >
        {architect[0]?.link}
      </Typography>
      <Typography
        sx={{
          fontWeight: 'normal',
          font: 'Helvetica Neue Medium',
          my: 1
        }}
      >
        {architect[0]?.about}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Grid container rowSpacing={2.5}>
        {project?.consultants.length === 0 && (
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
                No Consultant To Show
              </Typography>
            </Box>
          </>
        )}
        {project?.consultants.map((item, index) => {
          return (
            <Grid item xs={6} key={index}>
              <SigleItem
                title={_.startCase(item?.title)}
                subtitle={toUpperMutliple(item?.value)}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ArchitectConsultants;
