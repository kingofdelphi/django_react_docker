import { combineReducers } from 'redux';

import modalReducer from '../modals/reducer'

const reducer = combineReducers({
  modals: modalReducer,
});

export default reducer;
