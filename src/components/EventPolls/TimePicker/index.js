import styled from "styled-components";
import TimePicker from "./TimePicker";

const StyledTimePicker = styled(TimePicker)`
  & .rc-time-picker-panel-select-option-selected {
    background-color: #edeffe;
    font-weight: normal;
  
  }

  & .rc-time-picker-clear,
  & .rc-time-picker-clear-icon:after {
    font-size: 17px;
    margin:5px;
  }
  & .rc-time-picker-input{
    height:50px;
    border-radius:10px
  
  }
  & .rc-time-picker-panel-select{
    width:'-webkit-fill-available';
  }
  & .rc-time-picker-panel-select,
  & .rc-time-picker-input,
  & .rc-time-picker-panel-input {
    font-family: "Consolas", sans-serif;
    font-size: 17px;
    cursor: pointer;


    

    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;

export default StyledTimePicker;
