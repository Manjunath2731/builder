import React, { useState, useEffect } from 'react';

import {
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useTheme
} from '@mui/material';
import OpenNotification from 'src/content/ShowNotification';

import AddIcon from '@mui/icons-material/Add';
import { UploadFileVerticalNew } from 'src/components/Upload/UploadFileVerticalNew';
import { useDispatch } from 'src/store';
import { AddProjectField } from '../../../slices/project_forms';
import {
  // UploadFileVertical,
  AvatarWrapper,
  GetURLForUpload,
  getStatus,
  handleRemoveFromS3
} from './Index';

const PaymentPlansForm = ({
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
  const PaymentPlansList = [
    { label: 'Construction Linked', value: 'construction_linked' },
    { label: 'Time Linked', value: 'time_linked' },
    { label: 'Possession Linked', value: 'possession_linked' },
    { label: 'Add Customized', value: 'add_customized' }
  ];

  const theme = useTheme();
  const payload = [
    {
      paymentType: '',
      customizedType: '',
      paymentPlanDoc: ''
    }
  ];

  const [paymentPlans, setPaymentPlans] = useState(payload);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newPayment = [...paymentPlans];

    const editPlans = newPayment[index];
    editPlans[name] = value;
    newPayment[index] = editPlans;
    setPaymentPlans(newPayment);
  };
  const handleAdd = () => {
    const AddPayment = {
      paymentType: '',
      customizedType: '',
      paymentPlanDoc: ''
    };
    setPaymentPlans([...paymentPlans, AddPayment]);
  };
  const [isContinueClicked, setIsContinuedClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const getPaymentType = (itemName) => {
    let FilteredPlan = PaymentPlansList.filter(
      (item) => item.value === itemName
    );
    if (FilteredPlan.length === 0) {
      return 'add_customized';
    }
    return FilteredPlan[0]?.value || '';
  };

  const getCustomizedType = (itemName) => {
    let FilteredPlan = PaymentPlansList.filter(
      (item) => item.value === itemName
    );
    if (FilteredPlan.length === 0) {
      return itemName;
    }
    return '';
  };
  const getDoc = (name, paymentArray) => {
    let paymentplans = paymentArray.map((item) => ({
      paymentType: getPaymentType(item.paymentType),
      customizedType: getCustomizedType(item.paymentType),
      paymentPlanDoc: {
        url: item?.url,
        title: item?.title,
        contentType: item?.contentType
      }
    }));
    return paymentplans;
  };
  const getPreviousData = () => {
    const { payment } = prevData;
    const value = getDoc('paymentPlans', payment);
    if (value.length !== 0) {
      setPaymentPlans(value);
    }
  };
  useEffect(() => {
    getPreviousData();
  }, []);

  const handleSave = async (isContinueClicked) => {
    setIsContinuedClicked(isContinueClicked);
    setIsSubmitting(true);
    const paymentList = paymentPlans.filter(
      (item) =>
        typeof item.paymentPlanDoc !== 'string' && item.paymentType !== ''
    );
    const Paymentype = paymentList.map((e) => ({
      paymentType:
        e.paymentType === 'add_customized' ? e.customizedType : e.paymentType,
      url: e.paymentPlanDoc?.url,
      title: e.paymentPlanDoc?.title,
      contentType: e.paymentPlanDoc?.contentType
    }));
    const payload = {
      payment: Paymentype,
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
  const updateUrl = (result, index) => {
    let file = {
      title: result[0]?.originalFileName || '',
      url: result[0]?.url || '',
      contentType: result[0]?.contentType || ''
    };
    const newPayment = [...paymentPlans];
    const editPlans = newPayment[index];
    editPlans.paymentPlanDoc = file;
    newPayment[index] = editPlans;
    setPaymentPlans(newPayment);
  };
  const handleDelete = (url, name, index) => {
    handleRemoveFromS3(url).then((response) => {
      if (response) {
        const newPayment = [...paymentPlans];
        const editPlans = newPayment[index];
        editPlans.paymentPlanDoc = '';
        newPayment[index] = editPlans;
        setPaymentPlans(newPayment);
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

    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const uploadData = (e, updateUrl, index) => {

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
      updateUrl,
      index

    );
  }


  return (
    <>
      <Box my={1} mx={9}>
        <Grid container spacing={4}>
          {paymentPlans.map((plan, index) => {
            let isMultipleRequired = false;
            return (
              <React.Fragment key={index}>
                <Grid item xs={12} lg={6} xl={6}>
                  <Box mb={2} width="100%">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Payment Type</InputLabel>
                      <Select
                        label="Payment Type"
                        onChange={(event) => {
                          handleChange(event, index);
                        }}
                        value={plan.paymentType}
                        name="paymentType"
                      >
                        {PaymentPlansList.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            <Box ml={1} display="inline-block">
                              {type.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {plan.paymentType === 'add_customized' && (
                    <Box mb={2} width="100%">
                      <TextField
                        id="input"
                        name="customizedType"
                        label="Customized Payment"
                        variant="outlined"
                        fullWidth
                        onChange={(event) => {
                          handleChange(event, index);
                        }}
                        value={plan.customizedType}
                      />
                    </Box>
                  )}
                  <Box key={index}>
                    <UploadFileVerticalNew
                      handleChange={(e) => {
                        // GetURLForUpload(e, updateUrl, index);
                        uploadData(e, updateUrl, index)
                      }}
                      name={
                        paymentPlans[index].paymentPlanDoc === ''
                          ? []
                          : [paymentPlans[index].paymentPlanDoc]
                      }
                      nameNonTitle={`paymentPlanDoc${index + 1}`}
                      handleDelete={handleDelete}
                      indexId={index}
                      title=""
                      isMultipleRequired={isMultipleRequired}
                    />
                  </Box>
                </Grid>
              </React.Fragment>
            );
          })}

          <Grid item xs={12} lg={6} xl={4} sx={{ alignSelf: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                cursor: 'pointer'
              }}
              onClick={handleAdd}
            >
              <AvatarWrapper>
                <AddIcon fontSize="small" />
              </AvatarWrapper>
              <Typography
                ml={1}
                color={theme.palette.primary.main}
                variant="h5"
              >
                {' '}
                Add Another Payment Plan
              </Typography>
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
export default PaymentPlansForm;
