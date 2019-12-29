export const get_timezones = (success_callback, failure_callback) => 
  ({
    url: '/timezones/',
    with_auth: true,
    success_callback,
    failure_callback,
  });


export const delete_timezone = (timezone_id, success_callback, failure_callback) =>
  ({
    url: `/timezones/${timezone_id}/`,
    method: 'DELETE',
    with_auth: true,
    success_callback,
    failure_callback,
  });


export const add_timezone = (timezone_info, success_callback, failure_callback) =>
  ({
    url: '/timezones/',
    data: timezone_info,
    with_auth: true,
    success_callback,
    failure_callback,
  });


export const edit_timezone = (id, timezone_info, success_callback, failure_callback) =>
  ({
    url: `/timezones/${id}/`,
    method: 'PUT',
    with_auth: true,
    data: timezone_info,
    success_callback,
    failure_callback,
  });



