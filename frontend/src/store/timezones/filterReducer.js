import * as ActionTypes from './actionTypes';
import * as LoginActionTypes from '../login_info/actionTypes';

const timezoneFilter = (state = '', action) => {
  if (action.type === ActionTypes.SetTimeZoneListFilter) {
    state = action.data.filter;
  }
  if (action.type === LoginActionTypes.LogoutUser) {
    state = '';
  }
  return state;
};

export default timezoneFilter;
