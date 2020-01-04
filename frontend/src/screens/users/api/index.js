export const get_users = (success_callback, failure_callback) => ({
  url: '/users/',
  with_auth: true,
  success_callback,
  failure_callback,
});



export const delete_user = (id, success_callback, failure_callback) => ({
  url: `/users/${id}/`,
  method: 'DELETE',
  with_auth: true,
  success_callback,
  failure_callback,
});



