import E from '../../../utils';

export const get_timezones = (success_callback, failure_callback) => {
  fetch(
    E('/timezones/'),
    {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    }
  ).then(res => {
    if (res.status === 200) {
      res.json().then(success_callback);
    } else {
      failure_callback("Invalid credentials");
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred');
   });
};


export const delete_timezone = (timezone_id, success_callback, failure_callback) => {
  fetch(
    E(`/timezones/${timezone_id}`),
    {
      method: 'DELETE',
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    }
  ).then(res => {
    if (res.status === 204) {
      success_callback();
    } else {
      failure_callback("Couldnot delete");
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred');
   });
};


