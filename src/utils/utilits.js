import moment from 'moment';
import _ from 'lodash';
import { showNotification } from 'src/utils/commonUtility';
import { notificationType } from 'src/constants/NotificationType';
import { saveAs } from 'file-saver';

export const toUpper = (str) => {
  let result = '';
  if (str !== null && str !== undefined) {
    result = str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    result = '';
  }
  return result;
};
export const toUpperMutliple = (str) => {
  let result = '';
  if (str !== null && str !== undefined) {
    let s = str.split(' ');
    let strArray = s.map((item) => {
      let formatStr = item.charAt(0).toUpperCase() + item.slice(1);
      return formatStr;
    });
    result = strArray.join(' ');
  } else {
    result = '';
  }
  return result;
};

export const getTimeArray = (fromDate, toDate) => {
  let days = [];
  let day = fromDate;
  while (day <= toDate) {
    days.push(new Date(day).toUTCString());
    day = day.clone().add(1, 'd');
  }
  return days;
};
export const getDateFromTimeStamp = (url) => {
  if (isValid(url)) {
    let timeStamp = url.split('/');
    timeStamp = timeStamp[timeStamp.length - 2];
    let date = moment.unix(timeStamp).format('ll');
    return date;
  }
  return '-';
};
export const isValid = (str) => {
  if (
    str !== null &&
    str !== undefined &&
    str !== '' &&
    str !== 'null' &&
    str !== 'undefined'
  ) {
    return true;
  }
  return false;
};

export const toCapitalizeCamelCase = (str) => {
  if (isValid(str)) {
    const result = str.replace(/([A-Z])/g, " $1");
    let finalResult = toUpperMutliple(result);

    if (finalResult === 'Add C R M Member') {
      finalResult = 'Add CRM Member'
    }
    if (finalResult === 'Delete C R M Member') {
      finalResult = 'Delete CRM Member'
    }
    return finalResult
  }
  return '';
}

export const getName = (title) => {
  let inputName = title.toLowerCase().split(' ').join('');
  return inputName;
};

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

export const mergeObjectOfArray = (obj) => {
  return new Promise((resolve) => {
    let requiredArray = [];
    if (!(_.isEmpty(obj))) {
      Object.keys(obj).map(function (key) {
        Array.prototype.push.apply(requiredArray, obj[key]);
        return null
      })
    }
    console.log({ requiredArray }, { obj });
    resolve(requiredArray.length ? requiredArray : [])
  })

}

export const SortObjectOnTimeBasisLatest = (arrayOfObject) => {
  if (!(_.isEmpty(arrayOfObject))) {
    arrayOfObject.sort((a, b) => {
      let da = new Date(a.createdAt);
      let db = new Date(b.createdAt);
      return db - da;
    });
    console.log({ arrayOfObject }, 'inside');
  }
  console.log({ arrayOfObject });
  return arrayOfObject || []
}

export const handleDownload = (fileArray) => {
  console.log({ fileArray })
  // let downloadFiles=[]
  if (isValid(fileArray) && !(_.isEmpty(fileArray) && !(_.isString(fileArray)))) {
    fileArray.map(async (item) => {
      await download(item)
    })
    //     fetch(`${item.label}.${item.contentType}`).then(response => {
    //       response.blob().then(blob => {
    //         // Creating new object of PDF file
    //         const fileURL = window.URL.createObjectURL(blob);
    //         // Setting various property values
    //         let alink = document.createElement('a');
    //         alink.href = item?.downloadLink || item?.url;
    //         alink.download = 'SamplePDF.pdf';
    //         alink.click();
    //     })
    // })
    // download(fileArray[0])
    // Array.isArray(file) ? downloadFiles=[...file] : downloadFiles.push(file)
    // multipleDownload(fileArray);
    // showNotification(`Downloaded ${fileArray.length} file !`, notificationType.INFO);
    return
  }
  showNotification('No file selected for Download !', notificationType.INFO);
}

// const multipleDownload = async (files) => {
//   // files.reduce((l,item)=>{
//   //   download(item).then(result=>{
//   //     return result
//   //   });
//   //   return 
//   // })

//   // return Promise.all([...files].map((file) => download(file)));
// };
const download = (item) => {
  // return new Promise((resolve) => {
  console.log({ item })
  //   function download1(url){
  //     $('<iframe>', { id:'idown', src:url }).hide().appendTo('body').click();
  // }
  saveAs(item?.downloadLink || item?.url, item?.label);
  //   resolve()
  // })
};
const isInclude = (list, item) => {
  if (!item?.assign_RM) return 1;
  let length1 = (list.filter(i => i?.id?.includes(item.assign_RM._id)))?.length;
  console.log({ length1, list, item })
  return length1
}
export const getRMList = (items) => {
  let rmList = [];
  rmList = items.reduce(
    (accumulator, currentValue) => {
      let prev = [...accumulator];
      if (!(isInclude(prev, currentValue))) {
        prev.push({ label: `${currentValue?.assign_RM.first_name} ${currentValue?.assign_RM.last_name}`, id: currentValue?.assign_RM._id })
      }
      return prev;
    },
    rmList);
  return rmList
}


export const convertDate = (date) => {
  const providedDate = new Date(date);

  // Get today's date
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set time to 12:00 AM UTC

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setUTCHours(0, 0, 0, 0); // Set time to 12:00 AM UTC
  tomorrow.setDate(today.getUTCDate() + 1);

  // Get providedDate in UTC
  const providedDateUTC = new Date(providedDate.toISOString());
  providedDateUTC.setUTCHours(0, 0, 0, 0); // Set time to 12:00 AM UTC

  let dateLabel;
  if (providedDateUTC.getTime() === today.getTime()) {
    dateLabel = "Today";
  } else if (providedDateUTC.getTime() === tomorrow.getTime()) {
    dateLabel = "Tomorrow";
  } else {
    const options = { month: "long",day: "numeric"};
    dateLabel = providedDate.toLocaleDateString("en-US", options);
  }

  const timeOptions = { hour: "numeric", minute: "numeric" };
  const timeLabel = providedDate.toLocaleTimeString("en-US", timeOptions);

  return {
    dateLabel,
    timeLabel
  }
}