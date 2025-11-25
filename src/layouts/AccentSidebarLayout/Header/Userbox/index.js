// import { useRef, useState, useEffect } from 'react';
// import useAuth from 'src/hooks/useAuth';
// import { NavLink, useLocation, useNavigate } from 'react-router-dom';
// // import {format} from 'timeago.js';

// import {
//   Avatar,
//   Box,
//   Button,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   Popover,
//   Typography,
//   styled
// } from '@mui/material';
// import { format as timeAgoFormat } from 'timeago.js';
// import { useTranslation } from 'react-i18next';
// import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
// // import EditIcon from '@mui/icons-material/Edit';
// import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
// import { isSuperAdmin, isAssociateAdmin } from 'src/helpers/userHelpers';
// import { userSession } from '../../../../../src/axiosInstances/Api';

// const UserBoxButton = styled(Button)(
//   ({ theme }) => `
//         padding: ${theme.spacing(0, 1)};
//         height: ${theme.spacing(7)};
// `
// );

// const MenuUserBox = styled(Box)(
//   ({ theme }) => `
//         background: ${theme.colors.alpha.black[5]};
//         padding: ${theme.spacing(2)};
// `
// );

// const UserBoxText = styled(Box)(
//   ({ theme }) => `
//         text-align: left;
//         padding-left: ${theme.spacing(1)};
// `
// );

// const UserBoxLabel = styled(Typography)(
//   ({ theme }) => `
//         font-weight: ${theme.typography.fontWeightBold};
//         color: ${theme.palette.secondary.main};
//         display: block;
// `
// );

// const UserBoxDescription = styled(Typography)(
//   ({ theme }) => `
//         color: ${theme.palette.secondary.light}
// `
// );

// function HeaderUserbox() {
//   const { t } = useTranslation();
//   // const location = useLocation();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const userData = JSON.parse(window.localStorage.getItem('user'));
//   const { logout } = useAuth();

//   const ref = useRef(null);
//   const [isOpen, setOpen] = useState(false);


//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };
//   const handleResetPassword = () => {
//     handleClose();
//   };

//   const handleLogout = async () => {
//     try {
//       handleClose();
//       await logout();
//       localStorage.clear();
//       navigate('/');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const [session, setSession] = useState('');
//   // useEffect(async () => {
//   //   const sess = await userSession();
//   //   const data = Date.now() - Date.parse(sess.session.endTime);
//   //   const minutes = Math.floor(data / (1000 * 60));
//   //   console.log("minutes:", minutes);
//   //   setSession(minutes);
//   // }, [])

//   useEffect(async () => {
//     const sess = await userSession();
//     // <<<<<<< HEAD

//     const timeAgoString = timeAgoFormat(sess.session.endTime);

//     // console.log("time ago:", timeAgoString);
//     setSession(timeAgoString);
//   }, []);


//   return (
//     <>
//       {userData?.roleName === 'VIP_ADMIN' && location.pathname !== '/vip-dashboard' && (
//         <Box sx={{ mt: -1.3 }}>
//           <Typography
//             component={NavLink}
//             to="/vip-dashboard"
//             sx={{
//               color: '#4991F4',
//               "&:hover": {
//                 color: '#0078E9',
//                 backgroundColor: '#e3f2ff',
//                 padding: '8px',
//                 borderRadius: '5px'
//               },
//               fontSize: '15px',
//               fontWeight: 'bold',
//               mr: 13
//             }}>
//             VIP Dashboard
//           </Typography>
//         </Box>
//       )}

//       <UserBoxButton color="primary" ref={ref} onClick={handleOpen}>

//         <Box
//           component="span"
//           sx={{
//             display: { xs: 'none', md: 'inline-block' }
//           }}
//         >
//           <UserBoxText display='flex' flexDirection='column' alignItems='flex-end' marginRight='1rem'>
//             <Box display='flex' justifyContent='center' alignItems='center'>
//               {userData?.roleName === 'VIP_ADMIN' ? (
//                 <UserBoxLabel variant="body1" sx={{ color: "#589AF5" }}>VIP ADMIN</UserBoxLabel>
//               ) : (
//                 <Box display='flex'>
//                   <Box variant="body1" marginRight='0.3rem'>{`${userData?.first_name} ${userData?.last_name || ''}`}</Box>
//                   <UserBoxDescription variant="body2">
//                     {`(${userData?.roleName?.toLowerCase()})`}
//                   </UserBoxDescription>
//                   <ExpandMoreTwoToneIcon />
//                 </Box>


//               )}

//             </Box>
//             <UserBoxDescription variant="body2">{`Last active ${session}`}</UserBoxDescription>
//           </UserBoxText>
//         </Box>
//         {/* <Box
//           component="span"
//           sx={{
//             display: { xs: 'none', sm: 'inline-block' },
//             marginRight: '0.3rem'
//           }}
          
//         >
          
//         </Box> */}
//         <Avatar
//           // variant="square"
//           alt={userData?.first_name}
//           src={userData?.profileImage}
//           sx={{ objectFit: 'fill' }}
//         />
//       </UserBoxButton>

//       <Popover
//         disableScrollLock
//         anchorEl={ref.current}
//         onClose={handleClose}
//         open={isOpen}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right'
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right'
//         }}
//       >
//         <MenuUserBox
//           sx={{
//             minWidth: 210
//           }}
//           display="flex"
//         >
//           <Avatar
//             // variant="square"
//             alt={userData?.first_name}
//             src={userData?.profileImage}
//             sx={{ objectFit: 'fill' }}
//           />
//           <UserBoxText>
//             <UserBoxLabel variant="body1"><UserBoxLabel variant="body1">
//               {userData?.roleName === 'VIP_ADMIN' ? 'Vip Admin' : `${userData?.first_name} ${userData?.last_name || ''}`}
//             </UserBoxLabel>
//             </UserBoxLabel>
//             <UserBoxDescription variant="body2">
//               {userData?.roleName}
//             </UserBoxDescription>
//           </UserBoxText>
//         </MenuUserBox>
//         {!(isSuperAdmin() || isAssociateAdmin()) && (
//           <Divider
//             sx={{
//               mb: 0
//             }}
//           />
//         )}
//         {!(isSuperAdmin() || isAssociateAdmin()) && (
//           <List
//             sx={{
//               p: 1
//             }}
//             component="nav"
//           >
//             <ListItem
//               onClick={() => {
//                 handleClose();
//               }}
//               button
//               to="/edit-profile"
//               component={NavLink}
//             >
//               {/* <EditIcon fontSize="small" /> */}
//               <ListItemText primary={t('Edit Profile')} />
//             </ListItem>
//             <ListItem
//               onClick={() => {
//                 handleResetPassword();
//               }}
//               button
//               to="/account/resetpassword"
//               component={NavLink}
//             >
//               {/* <EditIcon fontSize="small" /> */}
//               <ListItemText primary={t('Reset Password')} />
//             </ListItem>
//             <ListItem
//               button
//               onClick={() => {
//                 handleClose();
//                 window.open('/account/terms-conditions', '_blank');
//               }}
//             >
//               <ListItemText primary={t('Terms & Condition')} />
//             </ListItem>
//             <ListItem button
//               onClick={() => {
//                 handleClose();
//                 window.open('/account/security', '_blank');
//               }}>
//               <ListItemText primary={t('Security')} />
//             </ListItem>
//             <ListItem button
//               onClick={() => {
//                 handleClose();
//                 window.open('/account/help', '_blank');
//               }}>
//               <ListItemText primary={t('Help')} />
//             </ListItem>
//           </List>
//         )}
//         <Divider />
//         <Box m={1}>
//           <Button color="primary" fullWidth onClick={handleLogout}>
//             <LockOpenTwoToneIcon
//               sx={{
//                 mr: 1
//               }}
//             />
//             {t('Sign out')}
//           </Button>
//         </Box>
//       </Popover>
//     </>
//   );
// }

// export default HeaderUserbox;

import { useRef, useState, useEffect } from 'react';
import useAuth from 'src/hooks/useAuth';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
  styled
} from '@mui/material';
import { format as timeAgoFormat } from 'timeago.js';
import { useTranslation } from 'react-i18next';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { isSuperAdmin, isAssociateAdmin } from 'src/helpers/userHelpers';
// import { userSession } from '../../../../../src/axiosInstances/Api';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding: ${theme.spacing(0, 1)};
        height: ${theme.spacing(7)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${theme.palette.secondary.light}
`
);

function HeaderUserbox() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const userDataString = window.localStorage.getItem('user');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  
  // Extract user info - handle both old and new data structures
  const userInfo = userData?.user || userData;
  const firstName = userInfo?.first_name || userInfo?.name?.split(' ')[0] || 'User';
  const lastName = userInfo?.last_name || userInfo?.name?.split(' ').slice(1).join(' ') || '';
  const roleName = userInfo?.roleName || userInfo?.role || 'user';
  const profileImage = userInfo?.profileImage || '';
  // const email = userInfo?.email || '';

  const { logout } = useAuth();

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [session, setSession] = useState('just now');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleResetPassword = () => {
    handleClose();
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      localStorage.clear();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Hardcoded session time for now
    // If you want to use real session tracking, uncomment the userSession API call
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const timeAgoString = timeAgoFormat(loginTime);
      setSession(timeAgoString);
    } else {
      // Set login time if not exists
      const now = new Date().toISOString();
      localStorage.setItem('loginTime', now);
      setSession('just now');
    }

    // Uncomment below when API is available
    /*
    const fetchSession = async () => {
      try {
        const sess = await userSession();
        const timeAgoString = timeAgoFormat(sess.session.endTime);
        setSession(timeAgoString);
      } catch (error) {
        console.error('Failed to fetch session:', error);
      }
    };
    fetchSession();
    */
  }, []);

  return (
    <>
      {roleName === 'VIP_ADMIN' && location.pathname !== '/vip-dashboard' && (
        <Box sx={{ mt: -1.3 }}>
          <Typography
            component={NavLink}
            to="/vip-dashboard"
            sx={{
              color: '#4991F4',
              "&:hover": {
                color: '#0078E9',
                backgroundColor: '#e3f2ff',
                padding: '8px',
                borderRadius: '5px'
              },
              fontSize: '15px',
              fontWeight: 'bold',
              mr: 13
            }}>
            VIP Dashboard
          </Typography>
        </Box>
      )}

      <UserBoxButton color="primary" ref={ref} onClick={handleOpen}>
        <Box
          component="span"
          sx={{
            display: { xs: 'none', md: 'inline-block' }
          }}
        >
          <UserBoxText display='flex' flexDirection='column' alignItems='flex-end' marginRight='1rem'>
            <Box display='flex' justifyContent='center' alignItems='center'>
              {roleName === 'VIP_ADMIN' ? (
                <UserBoxLabel variant="body1" sx={{ color: "#589AF5" }}>VIP ADMIN</UserBoxLabel>
              ) : (
                <Box display='flex'>
                  <Box variant="body1" marginRight='0.3rem'>
                    {`${firstName} ${lastName}`.trim()}
                  </Box>
                  <UserBoxDescription variant="body2">
                    {`(${roleName?.toLowerCase()})`}
                  </UserBoxDescription>
                  <ExpandMoreTwoToneIcon />
                </Box>
              )}
            </Box>
            <UserBoxDescription variant="body2">
              {`Last active ${session}`}
            </UserBoxDescription>
          </UserBoxText>
        </Box>
        <Avatar
          alt={firstName}
          src={profileImage}
          sx={{ objectFit: 'fill' }}
        >
          {!profileImage && firstName.charAt(0).toUpperCase()}
        </Avatar>
      </UserBoxButton>

      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox
          sx={{
            minWidth: 210
          }}
          display="flex"
        >
          <Avatar
            alt={firstName}
            src={profileImage}
            sx={{ objectFit: 'fill' }}
          >
            {!profileImage && firstName.charAt(0).toUpperCase()}
          </Avatar>
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {roleName === 'VIP_ADMIN' ? 'Vip Admin' : `${firstName} ${lastName}`.trim()}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {roleName}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        {!(isSuperAdmin() || isAssociateAdmin()) && (
          <Divider
            sx={{
              mb: 0
            }}
          />
        )}
        {!(isSuperAdmin() || isAssociateAdmin()) && (
          <List
            sx={{
              p: 1
            }}
            component="nav"
          >
            <ListItem
              onClick={() => {
                handleClose();
              }}
              button
              to="/edit-profile"
              component={NavLink}
            >
              <ListItemText primary={t('Edit Profile')} />
            </ListItem>
            <ListItem
              onClick={() => {
                handleResetPassword();
              }}
              button
              to="/account/resetpassword"
              component={NavLink}
            >
              <ListItemText primary={t('Reset Password')} />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                handleClose();
                window.open('/account/terms-conditions', '_blank');
              }}
            >
              <ListItemText primary={t('Terms & Condition')} />
            </ListItem>
            <ListItem button
              onClick={() => {
                handleClose();
                window.open('/account/security', '_blank');
              }}>
              <ListItemText primary={t('Security')} />
            </ListItem>
            <ListItem button
              onClick={() => {
                handleClose();
                window.open('/account/help', '_blank');
              }}>
              <ListItemText primary={t('Help')} />
            </ListItem>
          </List>
        )}
        <Divider />
        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon
              sx={{
                mr: 1
              }}
            />
            {t('Sign out')}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;