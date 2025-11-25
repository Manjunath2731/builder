// import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, Typography, Container, styled } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
// import Logo from 'src/components/Logo';
// import Scrollbar from 'src/components/Scrollbar';

import useAuth from 'src/hooks/useAuth';
import Auth0Login from '../LoginAuth0';
import FirebaseAuthLogin from '../LoginFirebaseAuth';
import JWTLogin from '../LoginJWT';
import AmplifyLogin from '../LoginAmplify';

// const icons = {
//   Auth0: '/static/images/logo/auth0.svg',
//   FirebaseAuth: '/static/images/logo/firebase.svg',
//   JWT: '/static/images/logo/jwt.svg',
//   Amplify: '/static/images/logo/amplify.svg'
// };

const MainContent = styled(Box)(
  () => `
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
`
);

// const SidebarWrapper = styled(Box)(
//   ({ theme }) => `
//     position: fixed;
//     left: 0;
//     top: 0;
//     height: 100%;
//     background: ${theme.colors.alpha.white[100]};
//     width: 440px;
// `
// );

// const SidebarContent = styled(Box)(
//   ({ theme }) => `
//   display: flex;
//   flex-direction: column;
//   padding: ${theme.spacing(6)};
// `
// );

// const CardImg = styled(Card)(
//   ({ theme }) => `
//     border-radius: 100%;
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     position: relative;
//     border: 1px solid ${theme.colors.alpha.black[10]};
//     transition: ${theme.transitions.create(['border'])};
//     position: absolute;

//     &:hover {
//       border-color: ${theme.colors.primary.main};
//     }
// `
// );

// const TypographyH1 = styled(Typography)(
//   ({ theme }) => `
//     font-size: ${theme.typography.pxToRem(33)};
// `
// );

function LoginCover() {
  const { method } = useAuth();
  const { t } = useTranslation();

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
              pt: 5,
              pb: 3
            }}
          >
            <Box textAlign="center">
              <Typography
                variant="h2"
                sx={{
                  mb: 1
                }}
              >
                {t('Sign in')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{
                  mb: 3
                }}
              >
                {t('Fill in the fields below to sign into your account.')}
              </Typography>
            </Box>
            {method === 'Auth0' && <Auth0Login />}
            {method === 'FirebaseAuth' && <FirebaseAuthLogin />}
            {method === 'JWT' && <JWTLogin />}
            {method === 'Amplify' && <AmplifyLogin />}
          </Card>
        </Container>
      </MainContent>
    </>
  );
}

export default LoginCover;
