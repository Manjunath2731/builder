import { Box, Card, Typography, Container, styled } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RegisterUser from '../pages/Auth/Register/RegisterUser';
import {addRoles} from '../../slices/roles';
import {addGroups} from '../../slices/groups';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  () => `
  display: flex;
  width: 100%;
  flex: 1;
  padding: 20px;
`
);

function CreateUser() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addRoles());
    dispatch(addGroups());
  }, []);

 
  return (
    <>
      <Helmet>
        <title>Create user</title>
      </Helmet>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
            <Card
              sx={{
                mt: 3,
                px: 4,
                pt: 5,
                pb: 3
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  {t('Create User')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t('Fill in the fields below to create user account.')}
                </Typography>
              </Box>
               <RegisterUser />
               </Card>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default CreateUser;
