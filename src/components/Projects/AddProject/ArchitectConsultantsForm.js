import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  CircularProgress,
  useTheme,
  Divider
} from '@mui/material';
import ModalWrapper from 'src/UI/ModalWrapper/ModalWrapper';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'src/store';
import { AddProjectField } from '../../../slices/project_forms';
import { AvatarWrapper, getStatus, getDocValue } from './Index';

const AddConsultant = ({
  open,
  setOpen,
  closeAddConsultant,
  saveAddConsultant
}) => {
  const initialvalue = { title: '', input: '' };
  const [addedConsultantDetail, setAddedConsultantDetail] =
    useState(initialvalue);
  const handleConsultantInputs = (e) => {
    const { name, value } = e.target;
    setAddedConsultantDetail({ ...addedConsultantDetail, [name]: value });
  };
  return (
    <>
      <ModalWrapper
        open={open}
        handleClose={setOpen}
        title="Add Consultant"
        closeModal={closeAddConsultant}
      >
        <Divider />
        <Box pt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box width="100%">
                <TextField
                  id="title"
                  name="title"
                  label="Consultants Title"
                  variant="outlined"
                  fullWidth
                  onChange={handleConsultantInputs}
                  value={addedConsultantDetail.title}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box width="100%">
                <TextField
                  id="input"
                  name="input"
                  label="Consultants detail"
                  variant="outlined"
                  fullWidth
                  onChange={handleConsultantInputs}
                  value={addedConsultantDetail.input}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItem: 'center',
            mt: 2
          }}
        >
          <Box>
            <Button
              variant="contained"
              sx={{
                mx: 1
              }}
              color="secondary"
              onClick={closeAddConsultant}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                saveAddConsultant(addedConsultantDetail);
                setAddedConsultantDetail(initialvalue);
              }}
              variant="contained"
              sx={{
                mx: 1
              }}
              disabled={
                addedConsultantDetail.input === '' ||
                addedConsultantDetail.title === ''
              }
              color="primary"
            >
              Save
            </Button>
          </Box>
        </Box>
      </ModalWrapper>
    </>
  );
};
const initialValues = {
  architect: [
    {
      name: '',
      about: '',
      link: ''
    }
  ],

  consultants: [
    {
      title: 'environmentalConsultants',
      value: ''
    },
    {
      title: 'landscapingConsultants',
      value: ''
    },
    {
      title: 'horticultureConsultants',
      value: ''
    },
    {
      title: 'vastuConsultants',
      value: ''
    }
  ],
  consultantsUrl: []
};
const ConsultantList = [
  { label: 'Environmental Consultants', value: 'environmentalConsultants' },
  { label: 'Landscaping Consultants', value: 'landscapingConsultants' },
  { label: 'Horticulture Consultants', value: 'horticultureConsultants' },
  { label: 'Vastu Consultants', value: 'vastuConsultants' }
];
const ArchitectConsultantsForm = ({
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
  const [architectConsultantsDetails, setArchitectConsultantsDetails] =
    useState(initialValues);

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [isContinueClicked, setIsContinuedClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const getPreviousData = () => {
    const { architect, consultants, documents } = prevData;
    const file = getDocValue('consultantsUrl', documents);
    const value = {
      architect: architect.length === 0 ? initialValues.architect : architect,
      consultants:
        consultants.length === 0 ? initialValues.consultants : consultants,
      consultantsUrl: file
    };
    setArchitectConsultantsDetails(value);
  };

  useEffect(() => {
    getPreviousData();
  }, []);
  const handleSave = async (isContinueClicked) => {
    setIsContinuedClicked(isContinueClicked);
    setIsSubmitting(true);
    const { architect, consultants, consultantsUrl } =
      architectConsultantsDetails;
    const payload = {
      architect,
      consultants,
      documents: consultantsUrl?.length > 0 ? consultantsUrl : [],
      status: isEditing ? 'PUBLISHED' : getStatus(FormId),
      step: isEditing ? 8 : FormId
    };
    await dispatch(AddProjectField(projectId, payload, isContinueClicked));

    if (!isContinueClicked) {
      handleExist();
      if (isEditing) {
        handleEditSave(projectId);
        return;
      }
    } else {
      handleNext();
    }
    setIsSubmitting(false);
  };
  const openAddConsultant = () => {
    setOpen(true);
  };

  const closeAddConsultant = () => {
    setOpen(false);
  };
  const saveAddConsultant = (addedConsultantDetail) => {
    const label = 'consultants';
    const { title, input } = addedConsultantDetail;
    let addToConsultantList = {
      label: `${title[0].toUpperCase() + title.substring(1)} Consultants`,
      value: `${title.toLowerCase()}Consultants`
    };
    ConsultantList.push(addToConsultantList);
    let AddConsultant = {
      title: `${title.toLowerCase()}Consultants`,
      value: input
    };
    const object = getValue(label);
    object.push(AddConsultant);
    setArchitectConsultantsDetails({
      ...architectConsultantsDetails,
      [label]: object
    });

    setOpen(false);
  };
  const getValue = (value) => {
    let object = architectConsultantsDetails[`${value}`];
    return object;
  };
  const handleChange = (e, label, index = 0) => {
    const object1 = [...getValue(label)];
    const { name, value } = e.target;
    let obj = { ...object1[index] };
    if (label === 'consultants') {
      obj.title = name;
      obj.value = value;
    } else {
      obj[`${name}`] = value;
    }
    object1[index] = obj;
    setArchitectConsultantsDetails({
      ...architectConsultantsDetails,
      [label]: object1
    });
  };

  return (
    <>
      <Box my={1} mx={9}>
        <Grid container columnSpacing={8} rowSpacing={4}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box width="100%">
                  <TextField
                    id="name"
                    name="name"
                    label="Architect Name"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      handleChange(e, 'architect');
                    }}
                    value={architectConsultantsDetails.architect[0]?.name}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box width="100%">
                  <TextField
                    id="link"
                    name="link"
                    label="Architect Website Link"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      handleChange(e, 'architect');
                    }}
                    value={architectConsultantsDetails.architect[0]?.link}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box width="100%">
              <TextField
                id="about"
                name="about"
                label="About Architect"
                variant="outlined"
                fullWidth
                multiline
                rows={5}
                onChange={(e) => {
                  handleChange(e, 'architect');
                }}
                value={architectConsultantsDetails.architect[0]?.about}
              />
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Box mt={3}>
          <Grid container columnSpacing={8} rowSpacing={4}>
            {ConsultantList.map((item, index) => {
              return (
                <Grid item xs={12} md={6} key={index}>
                  <Box width="100%">
                    <TextField
                      id={`${item.value}-${index}`}
                      name={item.value}
                      label={item.label}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => {
                        handleChange(e, 'consultants', index);
                      }}
                      value={
                        architectConsultantsDetails.consultants[index]?.value
                      }
                    />
                  </Box>
                </Grid>
              );
            })}

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  cursor: 'pointer'
                }}
                onClick={openAddConsultant}
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
                  Add more Consultants
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <AddConsultant
        open={open}
        setOpen={setOpen}
        closeAddConsultant={closeAddConsultant}
        saveAddConsultant={saveAddConsultant}
      />
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
    </>
  );
};
export default ArchitectConsultantsForm;
