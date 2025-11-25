import React, { useState } from 'react';
import { Box, Grid, Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const fileType = ['jpg', 'jpeg', 'png'];
const videoType = ['mp4'];

const ListImagesAndVideos = ({ list }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isVideo, setIsVideo] = useState(false); // Track whether the selected media is a video

  const openMediaModal = (mediaUrl, contentType) => {
    setSelectedMedia(mediaUrl);
    setIsVideo(videoType.includes(contentType));
    setOpenModal(true);
  };

  return (
    <>
      <Grid container columnSpacing={1} rowSpacing={1}>
        {list.map((item, index) => {
          const mediaUrl = item?.url || item?.downloadLink;
          return (
            <React.Fragment key={index}>
              {!(fileType.indexOf(item?.contentType) === -1 && videoType.indexOf(item?.contentType) === -1) && (
                <Grid item xs={6} lg={4} xl={3}>
                  <Box
                    sx={{
                      height: '180px',
                      width: '100%',
                      cursor: 'pointer', // Make media clickable
                    }}
                    onClick={() => openMediaModal(mediaUrl, item.contentType)}
                  >
                    {fileType.indexOf(item?.contentType) >= 0 && (
                      <>
                        <img
                          src={mediaUrl}
                          alt=""
                          style={{
                            width: 'inherit',
                            height: 'inherit',
                            borderRadius: '3px',
                          }}
                        />
                      </>
                    )}
                    {videoType.indexOf(item?.contentType) >= 0 && (
                      <>
                        <Box key={index}>
                          <video
                            src={selectedMedia}
                            controls // Display video controls
                            style={{ width: '97%', maxHeight: '80vh' }}
                          >
                            <track kind="captions" src="" label="No captions available" />
                            Your browser does not support the video tag.
                          </video>
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
              )}
            </React.Fragment>
          );
        })}
      </Grid>

      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedMedia(null);
          setIsVideo(false);
        }}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent>
          {selectedMedia && (
            <>
              {/* Close button */}
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => {
                  setOpenModal(false);
                  setSelectedMedia(null);
                  setIsVideo(false);
                }}
                sx={{ position: 'absolute', top: '10px', right: '20px' }}
              >
                <CloseIcon />
              </IconButton>
              {isVideo ? (
                <video
                  src={selectedMedia}
                  controls // Display video controls
                  style={{ width: '97%', maxHeight: '80vh' }}
                >
                  <track kind="captions" src="" label="No captions available" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={selectedMedia}
                  alt="Selected Media"
                  style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListImagesAndVideos;
