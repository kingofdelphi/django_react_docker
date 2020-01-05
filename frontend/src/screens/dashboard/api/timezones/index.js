const with_or_without_user = (url, username) => {
  if (!username) {
    return url;
  }
  return url + `?username=${username}`;
};

export const get_timezones = (username) => 
  ({
    url: with_or_without_user('/timezones/', username),
    with_auth: true,
  });

export const add_timezone = (timezone_info, username) =>
  ({
    url: with_or_without_user('/timezones/', username),
    data: timezone_info,
    with_auth: true,
  });

export const delete_timezone = (timezone_id) =>
  ({
    url: `/timezones/${timezone_id}/`,
    method: 'DELETE',
    with_auth: true,
  });


export const edit_timezone = (timezone_id, timezone_info) =>
  ({
    url: `/timezones/${timezone_id}/`,
    method: 'PUT',
    with_auth: true,
    data: timezone_info,
  });

