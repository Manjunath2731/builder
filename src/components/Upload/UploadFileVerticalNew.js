// import { useEffect, useState } from "react";
// import { notificationType } from "src/constants/NotificationType";
// import OpenNotification from "src/content/ShowNotification";
// import { showNotification } from "src/utils/commonUtility";

import React, { useState, useCallback } from "react";
// 
import { Avatar, Box, Button, Card, Modal, Table, TableBody, TableCell, TableContainer, TableRow, Typography, styled } from "@mui/material";
import OpenNotification from "src/content/ShowNotification";
import { useTheme } from "@mui/styles";
import DeleteConfirmation from "src/content/delete-alert/DeleteAlert";
import Scrollbar from 'src/components/Scrollbar';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import ProgressBar from "../Projects/AddProject/ProgressBar";
import { getIcons } from "../Projects/ViewProjectDetails/ProjectDetailScreens";


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

export const UploadFileVerticalNew = ({
    title,
    handleChange,
    setIndex = {},
    name,
    nameNonTitle = '',
    indexId = -1,
    handleDelete,
    isMultipleRequired = true
}) => {
    const fileType = ['jpg', 'jpeg', 'png'];
    const videoType = ['mp4'];

    // states
    const [openNoti, setOpenNoti] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [totalFiles, setTotalFiles] = useState(name?.length);
    const [files, setFiles] = useState([]);
    const [uploads, setUploads] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [isDelete, setDelete] = useState(false);
    const [url, setUrl] = useState('');
    const [index, setIndexState] = useState(0);

    // theme
    const theme = useTheme();

    // functions
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
    };

    const closeSuccessNotification = () => {
        setSuccessMessage('');
    };

    const isClosed = (data) => {
        if (data) {
            setErrorMessage('');
            setOpenNoti(false);
        }
    };

    const handleClose = () => {
        setDelete(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handlelose = () => {
        console.log("closing  the modal")
        setOpen(false);
    };
    const handleLoseCallback = useCallback(() => {
        handlelose();
      }, [handlelose]);

   

    const handleDeleteCompleted = () => {
        setDelete(false);
        if (indexId > -1) {
            handleDelete(url, inputName, indexId);
        } else {
            handleDelete(url, inputName, index);
        }
    };

    const handleUpload = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        let totalSize = 0;

        if (files) {
            for (let i = 0; i < files.length; i++) {
                totalSize += files[i].size;
                if (files[i].type === 'application/pdf') {
                    if (files[i].size > 1024 * 1024 * 200) {
                        // setIsLoading(false);
                        return;
                    }
                } else if (
                    files[i].type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ) {
                    if (files[i].size > 1024 * 1024 * 200) {
                        // setIsLoading(false);
                        return;
                    }
                } else if (files[i].type.startsWith('image/')) {
                    if (files[i].size > 1024 * 1024 * 2) {
                        // setIsLoading(false);
                        return;
                    }
                } else if (files[i].type === 'application/vnd.ms-powerpoint' ||
                    files[i].type === 'application/vnd.ms-powerpoint' ||
                    files[i].type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                ) {
                    if (files[i].size > 1024 * 1024 * 200) {
                        // setIsLoading(false);
                        return;
                    }
                } else if (
                    files[i].type === 'application/msword' ||
                    files[i].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ) {
                    if (files[i].size > 1024 * 1024 * 200) {
                        // setIsLoading(false);
                        return;
                    }
                } else if (files[i].type.startsWith('video/')) {
                    if (files[i].size > 1024 * 1024 * 200) {
                        // setIsLoading(false);
                        return;
                    }
                }
            }
        }

        if(totalSize >= 1024 * 1024 * 200){
            return;
        }

        let noOfFiles = e.target.files?.length;
        setTotalFiles(name?.length + noOfFiles);
        setFiles([...files]);
        const tempUploads = [...files].map((file) => ({
            file,
            progress: 0
        }));

        setUploads(tempUploads);
        handleOpen();
        setOpen(true);
    };

    const getName = (title) => {
        let inputName = title.toLowerCase().split(' ').join('');
        return inputName;
    };

    // given project component like uploadrera , 
    let inputName = title.length === 0 ? nameNonTitle : getName(title);
    if (!Array.isArray(name) || (!isMultipleRequired && name[0]?.title === '')) {
        name = [];
    }

    console.log(name, openNoti, files, totalFiles, uploads);

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
            <Card sx={{ background: '#eeeeee', height: 365 }}>
                {
                    name.length > 0 ?
                        <Card sx={{ background: '#eeeeee', height: 365 }}>
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
                                                            fileType.indexOf(item?.contentType) === -1 &&
                                                            videoType.indexOf(item?.contentType) === -1 &&
                                                            item?.label !== '';
                                                        let Icons = getIcons(item?.contentType);
                                                        console.log(item, Icons, isDisplay)
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
                            </Box>{' '}
                        </Card>
                        :
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
                                                    e.target.value = '';
                                                    return;
                                                }
                                            }
                                            handleChange(e);
                                            handleUpload(e);
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
                            <Typography
                                variant="subtitle2"
                                sx={{ my: 1, px: 4, fontSize: '11px' }}
                            >
                                Files must be image,pdf,doc,ppt,video
                            </Typography>
                        </Box>
                }
            </Card>

            <Modal open={open}   >
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
                        borderRadius: "8px",
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
                                    <ProgressBar
                                        handlelose={handleLoseCallback} 
                                        progress={upload.progress}
                                        filename={upload.file.name}
                                        contentType={upload.file.type}
                                        fileSize={upload.file.size}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Modal>
            <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
        </>
    )
};