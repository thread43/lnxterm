import axios from 'axios';
import history from './history.js';

const http = axios.create({
  // baseURL: '/api/',
  // baseURL: 'http://127.0.0.1:1234/api/',
  // responseType: 'json',
});

http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// // how to break promise chain in interceptors? #715
// https://github.com/axios/axios/issues/715
http.interceptors.response.use(
  (response) => {
    // return response;
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    switch (error.response.status) {
      // case 400: {
      //   // const lang = localStorage.getItem('lang');
      //   // const text = trans(lang, 'invalid_parameters');
      //   // message.error(text, 1);
      //   return Promise.resolve();
      // }
      case 400: {
        return Promise.reject(new Error(`${error.message} (Invalid Parameters)`));
      }
      case 401: {
        setTimeout(function() {
          history.push('/login');
        });
        return new Promise(() => {});
      }
      case 403: {
        return Promise.reject(new Error(`${error.message} (Permission Denied)`));
      }
      case 404: {
        return Promise.reject(new Error(`${error.message} (Invalid Request Path)`));
      }
      case 409: {
        return Promise.reject(new Error(`${error.message} (Record Already Exists)`));
      }
      case 422: {
        return Promise.reject(new Error(`${error.message} (Authentication Failed)`));
      }
      case 999: {
        return Promise.resolve(error.response);
      }
      default: {
        // console.log(error.response);
        return Promise.reject(error);
      }
    }
  },
);

export default http;
