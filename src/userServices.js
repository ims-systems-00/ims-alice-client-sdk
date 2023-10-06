import http from "./httpServices";
const apiEndPoint = `/users`;
export function getUserInfo(id) {
  return http.get(`${apiEndPoint}/${id}`);
}
export function updateUserProfile(id, data) {
  return http.put(`${apiEndPoint}/${id}`, {
    name: data.name,
    organisationName: data.organisationName,
    jobTitle: data.jobTitle,
  });
}
export function updateUserProfileImage(id, data) {
  return http.put(`${apiEndPoint}/${id}/profile-image`, {
    ...data,
  });
}
export function updateUserActivityStatus(id, data) {
  return http.put(`${apiEndPoint}/${id}/activity-status`, {
    ...data,
  });
}
export function updateUserPassword(id, data) {
  return http.post(`${apiEndPoint}/${id}/change-password`, {
    oldPassword: data.oldPassword,
    password: data.password,
  });
}
