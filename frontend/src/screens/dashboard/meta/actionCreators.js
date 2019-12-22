import * as ActionTypes from './actionTypes';

export const addTimeZoneDetail = (time_zone_detail) => {
  return {
    type: ActionTypes.ADD_TIME_ZONE_DETAIL, 
    data: time_zone_detail,
  }
};

export const setTimeZoneList = (time_zone_list) => {
  return {
    type: ActionTypes.SET_TIME_ZONE_LIST, 
    data: time_zone_list,
  }
};

export const deleteTimeZoneDetail = (time_zone_detail) => {
  return {
    type: ActionTypes.DELETE_TIME_ZONE_DETAIL, 
    data: time_zone_detail,
  }
};

