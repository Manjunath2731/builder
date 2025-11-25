import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
import {
  Card,
  Box,
  styled,
  Avatar,
  Typography,
  Button
} from '@mui/material';
import DeleteConfirmation from '../../components/Projects/Drafts/DeleteConfirmation.js';
import {
  getAssociateById,
  deleteAssociate,
  getAssociate
} from '../../slices/Associate.js';
import OpenNotification from '../ShowNotification/index.js';

const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      border-radius: 0px;
      z-index: 5;
      width: 100%;
      height: 100%;
      border: 0.2px solid #cedbef;
      `
);

const StyledAvatar = styled(Avatar)`
  img{
    object-fit:fill;
  }
`

const AssociateCard = ({
  name,
  number,
  email,
  id,
  profileUrl
}) => {
  let avatarName = '';
  if (name && name.includes(' ')) {
    avatarName = name.split(' ');
    avatarName = avatarName.shift().charAt(0) + avatarName.pop().charAt(0);
    avatarName = avatarName.toUpperCase();
  }
  const [isDelete, setDelete] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const handleEdit = (id) => {
    dispatch(getAssociateById(id));
    navigate(`/edit-associate/${id}`);
  };

  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);
    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };


  const handleDeleteCompleted = (id) => {
    setDelete(false);
    deleteAssociate(id).then((response) => {
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 202
      ) {
        const successMessage = 'Successfully deleted';
        setSuccessMessage(successMessage);
        setOpenNoti(true);
        // showNotification(successMessage, notificationType.SUCCESS);
        dispatch(getAssociate());
      } else {
        const failMessage = 'Something went wrong!!';
        setOpenNoti(true);
        setErrorMessage(failMessage);
        // showNotification(failMessage, notificationType.ERROR);
      }
    });
  };
  const handleClose = () => {
    setDelete(false);
  };
  const dispatch = useDispatch();
  const copy = (type) => {
    const el = document.createElement('input');
    el.value = type === 'number' ? number : email;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setOpenNoti(true);
    setSuccessMessage('Copied!');

    // showNotification('Copied!', notificationType.SUCCESS);
  };
  return (
    <>
      <CardWrapper id={id} sx={{ width: '100%', height: '100%' }}>
        <Box
          sx={{
            pl: { xs: 4, md: 2, xl: 4 },
            pt: 3,
            pb: 2,
            pr: { xs: 3, md: 2, xl: 3 },
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          {profileUrl ? (
            <StyledAvatar
              sx={{
                width: { xs: 112, md: 100, xl: 112 },
                height: { xs: 112, md: 100, xl: 112 },
                border: '4px solid #f4f4f4'
              }}
              alt="Remy Sharp"
              src={profileUrl}
            />
          ) : (
            <Avatar
              sx={{
                width: { xs: 112, md: 100, xl: 112 },
                height: { xs: 112, md: 100, xl: 112 },
                bgcolor: '#DBDBDB',
                fontSize: '35px'
              }}
            >
              {avatarName}
            </Avatar>
          )}
          <Box
            sx={{
              ml: 2,
              width: '100%'
            }}
          >
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', columnGap: 2 }}>
                <Typography variant="h5">{name.length > 40 ? `${name.slice(0, 40)}...` : name}</Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    handleEdit(id);
                  }}
                  sx={{
                    height: 24,
                    width: 64,
                    borderRadius: 0.5,
                    marginRight: 1
                  }}
                >
                  <Typography variant="body2">Edit</Typography>
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    height: 26,
                    width: 64,
                    borderRadius: 0.5,
                    marginRight: 1,
                    backgroundColor: '#f34423',
                    '&:hover': { background: '#f34423' }
                  }}
                  onClick={() => {
                    setDelete(true);
                  }}
                >
                  <Typography variant="body2">Delete</Typography>
                </Button>
              </Box>
            </Box>
            <hr
              style={{
                borderTop: 'dashed 2px',
                color: '#e6edf7',
                borderBottom: ' 0px'
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                columnGap: { xs: 5, md: 2, xl: 4, lg: 2 },
                rowGap: { xs: 2 },
                mt: 2,
                cursor: 'pointer'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <img src="/static/images/logo/call-icon-green.svg" alt="call" />
                <Typography
                  variant="subtitle1"
                  sx={{ ml: 1 }}
                  onClick={() => copy('number')}
                >
                  {number || 'N/A'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <img
                  src="/static/images/logo/email-icon-green.svg"
                  alt="email"
                />
                <Typography
                  variant="subtitle1"
                  onClick={() => copy('email')}
                  sx={{
                    ml: 1,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: { xs: '90%' }
                  }}
                >
                  {email || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
      </CardWrapper>
      {isDelete && (
        <DeleteConfirmation
          openConfirmDelete={isDelete}
          closeConfirmDelete={handleClose}
          handleDeleteCompleted={handleDeleteCompleted}
          selectedId={id}
          title="associate"
        />
      )}
    </>
  );
};

export default AssociateCard;
