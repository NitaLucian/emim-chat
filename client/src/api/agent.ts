import axios, { AxiosResponse } from 'axios';
import { Medic } from '../modules/medic';
import UrlStore from '../store/urlStore';

const sleep = (delay:number) =>{
    return new Promise((resolve) =>{
        setTimeout(resolve,delay);
    });
}

    // axios.defaults.baseURL = 'http://82.77.27.57:56002/api';
    //axios.defaults.baseURL = 'http://localhost:5006/api';
    axios.defaults.baseURL = UrlStore.urlEmimApi;

    //asta doar sa ma joc cu interceptorii--aici pot insera diverse chestii
    axios.interceptors.response.use(async response =>{
        try {
            await sleep(100);
            return response;
        } catch (error) {
            console.log(error);
            return await Promise.reject(error);
        }
    })

    function responseBody<T>(response: AxiosResponse<T>) {
        return response.data;
    }

    const requests = {
        get: <T>(url: string) => axios.get<T>(url).then(responseBody),
        post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
        put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
        del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
    }

    const medici = {
        list: () => requests.get<Medic[]>('/medici'),
    }

    const agent = {
        medici
    }

    export default agent;