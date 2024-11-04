import axios from 'axios';
import {SERVER_URL} from '@/etc/constant';
import {startLoading, stopLoading} from '@/components/hooks/loading-state-store';
// import {startLoading, stopLoading} from '@/components/hooks/loading-state-store';

let config = {
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
};

const axiosInstance = axios.create(config);
export default axiosInstance;
export const axiosNoDimmInstance = axios.create(config);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 여기부터 인터셉터

let getOnRequestFulfilled = function (dimm) {
  return (config) => {
    dimm && axiosOnLoad();
    return config;
  }
};
let onRequestRejected = (error) => {
  return Promise.reject(error);
};
/**
 * HTTP Request 인터셉터
 */
axiosInstance.interceptors.request.use(
  getOnRequestFulfilled(true),
  onRequestRejected
);
axiosNoDimmInstance.interceptors.request.use(
  getOnRequestFulfilled(false),
  onRequestRejected
);

let onResponseFulfilled = async response => {
  axiosOnLoaded();
  return response;
};
let onResponseRejected = async error => {
  axiosOnErrorLoaded();
  const originalRequest = error.config;
  if (error.response === undefined) {
    console.error('error.message:', error.message);
    console.error('error.code:', error.code);
    return;
  }
  switch (error.response.status) {
    case 400:
    case 401:
      return renewalToken(originalRequest);
    case 403:
      console.error('403 error');
      break;
    case 404:
      console.error('404 error');
      break;
    case 482:
      console.error('482 error');
      location.replace('/logout');
      break;
    case 500:
      console.error('500 error');
      break;
    default:
      //todo
      console.error('unknown error:', error.response.status);
  }

  return Promise.reject(error);
};
/**
 * HTTP Response 인터셉터
 */
axiosInstance.interceptors.response.use(
  onResponseFulfilled,
  onResponseRejected
);
axiosNoDimmInstance.interceptors.response.use(
  onResponseFulfilled,
  onResponseRejected
);

async function renewalToken(originalRequest: any) {
  if (isRefreshing) {
    try {
      const token = await new Promise(function (resolve, reject) {
        failedQueue.push({resolve, reject});
      });
      originalRequest.headers['fubao'] = 'Bearer ' + token;
      return await axios(originalRequest);
    } catch (err) {
      return await Promise.reject(err);
    }
  }

  originalRequest._retry = true;
  isRefreshing = true;

  return new Promise(function (resolve, reject) {
    requestRenewalToken() // Assume this function refreshes the token
      .then(accessToken => {
        // axios.defaults.headers['fubao'] = 'Bearer ' + accessToken;
        originalRequest.headers['fubao'] = 'Bearer ' + accessToken;
        processQueue(null, accessToken);
        resolve(axios(originalRequest));
      })
      .catch(err => {
        console.debug('refresh token error:', err);
        processQueue(err, null);
        reject(err);
      })
      .then(() => {
        console.debug('finally');
        isRefreshing = false;
      });
  });
}

// 예: 토큰 갱신 함수
async function requestRenewalToken() {
  await axiosInstance
    .post(SERVER_URL.API + 'adm/system/renewal-token', {})
    .then(({data: response}: { data: JsonResponseType }) => {
      if (!response.success) {
        return Promise.reject(response.message);
      }
      console.debug('token response:', response.data.accessToken);
      return response.data.accessToken;
    })
    .catch(error => {
      return Promise.reject(error);
    });
}

// const loadingElementId = '#loading';
export function axiosOnLoad() {
  startLoading();
}

export function axiosOnLoaded() {
  stopLoading();
}

export function axiosOnErrorLoaded() {
  // FIXME do something
}
