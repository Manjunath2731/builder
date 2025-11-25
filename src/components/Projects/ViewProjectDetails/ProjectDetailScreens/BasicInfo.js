import React from 'react';
import { Grid, Box, Typography, CardMedia, Divider } from '@mui/material';
import {
  SigleItem,
  TitleComponent,
  renderDate,
  Document,
  filterDocs,
  SingleDocument,
  // MapCard
} from './index';
import { MessageComponent } from './ProjectMedia';
import { toCapitalizeCamelCase } from '../../../../utils/utilits';
// import GeoMapDisplay from './GeoMapDisplay.js';

const docList = [
  { label: 'Project Map', value: 'uploadprojectmap' },
  { label: 'Project Brochure', value: 'uploadprojectbrochure' },
  {
    label: 'Sales / Company Presentation',
    value: 'uploadsales/companypresentation'
  }
];
// const isValidLocation = (loc) => {
//   return Number(loc[0]) && Number(loc[1]);
// };
const BasicInfo = ({ titleName, project, formName }) => {
  let filteredDocs = filterDocs(docList, project?.documents);
  let projectMap = filteredDocs['Project Map'];
  delete filteredDocs['Project Map'];
  let reraArray = project?.reraNumber;
  let isRERA = reraArray.length > 0;
  const getUnit = (unit) => {
    if (unit === 'acres') {
      return 'Acres';
    }
    return 'Sq. mt';
  };
  return (
    <Box>
      <TitleComponent title={titleName} formName={formName} />
      <Box sx={{ width: { xs: '100%', xl: '100%' } }}>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid item xs={6}>
            <CardMedia
              component="img"
              sx={{
                width: 110,
                height: 74,
                objectFit: 'fill'
              }}
              alt="Company Logo"
              src={project?.logo}
            />
          </Grid>
          <Grid item xs={6}>
            <SigleItem
              title="Project Status"
              subtitle={toCapitalizeCamelCase(project?.projectStatus)}
            />
          </Grid>
          <Grid item xs={6}>
            <SigleItem
              title="Project Type"
              subtitle={`${toCapitalizeCamelCase(
                project?.projectType
              )} - ${toCapitalizeCamelCase(project?.projectSubType)}`}
            />
          </Grid>
          <Grid item xs={6}>
            <SigleItem
              title="Number of Units"
              subtitle={project?.totalNumberOfUnits}
            />
          </Grid>
          <Grid item xs={6}>
            <SigleItem
              title="Project Area"
              subtitle={`${project?.area?.value} ${getUnit(
                project?.area?.unit
              )}`}
            />
          </Grid>
          <Grid item xs={6}>
            <SigleItem
              title="Completion Date"
              subtitle={renderDate(project?.completionDate)}
            />
          </Grid>
          <Grid item xs={6}>
            <SigleItem title="Street Address" subtitle={project?.address} />
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box>
        <Box sx={{ position: 'relative' }}>
          {reraArray.length > 0 ? (
            <>
              <Typography variant="h4" my={2}>
                RERA Certificate ({reraArray.length})
              </Typography>
              <Document docArray={reraArray} isRERA={isRERA} />
            </>
          ) : (
            <MessageComponent title="RERA Certificate" text=" No file added" />
          )}
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ position: 'relative' }}>
          {Object.keys(filteredDocs).map(function (key, index) {
            return (
              <>
                {filteredDocs[key].length > 0 ? (
                  <>
                    <Typography variant="h4" my={2}>
                      {`${key}(${filteredDocs[key].length})`}
                    </Typography>
                    <Document docArray={filteredDocs[key]} />
                  </>
                ) : (
                  <MessageComponent title={key} text=" No file added" />
                )}
                {Object.keys(filteredDocs).length > 1 &&
                  Object.keys(filteredDocs).length - 1 !== index && (
                    <Divider sx={{ my: 1 }} />
                  )}
              </>
            );
          })}
        </Box>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Grid container spacing={3}>
          {/* {isValidLocation(project?.location) ? (
            <Grid item xs={12} md={6}>
              <Box>
                <MapCard
                  address={project?.address}
                  location={project?.location}
                >
                  <GeoMapDisplay location={project?.location} />
                </MapCard>
              </Box>
            </Grid>
          ) : null} */}
          {projectMap?.length > 0 && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" mb={1}>
                  Project Map
                </Typography>
                <SingleDocument item={projectMap[0]} />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
};
export default BasicInfo;
