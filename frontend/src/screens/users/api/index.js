export const get_users = () => ({
  url: '/users/',
  with_auth: true,
});

export const delete_user = (id) => ({
  url: `/users/${id}/`,
  method: 'DELETE',
  with_auth: true,
});



