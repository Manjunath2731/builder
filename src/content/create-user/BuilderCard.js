/* eslint-disable camelcase */
import React, { useState } from 'react';
import {
  Card,
  Box,
  styled,
  CardMedia,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { isSuperAdmin } from 'src/helpers/userHelpers';
import { format } from 'date-fns';
import { getGroupById, addGroups } from '../../slices/groups';
import BuilderDetailModal from './BuilderDetailModal';
import DeleteConfirmation from '../../components/Projects/Drafts/DeleteConfirmation.js';
import { deleteBuilder } from '../../axiosInstances/Api';

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

const DividerContrast = styled(Divider)(
  ({ theme }) => `
    background: ${theme.palette.grey[500]};
  `
);

const BuilderCard = ({
  item,
  name,
  description,
  address,
  city,
  id,
  profileUrl,
  created_at,
  updated_at
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const closeDetail = () => {
    setOpen(false);
  };
  const handleDoubleClick = (item) => {
    dispatch(getGroupById(item?._id));
    setOpen(true);
  };
  const handleEdit = (item) => {
    dispatch(getGroupById(item?._id));
    navigate(`/Edit-builder/${item?._id}`);
  };
  const handleDeleteCompleted = (id) => {
    setDelete(false);
    deleteBuilder(id).then(() => {
      dispatch(addGroups());
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteClose = () => {
    setDelete(false);
  };
  return (
    <>
      <CardWrapper
        id={id}
        onDoubleClick={() => handleDoubleClick(item)}
        sx={{ height: '100%',cursor:'pointer' }}
      >
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
          <CardMedia
            component="img"
            sx={{
              width: 94,
              height: 94,
              resizeMode: 'contain',
              objectFit: 'fill'
            }}
            alt="Company Logo"
            src={profileUrl}
          />
          <Box sx={{ ml: 3, width: '100%', flexDirection: 'column' }}>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography variant="h5">{name}</Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    height: 26,
                    width: 64,
                    borderRadius: 0.5,
                    marginRight: 1
                  }}
                  onClick={() => handleEdit(item)}
                >
                  <Typography variant="body2">Edit</Typography>
                </Button>
                {isSuperAdmin() && (
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
                    onClick={() => setDelete(true)}
                  >
                    <Typography variant="body2">Delete</Typography>
                  </Button>
                )}
              </Box>
            </Box>
            <hr
              style={{
                borderTop: 'dashed 2px',
                color: '#e6edf7',
                borderBottom: ' 0px'
              }}
            />
            <Typography variant="subtitle1">{description}</Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline',
                width: 'box-sizing'
              }}
            >
              <Typography variant="h5"> Address : </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  ml: 1,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: {
                    xs: '400px',
                    md: '250px',
                    lg: '260px',
                    xl: '400px'
                  }
                }}
              >
                {address}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline'
              }}
            >
              <Typography variant="h5"> City : </Typography>
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {city}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Typography> <b>Created on</b> : {format(new Date(created_at), 'dd MMM yyyy')}</Typography>
              <DividerContrast orientation='vertical'/>
              <Typography ml={1}> <b>Last modified</b> : {format(new Date(updated_at), 'dd MMM yyyy')}</Typography>
            </Box>
          </Box>
        </Box>
      </CardWrapper>
      {open && (
        <BuilderDetailModal
          open={open}
          handleClose={handleClose}
          closeDetail={closeDetail}
        />
      )}
      {isDelete && (
        <DeleteConfirmation
          openConfirmDelete={isDelete}
          closeConfirmDelete={handleDeleteClose}
          handleDeleteCompleted={handleDeleteCompleted}
          selectedId={id}
          title="builder"
        />
      )}
    </>
  );
};

export default BuilderCard;
