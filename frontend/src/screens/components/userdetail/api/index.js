export const register = (data, success_callback, failure_callback) => ({
  url: '/users/',
  data,
  success_callback,
  failure_callback,
});


export const updateUser = (userid, data, success_callback, failure_callback) => ({
  url: `/users/${userid}/`,
  method: 'PUT',
  with_auth: true,
  data,
  success_callback,
  failure_callback,
});



