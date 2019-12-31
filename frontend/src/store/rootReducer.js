import { combineReducers } from 'redux';

import timeZoneReducer from './timezones/reducers';
import loginInfoReducer from './login_info/reducers';
import timeZoneFilterReducer from './timezones/filterReducer';
import actionUserReducer from './timezones/actionUserReducer';
import userReducer from './userlist/reducer';

const reducer = combineReducers({
  timezones: timeZoneReducer,
  loginInfo: loginInfoReducer,
  timeZoneFilter: timeZoneFilterReducer,
  actionUser: actionUserReducer,
  userList: userReducer,
});

export default reducer;
