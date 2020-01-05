export const register = (data) => ({
  url: '/users/',
  data,
});


export const updateUser = (userid, data) => ({
  url: `/users/${userid}/`,
  method: 'PUT',
  with_auth: true,
  data,
});



