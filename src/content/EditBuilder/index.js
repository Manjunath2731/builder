import { Box, Card, Typography, Container, styled ,IconButton} from '@mui/material';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
// import {navigateTo} from 'src/helpers/userHelpers';
import { addRoles } from '../../slices/roles';
import { addGroups } from '../../slices/groups';
import EditUserForm from './EditUserForm';

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

function EditUser() {
  const { method } = useAuth();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addRoles());
    dispatch(addGroups());
  }, []);
  const navigate = useNavigate();
  const handleClose = () => {
     navigate(`/`);
  };

  return (
    <>
      <Helmet>
        <title>Edit User</title>
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
              <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  {t('Edit Profile')}
                </Typography>
                <IconButton onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  </Box>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t('Fill in the fields below to edit your profile.')}
                </Typography>
              </Box>
              {method === 'JWT' && <EditUserForm />}
            </Card>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default EditUser;
