import * as ActionTypes from './actionTypes';
import * as LoginStates from './login_states';

const initialState = {
  loginStatus: LoginStates.Fetching,
};

const login_info = (state = initialState, action) => {
  if (action.type === ActionTypes.SetLoginUserInfo) {
    state = {
      loginStatus: LoginStates.LoggedIn,
      id: action.data.id,
      username: action.data.username,
      role: action.data.role,
    };
  }
  if (action.type === ActionTypes.LogoutUser) {
    state = {
      loginStatus: LoginStates.GuestUser,
    };
  }
  if (action.type === ActionTypes.SetUserAsGuest) {
    state = {
      loginStatus: LoginStates.GuestUser,
    };
  }
  return state;
};

export default login_info;

