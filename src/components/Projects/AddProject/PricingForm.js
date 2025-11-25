import React, { useState, useEffect } from 'react';
import _ from 'lodash';
// import { compareAsc } from 'date-fns';
import {
  Typography,
  Box,
  TextField,
  Grid,
  FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  Table,
  TableContainer,
  TableCell,
  Button,
  TableRow,
  TableBody,
  CircularProgress,
  useTheme,
  Divider,
} from '@mui/material';
import OpenNotification from 'src/content/ShowNotification';

import { useDispatch } from 'src/store';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import { DatePicker } from '@mui/lab';
import { UploadFileVerticalNew } from 'src/components/Upload/UploadFileVerticalNew';
import { AddProjectField } from '../../../slices/project_forms';
import {

  GetURLForUpload,
  getStatus,
  getAllDocList,
  // handleRemoveFromS3,
  getDocValue,
  GetResultFileArray,
  // UploadFileVertical
} from './Index';

// const currencies = [
//   {
//     value: 'INR',
//     label: 'INR'
//   },
//   {
//     value: '%',
//     label: '%'
//   }
// ];
const OtherChargesList = [
  { label: 'EDC', value: 'edc' },
  { label: 'IDC', value: 'idc' },
  { label: 'PLC', addAnother: true, input: true, value: 'plc' },
  { label: 'IFMD/IFMS', value: 'ifmd' },
  { label: 'Club Membership', value: 'clubMemberShip' },
  { label: 'Car Park', addAnother: true, value: 'carPark' },
  { label: 'Electrical Connection', value: 'electricalConnection' },
  { label: 'Water Connection', value: 'waterConnection' },
  { label: 'Power Backup', value: 'powerBackUp' },
  { label: 'Possession Charges', radio: false, value: 'possessionCharges' }
];
const OtherCharges = ({
  item,
  addAnother = false,
  input = false,
  radio = true,
  handleCharge,
  chargesValue
}) => {
  const theme = useTheme();
  const [AddedRows, setAddedRows] = useState(chargesValue);
  const AddRows = () => {
    const newField = { ...chargesValue[0] };
    Object.keys(newField).forEach(function (key) {
      newField[key] = '';
    });
    setAddedRows([...AddedRows, newField]);
  };
  const isDisable = (chargeObject) => {
    if (Array.isArray(chargeObject)) {
      return false;
    }
    if (chargeObject?.applicable === 'nonApplicable') {
      return true;
    }
    return false;
  };
  const ObjectInputDisable = isDisable(AddedRows);
  const handleCharges = (e, index = 0) => {
    const { name, value } = e.target;
    let object = addAnother ? [...AddedRows] : { ...AddedRows };
    if (name === 'applicable' && value === 'nonApplicable') {
      if (addAnother) {
        let obj = object[index];
        Object.keys(obj).forEach(function (key) {
          obj[key] = '';
        });
      } else {
        Object.keys(object).forEach(function (key) {
          object[key] = '';
        });
      }
    }
    if (addAnother) {
      let obj = object[index];
      obj[name] = value;
      object[index] = obj;
    } else {
      object[name] = value;
    }
    setAddedRows(object);
    handleCharge(object, item.value);
  };

  return (
    <>
      {addAnother &&
        AddedRows.map((rows, index) => {
          let disableInput = isDisable(rows);
          return (
            <TableRow
              hover
              key={index}
              sx={{
                overflow: 'visible',
                position: 'relative',
                p: 2
              }}
            >
              <TableCell>
                {index === 0 && <Typography>{item.label}</Typography>}
                {input && (
                  <>
                    {' '}
                    <Box width="100%">
                      <TextField
                        id={`facing${index}`}
                        name="facing"
                        size="string"
                        variant="outlined"
                        disabled={disableInput}
                        onChange={(e) => {
                          handleCharges(e, index);
                        }}
                        value={AddedRows[index]?.facing}
                      />
                    </Box>
                  </>
                )}
                {index + 1 === AddedRows.length && !disableInput && (
                  <>
                    <Typography
                      color={theme.palette.primary.main}
                      onClick={AddRows}
                      disabled={disableInput}
                      variant="h5"
                    >
                      Add another
                    </Typography>
                  </>
                )}
              </TableCell>
              <TableCell>
                <Box width="100%">
                  <TextField
                    id={`price${index}`}
                    name="price"
                    size="string"
                    variant="outlined"
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          Rs
                        </InputAdornment>
                      )
                    }}
                    disabled={disableInput}
                    onChange={(e) => {
                      handleCharges(e, index);
                    }}
                    value={AddedRows[index]?.price}
                  />
                </Box>
              </TableCell>
              <TableCell>
                {radio && (
                  <>
                    <FormControl sx={{ ml: 2 }} row>
                      <RadioGroup
                        row="true"
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="applicable"
                        value={AddedRows[index]?.applicable}
                        onChange={(e) => {
                          handleCharges(e, index);
                        }}
                      >
                        <FormControlLabel
                          value="basePrice"
                          control={<Radio />}
                          label="Included in Base Price"
                        />

                        <FormControlLabel
                          value="applicable"
                          control={<Radio />}
                          label="As Applicable"
                        />

                        <FormControlLabel
                          value="nonApplicable"
                          control={<Radio />}
                          label="Not Applicable"
                        />
                      </RadioGroup>
                    </FormControl>
                  </>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      {!addAnother && (
        <>
          <TableRow
            hover
            key={item.label}
            sx={{
              overflow: 'visible',
              position: 'relative',
              p: 2
            }}
          >
            <TableCell>
              <Typography>{item.label}</Typography>
            </TableCell>
            <TableCell>
              <Box width="100%">
                <TextField
                  id="price"
                  name="price"
                  size="string"
                  variant="outlined"
                  type="number"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        Rs
                      </InputAdornment>
                    )
                  }}
                  disabled={ObjectInputDisable}
                  onChange={handleCharges}
                  value={AddedRows?.price}
                />
              </Box>
            </TableCell>
            <TableCell>
              {radio && (
                <>
                  <FormControl sx={{ ml: 2 }} row>
                    <RadioGroup
                      row="true"
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="applicable"
                      value={AddedRows?.applicable}
                      onChange={handleCharges}
                    >
                      <FormControlLabel
                        value="basePrice"
                        control={<Radio />}
                        label="Included in Base Price"
                      />

                      <FormControlLabel
                        value="applicable"
                        control={<Radio />}
                        label="As Applicable"
                      />

                      <FormControlLabel
                        value="nonApplicable"
                        control={<Radio />}
                        label="Not Applicable"
                      />
                    </RadioGroup>
                  </FormControl>
                </>
              )}
            </TableCell>
          </TableRow>
        </>
      )}
    </>
  );
};
const initialValues = {
  basePrice: 0,
  gst: 0,
  edc: {
    price: 0,
    applicable: ''
  },
  idc: {
    price: 0,
    applicable: ''
  },
  plc: [
    {
      facing: '',
      price: 0,
      applicable: ''
    }
  ],
  ifmd: {
    price: 0,
    applicable: ''
  },
  clubMemberShip: {
    price: 0,
    applicable: ''
  },
  carPark: [
    {
      price: 0,
      applicable: ''
    }
  ],
  electricalConnection: {
    price: 0,
    applicable: ''
  },
  waterConnection: {
    price: 0,
    applicable: ''
  },
  powerBackUp: {
    price: 0,
    applicable: ''
  },
  possessionCharges: {
    price: 0
  },

  discountType: '',
  price: 0,
  currency: '',
  fromRange: '',
  toRange: ''
};

const PricingForm = ({
  handleNext,
  handleExist,
  FormId,
  prevData,
  projectId,
  isEditing,
  handleCancel,
  handleEditSave
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [priceDetails, setPriceDetails] = useState(initialValues);
  const [pricing, setPricing] = useState({
    pricingplan: ["testdata"],
    addsamplecostingsheet: [],
    runningpromotionaloffer: ["testdata"],
  });
  // const [showDiscount, setShowDiscount] = useState(false);
  const [showOptionalCharge, setShowOptionalCharge] = useState(false);
  const [pricingChangeClicked, setPricingChangeClicked] = useState(false);
  const [remove, setRemove] = useState([]);

  // const discountType = [
  //   { label: 'Inaugural Discount', value: 'new_launch' },
  //   { label: 'Pre-Launch', value: 'pre_launch' },
  //   { label: 'First 20 Bookings', value: 'first_20_bookings' },
  //   { label: 'Add Customized', value: 'add_customized' }
  // ];
  const [isContinueClicked, setIsContinuedClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const getOtherChargesValue = (value) => {
    let object = priceDetails[`${value}`];
    return object;
  };
  // const handleDate = (newValue, name) => {
  //   let value;
  //   if (newValue !== null) {
  //     value = newValue.toISOString();
  //     setPriceDetails({ ...priceDetails, [name]: value });
  //   }
  // };
  const handleAddUnit = (pricingObj) => {
    if (pricingObj?.addsamplecostingsheet.length < 1) {
      setPricingChangeClicked((prev) => !prev);
    } else {
      setPricingChangeClicked(true);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPriceDetails({ ...priceDetails, [name]: value });
  };
  const handleCharges = (value, label) => {
    setPriceDetails({ ...priceDetails, [label]: value });
  };
  const updateUrl = (result) => {
    console.log(pricing, "result", result)
    let files = GetResultFileArray(result);
    const fileType = result[0]?.type;

    const existingFileArr = pricing[fileType] || [];
    const updatedFileArr = [...existingFileArr, ...files];

    // if (Array.isArray(fileArr)) {
    //   Array.prototype.push.apply(fileArr, files);
    // }
    setPricing({
      ...pricing,
      [fileType]: updatedFileArr
    });
  };
  const handleDelete = (url, name, index = 0) => {
    // handleRemoveFromS3(url).then((response) => {
    //   if (response) {
        let arr = [...pricing[`${name}`]];
        const removeData = arr.splice(index, 1)[0];
        setRemove((prev) => [...prev, removeData])
        setPricing({ ...pricing, [`${name}`]: arr });
    //   }
    // });
  };

  const getPreviousData = () => {
    const { projectPricing, documents } = prevData;
    if (!_.isEqual(projectPricing, { carPark: [], plc: [] })) {
      let updatedValues = initialValues;
      Object.keys(projectPricing).forEach(function (key) {
        updatedValues[key] = projectPricing[key];
      });
      setPriceDetails(updatedValues);
    }
    let value = {
      pricingplan: getDocValue('pricingplan', documents),
      addsamplecostingsheet: getDocValue(
        'addsamplecostingsheet',
        documents
      ),
      runningpromotionaloffer: getDocValue(
        'runningpromotionaloffer',
        documents
      )
    };
    setPricing(value);
    handleAddUnit(value);
  };
  useEffect(() => {
    getPreviousData();
  }, []);

  const GetKeyValue = (item) => {
    if (typeof item === 'string') {
      return item !== '' ? item : null;
    }
    if (Array.isArray(item) && item.length !== 0) {
      let filteredArr = item.filter(
        (item) => item.price !== '0' && item.applicable !== ''
      );
      return filteredArr.length !== 0 ? filteredArr : null;
    }

    if (item?.price !== 0 && item?.applicable !== '') {
      return item;
    }
    return null;
  };
  const handleSave = async (isContinueClicked) => {
    setIsContinuedClicked(isContinueClicked);
    setIsSubmitting(true);
    let projectPricing = {};
    Object.keys(priceDetails).forEach(function (key) {
      let keyValue = GetKeyValue(priceDetails[key]);
      if (keyValue !== null) {
        if (key === 'price' || key === 'basePrice' || key === 'gst') {
          projectPricing[key] = Number(keyValue);
        } else {
          projectPricing[key] = keyValue;
        }
      }
    });
    let docFileName = ['pricingplan', 'addsamplecostingsheet', 'runningpromotionaloffer'];
    const docs = getAllDocList(docFileName, pricing);
    const payload = {
      remove,
      projectPricing,
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
      // if (!errorMessage) {
      //   navigate(`/team/${selectedTab}`);
      // }
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

      <Box my={1} sx={{ mx: { xs: 6, md: 7 } }}>
        <Box item xl={12} >
          <Grid item xs={12} lg={6} xl={6} sm={6}>

            <UploadFileVerticalNew
              title="Pricing Plan"
              handleChange={(e) => {
                // GetURLForUpload(e, updateUrl);
                uploadData(e, updateUrl)
              }}
              name={pricing?.pricingplan}
              handleDelete={handleDelete}
              accept="*"
            />
          </Grid>
          {!pricingChangeClicked ? (
            <Box onClick={() => handleAddUnit(pricing)}>
              <Typography mt={2} color={theme.palette.primary.main} variant="h5">
                Add Sample costing sheet
              </Typography>
            </Box>
          ) : (
            <Box mt={2}>
              <Grid item xs={12} lg={6} xl={6} sm={6}>

                <UploadFileVerticalNew
                  title="Add Sample costing sheet"
                  handleChange={(e) => {
                    // GetURLForUpload(e, updateUrl);
                    uploadData(e, updateUrl)
                  }}
                  name={pricing?.addsamplecostingsheet}
                  handleDelete={handleDelete}
                  accept="*"
                />
              </Grid>



            </Box>


          )}
        </Box>

        <Divider sx={{ my: 3 }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            my: 3
          }}
        >
          <Typography>
            For better data analysis, it is recommended to enter price below
            (Optional)
          </Typography>
          <Typography
            sx={{ color: theme.palette.primary.main, cursor: 'pointer', ml: 2 }}
            onClick={() => setShowOptionalCharge((prev) => !prev)}
          >
            {!showOptionalCharge ? 'Show' : 'Hide'}
          </Typography>
        </Box>
        {showOptionalCharge && (
          <>
            <Grid container spacing={3}>
              <Grid xs={7} md={5} item>
                <Box width="100%">
                  <TextField
                    id="basePrice"
                    type="number"
                    name="basePrice"
                    label="Base Price:"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">/sqft</InputAdornment>
                      )
                    }}
                    onChange={handleChange}
                    value={priceDetails.basePrice}
                  />
                </Box>
              </Grid>
              <Grid xs={4} md={2} item>
                <Box width="100%">
                  <TextField
                    id="gst"
                    name="gst"
                    type="number"
                    label="GST:"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">%</InputAdornment>
                      )
                    }}
                    onChange={handleChange}
                    value={priceDetails.gst}
                  />
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                my: 3
              }}
            >
              <Typography variant="h5"> OTHER CHARGES</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableBody>
                  {OtherChargesList.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        <OtherCharges
                          item={item}
                          addAnother={'addAnother' in item}
                          input={'input' in item}
                          radio={!('radio' in item)}
                          index={index}
                          handleCharge={handleCharges}
                          chargesValue={getOtherChargesValue(item.value)}
                        />
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            my: 3
          }}
        > */}
        <Grid item xs={12} lg={6} xl={6} sm={6}>

          <UploadFileVerticalNew
            title="Running Promotional Offer"
            handleChange={(e) => {
              // GetURLForUpload(e, updateUrl);
              uploadData(e, updateUrl)
            }}
            name={pricing.runningpromotionaloffer}
            handleDelete={handleDelete}
            accept="*"
          />
        </Grid>
        {/* <Typography variant="h5" mr={1}>
            Running Promotional Offer
          </Typography> */}

        {/* </Box> */}

        {/* {showDiscount && (
          <>
            <Grid container spacing={3}>
              <Grid xs={6} md={4} item>
                <Box width="100%">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Discount Type</InputLabel>
                    <Select
                      onChange={handleChange}
                      value={priceDetails.discountType}
                      name="discountType"
                    >
                      {discountType.map((discountType) => (
                        <MenuItem
                          key={discountType.value}
                          value={discountType.value}
                        >
                          <Box ml={1} display="inline-block">
                            {discountType.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid xs={6} md={3} item>
                <Grid container columnSpacing={1}>
                  <Grid item xs={8}>
                    <Box width="100%">
                      <TextField
                        id="price"
                        name="price"
                        label="Discount"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={priceDetails.price}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box width="100%">
                      <FormControl fullWidth variant="outlined">
                        <Select
                          onChange={handleChange}
                          value={priceDetails.currency}
                          name="currency"
                        >
                          {currencies.map((currencie) => (
                            <MenuItem
                              key={currencie.value}
                              value={currencie.value}
                            >
                              <Box ml={0.5} display="inline-block">
                                {currencie.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid xs={12} md={5} item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid container columnSpacing={1}>
                    <Grid item xs={5}>
                      <Box width="100%">
                        <DatePicker
                          label="Date Range"
                          id="eventTimeFrom"
                          name="eventTimeFrom"
                          minDate={new Date()}
                          value={new Date(priceDetails.fromRange)}
                          onChange={(newValue) => {
                            if (
                              compareAsc(
                                new Date(priceDetails.fromRange),
                                new Date(priceDetails.toRange)
                              ) === 1
                            ) {
                              handleDate(newValue, 'toRange');
                            }
                            handleDate(newValue, 'fromRange');
                          }}
                          renderInput={(params) => (
                            <TextField fullWidth {...params} />
                          )}
                        />
                      </Box>
                    </Grid>
                    <Grid xs={1} item sx={{ alignSelf: 'center' }}>
                      {' '}
                      <Typography sx={{ justifyContent: 'center' }}>
                        to
                      </Typography>
                    </Grid>
                    <Grid xs={5} item>
                      <Box width="100%">
                        <DatePicker
                          id="eventTimeTo"
                          name="eventTimeTo"
                          minDate={new Date(priceDetails.fromRange)}
                          value={new Date(priceDetails.toRange)}
                          onChange={(newValue) => {
                            handleDate(newValue, 'toRange');
                          }}
                          renderInput={(params) => (
                            <TextField fullWidth {...params} />
                          )}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Typography
              onClick={() => setShowDiscount(false)}
              variant="subtitle1"
              sx={{ cursor: 'pointer', mt: 2 }}
            >
              Stop Discount
            </Typography>{' '}
          </>
        )} */}
      </Box>
      <Box
        my={3}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          columnGap: 2,
          mx: { xs: 6, md: 9 }
        }}
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
export default PricingForm;
