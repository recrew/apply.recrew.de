import { PUBLIC_API_PATH } from '$env/static/public';
import { token } from '$lib/stores/auth';
import dayjs from "dayjs";

interface fetchObject {
    method:string,
    headers:any,
    body?:any,
    withCredentials?:boolean
}

let bearer:string|null|undefined = null;

if(token){
    token.subscribe((t) => {
        bearer = t
    })
}

const getOptions = (method:string, payload = null) => {
    const obj: fetchObject = {
        method: method.toUpperCase(),
        headers: {
            'Authorization': 'bearer ' + bearer,
            'Content-Type': 'application/json'
        }
    }
    if(bearer){
        obj.withCredentials = true;
        // obj.credentials = 'include'
    }

    if(payload){
        obj.body = JSON.stringify(payload)
    }
    return obj;
}

const call = async (method: string, url:string, postData:any|null = null) => {
    const call = await fetch(PUBLIC_API_PATH + url, getOptions(method, postData))
    if(call.status >= 200 && call.status <= 299){
        return await call.json();
    } else {
        throw Error(call.statusText)
    }

}

export const post = async (url: string, postData = {}) => call('post', url, postData)
export const get = async (url:string) => call('get', url)

export const retire = async (url:string) => call('delete', url)
export const put = async (url:string, postData = {}) => call('put', url, postData)

export const formDataPost = async (url:string, postData:any) => {
    const options = getOptions('post')
    delete options.headers['Content-Type']
    const data = new FormData();
    options.body = formConverter(postData, data);
    const call = await fetch(PUBLIC_API_PATH + url, options)
    if(call.status >= 200 && call.status <= 299){
        return await call.json();
    }
    throw Error(call.status + ' - ' + call.statusText + ' - ' + JSON.stringify(await call.json()))
}

const DATE_REGEX = /^\d{2}\.\d{2}\.\d{4}$/;
const parseGermanDate = (value: string): string =>
    dayjs(value.split('.').reverse().join('-')).format('YYYY-MM-DD');

const formConverter = (data: any, form: FormData): FormData => {
    Object.keys(data).forEach(key => {
        let value = data[key];
        if (typeof value === 'string' && DATE_REGEX.test(value)) {
            value = parseGermanDate(value);
        }
        if (value instanceof File) {
            form.append(key, value);
        } else if (typeof value === 'object' && value !== null) {
            Object.keys(value).forEach(subKey => {
                let subValue = value[subKey];
                if (typeof subValue === 'string' && DATE_REGEX.test(subValue)) {
                    subValue = parseGermanDate(subValue);
                }
                if (typeof subValue === 'object' && subValue !== null) {
                    Object.keys(subValue).forEach(subSubKey => {
                        let subSubValue = subValue[subSubKey];
                        if (typeof subSubValue === 'string' && DATE_REGEX.test(subSubValue)) {
                            subSubValue = parseGermanDate(subSubValue);
                        }
                        form.append(`${key}[${subKey}][${subSubKey}]`, subSubValue);
                    });
                } else {
                    form.append(`${key}[${subKey}]`, subValue);
                }
            });
        } else {
            form.append(key, value);
        }
    });
    return form;
}