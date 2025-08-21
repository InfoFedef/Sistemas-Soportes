import { createContext, useContext, useReducer, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    const userData = Cookies.get('user_data');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token, user }
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('auth_token');
        Cookies.remove('user_data');
      }
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = (token, user) => {
    Cookies.set('auth_token', token, { expires: 1/48 }); // 30 minutos
    Cookies.set('user_data', JSON.stringify(user), { expires: 1/48 });
    
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { token, user }
    });
  };

  const logout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};