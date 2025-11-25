import React, {
  // useEffect,
   useState } from 'react';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router';
// import { notificationType } from 'src/constants/NotificationType';
// import { showNotification } from 'src/utils/commonUtility';
import OpenNotification from 'src/content/ShowNotification';

import {
  Box,
  Card,
  Typography,
  Avatar,
  CardMedia,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme
} from '@mui/material';
import { useDispatch } from 'react-redux';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import { calculateTimePast } from '../../../../helpers/timeHelpers';
import { toUpper } from '../../../../utils/utilits';
import {
  feedAction,
  DeleteFeedAction,
  sharePDF,
  DeleteBroadcast
} from '../../../../axiosInstances/Api';

import { addBroadcast, addMyBroadcast } from '../../../../slices/broadcast';
import {
  ShareComponent, getIcons
} from '../ProjectDetailScreens/index';
import ListImagesAndVideos from './ListImagesAndVideos';

const fileType = ['jpg', 'jpeg', 'png'];
const videoType = ['mp4'];

const FeedCard = ({ item }) => {
  const [pdfUrl, setPdfUrl] = useState({ url: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const style = {
    showInRow: { display: 'flex', alignItems: 'center', flexDirection: 'row' }
  };

  const [liked, setLiked] = useState(item?.hasUserLiked);
  const [numberOfLiked, setNumberOfLiked] = useState(item?.numLikes);
  const [wait, setWait] = useState(false);
  const [deleteOptionOpen, setDeleteOptionOpen] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleMoreVertIconClick = () => {
    const toggle = !deleteOptionOpen;
    setDeleteOptionOpen(toggle);
  };

  const handleDeleteOptionClick = () => {
    setDeleteOptionOpen(false);
  };

  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      if (!errorMessage) {
        // navigate(`/team/${selectedTab}`);
        dispatch(addBroadcast());
        dispatch(addMyBroadcast());
      }
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };


  const handlelikeAction = () => {
    if (wait) {
      return;
    }
    setWait(true);
    const payload = {
      referenceId: item._id,
      likeTime: new Date().toISOString()
    };
    if (liked) {
      setNumberOfLiked(numberOfLiked - 1);
      DeleteFeedAction(item._id);
    } else {
      setNumberOfLiked(numberOfLiked + 1);
      feedAction('like', payload);
    }
    dispatch(addBroadcast());
    setLiked((prev) => !prev);
    setWait(false);
  };

  const handleFeedAction = (type) => {
    const payload = {
      referenceId: item._id,
      shareTime: new Date().toISOString()
    };
    feedAction(type, payload);
    dispatch(addBroadcast());
  };
  const theme = useTheme();
  const handleDownload = (item) => {
    saveAs(item?.downloadLink, item?.label);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    const payload = {
      referenceId: item._id,
      likeTime: new Date().toISOString()
    };
    feedAction('share', payload);
    dispatch(addBroadcast());
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPdfUrl({ url: '' });
  };
  const handleSharePdf = (id) => {
    sharePDF(id).then((result) => {
      if (result?.status === 200 || result?.status === 201) {
        setPdfUrl({ url: result?.data?.message?.data[0]?.url });
      }
    });
  };

  const handleBroadCastDelete = async (id) => {
    handleDeleteOptionClick();
    const broadcast = await DeleteBroadcast(id);
    if (broadcast.status === 202) {
      // showNotification(broadcast.data.message, notificationType.SUCCESS);
      setOpenNoti(true);
      setSuccessMessage(broadcast.data.message,);
      // setIsLoading(false);

    } else {
      // showNotification(broadcast.data.message, notificationType.ERROR);
      const errorMessage = broadcast.data.message || 'Something went wrong';
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      // setIsLoading(false);
    }
  }

  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

  return (
    <>
      <Card sx={{ marginTop: 2 }} onClick={() => handleFeedAction('view')}>
        <Box
          sx={{
            pt: 2,
            pl: 2,
            pr: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
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
                  src={item.author?.profileImage}
                />
              </ListItemAvatar>
              <ListItemText disableTypography>
                <Typography variant="h4">
                  {toUpper(item.author.first_name)}
                </Typography>
                <Typography variant="subtitle2">
                  {new Date(item.deliveryTime) > Date.now() ? 'Not Published yet' : calculateTimePast(item.deliveryTime)}
                </Typography>
              </ListItemText>
            </ListItem>
          </Box>
          <Box>
            <CardMedia
              component="img"
              sx={{
                width: 84,
                height: 64,
                objectFit: 'fill',
                border: '1px solid #E3EAF5'
              }}
              alt="Company Logo"
              src={item?.projectId?.logo ? item?.projectId?.logo : item?.builderCompany?.logo}
            />
          </Box>
        </Box>
        {
          new Date(item.deliveryTime) > Date.now() ?
            <Box
              py={1}
              px={4}
              mb={1}
              sx={{
                background: '#FDF1CD',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography
                  px={1}
                  py={1}
                  sx={[style.showInRow, { cursor: 'pointer' }]}
                >
                  <Typography ml={0.5}>{`This broadcast is scheduled at ${new Date(item.deliveryTime).toLocaleTimeString('en-US', timeOptions)} on ${new Date(item.deliveryTime).toLocaleDateString('en-US', dateOptions)}`}</Typography>
                </Typography>
              </Box>
              <Box
                sx={{
                  background: '#FDF1CD',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {/* <Route path="/broadcast/add-broadcast/:teamId" component={AddBroadcast} /> */}

                <Typography
                  px={1}
                  py={1}
                  sx={[style.showInRow, { cursor: 'pointer', ':hover': { color: 'blue', textDecoration: 'underline' }, }]}
                  onClick={() => {
                    navigate(`/broadcast/add-broadcast/edit/${item?._id}`);
                  }}
                >
                  <Typography ml={0.5}>Edit</Typography>
                </Typography>
                <Typography
                  px={1}
                  py={1}
                  sx={[style.showInRow, { cursor: 'pointer', ':hover': { color: 'blue', textDecoration: 'underline' }, }]}
                  onClick={() => { handleBroadCastDelete(item?._id) }}
                >
                  <Typography ml={0.5}>Delete</Typography>
                </Typography>
              </Box>
            </Box>
            :
            <Box
              py={1}
              px={4}
              mb={1}
              sx={{
                background: '#EDEDED',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box sx={style.showInRow}>
                <Box sx={style.showInRow}>
                  <VisibilityOutlinedIcon fontSize="small" />
                  <Typography ml={1} variant="subtitle2">
                    {/* {item.numLikes} Views */}
                    {item.numViews} Views

                  </Typography>
                </Box>
                <Box
                  ml={5}
                  sx={[style.showInRow, { cursor: 'pointer' }]}
                  onClick={handlelikeAction}
                >
                  {liked ? (
                    <ThumbUpIcon fontSize="small" />
                  ) : (
                    <ThumbUpOutlinedIcon fontSize="small" />
                  )}
                  <Typography ml={1} mt={0.1} variant="subtitle2">
                    {numberOfLiked} Likes
                  </Typography>
                </Box>
                <Box ml={5} sx={style.showInRow}>
                  <ShareOutlinedIcon fontSize="small" />
                  <Typography ml={1} variant="subtitle2">
                    {item.numShares} Shares
                  </Typography>
                </Box>
              </Box>
              <Box sx={style.showInRow}>
                <Card
                  sx={{
                    height: '2rem',
                    display: 'flex',
                    paddingTop: '3px',
                    paddingBottom: '3px',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={() => {
                    handleSharePdf(item?._id);
                  }}
                >
                  <Typography
                    px={1}
                    py={1}
                    sx={[style.showInRow, { cursor: 'pointer' }]}
                    onClick={handleClick}
                  >
                    <ShareOutlinedIcon fontSize="small" />
                    <Typography ml={0.5}>Share</Typography>
                  </Typography>
                  {pdfUrl?.url && (
                    <ShareComponent
                      title=""
                      text={pdfUrl?.url}
                      handleClose={handleClose}
                      open={open}
                      anchorEl={anchorEl}
                    />
                  )}
                </Card>
                {/* <Typography
                sx={{
                  marginLeft:1,
                  background: '#EDEDED',
                  color: 'white'
                }}
              >
                <MoreVertIcon sx={{ fontSize: '2rem' , cursor: 'pointer'}}
                  onClick={handleMoreVertIconClick}
                />
                {deleteOptionOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-30px',
                      right: '0',
                      background: 'white',
                      padding: '5px',
                    }}
                  >
                    <button onClick={handleDeleteOptionClick}>Delete</button>
                  </div>
                )}
              </Typography> */}
                <Box style={{ position: 'relative' }}>
                  <Typography
                    sx={{
                      paddingTop: '2px',
                      marginLeft: 1,
                      marginRight: -2,
                      background: '#EDEDED',
                      color: 'white',
                    }}
                  >
                    <MoreVertIcon
                      sx={{ fontSize: 30, cursor: 'pointer' }}
                      onClick={handleMoreVertIconClick}
                    />
                  </Typography>
                  {deleteOptionOpen && (
                    <Box
                      style={{
                        position: 'absolute',
                        bottom: '-1.8rem',
                        right: '-1.8rem',
                        background: 'white',
                        padding: '5px',
                        borderRadius: '5px',
                        border: '1px solid #ebe8e8'
                      }}
                    >
                      <Typography
                        sx={{ cursor: 'pointer' }}
                        onClick={() => { handleBroadCastDelete(item?._id) }}>Delete</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
        }
        {item?.content.length > 0 &&
          <Box
            py={2}
            px={4} >
            <ListImagesAndVideos list={item?.content} />
          </Box>
        }


        <Box py={1} px={4}>
          <Typography variant="h5" mb={1}>
            {toUpper(item.title)}
          </Typography>
          <Typography variant="subtitle2">
            {toUpper(item.description)}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              columnGap: 2
            }}
          >
            {item?.content.length > 0 &&
              item?.content.map((item, index) => {
                let Icons = getIcons(item?.contentType);
                return (
                  <React.Fragment key={index}>
                    {fileType.indexOf(item?.contentType) === -1 &&
                      videoType.indexOf(item?.contentType) === -1 && (
                        <Box
                          sx={{
                            my: 1,
                            display: 'flex',
                            alignitems: 'center',
                            justifyContent: 'flex-start',
                            cursor: 'pointer',
                            color: theme.palette.primary.dark
                          }}
                          onClick={() => {
                            handleDownload(item);
                          }}
                        >
                          {Icons.length > 0 ? (
                            <img
                              src={Icons[0]?.iconSrc}
                              alt=""
                              style={{ width: 25, height: 25, }}
                            />
                          ) : (
                            <Box sx={{ width: '25px' }}>
                              <img
                                src="/static/images/logo/doc-icon.svg"
                                alt=""
                                style={{ width: 25, height: 25 }}
                              />
                            </Box>
                          )}
                          <Typography >{`${item?.label}.${item?.contentType}`}</Typography>
                        </Box>
                      )}
                  </React.Fragment>
                );
              })}
            {item?.link !== '' &&
              item?.link !== null &&
              item?.link !== undefined && (
                <Box
                  my={1}
                  sx={style.showInRow}
                  onClick={() => (window.open(item?.link, '_blank', 'noreferrer'))}
                >
                  <InsertLinkOutlinedIcon color="primary" />
                  <Box ml={1}>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ cursor: 'pointer' }}
                    >
                      {item?.link}
                    </Typography>
                  </Box>
                </Box>
              )}
          </Box>
        </Box>
      </Card>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
};

export default FeedCard;
