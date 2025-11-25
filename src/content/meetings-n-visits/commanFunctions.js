export const renderDate = (dateString) => {
  let dateStart = new Date(dateString).toLocaleDateString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  let Starttime = getTime(dateString);
  return `${dateStart} at ${Starttime}`;
};
const getTime = (date) => {
  return new Date(date).toLocaleTimeString('en-us', {
    hour: 'numeric',
    minute: 'numeric'
  });
};
export const toUpper = (str) => {
  let result = '';
  if (str !== null && str !== undefined) {
    let str1 = str.split(' ');
    let string1 = str1[0]?.charAt(0)?.toUpperCase() + str1[0]?.slice(1);
    let string2 = str1[1]?.charAt(0)?.toUpperCase() + str1[1]?.slice(1) || '';
    result = string1.concat(' ', string2);
  } else {
    result = '';
  }
  return result;
};
