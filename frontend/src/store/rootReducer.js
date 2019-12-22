import { combineReducers } from 'redux';

import modalReducer from './modals/reducer';
import timeZoneReducer from './timezones/reducers';

const reducer = combineReducers({
  modals: modalReducer,
  timezones: timeZoneReducer,
});

export default reducer;
