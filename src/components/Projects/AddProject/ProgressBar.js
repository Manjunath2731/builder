import React, { memo, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { getIcons } from "../ViewProjectDetails/ProjectDetailScreens";
import "./ProgressBar.css";

const ProgressBar = ({ filename, contentType, fileSize, handlelose }) => {
  const minValue = 0;
  const maxValue = 100;
  const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   let isMounted = true;

  //   const simulateFileUpload = (uploadedBytes) => {
  //     console.log("fileSize",fileSize,uploadedBytes)
  //     const chunkSize = 1024 * 1024;
  //     if (isMounted && uploadedBytes < fileSize) {
  //       const chunk = Math.min(chunkSize, fileSize - uploadedBytes);
  //       setTimeout(() => {
  //         const calculatedProgress =
  //           ((uploadedBytes + chunk) / fileSize) * 100;
  //         setProgress(calculatedProgress);
  //         simulateFileUpload(uploadedBytes + chunk);
  //       }, 1000);
  //     } else if (isMounted && progress >= 100) {
  //       setTimeout(() => {
  //         handlelose();
  //       }, 1000)
  //     }
  //   };

  //   simulateFileUpload(0);

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [fileSize, handlelose, progress]);

  useEffect(() => {
    let isMounted = true;
    
    

    const simulateFileUpload = (uploadedBytes) => {
      let fileCount = 0;
      if (fileSize<=1024*1024*20){
        fileCount=500;

      }
      else if(fileSize<=1024*1024*50){
        fileCount=1000;

      }else if(fileSize<=1024*1024*100){
        fileCount=1500;

      }else if(fileSize<=1024*1024*150){
        fileCount=2000;

      }else{
        fileCount=2500;
      }

    
      const chunkSize = 1024 * 1024;
      if (isMounted && uploadedBytes < fileSize) {
        const chunk = Math.min(chunkSize, fileSize - uploadedBytes);
        setTimeout(() => {
          const calculatedProgress =
            ((uploadedBytes + chunk) / fileSize) * 100;
          setProgress(calculatedProgress);
          simulateFileUpload(uploadedBytes + chunk);
        }, fileCount);
      }

      if (progress >= 100) {
        handlelose();
      }
    };

    simulateFileUpload(0);

    return () => {
      isMounted = false;
    };
  }, [fileSize, handlelose]);

  console.log("progress", progress);

  return (

    <div className="progress">
      <div
        className="progress-bar progress-bar-striped"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
      >
        <div className="centered-content-inner">
          {contentType?.length > 0 ? (
            <img
              src={getIcons(contentType.split("/")[1])[0]?.iconSrc}
              alt=""
              style={{ width: 44, height: 44 }}
            />
          ) : (
            <Box sx={{ width: "45px" }}>
              <img
                src="/static/images/logo/doc-icon.svg"
                alt=""
                style={{ width: 44, height: 44 }}
              />
            </Box>
          )}
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: {
                xs: "410px",
                md: "200px",
                lg: "220px",
                xl: "410px",
              },
              ml: 1,
            }}
          >
            {filename}
          </Typography>
          <span className="percentage-right">{`${progress.toFixed(2)}%`}</span>
        </div>
      </div>

    </div>


  );
};

export default memo(ProgressBar);
