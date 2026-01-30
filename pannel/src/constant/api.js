const APIURL = import.meta.env.VITE_BACKEND_URL;

export const api = {
  login: `${APIURL}/api/auth/login`,
  register: `${APIURL}/api/auth/register`,
  verifylogin: `${APIURL}/api/auth/verifylogin`,
};
