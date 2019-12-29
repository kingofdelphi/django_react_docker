export const changePassword = (username, data, success_callback, failure_callback) => ({
  url: `/users/${username}/password/`,
  method: 'PUT',
  with_auth: true,
  data,
  success_callback,
  failure_callback,
});


