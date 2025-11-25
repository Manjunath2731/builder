import {React} from 'react';
import Select from "react-select";
import makeAnimated from 'react-select/animated';

const animatedComponents =makeAnimated();
const customStyles = {
    control: base => ({
      ...base,
      minHeight: 50,
      borderRadius:'10px'
    })
  };
  
const MultipleSelect=({data,handleChange,placeholder,value})=>{
    return(
        <Select options={data} minMenuHeight='200px'  value={value} styles={customStyles} components={animatedComponents} isMulti onChange={handleChange} placeholder={placeholder}/>
    )
}

export default MultipleSelect;