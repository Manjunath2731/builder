import React, { useState } from 'react';
import { IconButton, Drawer } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const NotificationDrawer = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="logo"
        onClick={() => setIsDrawerOpen(true)}
      >
        <DragHandleIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {children}
      </Drawer>
    </>
  );
};

export default NotificationDrawer;
