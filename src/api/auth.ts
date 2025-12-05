// src/api/auth.ts
import { apiClient } from "./client";

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
}

export interface SignupResponse {
  msg: string;
  uid?: string;
  phone_number?: string;
}

export interface VerifyTokenResponse {
  msg: string;
  token: string;
  user: {
    uid: string;
    phone_number?: string;
    email?: string;
  };
}

/** Email/password login payload (still here if you ever need it). */
export interface EmailLoginPayload {
  email: string;
  password: string;
}

export interface EmailLoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId?: string;
  [key: string]: any;
}

/** DEV phone + OTP login payload (hits /login). */
export interface PhoneOtpLoginPayload {
  phoneNumber: string;
  otp: string;
}

/**
 * Sign up a user with name, email and phone.
 */
export async function signupUser(payload: SignupPayload) {
  const res = await apiClient.post<SignupResponse>("/signup", {
    phone_number: payload.phone,
    display_name: payload.name,
    email: payload.email,
  });
  return res.data;
}

/**
 * Low-level verify-token helper (no localStorage side effects).
 * This calls /verify-token with a Firebase ID token.
 */
export async function verifyToken(idToken: string) {
  const res = await apiClient.post<VerifyTokenResponse>("/verify-token", {
    id_token: idToken,
  });
  return res.data;
}

/**
 * LEGACY: login with EMAIL + PASSWORD – not used in phone+OTP flow.
 */
export async function loginWithEmail(
  payload: EmailLoginPayload
): Promise<EmailLoginResponse> {
  const res = await apiClient.post<EmailLoginResponse>("/login-email", {
    email: payload.email,
    password: payload.password,
  });

  const data = res.data;

  if (data.idToken) {
    localStorage.setItem("stoxie_token", data.idToken);
  }

  return data;
}

/**
 * DEV PHONE + OTP LOGIN.
 *
 * Calls backend /login with:
 *  {
 *    phone_number: string,
 *    otp: string
 *  }
 *
 * Backend:
 *  - Validates OTP (e.g. hardcoded "123456" in dev).
 *  - Finds/creates user in Mongo.
 *  - Returns { msg, token, user }.
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
    localStorage.setItem("stoxie_token", data.token);
  }

  return data;
}

/**
 * GOOGLE LOGIN using Firebase ID token.
 *
 * Uses /verify-token, not /login.
 *  - Verifies the Firebase ID token
 *  - Returns { msg, token, user }
 */
export async function loginWithGoogleIdToken(
  idToken: string
): Promise<VerifyTokenResponse> {
  const res = await apiClient.post<VerifyTokenResponse>("/verify-token", {
    id_token: idToken,
  });

  const data = res.data;

  if (data.token) {
    localStorage.setItem("stoxie_token", data.token);
  }

  return data;
}
