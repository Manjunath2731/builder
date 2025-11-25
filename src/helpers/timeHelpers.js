const calculateTimeLeft = (dueDate) => {
  let difference = +new Date(dueDate) - +new Date();

  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60)
    };
  }
  return timeLeft;
};
const mS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
];
const calculateTimePast = (createdAt) => {
  let difference = +new Date() - +new Date(createdAt);
  let difference1 = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60));

  let timeLeft = {};
  if (difference > 0 && difference1 < 1) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      'Just now': ' '
    };
  }else if (difference > 1) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      ago: ' '
    };
  }
  if (Math.floor(difference / (1000 * 60 * 60 * 24)) >= 1) {
    let dateValue = new Date(createdAt);
    let dateString = `${dateValue.getDate()} ${
      mS[dateValue.getMonth()]
    } ${dateValue.getFullYear()} `;
    return dateString;
  }

  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span>
        {timeLeft[interval]} {interval}{' '}
      </span>
    );
  });

  return timerComponents;
};

const remainingHours = (today, checkDate) => {
  const todayDate = today.getDate();
  const dueDate = checkDate.getDate();
  const todayHours = today.getHours();
  const dueDateHour = checkDate.getHours();
  let hours;
  if (dueDate >= todayDate) {
    hours = (dueDate - todayDate) * 24 + (dueDateHour - todayHours);
    if (hours === 1) {
      hours = 0;
    }
  } else {
    hours = -((todayDate - dueDate) * 24 + (todayHours - dueDateHour)); // hours;
  }
  return hours;
};

export { calculateTimeLeft, remainingHours, calculateTimePast };
