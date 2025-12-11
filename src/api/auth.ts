// src/api/auth.ts
import apiClient from "./client";

const AUTH_TOKEN_KEY = "stoxie_token";

export interface SignupPayload {
  name: string;
  email?: string;
  phone: string;
}

export interface SignupResponse {
  msg: string;
  uid?: string;
  phone_number?: string | null;
}

export interface UserInfo {
  uid: string;
  phone_number?: string | null;
  email?: string | null;
  display_name?: string | null;
}

export interface VerifyTokenResponse {
  msg: string;
  token: string;
  user: UserInfo;
}

export interface EmailLoginPayload {
  email: string;
  password: string;
}

export interface EmailLoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface PhoneOtpLoginPayload {
  phoneNumber: string;
  otp: string;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * SIGNUP: calls POST /auth/signup
 * Backend expects: { phone_number, display_name, email }
 */
export async function signupUser(
  payload: SignupPayload
): Promise<SignupResponse> {
  const res = await apiClient.post<SignupResponse>("/signup", {
    phone_number: payload.phone,
    display_name: payload.name,
    email: payload.email,
  });
  return res.data;
}

/**
 * DEV PHONE + OTP LOGIN: POST /auth/login
 * Backend: PhoneOtpLoginRequest(phone_number, otp)
 * OTP is "123456" in your backend dev mode.
 */
export async function loginWithPhoneOtp(
  payload: PhoneOtpLoginPayload
): Promise<VerifyTokenResponse> {
  const res = await apiClient.post<VerifyTokenResponse>("/login", {
    phone_number: payload.phoneNumber,
    otp: payload.otp,
  });

  const data = res.data;
  if (data.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  }

  return data;
}

/**
 * LOGIN WITH GOOGLE / ID TOKEN: POST /auth/verify-token
 */
export async function loginWithGoogleIdToken(
  idToken: string
): Promise<VerifyTokenResponse> {
  const res = await apiClient.post<VerifyTokenResponse>(
    "/verify-token",
    {
      id_token: idToken,
    }
  );

  const data = res.data;
  if (data.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  }

  return data;
}

/**
 * EMAIL/PASSWORD LOGIN: POST /auth/login-email
 * (use only if you wired this on backend)
 */
export async function loginWithEmail(
  payload: EmailLoginPayload
): Promise<EmailLoginResponse> {
  const res = await apiClient.post<EmailLoginResponse>(
    "/login-email",
    {
      email: payload.email,
      password: payload.password,
    }
  );

  const data = res.data;
  if (data.idToken) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.idToken);
  }

  return data;
}

/**
 * CURRENT USER: GET /auth/me
 * Uses Authorization header set by interceptor.
 */
export async function getCurrentUser(): Promise<UserInfo | null> {
  try {
    const res = await apiClient.get<UserInfo>("/me");
    return res.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

// Optional default export if you ever used `import auth from "./auth"`
const authApi = {
  signupUser,
  loginWithPhoneOtp,
  loginWithGoogleIdToken,
  loginWithEmail,
  getCurrentUser,
  getAuthToken,
  clearAuthToken,
};

export default authApi;
