import React, { useState, useEffect } from 'react';
//
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import Loader from 'src/UI/Loader/Loader.js';
import { GetProjectsDetail } from '../../axiosInstances/Api';
import { getProjectList } from '../../slices/ProjectList';
import { deleteSliceData } from '../../slices/project_forms';
import PageHeader from './PageHeader.js';

import ProjectList from './Projects.js';

const Projects = () => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(deleteSliceData());
    GetProjectsDetail(setProjects, setLoading);
    dispatch(getProjectList());
  }, []);

  return (
    <>
      <Helmet>
        <title>Projects</title>
      </Helmet>
      <Box sx={{ ml: 4, py: 4, pl: { xs: 4, lg: 0 }, pr: { xs: 4, md: 7 } }}>
        <PageHeader />
      </Box>
      {loading && <Loader />}
      {!loading && <ProjectList projects={projects} />}
    </>
  );
};

export default Projects;
