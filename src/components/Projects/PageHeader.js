import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Typography, Button, Box, useTheme, Tab, Tabs } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { canCreateProject } from '../../helpers/permissionHelper';
import { TABS } from './constants';

function PageHeader() {
  const location = useLocation();
  const theme = useTheme();
  const selectedTab = location.pathname.split('/').pop();
  const [currentTab, setCurrentTab] = useState(selectedTab);

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
    navigate(`/projects/${value}`);
  };

  const navigate = useNavigate();
  const showAddProject = canCreateProject();

  return (
    <>
      <Box
        display="flex"
        alignItems={{ xs: 'stretch', md: 'center' }}
        flexDirection={{ xs: 'row', md: 'row' }}
       
       >
        <Box display="flex" alignItems="center">
          <Box>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(13)}`,  mt: 2,mb: 3
              }}
              variant="h4"
            >
              PROJECTS
            </Typography>
          </Box>
        </Box>
        
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 0 , display: 'flex',
                justifyContent: 'space-between', pb:1}}>
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          aria-label="basic tabs example"
          flexWrap="wrap"
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} 
            value={tab.value}
             />
          ))}
        </Tabs>
        <Box>
          {showAddProject ? (
            <Button
              variant="contained"
              startIcon={<AddCircleIcon fontSize="medium" />}
              onClick={() => {
                navigate(`/projects/Add_Project`);
              }}
            >
              Add New Project
            </Button>
          ) : (
            ''
          )}
        </Box>
       </Box>
       {/* <Box sx={{ width: '100%' }}>
      <Tabs onChange={handleTabsChange}
          value={currentTab} centered>
        <Tab label="Item One"  
        // value ="published" 
        />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>
    </Box> */}
    </>
  );
}

export default PageHeader;
