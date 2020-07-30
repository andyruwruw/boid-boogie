import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? '/api/'
    : '/api/';

const request = axios.create({
  baseURL
});

export default request;