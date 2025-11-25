import React from 'react';
import { Card, Box, styled, Avatar, Typography, Checkbox } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const CardWrapper = styled(Card)(
  ({ theme }) => `
      transition: ${theme.transitions.create(['box-shadow'])};
      position: relative;
      border-radius: 0px;
      z-index: 5;
      width: 50%;
      border: 0.2px solid #cedbef;
      `
);

const PeopleCard = ({
  radioDesign = '',
  id,
  name,
  designation,
  profileUrl,
  isBrokerSelected = '',
  handleRadioSelected = {},
  giftStatus = '',
  email
}) => {
  return (
    <CardWrapper id={id}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {radioDesign && (
          <>
            <Checkbox
              checked={isBrokerSelected}
              onChange={(event) => handleRadioSelected(event, id, email)}
              value={isBrokerSelected}
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<RadioButtonCheckedIcon />}
            />
          </>
        )}

        <Avatar
          sx={{
            width: 54,
            height: 54
          }}
          alt="Remy Sharp"
          src={profileUrl}
        />

        <Box sx={{ ml: 3 }}>
          <Typography variant="h5">{name}</Typography>
          <Typography variant="subtitle1">{designation}</Typography>
          {giftStatus && <Typography> Invite Gift {giftStatus}</Typography>}
        </Box>
      </Box>
    </CardWrapper>
  );
};

export default PeopleCard;
