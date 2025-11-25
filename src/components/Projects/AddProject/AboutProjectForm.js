import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Box, Grid, Divider, Button, CircularProgress, TextField } from '@mui/material';
import OpenNotification from 'src/content/ShowNotification';
import { UploadFileVerticalNew } from 'src/components/Upload/UploadFileVerticalNew';
import { useDispatch } from 'src/store';
import { AddProjectField } from '../../../slices/project_forms';
import {
  // UploadFileVertical,
  GetResultFileArray,
  GetURLForUpload,
  getStatus,
  getDocValue,
  handleRemoveFromS3,
  getAllDocList
} from './Index';

const initialValues = {
  description: '',
  addprojectspecification: [],
  'addprojectapprovals&certifications': []
};
const docList = [
  'addprojectspecification',
  'addprojectapprovals&certifications'
];

const AbouProjectForm = ({
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
  const [description, setDescription] = useState('');
  const [addProjectFormDetails, setAddProjectFormDetails] =
    useState(initialValues);
  const [isContinueClicked, setIsContinuedClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remove, setRemove] = useState([]);

  const updateUrl = (result) => {
    let files = GetResultFileArray(result);
    let fileArr = [...addProjectFormDetails[result[0].type]];
    if (Array.isArray(fileArr)) {
      Array.prototype.push.apply(fileArr, files);
    }
    setAddProjectFormDetails({
      ...addProjectFormDetails,
      [result[0].type]: fileArr
    });
  };
  
  const handleDelete = (url, name, index = 0) => {
    handleRemoveFromS3(url).then((response) => {
      if (response) {
        let arr = [...addProjectFormDetails[`${name}`]];
        const removeData = arr.splice(index, 1)[0];
        setRemove((prev) => [...prev, removeData])
        setAddProjectFormDetails({
          ...addProjectFormDetails,
          [`${name}`]: arr
        });
      }
    });
  };
  const getPreviousData = () => {
    const { description, documents } = prevData;

    let value = {
      addprojectspecification: getDocValue(
        'addprojectspecification',
        documents
      ),
      'addprojectapprovals&certifications': getDocValue(
        'addprojectapprovals&certifications',
        documents
      )
    };
    setDescription(description);
    setAddProjectFormDetails(value);
  };

  const handleSave = async (isContinueClicked) => {
    setIsContinuedClicked(isContinueClicked);
    setIsSubmitting(true);
    const docs = getAllDocList(docList, addProjectFormDetails);
    const payload = {
      remove,
      description,
      documents: docs,
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
      
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const uploadData = (e, updateUrl) => {

    // const { name, id } = e.target;
    let files = e.target.files || e.dataTransfer.files;
    // let nameType = name || id;
    // const userData = JSON.parse(window.localStorage.getItem('user'));

    // let fileBoolean = true;
    // let compressedData;
    let totalSize = 0;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        totalSize += files[i].size;

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

    if (totalSize >= 1024 * 1024 * 200) {
      const errorMessage = 'File size should not exceed 200MB';
      console.log("ERROR MESSAGE OPENNING")
      setErrorMessage(errorMessage);
      setOpenNoti(true);
      return;
    }

    GetURLForUpload(
      e,
      updateUrl

    );
}

  return (
    <>
      <Box autoComplete="off" my={1} mx={5}>
        <Grid item xs={12} md={12}>
          <Box width="100%">
            <TextField
              id="description"
              name="description"
              label="Project Brief"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              style={{ marginBottom: '20px' }}
              onChange={(e)=>{setDescription(e.target.value)}}
              value={description}
            />
          </Box>
        </Grid>
        <Grid container columnSpacing={4} rowSpacing={4}>
          <Grid item xs={12} md={6}>
            <UploadFileVerticalNew
              title="ADD PROJECT SPECIFICATION"
              handleChange={(e) => {
                // GetURLForUpload(e, updateUrl);
                uploadData(e, updateUrl)
              }}
              name={addProjectFormDetails.addprojectspecification}
              handleDelete={handleDelete}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadFileVerticalNew
              title="ADD PROJECT APPROVALS & CERTIFICATIONS"
              handleChange={(e) => {
                // GetURLForUpload(e, updateUrl);
                uploadData(e, updateUrl)
              }}
              name={addProjectFormDetails['addprojectapprovals&certifications']}
              handleDelete={handleDelete}
            />
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box
        my={3}
        mx={4}
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
              {' '}
              Save
            </Button>
            <Button variant="outlined" onClick={() => handleCancel(projectId)}>
              {' '}
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
              {' '}
              Save & Exit
            </Button>
          </>
        )}
      </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
};

export default AbouProjectForm;
