export const changePassword = (userid, data) => ({
  url: `/users/${userid}/password/`,
  method: 'PUT',
  with_auth: true,
  data,
});


