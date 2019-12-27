import { combineReducers } from 'redux';

import timeZoneReducer from './timezones/reducers';
import loginInfoReducer from './login_info/reducers';
import timeZoneFilterReducer from './timezones/filterReducer';

const reducer = combineReducers({
  timezones: timeZoneReducer,
  loginInfo: loginInfoReducer,
  timeZoneFilter: timeZoneFilterReducer,
});

export default reducer;
