import customFetch from '../../../utils';

export const register = (data, success_callback, failure_callback) => {
  customFetch({
    url: '/users/',
    data,
    success_callback,
    failure_callback,
  });
};


