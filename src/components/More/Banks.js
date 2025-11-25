import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    useTheme,
    InputBase,
    styled,
    Grid,
    // Avatar,
    Card,
    alpha,
    Button,
    Modal,
    TextField,
    CircularProgress,
    RadioGroup,
    FormControlLabel,
    Radio,
    CardMedia,
    //  Divider
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { format } from 'date-fns';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import { ProfileImageComponent } from 'src/content/pages/Auth/Register/EditBuilderGroup';

import OpenNotification from 'src/content/ShowNotification';

import { isAssociateAdmin, isSuperAdmin } from 'src/helpers/userHelpers';
import { createBankDsas } from 'src/axiosInstances/Api';
import { deleteBankDsas, editBankDsas, getBankDsas } from 'src/slices/center';
import { useDispatch, useSelector } from 'react-redux';
import DeleteConfirmation from 'src/content/delete-alert/DeleteAlert';
import { DropDownFilter } from '../../content/channel-partners/DropDownFilter';
import UploadFile from '../Upload/UploadFile';
import { GetURLForUpload } from '../Projects/AddProject/Index';

// let darkGreen = '#4a944e';

// const DividerContrast = styled(Divider)(
//     ({ theme }) => `
//       background: ${theme.palette.grey[500]};
//     `
// );

const SearchInputWrapper = styled(InputBase)(
    ({ theme }) => `
    font-size: ${theme.typography.pxToRem(15)};
    max-width:'80px'
    // width: 100%;
`
);
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

const CardWrappers = styled(Card)(
    ({ theme }) => `
        transition: ${theme.transitions.create(['box-shadow'])};
        position: relative;
        border-radius: 0px;
        z-index: 5;
        width: 100%;
        height: 100%;
        border: 0.2px solid #cedbef;
        `
);
export const CardActions = styled(Box)(
    ({ theme }) => `
    position: absolute;
    left: ${theme.spacing(1)};
    bottom: ${theme.spacing(0)};
    right:${theme.spacing(1)};
    z-index: 7;
  `
);
export const Label = styled(Box)(
    ({ theme }) => `
    
    color: ${theme.palette.common.black};
    text-transform: uppercase;
    font-size: ${theme.typography.pxToRem(12)};
    font-weight: bold;
    line-height: 23px;
    
    padding: ${theme.spacing(0.3, 1.2)};
    margin :${theme.spacing(0, 2)};
    border-radius: 5px;
    width: -moz-fit-content;
    width: fit-content;
  `
);
const WriterCard = ({
    name,
    id,
    logo,
    type,
    city,
    updatedAt, createdAt
}) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [profileUrl, setProfileUrl] = useState(logo);
    const [selectedValue, setSelectedValue] = useState(type);
    const [isDelete, setDelete] = useState(false);

    const [state, setState] = useState({
        name,
        city,
        type,
        logo,
        updatedAt, createdAt
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    const updateUrl = (result) => {
        setProfileUrl(result[0].url);
    };


    const [openNoti, setOpenNoti] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');



    const isClosed = (data) => {
        if (data) {
            setErrorMessage('');
            setOpenNoti(false);
            //   if (!errorMessage) {
            //     navigate(`/team/${selectedTab}`);
            //   }
        }
    };

    const closeSuccessNotification = () => {
        setSuccessMessage('');
    };

    const uploadOnSubmit = async () => {
        setLoading(true)
        const payload = {
            ...state,
            logo: profileUrl
        }

        try {
            const response = await editBankDsas(id, payload);
            let sucessMessage = response.data.message;
            // showNotification(sucessMessage, notificationType.SUCCESS);
            setOpenNoti(true);
            setSuccessMessage(sucessMessage);
            setLoading(false);
            dispatch(getBankDsas());
            handleClose();
        } catch (error) {
            // showNotification(error.message, notificationType.ERROR);
            setErrorMessage(error.message);
            setOpenNoti(true);
            setLoading(false);
        }
    }

    const handleInputChange = (evt) => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
    };

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

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


    const handleDelete = async (id) => {
        try {
            const response = await deleteBankDsas(id);
            let sucessMessage = response.data.message;
            setDelete(false);
            // showNotification(sucessMessage, notificationType.SUCCESS);
            setOpenNoti(true);
            setSuccessMessage(sucessMessage);
            dispatch(getBankDsas());
        } catch (error) {
            // showNotification(error.message, notificationType.ERROR);
            setErrorMessage(error.message);
            setOpenNoti(true);
        }
    }


    const handleDeleteClose = () => {
        setDelete(false);
    };

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
                    const errorMessage = 'Document file should not exceeds 200MB';
                    setErrorMessage(errorMessage);
                    setOpenNoti(true);
                }
            } else if (
                files[0]?.type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ) {
                if (files[0].size > 1024 * 1024 * 200) {
                    // fileBoolean = false;
                    const errorMessage = 'Document file should not exceeds 200MB';
                    setErrorMessage(errorMessage);
                    setOpenNoti(true);
                }
            } else if (files[0]?.type.startsWith('image/')) {
                if (files[0].size > 1024 * 1024 * 2) {
                    // fileBoolean = false;
                    // alert("IMage error")
                    const errorMessage = 'Image size should not exceeds 2MB';
                    setErrorMessage(errorMessage);
                    setOpenNoti(true);
                }
            } else if (files[0]?.type === 'application/vnd.ms-powerpoint' ||
                files[0]?.type === 'application/vnd.ms-powerpoint' ||
                files[0]?.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ) {
                if (files[0].size > 1024 * 1024 * 200) {
                    // fileBoolean = false;
                    const errorMessage = 'Document file should not exceeds 200MB';
                    setErrorMessage(errorMessage);
                    setOpenNoti(true);
                }
            } else if (
                files[0]?.type === 'application/msword' ||
                files[0]?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                if (files[0].size > 1024 * 1024 * 200) {
                    // fileBoolean = false;
                    const errorMessage = 'Document file should not exceeds 200MB';
                    setErrorMessage(errorMessage);
                    setOpenNoti(true);
                }
            } else if (files[0].type.startsWith('video/')) {
                if (files[0].size > 1024 * 1024 * 200) {
                    // fileBoolean = false;
                    const errorMessage = 'Video file should not exceeds 200MB';
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
        <CardWrappers id={id} sx={{ height: '100%' }}>
            <Box
                sx={{
                    pl: { xs: 4, md: 2, xl: 3 },
                    pt: 3,
                    pb: 2,
                    pr: { xs: 3, md: 2, xl: 2 },
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <CardMedia
                    sx={{
                        width: 94,
                        height: 94,
                        resizeMode: 'contain',
                        objectFit: 'fill'
                    }}
                    alt="Company Logo"
                    image={logo}

                />
                <Box sx={{ ml: 3, width: '100%', flexDirection: 'column' }}>
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start'
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography variant="h5">{name.length > 25 ? `${name.slice(0, 25)}...` : name}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 0.5 }}>{type}</Typography>
                        </Box>



                        {
                            (isAssociateAdmin() || isSuperAdmin()) &&
                            <Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        height: 26,
                                        width: 64,
                                        borderRadius: 0.5,
                                        marginRight: 1
                                    }}
                                    onClick={() => handleOpen(id)}
                                >
                                    <Typography variant="body2">Edit</Typography>
                                </Button>
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
                                    <Typography variant="body2">Delete</Typography>
                                </Button>
                            </Box>
                        }

                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            style={{ zIndex: 7 }}
                        >
                            <Box sx={style}>
                                <Typography
                                    id="modal-modal-title"
                                    variant="h4"
                                    component="h1"
                                    mt={2}
                                >
                                    Edit Banks & DSAs
                                </Typography>
                                <Grid container columnSpacing={2} rowSpacing={2}>
                                    <Grid item xs={6}>
                                        <RadioGroup
                                            name="radioGroup"
                                            value={selectedValue}
                                            onChange={handleRadioChange}
                                        >
                                            <FormControlLabel
                                                value="banks"
                                                control={<Radio />}
                                                label="Banks"
                                            />
                                        </RadioGroup>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <RadioGroup
                                            name="radioGroup"
                                            value={selectedValue}
                                            onChange={handleRadioChange}
                                        >
                                            <FormControlLabel
                                                value="dsas"
                                                control={<Radio />}
                                                label="DSAs"
                                            />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                                <TextField
                                    label='Name'
                                    name='name'
                                    onChange={(event) => handleInputChange(event)}
                                    value={state.name}
                                />
                                <Box>
                                    <Typography mb={1} mr={2} mt={1}>
                                        Upload Image*
                                    </Typography>
                                    <Grid container>
                                        <Grid
                                            xs={6}
                                            md={4}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'start',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <UploadFile
                                                title="Upload Image*"
                                                handleChange={(e) => {
                                                    // GetURLForUpload(e, updateUrl);
                                                    uploadData(e, updateUrl)
                                                }}
                                                name={profileUrl}
                                            />
                                        </Grid>
                                        <Grid xs={6} md={8}>
                                            {profileUrl !== '' &&
                                                profileUrl !== undefined &&
                                                profileUrl !== null && (
                                                    <ProfileImageComponent
                                                        src={profileUrl}
                                                        alt="profile Image"
                                                        setProfileUrl={setProfileUrl}
                                                    />
                                                )}
                                        </Grid>
                                    </Grid>
                                </Box>
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
                                            'Edit'
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
                    <Box sx={{ mt: 1 }}>
                        <hr
                            style={{
                                borderTop: 'dashed 2px',
                                color: '#e6edf7',
                                borderBottom: ' 0px'
                            }}

                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            // justifyContent:'space-between',
                            mt: 2
                        }}
                    >

                        <Typography> <b>Created on</b> : {format(new Date(createdAt), 'dd MMM yyyy')}</Typography>
                        <Typography sx={{ ml: 2 }}> <b>Last modified</b> : {format(new Date(updatedAt), 'dd MMM yyyy')}</Typography>
                    </Box>
                </Box>

            </Box>
            {/* {(isAssociateAdmin() || isSuperAdmin()) && <hr
                    style={{
                        borderTop: 'solid 2px',
                        color: '#e6edf7',
                        borderBottom: ' 0px'
                    }}
                />} */}

            {isDelete && (
                <DeleteConfirmation
                    openConfirmDelete={isDelete}
                    closeConfirmDelete={handleDeleteClose}
                    handleDeleteCompleted={() => handleDelete(id)}
                    selectedId={id}
                    title="builder"
                />
            )}
            <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
        </CardWrappers >
    );
};


const Banks = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [profileUrl, setProfileUrl] = useState();
    const [selectedValue, setSelectedValue] = useState('banks');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };
    const updateUrl = (result) => {
        setProfileUrl(result[0].url);
    };

    const [state, setState] = useState({
        city: "",
        state: "",
        name: "",
        logo: "",
        createdAt: "",
        updatedAt: ""
    });

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
            ...state,
            type: selectedValue,
            logo: profileUrl
        }

        try {
            const response = await createBankDsas(payload);
            setState({
                city: "",
                state: "",
                name: "",
                logo: "",
                createdAt: "",
                updatedAt: ""
            });
            setProfileUrl()
            let sucessMessage = response.data.message;
            // showNotification(sucessMessage, notificationType.SUCCESS);
            setOpenNoti(true);
            setSuccessMessage(sucessMessage);
            setLoading(false);
            dispatch(getBankDsas());
            handleClose();
        } catch (error) {
            // showNotification(error.message, notificationType.ERROR);
            setErrorMessage(error.message);
            setOpenNoti(true);
            setLoading(false);
        }
    }

    const handleInputChange = (evt) => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
    };

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

    let ListWriters = useSelector((state) => state.center?.bankdsas);

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    useEffect(() => {
        dispatch(getBankDsas());
    }, []);

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
                    const errorMessage = 'Document file should not exceeds 200MB';
                    setErrorMessage(errorMessage);
                    setOpenNoti(true);
                }
            } else if (
                files[0]?.type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ) {
                if (files[0].size > 1024 * 1024 * 200) {
                    // fileBoolean = false;
                    const errorMessage = 'Document file should not exceeds 200MB';
                    setErrorMessage(errorMessage);
                    setOpenNoti(true);
                }
            } else if (files[0]?.type.startsWith('image/')) {
                if (files[0].size > 1024 * 1024 * 2) {
                    // fileBoolean = false;
                    // alert("IMage error")
                    const errorMessage = 'Image size should not exceeds 2MB';
                    setErrorMessage(errorMessage);
                    setOpenNoti(true);
                }
            } else if (files[0]?.type === 'application/vnd.ms-powerpoint' ||
                files[0]?.type === 'application/vnd.ms-powerpoint' ||
                files[0]?.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ) {
                if (files[0].size > 1024 * 1024 * 200) {
                    // fileBoolean = false;
                    const errorMessage = 'Document file should not exceeds 200MB';
                    setErrorMessage(errorMessage);
                    setOpenNoti(true);
                }
            } else if (
                files[0]?.type === 'application/msword' ||
                files[0]?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                if (files[0].size > 1024 * 1024 * 200) {
                    // fileBoolean = false;
                    const errorMessage = 'Document file should not exceeds 200MB';
                    setErrorMessage(errorMessage);
                    setOpenNoti(true);
                }
            } else if (files[0].type.startsWith('video/')) {
                if (files[0].size > 1024 * 1024 * 200) {
                    // fileBoolean = false;
                    const errorMessage = 'Video file should not exceeds 200MB';
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
                // display="flex"
                // alignItems={{ xs: 'stretch', md: 'center' }}
                // flexDirection={{ xs: 'row', md: 'row' }}
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
                            BANKS & DSAs
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            columnGap: 2,
                            ml: 4
                        }}
                    >
                        <DropDownFilter
                            name="City"
                            // value={FilterValue.Projects}
                            // onchange={handleFilter}
                            // menuItems={projectNameList}
                            initialValue="All"
                        />
                        <Box
                            // flexGrow={1}
                            display="flex"
                            alignItems="center"
                            sx={{ border: "1px solid lightgray", borderRadius: '10px', pl: 1, backgroundColor: "white" }}
                        >
                            <SearchTwoToneIcon
                                // fontSize='large'
                                sx={{
                                    mr: 1.3,
                                    color: theme.colors.secondary.main,
                                    fontSize: '30px'
                                }}
                            />
                            <SearchInputWrapper
                                // value={searchValue}
                                // onChange={handleSearchChange}
                                autoFocus
                                placeholder="Search"
                                fullWidth
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
                                    width: '12rem',
                                    height: '40px',
                                    fontSize: '12px',
                                    // fontFamily: 'Helvetica Neue medium lite'
                                }}
                                onClick={handleOpen}
                            >
                                Add Banks & DSAs
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
                            <Typography
                                id="modal-modal-title"
                                variant="h4"
                                component="h1"
                                mt={2}
                            >
                                Add Banks & DSAs
                            </Typography>
                            <Grid container columnSpacing={2} rowSpacing={2}>
                                <Grid item xs={6}>
                                    <RadioGroup
                                        name="radioGroup"
                                        value={selectedValue}
                                        onChange={handleRadioChange}
                                    >
                                        <FormControlLabel
                                            value="banks"
                                            control={<Radio />}
                                            label="Banks"
                                        />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={6}>
                                    <RadioGroup
                                        name="radioGroup"
                                        value={selectedValue}
                                        onChange={handleRadioChange}
                                    >
                                        <FormControlLabel
                                            value="dsas"
                                            control={<Radio />}
                                            label="DSAs"
                                        />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                            <TextField
                                label='Name'
                                name='name'
                                onChange={(event) => handleInputChange(event)}
                                value={state.name}
                            />
                            <Box>
                                <Typography mb={1} mr={2} mt={1}>
                                    Upload Image*
                                </Typography>
                                <Grid container>
                                    <Grid
                                        xs={6}
                                        md={4}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'start',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <UploadFile
                                            title="Upload Image*"
                                            handleChange={(e) => {
                                                // GetURLForUpload(e, updateUrl);
                                                uploadData(e, updateUrl)
                                            }}
                                            name={profileUrl}
                                        />
                                    </Grid>
                                    <Grid xs={6} md={8}>
                                        {profileUrl !== '' &&
                                            profileUrl !== undefined &&
                                            profileUrl !== null && (
                                                <ProfileImageComponent
                                                    src={profileUrl}
                                                    alt="profile Image"
                                                    setProfileUrl={setProfileUrl}
                                                />
                                            )}
                                    </Grid>
                                </Grid>
                            </Box>
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
                {/* <Box sx={{ mt: 5 }}>
                    <Grid container spacing={2}>
                        {ListWriters.map((item) => {
                            return (
                                <Grid item xs={12} md={5} lg={5.5} xl={4}>
                                    <WriterCard
                                        name={item?.name}
                                        id={item?._id}
                                        type={item.type}
                                        logo={item?.logo}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box> */}
                <CardWrapper sx={{ minWidth: 275, minHeight: "fit-content", mt: 3, ml: 4 }} >
                    {ListWriters.length ? (
                        <Grid container sx={{ gridAutoRows: '1fr' }}>
                            {ListWriters.map((item) => {
                                return (
                                    <Grid
                                        item
                                        key={item?.id}
                                        xs={12}
                                        sm={12}
                                        md={6}
                                        lg={6}
                                        xxl={4}
                                    >
                                        <WriterCard
                                            name={item?.name}
                                            id={item?._id}
                                            type={item.type}
                                            logo={item?.logo}
                                            createdAt={item?.createdAt}
                                            updatedAt={item?.updatedAt}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ) : (
                        <Box
                            display="flex"
                            justifyContent="center"
                            textAlign="center "
                            sx={{
                                padding: '35px',
                                margin: 'auto'
                            }}
                        >
                            <Typography
                                variant="h3"
                                pt={10}
                                sx={{ color: theme.palette.grey[500] }}
                                textAlign="center"
                            >
                                {' '}
                                No Builder To Show{' '}
                            </Typography>
                        </Box>)}

                </CardWrapper>
            </Box >
            <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
        </React.Fragment >
    );
};
export default Banks;
