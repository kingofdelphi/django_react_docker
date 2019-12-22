import { combineReducers } from 'redux';

import modalReducer from '../modals/reducer';
import timeZoneReducer from '../screens/dashboard/meta/reducers';

const reducer = combineReducers({
  modals: modalReducer,
  timezones: timeZoneReducer,
});

export default reducer;
