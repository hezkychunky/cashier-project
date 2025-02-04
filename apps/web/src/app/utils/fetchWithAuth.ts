import Cookies from 'js-cookie';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = Cookies.get('token');

  if (!token) {
    console.warn('No token found, fetch canceled');
    return;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      console.warn('Unauthorized request');
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.remove('activeShift');
    }

    return response.json();
  } catch (error) {
    console.error('Error in fetchWithAuth:', error);
    throw error;
  }
};
