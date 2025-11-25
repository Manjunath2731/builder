import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

const getDisabledHours = (startTime) => {
  let hours = [];
  for (let i = 0; i < moment(startTime).hour(); i++) {
    hours.push(i);
  }
  return hours;
};

const getDisabledMinutes = (selectedHour, startTime) => {
  let minutes = [];
  if (selectedHour === moment(startTime).hour()) {
    for (let i = 0; i < moment(startTime).minute(); i++) {
      minutes.push(i);
    }
  }
  return minutes;
};

const DeliTimePicker = ({ className, onChange, value, startTime,isToday =false, endTime=false,minuteStep=1, ...rest }) => {
  return (
    <TimePicker
      {...rest}
      className={className}
      popupClassName={className}
      showSecond={false}
      onChange={onChange}
      hideDisabledOptions
      minuteStep={minuteStep}
      value={value}
      use12Hours
      disabledHours={() => {
        return !isToday && !endTime ? [] : getDisabledHours(startTime) ;
      }}
      disabledMinutes={(e) => {
        return !isToday && !endTime ? [] : getDisabledMinutes(e, startTime);
      }}
    />
  );
};

DeliTimePicker.propTypes = {
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(moment)
};

export default DeliTimePicker;
