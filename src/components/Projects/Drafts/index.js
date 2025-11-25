import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  useTheme
} from '@mui/material';
import { getProjectById } from '../../../slices/project_forms';
import PageHeader from '../PageHeader';
import { toUpper } from '../../../utils/utilits.js';
import { DeleteProject } from '../../../axiosInstances/Api.js';
import { getProjectList } from '../../../slices/ProjectList';
import { ADD_PROJECT_STEP } from '../constants/index.js';
import DeleteConfirmation from './DeleteConfirmation';

const SigleItem = ({ title, subtitle }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        sx={{
          fontSize: `${theme.typography.pxToRem(13)}`,
          color: '#c0beb6',
          mt: 3,
          mx: 2,
          mb: 1
        }}
        variant="h5"
      >
        {title}:
      </Typography>
      <Typography
        sx={{
          fontSize: `${theme.typography.pxToRem(15)}`,
          mb: 1,
          mx: 2
        }}
        variant="h4"
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

const Drafts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [draftList, setDraftList] = useState([]);
  const [projectResume, setProjectResume] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectDeleteId, setSelectDeleteId] = useState('');
  const { projectListData } = useSelector((state) => state.projectList);
  const handleConfirmDelete = () => {
    setOpenDeleteConfirmation(true);
  };
  const closeConfirmDelete = () => {
    setOpenDeleteConfirmation(false);
  };
  const getDraftProjectList = (projects) => {
    let filteredProject = projects?.filter((project) => {
      return project?.status === 'DRAFT';
    });
    setDraftList(filteredProject);
  };
  const handleDraftSelected = async (project) => {
    await dispatch(getProjectById(project?._id));
    setProjectResume(true);
  };
  const handleDelete = async (id) => {
    setOpenDeleteConfirmation(false);
    let response = await DeleteProject(id);
    dispatch(getProjectList());
    return response;
  };
  const getFormName = (id) => {
    let formToResume = ADD_PROJECT_STEP.filter(
      (item) => item.formId === +id
    );
    return formToResume[0]?.label;
  };
  useEffect(() => {
    getDraftProjectList(projectListData);
  }, [projectListData]);

  return (
    <>
      <Box sx={{ml: 4, py: 4, pl: { xs: 5, lg: 0 }, pr: { xs: 5, md: 7 } }}>
        <PageHeader />
      </Box>

      <Box sx={{ pl: { xs: 4, lg: 0 }, pr: { xs: 4, md: 7 } ,ml: 4}}>
        {draftList.length === 0 && (
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
                No Draft To Show
              </Typography>
            </Box>
          </>
        )}
        <Card>
          <TableContainer>
            <Table>
              <TableBody>
                {draftList.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableRow
                        hover
                        key={index}
                        sx={{
                          overflow: 'visible',
                          position: 'relative',
                          p: 2
                        }}
                      >
                        <TableCell>
                          <SigleItem
                            title="Project Name"
                            subtitle={toUpper(item.name)}
                            theme={theme}
                          />
                        </TableCell>
                        <TableCell>
                          <SigleItem
                            title=" Project Status"
                            subtitle={toUpper(item.projectStatus)}
                            theme={theme}
                          />
                        </TableCell>
                        <TableCell>
                          <SigleItem
                            title=" Project Type"
                            subtitle={toUpper(item.projectType)}
                            theme={theme}
                          />
                        </TableCell>
                        <TableCell>
                          <SigleItem
                            title="Resume To"
                            subtitle={getFormName(item?.step)}
                            theme={theme}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{}}>
                            <Typography
                              sx={{
                                fontSize: `${theme.typography.pxToRem(13)}`,
                                color: '#c0beb6',
                                mt: 3,
                                mx: 2,
                                mb: 1
                              }}
                              variant="h5"
                            >
                              Actions:
                            </Typography>
                            <Box
                              style={{ display: 'flex', flexDirection: 'row' }}
                            >
                              <Typography
                                sx={{
                                  fontSize: `${theme.typography.pxToRem(15)}`,
                                  color: '#3c96e8',
                                  cursor: 'pointer',
                                  mb: 1,
                                  mx: 2
                                }}
                                variant="h4"
                                onClick={() => {
                                  handleDraftSelected(item);
                                }}
                              >
                                Resume
                              </Typography>
                              |
                              <Typography
                                sx={{
                                  fontSize: `${theme.typography.pxToRem(15)}`,
                                  color: '#3c96e8',
                                  cursor: 'pointer',
                                  mb: 1,
                                  ml: 2
                                }}
                                variant="h4"
                                onClick={() => {
                                  setSelectDeleteId(item?._id);
                                  handleConfirmDelete();
                                }}
                              >
                                Delete
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {projectResume && navigate(`/projects/Add_Project`)}
      {openDeleteConfirmation && (
        <DeleteConfirmation
          openConfirmDelete={openDeleteConfirmation}
          closeConfirmDelete={closeConfirmDelete}
          handleDeleteCompleted={handleDelete}
          title="Draft"
          selectedId={selectDeleteId}
        />
      )}
    </>
  );
};

export default Drafts;
