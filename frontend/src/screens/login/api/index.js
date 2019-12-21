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
      success_callback(res.json());
    } else {
      failure_callback("Invalid credentials");
    }
  }).catch((e) => {
     console.log(e);
   });
};

