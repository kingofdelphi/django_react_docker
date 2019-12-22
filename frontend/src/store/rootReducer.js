import { combineReducers } from 'redux';

import modalReducer from './modals/reducer';
import timeZoneReducer from './timezones/reducers';

console.log(modalReducer);
console.log(timeZoneReducer);

const reducer = combineReducers({
  modals: modalReducer,
  timezones: timeZoneReducer,
});

export default reducer;
