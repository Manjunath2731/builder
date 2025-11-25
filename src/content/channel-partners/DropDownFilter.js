import React from 'react';
import {
  Box,
  Card,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';

export const DropDownFilter = ({
  name,
  value,
  onchange,
  menuItems = [],
  initialValue,
  dateRange = '',
  isValueId=true
}) => {
  return (
    <Card
      sx={{
       
        border: 0,
        '&:hover': { border: 0 },
        borderRadius: '5px',
        backgroundColor: '#dbe5f3',
        outline: '0px'
      }}
    >
      <FormControl fullWidth component="div">
        <Select
          sx={{ backgroundColor: '#dbe5f3', borderRadius: '5px', m: '-2px' }}
          onChange={onchange}
          value={value}
          name={name}
          startAdornment={
            <InputAdornment position="start">
              <Typography variant="h5">{name} :</Typography>
            </InputAdornment>
          }
        >
          <MenuItem
            key={initialValue}
            value={initialValue}
            sx={{ background: '#dbe5f3' }}
          >
            <Box ml={0.5} display="inline-block">
              <Typography variant="h4"> {initialValue}</Typography>
            </Box>
          </MenuItem>
          {dateRange !== '' && (
            <MenuItem
              key={dateRange}
              value={dateRange}
              sx={{ background: '#dbe5f3' }}
            >
              <Box ml={0.5} display="inline-block">
                <Typography variant="h4"> {dateRange}</Typography>
              </Box>
            </MenuItem>
          )}

          {menuItems.map((name) => {
            if (typeof name === 'object' && name !== null) {
              return (
                <MenuItem key={isValueId ? name.id:name?.id?._id} value={name.id}>
                  <Box ml={1} display="inline-block">
                    {name.label}
                  </Box>
                </MenuItem>
              );
            }
            return (
              <MenuItem key={name} value={name}>
                <Box ml={1} display="inline-block">
                  {name}
                </Box>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Card>
  );
};
