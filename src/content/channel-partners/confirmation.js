import React, { forwardRef } from 'react';
import {
  Avatar,
  Box,
  Slide,
  Button,
  Typography,
  Dialog,
  styled
} from '@mui/material';
import { useTranslation } from 'react-i18next';
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
        background-color: ${theme.colors.primary.lighter};
        color: ${theme.colors.primary.main};
        width: ${theme.spacing(12)};
        height: ${theme.spacing(12)};
  
        .MuiSvgIcon-root {
          font-size: ${theme.typography.pxToRem(45)};
        }
  `
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const SendConfirmation = ({
  confirmationText,
  openConfirmSave,
  closeConfirmSave,
  handleSave
}) => {
  const { t } = useTranslation();
  const Icon = confirmationText?.icon;
  return (
    <>
      <DialogWrapper
        open={openConfirmSave}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmSave}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <Icon />
          </AvatarError>

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
            {t(
              `Do you really want to send the invite via  ${confirmationText?.value}`
            )}
            ?
          </Typography>

          <Stack direction="row" spacing={2}>
           
            <Button
              onClick={() => handleSave()}
              style={{
                minWidth: '64px',
                padding: '6px 31px',
                // borderRadius: '4px'
              }}
              variant="contained"
            >
              {t('Send')}
            </Button>
            <Button
             variant="contained"
              style={{
                background: '#C6C6C6',
                color: '#ffff',
                border: 0,
                minWidth: '64px',
                padding: '6px 31px',
                // borderRadius: '4px'
              }}
              onClick={closeConfirmSave}
            >
              {t('Cancel')}
            </Button>
            </Stack>
        </Box>
      </DialogWrapper>
    </>
  );
};

export default SendConfirmation;
