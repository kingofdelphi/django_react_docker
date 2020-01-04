import API_ENDPOINT from './config';

// returns effective endpoint for api
// path must be prefixed
const effectivePath = (path) => `${API_ENDPOINT()}${path}`;

const customFetch = (params) => {
  const {
    url,
    with_auth,
    data,
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
  return fetch(effectivePath(url), fetch_params);
};

export default customFetch;
