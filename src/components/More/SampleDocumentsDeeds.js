import React, { useEffect, useState } from 'react'
import {
  Box, useTheme, Grid, Button, Modal, CircularProgress, TextField,
  styled,
  alpha,
  Card,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import Typography from "@mui/material/Typography";
import AddCircleIcon from '@mui/icons-material/AddCircle';
// import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { isAssociateAdmin, isSuperAdmin } from 'src/helpers/userHelpers';
import { useDispatch, useSelector } from 'react-redux';
import OpenNotification from 'src/content/ShowNotification';

// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import { createSampleDocs } from 'src/axiosInstances/Api';
import { deleteSampleDocs, getSampleDocs } from 'src/slices/center';
import { handleDownload } from 'src/utils/utilits';
import DeleteConfirmation from 'src/content/delete-alert/DeleteAlert';
import { GetResultFileArray, GetURLForUpload, UploadFileVertical, handleRemoveFromS3 } from '../Projects/AddProject/Index';
import { DropDownFilter } from '../../content/channel-partners/DropDownFilter';
import { getIcons } from '../Projects/ViewProjectDetails/ProjectDetailScreens';
// import { CardWrapper } from './DeedDocumentWriters';


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

const SearchInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(15)};
    max-width:'80px'
    // width: 100%;
`);
// const CardWrapper = styled(Card)(
//   ({ theme }) => `
//       transition: ${theme.transitions.create(['box-shadow'])};
//       position: relative;
//       box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
//       z-index: 5;
//       &:hover {
//         z-index: 6;
//         box-shadow: 
//         0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
//         0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
//         0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
//         0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
//         cursor:pointer;
//     }

//       `
// );

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 1,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2
};

const DocumentCard = ({ item }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isDelete, setDelete] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
      // if (!errorMessage) {
      //   // navigate(`/team/${selectedTab}`);
      // dispatch(getSampleDocs());

      // }
    }
  };
  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const { documents } = item;
  let Icons = getIcons(documents?.[0]?.contentType);
  // console.log(Icons[0],"Icons[0]",documents);
  const handleDelete = async (id) => {
    try {
      const response = await deleteSampleDocs(id);
      let sucessMessage = response.data.message;
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
      setDelete(false);
      dispatch(getSampleDocs());
      // showNotification(sucessMessage, notificationType.SUCCESS);
    } catch (error) {
      // showNotification(error.message, notificationType.ERROR);
      setErrorMessage(error.message);
      setOpenNoti(true);
    }
  }

  const handleDeleteClose = () => {
    setDelete(false);
  };

  const textToShow = `${documents[0]?.title}.${documents[0]?.contentType}`;
  const trimmedText = textToShow.slice(0, 25) + (textToShow.length > 25 ? '...' : '');

  return (
    <React.Fragment>
      <Box
        sx={{
          background: 'white',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,

        }}
        width='100%'
      // onClick={() => openFileInChrome(documents)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', columnGap: 3 }}>
          {Icons.length > 0 ? (
            <Box sx={{ width: '25px' }}>
              <img
                src={Icons[0]?.iconSrc}
                alt=""
                style={{ width: 40, height: 40 }}
              />
            </Box>
          ) : (
            <Box sx={{ width: '25px' }}>
              <img
                src="/static/images/logo/doc-icon.svg"
                alt=""
                style={{ width: 40, height: 40 }}
              />
            </Box>
          )}
          <Typography
            variant="subtitle2"
            sx={{ fontSize: `${theme.typography.pxToRem(15)}`, }}
            color="primary"
          >{trimmedText}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            p={2}
            sx={{
              display: 'flex',
              alignitems: 'center',
              justifyContent: 'flex-start'
            }}
            onClick={() => { handleDownload(documents) }}
          >
            <DownloadIcon sx={{
              width: " 1.1em",
              height: "1.1em",
              '&:hover': {
                color: '#1684EB'
              }
            }} />
            <Typography color="primary" ml={1}>Download</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignitems: 'center',
            }}
          >
            {
              (isAssociateAdmin() || isSuperAdmin()) &&
              <Button
                variant="contained"
                size="small"
                sx={{
                  height: 26,
                  width: 64,
                  borderRadius: 0.5,
                  marginRight: 1,
                  backgroundColor: '#f34423',
                  '&:hover': { background: '#f34423' }
                }}
                onClick={() => setDelete(true)}
              >
                <Typography variant="body2"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  Delete
                </Typography>
              </Button>
            }
          </Box>
        </Box>
        {isDelete && (
          <DeleteConfirmation
            openConfirmDelete={isDelete}
            closeConfirmDelete={handleDeleteClose}
            handleDeleteCompleted={() => handleDelete(item._id)}
            selectedId={item._id}
            title="builder"
          />
        )}
      </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </React.Fragment>
  );
};
const SampleDocumentsDeeds = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterDocs, setFilterDocs] = useState([]);
  const [category, setCategory] = useState('');

  const handleOpen = () => {
    setFile([]);
    setOpen(true)
  };
  const handleClose = () => {
    setOpen(false);
  };

  const updateUrl = (result) => {
    let files = GetResultFileArray(result);
    setFile(files);
  };

  const handleDelete = (url, name, index = 0) => {
    handleRemoveFromS3(url).then((response) => {
      if (response) {
        let arr = [...file];
        arr.splice(index, 1);
        setFile({ ...file });
      }
    });
  };

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

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const uploadOnSubmit = async () => {
    setLoading(true)
    const payload = {
      documents: file,
      category
    }
    // console.log(payload)
    try {
      const response = await createSampleDocs(payload);
      setCategory('');
      let sucessMessage = response.data.message;
      // showNotification(sucessMessage, notificationType.SUCCESS);
      setOpenNoti(true);
      setSuccessMessage(sucessMessage);
      setLoading(false);
      dispatch(getSampleDocs());
      handleClose();
    } catch (error) {
      // showNotification(error.message, notificationType.ERROR);
      setErrorMessage(error.message);
      setOpenNoti(true);
      setLoading(false);
    }
  }

  let DocumentList = useSelector((state) => state.center?.sampledocs);
  useEffect(() => {
    dispatch(getSampleDocs());
  }, []);

  useEffect(() => {
    const fileterData = DocumentList.filter(item => item.documents[0].title.toLowerCase().indexOf(search.toLowerCase()) !== -1);
    if (search.length > 0) {
      setFilterDocs(fileterData);
    }
  }, [search])

  const uploadData = (e, updateUrl) => {

    // const { name, id } = e.target;
    let files = e.target.files || e.dataTransfer.files;
    // let nameType = name || id;
    // const userData = JSON.parse(window.localStorage.getItem('user'));

    // let fileBoolean = true;
    // let compressedData;
    if (files) {
      if (files[0]?.type === 'application/pdf') {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          // alert("pdf error")
          const errorMessage = 'Document file should not exceed 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (
        files[0]?.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Document file should not exceed 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (files[0]?.type.startsWith('image/')) {
        if (files[0].size > 1024 * 1024 * 2) {
          // fileBoolean = false;
          // alert("IMage error")
          const errorMessage = 'Image size should not exceed 2MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (files[0]?.type === 'application/vnd.ms-powerpoint' ||
        files[0]?.type === 'application/vnd.ms-powerpoint' ||
        files[0]?.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Document file should not exceed 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (
        files[0]?.type === 'application/msword' ||
        files[0]?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Document file should not exceed 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      } else if (files[0].type.startsWith('video/')) {
        if (files[0].size > 1024 * 1024 * 200) {
          // fileBoolean = false;
          const errorMessage = 'Video file should not exceed 200MB';
          setErrorMessage(errorMessage);
          setOpenNoti(true);
        }
      }
    }

    GetURLForUpload(
      e,
      updateUrl

    );
  }

  return (
    <>
      <Box
        sx={{ py: 4, pl: { xs: 4, lg: 0 }, pr: { xs: 4, md: 7 } }}
      >
        <Box display="flex" alignItems="center">
          <Box>
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(15)}`,
                mt: 2,
                mb: 3,
                ml: 4
              }}
              variant="h4"
            >
              SAMPLE DOCUMENTS/ DEEDS
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            mb: 2,
            columnGap: 2
          }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mb: 2,
              ml: 4,
              columnGap: 2
            }}>
            <DropDownFilter
              name="Category"
              initialValue="All"
              disabled />
            <Box
              display="flex"
              alignItems="center"
              sx={{ border: "1px solid lightgray", borderRadius: '10px', pl: 1, backgroundColor: "white" }}
            >
              <SearchTwoToneIcon
                sx={{
                  mr: 1.3,
                  color: theme.colors.secondary.main,
                  fontSize: '30px'
                }}
              />
              <SearchInputWrapper
                autoFocus
                placeholder="Search"
                fullWidth
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          </Box>
          <Box>
            {
              (isAssociateAdmin() || isSuperAdmin()) && <Button
                variant="contained"
                startIcon={<AddCircleIcon fontSize="medium" />}
                sx={{ mb: 1 }}
                style={{
                  width: '11rem',
                  height: '40px',
                  fontSize: '12px',
                  // fontFamily: 'Helvetica Neue medium lite'
                }}
                onClick={handleOpen}
              >
                Add Sample Docs
              </Button>
            }
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ zIndex: 7 }}
          >
            <Box sx={style}>
              <TextField
                label='Category'
                name='category'
                onChange={(event) => setCategory(event.target.value)}
                value={category}
              />
              <UploadFileVertical
                title="Upload Sample Docs"

                handleChange={(e) => {
                  // GetURLForUpload(e, updateUrl);
                  uploadData(e, updateUrl)
                }}
                handleDelete={handleDelete}
                name={file}
              />
              <Box
                position="relative"
                xs={{ bottom: '6px' }}
                md={{ bottom: '0px' }}
                xl={{ bottom: '0px' }}
              >
                <Button
                  variant="contained"
                  onClick={() => uploadOnSubmit()}
                >
                  {isLoading ? (
                    <CircularProgress
                      size={22}
                      style={{
                        color: 'white'
                      }}
                    />
                  ) : (
                    'Add'
                  )}
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="outlined"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Cancel
                </Button>

              </Box>
            </Box>

          </Modal>
        </Box>
        <Box sx={{ mt: 5 }}>
          <Grid container spacing={2} >
            {
              search.length > 0 ?
                filterDocs.map((item) => {
                  return (
                    <Grid item xs={12} md={5} lg={5.5} xl={4}>
                      <CardWrapper sx={{ ml: 4 }}>
                        <DocumentCard
                          item={item}
                        />
                      </CardWrapper>
                    </Grid>
                  );
                })
                :
                DocumentList.map((item) => {
                  return (
                    <Grid item xs={12} md={5} lg={5.5} xl={4}>
                      <CardWrapper sx={{ ml: 4 }}>
                        <DocumentCard
                          item={item}
                        />
                      </CardWrapper>
                    </Grid>
                  );
                })
            }
          </Grid>
        </Box>
      </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  )
}

export default SampleDocumentsDeeds;