import * as ActionTypes from './actionTypes';

export const setTimeZoneList = (time_zone_list) => {
  return {
    type: ActionTypes.SET_TIME_ZONE_LIST, 
    data: time_zone_list,
  }
};

export const addTimeZoneDetail = (time_zone_detail) => {
  return {
    type: ActionTypes.ADD_TIME_ZONE_DETAIL, 
    data: time_zone_detail,
  }
};

export const updateTimeZoneDetail = (time_zone_detail) => {
  return {
    type: ActionTypes.UPDATE_TIME_ZONE_DETAIL, 
    data: time_zone_detail,
  }
};


export const deleteTimeZoneDetail = (time_zone_detail) => {
  return {
    type: ActionTypes.DELETE_TIME_ZONE_DETAIL, 
    data: time_zone_detail,
  }
};

export const setTimeZoneListFilter = (filter) => {
  return {
    type: ActionTypes.SetTimeZoneListFilter, 
    data: filter,
  }
};

