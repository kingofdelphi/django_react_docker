import * as ActionTypes from './actionTypes';

export const setUserList = (userlist) => {
  return {
    type: ActionTypes.SetUserList, 
    data: {
      userlist,
    }
  }
};

export const updateUser = (userinfo) => {
  return {
    type: ActionTypes.UpdateUser, 
    data: {
      userinfo,
    }
  }
};

export const deleteUser = (userinfo) => {
  return {
    type: ActionTypes.DeleteUser, 
    data: {
      userinfo,
    }
  }
};

export const addUser = (userinfo) => {
  return {
    type: ActionTypes.AddUser, 
    data: {
      userinfo,
    }
  }
};

