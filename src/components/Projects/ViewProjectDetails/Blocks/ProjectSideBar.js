import React, { useState } from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router';

export const itemsList = [
  {
    label: 'Project Broadcasts',
    value: 'project_broadcasts',
    icon: '/static/images/logo/project-broadcasts.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/project-broadcasts.svg'
  },
  {
    label: 'Project Info',
    value: 'basic_info',
    icon: '/static/images/logo/projectIcons/basic-info-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/basic-info-icon.svg'
  },
  {
    label: 'About Project',
    value: 'about_project',
    icon: '/static/images/logo/projectIcons/about-project-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/about-project-icon.svg'
  },
  {
    label: 'Media Gallery',
    value: 'project_media',
    icon: '/static/images/logo/projectIcons/project-media-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/project-media-icon.svg'
  },
  {
    label: 'Plan Layout',
    value: 'plan_layout',
    icon: '/static/images/logo/projectIcons/plan-layout-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/plan-layout-icon.svg'
  },
  {
    label: 'Payment Plans',
    value: 'payment_plans',
    icon: '/static/images/logo/projectIcons/payment-plans-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/payment-plans-icon.svg'
  },
  {
    label: 'Approved Banks',
    value: 'approved_banks',
    icon: '/static/images/logo/projectIcons/approved-bank-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/approved-bank-icon.svg'
  },
  {
    label: 'Pricing',
    value: 'pricing',
    icon: '/static/images/logo/projectIcons/pricing-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/pricing-icon.svg'
  },
  {
    label: 'Calculation Sheet',
    value: 'calculation_sheet',
    icon: '/static/images/logo/calculation-sheet.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/calculation-sheet.svg'
  },
  {
    label: 'Booking Info',
    value: 'booking_info',
    icon: '/static/images/logo/projectIcons/booking-info-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/booking-info-icon.svg'
  },
  {
    label: 'Consultants',
    value: 'architect_&_consultants',
    icon: '/static/images/logo/projectIcons/consultant-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/consultant-icon.svg'
  },
  {
    label: 'Project Team',
    value: 'project_team',
    icon: '/static/images/logo/CRM-team.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/CRM-team.svg'
  },
  {
    label: 'CRM Team',
    value: 'crm_team',
    icon: '/static/images/logo/CRM-team.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/CRM-team.svg'
  }
];

const ProjectSideBar = ({projectType}) => {
  console.log("projectTypeprojectTypeprojectTypeprojectTypeprojectType",projectType)
  const location = useLocation();
  const selectedBar = location.pathname.split('/')[2];
  const { projectId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [selected, setSelected] = useState(selectedBar);

  const newItemList = projectType ? itemsList.filter((m,index) => {
    if(index === 5 || index === 6 || index === 9){
      return false
    }
    return true
  }) : itemsList;

  return (
    <>
      <Box>
        {newItemList.map((item) => {
          return (
            <Card
              key={item.value}
              sx={{
                border: 2.5,
                borderRadius: '3px',
                p: 1,
                my: 1,
                cursor: 'pointer',
                background: theme.palette.common.white,
                borderColor: selected === item.value ? '#0078e9' : 'grey.500'
              }}
              onClick={() => {
                setSelected(item.value);
                navigate(`/projects/${item.value}/${projectId}`);
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ mr: 1 }}>
                  {selected === item.value ? (
                    <img src={item?.selectedIcon} alt="" />
                  ) : (
                    <img src={item?.icon} alt="" />
                  )}
                </Box>

                <Typography
                  variant="subtitile2"
                  fontWeight={selected === item.value ? 600 : 'normal'}
                >
                  {item.label}
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>
    </>
  );
};

export default ProjectSideBar;
