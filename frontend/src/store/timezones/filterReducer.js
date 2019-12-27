import * as ActionTypes from './actionTypes';

const timezoneFilter = (state = '', action) => {
  if (action.type === ActionTypes.SetTimeZoneListFilter) {
    state = action.data;
  }
  return state;
};

export default timezoneFilter;



