import * as ActionTypes from './actionTypes';

export const setLoginUserInfo = (loginInfo) => {
  return {
    type: ActionTypes.SetLoginUserInfo,
    data: {
      username: loginInfo.username,
    },
  }
};

export const setUserAsGuest = () => {
  return {
    type: ActionTypes.SetUserAsGuest,
  }
};



export const logoutUser = () => {
  return {
    type: ActionTypes.LogoutUser,
  }
};


