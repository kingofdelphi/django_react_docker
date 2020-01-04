import * as ActionTypes from './actionTypes';
import * as LoginStates from './login_states';
import * as UserActionTypes from '../userlist/actionTypes';

const initialState = {
  loginStatus: LoginStates.Fetching,
};

const login_info = (state = initialState, action) => {
  if (action.type === ActionTypes.SetLoginUserInfo) {
    state = {
      loginStatus: LoginStates.LoggedIn,
      ...action.data,
    };
  }
  if (action.type === UserActionTypes.UpdateUser) {
    if (state.id === action.data.userinfo.id) {
      state = {
        ...state,
        ...action.data.userinfo,
      };
    }
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

