import * as ActionTypes from './actionTypes';

import customFetch from '../../utils';

const apiCallMiddleWare = store => {
  const handleResponse = (response, action, context) => {
    const {
      with_auth,
      success_callback,
      failure_callback
    } = action.data;

    const {
      invalidateSession
    } = context;
    
    if (response.status === 200 || response.status === 201) {
      response.json().then(success_callback);
    } else if (response.status === 204) {
      success_callback();
    } else if (response.status === 401) {
      if (with_auth) { // we may check if state.loginInfo status is logged in or not
        // made a request with authorization
        invalidateSession();
      }
      failure_callback('Invalid credentials', {});
    } else if (response.status === 400) {
      response.json().then(errorObj => failure_callback('Some of the form fields are invalid', errorObj));
    } else {
      alert('unknown status code' + response.status);
    }
  };

  const decorateWithRemoveLoader = (fxn, context) => {
    return function (...args) {
      context.setLoading(false);
      const result = fxn.apply(this, args);
      return result;
    };
  };

  return next => (action, context) => {
    if (action.type === ActionTypes.ApiCall) {
      // patch callback to remove loader on response
      action.data.success_callback = decorateWithRemoveLoader(action.data.success_callback, context);
      action.data.failure_callback = decorateWithRemoveLoader(action.data.failure_callback, context);

      const { failure_callback } = action.data;

      context.setLoading(true);

      const api_promise = customFetch(action.data)
      api_promise.then(response => handleResponse(response, action, context))
        .catch((e) => {
          context.setConnectionStatus(false);
          failure_callback('Unexpected error occurred', {});
        });
      return;
    }
    return next(action)
  };
}

export default apiCallMiddleWare;
