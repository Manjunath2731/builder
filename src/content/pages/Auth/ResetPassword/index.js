import {
  Box,
  Card,
  Typography,
  Container,
  styled,
  IconButton
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import CloseIcon from '@mui/icons-material/Close';
import useAuth from 'src/hooks/useAuth';
import ResetPassword from './ResetPassword';

const MainContent = styled(Box)(
  () => `
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
`
);

function ResetPasswordCover() {
  const { method } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Builder</title>
      </Helmet>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <img
          width={70}
          alt="Auth0"
          src="/static/images/logo/builder_logo.png"
        />
      </Box>
      <MainContent>
        <Container maxWidth="sm">
          <Card
            sx={{
              mt: 1,
              px: 4,
              pt: 2,
              pb: 3
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box textAlign="center">
              <Typography
                variant="h2"
                sx={{
                  mb: 1
                }}
              >
                {t('Change Password')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{
                  mb: 3
                }}
              >
                {t(
                  'Fill in the fields below to Change Password for your account.'
                )}
              </Typography>
            </Box>
            {method === 'JWT' && <ResetPassword />}
          </Card>
        </Container>
      </MainContent>
    </>
  );
}

export default ResetPasswordCover;
