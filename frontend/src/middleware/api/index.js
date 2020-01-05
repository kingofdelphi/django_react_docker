import * as ActionTypes from './actionTypes';
import * as LoginActionTypes from '../../store/login_info/actionTypes';
import * as LoginStates from '../../store/login_info/login_states';

import customFetch from '../../utils';

const apiCallMiddleWare = store => {
  const handleResponse = (response, action, success_callback, failure_callback, context) => {
    const {
      with_auth,
    } = action.data;

    const {
      invalidateSession
    } = context;
    
    if (response.status === 200 || response.status === 201) {
      response.json().then(success_callback);
    } else if (response.status === 204) {
      success_callback();
    } else if (response.status === 401) {
      if (with_auth && store.getState().loginInfo && store.getState().loginInfo.loginStatus === LoginStates.LoggedIn) {
        // made a request with authorization, previously logged in but credentials have expired now
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

  return next => (action, ...extraArgs) => {
    if (action.type === ActionTypes.ApiCall) {
      // patch callback to remove loader on response
      const [success_callback, failure_callback, context] = extraArgs;
      const decorated_success_callback = decorateWithRemoveLoader(success_callback, context);
      const decorated_failure_callback = decorateWithRemoveLoader(failure_callback, context);

      context.setLoading(true);

      const api_promise = customFetch(action.data)
      api_promise.then(response => handleResponse(response, action, decorated_success_callback, decorated_failure_callback, context))
        .catch((e) => {
          console.log(e);
          context.setConnectionStatus(false);
          decorated_failure_callback('Unexpected error occurred', {});
        });
      return;
    }
    if (action.type === LoginActionTypes.LogoutUser) {
      localStorage.removeItem('token');
    }
    if (action.type === LoginActionTypes.SetLoginUserInfo) {
      // this is also called when page refreshes after logged in
      const { data: userInfo } = action;
      if (userInfo.token) {
        // during login token is obtained
        localStorage.setItem('token', userInfo.token);
        delete action.data.token;
      }
      action.data = { ...userInfo };
    }
    return next(action)
  };
}

export default apiCallMiddleWare;
