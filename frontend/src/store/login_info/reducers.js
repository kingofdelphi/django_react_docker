import * as ActionTypes from './actionTypes';
import * as LoginStates from './login_states';

const initialState = {
  loginStatus: LoginStates.Fetching,
};

const login_info = (state = initialState, action) => {
  if (action.type === ActionTypes.SetLoginUserInfo) {
    state = {
      loginStatus: LoginStates.LoggedIn,
      username: action.data.username,
    };
  }
  if (action.type === ActionTypes.LogoutUser) {
    state = {
      loginStatus: LoginStates.GuestUser,
    };
  }
  if (action.type === ActionTypes.SetGuestUser) {
    state = {
      loginStatus: LoginStates.GuestUser,
    };
  }
  return state;
};

export default login_info;

