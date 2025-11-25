import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Grid,
  InputLabel,
  InputAdornment,
  CardMedia,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import OpenNotification from 'src/content/ShowNotification';

import { useDispatch } from 'src/store';
import Loader from 'src/UI/Loader/Loader.js';
// import { UploadFileVerticalNew } from 'src/components/Upload/UploadFileVerticalNew';
import { AddProjectField } from '../../../slices/project_forms';
import {
  UploadFileHorizontal,
  UploadVideo,
  GetURLForUpload,
  getStatus,
  // handleRemoveFromS3
} from './Index';
import DeleteConfirmation from '../../../content/delete-alert/DeleteAlert';
// import { UploadFileVerticalNew } from 'src/components/Upload/UploadFileVerticalNew';

const initialValues = {
  projectimages: [],
  sampleflatpictures: [],
  projecttrainingvideos: [''],
  projectvideos: [''],
  officialWebsiteLink: '',
  facebookPageLink: '',
  youtubeChannel: '',
  instagramPageLink: ''
};
const socialList = [
  'officialWebsiteLink',
  'facebookPageLink',
  'youtubeChannel',
  'instagramPageLink'
];
export const VideoComponent = ({
  src,
  alt,
  name,
  handleRemove,
  index = 0,
  setIndex
}) => {
  const [isDelete, setDelete] = useState(false);

  const handleDeleteCompleted = () => {
    setDelete(false);
    handleRemove(name, src, index, setIndex);
  };

  const handleClose = () => {
    setDelete(false);
  };
  return (
    <>
      {isDelete && (
        <DeleteConfirmation
          openConfirmDelete={isDelete}
          closeConfirmDelete={handleClose}
          handleDeleteCompleted={handleDeleteCompleted}
          selectedId={index}
        />
      )}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          key={index}
          component="iframe"
          src={`${src}?w=248&fit=crop&auto=format&dpr=2 2x`}
          // allow="autoPlay"
          sx={{
            display: 'block',
            height: 'auto',
            maxHeight: { xs: '300px', md: '350px' },
            width: { xs: '180px', md: '250px' },
            maxWidth: { xs: '180px', md: '300px' },
            border: '1px solid #E3EAF5',
            borderRadius: 'inherit',
            zIndex: 5
          }}
          srcSet={`${src}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={alt !== '' ? alt : '...'}
        />

        <button
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'block',
            width: '20px',
            height: '22px',
            border: 'none',
            borderRadius: '4px',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'red',
            cursor: 'pointer',
            padding: 0,
            fontSize: '22px'
          }}
          type="button"
          onClick={() => {
            setDelete(true);
          }}
          id={index}
        >
          &times;
        </button>
      </Box>
    </>
  );
};
export const ImageComponent = ({
  src,
  alt,
  name,
  handleRemove,
  index = 0,
  setIndex
}) => {
  const [isDelete, setDelete] = useState(false);

  const handleDeleteCompleted = () => {
    setDelete(false);
    handleRemove(name, src, index, setIndex);
  };

  const handleClose = () => {
    setDelete(false);
  };
  return (
    <>
      {isDelete && (
        <DeleteConfirmation
          openConfirmDelete={isDelete}
          closeConfirmDelete={handleClose}
          handleDeleteCompleted={handleDeleteCompleted}
          selectedId={index}
        />
      )}


      <Box sx={{ position: 'relative' }}>
        <Box sx={{ width: '100%', }}>
          <CardMedia
            key={index}
            component="img"
            sx={{
              display: 'block',
              height: '200px',
              maxHeight: { xs: '200px', md: '300px' },
              // { xs: '240px', md: '235px',xl:'255px',xxl:'260px' }
              width: 'inherit',
              maxWidth: { xs: '240px', md: '300px', xl: '300px', xxl: '300px' },
              border: '1px solid #E3EAF5',
              borderRadius: 'inherit',
              objectFit: 'fill'
            }}
            // srcSet={`${src}?w=248&fit=crop&auto=format&dpr=2 2x`}
            image={`${src}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={alt !== '' ? alt : '...'}
          />

          <button
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              display: 'block',
              width: '20px',
              height: '22px',
              border: 'none',
              borderRadius: '4px',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'red',
              cursor: 'pointer',
              padding: 0,
              fontSize: '22px'
            }}
            type="button"
            onClick={() => {
              setDelete(true);
            }}
            id={index}
          >
            &times;
          </button>
        </Box>
      </Box>
    </>
  );
};
const ProjectMediaForm = ({
  handleNext,
  handleExist,
  FormId,
  prevData,
  projectId,
  isEditing,
  handleCancel,
  handleEditSave
}) => {
  const dispatch = useDispatch();
  const [indexImages, setIndexImages] = useState(-1);
  const [indexSampleImages, setindexSampleImages] = useState(-1);
  const [projectMediaDetails, setAddProjectMediaDetails] =
    useState(initialValues);
  const [isContinueClicked, setIsContinuedClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState({
    projectimages: false,
    sampleflatpictures: false,
    clubpictures: false
  });
  const handleLoading = (name, value) => {
    setLoading({ ...loading, [name]: value });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddProjectMediaDetails({ ...projectMediaDetails, [name]: value });
  };
  const imageArrayName = [
    'projectimages',
    'sampleflatpictures',
    'clubpictures'
  ];
  const getName = (imageFileName) => {
    let name = imageArrayName.filter((item) => imageFileName.includes(item));
    return name[0];
  };
  const getMultipleImagesUpload = (resultArray) => {
    return resultArray.map((result) => result.url);
  };
  // const updateURlImages = (result) => {
  //   let name = getName(result[0]?.type);
  //   const ImagesArray = [...projectMediaDetails[`${name}`]];
  //   let ImageUrls = getMultipleImagesUpload(result);
  //   Array.prototype.push.apply(ImagesArray, ImageUrls);
  //   setAddProjectMediaDetails({ ...projectMediaDetails, [name]: ImagesArray });
  //   handleLoading(name, false);
  // };
  const updateURlImages = (result) => {
    let name = getName(result[0]?.type);
    const ImagesArray = [...projectMediaDetails[`${name}`]];
    let ImageUrls = getMultipleImagesUpload(result);
    Array.prototype.push.apply(ImagesArray, ImageUrls);
    setAddProjectMediaDetails({ ...projectMediaDetails, [name]: ImagesArray });
    handleLoading(name, false);
  };

  const handleImageDelete = (name, url, indexImages, setIndex) => {
    // handleRemoveFromS3(url).then((response) => {
    //   if (response) {
        const ImagesArray = [...projectMediaDetails[`${name}`]];
        ImagesArray.splice(indexImages, 1);
        setIndex(ImagesArray.length - 1);

        setAddProjectMediaDetails({
          ...projectMediaDetails,
          [`${name}`]: ImagesArray
        });
    //   }
    // });
  };
  const getImageArray = (name, arrayList) => {
    let imgArr = arrayList
      .filter((item) => item?.title === name)
      .map((item) => item?.url);
    if (name === 'projectimages') {
      setIndexImages(imgArr.length - 1);
    } else if (name === 'sampleflatpictures') {
      setindexSampleImages(imgArr.length - 1);
    }
    return imgArr;
  };
  const getVideoArray = (name, arrayList) => {
    let videoArr = arrayList
      .filter((item) => item.formType === name)
      .map((item) => item.link);
    if (videoArr.length === 0) {
      return [''];
    }
    return videoArr;
  };
  const getSocialLink = (name, socialArr) => {
    let link = socialArr
      .filter((item) => item.formType === name)
      .map((item) => item.link);
    return link[0];
  };
  const getPreviousData = () => {
    const { images, social, projectTraining } = prevData;
    const value = {
      projectimages: getImageArray('projectimages', images),
      sampleflatpictures: getImageArray('sampleflatpictures', images),
      projecttrainingvideos: getVideoArray(
        'projecttrainingvideos',
        projectTraining
      ) || [''],
      projectvideos: getVideoArray('projectvideos', projectTraining) || [''],
      officialWebsiteLink: getSocialLink('officialWebsiteLink', social),
      facebookPageLink: getSocialLink('facebookPageLink', social),
      youtubeChannel: getSocialLink('youtubeChannel', social),
      instagramPageLink: getSocialLink('instagramPageLink', social)
    };
    setAddProjectMediaDetails(value);
  };

  const handleSave = async (isContinueClicked) => {
    setIsContinuedClicked(isContinueClicked);
    setIsSubmitting(true);
    const projectImagesArray = projectMediaDetails.projectimages.map(
      (item) => ({ url: item, title: 'projectimages', isProfile: false })
    );

    const sampleflatImagesArray = projectMediaDetails.sampleflatpictures.map(
      (item) => ({ url: item, title: 'sampleflatpictures', isProfile: false })
    );
    Array.prototype.push.apply(projectImagesArray, sampleflatImagesArray);
    const socialLink = socialList
      .filter((item) => projectMediaDetails[`${item}`] !== '')
      .map((item) => ({
        link: projectMediaDetails[`${item}`],
        formType: item
      }));
    const projecttraining = projectMediaDetails.projecttrainingvideos
      .filter((item) => item !== '')
      .map((item) => ({ link: item, formType: 'projecttrainingvideos' }));
    const projectproject = projectMediaDetails.projectvideos
      .filter((item) => item !== '')
      .map((item) => ({ link: item, formType: 'projectvideos' }));
    Array.prototype.push.apply(projecttraining, projectproject);
    const payload = {
      images: projectImagesArray,
      social: socialLink,
      projectTraining: projecttraining,
      status: isEditing ? 'PUBLISHED' : getStatus(FormId),
      step: isEditing ? 8 : FormId
    };
    await dispatch(AddProjectField(projectId, payload, isContinueClicked));

    if (!isContinueClicked) {
      if (isEditing) {
        handleEditSave(projectId);
        return;
      }
      handleExist();
    } else {
      handleNext();
    }
    setIsSubmitting(false);
  };
  const handleVideo = (name, videoArray) => {
    setAddProjectMediaDetails({ ...projectMediaDetails, [name]: videoArray });
  };
  useEffect(() => {
    setAddProjectMediaDetails(projectMediaDetails);
  }, [projectMediaDetails]);
  useEffect(() => {
    getPreviousData();
  }, []);


  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      // if (!errorMessage) {
      //   navigate(`/team/${selectedTab}`);
      // }
    }
  };

  // const handleDelete = (url) => {
  //   handleRemoveFromS3(url).then((response) => {
  //     if (response) {
  //      console.log(response);
  //     }
  //   });
  // };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };
  const uploadHorizontal = (e, updateURlImages) => {

    // const { name, id } = e.target;
    let files = e.target.files || e.dataTransfer.files;
    // let nameType = name || id;
    // const userData = JSON.parse(window.localStorage.getItem('user'));

    // let fileBoolean = true;
    // let compressedData;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i]?.type === 'application/pdf') {
          if (files[i].size > 1024 * 1024 * 200) {
            // fileBoolean = false;
            // alert("pdf error")
            const errorMessage = 'Document file should not exceed 200MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        } else if (
          files[i]?.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          if (files[i].size > 1024 * 1024 * 200) {
            // fileBoolean = false;
            const errorMessage = 'Document file should not exceed 200MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        } else if (files[i]?.type.startsWith('image/')) {
          if (files[i].size > 1024 * 1024 * 2) {
            // fileBoolean = false;
            // alert("IMage error")
            const errorMessage = 'Image size should not exceeds 2MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        } else if (files[i]?.type === 'application/vnd.ms-powerpoint' ||
          files[i]?.type === 'application/vnd.ms-powerpoint' ||
          files[i]?.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ) {
          if (files[i].size > 1024 * 1024 * 200) {
            // fileBoolean = false;
            const errorMessage = 'Document file should not exceed 200MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        } else if (
          files[i]?.type === 'application/msword' ||
          files[i]?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          if (files[i].size > 1024 * 1024 * 200) {
            // fileBoolean = false;
            const errorMessage = 'Document file should not exceed 200MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        } else if (files[i].type?.startsWith('video/')) {
          if (files[i].size > 1024 * 1024 * 200) {
            // fileBoolean = false;
            const errorMessage = 'Video file should not exceed 200MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        }
      }
    }

    GetURLForUpload(
      e, updateURlImages

    );
  }
  const uploadHorizontalFile = (e, updateURlImages, indexSampleImages) => {

    // const { name, id } = e.target;
    let files = e.target.files || e.dataTransfer.files;
    // let nameType = name || id;
    // const userData = JSON.parse(window.localStorage.getItem('user'));

    // let fileBoolean = true;
    // let compressedData;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i]?.type === 'application/pdf') {
          if (files[i].size > 1024 * 1024 * 200) {
            // fileBoolean = false;
            // alert("pdf error")
            const errorMessage = 'Document file should not exceed 200MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        } else if (
          files[i]?.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          if (files[i].size > 1024 * 1024 * 200) {
            // fileBoolean = false;
            const errorMessage = 'Document file should not exceed 200MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        } else if (files[i]?.type.startsWith('image/')) {
          if (files[i].size > 1024 * 1024 * 2) {
            // fileBoolean = false;
            // alert("IMage error")
            const errorMessage = 'Image size should not exceeds 2MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        } else if (files[i]?.type === 'application/vnd.ms-powerpoint' ||
          files[i]?.type === 'application/vnd.ms-powerpoint' ||
          files[i]?.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ) {
          if (files[i].size > 1024 * 1024 * 200) {
            // fileBoolean = false;
            const errorMessage = 'Document file should not exceed 200MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        } else if (
          files[i]?.type === 'application/msword' ||
          files[i]?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          if (files[i].size > 1024 * 1024 * 200) {
            // fileBoolean = false;
            const errorMessage = 'Document file should not exceed 200MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        } else if (files[i].type?.startsWith('video/')) {
          if (files[i].size > 1024 * 1024 * 200) {
            // fileBoolean = false;
            const errorMessage = 'Video file should not exceed 200MB';
            setErrorMessage(errorMessage);
            setOpenNoti(true);
            return;
          }
        }
      }
    }

    GetURLForUpload(
      e, updateURlImages, indexSampleImages
    );
  }

  return (
    <>
      <Box my={1} mx={9}>
        <Typography>PROJECT IMAGES</Typography>
        {!loading?.projectimages ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              columnGap: 2,
              rowGap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
              py: 0.5
            }}
          >
            <Grid container >
              {projectMediaDetails.projectimages.length > 0 &&
                projectMediaDetails.projectimages.map((item, index) => {
                  return (
                    <Grid item xs={6} md={4} lg={3} >

                      <ImageComponent
                        src={item}
                        index={index}
                        name="projectimages"
                        alt="Project Images"
                        setIndex={setIndexImages}
                        handleRemove={handleImageDelete}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ p: 5 }}>
            <Loader />
          </Box>
        )}
        <UploadFileHorizontal
          setLoading={(value) => {
            handleLoading('projectimages', value);
          }}
          nameNonTitle="projectimages"
          title=""
          handleChange={(e) => {
            // GetURLForUpload(e, updateURlImages);
            uploadHorizontal(e, updateURlImages)
          }}
          name="projectimages"
        />

        <Divider sx={{ my: 3 }} />
        {prevData?.projectType === 'residential' &&
          prevData?.projectSubType === 'apartments' && (
            <>
              <Typography>SAMPLE FLAT PICTURES</Typography>
              {!loading?.sampleflatpictures ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    rowGap: 2,
                    columnGap: 2,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    py: 2
                  }}
                >
                  <Grid container columnSpacing={1} rowSpacing={1}>
                    {projectMediaDetails.sampleflatpictures.length > 0 &&
                      projectMediaDetails.sampleflatpictures.map(
                        (item, index) => {
                          return (
                            <Grid item xs={4}>
                              <ImageComponent
                                src={item}
                                index={index}
                                name="sampleflatpictures"
                                alt="sample flat Pictures"
                                setIndex={setindexSampleImages}
                                handleRemove={handleImageDelete}
                              />
                            </Grid>
                          );
                        }
                      )}
                  </Grid>

                </Box>
              ) : (
                <Box sx={{ p: 5 }}>
                  <Loader />
                </Box>
              )}
              <UploadFileHorizontal
                setLoading={(value) => {
                  handleLoading('sampleflatpictures', value);
                }}
                nameNonTitle={`sampleflatpictures${indexImages}`}
                setIndex={setindexSampleImages}
                title=""
                handleChange={(e) => {
                  // GetURLForUpload(e, updateURlImages, indexSampleImages);
                  uploadHorizontalFile(e, updateURlImages, indexSampleImages)
                }}
                name=""
              />
              <Divider sx={{ my: 3 }} />
            </>
          )}
        <UploadVideo
          title="PROJECT TRAINING VIDEOS"
          handleChange={handleVideo}
          videos={projectMediaDetails.projecttrainingvideos}
        />
        <UploadVideo
          title="PROJECT VIDEOS"
          handleChange={handleVideo}
          videos={projectMediaDetails.projectvideos}
        />
        <Divider sx={{ my: 3 }} />
        <Typography variant="h4" mb={3}>
          SOCIAL CONNECT
        </Typography>
        <Grid container columnSpacing={4} rowSpacing={4}>
          <Grid item xs={12} md={6}>
            <Box width="100%">
              <InputLabel sx={{ mb: 1 }}>Official Website Link</InputLabel>
              <TextField
                id="officialWebsiteLink"
                name="officialWebsiteLink"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src="/static/images/logo/web-icon.svg"
                        alt=""
                        style={{ width: 34, height: 34 }}
                      />
                    </InputAdornment>
                  )
                }}
                onChange={handleChange}
                value={projectMediaDetails.officialWebsiteLink}
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box width="100%">
              <InputLabel sx={{ mb: 1 }}>Facebook Page Link</InputLabel>
              <TextField
                id="facebookPageLink"
                name="facebookPageLink"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src="/static/images/logo/facebook-icon.svg"
                        alt=""
                        style={{ width: 34, height: 34 }}
                      />
                    </InputAdornment>
                  )
                }}
                variant="outlined"
                onChange={handleChange}
                value={projectMediaDetails.facebookPageLink}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box width="100%">
              <InputLabel sx={{ mb: 1 }}>Youtube Channel</InputLabel>
              <TextField
                id="youtubeChannel"
                name="youtubeChannel"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src="/static/images/logo/youtube-icon.svg"
                        alt=""
                        style={{ width: 34, height: 34 }}
                      />
                    </InputAdornment>
                  )
                }}
                variant="outlined"
                onChange={handleChange}
                value={projectMediaDetails.youtubeChannel}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box width="100%">
              <InputLabel sx={{ mb: 1 }}>Instagram Page Link</InputLabel>
              <TextField
                id="instagramPageLink"
                name="instagramPageLink"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src="/static/images/logo/insta-icon.svg"
                        alt=""
                        style={{ width: 34, height: 34 }}
                      />
                    </InputAdornment>
                  )
                }}
                variant="outlined"
                onChange={handleChange}
                value={projectMediaDetails.instagramPageLink}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box
        my={3}
        mx={9}
        sx={{ display: 'flex', flexDirection: 'row', columnGap: 2 }}
      >
        {isEditing ? (
          <>
            <Button
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
              disabled={isSubmitting}
              onClick={() => handleSave(false)}
            >
              Save
            </Button>
            <Button variant="outlined" onClick={() => handleCancel(projectId)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              startIcon={
                isSubmitting && isContinueClicked ? (
                  <CircularProgress size="1rem" />
                ) : null
              }
              disabled={isSubmitting && isContinueClicked}
              onClick={() => handleSave(true)}
            >
              Save & continue
            </Button>
            <Button
              variant="outlined"
              startIcon={
                isSubmitting && !isContinueClicked ? (
                  <CircularProgress size="1rem" />
                ) : null
              }
              disabled={isSubmitting}
              onClick={() => handleSave(false)}
            >
              Save & Exit
            </Button>
          </>
        )}
      </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
};

export default ProjectMediaForm;
