import * as ActionTypes from './actionTypes';
import * as LoginActionTypes from '../login_info/actionTypes';

const timezones = (state = {}, action) => {
  const { data } = action;
  if (action.type === ActionTypes.AddTimeZoneDetail) {
    const { username, time_zone_detail } = data;
    const old_list = state[username] || [];
    state = {
      ...state,
      [username]: [...old_list, time_zone_detail],
    }
  }
  if (action.type === ActionTypes.SetTimeZoneList) {
    const { username, time_zone_list } = data;
    state = {
      ...state,
      [username]: time_zone_list,
    }
  }
  if (action.type === ActionTypes.DeleteTimeZoneDetail) {
    const { username, time_zone_detail } = data;
    const old_list = state[username] || [];
    state = {
      ...state,
      [username]: old_list.filter(tz => tz.id !== time_zone_detail.id),
    }
  }
  if (action.type === ActionTypes.UpdateTimeZoneDetail) {
    const { username, time_zone_detail } = data;
    const old_list = state[username] || [];
    state = {
      ...state,
      [username]: old_list.map(tz => tz.id === time_zone_detail.id ? time_zone_detail : tz),
    }
  }
  if (action.type === LoginActionTypes.LogoutUser) {
    state = {};
  }
  return state;
};

export default timezones;


