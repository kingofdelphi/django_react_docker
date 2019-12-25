import * as ActionTypes from './actionTypes';
import * as LoginActionTypes from '../login_info/actionTypes';

const timezones = (state = [], action) => {
  if (action.type === ActionTypes.ADD_TIME_ZONE_DETAIL) {
    state = [...state, action.data];
  }
  if (action.type === ActionTypes.SET_TIME_ZONE_LIST) {
    state = action.data;
  }
  if (action.type === ActionTypes.DELETE_TIME_ZONE_DETAIL) {
    state = state.filter(tz => tz.id !== action.data.id);
  }
  if (action.type === ActionTypes.UPDATE_TIME_ZONE_DETAIL) {
    state = state.map(tz => tz.id === action.data.id ? action.data : tz);
  }
  if (action.type === LoginActionTypes.LogoutUser) {
    state = [];
  }
  return state;
};

export default timezones;


