import React, { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
// import { withScriptjs } from 'react-google-maps';
import _ from 'lodash';
import {
  Button,
  Box,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
  CardMedia,
  FormHelperText,
  useTheme,
  Divider
} from '@mui/material';
import OpenNotification from 'src/content/ShowNotification';

// import { GetUploadFileUrl, getAPiBase64 } from 'src/axiosInstances/Api';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import { useDispatch } from 'src/store';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker } from '@mui/lab';
import { setProjectType } from 'src/slices/ProjectList';
import { UploadFileVerticalNew } from 'src/components/Upload/UploadFileVerticalNew';
import Loader from 'src/UI/Loader/Loader.js';
import { createProject, AddProjectField } from '../../../slices/project_forms';
// import GeoMap from '../geoMap';

import {
  // UploadFileVertical,
  UploadFileHorizontal,
  Input,
  GetURLForUpload,
  UploadFileInput,
  getStatus,
  getDocValue,
  handleRemoveFromS3,
  getAllDocList,
  GetResultFileArray,
  browseButton,
  UploadVideo,
  // getBase64
} from './Index';


import { ImageComponent } from './ProjectMediaForm';
import { PUBLISHED_TABS, ProjectStatus } from '../constants';

// import { addTeams } from '../../../slices/team';
// import { GoogleMap } from '../geoMap';


// const USERDATA = JSON.parse(window.localStorage.getItem('user'));
const InitialRERAValue = [
  {
    contentType: '',
    formType: '',
    url: '',
    title: '',
    reraValue: ''
  }
];

const InitialPhase = [];

const InitialValue = {
  name: '',
  projectStatus: '',
  logo: '',
  area: '',
  unit: 'acres',
  phase: '',
  projectType: '',
  subType: '',
  totalNumberOfUnits: '',
  relationManager: [],
  uploadprojectmap: [],
  uploadprojectbrochure: [],
  'uploadsales/companypresentation': [],
  location: [],
  address: '',
  completionDate: '',
  projectteaservideos: [''],
  projectteaserimages: []
};
const errorValues = {
  projectType: false,
  logo: false,
  reraNumber: false,
  area: false,
  index: null
};
let docFIleName = [
  'uploadreracertificate',
  'uploadprojectmap',
  'uploadprojectbrochure',
  'uploadsales/companypresentation'
];

export const ProfileImageComponent = ({ src, alt, handleRemove }) => {
  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          sx={{
            display: 'block',
            height: 'auto',
            maxHeight: '150px',
            width: '150px',
            maxWidth: '150px',
            border: '1px solid #E3EAF5',
            borderRadius: 'inherit',
            zIndex: 5,
            ml: 2
          }}
          image={src}
          alt={alt !== '' ? alt : '...'}
        />

        <button
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'block',
            width: '20px',
            height: '22px',
            border: 'none',
            borderRadius: '4px',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'red',
            cursor: 'pointer',
            padding: 0,
            fontSize: '22px'
          }}
          type="button"
          onClick={() => {
            handleRemove(src);
          }}
        >
          &times;
        </button>
      </Box>
    </>
  );
};
const BasicInfoForm = ({
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
  const [loading, setLoading] = useState(false);
  const [basicFormDetail, setBasicFormDetail] = useState(InitialValue);
  const [addRERA, setAddRERA] = useState(InitialRERAValue);
  const [phase, setPhase] = useState(InitialPhase);
  const [emptyIndex, setEmptyIndex] = useState('');
  const [remove, setRemove] = useState([]);

  const [formError, setFormError] = useState(errorValues);
  const [indexImages, setIndexImages] = useState(-1);
  const userData = JSON.parse(window.localStorage.getItem('user'));
  const isValid = () => {
    const { name, reraNumber, projectType } = basicFormDetail;
    if (currentProjectStatus === 'upcomingLaunch') {
      if (name !== '' && projectType !== '') {
        return true;
      }
      return false;
    }
    if (name !== '' && reraNumber !== '' && projectType !== '') {
      return true;
    }
    return false;
  };

  const isValidSaveExit = () => {
    const { name } = basicFormDetail;
    if (name !== '') {
      return true;
    }
    return false;
  };

  const imageArrayName = ['projectteaservideos', 'projectteaserimages'];

  const getName = (imageFileName) => {
    let name = imageArrayName.filter((item) => imageFileName.includes(item));
    return name[0];
  };
  const getMultipleImagesUpload = (resultArray) => {
    return resultArray.map((result) => result.url);
  };
  const updateURlImages = (result) => {
    let name = getName(result[0].type);
    const ImagesArray = [...basicFormDetail[`${name}`]];
    let ImageUrls = getMultipleImagesUpload(result);
    Array.prototype.push.apply(ImagesArray, ImageUrls);
    setBasicFormDetail({ ...basicFormDetail, [`${name}`]: ImagesArray });
    setLoading(false);
  };
  const handleImageDelete = (name, url, indexImages, setIndex) => {
    handleRemoveFromS3(url).then((response) => {
      if (response) {
        const ImagesArray = [...basicFormDetail[`${name}`]];
        ImagesArray.splice(indexImages, 1);
        setIndex(ImagesArray.length - 1);

        setBasicFormDetail({ ...basicFormDetail, [`${name}`]: ImagesArray });
      }
    });
  };
  const getVideoArray = (name, arrayList) => {
    let videoArr = arrayList
      .filter((item) => item.formType === name)
      .map((item) => item.link);
    if (videoArr.length === 0) {
      return [''];
    }
    return videoArr;
  };
  const getImageArray = (name, arrayList) => {
    let imgArr = arrayList
      .filter((item) => item?.title === name)
      .map((item) => item?.url);
    if (name === 'projectteaserimages') {
      setIndexImages(imgArr.length - 1);
    }
    return imgArr;
  };
  const getPreviousData = (prevData) => {
    let {
      name,
      address,
      reraNumber,
      area,
      logo,
      phase,
      totalNumberOfUnits,
      completionDate,
      projectType,
      projectStatus,
      projectSubType,
      location,
      documents,
      productTeaser,
      images
    } = prevData;
    const value = {
      name,
      projectStatus,
      logo,
      area: area.value,
      unit: area.unit,
      projectType,
      phase,
      subType: projectSubType,
      totalNumberOfUnits,
      uploadreracertificate: getDocValue('uploadreracertificate', documents),
      uploadprojectmap: getDocValue('uploadprojectmap', documents),
      uploadprojectbrochure: getDocValue('uploadprojectbrochure', documents),
      'uploadsales/companypresentation': getDocValue(
        'uploadsales/companypresentation',
        documents
      ),
      location,
      address,
      completionDate: new Date(completionDate),
      projectteaservideos: getVideoArray(
        'projectteaservideos',
        productTeaser
      ) || [''],
      projectteaserimages: getImageArray('projectteaserimages', images)
    };
    setPhase(phase)
    setAddRERA(reraNumber?.length > 0 ? reraNumber : InitialRERAValue);
    setCurrentProjectType(projectType);
    setCurrentProjectStatus(projectStatus);
    setBasicFormDetail(value);
  };
  useEffect(() => {
    if (projectId !== '') {
      getPreviousData(prevData);
    } else {
      setBasicFormDetail({
        ...basicFormDetail,
        projectStatus: ProjectStatus[0].value
      });
    }
    // dispatch(addTeams(USERDATA.builderCompany[0]));
  }, []);

  // let teams = [];
  let locationCords = [];
  // teams = useSelector((state) => state.team.data);
  locationCords = useSelector((state) => state.project.coords);
  // useEffect(() => { }, [teams]);

  useEffect(() => {
    dispatch(setProjectType(basicFormDetail.projectType));
  }, [basicFormDetail.projectType]);

  const updateSingleUrl = (result) => {
    let file = [
      {
        title: result[0]?.originalFileName || '',
        url: result[0]?.url || '',
        contentType: result[0]?.contentType || '',
        formType: result[0]?.type || ''
      }
    ];
    setBasicFormDetail({
      ...basicFormDetail,
      [result[0].type]: file
    });
  };
  const updateUrl = (result) => {
    let files = GetResultFileArray(result);
    let fileArr = [...basicFormDetail[result[0].type]];
    if (Array.isArray(fileArr)) {
      Array.prototype.push.apply(fileArr, files);
    }
    setBasicFormDetail({
      ...basicFormDetail,
      [result[0].type]: fileArr
    });
  };
  const handleSingleDelete = (url, name) => {
    handleRemoveFromS3(url).then((response) => {
      if (response) {
        setBasicFormDetail({
          ...basicFormDetail,
          [`${name}`]: []
        });
      }
    });
  };



  const handleDelete = (url, name, index = 0) => {
    // handleRemoveFromS3(url).then((response) => {
    //   if (response) {
    let arr = [...basicFormDetail[`${name}`]];
    const removeData = arr.splice(index, 1)[0];
    setRemove((prev) => [...prev, removeData])
    setBasicFormDetail({ ...basicFormDetail, [`${name}`]: arr });
    // }
    // });
  };

  const handleLogoDelete = (url) => {
    handleRemoveFromS3(url).then((response) => {
      if (response) {
        setBasicFormDetail({ ...basicFormDetail, logo: '' });
      }
    });
  };
  const handleLogoUpload = (result) => {
    if (result[0]?.url) {
      setFormError((formError) => ({ ...formError, logo: false }));
    }
    setBasicFormDetail({ ...basicFormDetail, logo: result[0]?.url });
  };
  const getSubType = (currentType) => {
    return PUBLISHED_TABS.filter((type) => type.value === currentType);
  };
  const [currentProjectType, setCurrentProjectType] = useState();
  const currentProjectSubType = getSubType(currentProjectType);
  const [currentProjectStatus, setCurrentProjectStatus] = useState(
    ProjectStatus[0].value
  );
  const [isContinueClicked, setIsContinuedClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [progress,setProgress] = useState(0);

  const geteDate = (date) => {
    if (date === '' || date === null) {
      return new Date().toISOString();
    }
    return date.toISOString();
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    // console.log("name", name, "value", value);
    if (name === 'relationManager') {
      setBasicFormDetail({
        ...basicFormDetail,
        [name]: typeof value === 'string' ? [value.split(',')] : [value]
      });
    } else {
      setBasicFormDetail({ ...basicFormDetail, [name]: value });
    }
  };
  const handleReraDelete = (url, reraIndex) => {
    handleRemoveFromS3(url).then((response) => {
      if (response) {
        const newRERA = [...addRERA];
        const editRERA = { ...newRERA[reraIndex] };
        editRERA.contentType = '';
        editRERA.formType = '';
        editRERA.title = '';
        editRERA.url = '';
        newRERA[reraIndex] = editRERA;
        setAddRERA(newRERA);
      }
    });
  };



  const uploadRERACertificate = (result, reraIndex) => {
    console.log({ result, reraIndex })
    console.log({ addRERA })
    const newRERA = [...addRERA];
    const editRERA = { ...newRERA[reraIndex] };
    editRERA.contentType = result[0]?.contentType;
    editRERA.formType = result[0]?.type;
    editRERA.title = result[0]?.originalFileName;
    editRERA.url = result[0]?.url;
    newRERA[reraIndex] = editRERA;
    setAddRERA(newRERA);
  };
  const handleRERAValuechange = (e, reraIndex) => {
    const { value } = e.target;
    const newRERA = [...addRERA];

    const editRERA = { ...newRERA[reraIndex] };
    editRERA.reraValue = value;
    newRERA[reraIndex] = editRERA;
    setAddRERA(newRERA);
  };
  const handleAddRERA = (id) => {
    const newRERA = [...addRERA];
    newRERA.push({
      id,
      contentType: '',
      formType: '',
      url: '',
      title: '',
      reraValue: ''
    });
    setAddRERA(newRERA);
  };

  const handleAddPhase = (e, index) => {

    e.preventDefault();
    const { name, value } = e.target;

    const newPhase = [...phase];
    newPhase[index] = {
      ...newPhase[index],
      [name]: value
    };
    setPhase(newPhase);
  };

  const handlePhase = () => {
    const newPhase = [...phase];
    newPhase.push({
      value: '',
      unit: '',
      noofunit: ''
    })
    setPhase(newPhase)
  }

  const handleRemovePhase = (index) => {
    const newPhase = [...phase];
    newPhase.splice(index, 1);
    setPhase(newPhase);
  };

  const handleRemoveRERA = (reraIndex) => {
    const newRERA = [...addRERA];
    if (newRERA[reraIndex]?.url) {
      handleRemoveFromS3(newRERA[reraIndex]?.url);
    }
    newRERA.splice(reraIndex, 1);
    setAddRERA(newRERA);
  }
  const handleVideo = (name, videoArray) => {
    setBasicFormDetail({ ...basicFormDetail, [name]: videoArray });
  };
  const getRERAValid = () => {
    let isRERANotValide;
    if (addRERA.length > 0) {
      isRERANotValide = addRERA.filter(
        (item) => item.url.trim() === '' || item.reraValue.trim() === ''
      );
    }
    return isRERANotValide.length > 0;
  };

  const totalofValue = () => {

    const sumValue = phase.reduce((accumulator, item) => accumulator + Number(item.value), 0);
    const sumNoOfUnits = phase.reduce((accumulator, item) => accumulator + Number(item.noofunit), 0);
    const hasInvalidUnit = phase.every(item => item.unit === "acres" || item.unit === "sq.mt");

    let empty = true
    phase.forEach((item, index) => {
      if (!item.value || !item.noofunit || !item.unit) {
        setEmptyIndex(index);
        empty = false;
      }
    });

    if (sumValue <= basicFormDetail.area && sumNoOfUnits <= basicFormDetail.totalNumberOfUnits && hasInvalidUnit && empty) {
      return true;
    }
    return false;
  }

  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSave = async (isContinueClicked) => {
    // console.log("FormId",currentProjectType);
    if (currentProjectStatus !== 'upcomingLaunch') {
      if (getRERAValid() && currentProjectType !== 'pvtbuilder') {
        setFormError((formError) => ({ ...formError, reraNumber: true }));
        scrollToElement('name')
      } else if (!getRERAValid()) {
        setFormError((formError) => ({ ...formError, reraNumber: false }));
        scrollToElement('name')
      }
      if (!basicFormDetail.projectType) {
        setFormError((formError) => ({ ...formError, projectType: true }));
        scrollToElement('name')
      }
      if (!totalofValue()) {
        setFormError((formError) => ({ ...formError, area: true }));
        scrollToElement('area')
        return;
      }
      if (!basicFormDetail.logo && currentProjectType !== 'pvtbuilder') {
        setFormError((formError) => ({ ...formError, logo: true }));
        scrollToElement('upload-logo-button');
      }
      if (currentProjectType !== 'pvtbuilder') {
        if (
          getRERAValid() ||
          !basicFormDetail.projectType ||
          !basicFormDetail.logo
        ) {
          return;
        }
      }
    }

    setIsSubmitting(true);
    setIsContinuedClicked(isContinueClicked);

    const docs = getAllDocList(docFIleName, basicFormDetail);
    const ProjectArea = {
      value: Number(basicFormDetail.area),
      unit: basicFormDetail.unit
    };
    const projectTeaserImagesArray = basicFormDetail.projectteaserimages.map(
      (item) => ({ url: item, title: 'projectimages', isProfile: false })
    );
    const projectteaservideos = basicFormDetail.projectteaservideos
      .filter((item) => item !== '')
      .map((item) => ({ link: item, formType: 'projectteaservideos' }));

    basicFormDetail.phase = phase

    const payload = {
      name: basicFormDetail.name,
      address: basicFormDetail.address,
      logo: basicFormDetail?.logo,
      reraNumber: addRERA,
      area: ProjectArea,
      phase,
      totalNumberOfUnits: Number(basicFormDetail.totalNumberOfUnits),
      location: locationCords,
      completionDate: geteDate(basicFormDetail.completionDate),
      documents: docs,
      projectType: basicFormDetail.projectType
        ? basicFormDetail.projectType
        : undefined,
      projectStatus: basicFormDetail.projectStatus
        ? basicFormDetail.projectStatus
        : undefined,
      projectSubType: basicFormDetail.subType
        ? basicFormDetail.subType
        : undefined,
      status: isEditing
        ? 'PUBLISHED'
        : getStatus(FormId, basicFormDetail.projectStatus),
      step: isEditing ? 8 : FormId,
      builderCompany: userData.builderCompany[0],
      productTeaser: projectteaservideos || [],
      images: projectTeaserImagesArray,
      remove
    };
    if (projectId !== '' || isEditing) {
      await dispatch(AddProjectField(projectId, payload, isContinueClicked));
    } else {
      await dispatch(createProject(payload));
    }
    if (isContinueClicked) {
      if (currentProjectStatus === 'upcomingLaunch') {
        handleExist();
      } else {
        handleNext();
      }
    } else {
      if (isEditing) {
        handleEditSave(projectId);
        return;
      }
      handleExist();
    }
    setIsSubmitting(false);
  };
  // const MapLoader = withScriptjs(GeoMap);

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

  // useEffect(() => {
  //   console.log(typeof progress);

  //   if (progress === 100) {
  //     setTimeout(() => {
  //       const a = 0;
  //       setProgress(a);
  //     }, 2000);
  //   }
  // }, [progress]);


  const uploadCertificate = (e, g, index) => {

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
      uploadRERACertificate,
      // updateProgress,
      index,

    );


    console.log({ index })







  }
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
      updateUrl,
      // updateProgress

    );
  }

  // const updateProgress = (progress) => {
  //   setProgress(progress);

  // };
  const uploadHorizontal = (e, updateURlImages) => {

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
      e, updateURlImages

    );
  }

  console.log("basicFormDetailbasicFormDetail", basicFormDetail)

  return (
    <>
      <Box autoComplete="off" my={1} sx={{ mx: { xs: 4 } }}>
        <Grid container columnSpacing={4} rowSpacing={4}>
          <Grid item xs={12} md={6}>
            <Box width="100%">
              <TextField
                id="name"
                name="name"
                required
                label="Project Name "
                variant="outlined"
                fullWidth
                onChange={handleChange}
                value={basicFormDetail.name}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box width="100%">
              <FormControl fullWidth variant="outlined">
                <InputLabel>Current Project Status</InputLabel>
                <Select
                  label="Current Project Status"
                  onChange={(event) => {
                    setCurrentProjectStatus(event.target.value);
                    handleChange(event);
                  }}
                  value={basicFormDetail.projectStatus}
                  name="projectStatus"
                >
                  {ProjectStatus.map((projectStatus) => (
                    <MenuItem
                      key={projectStatus.value}
                      value={projectStatus.value}
                    >
                      <Box ml={1} display="inline-block">
                        {projectStatus.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />

        {currentProjectStatus === 'upcomingLaunch' ? (
          <>
            <Grid container columnSpacing={4} rowSpacing={4}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container columnSpacing={1}>
                      <Grid
                        item
                        xs={
                          currentProjectSubType[0]?.subType?.length > 0 ? 6 : 12
                        }
                      >
                        <Box width="100%">
                          <FormControl fullWidth variant="outlined" required>
                            <InputLabel>Project Type </InputLabel>
                            <Select
                              label="projectType"
                              onChange={(event) => {
                                if (event.target.value !== '') {
                                  setFormError((formError) => ({
                                    ...formError,
                                    projectType: false
                                  }));
                                }
                                setCurrentProjectType(event.target.value);
                                handleChange(event);
                              }}
                              value={basicFormDetail.projectType}
                              name="projectType"
                            >
                              {PUBLISHED_TABS.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  <Box ml={2} display="inline-block">
                                    {type.label}
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                            {formError.projectType && (
                              <FormHelperText error="true">
                                This Field is required
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Box>
                      </Grid>
                      {/* {currentProjectSubType[0]?.subType?.length > 0 && (
                        <>
                          <Grid item xs={6}>
                            <Box width="100%">
                              <FormControl fullWidth variant="outlined">
                                <InputLabel> Sub-Type </InputLabel>
                                <Select
                                  label="projectType"
                                  onChange={handleChange}
                                  value={basicFormDetail.subType}
                                  name="subType"
                                >
                                  {currentProjectSubType[0].subType.map(
                                    (type) => (
                                      <MenuItem
                                        key={type.value}
                                        value={type.value}
                                      >
                                        <Box ml={1} display="inline-block">
                                          {type.label}
                                        </Box>
                                      </MenuItem>
                                    )
                                  )}
                                </Select>
                                {formError.projectType && (
                                  <FormHelperText error="true">
                                    This Field is required
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Box>
                          </Grid>
                        </>
                      )} */}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Box width="100%">
                      <TextField
                        id="uploadprojectmap"
                        name="uploadprojectmap"
                        label="Upload Project Map"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Box
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row'
                                }}
                              >
                                {basicFormDetail.uploadprojectmap[0]?.title !==
                                  '' &&
                                  !_.isEmpty(
                                    basicFormDetail.uploadprojectmap
                                  ) && (
                                    <Box p={1}>
                                      <button
                                        style={{
                                          display: 'block',
                                          width: '20px',
                                          border: 'none',
                                          borderRadius: '4px',
                                          background: 'rgba(0, 0, 0, 0.5)',
                                          color: 'red',
                                          cursor: 'pointer',
                                          padding: 0,
                                          fontSize: '17px',
                                          marginRigth: '10px'
                                        }}
                                        type="button"
                                        onClick={() => {
                                          handleSingleDelete(
                                            basicFormDetail.uploadprojectmap[0]
                                              ?.url,
                                            'uploadprojectmap'
                                          );
                                        }}
                                        id="delete-uploadprojectmap"
                                      >
                                        &times;
                                      </button>
                                    </Box>
                                  )}

                                <UploadFileInput
                                  inputName="uploadprojectmap"
                                  updateUrl={updateSingleUrl}
                                  fileName={
                                    _.isEmpty(basicFormDetail.uploadprojectmap)
                                      ? ''
                                      : basicFormDetail.uploadprojectmap[0]
                                        ?.title
                                  }
                                />
                              </Box>
                            </InputAdornment>
                          )
                        }}
                        value={
                          _.isEmpty(basicFormDetail.uploadprojectmap)
                            ? ''
                            : basicFormDetail.uploadprojectmap[0]?.title
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box width="100%">
                  <TextField
                    id="address"
                    name="address"
                    label="Street Address"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={5}
                    onChange={handleChange}
                    value={basicFormDetail.address}
                  />
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography>UPLOAD PRODUCT TEASER IMAGES</Typography>
              {!loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    columnGap: 2,
                    rowGap: 2,
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  {basicFormDetail?.projectteaserimages.length > 0 &&
                    basicFormDetail?.projectteaserimages.map((item, index) => {
                      return (
                        <ImageComponent
                          src={item}
                          index={index}
                          name="projectteaserimages"
                          alt="Project Teaser Images"
                          setIndex={setIndexImages}
                          handleRemove={handleImageDelete}
                        />
                      );
                    })}
                </Box>
              ) : (
                <Box sx={{ p: 5 }}>
                  <Loader />
                </Box>
              )}
              <UploadFileHorizontal
                nameNonTitle="projectteaserimages"
                setIndex={setIndexImages}
                indexId={indexImages}
                title=""
                handleChange={(e) => {
                  // GetURLForUpload(e, updateURlImages);
                  uploadHorizontal(e, updateURlImages);
                }}
                name=""
                setLoading={setLoading}
              />
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box>
              <UploadVideo
                title="PROJECT TEASER VIDEOS"
                handleChange={handleVideo}
                videos={basicFormDetail?.projectteaservideos || ['']}
              />
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center'
              }}
            >
              <Typography mr={2}>Upload Project Logo *</Typography>
              {basicFormDetail?.logo === '' && (
                <>
                  <label htmlFor="contained-logo-file" id="upload-logo-button">
                    <Input
                      accept="image/*"
                      id="contained-logo-file"
                      // multiple
                      onChange={(e) => {
                        // GetURLForUpload(e, handleLogoUpload);
                        uploadData(e, handleLogoUpload)
                      }}
                      disabled={basicFormDetail?.logo !== ''}
                      name="logo"
                      type="file"
                    />
                    <Button
                      variant="contained"
                      component="span"
                      disabled={basicFormDetail?.logo !== ''}
                      sx={browseButton}
                      startIcon={
                        <img
                          src="/static/images/logo/projectIcons/browse-file-icon.svg"
                          alt=""
                          style={{ width: 27, height: 27 }}
                        />
                      }
                    >
                      Browse file
                    </Button>
                  </label>
                </>
              )}
              {basicFormDetail?.logo !== '' &&
                basicFormDetail?.logo !== undefined &&
                basicFormDetail?.logo !== null && (
                  <ProfileImageComponent
                    src={basicFormDetail?.logo}
                    alt="profile Image"
                    handleRemove={handleLogoDelete}
                  />
                )}
            </Box>
            {formError.logo && (
              <FormHelperText error="true" sx={{ mx: 0 }}>
                This field is required
              </FormHelperText>
            )}
          </>
        ) : (
          <>
            <Grid container columnSpacing={4} rowSpacing={4}>
              <Grid item xs={12} md={6}>
                <>
                  {addRERA.length > 0 &&
                    addRERA.map((item, index) => {
                      return (
                        basicFormDetail.projectType === "pvtbuilder" ?
                          <React.Fragment key={index}>
                            <Box width="100%" mb={2}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                  id={`reraNumber-input${index}`}
                                  name="reraNumber"
                                  label="RERA Number "
                                  variant="outlined"
                                  fullWidth
                                  onChange={(e) => {
                                    handleRERAValuechange(e, index);
                                  }}
                                  value={item.reraValue}
                                  error={formError.reraNumber}
                                  helperText={
                                    formError.reraNumber
                                      ? 'This field is required'
                                      : ''
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <Box
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            marginRight: "-14px"
                                          }}
                                        >
                                          {item?.title !== '' && (
                                            <Box
                                              py={1}
                                              px={1.5}
                                              sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                columnGap: 1,
                                                background: '#eeeeee',
                                                borderRadius: '10px'
                                              }}
                                            >
                                              <Typography
                                                sx={{
                                                  overflow: 'hidden',
                                                  whiteSpace: 'nowrap',
                                                  textOverflow: 'ellipsis',
                                                  maxWidth: {
                                                    xs: '200px',
                                                    md: '150px',
                                                    xl: '200px'
                                                  }
                                                }}
                                              >
                                                {item?.title}
                                              </Typography>
                                              <button
                                                style={{
                                                  display: 'block',
                                                  width: '20px',
                                                  border: 'none',
                                                  borderRadius: '4px',
                                                  color: 'red',
                                                  cursor: 'pointer',
                                                  padding: 0,
                                                  fontSize: '19px',
                                                  marginRigth: '10px'
                                                }}
                                                type="button"
                                                onClick={() => {
                                                  handleReraDelete(
                                                    item?.url,
                                                    index
                                                  );
                                                }}
                                                id="delete-uploadprojectmap"
                                              >
                                                &times;
                                              </button>
                                            </Box>
                                          )}
                                          {item?.title === '' && (
                                            <>
                                              <label
                                                htmlFor={`contained-button-file-RERA-${index}`}
                                                id={`upload-button-Rera-${index}`}
                                              >
                                                <Input
                                                  accept="image/* pdf/*"
                                                  id={`contained-button-file-RERA-${index}`}
                                                  onChange={(e) => {
                                                    // GetURLForUpload(
                                                    //   e,
                                                    //   uploadRERACertificate,
                                                    //   index
                                                    // );
                                                    uploadCertificate(e, uploadRERACertificate, index)
                                                    console.log({ index })
                                                  }}
                                                  disabled={item?.title !== ''}
                                                  name="RERAUpload"
                                                  type="file"
                                                />
                                                <Button
                                                  variant="outlined"
                                                  component="span"
                                                  sx={{
                                                    background: '#eeeeee',
                                                    border: 1,
                                                    borderRadius: '10px',
                                                    borderColor:
                                                      theme.palette.grey[200],
                                                    color:
                                                      theme.palette.primary.main,
                                                    fontWeight: 'normal',
                                                    whiteSpace: 'nowrap',
                                                    '&:hover': {
                                                      background:
                                                        theme.palette.grey[200],
                                                      border: 1,
                                                      borderRadius: '10px',
                                                      borderColor:
                                                        theme.palette.grey[200]
                                                    },
                                                  }}
                                                  disabled={item?.title !== ''}
                                                >
                                                  Upload Certificate
                                                </Button>
                                              </label>
                                            </>
                                          )}
                                        </Box>
                                      </InputAdornment>
                                    )
                                  }}
                                />
                                {addRERA.length > 1 && (<Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center'
                                  }}
                                  onClick={() => {
                                    handleRemoveRERA(index);
                                    // setDelete(true);
                                    // setUrl(item?.url);
                                    // setIndexState(index);
                                  }}
                                  id={`delete_of_${index}`}
                                >
                                  <DeleteForeverSharpIcon
                                    fontSize="large"
                                    sx={{
                                      color: '#f34423',
                                      cursor: 'pointer',
                                      '&:hover': { color: '#a82222' },
                                      fontSize: '28px',
                                      mx: 1
                                    }}
                                  />
                                </Box>
                                )}
                              </Box>
                            </Box>

                            {addRERA.length === index + 1 && (
                              <Typography
                                sx={{
                                  color: theme.palette.primary.main,
                                  cursor: 'pointer'
                                }}
                                marginTop='-0.5rem'
                                onClick={() => handleAddRERA(index)}
                              >
                                Add another RERA
                              </Typography>
                            )}
                          </React.Fragment>
                          :
                          <React.Fragment key={index}>
                            <Box width="100%" mb={2}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                  id={`reraNumber-input${index}`}
                                  name="reraNumber"
                                  required
                                  label="RERA Number "
                                  variant="outlined"
                                  fullWidth
                                  onChange={(e) => {
                                    handleRERAValuechange(e, index);
                                  }}
                                  value={item.reraValue}
                                  error={formError.reraNumber}
                                  helperText={
                                    formError.reraNumber
                                      ? 'This field is required'
                                      : ''
                                  }

                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <Box
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            marginRight: "-14px"
                                          }}
                                        >
                                          {item?.title !== '' && (
                                            <Box
                                              py={1}
                                              px={1.5}
                                              sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                columnGap: 1,
                                                background: '#eeeeee',
                                                borderRadius: '10px'
                                              }}
                                            >
                                              <Typography
                                                sx={{
                                                  overflow: 'hidden',
                                                  whiteSpace: 'nowrap',
                                                  textOverflow: 'ellipsis',
                                                  maxWidth: {
                                                    xs: '200px',
                                                    md: '150px',
                                                    xl: '200px'
                                                  }
                                                }}
                                              >
                                                {item?.title}
                                              </Typography>
                                              <button
                                                style={{
                                                  display: 'block',
                                                  width: '20px',
                                                  border: 'none',
                                                  borderRadius: '4px',
                                                  color: 'red',
                                                  cursor: 'pointer',
                                                  padding: 0,
                                                  fontSize: '19px',
                                                  marginRigth: '10px'
                                                }}
                                                type="button"
                                                onClick={() => {
                                                  handleReraDelete(
                                                    item?.url,
                                                    index
                                                  );
                                                }}
                                                id="delete-uploadprojectmap"
                                              >
                                                &times;
                                              </button>
                                            </Box>
                                          )}
                                          {item?.title === '' && (
                                            <>
                                              <label
                                                htmlFor={`contained-button-file-RERA-${index}`}
                                                id={`upload-button-Rera-${index}`}
                                              >
                                                <Input
                                                  accept="image/* pdf/*"
                                                  id={`contained-button-file-RERA-${index}`}
                                                  onChange={(e) => {
                                                    // GetURLForUpload(
                                                    //   e,
                                                    //   uploadRERACertificate,
                                                    //   index
                                                    // );
                                                    uploadCertificate(e, uploadRERACertificate, index)
                                                    console.log({ index })
                                                  }}
                                                  disabled={item?.title !== ''}
                                                  name="RERAUpload"
                                                  type="file"
                                                />
                                                <Button
                                                  variant="outlined"
                                                  component="span"
                                                  sx={{
                                                    background: '#eeeeee',
                                                    border: 1,
                                                    borderRadius: '10px',
                                                    borderColor:
                                                      theme.palette.grey[200],
                                                    color:
                                                      theme.palette.primary.main,
                                                    fontWeight: 'normal',
                                                    whiteSpace: 'nowrap',
                                                    '&:hover': {
                                                      background:
                                                        theme.palette.grey[200],
                                                      border: 1,
                                                      borderRadius: '10px',
                                                      borderColor:
                                                        theme.palette.grey[200]
                                                    }
                                                  }}
                                                  disabled={item?.title !== ''}
                                                >
                                                  Upload Certificate
                                                </Button>
                                              </label>
                                            </>
                                          )}
                                        </Box>
                                      </InputAdornment>
                                    )
                                  }}
                                />
                                {addRERA.length > 1 && (<Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center'
                                  }}
                                  onClick={() => {
                                    handleRemoveRERA(index);
                                    // setDelete(true);
                                    // setUrl(item?.url);
                                    // setIndexState(index);
                                  }}
                                  id={`delete_of_${index}`}
                                >
                                  <DeleteForeverSharpIcon
                                    fontSize="large"
                                    sx={{
                                      color: '#f34423',
                                      cursor: 'pointer',
                                      '&:hover': { color: '#a82222' },
                                      fontSize: '28px',
                                      mx: 1
                                    }}
                                  />
                                </Box>
                                )}
                              </Box>
                            </Box>

                            {addRERA.length === index + 1 && (
                              <Typography
                                sx={{
                                  color: theme.palette.primary.main,
                                  cursor: 'pointer'
                                }}
                                marginTop='-0.5rem'
                                onClick={() => handleAddRERA(index)}
                              >
                                Add another RERA
                              </Typography>
                            )}
                          </React.Fragment>

                      )
                    })
                  }
                </>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container columnSpacing={1}>
                  <Grid
                    item
                    xs={currentProjectSubType[0]?.subType?.length > 0 ? 6 : 12}
                  >
                    <Box width="100%">
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={formError.projectType}
                        required
                      >
                        <InputLabel>Project Type </InputLabel>
                        <Select
                          label="projectType"
                          onChange={(event) => {
                            setFormError((formError) => ({
                              ...formError,
                              projectType: false
                            }));
                            setCurrentProjectType(event.target.value);
                            handleChange(event);
                          }}
                          value={basicFormDetail.projectType}
                          name="projectType"
                        >
                          {PUBLISHED_TABS.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              <Box ml={2} display="inline-block">
                                {type.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {formError.projectType && (
                        <FormHelperText error="true">
                          This Field is required
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                  {currentProjectSubType[0]?.subType?.length > 0 && (
                    <>
                      <Grid item xs={6}>
                        <Box width="100%">
                          <FormControl fullWidth variant="outlined">
                            <InputLabel> Sub-Type </InputLabel>
                            <Select
                              label="projectType"
                              onChange={handleChange}
                              value={basicFormDetail.subType}
                              name="subType"
                            >
                              {currentProjectSubType[0].subType.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  <Box ml={1} display="inline-block">
                                    {type.label}
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={4} sm={6} md={12} lg={4.5}>
                    <Box width="100%">
                      <TextField
                        id="area"
                        name="area"
                        label="Total Area of Project"
                        inputProps={{ type: 'number' }}
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={basicFormDetail.area}
                      />
                      {formError.area && (
                        <FormHelperText error="true">
                          Please enter correct total value
                        </FormHelperText>
                      )}
                    </Box>
                    {
                      phase.length === 0 && basicFormDetail.projectType !== "pvtbuilder" &&
                      <Typography
                        sx={{
                          color: theme.palette.primary.main,
                          cursor: 'pointer'
                        }}
                        marginTop='0.5rem'
                        onClick={() => handlePhase()}
                      >
                        Launch in Phases?
                      </Typography>
                    }
                  </Grid>
                  <Grid item xs={8} sm={6} md={12} lg={7.5}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      <FormControl sx={{ ml: 1 }}>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="unit"
                          value={basicFormDetail.unit}
                          onChange={handleChange}
                        >
                          {basicFormDetail.projectType === "pvtbuilder" ?
                            <FormControlLabel
                              value="sq.yd"
                              control={<Radio />}
                              label="Sq. yd"
                            /> :
                            <FormControlLabel
                              value="acres"
                              control={<Radio />}
                              label="acres"
                            />}
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
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box width="100%">
                  <TextField
                    id="totalNumberOfUnits"
                    name="totalNumberOfUnits"
                    label="Total Number of units"
                    variant="outlined"
                    fullWidth
                    inputProps={{ type: 'number' }}
                    onChange={handleChange}
                    value={basicFormDetail.totalNumberOfUnits}
                  />
                </Box>
              </Grid>
              {
                phase.length > 0 && phase.map((data, index) => {
                  return <>
                    <Grid item xs={12} md={6}>
                      <Grid container columnSpacing={1} rowSpacing={1}>
                        <Grid item xs={4} sm={6} md={12} lg={4.5}>
                          <Box width="100%">
                            <TextField
                              id="phase"
                              name="value"
                              label={`Phase ${index + 1} Area`}
                              inputProps={{ type: 'number' }}
                              variant="outlined"
                              fullWidth
                              onChange={(e) => handleAddPhase(e, index)}
                              value={data.value}
                            />
                          </Box>
                          {index === emptyIndex && formError.area && (
                            <FormHelperText error="true">
                              Please enter correct value for area & unit
                            </FormHelperText>
                          )}
                        </Grid>
                        <Grid item xs={8} sm={6} md={12} lg={7.5}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <FormControl sx={{ ml: 1 }}>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="unit"
                                value={data.unit}
                                onChange={(e) => handleAddPhase(e, index)}
                              >
                                <FormControlLabel
                                  value="acres"
                                  control={<Radio />}
                                  label="Acres"
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
                      </Grid>
                      {
                        phase.length - 1 === index && <Typography
                          sx={{
                            color: theme.palette.primary.main,
                            cursor: 'pointer'
                          }}
                          marginTop='0.5rem'
                          onClick={handlePhase}
                        >
                          Add another Phase
                        </Typography>
                      }
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box width="100%" display='flex'>
                        <TextField
                          id="totalNumberOfUnits"
                          name="noofunit"
                          label={`Units in Phase ${index + 1}`}
                          variant="outlined"
                          fullWidth
                          inputProps={{ type: 'number' }}
                          onChange={(e) => handleAddPhase(e, index)}
                          value={data.noofunit}
                        />

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center'
                          }}
                          onClick={() => {
                            handleRemovePhase(index);
                          }}
                          id={`delete_of_${index}`}
                        >
                          <DeleteForeverSharpIcon
                            fontSize="large"
                            sx={{
                              color: '#f34423',
                              cursor: 'pointer',
                              '&:hover': { color: '#a82222' },
                              fontSize: '28px',
                              mx: 1
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </>
                })
              }

              <Grid item xs={12} md={6}>
                <UploadFileVerticalNew
                  title="Upload Project Brochure"
                  handleChange={(e) => {
                    uploadData(e, updateUrl)
                  }}
                  handleDelete={handleDelete}
                  name={basicFormDetail.uploadprojectbrochure}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <UploadFileVerticalNew
                  title="Upload Sales / Company Presentation"
                  handleChange={(e) => {
                    uploadData(e, updateUrl)
                  }}
                  handleDelete={handleDelete}
                  name={basicFormDetail['uploadsales/companypresentation']}
                />
              </Grid>
            </Grid>

            {/* <Box mt={2}>
              <Typography mb={1}>Project Location</Typography>
              <MapLoader
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDylAZazdDTAB1xeRCGaZX_EQ8ACXY7Z_s&libraries=places"
                loadingElement={<div style={{ height: `100%` }} />}
              />
             <GoogleMap/>
            </Box> */}
            <Divider sx={{ my: 2 }} />
            <Grid container columnSpacing={4} rowSpacing={4}>
              <Grid item xs={12} md={6}>
                <Box width="100%">
                  <TextField
                    id="address"
                    name="address"
                    label="Street Address"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={5}
                    onChange={handleChange}
                    value={basicFormDetail.address}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container columnSpacing={4} rowSpacing={4}>
                  <Grid item xs={12}>
                    <Box width="100%">
                      <TextField
                        id="uploadprojectmap"
                        name="uploadprojectmap"
                        label="Upload Project Map"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Box
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  marginRight: "-14px"
                                }}
                              >
                                {basicFormDetail.uploadprojectmap[0]?.title !==
                                  '' &&
                                  !_.isEmpty(
                                    basicFormDetail.uploadprojectmap
                                  ) && (
                                    <Box p={1}>
                                      <button
                                        style={{
                                          display: 'block',
                                          width: '20px',
                                          border: 'none',
                                          borderRadius: '4px',
                                          background: 'rgba(0, 0, 0, 0.5)',
                                          color: 'red',
                                          cursor: 'pointer',
                                          padding: 0,
                                          fontSize: '17px',
                                          marginRigth: '10px'
                                        }}
                                        type="button"
                                        onClick={() => {
                                          handleSingleDelete(
                                            basicFormDetail.uploadprojectmap[0]
                                              ?.url,
                                            'uploadprojectmap'
                                          );
                                        }}
                                        id="delete-uploadprojectmap"
                                      >
                                        &times;
                                      </button>
                                    </Box>
                                  )}
                                <label
                                  htmlFor="contained-button-file"
                                  id="upload-button"
                                >
                                  <Input
                                    accept="image/*"
                                    id="contained-button-file"
                                    // multiple
                                    onChange={(e) => {
                                      // GetURLForUpload(e, updateSingleUrl);
                                      uploadData(e, updateSingleUrl)
                                    }}
                                    disabled={
                                      basicFormDetail.uploadprojectmap[0]
                                        ?.title !== '' &&
                                      !_.isEmpty(
                                        basicFormDetail.uploadprojectmap
                                      )
                                    }
                                    name="uploadprojectmap"
                                    type="file"
                                  />
                                  <Button
                                    variant="contained"
                                    component="span"
                                    startIcon={
                                      <img
                                        src="/static/images/logo/projectIcons/browse-file-icon.svg"
                                        alt=""
                                        style={{ width: 27, height: 27 }}
                                      />
                                    }
                                    sx={browseButton}
                                    disabled={
                                      basicFormDetail.uploadprojectmap[0]
                                        ?.title !== '' &&
                                      !_.isEmpty(
                                        basicFormDetail.uploadprojectmap
                                      )
                                    }
                                  >
                                    Browse file
                                  </Button>
                                </label>
                              </Box>
                            </InputAdornment>
                          )
                        }}
                        value={
                          _.isEmpty(basicFormDetail.uploadprojectmap)
                            ? ''
                            : basicFormDetail.uploadprojectmap[0]?.title
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box width="100%">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          id="completionDate"
                          name="completionDate"
                          label="Completion date (Expected if not completed)"
                          inputFormat="dd/MM/yyyy"
                          // minDate={new Date()}
                          value={
                            basicFormDetail.completionDate === ''
                              ? null
                              : basicFormDetail.completionDate
                          }
                          onChange={(newValue) => {
                            setBasicFormDetail({
                              ...basicFormDetail,
                              [`completionDate`]: newValue
                            });
                          }}
                          renderInput={(params) => (
                            <TextField fullWidth {...params} />
                          )}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center'
                  }}
                >
                  {' '}
                  {basicFormDetail.projectType === 'pvtbuilder' ? <Typography mr={2}>Upload Project Logo </Typography>
                    : <Typography mr={2}>Upload Project Logo *</Typography>
                  }

                  {basicFormDetail?.logo === '' && (
                    <>
                      <label
                        htmlFor="contained-logo-file"
                        id="upload-logo-button"
                      >
                        <Input
                          accept="image/*"
                          id="contained-logo-file"
                          // multiple
                          onChange={(e) => {
                            // GetURLForUpload(e, handleLogoUpload);
                            uploadData(e, handleLogoUpload)
                          }}
                          disabled={basicFormDetail?.logo !== '' && basicFormDetail.projectType === 'pvtbuilder'}
                          name="logo"
                          type="file"
                        />
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={
                            <img
                              src="/static/images/logo/projectIcons/browse-file-icon.svg"
                              alt=""
                              style={{ width: 27, height: 27 }}
                            />
                          }
                          sx={browseButton}
                          disabled={basicFormDetail?.logo !== ''}
                        >
                          Browse file
                        </Button>
                      </label>
                    </>
                  )}
                  {basicFormDetail?.logo !== '' &&
                    basicFormDetail?.logo !== undefined &&
                    basicFormDetail?.logo !== null && (
                      <ProfileImageComponent
                        src={basicFormDetail?.logo}
                        alt="profile Image"
                        handleRemove={handleLogoDelete}
                      />
                    )}
                </Box>
                {formError.logo && (
                  <FormHelperText error="true" sx={{ mx: 0 }}>
                    This field is required
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </>
        )}
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
              Save
            </Button>
            <Button variant="outlined" onClick={() => handleCancel(projectId)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            {!(basicFormDetail?.projectStatus === 'upcomingLaunch') && (
              <Button
                variant="contained"
                startIcon={
                  isSubmitting && isContinueClicked ? (
                    <CircularProgress size="1rem" />
                  ) : null
                }
                disabled={!isValidSaveExit()}
                onClick={() => handleSave(true)}
              >
                Save & continue
              </Button>
            )}
            {!(basicFormDetail?.projectStatus === 'upcomingLaunch') && (
              <Button
                variant="outlined"
                startIcon={
                  isSubmitting && !isContinueClicked ? (
                    <CircularProgress size="1rem" />
                  ) : null
                }
                disabled={!isValidSaveExit()}
                onClick={() => handleSave(false)}
              >
                {' '}
                Save & Exit
              </Button>
            )}
            {basicFormDetail?.projectStatus === 'upcomingLaunch' && (
              <Button
                variant="contained"
                startIcon={
                  isSubmitting && !isContinueClicked ? (
                    <CircularProgress size="1rem" />
                  ) : null
                }
                disabled={!isValid() || isSubmitting}
                onClick={() => handleSave(true)}
              >
                Save
              </Button>
            )}
          </>
        )}
      </Box>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
};
export default memo(BasicInfoForm);
