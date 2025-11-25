import React, { forwardRef } from 'react';
import {
  Avatar,
  Box,
  Slide,
  Button,
  Typography,
  Dialog,
  styled,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';

const DialogWrapper = styled(Dialog)(
  () => `
        .MuiDialog-paper {
          overflow: visible;
        }
  `
);
const AvatarError = styled(Avatar)(
  ({ theme }) => `
        background-color: ${theme.colors.error.lighter};
        color: ${theme.colors.error.main};
        width: ${theme.spacing(12)};
        height: ${theme.spacing(12)};
  
        .MuiSvgIcon-root {
          font-size: ${theme.typography.pxToRem(45)};
        }
  `
);
const ButtonError = styled(Button)(
  ({ theme }) => `
        background: ${theme.palette.primary};
        color: ${theme.palette.primary};
        
        `
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const DeleteConfirmation = ({
  openConfirmDelete,
  closeConfirmDelete,
  handleDeleteCompleted,
  title,
  selectedId
}) => {
  const { t } = useTranslation();
  const theme =useTheme();
  return (
    <>
      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>
          <Typography
            align="center"
            sx={{
              pt: 3,
              fontWeight: 550,
              font: 'Helvetica Neue Medium',
              color: theme.palette.grey[600]
            }}
            variant="h3"
          >
            {t(`Are you sure`)}?
          </Typography>
          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4
            }}
            fontWeight="normal"
            color="text.secondary"
            whiteSpace="nowrap"
            variant="h4"
          >
            {t(`Do you really want to delete this ${title}`)}?
          </Typography>

          {/* <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {t("You won't be able to revert after deletion")}
          </Typography> */}

          <Stack direction="row" spacing={2}>
            <ButtonError
              onClick={() => handleDeleteCompleted(selectedId)}
              style={{
                minWidth: '64px',
                padding: '6px 31px',
                // borderRadius: '4px'
              }}
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
            <Button
              variant="contained"
              style={{
                background: '#C6C6C6',
                color: '#ffff',
                // border: 0,
                minWidth: '64px',
                padding: '6px 31px',
                borderRadius: '4px'
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
          </Stack>
        </Box>
      </DialogWrapper>
    </>
  );
};

export default DeleteConfirmation;
