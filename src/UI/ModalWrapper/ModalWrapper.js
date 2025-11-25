import React, {
    // useState,
    forwardRef,

} from 'react';
import {
    //   Link,
    //   Box,
    //   Divider,
    IconButton,
    //   List,
    //   CircularProgress,
    //   ListItem,
    //   Grid,
    //   InputBase,
    //   Tooltip,
    //   Typography,
    //   Card,
    Dialog,
    //   alpha,
    Slide,
    styled,
    //   useTheme,
    DialogTitle,
    DialogContent
} from '@mui/material';
// import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

//   const DialogWrapper = styled(Dialog)(
//     () => `
//         .MuiDialog-paper {
//           overflow: visible;
//         }
//   `
//   );

const DialogWrapper = styled(Dialog)(
    () => `
      .MuiDialog-container {
          height: auto;
      }
      
      .MuiDialog-paperScrollPaper {
          max-height: calc(100vh - 64px);
          overflow-x: hidden;
      }
    `
);

const ModalWrapper = ({ open, handleClose, title = null, maxWidth, closeModal, children }) => {
    return (
        <>
            <DialogWrapper
                open={open}
                TransitionComponent={Transition}
                keepMounted
                maxWidth={maxWidth}
                fullWidth
                scroll="paper"
                onClose={handleClose}
            >
                <DialogTitle
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {title}
                    <IconButton onClick={closeModal}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
            </DialogWrapper>
        </>
    );
}

ModalWrapper.defaultProps = {
    maxWidth: 'sm'
}
export default ModalWrapper;