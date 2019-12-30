export const get_user_list = (success_callback, failure_callback) => 
  ({
    url: '/users/',
    with_auth: true,
    success_callback,
    failure_callback,
  });



