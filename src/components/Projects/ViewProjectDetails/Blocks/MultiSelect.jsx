import React from 'react'
import Select from "react-select";
import makeAnimated from 'react-select/animated';

const animatedComponents =makeAnimated();
const customStyles = {
  control: base => ({
    ...base,
    minHeight: 50
  })
};
const MultipleSelect = ({teamData,handleChange,renderValues}) => {
  return (
    <Select options={teamData} placeholder="Report Manager" minMenuHeight='200px'  styles={customStyles} components={animatedComponents} isMulti onChange={handleChange} value={renderValues} />
  )
}

export default MultipleSelect
