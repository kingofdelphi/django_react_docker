import customFetch from '../../../utils';

export const login = (data, success_callback, failure_callback) => {
  customFetch({
    url: '/login/',
    method: "POST",
    data,
  }).then(res => {
    if (res.status === 200) {
      res.json().then(success_callback);
    } else if (res.status === 401) {
      failure_callback('Invalid credentials', {});
    } else {
      res.json().then(errors => failure_callback('Some of the form fields are invalid', errors));
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred', {});
  });
};

