import E from '../../../../../utils';

export const add_timezone = (timezone_info, success_callback, failure_callback) => {
  fetch(
    E('/timezones/'),
    {
      method: 'POST',
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timezone_info)
    }
  ).then(res => {
    if (res.status === 201) {
      res.json().then(success_callback);
    } else {
      failure_callback("Couldnot add");
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred');
   });
};


export const edit_timezone = (timezone_info, success_callback, failure_callback) => {
  fetch(
    E(`/timezones/${timezone_info.id}`),
    {
      method: 'PUT',
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timezone_info)
    }
  ).then(res => {
    console.log(res);
    if (res.status === 201) {
      res.json().then(success_callback);
    } else {
      failure_callback("Couldnot add");
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred');
   });
};



