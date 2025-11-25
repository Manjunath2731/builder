import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Card,
  styled,
} from '@mui/material';
import { browseButton, getName } from 'src/utils/utilits';
import Loader from 'src/UI/Loader/Loader.js';

export const Input = styled('input')({
    display: 'none'
  });

const UploadFile = ({
    title,
    handleChange,
    name,
    nameNonTitle = '',
    style
  }) => {
    let inputName = title.length === 0 ? nameNonTitle : getName(title);
    const [isLoading,setIsLoading]=useState(false);
    useEffect(()=>{
      setIsLoading(false);
    },[name])

    const loaderImg =(e)=>{
      let files = e.target.files || e.dataTransfer.files;
      if (files[0]?.type.startsWith('image/')) {
        if (files[0].size > 1024 * 1024 * 2) {
          // fileBoolean = false;
        setIsLoading(false)
        }else{
          setIsLoading(true)
        }
      }
     }

    return (
      <>
       {!isLoading ? (<Card
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <label
              htmlFor={`contained-button-file-${inputName}`}
              id={`upload-button-${inputName}`}
            >
              <Input
                accept="image/*"
                id={`contained-button-file-${inputName}`}
                onChange={(e) => {
                  handleChange(e);
                   // setIsLoading(true);
                  loaderImg(e)
                }}
                name={inputName}
                type="file"
              />
              <Button
                variant="contained"
                component="span"
                startIcon={
                  <img
                    src="/static/images/logo/projectIcons/browse-file-icon.svg"
                    alt=""
                    style={{ width: 30, height: 30 }}
                  />
                }
                sx={browseButton}
              >
                Browse file
              </Button>
              <Typography mt={2}> {style?.paddingTop ? title : ''}</Typography>
            </label>
          </Box>
        </Card>): (<Loader />)} 
      </>
    );
  };

  export default UploadFile;