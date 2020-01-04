import * as ActionTypes from './actionTypes';

const makeApiCall = (params) => {
  return {
    type: ActionTypes.ApiCall, 
    data: params,
  }
};

export default makeApiCall;
