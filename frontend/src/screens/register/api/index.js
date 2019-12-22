import E from '../../../utils';

export const register = (data, success_callback, failure_callback) => {
  fetch(
    E('/users/'),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }
  ).then(res => {
    if (res.status === 201) {
      res.json().then(success_callback);
    } else {
      failure_callback("Error registering");
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred');
   });
};


