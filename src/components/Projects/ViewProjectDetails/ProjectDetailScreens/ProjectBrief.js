import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { TitleComponent, Document, filterDocs } from './index';
import { MessageComponent } from './ProjectMedia';

const docList = [
  {
    label: 'Project Approvals & Certifications',
    value: 'addprojectapprovals&certifications'
  },
  { label: 'Project Specification', value: 'addprojectspecification' }
];

const ProjectBrief = ({ titleName, project, formName }) => {
  let filteredDocs = filterDocs(docList, project?.documents);
  return (
    <>
      <Box>
        <TitleComponent title={titleName} formName={formName} />
        <Box>
          <Typography variant="h4" my={2}>
            Project Brief
          </Typography>
          <Typography variant="h6" my={2}>
            {project.description}
          </Typography>
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
      </Box>
    </>
  );
};

export default ProjectBrief;
