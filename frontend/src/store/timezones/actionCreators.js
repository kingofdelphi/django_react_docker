import * as ActionTypes from './actionTypes';

export const setTimeZoneList = (username, time_zone_list) => {
  return {
    type: ActionTypes.SetTimeZoneList, 
    data: {
      username,
      time_zone_list,
    }
  }
};

export const setActionUser = (username) => {
  return {
    type: ActionTypes.SetActionUser, 
    data: {
      username,
    }
  }
};

export const addTimeZoneDetail = (username, time_zone_detail) => {
  return {
    type: ActionTypes.AddTimeZoneDetail, 
    data: {
      username,
      time_zone_detail,
    }
  }
};

export const updateTimeZoneDetail = (username, time_zone_detail) => {
  return {
    type: ActionTypes.UpdateTimeZoneDetail, 
    data: {
      username,
      time_zone_detail,
    }
  }
};


export const deleteTimeZoneDetail = (username, time_zone_detail) => {
  return {
    type: ActionTypes.DeleteTimeZoneDetail, 
    data: {
      username,
      time_zone_detail,
    }
  }
};

export const setTimeZoneListFilter = (filter) => {
  return {
    type: ActionTypes.SetTimeZoneListFilter, 
    data: {
      filter,
    }
  }
};

