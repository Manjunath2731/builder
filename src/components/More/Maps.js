import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    useTheme,
    Button,
    Modal,
    CircularProgress,
    Grid,
    TextField,
    styled,
    alpha,
    Card,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { handleDownload } from 'src/utils/utilits';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { isAssociateAdmin, isSuperAdmin } from 'src/helpers/userHelpers';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import OpenNotification from 'src/content/ShowNotification';

import { deleteMaps, getMaps } from 'src/slices/center';
import { useDispatch, useSelector } from 'react-redux';
import { createMaps } from 'src/axiosInstances/Api';
import DeleteConfirmation from 'src/content/delete-alert/DeleteAlert';
import { DropDownFilter } from '../../content/channel-partners/DropDownFilter';
import { getIcons } from '../../components/Projects/ViewProjectDetails/ProjectDetailScreens/index';
// import { CardWrapper } from './DeedDocumentWriters';
import { GetResultFileArray, GetURLForUpload, UploadFileVertical, handleRemoveFromS3 } from '../Projects/AddProject/Index';

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

const DocumentBox = ({ item }) => {
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
            //   navigate(`/team/${selectedTab}`);
            // }
        }
    };

    const closeSuccessNotification = () => {
        setSuccessMessage('');
    };

    const { documents } = item;
    let Icons = getIcons(documents[0]?.contentType);
    // console.log(Icons[0],"Icons[0]",documents);
    const handleDelete = async (id) => {
        try {
            const response = await deleteMaps(id);
            let sucessMessage = response.data.message;
            setDelete(false);
            // showNotification(sucessMessage, notificationType.SUCCESS);
            setOpenNoti(true);
            setSuccessMessage(sucessMessage);
            dispatch(getMaps());
        } catch (error) {
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

const Maps = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [file, setFile] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [city, setCity] = useState('');

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
            city
        }
        // console.log(payload)
        try {
            const response = await createMaps(payload);
            setCity('');
            let sucessMessage = response.data.message;
            // showNotification(sucessMessage, notificationType.SUCCESS);
            setOpenNoti(true);
            setSuccessMessage(sucessMessage);
            setLoading(false);
            dispatch(getMaps());
            handleClose();
        } catch (error) {
            // showNotification(error.message, notificationType.ERROR);
            setErrorMessage(error.message);
            setOpenNoti(true);
            setLoading(false);
        }
    }

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

    let Docs = useSelector((state) => state.center?.maps);
    useEffect(() => {
        dispatch(getMaps());
    }, [])
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
        <React.Fragment>
            <Box
                sx={{ py: 4, pl: { xs: 4, lg: 0 }, pr: { xs: 4, md: 7 } }}
            >
                <Box display="flex" alignItems="center">
                    <Box sx={{ mt: 2, mb: 3 }}>
                        <Typography
                            sx={{
                                ml: 4,
                                fontSize: `${theme.typography.pxToRem(15)}`
                            }}
                            variant="h4"
                        >
                            MAPS
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        mb: 2
                    }}
                >

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', ml: 4 }}>
                        <DropDownFilter
                            name="City"
                            // value={FilterValue.Projects}
                            // onchange={handleFilter}
                            // menuItems={projectNameList}
                            initialValue="All"
                        />
                        <Box>
                            {
                                (isAssociateAdmin() || isSuperAdmin()) && <Button
                                    variant="contained"
                                    startIcon={<AddCircleIcon fontSize="medium" />}
                                    sx={{ mb: 1 }}
                                    style={{
                                        width: '8rem',
                                        height: '40px',
                                        fontSize: '12px',
                                        // fontFamily: 'Helvetica Neue medium lite'
                                    }}
                                    onClick={handleOpen}
                                >
                                    Add Maps
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
                                    label='City'
                                    name='city'
                                    onChange={(event) => setCity(event.target.value)}
                                    value={city}
                                />
                                <UploadFileVertical
                                    title="Upload Circle Rate"
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
                </Box>
                <Box sx={{ mt: 5 }}>
                    <Grid container spacing={2} >
                        {Docs.map((item, index) => {
                            return (
                                <Grid item xs={12} md={5} lg={5.5} xl={4}>
                                    <CardWrapper sx={{ ml: 4 }}>
                                        <DocumentBox
                                            item={item}
                                            index={index}
                                        />
                                    </CardWrapper>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Box>
            <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
        </React.Fragment>
    );
};

export default Maps;