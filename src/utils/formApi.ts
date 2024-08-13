import interceptor from './formInterceptor';

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

const formHeaders = {
    method: 'post',
    headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + userInfo?.token
    },
    withCredentials: false,
}

export const formApi = (apiUrl:any, apiData?:any) => {
    return interceptor({
        url: apiUrl,
        data: apiData,
        ...formHeaders
    });
};
