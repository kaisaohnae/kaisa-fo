import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';
import { useLoadingStore } from '../store/store.loading';
import { useAlertStore } from '../store/store.alert';

const alert = useAlertStore();

let baseURL = import.meta.env.VITE_API_HOST;

const loading = useLoadingStore();

const service: AxiosInstance = axios.create({
  timeout: 20000,
  baseURL: baseURL,
});

service.interceptors.request.use(
  (request: AxiosRequestConfig) => {
    loading.start();
    if (!request.data) {
      request.data = new FormData();
    }
    for (let pair of [...request.data]) {
      // request.data.entries()
      if (pair[1] === 'undefined' || pair[1] === 'null' || !pair[1]) {
        request.data.delete(pair[0]);
        // console.log(pair[0] + '값이 비어있으므로 요청에서 제외합니다.');
      }
    }
    return request;
  },
  (error: AxiosError) => {
    loading.end();
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    loading.end();
    if (response.status === 200) {
      return response;
    } else {
      Promise.reject();
    }
  },
  (error: AxiosError) => {
    loading.end();
    console.log(error);
    const data:any = error.response?.data;
    if(data && data.message) {
      alert.open({title: null, message: data.message});
    }
    return Promise.reject();
  }
);

export default service;
