import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  Grid,
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Divider,
  CardMedia,
  InputBase,
  alpha,
  styled,
  useTheme,
  Button
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { PUBLISHED_TABS, ProjectStatus, QUICK_ACTION } from './constants';
import { getProjectById } from '../../slices/ProjectList';
import { FilterDocsArray } from './ViewProjectDetails/ProjectDetailScreens/index';
import { FilterPayment } from './ViewProjectDetails/ProjectDetailScreens/PaymentPlans';
import QuickActionModal from './ViewProjectDetails/Blocks/QuickActionModal.js';
import { isValid } from '../../content/channel-partners/Details';

const TabsWrapper = styled(Tabs)(
  () => `
        overflow: visible !important;

        .MuiTabs-scroller {
            overflow: visible !important;
        }
    `
);
const SearchInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(14)};
    
    width: 100%;
`
);
export const CardWrapper = styled(Card)(
  ({ theme }) => `
    transition: ${theme.transitions.create(['box-shadow'])};
    position: relative;
    z-index: 5;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    
    &:hover {
        z-index: 6;
        box-shadow: 
            0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
            0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
            0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
            0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
            transform:scale(1.02);
            cursor:pointer;
    }
   
  `
);
export const CardActions = styled(Box)(
  ({ theme }) => `
    position: absolute;
    left: ${theme.spacing(2)};
    bottom: ${theme.spacing(2)};
    z-index: 7;
  `
);
export const Label = styled(Box)(
  ({ theme }) => `
    
    color: ${theme.palette.common.black};
    text-transform: uppercase;
    font-size: ${theme.typography.pxToRem(10)};
    font-weight: bold;
    line-height: 23px;
    height: 22px;
    padding: ${theme.spacing(0, 1.2)};
    margin :${theme.spacing(1, 1.2, 0, 1.2)};
    border-radius: 50px;
    width: -moz-fit-content;
     width: fit-content;
  `
);
let zip = new JSZip();
const download = (filename) => {
  zip.generateAsync({ type: 'blob' }).then(function (blob) {
    saveAs(blob, `${filename}.zip`);
  });
};
export const FileZip = (
  url = 'https://s3.ap-south-1.amazonaws.com/web.buildersbroadcast.com/web.buildersbroadcast.com/a48647e2-d478-415e-b0bf-3ed2fbc6811d/uploadprojectbrochure/1655714417'
) => {
  let filename = url.replace(/.*\//g, '');
  zip.file(filename, url, { binary: true });
  download(filename);
};
export const cards = [
  {
    id: '1',
    src: '/static/images/projectImage/city1.jpg',
    logo: '/static/images/projectImage/ProjectLogo/image (1).png',
    projectType: 'commercial'
  },
  {
    id: '2',
    src: '/static/images/projectImage/project2.jpg',
    logo: '/static/images/projectImage/ProjectLogo/image (2).png',
    projectType: 'residential'
  },
  {
    id: '3',
    src: '/static/images/projectImage/project3.jpg',
    logo: '/static/images/projectImage/ProjectLogo/image (3).png',
    projectType: 'industrial'
  },
  {
    id: '4',
    src: '/static/images/projectImage/project4.jpg',
    logo: '/static/images/projectImage/ProjectLogo/image (1).png',
    projectType: 'residential'
  },
  {
    id: '5',
    src: '/static/images/projectImage/project5.jpg',
    logo: '/static/images/projectImage/ProjectLogo/image (2).png',
    projectType: 'commercial'
  }
];
const ProjectList = ({ projects }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => {
    setOpenModal(false);
  };
  const [currentPublishedTab, setCurrentPublishedTab] = useState(
    PUBLISHED_TABS[0].value
  );
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const handleClick = (event, index) => {
  //   const DetailsProject =[[
  //     { label: 'EOI Form', value: 'uploadeoiform' },
  //     { label: 'Booking Form', value: 'uploadbookingform' },
  //     {
  //       label: 'Document Checklist for Booking',
  //       value: 'documentchecklistforbooking'
  //     },
  //     {
  //       label: 'Banking Details for Booking',
  //       value: 'bankingdetailsforbooking'
  //     },
  //     { label: 'TDS Deduction Details', value: 'tdsdeductiondetails' }
  //   ],
  //   [
  //     { label: 'Project Brochure', value: 'uploadprojectbrochure' }
  //   ],
  //   [
  //     { label: 'Master/Siteplan', value: 'master/siteplan' },
  //     { label: 'Typical Tower Plan', value: 'typicaltowerplan' },
  //     {
  //       label: 'Other Plans ',
  //       value: 'otherplans(basement,landscape.club,etc)'
  //     }
  //   ],
  //   [{ label: 'Pricing Plan', value: 'pricingplan' }]
  // ]
  // const QUICK_ACTION = [
  //   { label: 'EOI/Booking Form', value: 'booking_info' },
  //   { label: 'Project Brochure', value: 'basic_info' },
  //   { label: 'Layout Plans', value: 'plan_layout' },
  //   { label: 'Pricing', value: 'pricing' },
  //   { label: 'Payment Plan', value: 'payment_plans' },
  //   { label: 'Unit Calculation Sheet', value: 'calculation_sheet' }
  // ];
  // const[peojectData ,setProjectData]= useState([]);
  // let details =[];
  // {
  //   QUICK_ACTION.map((index,project)=>{
  //     let filteredDocs = FilterDocsArray(DocList, project?.documents);
  //      details.push(filteredDocs)
  
  //   })
  // }



    setAnchorEl(event.currentTarget);
    setSelectedEntity(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedEntity(null);
  };

  const handlePublishedTabsChange = (_event, value) => {
    setCurrentPublishedTab(value);
    setFilteredProjects(getFilteredData(value))

  };
  const getFilteredData = (value) => {
    let filteredProject = projects?.filter((project) => {
      return project?.projectType === value && project?.status === 'PUBLISHED';
    });
    // setFilteredProjects(filteredProject);
    return filteredProject;
  };

  const navigateToViewDetails = (project) => {
    dispatch(getProjectById(project._id));
    navigate(`/projects/project_broadcasts/${project._id}`);
  };

  useEffect(() => {
    setFilteredProjects(getFilteredData('residential'));
  }, []);

  const handleSearchChange = async (event) => {
    event.preventDefault();

    if (event.target.value === '') {
      getFilteredData(currentPublishedTab);
      setSearchValue('');
    } else {
      setSearchValue(event.target.value);
      filterProject(event.target.value);
    }
  };
  const filterProject = (key = '') => {
    const searchKey = key.toLowerCase();
    const filteredData = filteredProjects.filter((el) => {
      if (el.name?.toLowerCase().indexOf(searchKey) !== -1) {
        return true;
      }
      return false;
    });
    setFilteredProjects(filteredData);
  };
  const getTag = (taglabel) => {
    let tag = ProjectStatus.filter((item) => item.value === taglabel);
    return tag[0];
  };
  const getSubType = (projectSubType) => {
    if (isValid(projectSubType)) {
      const result = projectSubType.replace(/([A-Z])/g, ' $1');
      const finalResult = result.toUpperCase();
      return finalResult;
    }
    return 'status';
  };
  const [documentList, setDocumentlist] = useState([]);
  const [actionName, setActionName] = useState('');

  const handleAction = (project, actionLabel) => {
    handleClose();
    setActionName(actionLabel);

    // if (actionLabel === 'EOI/Booking Form') {
    //   const DocList = [
    //     { label: 'EOI Form', value: 'uploadeoiform' },
    //     { label: 'Booking Form', value: 'uploadbookingform' },
    //     {
    //       label: 'Document Checklist for Booking',
    //       value: 'documentchecklistforbooking'
    //     },
    //     {
    //       label: 'Banking Details for Booking',
    //       value: 'bankingdetailsforbooking'
    //     },
    //     { label: 'TDS Deduction Details', value: 'tdsdeductiondetails' }
    //   ];
    //   let filteredDocs = FilterDocsArray(DocList, project?.documents);
    //   setDocumentlist(filteredDocs);
    // } else if (actionLabel === 'Project Brochure') {
    //   let DocList = [
    //     { label: 'Project Brochure', value: 'uploadprojectbrochure' }
    //   ];
    //   let filteredDocs = FilterDocsArray(DocList, project?.documents);
    //   setDocumentlist(filteredDocs);
    // } else if (actionLabel === 'Layout Plans') {
    //   const DocList = [
    //     { label: 'Master/Siteplan', value: 'master/siteplan' },
    //     { label: 'Typical Tower Plan', value: 'typicaltowerplan' },
    //     {
    //       label: 'Other Plans ',
    //       value: 'otherplans(basement,landscape.club,etc)'
    //     }
    //   ];
    //   let filteredDocs = FilterDocsArray(DocList, project?.documents);
    //   setDocumentlist(filteredDocs);
    // } else if (actionLabel === 'Pricing') {
    //   const DocList = [{ label: 'Pricing Plan', value: 'pricingplan' }];
    //   let filteredDocs = FilterDocsArray(DocList, project?.documents);
    //   setDocumentlist(filteredDocs);
    // } else if (actionLabel === 'Payment Plan') {
    //   let filteredDocs = FilterPayment(project?.payment);
    //   setDocumentlist(filteredDocs);
    // } else {
    //   setDocumentlist([]);
    //   return  false
    // }
    setDocumentlist(getSubItems(project,actionLabel))
    setOpenModal(true);
    // return true;
  };
  const getSubItems = (project, actionLabel) => {
   
    if (actionLabel === 'EOI/Booking Form') {
      const DocList = [
        { label: 'EOI Form', value: 'uploadeoiform' },
        { label: 'Booking Form', value: 'uploadbookingform' },
        {
          label: 'Document Checklist for Booking',
          value: 'documentchecklistforbooking'
        },
        {
          label: 'Banking Details for Booking',
          value: 'bankingdetailsforbooking'
        },
        { label: 'TDS Deduction Details', value: 'tdsdeductiondetails' }
      ];
      let filteredDocs = FilterDocsArray(DocList, project?.documents);
      return filteredDocs;
    } else if (actionLabel === 'Project Brochure') {
      let DocList = [
        { label: 'Project Brochure', value: 'uploadprojectbrochure' }
      ];
      let filteredDocs = FilterDocsArray(DocList, project?.documents);
      return filteredDocs;
    } else if (actionLabel === 'Layout Plans') {
      const DocList = [
        { label: 'Master/Siteplan', value: 'master/siteplan' },
        { label: 'Typical Tower Plan', value: 'typicaltowerplan' },
        {
          label: 'Other Plans ',
          value: 'otherplans(basement,landscape.club,etc)'
        }
      ];
      let filteredDocs = FilterDocsArray(DocList, project?.documents);
      return filteredDocs;
    } else if (actionLabel === 'Pricing') {
      const DocList = [{ label: 'Pricing Plan', value: 'pricingplan' }];
      let filteredDocs = FilterDocsArray(DocList, project?.documents);
      return filteredDocs;
    } else if (actionLabel === 'Payment Plan') {
      let filteredDocs = FilterPayment(project?.payment);
      return filteredDocs;
    } 
    return ([]);
   
  };

  // console.log("documentList",documentList)

  const getQuickAction = (card,item)=>{
        
        const data = getSubItems(card, item?.label)
      return (
        data.length>0 ?
        <div>
          <MenuItem
            onClick={() => {
              handleAction(card, item?.label);
            }}
            sx={{ color: '#ffff' }}
          >
            <Typography sx={{ color: '#ffff'}}>
              {item?.label}
            </Typography>
          </MenuItem>
          <Divider />
        </div>: null
      );
    
  }
  return (
    <Box sx={{ ml: 4, pl: { xs: 4, lg: 0 }, pr: { xs: 4, md: 7 } }}>
      <Box>
        <Box
          mb={4}
          display="flex"
          alignItems={{ md: 'center' }}
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
        >
          <Box>
            <TabsWrapper
              centered
              onChange={handlePublishedTabsChange}
              value={currentPublishedTab}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              flexWrap="wrap"
            >
              {PUBLISHED_TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  label={
                    `${tab.label}(${getFilteredData(tab.value)?.length})`
                  }
                  value={tab.value}
                  style={{minWidth:"max-content"}}
                />
              ))}
            </TabsWrapper>
          </Box>

          <Box sx={{ mt: { xs: 3, md: 0 } }}>
            <form>
              <Box display="flex" alignItems="center">
                <Box
                  flexGrow={1}
                  display="flex"
                  alignItems="center"
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <SearchTwoToneIcon
                    sx={{
                      mr: 2,
                      color: theme.colors.secondary.main
                    }}
                  />
                  <SearchInputWrapper
                    value={searchValue}
                    onChange={handleSearchChange}
                    autoFocus
                    placeholder="Search by project name"
                    fullWidth
                  />
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
      {filteredProjects.length === 0 && (
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
              No Project To Show
            </Typography>
          </Box>
        </>
      )}
      <Grid container spacing={4}>
        {filteredProjects.map((card, index) => {
          let tagsLabel = getTag(card.projectStatus);
          let projectSubTypeLabel = getSubType(card?.projectSubType);
          return (
            <React.Fragment key={index}>
              <Grid item xs={12} md={4} lg={4} xl={3}>
                <CardWrapper>
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
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          ' -webkit-line-clamp': 1 /* number of lines to show */,
                          lineClamp: 1,
                          ' -webkit-box-orient': 'vertical',
                          mr: 3
                        }}
                        variant="subtitle1"
                      >
                        {card?.address || `No address added`}
                      </Typography>
                      {projectSubTypeLabel !== '' &&
                        card?.projectType !== 'farmHouse' && (
                          <Box>
                            <CardActions
                              sx={{ position: 'relative', left: 0, top: 0 }}
                            >
                              <Label sx={{ background: '#f9a552', mx: 0 }}>
                                {projectSubTypeLabel}
                              </Label>
                            </CardActions>
                          </Box>
                        )}
                    </Box>

                    <CardMedia
                      component="img"
                      sx={{
                        width: 84,
                        height: 64,
                        objectFit: 'fill',
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
                      image={
                        card?.images[0]?.url ||
                        '/static/images/projectImage/imagePlaceholder.png'
                      }
                      alt="..."
                      sx={{
                        objectFit: 'fill',
                        height: { xs: '330', md: '230' },
                        border: '1px solid #E3EAF5'
                      }}
                    />
                    <CardActions>
                      <Label sx={{ background: tagsLabel.color }}>
                        {tagsLabel.label}
                      </Label>
                    </CardActions>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box
                      sx={{ width: '50%', px: '5px', py: '5px' }}
                      style={{
                        backgroundColor:
                          selectedEntity === index ? '#EEEEEE' : '#ffff'
                      }}
                    >
                      <Button
                        id="demo-customized-button"
                        aria-controls={
                          selectedEntity === index
                            ? 'demo-customized-menu'
                            : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={
                          selectedEntity === index ? 'true' : undefined
                        }
                        onClick={(e) => {
                          handleClick(e, index);
                        }}
                        endIcon={<ArrowDropDownIcon />}
                        fullWidth
                        sx={{
                          '&:hover': { backgroundColor: 'transparent' },
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Quick Actions
                      </Button>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={selectedEntity === index}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button'
                      }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                      }}
                      PaperProps={{
                        style: {
                          backgroundColor: '#0079E8'
                        }
                      }}
                    >
                      {QUICK_ACTION.map((item) => {
                        return (
                          getQuickAction(card,item)
                        );
                      })}
                      {/* getQuickAction() */}
                    </Menu>
                    <Box
                      sx={{ width: '50%', px: '2px', py: '2px', my: '2.5px' }}
                      style={{
                        backgroundColor:
                          selectedEntity === index ? '#EEEEEE' : '#ffff'
                      }}
                    >
                      <Button
                        id="demo-customized-button"
                        aria-haspopup="true"
                        onClick={() => {
                          navigateToViewDetails(card);
                        }}
                        endIcon={<ArrowRightIcon />}
                        fullWidth
                        sx={{
                          '&:hover': { backgroundColor: 'transparent' },
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Complete Details
                      </Button>
                    </Box>
                  </Box>
                </CardWrapper>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
      {!selectedEntity && openModal && (
        <QuickActionModal
          openConfirm={openModal}
          closeConfirm={closeModal}
          title={actionName}
          DocList={documentList}
        />
      )}
    </Box>
  );
};
export default ProjectList;
