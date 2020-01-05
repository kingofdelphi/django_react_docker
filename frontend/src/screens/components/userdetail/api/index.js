export const register = (data, with_auth = false) => ({
  url: '/users/',
  data,
  with_auth,
});


export const updateUser = (userid, data) => ({
  url: `/users/${userid}/`,
  method: 'PUT',
  with_auth: true,
  data,
});



