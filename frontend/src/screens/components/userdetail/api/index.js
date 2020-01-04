export const register = (data, success_callback, failure_callback, with_auth) => ({
  url: '/users/',
  data,
  success_callback,
  failure_callback,
  with_auth,
});


export const updateUser = (userid, data, success_callback, failure_callback) => ({
  url: `/users/${userid}/`,
  method: 'PUT',
  with_auth: true,
  data,
  success_callback,
  failure_callback,
});



