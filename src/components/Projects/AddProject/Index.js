import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'src/store';
import {
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  Card,
  InputAdornment,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  Avatar,
  IconButton,
  styled,
  useTheme,
  Modal
} from '@mui/material';
import OpenNotification from 'src/content/ShowNotification';
// import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
// import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';



// import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import ClearIcon from '@mui/icons-material/Clear';
import { showNotification } from 'src/utils/commonUtility';
import { notificationType } from 'src/constants/NotificationType';
import Scrollbar from 'src/components/Scrollbar';
// import { fileCompressor } from 'src/utils/utilits';
import Loader from 'src/UI/Loader/Loader.js';
import { GetUploadFileUrl, deleteFromS3 } from '../../../axiosInstances/Api';
import { ADD_PROJECT_STEP } from '../constants';
import { deleteSliceData } from '../../../slices/project_forms';
import { getProjectById } from '../../../slices/ProjectList';
import ProgressBar from './ProgressBar';
import BasicInfoForm from './BasicInfoForm';
import AbouProjectForm from './AboutProjectForm';
import ProjectMediaForm from './ProjectMediaForm';
import BookingInfoForm from './BookingInfoForm';
import PlanLayoutForm from './PlanLayoutForm';
import PricingForm from './PricingForm';
import PaymentPlansForm from './PaymentPlansForm';
import ApprovedBanksForm from './ApprovedBanksForm';
import ArchitectConsultantsForm from './ArchitectConsultantsForm';
import DeleteConfirmation from '../../../content/delete-alert/DeleteAlert';

import { getIcons } from '../ViewProjectDetails/ProjectDetailScreens/index';

const fileType = ['jpg', 'jpeg', 'png'];
const videoType = ['mp4'];
const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(2)};
    margin-top: ${theme.spacing(2)};
    background: ${theme.colors.alpha.trueWhite[10]};
    border: 3px dashed ${theme.colors.alpha.trueWhite[50]};
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(['border', 'background'])};

    &:hover {
      background: ${theme.colors.alpha.trueWhite[5]};
      border: 4px dashed ${theme.colors.alpha.trueWhite[100]};
     
    }
`
);
export const browseButton = {
  color: '#000',
  background: '#fff',
  border: 1,
  borderColor: '#c5c5c5',
  fontWeight: 'normal',
  '&:hover': {
    background: '#fff',
    border: 1,
    borderRadius: '10px',
    borderColor: '#c5c5c5'
  },
  py: 1,
  px: 1
};
export const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
       background: #6bbf4f;
  color: ${theme.colors.alpha.trueWhite[100]};
        width: ${theme.spacing(5)};
        height: ${theme.spacing(5)};
  `
);
export const EditorWrapper = styled(Box)(
  ({ theme }) => `
  
      .ql-editor {
        min-height: 100px;
      }
  
      .ql-snow .ql-picker {
        color: ${theme.colors.alpha.black[100]};
      }
  
      .ql-snow .ql-stroke {
        stroke: ${theme.colors.alpha.black[100]};
      }
  
      .ql-toolbar.ql-snow {
        border-top-left-radius: ${theme.general.borderRadius};
        border-top-right-radius: ${theme.general.borderRadius};
      }
  
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[30]};
      }
  
      .ql-container.ql-snow {
        border-bottom-left-radius: ${theme.general.borderRadius};
        border-bottom-right-radius: ${theme.general.borderRadius};
      }
  
      &:hover {
        .ql-toolbar.ql-snow,
        .ql-container.ql-snow {
          border-color: ${theme.colors.alpha.black[50]};
        }
      }
  `
);
export const Input = styled('input')({
  display: 'none'
});

export const initialFileObject = {
  label: '',
  url: '',
  contentType: ''
};
const getName = (title) => {
  let inputName = title.toLowerCase().split(' ').join('');
  return inputName;
};

export const UploadFileHorizontal = ({
  title,
  handleChange,
  setIndex = {},
  indexId = -1,
  name,
  nameNonTitle = '',
  handleDelete,
  isMultipleRequired = true,
  accept = 'image/jpeg, image/png',
  setLoading = {}
}) => {
  let inputName = title.length === 0 ? nameNonTitle : getName(title);
  if (!Array.isArray(name) || (!isMultipleRequired && name[0]?.title === '')) {
    name = [];
  }
  const [isDelete, setDelete] = useState(false);
  const [url, setUrl] = useState('');
  const [index, setIndexState] = useState(0);
  const handleDeleteCompleted = () => {
    setDelete(false);
    if (indexId > -1) {
      handleDelete(url, inputName, indexId);
    } else {
      handleDelete(url, inputName, index);
    }
  };
  const handleClose = () => {
    setDelete(false);
  };
  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };
  const fileDrop = (e) => {
    e.preventDefault();
    handleChange(e);
    if (setIndex instanceof Function) {
      setLoading(true);
    }
  };


  return (
    <>
      {isDelete && (
        <DeleteConfirmation
          openConfirmDelete={isDelete}
          closeConfirmDelete={handleClose}
          handleDeleteCompleted={handleDeleteCompleted}
          selectedId={indexId}
        />
      )}
      <Typography mb={1}> {title}</Typography>
      <Card sx={{ background: '#eeeeee' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row ',
              columnGap: 2,
              alignItems: 'center'
            }}
          >
            {!name?.length > 0 && (
              <BoxUploadWrapper
                id={inputName}
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
                sx={{ my: -2 }}
              >
                <Box
                  id={inputName}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row ',
                    columnGap: 2,
                    alignItems: 'center'
                  }}
                >
                  <Box id={inputName}>
                    <img
                      src="/static/images/logo/projectIcons/upload-file-icon.svg"
                      alt=""
                      style={{ width: 54, height: 54 }}
                      id={inputName}
                    />
                  </Box>
                  <Typography id={inputName}>Drop your files</Typography>
                </Box>
              </BoxUploadWrapper>
            )}

            {!name?.length > 0 && <Typography>or</Typography>}
            {name?.length > 0 && (
              <Box
                sx={{ background: '#f4f4f4', width: 420, height: 100, pt: 0.5 }}
              >
                <Scrollbar>
                  <Box pr={1}>
                    <TableContainer>
                      <Table>
                        <TableBody>
                          {name?.map((item, index) => {
                            let Icons = getIcons(item?.contentType);
                            return (
                              <React.Fragment key={item?.url}>
                                <TableRow
                                  hover
                                  key={item.label}
                                  sx={{
                                    overflow: 'visible',
                                    position: 'relative',
                                    p: 2
                                  }}
                                >
                                  <TableCell sx={{ py: 0, pl: 1 }}>
                                    <Box
                                      width="100%"
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start'
                                      }}
                                    >
                                      {Icons.length > 0 ? (
                                        <img
                                          src={Icons[0]?.iconSrc}
                                          alt=""
                                          style={{ width: 44, height: 44 }}
                                        />
                                      ) : (
                                        <Box sx={{ width: '45px' }}>
                                          <img
                                            src="/static/images/logo/doc-icon.svg"
                                            alt=""
                                            style={{ width: 44, height: 44 }}
                                          />
                                        </Box>
                                      )}
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          overflow: 'hidden',
                                          whiteSpace: 'nowrap',
                                          textOverflow: 'ellipsis',
                                          maxWidth: {
                                            xs: '410px',
                                            md: '200px',
                                            lg: '220px',
                                            xl: '410px'
                                          },
                                          ml: 1
                                        }}
                                      >
                                        {item?.title || item?.label}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ p: 1 }}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center'
                                      }}
                                      onClick={() => {
                                        setDelete(true);
                                        setUrl(item?.url);
                                        setIndexState(index);
                                      }}
                                      id={`delete_of_${inputName}`}
                                    >
                                      <DeleteForeverSharpIcon
                                        fontSize="large"
                                        sx={{
                                          color: '#c0c1c3',
                                          cursor: 'pointer',
                                          '&:hover': { color: '#e1b4b5' }
                                        }}
                                      />
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Scrollbar>
              </Box>
            )}
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <label
                htmlFor={`contained-button-file-${inputName}`}
                id={`upload-button-${inputName}`}
              >
                <Input
                  accept={accept}
                  id={`contained-button-file-${inputName}`}
                  multiple={isMultipleRequired ? 'multiple' : ''}
                  onChange={(e) => {
                    handleChange(e);
                    if (setIndex instanceof Function) {
                      setLoading(true);
                    }
                  }}
                  name={inputName}
                  type="file"
                  disabled={!isMultipleRequired && name.length > 0}
                />
                <Button
                  variant="contained"
                  component="span"
                  startIcon={
                    <img
                      src="/static/images/logo/projectIcons/browse-file-icon.svg"
                      alt=""
                      style={{ width: 27, height: 27 }}
                    />
                  }
                  disabled={!isMultipleRequired && name.length > 0}
                  sx={browseButton}
                  onClick={() => {
                    if (setIndex instanceof Function) {
                      setIndex((prevState) => prevState + 1);
                    }
                  }}
                >
                  Browse file
                </Button>
              </label>
            </Box>
          </Box>


          <Typography variant="subtitle2" sx={{ my: 1, px: 4, fontSize: '11px' }}>
            Files must be image,pdf,doc,ppt,video
          </Typography>
        </Box>
      </Card>
    </>
  );
};
export const UploadFileVertical = ({
  title,
  handleChange,
  setIndex = {},
  name,
  nameNonTitle = '',
  indexId = -1,
  handleDelete,
  isMultipleRequired = true,
  createBroadcast = false,
  setLoading = {},
  // progress
}) => {

  let inputName = title.length === 0 ? nameNonTitle : getName(title);
  if (!Array.isArray(name) || (!isMultipleRequired && name[0]?.title === '')) {
    name = [];
  }
  const [isLoading, setIsLoading] = useState(true);
  const [totalFiles, setTotalFiles] = useState(name?.length);
  const [isDelete, setDelete] = useState(false);
  const [url, setUrl] = useState('');
  const [index, setIndexState] = useState(0);


  const [uploads, setUploads] = useState([]);

  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [open, setOpen] = useState(false); // Set initial state to false
  const theme = useTheme();

  const handleOpen = () => {
    // Add logic to handle opening the modal
    console.log("Opening modal");

    setOpen(true);
  };

  const handlelose = () => {
    // Add logic to handle closing the modal
    console.log("closing modal");

    setOpen(false);
  };



  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);

    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };




  const handleDeleteCompleted = () => {
    setDelete(false);
    if (indexId > -1) {
      handleDelete(url, inputName, indexId);
    } else {
      handleDelete(url, inputName, index);
    }
  };
  const handleClose = () => {
    setDelete(false);
  };


  const handleUpload = (e) => {





    let files = e.target.files || e.dataTransfer.files;
    if (files) {
      if (files[0].type === 'application/pdf') {
        if (files[0].size > 1024 * 1024 * 200) {
          setIsLoading(false);
          return;
        }
      } else if (
        files[0].type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          setIsLoading(false);
          return;
        }
      } else if (files[0].type.startsWith('image/')) {
        if (files[0].size > 1024 * 1024 * 2) {
          setIsLoading(false);
          return;
        }
      } else if (files[0].type === 'application/vnd.ms-powerpoint' ||
        files[0].type === 'application/vnd.ms-powerpoint' ||
        files[0].type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          setIsLoading(false);
          return;
        }
      } else if (
        files[0].type === 'application/msword' ||
        files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          setIsLoading(false);
          return;
        }
      } else if (files[0].type.startsWith('video/')) {
        if (files[0].size > 1024 * 1024 * 200) {
          setIsLoading(false);
          return;
        }
      }
    }


    let noOfFiles = e.target.files?.length;
    setTotalFiles(name?.length + noOfFiles);
    setIsLoading(true);
    if (setIndex instanceof Function) {
      setLoading(true);
    }
    console.log([...files]);
    const tempUploads = [...files].map((file) => ({
      file,
      progress: 0
    }));

    setUploads(tempUploads);
    handleOpen();
    setOpen(true);


  };



  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };

  const fileDrop = (e) => {
    e.preventDefault();
    let files = e.target.files || e.dataTransfer.files;

    if (files) {
      if (files[0].type === 'application/pdf') {
        if (files[0].size > 1024 * 1024 * 200) {
          setIsLoading(false);
          let message = `Document file size should not exceeds 200MB`;
          showNotification(message, notificationType.ERROR);
          return;
        }
      } else if (
        files[0].type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          setIsLoading(false);
          let message = `Document file size should not exceeds 200MB`;
          showNotification(message, notificationType.ERROR);
          return;
        }
      } else if (files[0].type.startsWith('image/')) {
        if (files[0].size > 1024 * 1024 * 2) {
          setIsLoading(false);
          let message = `Image size should not exceeds 2MB`;
          showNotification(message, notificationType.ERROR);
          return;
        }
      } else if (files[0].type === 'application/vnd.ms-powerpoint' ||
        files[0].type === 'application/vnd.ms-powerpoint' ||
        files[0].type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          setIsLoading(false);
          let message = `Document file size should not exceeds 200MB`;
          showNotification(message, notificationType.ERROR);
          return;
        }
      } else if (
        files[0].type === 'application/msword' ||
        files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          setIsLoading(false);
          let message = `Document file size should not exceeds 200MB`;
          showNotification(message, notificationType.ERROR);
          return;
        }
      } else if (files[0].type.startsWith('video/')) {
        if (files[0].size > 1024 * 1024 * 200) {
          setIsLoading(false)
          let message = `Video size should not exceeds 200MB`;
          showNotification(message, notificationType.ERROR);
          return;
        }
      }
    }

    setIsLoading(true);
    if (setIndex instanceof Function) {
      setLoading(true);
    }
    handleChange(e);
    const noOfFiles = e.dataTransfer.files?.length;
    setTotalFiles(name?.length + noOfFiles);
  };

  useEffect(() => {
    console.log('working', name)
    if (name.length === totalFiles) {
      setTotalFiles(name.length);
    }
    if (name.length >= 0) {
      setIsLoading(false);
    }


    // setUploadCompleted(false);
  }, [name]);
  const DeleteIconComponent = ({ url, index }) => {
    return (
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0
        }}
        onClick={() => {
          setDelete(true);
          setUrl(url);
          setIndexState(index);
        }}
        id={`delete_of_${inputName}`}
      >
        <DeleteForeverSharpIcon
          // fontSize='large'
          sx={{
            color: '#f34423',
            cursor: 'pointer',
            '&:hover': { color: '#a82222' },
            fontSize: '31px',
            m: 0.3
          }}
        />
      </Box>
    );
  };



  return (
    <>
      {isDelete && (
        <DeleteConfirmation
          openConfirmDelete={isDelete}
          closeConfirmDelete={handleClose}
          handleDeleteCompleted={handleDeleteCompleted}
          selectedId={indexId}
        />
      )}
      <Typography mb={1}> {title}</Typography>
      {name?.length <= 0 ? (


        <Card sx={{ background: '#eeeeee', height: 365 }}>

          {!isLoading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BoxUploadWrapper
                id={inputName}
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
              >
                <>
                  <Box id={inputName} sx={{ my: 1, mx: 5 }}>
                    <img
                      src="/static/images/logo/projectIcons/upload-file-icon.svg"
                      alt=""
                      style={{ width: 124, height: 124 }}
                      id={inputName}
                    />
                  </Box>
                  <Typography sx={{ mt: 1 }}>Drop your files</Typography>
                </>
              </BoxUploadWrapper>

              <Typography sx={{ my: 1 }}>or</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                id={inputName}
              >
                <label
                  htmlFor={`contained-button-file-${inputName}`}
                  id={`upload-button-${inputName}`}
                >
                  <Input
                    id={`contained-button-file-${inputName}`}
                    multiple={isMultipleRequired ? 'multiple' : ''}
                    disabled={!isMultipleRequired && name.length > 0}
                    onChange={(e) => {
                      const files = e.target.files;
                      const allowedFileTypes = ['application/zip', 'image/svg+xml'];

                      for (let i = 0; i < files.length; i++) {
                        if (allowedFileTypes.includes(files[i].type)) {
                          const errorMessage = 'ZIP and SVG files are not allowed.';
                          setErrorMessage(errorMessage);
                          setOpenNoti(true);
                          // alert('ZIP and SVG files are not allowed.');
                          e.target.value = ''; // Clear the selected files
                          return;
                        }
                      }


                      handleUpload(e);
                      handleChange(e);
                    }}
                    max="10"
                    name={inputName}
                    type="file"
                  />

                  <Button
                    variant="contained"
                    component="span"
                    disabled={!isMultipleRequired && name.length > 0}
                    startIcon={
                      <img
                        src="/static/images/logo/projectIcons/browse-file-icon.svg"
                        alt=""
                        style={{ width: 30, height: 30 }}
                      />
                    }
                    sx={browseButton}
                    onClick={() => {
                      if (setIndex instanceof Function) {
                        setIndex((prevState) => prevState + 1);
                      }
                    }}
                  >
                    Browse file
                  </Button>
                </label>
              </Box>

              {createBroadcast ? (
                <Typography
                  variant="subtitle2"
                  sx={{ my: 1, px: 4, fontSize: '11px' }}
                >
                  Files must be image,pdf,doc,ppt,video
                </Typography>
              ) : (
                <Typography
                  variant="subtitle2"
                  sx={{ my: 1, px: 4, fontSize: '11px' }}
                >
                  Files must be image,pdf,doc,ppt,video
                </Typography>
              )}
              {/* </Box> */}
            </Box>
          ) : (



            <div>
              {uploads &&
                uploads.map((upload, index) => (
                  <div key={index} style={{ marginTop: '20px' }}>
                    <ProgressBar

                      progress={upload.progress}
                      filename={upload.file.name}
                      contentType={upload.file.type}
                      fileSize={upload.file.size}
                    />
                  </div>
                ))}
            </div>


          )}
        </Card>
      ) : !createBroadcast ? (
        <Card sx={{ background: '#eeeeee', height: 365 }}>
          {/* {!isLoading ? ( */}
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'rows',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.8,
                pt: 1.8,
                pb: 1,
                background: '#eeeeee'
              }}
            >
              {createBroadcast ? (
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: '11px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: { xs: '210px', md: '200px', xl: '250px' },
                    mr: 2
                  }}
                >
                  Files must be image,pdf,doc,ppt,video.Video must not exceed
                  more than 25 MB
                </Typography>
              ) : (
                <Typography
                  variant="subtitle2"
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: '180px',
                    mr: 2
                  }}
                >
                  Files must be image,pdf,doc,ppt,video ( Should not exceed
                  more than 1MB)
                </Typography>
              )}
              <label
                htmlFor={`contained-button-file-${inputName}`}
                id={`upload-button-${inputName}`}
              >

                <Input
                  id={`contained-button-file-${inputName}`}
                  multiple={isMultipleRequired ? 'multiple' : ''}
                  disabled={!isMultipleRequired && name.length > 0}
                  onChange={(e) => {
                    const files = e.target.files;
                    const allowedFileTypes = ['application/zip', 'image/svg+xml'];

                    for (let i = 0; i < files.length; i++) {
                      if (allowedFileTypes.includes(files[i].type)) {
                        const errorMessage = 'ZIP and SVG files are not allowed.';
                        setErrorMessage(errorMessage);
                        setOpenNoti(true);
                        e.target.value = ''; // Clear the selected files
                        return;
                      }
                    }

                    handleUpload(e);
                    handleChange(e);
                    console.log('valueeeeeeeeeeee66666eeeeeeeeeeeeeeeeeeeeeeeeeeee', e.target)
                  }}
                  max="10"
                  name={inputName}
                  type="file"
                />


                <Button
                  variant="contained"
                  component="span"
                  disabled={!isMultipleRequired && name.length > 0}
                  startIcon={
                    <img
                      src="/static/images/logo/projectIcons/browse-file-icon.svg"
                      alt=""
                      style={{ width: 30, height: 30 }}
                    />
                  }
                  sx={browseButton}
                  onClick={() => {
                    if (setIndex instanceof Function) {
                      setIndex((prevState) => prevState + 1);
                    }
                  }}
                >
                  Browse file
                </Button>
              </label>
            </Box>
            <Box
              sx={{
                background: '#f4f4f4',
                width: '100%',
                height: 355,
                pt: 0.5
              }}
            >
              <Scrollbar>
                <Box pr={1}>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        {name?.map((item, index) => {
                          let isDisplay =
                            !createBroadcast ||
                            (fileType.indexOf(item?.contentType) === -1 &&
                              videoType.indexOf(item?.contentType) === -1 &&
                              item?.label !== '');
                          let Icons = getIcons(item?.contentType);
                          return (
                            <React.Fragment key={item?.url}>
                              {isDisplay && (
                                <TableRow
                                  hover
                                  key={item.label}
                                  sx={{
                                    overflow: 'visible',
                                    position: 'relative',
                                    p: 2
                                  }}
                                >
                                  <TableCell sx={{ py: 0, pl: 1 }}>
                                    <Box
                                      width="100%"
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start'
                                      }}
                                    >
                                      {Icons.length > 0 ? (
                                        <img
                                          src={Icons[0]?.iconSrc}
                                          alt=""
                                          style={{ width: 44, height: 44 }}
                                        />
                                      ) : (
                                        <Box sx={{ width: '45px' }}>
                                          <img
                                            src="/static/images/logo/doc-icon.svg"
                                            alt=""
                                            style={{ width: 44, height: 44 }}
                                          />
                                        </Box>
                                      )}
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          overflow: 'hidden',
                                          whiteSpace: 'nowrap',
                                          textOverflow: 'ellipsis',
                                          maxWidth: {
                                            xs: '410px',
                                            md: '200px',
                                            lg: '220px',
                                            xl: '410px'
                                          },
                                          ml: 1
                                        }}
                                      >
                                        {item?.title || item?.label}
                                      </Typography>

                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ p: 1 }}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center'
                                      }}
                                      onClick={() => {
                                        setDelete(true);
                                        setUrl(item?.url);
                                        setIndexState(index);
                                      }}
                                      id={`delete_of_${inputName}`}
                                    >
                                      <DeleteForeverSharpIcon
                                        fontSize="large"
                                        sx={{
                                          color: '#c0c1c3',
                                          cursor: 'pointer',
                                          '&:hover': { color: '#e1b4b5' }
                                        }}
                                      />
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              )}

                            </React.Fragment>
                          );
                        })}



                        {isLoading &&
                          uploads && uploads.map((upload, index) => (
                            <div
                              key={index}
                              style={{ marginTop: "20px" }}
                            >
                              <ProgressBar
                                progress={upload.progress}
                                filename={upload.file.name}
                                contentType={upload.file.type}
                                fileSize={upload.file.size}
                              />
                            </div>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Scrollbar>
            </Box>{' '}
          </>

        </Card>
      ) : (
        <>
          <Card sx={{ background: '#eeeeee', borderRadius: '5px' }}>
            {!isLoading && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'rows',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.8,
                    pt: 1,
                    pb: 1,
                    background: '#eeeeee'
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: '11px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      maxWidth: { xs: '70%', md: '60%', lg: '60%', xl: '80%' },
                      mr: 2
                    }}
                  >
                    Files must be image,pdf,doc,ppt,video.Video must not exceed
                    more than 25 MB
                  </Typography>

                  <label
                    htmlFor={`contained-button-file-${inputName}`}
                    id={`upload-button-${inputName}`}
                  >

                    <Input
                      id={`contained-button-file-${inputName}`}
                      multiple={isMultipleRequired ? 'multiple' : ''}
                      disabled={!isMultipleRequired && name.length > 0}
                      onChange={(e) => {
                        const files = e.target.files;
                        const allowedFileTypes = ['application/zip', 'image/svg+xml'];

                        for (let i = 0; i < files.length; i++) {
                          if (allowedFileTypes.includes(files[i].type)) {
                            const errorMessage = 'ZIP and SVG files are not allowed.';
                            setErrorMessage(errorMessage);
                            setOpenNoti(true);
                            e.target.value = ''; // Clear the selected files
                            return;
                          }
                        }

                        handleUpload(e);
                        handleChange(e);
                        console.log('valueeeeeeeeeeee66666eeeeeeeeeeeeeeeeeeeeeeeeeeee', e.target)
                      }}
                      max="10"
                      name={inputName}
                      type="file"
                    />

                    <Button
                      variant="contained"
                      component="span"
                      disabled={!isMultipleRequired && name.length > 0}
                      startIcon={
                        <img
                          src="/static/images/logo/projectIcons/browse-file-icon.svg"
                          alt=""
                          style={{ width: 30, height: 30 }}
                        />
                      }
                      sx={browseButton}
                      onClick={() => {
                        if (setIndex instanceof Function) {
                          setIndex((prevState) => prevState + 1);
                        }
                      }}
                    >
                      Browse file
                    </Button>
                  </label>
                </Box>
              </>
            )}
          </Card>
          {!isLoading ? (
            <>
              {name.length > 0 && (
                <Card sx={{ borderRadius: '0px', mt: 1 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 410
                    }}
                  >
                    <Scrollbar sx={{ overflow: 'hidden' }}>
                      <Box pr={0.5}>
                        <Grid container columnSpacing={1} rowSpacing={1}>
                          {name.map((item, index) => {
                            let Icons = getIcons(item?.contentType);
                            return (
                              <React.Fragment key={index}>
                                <Grid item xs={6} xl={4}>
                                  <Box
                                    sx={{
                                      height: '180px',
                                      width: '100%',
                                      position: 'relative',
                                      background: '#eeeeee'
                                    }}
                                  >
                                    {fileType.indexOf(item?.contentType) >=
                                      0 && (
                                        <>
                                          <img
                                            src={item?.url}
                                            alt=""
                                            style={{
                                              width: 'inherit',
                                              height: 'inherit'
                                            }}
                                          />
                                          <DeleteIconComponent
                                            url={item?.url}
                                            index={index}
                                          />
                                        </>
                                      )}
                                    {videoType.indexOf(item?.contentType) >=
                                      0 && (
                                        <>
                                          <Box key={index}>
                                            <iframe
                                              width="100%"
                                              height="180px"
                                              src={item?.url}
                                              title={item?.title}
                                              frameBorder="0"
                                              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                              allowFullScreen
                                            />
                                          </Box>
                                          <DeleteIconComponent
                                            url={item?.url}
                                            index={index}
                                          />
                                        </>
                                      )}
                                    {fileType.indexOf(item?.contentType) ===
                                      -1 &&
                                      videoType.indexOf(item?.contentType) ===
                                      -1 && (
                                        <>
                                          <Box
                                            sx={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              pt: 3
                                            }}
                                          >
                                            {Icons.length > 0 ? (
                                              <img
                                                src={Icons[0]?.iconSrc}
                                                alt=""
                                                style={{
                                                  width: 84,
                                                  height: 84
                                                }}
                                              />
                                            ) : (
                                              <Box>
                                                <img
                                                  src="/static/images/logo/doc-icon.svg"
                                                  alt=""
                                                  style={{
                                                    width: 84,
                                                    height: 84
                                                  }}
                                                />
                                              </Box>
                                            )}
                                            <Typography
                                              variant="body2"
                                              sx={{
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                maxWidth: {
                                                  xs: '410px',
                                                  md: '200px',
                                                  lg: '220px',
                                                  xl: '410px'
                                                },
                                                ml: 1
                                              }}
                                            >
                                              {item?.title || item?.label}.
                                              {item?.contentType}
                                            </Typography>
                                          </Box>
                                          <DeleteIconComponent
                                            url={item?.url}
                                            index={index}
                                          />
                                        </>
                                      )}
                                  </Box>
                                </Grid>
                              </React.Fragment>
                            );
                          })}
                        </Grid>
                      </Box>
                    </Scrollbar>
                  </Box>
                </Card>
              )}{' '}
            </>
          ) : (
            // <Box sx={{ pt: 5, width: "95%", mx: "auto", textAlign: "center" }}>
            //   <LinearProgress variant="determinate" value={progress} valueBuffer={progress} />
            //   <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>{progress}%</Typography>
            // </Box>
            // <Box>
            //   <Loader />
            // </Box>
            uploads && uploads.map((upload, index) => (
              <div
                key={index}
                style={{ marginTop: "20px" }}
              >
                <ProgressBar
                  progress={upload.progress}
                  filename={upload.file.name}
                  contentType={upload.file.type}
                  fileSize={upload.file.size}
                />
              </div>
            ))
          )}
        </>
      )
      }
      {isLoading === true &&
        (
          <Modal open={open} onClose={handlelose} >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                border: "1px solid #000",
                outline: "none",
                padding: "40px",
                borderRadius: "8px", // Adjust the border radius as needed
              }}
            >
              <div>
                <div style={{ display: "flex", flexDirection: "column-reverse", justifyContent: 'center', alignItems: "center" }}>
                  <Typography sx={{
                    pt: 2,
                    pb: 2,
                    fontWeight: 550,
                    font: 'Helvetica Neue Medium',
                    color: theme.palette.grey[600]
                  }} variant='h3'>File Uploading </Typography>

                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="blue" className="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                  </svg>                </div>

                <Typography sx={{
                  font: 'Helvetica Neue Medium',
                  fontWeight: "Normal",
                  color: theme.palette.grey[600]

                }} variant='h4'>File Upload in progress, please wait for the pop-up to be closed</Typography>
              </div>
              <div>
                {uploads &&
                  uploads.map((upload, index) => (
                    <div key={index} style={{ marginTop: '20px', marginBottom: "20px" }}>
                      {/* {console.log('progress', upload.progress)} */}
                      <ProgressBar
                        // handlelose={handlelose}
                        progress={upload.progress}
                        filename={upload.file.name}
                        contentType={upload.file.type}
                        fileSize={upload.file.size}
                      />
                    </div>

                  ))
                  // {index === uploads.length - 1 && handlelose()}

                }

              </div>
            </div>
          </Modal>
        )
      }


      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />

    </>
  );
};

export const UploadProfileImage = ({
  title,
  handleChange,
  name,
  nameNonTitle = '',
  style
}) => {
  let inputName = title.length === 0 ? nameNonTitle : getName(title);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(false);
  }, [name]);

  const loaderImg = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (files[0]?.type.startsWith('image/')) {
      if (files[0].size > 1024 * 1024 * 2) {
        // fileBoolean = false;
        setIsLoading(false)
      } else {
        setIsLoading(true)
      }
    }
  }

  return (
    <>
      <Typography mb={1} mr={2}>
        {' '}
        {style?.paddingTop ? '' : title}
      </Typography>
      {!isLoading ? (
        <Card>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <label
              htmlFor={`contained-button-file-${inputName}`}
              id={`upload-button-${inputName}`}
            >
              <Input
                accept="image/*"
                id={`contained-button-file-${inputName}`}
                onChange={(e) => {
                  handleChange(e);
                  loaderImg(e);
                }}
                name={inputName}
                type="file"
              />
              <Button
                variant="contained"
                component="span"
                startIcon={
                  <img
                    src="/static/images/logo/projectIcons/browse-file-icon.svg"
                    alt=""
                    style={{ width: 30, height: 30 }}
                  />
                }
                sx={browseButton}
              >
                Browse file
              </Button>
              <Typography mt={2}> {style?.paddingTop ? title : ''}</Typography>
            </label>
          </Box>
        </Card>
      ) : (
        <Loader />
      )}
    </>
  );
};
export const UploadVideo = ({ title, handleChange, videos }) => {
  const [videosArray, setVideosArray] = useState(videos);
  let inputName = getName(title);
  const theme = useTheme();

  const AddVideo = () => {
    let arr = [...videosArray];
    arr.push('');
    setVideosArray(arr);
    handleChange(inputName, arr);
  };
  const handleVideoLink = (e, index) => {
    let arr = [...videosArray];
    arr[index] = e.target.value;
    setVideosArray([...arr]);
    handleChange(inputName, arr);
  };
  const handleDelete = (index) => {
    let arr = [...videosArray];
    arr.splice(index, 1);
    setVideosArray([...arr]);
    handleChange(inputName, arr);
  };
  useEffect(() => {
    if (videos && videos.length) {
      setVideosArray(videos);
    }
  }, [videos]);
  return (
    <Box my={2}>
      <Typography my={2}> {title}</Typography>
      <Card sx={{ background: '#eeeeee' }}>
        {videosArray.length &&
          videosArray.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: { xs: 2, md: 3 }
                }}
              >
                <Box
                  width="75%"
                  display="flex"
                  alignItems="center"
                  columnGap={2}
                >
                  <Box width="90%">
                    <TextField
                      id={inputName}
                      name={inputName}
                      placeholder="Paste Youtube video link"
                      variant="outlined"
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
                      onChange={(e) => {
                        handleVideoLink(e, index);
                      }}
                      value={videos[index]}
                    />
                  </Box>

                  {index !== 0 && (
                    <Avatar
                      sx={{
                        background: theme.palette.common.white,
                        color: theme.palette.error.dark,
                        cursor: 'pointer',
                        width: theme.spacing(2.5),
                        height: theme.spacing(2.5),
                        mr: { xs: 1, md: 0 }
                      }}
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      <ClearIcon fontSize="15px" />
                    </Avatar>
                  )}
                </Box>
                {videos.length === index + 1 && (
                  <Typography
                    mt={2}
                    onClick={AddVideo}
                    color={theme.palette.primary.main}
                    variant="h5"
                    cursor="pointer"
                    sx={{ mr: { xs: 2, md: 0 } }}
                  >
                    Add more video
                  </Typography>
                )}
              </Box>
            );
          })}
      </Card>
    </Box>
  );
};
export const getBase64 = (file, name, groupId) => {
  return new Promise((resolve) => {
    let baseURL = '';
    // Make new FileReader
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      baseURL = reader.result;
      let payload = {
        base64Text: baseURL,
        fileName: file?.name, // filename from e.target.
        type: name,
        groupId
      };
      resolve(payload);
    };
  });
};
const getMultipleBase64 = (files, name, groupId) => {
  return Promise.all([...files].map((file) => getBase64(file, name, groupId)));
};
export const handleRemoveFromS3 = async (url) => {
  let isUrlRemoved;
  if (url === '' || url === undefined || url === null) {
    isUrlRemoved = true;
    return isUrlRemoved;
  }
  let removePath = url.split('builder-broadcast-media/').pop();
  await deleteFromS3(removePath).then((message) => {
    isUrlRemoved = message?.success;
    if (isUrlRemoved) {
      // let sucessMessage = `Sucessfully Deleted`;
      // showNotification(sucessMessage, notificationType.SUCCESS);
    } else {
      // let errorMessage = 'Something went wrong';
      // showNotification(errorMessage, notificationType.ERROR);
    }
  });

  return isUrlRemoved;
};
export const getGroupId = (userData) => {
  return userData.roleName === 'SUPER_ADMIN'
    ? 'SUPER_ADMIN'
    : userData.roleName === 'ASSOCIATE_ADMIN'
      ? 'ASSOCIATE_ADMIN'
      : userData.builderCompany[0];
};
export const GetResultFileArray = (arrayResult) => {
  let files = arrayResult.map((result) => ({
    title: result?.originalFileName || '',
    url: result?.url || '',
    contentType: result?.contentType || '',
    formType: result?.type || ''
  }));
  return files;
};
export const GetURLForUpload = async (e, updateUrl, index = -1) => {
  const { name, id } = e.target;
  let files = e.target.files || e.dataTransfer.files;
  let nameType = name || id;
  const userData = JSON.parse(window.localStorage.getItem('user'));
  let fileBoolean = true;

  if (files) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'application/pdf') {
        if (files[i].size > 1024 * 1024 * 200) {
          fileBoolean = false;
        }
      } else if (
        files[i].type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        if (files[i].size > 1024 * 1024 * 200) {
          fileBoolean = false;
        }
      } else if (files[i].type.startsWith('image/')) {
        if (files[i].size > 1024 * 1024 * 2) {
          fileBoolean = false;
        }
      } else if (files[i].type === 'application/vnd.ms-powerpoint' ||
        files[i].type === 'application/vnd.ms-powerpoint' ||
        files[i].type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ) {
        if (files[i].size > 1024 * 1024 * 200) {
          fileBoolean = false;
        }
      } else if (
        files[i].type === 'application/msword' ||
        files[i].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        if (files[i].size > 1024 * 1024 * 200) {
          fileBoolean = false;
        }
      } else if (files[i].type.startsWith('video/')) {
        if (files[i].size > 1024 * 1024 * 200) {
          fileBoolean = false;
        }
      }
    }
  }
  if (files.length > 0 && fileBoolean) {
    getMultipleBase64(files, nameType, getGroupId(userData)).then((result) => {
      // let config;
      // if(updateProgress){
      //   config = {
      //     onUploadProgress: (progressEvent) => {
      //       const progress = Math.round((progressEvent?.loaded / progressEvent?.total) * 100);
      //       updateProgress(progress)
      //     },
      //   };
      // }
      // GetUploadFileUrl(result, config).then((result) => {
      GetUploadFileUrl(result).then((result) => {
        if (result?.message === 'uploadedSuccessfully') {
          if (index !== -1) {
            updateUrl(result?.data, index);
          } else {
            updateUrl(result?.data);
          }
          // let sucessMessage = `Sucessfully Uploaded`;
          // showNotification(sucessMessage, notificationType.SUCCESS);
        } else {
          // let errorMessage = 'Something went wrong';
          // showNotification(errorMessage, notificationType.ERROR);
        }
      });
    });
  }

};

export const UploadFileInput = ({ inputName, updateUrl, fileName }) => {
  return (
    <>
      <label
        htmlFor={`contained-button-file-${inputName}`}
        id={`upload-button-${inputName}`}
      >
        <Input
          accept="image/*"
          id={`contained-button-file-${inputName}`}
          // multiple
          onChange={(e) => {
            GetURLForUpload(e, updateUrl);
          }}
          name={inputName}
          disabled={fileName !== ''}
          type="file"
        />
        <Button
          variant="contained"
          id={`contained-button-file-${inputName}`}
          component="span"
          disabled={fileName !== ''}
          startIcon={
            <img
              src="/static/images/logo/projectIcons/browse-file-icon.svg"
              alt=""
              style={{ width: 27, height: 27 }}
            />
          }
          sx={browseButton}
        >
          Browse file
        </Button>
      </label>
    </>
  );
};
export const getStatus = (formId, projectStatus = '') => {
  if (projectStatus === 'upcomingLaunch') {
    return 'PRELAUNCH';
  }
  if (formId === 8) {
    return 'PUBLISHED';
  }
  return 'DRAFT';
};
export const getDocValue = (fileName, docList) => {
  let docFile = docList.filter((item) => item.formType === fileName);
  return docFile.length !== 0 ? docFile : [];

};
export const getAllDocList = (docNameList, formObject) => {
  let docArray = [];
  docNameList
    .filter(
      (item) =>
        typeof formObject[`${item}`] !== 'string' &&
        formObject[`${item}`]?.length > 0
    )
    .map((item) => {
      let docList = [...formObject[`${item}`]];
      Array.prototype.push.apply(docArray, docList);
      return '';
    });
  return docArray;
};

const AddProject = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { action, formName } = useParams();
  const { data, projectId } = useSelector((state) => state.project);
  const [currentStep, setCurrentStep] = useState();
  const [currentTab, setCurrentTab] = useState(ADD_PROJECT_STEP[currentStep]);
  const [isEditing, setIsEditing] = useState(false);
  const [projectType, setProjectType] = useState("");
  const projectTypeR = useSelector((state) => state.projectList.projectType);

  useEffect(() => {
    if (projectTypeR) {
      setProjectType(projectTypeR);
    } else {
      setProjectType(data?.projectType);
    }
  }, [projectTypeR, data])

  const navigate = useNavigate();

  const NextTab = () => {
    if (currentStep >= 8) {
      navigate('/projects');
    } else if (projectType === 'pvtbuilder' && [2, 6].includes(currentStep)) {
      setCurrentStep((a) => a + 2);
      setCurrentTab(ADD_PROJECT_STEP[currentStep + 2]);
    } else if (projectType === 'pvtbuilder' && [5].includes(currentStep)) {
      setCurrentStep((a) => a + 3);
      setCurrentTab(ADD_PROJECT_STEP[currentStep + 3]);
    } else {
      setCurrentStep((a) => a + 1);
      setCurrentTab(ADD_PROJECT_STEP[currentStep + 1]);
    }
  };
  const PrevTab = () => {
    if (projectType === 'pvtbuilder' && [4, 7].includes(currentStep)) {
      setCurrentStep((a) => a - 2);
      setCurrentTab(ADD_PROJECT_STEP[currentStep - 2]);
    } else if (projectType === 'pvtbuilder' && [8].includes(currentStep)) {
      setCurrentStep((a) => a - 3);
      setCurrentTab(ADD_PROJECT_STEP[currentStep - 3]);
    } else {
      setCurrentStep((a) => a - 1);
      setCurrentTab(ADD_PROJECT_STEP[currentStep - 1]);
    }
    // setCurrentStep((a) => a - 1);
    // setCurrentTab(ADD_PROJECT_STEP[currentStep - 1]);
  };
  const handleSaveandExit = async () => {
    navigate('/projects');
    await dispatch(deleteSliceData());
  };
  const getEditForm = (name) => {
    let step = ADD_PROJECT_STEP.filter((item) => item?.value === name);
    return step[0];
  };
  const handleEditSave = async (projectId) => {
    await dispatch(getProjectById(projectId));
    navigate(`/projects/project_broadcasts/${projectId}`);
  };
  const handleCancel = async (projectId) => {
    await dispatch(getProjectById(projectId));
    navigate(`/projects/project_broadcasts/${projectId}`);
  };
  useEffect(() => {
    if (projectId !== '' && data?.status === 'DRAFT') {
      // Land on same form as left
      if (data.projectType === 'pvtbuilder' && ["2", "6"].includes(data.step)) {
        setCurrentStep(2 + Number(data.step));
        setCurrentTab(ADD_PROJECT_STEP[Number(data.step) + 2]);
      } else if (data.projectType === 'pvtbuilder' && ["5"].includes(data.step)) {
        setCurrentStep(3 + Number(data.step));
        setCurrentTab(ADD_PROJECT_STEP[Number(data.step) + 3]);
      } else {
        setCurrentStep(1 + Number(data.step));
        setCurrentTab(ADD_PROJECT_STEP[Number(data.step) + 1]);
      }
      return;
    }
    if (action === 'Edit' && formName !== '' && projectId !== '') {
      let fromStep = getEditForm(formName);
      setCurrentStep(fromStep?.formId);
      setCurrentTab(fromStep);
      setIsEditing(true);
      return;
    }

    if (projectId === '') {
      setCurrentStep(0);
      setCurrentTab(ADD_PROJECT_STEP[0]);
    }
  }, []);
  useEffect(() => { }, [data]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab?.value]);

  const itemsToRender = ADD_PROJECT_STEP.filter(
    (item) => !(projectType === 'pvtbuilder' && [3, 6, 7].includes(item.formId))
  );

  return (
    <>
      <Box sx={{ py: 4, pl: { xs: 5, lg: 6 }, pr: { xs: 5, md: 6 } }} id="project-Form">
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
          <Typography sx={{ fontsize: "20px", fontWeight: "bold" }} gutterBottom>
            ADD PROJECT
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Box
            item
            component={Grid}
            display={{ xs: 'none', md: 'block' }}
            md={2}
          >
            <Box>
              {itemsToRender.map((item) => {
                let isFormCompleted = item.formId <= data?.step;
                return (
                  <Card
                    key={item.value}
                    sx={{
                      border: 1,
                      borderRadius: '3px',
                      p: 1,
                      my: 1,
                      cursor: 'pointer',
                      background: theme.palette.common.white,
                      borderColor:
                        currentTab?.value === item.value
                          ? '#0078e9'
                          : 'grey.500',
                      boxShadow: currentTab?.value === item.value ? "2px 2px 2px 2px #98d2e3" : ""

                    }}
                    onClick={() => {
                      if (isFormCompleted) {
                        setCurrentTab(item);
                        setCurrentStep(item?.formId);
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'baseline'
                      }}
                    >
                      <Box sx={{ mr: 1 }}>
                        {isFormCompleted ||
                          item.formId === currentStep ||
                          currentTab?.value === item.value ? (
                          <img src={item?.selectedIcon} alt="" />
                        ) : (
                          <img src={item?.icon} alt="" />
                        )}
                      </Box>

                      <Typography
                        variant="subtitile2"
                        fontWeight={
                          isFormCompleted || item.formId === currentStep
                            ? 600
                            : 'normal'
                        }
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          </Box>
          <Grid item xs={12} md={10}>
            <Card>
              <Box
                py={3}
                px={4}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    cursor: 'pointer'
                  }}
                >
                  <Box
                    display={currentStep === 0 ? 'none' : 'inline'}
                    cursor="pointer"
                    onClick={PrevTab}
                    mr={1}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </Box>

                  <Typography variant="h3"> {currentTab?.label}</Typography>
                </Box>
                <IconButton
                  onClick={() => {
                    navigate('/projects');
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {currentTab?.value === 'basic_info' && (
                <>
                  <BasicInfoForm
                    handleNext={NextTab}
                    handleExist={handleSaveandExit}
                    FormId={currentTab.formId}
                    prevData={data}
                    projectId={projectId}
                    isEditing={isEditing}
                    handleCancel={handleCancel}
                    handleEditSave={handleEditSave}
                  />
                </>
              )}
              {currentTab?.value === 'about_project' && (
                <>
                  <AbouProjectForm
                    handleNext={NextTab}
                    handleExist={handleSaveandExit}
                    FormId={currentTab.formId}
                    prevData={data}
                    projectId={projectId}
                    isEditing={isEditing}
                    handleCancel={handleCancel}
                    handleEditSave={handleEditSave}
                  />
                </>
              )}
              {currentTab?.value === 'project_media' && (
                <>
                  <ProjectMediaForm
                    handleNext={NextTab}
                    handleExist={handleSaveandExit}
                    FormId={currentTab.formId}
                    prevData={data}
                    projectId={projectId}
                    isEditing={isEditing}
                    handleCancel={handleCancel}
                    handleEditSave={handleEditSave}
                  />
                </>
              )}
              {currentTab?.value === 'booking_info' && (
                <>
                  <BookingInfoForm
                    handleNext={NextTab}
                    handleExist={handleSaveandExit}
                    FormId={currentTab.formId}
                    prevData={data}
                    projectId={projectId}
                    isEditing={isEditing}
                    handleCancel={handleCancel}
                    handleEditSave={handleEditSave}
                  />
                </>
              )}
              {currentTab?.value === 'plan_layout' && (
                <>
                  <PlanLayoutForm
                    handleNext={NextTab}
                    handleExist={handleSaveandExit}
                    FormId={currentTab.formId}
                    prevData={data}
                    projectId={projectId}
                    isEditing={isEditing}
                    handleCancel={handleCancel}
                    handleEditSave={handleEditSave}
                  />
                </>
              )}
              {currentTab?.value === 'pricing' && (
                <>
                  <PricingForm
                    handleNext={NextTab}
                    handleExist={handleSaveandExit}
                    FormId={currentTab.formId}
                    prevData={data}
                    projectId={projectId}
                    isEditing={isEditing}
                    handleCancel={handleCancel}
                    handleEditSave={handleEditSave}
                  />
                </>
              )}
              {currentTab?.value === 'payment_plans' && (
                <>
                  <PaymentPlansForm
                    handleNext={NextTab}
                    handleExist={handleSaveandExit}
                    FormId={currentTab.formId}
                    prevData={data}
                    projectId={projectId}
                    isEditing={isEditing}
                    handleCancel={handleCancel}
                    handleEditSave={handleEditSave}
                  />
                </>
              )}
              {currentTab?.value === 'approved_banks' && (
                <>
                  <ApprovedBanksForm
                    handleNext={NextTab}
                    handleExist={handleSaveandExit}
                    FormId={currentTab.formId}
                    prevData={data}
                    projectId={projectId}
                    isEditing={isEditing}
                    handleCancel={handleCancel}
                    handleEditSave={handleEditSave}
                  />
                </>
              )}
              {currentTab?.value === 'architect_&_consultants' && (
                <>
                  <ArchitectConsultantsForm
                    handleNext={NextTab}
                    handleExist={handleSaveandExit}
                    FormId={currentTab.formId}
                    prevData={data}
                    projectId={projectId}
                    isEditing={isEditing}
                    handleCancel={handleCancel}
                    handleEditSave={handleEditSave}
                  />
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default AddProject;
