import { createFetch } from "@vueuse/core";
import router from '@/router';

export default function useClient() {
  return createFetch({
    combination: 'overwrite',
    //baseUrl: 'http://avocado.test/',
    baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:3000/',
    options: {
      async beforeFetch({ options }) {
        //const myToken = await getMyToken()
        //options.headers.Authorization = `Bearer ${myToken}`
        const token = decodeURIComponent(
          document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] || ''
        );
      
        if (token) {
          options.headers = {
            ...options.headers,
            'X-XSRF-TOKEN': token,
          };
        }

        return { options };
      },
      onFetchError({ error, data, response }) {
        if (response?.status === 401) {
          router.push('/login');
        }
        error.message = data?.error || data?.message;
        return { error, data, response };
      },
    },
    fetchOptions: {
      //mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    },
  });
};
