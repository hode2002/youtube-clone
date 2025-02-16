'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores';
import { fetchUserData } from '@/apiRequests';
import { setItemToLocalStorage } from '@/lib/utils';
export default () => {
    const { setAccessToken } = useAuthStore();

    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace('#', '?'));
        const token = params.get('token');

        if (token) {
            window.close();
            setAccessToken(token);
            (async () => await fetchUserData())();
            window.history.replaceState(null, '', '/');
            setItemToLocalStorage('reload', 'true');
        }
    }, []);
};
