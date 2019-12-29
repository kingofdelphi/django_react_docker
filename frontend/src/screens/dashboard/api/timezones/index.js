import customFetch from '../../../../utils';

export const get_timezones = (success_callback, failure_callback) => {
  customFetch({
    url: '/timezones/',
    with_auth: true
  }).then(res => {
    if (res.status === 200) {
      res.json().then(success_callback);
    } else {
      failure_callback("Invalid credentials");
    }
  }).catch((e) => {
    console.log(e);
    failure_callback('Unexpected error occurred');
  });
};


export const delete_timezone = (timezone_id, success_callback, failure_callback) => {
  customFetch({
    url: `/timezones/${timezone_id}/`,
    method: 'DELETE',
    with_auth: true,
  }).then(res => {
    if (res.status === 204) {
      success_callback();
    } else {
      failure_callback("Couldnot delete");
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred');
   });
};


export const add_timezone = (timezone_info, success_callback, failure_callback) => {
  customFetch({
    url: '/timezones/',
    data: timezone_info,
    with_auth: true
  }).then(res => {
    if (res.status === 201) {
      res.json().then(success_callback);
    } else {
      res.json().then(failure_callback);
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred');
   });
};


export const edit_timezone = (id, timezone_info, success_callback, failure_callback) => {
  customFetch({
    url: `/timezones/${id}/`,
    method: 'PUT',
    with_auth: true,
    data: timezone_info,
  }).then(res => {
    if (res.status === 200) {
      res.json().then(success_callback);
    } else {
      res.json().then(failure_callback);
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred');
  });
};



