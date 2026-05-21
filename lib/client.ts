import axios from 'axios';

const PORT = process.env.PORT ?? 3000;

const baseURL =
  typeof window !== 'undefined'
    ? ''
    : process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${PORT}`;

const axiosClient = axios.create({ baseURL, timeout: 15000 });

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', err.config?.url, err.message);
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
