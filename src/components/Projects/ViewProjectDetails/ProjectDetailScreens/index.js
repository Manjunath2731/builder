import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { saveAs } from 'file-saver';
import {
  FacebookShareButton,
  // TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  // TwitterIcon,
  WhatsappIcon
} from 'react-share';

import {
  Box,
  useTheme,
  Button,
  Typography,
  CardMedia,
  Grid,
  Popper,
  Card,
  Divider,
  IconButton,
  Tooltip,
  styled,
  Popover,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  ImageListItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { showNotification } from 'src/utils/commonUtility';
import { notificationType } from 'src/constants/NotificationType';
import { getProjectById } from '../../../../slices/project_forms';
import { getDateFromTimeStamp } from '../../../../utils/utilits';

export const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
        background: transparent;
        transition: ${theme.transitions.create(['all'])};
        color: ${theme.colors.alpha.black[100]};
        border-radius: 50px;
    
        &:hover {
          background: transparent;
          color: ${theme.colors.alpha.black[100]};
        }
    `
);

export const fileType = ['jpg', 'jpeg', 'png'];
export const videoType = ['mp4'];

export const fileIcons = [
  {
    type: 'pdf',
    iconSrc: '/static/images/logo/pdf-icon.svg'
  },
  {
    type: 'doc',
    iconSrc: '/static/images/logo/doc-icon.svg'
  },
  {
    type: 'msword',
    iconSrc: '/static/images/logo/doc-icon.svg'
  },
  {
    type: 'vnd.openxmlformats-officedocument.wordprocessingml.document',
    iconSrc: '/static/images/logo/doc-icon.svg'
  },
  {
    type: 'xls',
    iconSrc: '/static/images/logo/xls-icon.svg'
  },
  {
    type: 'xlsx',
    iconSrc: '/static/images/logo/xls-icon.svg'
  },
  {
    type: 'gif',
    iconSrc: '/static/images/logo/gif-icon.svg'
  },
  {
    type: 'zip',
    iconSrc: '/static/images/logo/zip-icon.svg'
  },
  {
    type: 'jpeg',
    iconSrc: '/static/images/logo/jpg-icon.svg'
  },
  {
    type: 'jpg',
    iconSrc: '/static/images/logo/jpg-icon.svg'
  },
   {
    type: 'png',
    iconSrc: '/static/images/logo/png-icon 1.svg'
  },
  {
    type: 'ppt',
    iconSrc: '/static/images/logo/ppt-icon 1.svg'
  },
  {
    type: 'vnd.ms-powerpoint',
    iconSrc: '/static/images/logo/ppt-icon 1.svg'
  },
];
export const getIcons = (contentType) => {
  let iconArr = fileIcons.filter((item) => item?.type === contentType);
  return iconArr.length > 0 ? iconArr : [];
};
export const titleBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};
export const initialFileObject = {
  label: '',
  url: '',
  contentType: '',
  formType: ''
};
export const getDocValue = (fileName, documents) => {
  let docFile = documents
    .filter((item) => item.formType === fileName.value)
    .map((item) => ({
      title: item?.title || '',
      url: item?.url || '',
      contentType: item?.contentType || '',
      formType: fileName?.label
    }));
    // console.log("docFile",docFile)
  return docFile.length !== 0 ? docFile : [];
};
export const FilterDocsArray = (fileNamesRequired, documents) => {
  let requiredFile = [];
  fileNamesRequired.map((item) => {
    let files = getDocValue(item, documents);
    if (files.length > 0) {
      Array.prototype.push.apply(requiredFile, files);
    }
    return '';
    
  });
  // console.log("fileNamesRequired",fileNamesRequired)
  return requiredFile;
};
export const filterDocs = (fileNamesRequired, documents) => {
  let requiredFile = {};
  fileNamesRequired.map((item) => {
    let files = getDocValue(item, documents);
    requiredFile[`${item?.label}`] = files;
    return '';
  });
  return requiredFile;
};
export const renderDate = (dateOZ) => {
  let newdate = new Date(dateOZ).toLocaleDateString('en-us', {
    month: 'long',
    year: 'numeric'
  });
  return `${newdate}`;
};
export const TitleComponent = ({ title, formName = '', isTeam = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [edit, setEdit] = useState(false);
  const handleCLick = async () => {
    await dispatch(getProjectById(projectId));
    setEdit(true);
  };
  return (
    <>
      <Box sx={titleBoxStyle} mt={1}>
        <Typography
          sx={{
            cursor: 'pointer'
          }}
          variant="h4"
        >
          {title.toUpperCase()}
        </Typography>
        {!isTeam && (
          <Button
            sx={{ borderRadius: '25px' }}
            variant="contained"
            onClick={handleCLick}
          >{`Edit ${title}`}</Button>
        )}
        {edit && navigate(`/projects/Add_Project/Edit/${formName}`)}
      </Box>
      <Divider sx={{ my: 2 }} />
    </>
  );
};

export const VideoComponent = ({ src, index, alt, selectedProject, handleSelectProject, item, isShare }) => {
  const startindex = src.indexOf('?');
  const search = src.substr(startindex);
  const params = new URLSearchParams(search);
  const keyid = params.get('v');
  let isSelected = selectedProject?.includes(item.link);
  return (
    <ImageListItem>
      {isShare && <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
        <Checkbox
          checked={isSelected}
          onChange={(event) => {
            handleSelectProject(event, item);
          }}
          inputProps={{ 'aria-label': 'controlled' }}
          id={index}
          name={item}
          sx={{ color: 'white' }}
        />
      </Box>}
      <Box key={index}>
        <iframe
          width="353"
          height="280"
          src={`https://www.youtube.com/embed/${keyid}`}
          title={alt}
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

      </Box>
    </ImageListItem>
  );
};
export const VideoDisplay = ({ src, alt, index }) => {
  return (
    <CardMedia
      key={index}
      component="iframe"
      src={src}
      // allow="autoPlay"
      sx={{
        display: 'block',
        height: 'auto',
        maxHeight: '300px',
        width: '250px',
        maxWidth: '300px',
        border: '1px solid #ddd',
        borderRadius: 'inherit',
        zIndex: 5
      }}
      alt={alt !== '' ? alt : '...'}
    />
  );
};
export const ImageComponent = ({ src, alt, index }) => {
  return (
    <CardMedia
      key={index}
      component="img"
      sx={{
        display: 'block',
        height: 'auto',
        maxHeight: '300px',
        width: '250px',
        maxWidth: '300px',
        border: '1px solid #E3EAF5',
        borderRadius: 'inherit',
        zIndex: 5,
        objectFit: 'fill'
      }}
      image={src}
      alt={alt !== '' ? alt : '...'}
    />
  );
};
export const SingleDocument = ({ item, isFloorPlan = false }) => {
  const theme = useTheme();
  const handleDownload = (item) => {
    saveAs(item?.url, item?.title);
    handleMenuClose();
  };
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = React.useState(null);
  const list = ['View', 'Download', 'Share'];
  const [selectedEntity, setSelectedEntity] = useState(null);
  const handleMenuClick = (event, url) => {
    setSelectedEntity(url);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedEntity(null);
  };
  const handleShareClose = () => {
    setShareAnchorEl(null);
    setShareOpen(false);
    handleMenuClose();
  };
  const handleShareClick = (event) => {
    setShareAnchorEl(event.currentTarget);
    setShareOpen(true);
  };

  const handleView = (item) => {
    window.open(item?.url, '_blank');
    handleMenuClose();
  };

  const handleSelectedMenu = (event, selectedMenu, file) => {
    if (selectedMenu === 'Share') {
      handleShareClick(event);
    } else if (selectedMenu === 'Download') {
      handleDownload(file);
    } else if (selectedMenu === 'View') {
      handleView(file);
    }
  };
  let Icons = getIcons(item?.contentType);
  return (
    <>
      <Card>
        {!isFloorPlan && (
          <>
            {fileType.indexOf(item?.contentType) >= 0 && (
              <Box>
                <CardMedia
                  component="img"
                  height="210"
                  src={item?.url}
                  alt="..."
                  sx={{
                    objectFit: 'fill',
                    border: '1px solid #E3EAF5'
                  }}
                />
              </Box>
            )}
            {videoType.indexOf(item?.contentType) >= 0 && (
              <VideoDisplay src={item?.url} alt="Video" />
            )}
          </>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pr: 1
          }}
        >
          <Box
            sx={{
              width: '90%'
            }}
          >
            <ListItem>
              <ListItemAvatar sx={{ ml: -2 }}>
                {Icons.length > 0 ? (
                  <img
                    src={Icons[0]?.iconSrc}
                    alt=""
                    style={{ width: 64, height: 64, mx: -1 }}
                  />
                ) : (
                  <Box sx={{ width: '45px' }}>
                    <img
                      src="/static/images/logo/doc-icon.svg"
                      alt=""
                      style={{ width: 64, height: 64 }}
                    />
                  </Box>
                )}
              </ListItemAvatar>
              <ListItemText disableTypography>
                <Typography
                  variant="h5"
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item?.title}
                </Typography>
                <Typography variant="subtitle2">
                  {`Added  on ${getDateFromTimeStamp(item?.url)}`}
                </Typography>
              </ListItemText>
            </ListItem>
          </Box>
          <Box
            onClick={(e) => {
              handleMenuClick(e, item?.url);
            }}
          >
            <MoreVertIcon
              sx={{ color: theme.palette.primary.main }}
              fontSize="medium"
            />
          </Box>
          <Menu
            id="basic-menu"
            anchorEl={menuAnchorEl}
            open={selectedEntity === item?.url}
            onClose={() => {
              handleMenuClose();
            }}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            PaperProps={{
              style: {
                backgroundColor: '#d3e7fe',
                borderRadius: '5px',
                m: -2
              }
            }}
          >
            {list.map((listName, indexList) => {
              return (
                <>
                  <MenuItem
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      p: 0,
                      m: 0
                    }}
                    onClick={(e) => handleSelectedMenu(e, listName, item)}
                  >
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          font: '',
                          color: theme.palette.primary.main,
                          fontWeight: 'normal'
                        }}
                      >
                        {listName}
                      </Typography>
                    </Box>
                  </MenuItem>
                  {list.length > 0 && indexList + 1 < list.length && (
                    <Divider sx={{ color: ` 0.5px dashed #c0c1c3` }} />
                  )}
                </>
              );
            })}
          </Menu>

          <ShareComponent
            text={item?.url}
            handleClose={handleShareClose}
            open={shareOpen}
            anchorEl={shareAnchorEl}
          />
        </Box>
      </Card>
    </>
  );
};
export const Document = ({ docArray, showTitle = false, isRERA = false }) => {
  const theme = useTheme();
  const handleDownload = (item) => {
    saveAs(item?.url, `${item?.title}`);
    handleMenuClose();
  };
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = React.useState(null);


  const f = docArray[0]?.contentType;
  let list = [];
  if (f && (f === 'pdf' || f.startsWith('image/') || f.startsWith('video/'))) {
    list = ['View', 'Download', 'Share'];
  } else {
    list = ['Download', 'Share'];
  }

  const [selectedEntity, setSelectedEntity] = useState(null);
  const handleMenuClick = (event, index) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedEntity(index);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedEntity(null);
  };
  const handleShareClose = () => {
    setShareAnchorEl(null);
    setShareOpen(false);
    handleMenuClose();
  };
  const handleShareClick = (event) => {
    setShareAnchorEl(event.currentTarget);
    setShareOpen(true);
  };

  const handleView = (item) => {
    window.open(item?.url, '_blank');
    handleMenuClose();
  };

  const handleSelectedMenu = (event, selectedMenu, file) => {
    if (selectedMenu === 'Share') {
      handleShareClick(event);
    } else if (selectedMenu === 'Download') {
      handleDownload(file);
    } else if (selectedMenu === 'View') {
      handleView(file);
    }
  };
  return (
    <React.Fragment>
      <Box sx={{ pb: 2 }}>
        <Grid container spacing={3}>
          {docArray?.map((item, index) => {
            let Icons = getIcons(item?.contentType);
            return (
              <Grid item xs={12} md={6} xl={6} key={index}>
                {showTitle && (
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {item?.formType}
                  </Typography>
                )}
                {isRERA && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" mr={1.5}>
                      RERA Number :
                    </Typography>
                    <Typography variant="h6">{item?.reraValue}</Typography>
                  </Box>
                )}
                <Card>
                  {fileType.indexOf(item?.contentType) >= 0 && (
                    <Box>
                      <CardMedia
                        component="img"
                        height="210"
                        src={item?.url}
                        alt="..."
                        sx={{
                          objectFit: 'fill',
                          border: '1px solid #E3EAF5'
                        }}
                      />
                    </Box>
                  )}
                  {videoType.indexOf(item?.contentType) >= 0 && (
                    <VideoDisplay src={item?.url} alt="Video" />
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pr: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: '90%'
                      }}
                    >
                      <ListItem>
                        <ListItemAvatar sx={{ ml: -2 }}>
                          {Icons.length > 0 ? (
                            <img
                              src={Icons[0]?.iconSrc}
                              alt=""
                              style={{ width: 64, height: 64, mx: -1 }}
                            />
                          ) : (
                            <Box sx={{ width: '45px' }}>
                              <img
                                src="/static/images/logo/doc-icon.svg"
                                alt=""
                                style={{ width: 64, height: 64 }}
                              />
                            </Box>
                          )}
                        </ListItemAvatar>
                        <ListItemText disableTypography>
                          <Typography
                            variant="h5"
                            sx={{
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item?.title}
                          </Typography>
                          <Typography variant="subtitle2">
                            {`Added  on ${getDateFromTimeStamp(item?.url)}`}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    </Box>
                    <Box
                      onClick={(e) => {
                        handleMenuClick(e, index);
                      }}
                    >
                      <MoreVertIcon
                        sx={{ color: theme.palette.primary.main }}
                        fontSize="medium"
                      />
                    </Box>
                    <Menu
                      id="basic-menu"
                      anchorEl={menuAnchorEl}
                      open={selectedEntity === index}
                      onClose={() => {
                        handleMenuClose();
                      }}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button'
                      }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                      PaperProps={{
                        style: {
                          backgroundColor: '#d3e7fe',
                          borderRadius: '5px',
                          m: -2
                        }
                      }}
                    >
                      {list.map((listName, indexList) => {
                        return (
                          <>
                            <MenuItem
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                p: 0,
                                m: 0
                              }}
                              onClick={(e) =>
                                handleSelectedMenu(e, listName, item)
                              }
                            >
                              <Box>
                                <Typography
                                  variant="h5"
                                  sx={{
                                    font: '',
                                    color: theme.palette.primary.main,
                                    fontWeight: 'normal'
                                  }}
                                >
                                  {listName}
                                </Typography>
                              </Box>
                            </MenuItem>
                            {list.length > 0 && indexList + 1 < list.length && (
                              <Divider
                                sx={{ color: ` 0.5px dashed #c0c1c3` }}
                              />
                            )}
                          </>
                        );
                      })}
                    </Menu>
                    <ShareComponent
                      text={item?.url}
                      handleClose={handleShareClose}
                      open={shareOpen}
                      anchorEl={shareAnchorEl}
                    />
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </React.Fragment>
  );
};
export const DocMenuPopover = ({
  file,
  handleMenuClose,
  menuOpen,
  menuAnchorEl,
  handleSelectedMenu
}) => {
  const theme = useTheme();
  const list = ['View', 'Download', 'Share'];
  return (
    <>
      <Popper
        placement="bottom-end"
        transition
        open={menuOpen}
        anchorEl={menuAnchorEl}
        onClose={handleMenuClose}
      >
        <Box sx={{ background: '#d3e7fe', borderRadius: '5px' }}>
          <Box display="flex" alignitems="center" flexDirection="column">
            {list.map((item, index) => {
              return (
                <React.Fragment key={item}>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    py={1}
                    px={2}
                    onClick={(e) => handleSelectedMenu(e, item, file)}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        font: '',
                        color: theme.palette.primary.main,
                        fontWeight: 'normal'
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                  {list.length > 0 && index + 1 < list.length && <Divider />}
                </React.Fragment>
              );
            })}
          </Box>
        </Box>
      </Popper>
    </>
  );
};
export const ShareComponent = ({
  text,
  // title = 'File',
  handleClose,
  open,
  anchorEl
}) => {
  const id = open ? 'simple-share-popover' : undefined;
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      <Card className="Mui-mailboxRow">
        <Typography variant="h4" sx={{ p: 1 }}>
          Share Via
        </Typography>
        <Box display="flex" alignitems="center" mr={1}>
          <Tooltip arrow placement="top" title="Facebook">
            <IconButtonWrapper>
              <FacebookShareButton url={text}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </IconButtonWrapper>
          </Tooltip>
          <Tooltip arrow placement="top" title="Twitter">
            <IconButtonWrapper>
              {/* <TwitterShareButton url={text}>
                <TwitterIcon size={32} round />
              </TwitterShareButton> */}
               <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">
          <img src="/static/images/logo/icons8-twitter.svg" alt="Twitter" width={32} height={32} />
        </a>
            </IconButtonWrapper>
          </Tooltip>
          <Tooltip arrow placement="top" title="Whatsapp">
            <IconButtonWrapper>
              <WhatsappShareButton url={text} >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </IconButtonWrapper>
          </Tooltip>
        </Box>
      </Card>
    </Popover>
  );
};

export const SigleItem = ({ title, subtitle }) => {
  return (
    <Box>
      <Typography sx={{ display: 'flex', alignItems: 'baseline' }} variant="h6">
        <Typography
          sx={{
            fontWeight: 'normal',
            font: 'Helvetica Neue Medium',
            mb: 0.5
          }}
          variant="h4"
        >
          {title}
        </Typography>
      </Typography>

      <Typography
        sx={{
          fontWeight: 600,
          font: 'Helvetica Neue Medium',
          mb: 1
        }}
        variant={subtitle ? 'h4' : 'subtitle2'}
      >
        {subtitle || 'Not added'}
      </Typography>
    </Box>
  );
};

export const FloorPlanDocument = ({ floorPlan }) => {
  console.log("floorPlan", floorPlan)
  let isFloorPlan = true;
  return (
    <React.Fragment>
      <Box sx={{ pb: 2 }}>
        <Grid container spacing={3}>
          {floorPlan?.map((item, index) => {
            let docfile = {
              title: item?.title || '',
              url: item?.url || '',
              contentType: item?.contentType || '',
              formType: `Floor PLan ${+index + 1}`
            };

            return (
              <>
                <Grid item xs={12} md={6} xl={6} key={index}>
                  <Typography variant="h4" mb={0.5}>{`Floor Plan ${+index + 1
                    }`}</Typography>
                  <Card>
                    <Box p={1}>
                      <Typography
                        variant="h4"
                        mb={0.5}
                      >{`${item?.bhk} `}</Typography>
                      <Typography
                        variant="h5"
                        sx={{ color: '#c0c1c3' }}
                      >{`Total Units - ${item?.totalNumberOfUnits} `}</Typography>
                      <Typography
                        variant="h5"
                        sx={{ color: '#c0c1c3' }}
                      >{`${item?.size} ${item?.unit}`}</Typography>
                    </Box>
                    <Divider sx={{ mb: 0.1 }} />
                    <SingleDocument item={docfile} isFloorPlan={isFloorPlan} />
                  </Card>
                </Grid>
              </>
            );
          })}
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export const MapCard = ({ address, location, children }) => {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = React.useState(null);
  const list = ['Copy Address', 'Share Location'];
  const [selectedEntity, setSelectedEntity] = useState(null);
  const handleMenuClick = (event, url) => {
    setSelectedEntity(url);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedEntity(null);
  };
  const handleShareClose = () => {
    setShareAnchorEl(null);
    setShareOpen(false);
    handleMenuClose();
  };
  const handleShareClick = (event) => {
    setShareAnchorEl(event.currentTarget);
    setShareOpen(true);
  };
  const copy = () => {
    navigator.clipboard.writeText(address);
    showNotification(`Copied !`, notificationType.SUCCESS);
    handleMenuClose();
  };
  const handleSelectedMenu = (event, selectedMenu) => {
    if (selectedMenu === 'Copy Address') {
      copy();
    } else if (selectedMenu === 'Share Location') {
      handleShareClick(event);
    }
  };
  return (
    <>
      <Typography variant="h4" mb={1}>
        Project Location
      </Typography>
      <Card>
        <Box sx={{ width: 220, height: 220, mt: { xs: 1, md: 0 } }}>
          {children}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pr: 1,
            my: 1
          }}
        >
          <Box
            sx={{
              width: '90%'
            }}
          >
            <ListItem>
              <ListItemAvatar sx={{ ml: -2 }}>''</ListItemAvatar>
              <ListItemText disableTypography>
                <Typography
                  variant="h5"
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {address}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.primary.main,
                    cursor: 'pointer',
                    mt: 0.2,
                    fontWeight: 'bold'
                  }}
                  onClick={() => {
                    window.open(
                      `https://maps.google.com/?q=${location[0]},${location[1]}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                >
                  View on Map
                </Typography>
              </ListItemText>
            </ListItem>
          </Box>
          <Box
            onClick={(e) => {
              handleMenuClick(e, address);
            }}
          >
            <MoreVertIcon
              sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
              fontSize="medium"
            />{' '}
          </Box>
          <Menu
            id="basic-menu"
            anchorEl={menuAnchorEl}
            open={selectedEntity === address}
            onClose={() => {
              handleMenuClose();
            }}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            PaperProps={{
              style: {
                backgroundColor: '#d3e7fe',
                borderRadius: '5px',
                m: -2
              }
            }}
          >
            {list.map((listName, indexList) => {
              return (
                <>
                  <MenuItem
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      p: 0,
                      m: 0
                    }}
                    onClick={(e) => handleSelectedMenu(e, listName)}
                  >
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          font: '',
                          color: theme.palette.primary.main,
                          fontWeight: 'normal'
                        }}
                      >
                        {listName}
                      </Typography>
                    </Box>
                  </MenuItem>
                  {list.length > 0 && indexList + 1 < list.length && (
                    <Divider sx={{ color: ` 0.5px dashed #c0c1c3` }} />
                  )}
                </>
              );
            })}
          </Menu>
          <ShareComponent
            text={`https://maps.google.com/?q=${location[0]},${location[1]}`}
            title="Address -"
            handleClose={handleShareClose}
            open={shareOpen}
            anchorEl={shareAnchorEl}
          />
        </Box>
      </Card>
    </>
  );
};
