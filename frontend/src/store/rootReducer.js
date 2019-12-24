import { combineReducers } from 'redux';

import modalReducer from './modals/reducer';
import timeZoneReducer from './timezones/reducers';
import loginInfoReducer from './login_info/reducers';

const reducer = combineReducers({
  modals: modalReducer,
  timezones: timeZoneReducer,
  loginInfo: loginInfoReducer,
});

export default reducer;
