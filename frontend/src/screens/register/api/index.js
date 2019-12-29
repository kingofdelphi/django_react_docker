import customFetch from '../../../utils';

export const register = (data, success_callback, failure_callback) => {
  customFetch({
    url: '/users/',
    method: "POST",
    data,
  }).then(res => {
    if (res.status === 201) {
      res.json().then(success_callback);
    } else {
      res.json().then(errors => failure_callback('Some of the form fields are invalid', errors));
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred', {});
  });
};


