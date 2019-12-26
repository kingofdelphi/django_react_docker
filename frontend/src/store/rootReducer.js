import { combineReducers } from 'redux';

import timeZoneReducer from './timezones/reducers';
import loginInfoReducer from './login_info/reducers';

const reducer = combineReducers({
  timezones: timeZoneReducer,
  loginInfo: loginInfoReducer,
});

export default reducer;
