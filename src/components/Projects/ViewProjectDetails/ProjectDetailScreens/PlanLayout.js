import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import {
  Document,
  TitleComponent,
  filterDocs,
  FloorPlanDocument
} from './index';
import { MessageComponent } from './ProjectMedia';

const docList = [
  { label: 'Master/Siteplan', value: 'master/siteplan' },
  // { label: 'Typical Tower Plan', value: 'typicaltowerplan' },
  { label: 'Other Plans ', value: 'otherplans(masterplan,basement,landscape.club,etc)' }
];

const PlanLayout = ({ titleName, project, formName }) => {
  let filteredDocs = filterDocs(docList, project?.documents);
  return (
    <>
      <Box>
        <TitleComponent title={titleName} formName={formName} />
        <Box>
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
        <Divider sx={{ my: 2 }} />
        <FloorPlanDocument floorPlan={project?.floorPlanDetails} />
      </Box>
    </>
  );
};

export default PlanLayout;
