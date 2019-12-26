import E from '../../../utils';

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
    } else if (res.status === 401) {
      failure_callback('Invalid credentials');
    } else {
      res.json().then(d => failure_callback('Error logging in', d));
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred');
   });
};

