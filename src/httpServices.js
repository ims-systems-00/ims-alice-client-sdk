import axios, { AxiosError } from "axios";
const HTTP_DEFAULT = axios.create({
  withCredentials: true,
});
function setJwt(accessToken, refreshToken) {
  HTTP_DEFAULT.defaults.headers.common["x-auth-accesstoken"] = `${accessToken}`;
  HTTP_DEFAULT.defaults.headers.common[
    "x-auth-refreshtoken"
  ] = `${refreshToken}`;
}
let http = {
  config: function (conf) {
    HTTP_DEFAULT.defaults.baseURL =
      conf?.baseURL ||
      "https://https://alice-server-prod.imssystems.tech" + "/api/v1";
  },
  instance: HTTP_DEFAULT,
  get: HTTP_DEFAULT.get,
  post: HTTP_DEFAULT.post,
  put: HTTP_DEFAULT.put,
  patch: HTTP_DEFAULT.patch,
  delete: HTTP_DEFAULT.delete,
  setJwt,
  HTTPError: AxiosError,
};
export default http;
