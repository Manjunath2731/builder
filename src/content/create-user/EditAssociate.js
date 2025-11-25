import {
  Box,
  Card,
  Typography,
  Container,
  styled,
  IconButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Loader from 'src/UI/Loader/Loader.js';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import useAuth from 'src/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { addRoles } from '../../slices/roles';
import { addGroups, resetGroupAndUser } from '../../slices/groups';
import EditRegisterAssociate from './EditRegisterAssociate';

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

function EditAssociate() {
  const navigate = useNavigate();
  const { BuilderId } = useParams();
  const { method } = useAuth();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let associate = useSelector((state) => state.associate.associatesById);
  useEffect(() => {
    dispatch(addRoles());
    dispatch(addGroups());
  }, []);
  useEffect(() => {}, [associate]);

  const handleClose = () => {
    dispatch(resetGroupAndUser());
    navigate('/builder-dashboard/associate');
  };

  return (
    <>
      <Helmet>
        <title>Edit Builder</title>
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
                    {t('Edit Associate Admin')}
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
                  {t('Fill in the fields below to edit associate account.')}
                </Typography>
              </Box>
              {_.isEmpty(associate) && <Loader />}
              {method === 'JWT' &&
                BuilderId !== '' &&
                !_.isEmpty(associate) && (
                  <EditRegisterAssociate associate={associate} />
                )}
            </Card>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default EditAssociate;
