import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Box,
  TextField,
  Grid,
  Divider,
  Typography,
  useTheme,
  Button,
  CircularProgress,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel
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
  handleRemoveFromS3,
  getDocValue,
  getAllDocList,
  GetResultFileArray
} from './Index';

const initialValues = {
  'otherplans(masterplan,basement,landscape.club,etc)': []
};
const docsList = ['master/siteplan', 'otherplans(masterplan,basement,landscape.club,etc)'];
const floorPlansInitial = [
  {
    id: 0,
    url: '',
    title: '',
    contentType: '',
    bhk: '',
    totalNumberOfUnits: '',
    size: '',
    unit: ''
  }
];
// const Tower = ({ handleTowerChange, indexFloor, towerValue }) => {
//   const theme = useTheme();
//   const [tower, setTower] = useState(towerValue); // [{}]
//   const handleAddTower = () => {
//     const newField = { ...towerValue[0] };
//     Object.keys(newField).forEach(function (key) {
//       newField[key] = '';
//     });
//     setTower([...tower, newField]);
//   };
//   const handleChange = (e, index) => {
//     const { name, value } = e.target;
//     let editower = [...tower];
//     let obj = editower[index];
//     obj[name] = value;
//     editower[index] = obj;
//     setTower(editower);
//     handleTowerChange(editower, 'tower', indexFloor);
//   };
//   useEffect(() => {
//     setTower(towerValue);
//   }, [towerValue]);

//   return (
//     <>
//       {tower?.map((item, index) => {
//         return (
//           <React.Fragment key={index}>
//             <Box display="flex">
//               <Box width="100%" mr={2} mb={2}>
//                 <TextField
//                   id={`intower${index}`}
//                   name="intower"
//                   label="In Tower"
//                   variant="outlined"
//                   fullWidth
//                   onChange={(e) => {
//                     handleChange(e, index);
//                   }}
//                   value={item.intower}
//                 />
//               </Box>
//               <Box width="100%" mr={2}>
//                 <TextField
//                   id={`unitNoInTower${index}`}
//                   name="unitNoInTower"
//                   label="Unit number In Tower"
//                   variant="outlined"
//                   fullWidth
//                   onChange={(e) => {
//                     handleChange(e, index);
//                   }}
//                   value={item.unitNoInTower}
//                 />
//               </Box>
//             </Box>
//             {tower.length === index + 1 && (
//               <Box>
//                 <Typography
//                   ml={1}
//                   color={theme.palette.primary.main}
//                   variant="h5"
//                   onClick={() => handleAddTower()}
//                 >
//                   more tower
//                 </Typography>
//               </Box>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </>
//   );
// };
const PlanLayoutForm = ({
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
  const theme = useTheme();
  const [planLayoutDetails, setPlanLayout] = useState(initialValues);
  const [AddFloorPlan, setAddFloorPlan] = useState(floorPlansInitial);
  const [isContinueClicked, setIsContinuedClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [remove, setRemove] = useState([]);

  const getPreviousData = () => {
    const { documents, floorPlanDetails } = prevData;
    const planLayout = {
      'master/siteplan': getDocValue('master/siteplan', documents),
      'otherplans(masterplan,basement,landscape.club,etc)': getDocValue(
        'otherplans(masterplan,basement,landscape.club,etc)',
        documents
      )
    };
    if (!_.isEmpty(floorPlanDetails)) {
      let floorPlan = floorPlanDetails
        .map((item, index) => ({ ...item, id: index }))
        .map((item) => _.omit(item, '_id'));
      setAddFloorPlan(floorPlan);
    }
    setPlanLayout(planLayout);
  };

  useEffect(() => {
    getPreviousData();
  }, []);

  const handleSave = async (isContinueClicked) => {
    setIsContinuedClicked(isContinueClicked);
    setIsSubmitting(true);
    const docs = getAllDocList(docsList, planLayoutDetails);
    console.log("AddFloorPlan", AddFloorPlan);
    const floorPlanDetails = AddFloorPlan.filter(
      (item) =>
        item.bhk !== '' && item.totalNumberOfUnits !== '' && item.url !== ''
    ).map((item) => ({
      url: item.url,
      contentType: item.contentType,
      title: item.title,
      bhk: item.bhk,
      totalNumberOfUnits: item.totalNumberOfUnits,
      unit: item.unit,
      size: item.size
    }));

    const payload = {
      remove,
      documents: docs,
      floorPlanDetails,
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
  const updateUrl = (result) => {
    let files = GetResultFileArray(result);
    let fileArr = [...planLayoutDetails[result[0].type]];
    if (Array.isArray(fileArr)) {
      Array.prototype.push.apply(fileArr, files);
    }
    setPlanLayout({ ...planLayoutDetails, [result[0].type]: fileArr });
  };
  const handleDelete = (url, name, index = 0) => {
    // handleRemoveFromS3(url).then((response) => {
    //   if (response) {
        let arr = [...planLayoutDetails[`${name}`]];
        const removeData = arr.splice(index, 1)[0];
        setRemove((prev) => [...prev, removeData])
        setPlanLayout({ ...planLayoutDetails, [`${name}`]: arr });
    //   }
    // });
  };

  const updateURLFloorPlan = (result, index) => {
    const newPlan = [...AddFloorPlan];
    const editPlans = newPlan[index];
    editPlans.url = result[0]?.url || '';
    editPlans.title = result[0]?.originalFileName || '';
    editPlans.contentType = result[0]?.contentType || '';
    newPlan[index] = editPlans;
    setAddFloorPlan(newPlan);
  };
  const handleFloorDelete = (url, name, index) => {
    let isImageDeleted = handleRemoveFromS3(url);
    if (isImageDeleted) {
      const newPlan = [...AddFloorPlan];
      const editPlans = newPlan[index];
      editPlans.url = '';
      editPlans.title = '';
      editPlans.contentType = '';
      newPlan[index] = editPlans;
      setAddFloorPlan(newPlan);
    }
  };
  // const getTowerValue = (index, value) => {
  //   let object = AddFloorPlan[index][`${value}`];
  //   object = object.map((item) => _.omit(item, '_id'));
  //   return object;
  // };

  const handleAddFloor = (id) => {
    const newPlan = [...AddFloorPlan];
    newPlan.push({
      id,
      url: '',
      title: '',
      contentType: '',
      bhk: '',
      totalNumberOfUnits: '',
      size: '',
      unit: ''
    });
    setAddFloorPlan(newPlan);
  };

  // const handleChange = (e) => {
  //   e.preventDefault();
  //   console.log(e);
  //   const { name, value } = e.target;
  //   setAddFloorPlan({ ...AddFloorPlan, [name]: value });
  // };

  const handleTowerChanges = (e, index) => {
    const { name, value } = e.target;
    const newPlan = [...AddFloorPlan];
    const editPlans = newPlan[index];
    editPlans[name] = value;
    newPlan[index] = editPlans;
    setAddFloorPlan(newPlan);
    console.log(AddFloorPlan);
  };

  const handleValueChange = (e, floorIndex) => {
    const { name, value } = e.target;
    const newPlan = [...AddFloorPlan];
    const editPlans = newPlan[floorIndex];
    editPlans[name] = value;
    newPlan[floorIndex] = editPlans;
    setAddFloorPlan(newPlan);
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
  const uploadDataFloorPlan = (e, updateURLFloorPlan, id) => {

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
      updateURLFloorPlan, id
    );
  }

  return (
    <>
      <Box my={1} mx={9}>
        <Grid container spacing={4}>
          {prevData.projectType !== 'pvtbuilder' &&
            <Grid item xs={12} lg={6} xl={6}>
              <UploadFileVerticalNew
                title="MASTER/SITE PLAN"
                handleChange={(e) => {
                  // GetURLForUpload(e, updateUrl);
                  uploadData(e, updateUrl)
                }}
                name={planLayoutDetails['master/siteplan']}
                handleDelete={handleDelete}
              />
            </Grid>}
          <Grid item xs={12} lg={6} xl={6}>
            <UploadFileVerticalNew
              title="OTHER PLANS (Master Plan, Basement, landscape.Club, etc)"
              handleChange={(e) => {
                // GetURLForUpload(e, updateUrl);
                uploadData(e, updateUrl)
              }}
              name={
                planLayoutDetails['otherplans(masterplan,basement,landscape.club,etc)']
              }
              handleDelete={handleDelete}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={4} mb={2}>
          {AddFloorPlan.length > 0 &&
            AddFloorPlan.map((floorItem, index) => {
              const { id } = floorItem;
              let isMultipleRequired = false;
              return (
                <React.Fragment key={index}>
                  <Grid item xs={12} lg={6} xl={6}>
                    <Box>
                      <UploadFileVerticalNew
                        title={`Plans & Layout ${id + 1}`}
                        handleChange={(e) => {
                          // GetURLForUpload(e, updateURLFloorPlan, id);
                          uploadDataFloorPlan(e, updateURLFloorPlan, id);
                        }}
                        name={[
                          {
                            url: floorItem?.url,
                            title: floorItem?.title,
                            contentType: floorItem?.contentType
                          }
                        ]}
                        handleDelete={handleFloorDelete}
                        indexId={id}
                        isMultipleRequired={isMultipleRequired}
                      />
                    </Box>
                    {AddFloorPlan.length === index + 1 && (
                      <Box
                        sx={{
                          display: { xs: 'none', md: 'flex' },
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          cursor: 'pointer',
                          mt: 2
                        }}
                        onClick={() => handleAddFloor(AddFloorPlan.length)}
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
                          Add more Floor Plans
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} lg={6} xl={6}>
                    <Grid container columnSpacing={4}>
                      <Grid item xs={12} lg={12} xl={6}>
                        <Box sx={{ mt: { xs: 2, md: 4 } }}>
                          <Box width="100%">
                            <TextField
                              id="bhk"
                              name="bhk"
                              label="Eg: Floor Plan, Tower Plan"
                              variant="outlined"
                              fullWidth
                              onChange={(e) => {
                                handleValueChange(e, id);
                              }}
                              value={floorItem?.bhk}
                            />
                          </Box>

                          <Box width="100%" mt={2}>
                            <TextField
                              id="totalNumberOfUnits"
                              name="totalNumberOfUnits"
                              label="Total Number Of Units"
                              variant="outlined"
                              fullWidth
                              onChange={(e) => {
                                handleValueChange(e, id);
                              }}
                              value={floorItem?.totalNumberOfUnits}
                            />
                          </Box>

                          <Box width="100%" mt={2} display='flex'>
                            <Grid item xs={4} sm={6} md={12} lg={4.5}>
                              <Box width="100%">
                                <TextField
                                  id="area"
                                  name="size"
                                  label="Size"
                                  inputProps={{ type: 'number' }}
                                  variant="outlined"
                                  fullWidth
                                  onChange={(e) => {
                                    handleTowerChanges(e, id);
                                  }}
                                  value={floorItem.size}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={8} sm={6} md={12} lg={7.5} ml={2} >
                              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <FormControl sx={{ ml: 1 }}>
                                  <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="unit"
                                    value={floorItem.unit}
                                    onChange={(e) => {
                                      handleTowerChanges(e, id);
                                    }}
                                  >
                                    <FormControlLabel
                                      value="sq.yd"
                                      control={<Radio />}
                                      label="Sq. yd"
                                    />
                                    <Divider
                                      sx={{
                                        mr: 1
                                      }}
                                      orientation="vertical"
                                      flexItem
                                    />
                                    <FormControlLabel
                                      value="sq.mt"
                                      control={<Radio />}
                                      label="Sq. mt"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Box>
                            </Grid>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  {AddFloorPlan.length === index + 1 && (
                    <Box
                      sx={{
                        display: { xs: 'flex', md: 'none' },
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        cursor: 'pointer',
                        mt: 3,
                        ml: 4
                      }}
                      onClick={() => handleAddFloor(AddFloorPlan.length)}
                    >
                      <AvatarWrapper>
                        <AddIcon fontSize="small" />
                      </AvatarWrapper>
                      <Typography
                        ml={1}
                        color={theme.palette.primary.main}
                        variant="h5"
                      >
                        Add more Floor Plans
                      </Typography>
                    </Box>
                  )}
                </React.Fragment>
              );
            })}
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
export default PlanLayoutForm;
