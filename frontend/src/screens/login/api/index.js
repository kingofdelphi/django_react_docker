import E from '../../../util';

export const login = (data, success_callback, failure_callback) => {
  fetch(
    E('/users/login/'),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
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

