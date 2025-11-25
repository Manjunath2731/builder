import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ShareIcon from '@mui/icons-material/Share';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import {
  Box,
  Typography,
  Divider,
  ImageList,
  ImageListItem,
  useTheme,
  Button,
  Tooltip,
  Avatar,
  Card,
  Grid,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import { TitleComponent, VideoComponent, IconButtonWrapper } from './index';

const useStyles = makeStyles(() => ({
  root: {
    '&::-webkit-scrollbar': {
      width: 7
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#98b9d6'
    }
  }
}));

const getImageArray = (name, arrayList) => {
  let imgArr = arrayList
    ?.filter((item) => item?.title === name)
    ?.map((item) => item?.url);
  if (imgArr !== undefined) {
    return imgArr;
  }
  return [];
};
const socialIcons = [
  {
    label: 'Official website link',
    value: 'officialWebsiteLink',
    iconSrc: '/static/images/logo/web-icon.svg',
    link: ''
  },
  {
    label: 'Facebook Page',
    value: 'facebookPageLink',
    iconSrc: '/static/images/logo/facebook-icon.svg',
    link: ''
  },
  {
    label: 'Instagram Page',
    value: 'instagramPageLink',
    iconSrc: '/static/images/logo/insta-icon.svg',
    link: ''
  },
  {
    label: 'Youtube Channel',
    value: 'youtubeChannel',
    iconSrc: '/static/images/logo/youtube-icon.svg',
    link: ''
  }
];
const getSocialValue = (obj, socialArr) => {
  let modifiedValue = socialArr
    .filter((item) => item.formType === obj.value)
    .map((item) => ({ ...obj, link: item?.link }));
  return modifiedValue[0];
};
const getSocialIcons = (socialArr) => {
  if (socialArr.length > 0) {
    let socialIconArr = socialIcons.map((item) => {
      let modifiedItem = getSocialValue(item, socialArr);
      return modifiedItem;
    });
    return socialIconArr;
  }
  return socialIcons;
};
const SocialCard = ({ socialDetails }) => {
  // const theme = useTheme();
  const handleMenuClick = (link) => {
    if (link) {
      window.open(link, '_blank');
    }
  };
  return (
    <>
      <Card>
        <Box
          sx={{
            display: 'flex ',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            p: 1,
            cursor: 'pointer'
          }}
          onClick={() => handleMenuClick(socialDetails?.link)}
        >
          <Box sx={{ width: { xs: '90%' } }}>
            <ListItem>
              <ListItemAvatar
                sx={{
                  minWidth: 'auto',
                  mt: 1,
                  mr: 2,
                  mb: 2
                }}
              >
                <Avatar
                  sx={{
                    width: 45,
                    height: 45
                  }}
                  alt="Image"
                  src={socialDetails?.iconSrc}
                />
              </ListItemAvatar>
              <ListItemText disableTypography>
                <Typography
                  variant="h4"
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: { xs: '100%' }
                  }}
                >
                  {socialDetails?.link || 'No link added'}
                </Typography>
                <Typography variant="subtitle2">
                  {socialDetails?.label}
                </Typography>
              </ListItemText>
            </ListItem>
          </Box>
          {/* <Box onClick={(e) => handleMenuClick(e)}>
            <MoreVertIcon
              sx={{ color: theme.palette.primary.main }}
              fontSize="medium"
            />
          </Box> */}
        </Box>
      </Card>
    </>
  );
};
export const HeadingComponent = ({ heading, buttonText, handleShare, id }) => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1
        }}
      >
        <Typography variant="h4" mt={1}>
          {heading}
        </Typography>
        <Button
          component="span"
          // onClick={copy}
          startIcon={
            <ShareIcon
              sx={{
                color: theme.palette.common.black,
                fontSize: 'medium',
                stroke: 'black',
                strokeWidth: 1.5
              }}
            />
          }
          sx={{
            background: theme.palette.common.white,
            border: 1,
            borderRadius: '5px',
            borderColor: theme.palette.grey[300],
            color: theme.palette.primary.main,
            fontWeight: 'normal',
            whiteSpace: 'nowrap',
            '&:hover': { background: theme.palette.common.white },
            p: -1
          }}
          onClick={() => handleShare(id)}
        >
          {`Share ${buttonText}`}{' '}
        </Button>
      </Box>
    </>
  );
};
const SelectAll = ({ id, list, ImageList, handleAllSelected }) => {
  const selectedSomeFile = list.length > 0 && list.length < ImageList.length;
  const selectedAllFile = list.length === ImageList.length;
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={selectedAllFile}
          onChange={(event) => {
            handleAllSelected(event, id, ImageList);
          }}
          indeterminate={selectedSomeFile}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <Typography> Select All</Typography>
      </Box>
    </>
  );
};
const ShareBox = ({ stringUrl, handleCancel, id, count }) => {
  const theme = useTheme();
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 1 }}>
        <Card className="Mui-mailboxRow">
          <Box display="flex" alignItems="center" mr={1}>
            {count > 0 && (
              <Typography variant="h4" sx={{ p: 1 }}>
                {`${count} selected`}
              </Typography>
            )}
            <Tooltip arrow placement="top" title="Facebook">
              <IconButtonWrapper>
                <FacebookShareButton
                  url={stringUrl}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              </IconButtonWrapper>
            </Tooltip>
            <Tooltip arrow placement="top" title="Twitter">
              <IconButtonWrapper>
                <TwitterShareButton
                  url={stringUrl}
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
              </IconButtonWrapper>
            </Tooltip>
            <Tooltip arrow placement="top" title="Whatsapp">
              <IconButtonWrapper>
                <WhatsappShareButton
                  url={stringUrl}
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              </IconButtonWrapper>
            </Tooltip>
            <Typography
              sx={{
                color: theme.palette.primary.main,
                cursor: 'pointer',
                ml: 1
              }}
              onClick={() => handleCancel(id)}
            >
              Cancel
            </Typography>
          </Box>
        </Card>
      </Box>
    </>
  );
};
export const MediaScrollBar = ({
  cols,
  gap,
  maxHeight,
  minheight,
  children
}) => {
  const classes = useStyles();
  return (
    <>
      <Box
        className={classes.root}
        sx={{
          width: '100%',
          minHeight: minheight || 50,
          maxHeight: maxHeight || 450,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          pr: 1
        }}
      >
        <ImageList variant="masonry" cols={cols} gap={gap}>
          {children}
        </ImageList>
      </Box>
    </>
  );
};
export const ImageScrollableComponent = ({
  imgArr,
  isShareSelect,
  handleSelect,
  selectedImages,
  id
}) => {
  const classes = useStyles();
  return (
    <>
      <Box
        className={classes.root}
        sx={{
          width: '100%',
          minHeight: 50,
          maxHeight: 450,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          pr: 1
        }}
      >
        <ImageList variant="masonry" cols={3} gap={8}>
          {imgArr?.map((item) => {
            let isSelected = selectedImages?.includes(item);
            return (
              <ImageListItem key={item}>
                <img
                  src={`${item}?w=248&fit=crop&auto=format`}
                  srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.title}
                  loading="lazy"
                />
                {isShareSelect && (
                  <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        handleSelect(event, id);
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                      id={item}
                      name={item}
                    />
                  </Box>
                )}
              </ImageListItem>
            );
          })}
        </ImageList>
      </Box>
    </>
  );
};
export const MessageComponent = ({ title, text }) => {
  return (
    <>
      <Box py={1}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'normal',
            font: 'Helvetica Neue Medium',
            mb: 0.5
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            font: 'Helvetica Neue Medium',
            color: '#c0c1c3'
          }}
        >
          {text}
        </Typography>
      </Box>
    </>
  );
};
const ProjectMedia = ({ titleName, project, formName }) => {
  const initialShareValue = { project: false, sample: false, videos: false };
  const initialSelectFileValue = { project: [], sample: [], videos: [] };
  let projectPictures = getImageArray('projectimages', project?.images);
  // let sampleflatImages = getImageArray('sampleflatpictures', project?.images);
  const [isShare, setIsShare] = useState(initialShareValue);

  const [selectedProject, setSelectedProject] = useState([]);

  const [selectedImages, setSelectedImages] = useState(initialSelectFileValue);
  const handleShare = (id) => {
    setIsShare({ ...isShare, [id]: true });
  };
  const handleCancel = (id) => {
    setIsShare({ ...isShare, [id]: false });
    setSelectedImages({ ...selectedImages, [id]: [] });
  };
  const getAllVideoLink = (selectedProject) => {
    let linkArray
    if (selectedProject.length > 0) {
      linkArray = selectedProject.map((item) => `${item}\n`);
    } else {
      linkArray = project.projectTraining.map((item) => `${item?.link}\n`);
    }
    // let str = getLinkString(linkArray);
    return linkArray;
  };
  let socialIcons = getSocialIcons(project?.social);

  const handleSelect = (event, id) => {
    let selectedArray = [...selectedImages[id]];
    if (!selectedArray.includes(event.target.id)) {
      selectedArray.push(event.target.id);
    } else {
      let tempVar = selectedArray.filter((e) => e !== event.target.id);
      selectedArray = tempVar;
    }
    setSelectedImages({ ...selectedImages, [`${id}`]: selectedArray });
  };

  const handleSelectProject = (event, item) => {
    if (event.target.checked) {
      setSelectedProject([...selectedProject, item.link]);
    } else {
      const data = selectedProject.filter((i) => i !== item.link);
      setSelectedProject([...data]);
    }
  };

  const handleAllChecked = (event, id, imageArray) => {
    if (event.target.checked) {
      setSelectedImages({ ...selectedImages, [`${id}`]: imageArray });
    } else {
      setSelectedImages({ ...selectedImages, [`${id}`]: [] });
    }
  };

  const handleAllCheckedVideo = (event) => {
    const data = getAllVideoLink();
    if (event.target.checked) {
      setSelectedProject(data);
    } else {
      setSelectedProject([]);
    }
  };

  const getLinkString = (linkArr) => {
    if (linkArr?.length > 1) {
      return linkArr.join('\n');
    }
    return linkArr[0] || '';
  };
  return (
    <>
      <Box>
        <TitleComponent title={titleName} formName={formName} />
        <Box>
          {projectPictures?.length > 0 ? (
            <>
              <HeadingComponent
                heading="Project Pictures"
                buttonText="Images"
                handleShare={handleShare}
                id="project"
              />
              <ImageScrollableComponent
                id="project"
                imgArr={projectPictures}
                isShareSelect={isShare?.project}
                handleSelect={handleSelect}
                selectedImages={selectedImages?.project}
              />

              {isShare?.project && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <SelectAll
                    id="project"
                    list={selectedImages?.project}
                    ImageList={projectPictures}
                    handleAllSelected={handleAllChecked}
                  />
                  <ShareBox
                    stringUrl={getLinkString(selectedImages?.project)}
                    id="project"
                    handleCancel={handleCancel}
                    count={(selectedImages?.project).length}
                  />
                </Box>
              )}
            </>
          ) : (
            <MessageComponent
              title="Project Pictures"
              text=" No images added"
            />
          )}
          <Divider sx={{ mb: 2 }} />

          {/* {sampleflatImages?.length > 0 ? (
            <>
              {' '}
              <HeadingComponent
                heading="Sample Project Pictures"
                buttonText="Images"
                handleShare={handleShare}
                id="sample"
              />
              <ImageScrollableComponent
                id="sample"
                imgArr={sampleflatImages}
                isShareSelect={isShare?.sample}
                handleSelect={handleSelect}
                selectedImages={selectedImages?.sample}
              />
              {isShare?.sample && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <SelectAll
                    id="sample"
                    list={selectedImages?.sample}
                    ImageList={sampleflatImages}
                    handleAllSelected={handleAllChecked}
                  />
                  <ShareBox
                    stringUrl={getLinkString(selectedImages?.sample)}
                    id="sample"
                    handleCancel={handleCancel}
                    count={(selectedImages?.sample).length}
                  />
                </Box>
              )}
            </>
          ) : (
            <MessageComponent
              title="Sample Project Pictures"
              text=" No images added"
            />
          )}
          <Divider sx={{ mb: 2 }} /> */}
          {project?.projectTraining?.length > 0 ? (
            <>
              <HeadingComponent
                heading="Project Training Videos"
                buttonText="Videos"
                handleShare={handleShare}
                id="videos"
              />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: 2,
                  position: 'relative',
                  rowGap: 2,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  py: 2
                }}
              >
                {project?.projectTraining.map((item, index) => {
                  return (
                    <>
                      {item.formType === "projecttrainingvideos" && <VideoComponent
                        src={item?.link}
                        index={index}
                        alt="Project Videos"
                        selectedProject={selectedProject}
                        handleSelectProject={handleSelectProject}
                        item={item}
                        isShare={isShare.videos}
                      />}
                    </>
                  );
                })}
              </Box>
              {isShare?.videos && (
                <Box>
                  <SelectAll
                    id="videos"
                    list={selectedProject}
                    ImageList={project?.projectTraining}
                    handleAllSelected={handleAllCheckedVideo}
                  />
                  <ShareBox
                    stringUrl={getAllVideoLink(selectedProject)}
                    id="videos"
                    handleCancel={handleCancel}
                    count={selectedProject?.projectTraining?.length}
                  />
                </Box>
              )}
            </>
          ) : (
            <MessageComponent title=" Project Videos" text=" No video added" />
          )}

          <Divider sx={{ mb: 2 }} />

          {project?.projectTraining?.length > 0 ? (
            <>
              <HeadingComponent
                heading="Project Videos"
                buttonText="Videos"
                handleShare={handleShare}
                id="videos"
              />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: 2,
                  position: 'relative',
                  rowGap: 2,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  py: 2
                }}
              >
                {project?.projectTraining.map((item, index) => {
                  return (
                    <>
                      {item.formType === "projectvideos" && <VideoComponent
                        src={item?.link}
                        index={index}
                        alt="Project Videos"
                        selectedProject={selectedProject}
                        handleSelectProject={handleSelectProject}
                        item={item}
                        isShare={isShare.videos}
                      />}
                    </>
                  );
                })}
              </Box>
              {isShare?.videos && (
                <Box>
                  <SelectAll
                    id="videos"
                    list={selectedProject}
                    ImageList={project?.projectTraining}
                    handleAllSelected={handleAllCheckedVideo}
                  />
                  <ShareBox
                    stringUrl={getAllVideoLink(selectedProject)}
                    id="videos"
                    handleCancel={handleCancel}
                    count={selectedProject?.projectTraining?.length}
                  />
                </Box>
              )}
            </>
          ) : (
            <MessageComponent title=" Project Videos" text=" No video added" />
          )}
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h4" my={1}>
            Social Connect
          </Typography>
          <Grid container spacing={2}>
            {socialIcons.map((item) => {
              return (
                <>
                  <Grid item xs={12} md={6}>
                    <SocialCard socialDetails={item} />
                  </Grid>
                </>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default ProjectMedia;
