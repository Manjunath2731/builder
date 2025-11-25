import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import { blue } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import { Button, Box, CircularProgress } from '@mui/material';
import { getTeams } from 'src/slices/team';

const DetailsPopup = ({
  open,
  onClose,
  // totalBrokers,
  handleAssign,
  isAssign
}) => {
  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState([]);
  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (item) => {
    setSelectedValue(item);
  };

  const team = useSelector((state) => state.team?.teamList);
  useEffect(() => {
    dispatch(getTeams());
  }, []);

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Select Team Member
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {team.map((item, index) => (
          <ListItemButton
            role={undefined}
            onClick={() => handleListItemClick(item?._id)}
            key={index}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={selectedValue.indexOf(item._id) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{
                  'aria-labelledby': `checkbox-list-label-${item?._id}`
                }}
              />
            </ListItemIcon>
            <ListItemAvatar>
              <Avatar
                sx={{ bgcolor: blue[100], color: blue[600] }}
                src={item?.profileImage}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${item?.first_name} ${item?.last_name ? item?.last_name : ''
                }`}
              secondary={item?.email}
            />
          </ListItemButton>
        ))}
      </List>
      <Box my={3} mx={3} sx={{ display: 'flex', flexDirection: 'row' }}>
        <Button
          variant="contained"
          startIcon={isAssign ? <CircularProgress size="1rem" /> : null}
          onClick={() => handleAssign(selectedValue)}
        >
          Assign
        </Button>
        <Button sx={{ ml: 2 }} variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
};

export default DetailsPopup;
