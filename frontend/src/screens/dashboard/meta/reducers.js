import * as ActionTypes from './actionTypes';

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
  return state;
};

export default timezones;

