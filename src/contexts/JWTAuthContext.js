// /* eslint-disable no-unused-vars */
// import { createContext, useEffect, useReducer } from 'react';
// import axios from 'src/utils/axios';
// import { verify, JWT_SECRET } from 'src/utils/jwt';
// import { useNavigate } from 'react-router';
// import PropTypes from 'prop-types';
// import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';
// import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';
// // import { userSession } from 'src/axiosInstances/Api';
// import { showNotification } from 'src/utils/commonUtility';
// import { notificationType } from 'src/constants/NotificationType';
// import { useDispatch } from 'react-redux';
// import { addUserInfo } from '../slices/auth';

// const initialAuthState = {
//   isAuthenticated: false,
//   isInitialized: false,
//   user: null
// };

// const setSession = (accessToken) => {
//   if (accessToken) {
//     localStorage.setItem('accessToken', accessToken);
//     axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//   } else {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('expiry');
//     delete axios.defaults.headers.common.Authorization;
//   }
// };

// const handlers = {
//   INITIALIZE: (state, action) => {
//     const { isAuthenticated, user } = action.payload;

//     return {
//       ...state,
//       isAuthenticated,
//       isInitialized: true,
//       user
//     };
//   },
//   LOGIN: (state, action) => {
//     const { user } = action.payload;

//     return {
//       ...state,
//       isAuthenticated: true,
//       user
//     };
//   },
//   LOGOUT: (state) => ({
//     ...state,
//     isAuthenticated: false,
//     user: null
//   }),
//   REGISTER: (state, action) => {
//     const { user } = action.payload;

//     return {
//       ...state,
//       isAuthenticated: true,
//       user
//     };
//   }
// };

// const reducer = (state, action) =>
//   handlers[action.type] ? handlers[action.type](state, action) : state;

// const AuthContext = createContext({
//   ...initialAuthState,
//   method: 'JWT',
//   login: () => Promise.resolve(),
//   logout: () => Promise.resolve(),
//   register: () => Promise.resolve()
// });

// export const AuthProvider = (props) => {
//   const { children } = props;
//   const [state, dispatch] = useReducer(reducer, initialAuthState);
//   const dispatchState = useDispatch();
//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         const accessToken = localStorage.getItem('accessToken');
//         const expiry = parseInt(localStorage.getItem('expiry'));
//         const currentTime = Date.now();
        
//         if (currentTime >= expiry) {
//           await logout();
//           const navigate = useNavigate();
//           navigate('/');
//         }

//         if (accessToken) {
//           setSession(accessToken);

//           // const response = await axios.get('/api/account/personal');
//           // const { user } = response.data;

//           dispatch({
//             type: 'INITIALIZE',
//             payload: {
//               isAuthenticated: true,
//               user: null
//             }
//           });
          
//           // const session = await userSession();

//           // localStorage.setItem('startTime',session.session.startTime);
//           // localStorage.setItem('endTime',session.session.endTime);
          
//         } else {
//           dispatch({
//             type: 'INITIALIZE',
//             payload: {
//               isAuthenticated: false,
//               user: null
//             }
//           });
//         }
//       } catch (err) {
//         console.error(err);
//         dispatch({
//           type: 'INITIALIZE',
//           payload: {
//             isAuthenticated: false,
//             user: null
//           }
//         });
//       }
//     };

//     initialize();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await axiosAPIInstanceProject.post('/auth/login', {
//         userId:email,
//         password,
//         appId: 'builder'
//       });
//       const { token, user } = response.data.data;
//       setSession(token);
//       localStorage.setItem('expiry', Date.now() + (86400000 * 360) );
//       dispatchState(addUserInfo(response?.data?.data));
//       localStorage.setItem('user', JSON.stringify(response?.data?.data));
//       dispatch({
//         type: 'LOGIN',
//         payload: {
//           user
//         }
//       });
//     } catch (error) {
//       let errorMessage = '';
//       if (error?.response?.status === 400) {
//         errorMessage = error?.response?.data?.message;
//       } else {
//         errorMessage =
//           error?.response?.data?.errors[0] || 'Something went wrong';
//       }
//       showNotification(errorMessage, notificationType.ERROR);
//     }
//   };

//   const logout = async () => {
//     const currentTime = new Date().toISOString();
//     const startTime = localStorage.getItem('startTime');

//     try {
//       await axiosAPIInstanceProject.put('/auth/sessionend', {
//         startTime,
//         endTime: currentTime
//       });
//     } catch (error) {
//       console.error('Failed to send start and end time to backend API:', error);
//     }

//     setSession(null);
//     dispatch({ type: 'LOGOUT' });
//   };

//   const resetPassword = async (email) => {
//     const response = await axiosApiInstance.get(`/resetPassword/${email}`);
//   };

//   const register = async (email, name, password) => {
//     const response = await axiosApiInstance.post('/api/account/register', {
//       email,
//       name,
//       password
//     });
//     const { token, user } = response.data;

//     window.localStorage.setItem('accessToken', token);
//     dispatch({
//       type: 'REGISTER',
//       payload: {
//         user
//       }
//     });
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         ...state,
//         method: 'JWT',
//         login,
//         resetPassword,
//         logout,
//         register
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired
// };

// export default AuthContext;


/* eslint-disable no-unused-vars */
import { createContext, useEffect, useReducer } from 'react';
import axios from 'src/utils/axios';
import { verify, JWT_SECRET } from 'src/utils/jwt';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import axiosAPIInstanceProject from 'src/axiosInstances/axiosInstanceProject';
import axiosApiInstance from 'src/axiosInstances/AxiosApiInstance';
// import { userSession } from 'src/axiosInstances/Api';
import { showNotification } from 'src/utils/commonUtility';
import { notificationType } from 'src/constants/NotificationType';
import { useDispatch } from 'react-redux';
import { addUserInfo } from '../slices/auth';

// Hardcoded credentials
const HARDCODED_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

// Hardcoded user data
const HARDCODED_USER = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
};

// Hardcoded token
const HARDCODED_TOKEN = 'hardcoded_jwt_token_12345';

const initialAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiry');
    delete axios.defaults.headers.common.Authorization;
  }
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const dispatchState = useDispatch();
  
  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const expiry = parseInt(localStorage.getItem('expiry'));
        const currentTime = Date.now();
        
        if (currentTime >= expiry) {
          await logout();
          const navigate = useNavigate();
          navigate('/');
        }

        if (accessToken) {
          setSession(accessToken);

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: HARDCODED_USER
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Hardcoded validation
      if (email === HARDCODED_CREDENTIALS.email && password === HARDCODED_CREDENTIALS.password) {
        const mockResponse = {
          data: {
            data: {
              token: HARDCODED_TOKEN,
              user: HARDCODED_USER
            }
          }
        };

        setSession(mockResponse.data.data.token);
        localStorage.setItem('expiry', Date.now() + (86400000 * 360));
        dispatchState(addUserInfo(mockResponse.data.data));
        localStorage.setItem('user', JSON.stringify(mockResponse.data.data));
        
        dispatch({
          type: 'LOGIN',
          payload: {
            user: mockResponse.data.data.user
          }
        });

        showNotification('Login successful!', notificationType.SUCCESS);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const errorMessage = error.message === 'Invalid credentials' 
        ? 'Invalid email or password. Try: admin@example.com / admin123'
        : 'Something went wrong';
      showNotification(errorMessage, notificationType.ERROR);
    }
  };

  const logout = async () => {
    const currentTime = new Date().toISOString();
    const startTime = localStorage.getItem('startTime');

    // No API call for logout in hardcoded mode
    console.log('Logout:', { startTime, endTime: currentTime });

    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = async (email) => {
    // Hardcoded reset password - just show notification
    await new Promise(resolve => setTimeout(resolve, 500));
    showNotification('Password reset link sent (simulated)', notificationType.SUCCESS);
  };

  const register = async (email, name, password) => {
    // Hardcoded registration - just show notification
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = {
      id: 2,
      email,
      name,
      role: 'user'
    };

    window.localStorage.setItem('accessToken', HARDCODED_TOKEN);
    dispatch({
      type: 'REGISTER',
      payload: {
        user: mockUser
      }
    });

    showNotification('Registration successful!', notificationType.SUCCESS);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        resetPassword,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;