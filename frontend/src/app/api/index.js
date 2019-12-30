export const get_user_info = (success_callback, failure_callback) => 
  ({
    url: `/current_user/`,
    with_auth: true,
    success_callback,
    failure_callback,
  });



