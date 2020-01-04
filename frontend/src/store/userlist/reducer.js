import * as ActionTypes from './actionTypes';
import * as LoginActionTypes from '../login_info/actionTypes';

const userList = (state = [], action) => {
  const { data } = action;
  if (action.type === ActionTypes.AddUser) {
    state = [...state, data.userinfo];
  }
  if (action.type === ActionTypes.SetUserList) {
    state = data.userlist;
  }
  if (action.type === ActionTypes.DeleteUser) {
      state = state.filter(user => user.id !== data.userinfo.id);
  }
  if (action.type === ActionTypes.UpdateUser) {
    const { userinfo } = data;
    state = state.map(user => user.id === userinfo.id ? userinfo : user);
  }
  if (action.type === LoginActionTypes.LogoutUser) {
    state = [];
  }
  return state;
};

export default userList;



