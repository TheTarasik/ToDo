import axios from 'axios';
import config from '../config';

export const apiPublic = axios.create({
    baseURL: config.APIurl,
    timeout: config.responseTimeout
});