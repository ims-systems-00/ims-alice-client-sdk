import http from "./httpServices";
const apiEndPoint = `/accounts`;
export async function login(data) {
  return http.post(apiEndPoint + "/auth/login", {
    email: data.email,
    password: data.password,
  });
}
export async function registerAccount(data = { email, name, password }) {
  await http.post(apiEndPoint + "/registration", {
    name: data.name,
    email: data.email,
    password: data.password,
  });
  /** we are auto loging user in with same password for better UX */
  return login(data);
}
export async function verifyRegistration({ token }) {
  return http.post(
    apiEndPoint + "/registration/verification",
    {},
    {
      headers: { "x-register-token": token },
    }
  );
}
export async function resendVerification(data = { userId }) {
  return http.post(apiEndPoint + "/registration/verification/emails", {
    userId: data.userId,
  });
}
export async function recoverAccount(data = { email }) {
  return http.post(apiEndPoint + "/recovery", {
    email: data.email,
  });
}
export async function verifyRecovery(
  data = {
    password,
    token,
  }
) {
  return http.post(
    apiEndPoint + "/recovery/verification",
    {
      password: data.password,
    },
    {
      headers: { "x-recovery-token": data.token },
    }
  );
}
export async function refreshToken(data) {
  return http.get(apiEndPoint + "/auth/refresh-token");
}
export async function logout() {
  return http.delete(apiEndPoint + "/auth/logout");
}
