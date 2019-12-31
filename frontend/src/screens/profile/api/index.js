export const changePassword = (userid, data, success_callback, failure_callback) => ({
  url: `/users/${userid}/password/`,
  method: 'PUT',
  with_auth: true,
  data,
  success_callback,
  failure_callback,
});


