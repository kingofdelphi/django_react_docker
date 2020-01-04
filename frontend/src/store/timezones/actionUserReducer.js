import * as ActionTypes from './actionTypes';
import * as LoginActionTypes from '../login_info/actionTypes';

const actionUser = (state = '', action) => {
  if (action.type === ActionTypes.SetActionUser) {
    state = action.data.username;
  }
  if (action.type === LoginActionTypes.LogoutUser) {
    state = '';
  }
  return state;
};

export default actionUser;
