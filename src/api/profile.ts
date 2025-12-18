// src/api/profile.ts
import apiClient from "./client";

export interface Profile {
  uid: string;
  display_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
}

export async function getMyProfile(): Promise<Profile> {
  const res = await apiClient.get<Profile>("/profile/me");
  return res.data;
}

export async function updateMyProfile(payload: {
  display_name?: string;
  email?: string;
  phone_number?: string;
}): Promise<Profile> {
  const res = await apiClient.put<Profile>("/profile/me", payload);
  return res.data;
}
