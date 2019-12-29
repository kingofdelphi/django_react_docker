import customFetch from '../../../utils';

export const login = (data, success_callback, failure_callback) => {
  customFetch({
    url: '/login/',
    method: "POST",
    data,
    success_callback,
    failure_callback,
  });
};

