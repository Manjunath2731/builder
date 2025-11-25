import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Box,
  Card,
  alpha,
  styled,
  useTheme,
  Typography
} from '@mui/material';

import { toUpperMutliple } from 'src/utils/utilits';
import { getProjectCRMTeamsById } from '../../../../slices/ProjectList';
import TeamCard from './TeamCard';
import { TitleComponent } from './index';

const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      border-radius: 8px;
      z-index: 5;
      box-shadow: 
      0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
      0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
      0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
      0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
    `
);

const ProjectTeam = ({ titleName, project }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  let isTeam = true;
  let crm = [...project?.crmManager];
  const [team, setTeam] = useState([]);
  let teams = [];
  teams = useSelector((state) => state.projectList.crmTeam);

  const getTeams = (tempTeams) => {
    dispatch(getProjectCRMTeamsById(tempTeams));
  };

  useEffect(() => {
    getTeams(crm);
    setTeam(teams);
  }, []);
  useEffect(() => {
    setTeam(teams);
  }, [teams]);
  return (
    <>
      <Box>
        <TitleComponent title={titleName} isTeam={isTeam} />
        {team?.length <= 0 ? (
          <>
            <Box display="flex" justifyContent="center" textAlign="center ">
              <Typography
                variant="h3"
                pt={10}
                sx={{ color: theme.palette.grey[500] }}
                textAlign="center"
              >
                No CRM Member To Show
              </Typography>
            </Box>
          </>
        ) : (
          <CardWrapper sx={{ minWidth: 175, minHeight: 175 }}>
            <Grid container sx={{ gridAutoRows: '1fr' }}>
              {team?.map((item) => {
                let teamData = item;
                return (
                  <Grid
                    item
                    key={teamData?.id}
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={6}
                  >
                    <TeamCard
                      id={teamData.id}
                      name={`${toUpperMutliple(
                        teamData?.first_name
                      )} ${toUpperMutliple(teamData?.last_name)}`}
                      number={teamData?.phoneNumber}
                      email={teamData?.email}
                      profileUrl={teamData?.profileImage}
                      isActive={teamData?.is_active}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </CardWrapper>
        )}
      </Box>
    </>
  );
};

export default ProjectTeam;
