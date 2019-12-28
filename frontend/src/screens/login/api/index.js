import E from '../../../utils';

export const login = (data, success_callback, failure_callback) => {
  fetch(
    E('/login/'),
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
      res.json().then(errors => failure_callback(errors));
    }
  }).catch((e) => {
    failure_callback('Unexpected error occurred');
   });
};

