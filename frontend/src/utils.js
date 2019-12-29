import API_ENDPOINT from './config';

// returns effective endpoint for api
// path must be prefixed
const effectivePath = (path) => `${API_ENDPOINT()}${path}`;

const customFetch = (params) => {
  const method = params.method || ( params.data ? 'POST' : 'GET' );
  const fetch_params = { "headers": {} };

  fetch_params["method"] = method;
  if (params.with_auth) {
    fetch_params["headers"]["Authorization"] = `JWT ${localStorage.getItem('token')}`;
  }
  if (params.data) {
    fetch_params["headers"]["Content-Type"] = "application/json";
    fetch_params["body"] = JSON.stringify(params.data);
  }
  return fetch(effectivePath(params.url), fetch_params);
};

export default customFetch;
