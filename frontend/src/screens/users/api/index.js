export const get_users = (success_callback, failure_callback) => ({
  url: '/users/',
  with_auth: true,
  success_callback,
  failure_callback,
});



