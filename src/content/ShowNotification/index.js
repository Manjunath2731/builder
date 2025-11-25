import React, { useEffect, useState } from "react";

import { Box, Button, Modal, Typography } from "@mui/material";
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

function OpenNotification({ isOpen, isClosed, errorMessage, successMessage, closeSuccessNotification }) {
  const [open, setOpen] = useState(true);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    setOpen(isOpen);
    if (isOpen) {
      const newTimerId = setTimeout(() => {
        handleClose();
      }, 5000);
      setTimerId(newTimerId);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  const handleClose = () => {
    setOpen(false);
    isClosed(true);
    closeSuccessNotification();
    if (timerId) {
      clearTimeout(timerId);
    }
  };

  const handleOkayClick = () => {
    handleClose();
  };



  return (
    <>
      <Modal open={open} onClose={handleClose} sx={{ top: "30%", left: "40%" }}>
        <Box style={{ width: 500, backgroundColor: 'white', padding: 20, height: "auto" }}>
          {errorMessage ? (
            <>
              <CancelRoundedIcon sx={{ color: "red", fontSize: "70px", ml: "180px", mt: 3 }} px={3} />
              <Typography sx={{ fontSize: "18px", textAlign: "center", mt: 4 }}>{errorMessage}</Typography>
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  
                }}
              >
              <Button onClick={handleOkayClick} sx={{
                mt: 3,backgroundColor: "white", color: "red", "&:hover": {
                  backgroundColor: "#fcf1f0"
                }
                ,border: "1px solid red",
              }}>Okay</Button>
              </Box>
            </>
          ) : (
            <>
              <CheckCircleRoundedIcon sx={{ color: "#00C45F", fontSize: "70px", ml: "180px", mt:3}} px={3} />

              <Typography sx={{ fontSize: "18px", textAlign: "center", mt: 4 }}>{successMessage}</Typography>
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button onClick={handleOkayClick} sx={{
                  mt: 3, ml:3.5,backgroundColor: "white", color: "#00C45F", "&:hover": {
                    backgroundColor: "#ebf6fc"
                  }, border: "1px solid #00C45F",
                }}>Okay</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

    </>
  );
}

export default OpenNotification;
