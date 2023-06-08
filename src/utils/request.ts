import axios, { InternalAxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';

export declare interface IResponse<T> {
    success: boolean;
    message: string;
    data: {
        rows: Array<T>;
    };
}


const request = axios.create({
    timeout: 15000
});

const getHeader = () => {
    return {} as AxiosRequestHeaders
}

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return { ...config, headers: getHeader() }

});

request.interceptors.response.use(<T, U>(response: AxiosResponse<T, U>) => {
    return response.data
})

export default request