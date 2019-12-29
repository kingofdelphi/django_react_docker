import API_ENDPOINT from './config';

// returns effective endpoint for api
// path must be prefixed
const effectivePath = (path) => `${API_ENDPOINT()}${path}`;

const customFetch = (params) => {
  const {
    url,
    with_auth,
    data,
    success_callback,
    failure_callback,
  } = params;

  const method = params.method || ( data ? 'POST' : 'GET' );

  const fetch_params = { "headers": {} };

  fetch_params["method"] = method;
  if (with_auth) {
    fetch_params["headers"]["Authorization"] = `JWT ${localStorage.getItem('token')}`;
  }
  if (data) {
    fetch_params["headers"]["Content-Type"] = "application/json";
    fetch_params["body"] = JSON.stringify(data);
  }
  fetch(effectivePath(url), fetch_params).then(response => {
    if (response.status === 200 || response.status === 201) {
      response.json().then(success_callback);
    } else if (response.status === 204) {
      success_callback();
    } else if (response.status === 401) {
      failure_callback('Invalid credentials', {});
    } else if (response.status === 400) {
      response.json().then(errorObj => failure_callback('Some of the form fields are invalid', errorObj));
    } else {
      alert('unknown status code' + response.status);
    }
  }).catch((e) => {
    console.log(e);
    failure_callback('Unexpected error occurred', {});
  });
};

export default customFetch;
