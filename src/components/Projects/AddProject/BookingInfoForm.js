import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Grid } from '@mui/material';
import OpenNotification from 'src/content/ShowNotification';

import { UploadFileVerticalNew } from 'src/components/Upload/UploadFileVerticalNew';
import { useDispatch } from 'src/store';
import { AddProjectField } from '../../../slices/project_forms';
import {
  // UploadFileVertical,
  GetURLForUpload,
  getStatus,
  // handleRemoveFromS3,
  getDocValue,
  getAllDocList,
  GetResultFileArray
} from './Index';

const initialValues = {
  uploadeoiform: [],
  uploadbookingform: [],
  documentchecklistforbooking: [],
  bankingdetailsforbooking: [],
  tdsdeductiondetails: []
};
const DocList = [
  'uploadeoiform',
  'uploadbookingform',
  'documentchecklistforbooking',
  'bankingdetailsforbooking',
  'tdsdeductiondetails'
];

const BookingInfoForm = ({
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

  const [bookingInfoDetails, setBookingInfoDetails] = useState(initialValues);
  const [isContinueClicked, setIsContinuedClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remove, setRemove] = useState([]);

  const updateUrl = (result) => {
    let files = GetResultFileArray(result);
    let fileArr = [...bookingInfoDetails[result[0].type]];
    if (Array.isArray(fileArr)) {
      Array.prototype.push.apply(fileArr, files);
    }
    setBookingInfoDetails({ ...bookingInfoDetails, [result[0].type]: fileArr });
  };
  const handleDelete = (url, name, index = 0) => {
    // handleRemoveFromS3(url).then((response) => {
    //   if (response) {
        let arr = [...bookingInfoDetails[`${name}`]];
        const removeData = arr.splice(index, 1)[0];
        setRemove((prev) => [...prev, removeData])
        setBookingInfoDetails({
          ...bookingInfoDetails,
          [`${name}`]: arr
        });
    //   }
    // });
  };
  const getPreviousData = () => {
    const { documents } = prevData;
    const value = {
      uploadeoiform: getDocValue('uploadeoiform', documents),
      uploadbookingform: getDocValue('uploadbookingform', documents),
      documentchecklistforbooking: getDocValue(
        'documentchecklistforbooking',
        documents
      ),
      bankingdetailsforbooking: getDocValue(
        'bankingdetailsforbooking',
        documents
      ),
      tdsdeductiondetails: getDocValue('tdsdeductiondetails', documents)
    };
    setBookingInfoDetails(value);
  };

  useEffect(() => {
    getPreviousData();
  }, []);
  const handleSave = async (isContinueClicked) => {
    setIsContinuedClicked(isContinueClicked);
    setIsSubmitting(true);
    const docs = getAllDocList(DocList, bookingInfoDetails);
    const payload = {
      remove,
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
      <Box my={1} mx={9}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={6} xl={6}>
            <UploadFileVerticalNew
              title="UPLOAD EOI FORM"
              handleChange={(e) => {
                // GetURLForUpload(e, updateUrl);
                uploadData(e,updateUrl)
              }}
              name={bookingInfoDetails.uploadeoiform}
              handleDelete={handleDelete}
            />
          </Grid>
          <Grid item xs={12} lg={6} xl={6}>
            <UploadFileVerticalNew
              title=" UPLOAD BOOKING FORM"
              handleChange={(e) => {
                // GetURLForUpload(e, updateUrl);
                uploadData(e,updateUrl)
              }}
              name={bookingInfoDetails.uploadbookingform}
              handleDelete={handleDelete}
            />
          </Grid>
          <Grid item xs={12} lg={6} xl={6}>
            <UploadFileVerticalNew
              title="DOCUMENT CHECKLIST FOR BOOKING"
              handleChange={(e) => {
                // GetURLForUpload(e, updateUrl);
                uploadData(e,updateUrl)
              }}
              name={bookingInfoDetails.documentchecklistforbooking}
              handleDelete={handleDelete}
            />
          </Grid>
          <Grid item xs={12} lg={6} xl={6}>
            <UploadFileVerticalNew
              title="BANKING DETAILS FOR BOOKING"
              handleChange={(e) => {
                // GetURLForUpload(e, updateUrl);
                uploadData(e,updateUrl)
              }}
              name={bookingInfoDetails.bankingdetailsforbooking}
              handleDelete={handleDelete}
            />
          </Grid>
          <Grid item xs={12} lg={6} xl={6}>
            <UploadFileVerticalNew
              title="TDS DEDUCTION DETAILS"
              handleChange={(e) => {
                // GetURLForUpload(e, updateUrl);
                uploadData(e,updateUrl)
              }}
              name={bookingInfoDetails.tdsdeductiondetails}
              handleDelete={handleDelete}
            />
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
export default BookingInfoForm;
