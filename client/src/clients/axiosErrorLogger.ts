import { AxiosError } from 'axios'

export function logAxiosError(e: AxiosError) {
    if(e.response) {
        const title = e.response?.data['hydra:title'] + "(" + e.response?.statusText + " " + e.response.status + ')';
        const message = e.response.data['hydra:description'];
        const stack = e.response.data['trace'];

        console.error(title + '\n', message + '\n', 'Stack: \n', stack);
    }

}