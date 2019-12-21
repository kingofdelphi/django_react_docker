import API_ENDPOINT from './config';

// returns effective endpoint for api
// path must be prefixed
const E = (path) => `${API_ENDPOINT}${path}`;

export default E;
