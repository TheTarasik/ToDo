import { useEffect, useRef } from 'react';
import { apiPublic } from '../api';

const useAPI = () => {

    const apiPublicRef = useRef(apiPublic);

    useEffect(() => {
        apiPublicRef.current.interceptors.response.use((config) => {
            return config;
        }, async (error) => {
            const originalRequest = error.config;
            
            if (originalRequest) {
                if (error.message === `timeout of ${originalRequest.timeout}ms exceeded`) {
                    throw new Error('Server is offline');
                }
            }

            throw error;
        });
    }, []);

    return {
        apiPublic: apiPublicRef.current
    };
};

export default useAPI;