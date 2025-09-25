import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Admin API functions
export const getAdminById = async (id: string) => {
  const res = await sendGet(`/admins/${id}`);
  return res;
};

export const updateAdmin = async (id: string, data: any) => {
  const res = await sendPut(`/admins/${id}`, data);
  return res;
};

export const createAdmin = async (data: any) => {
  const res = await sendPost(`/admins`, data);
  return res;
};

export const deleteAdmin = async (id: string) => {
  const res = await sendDelete(`/admins/${id}`);
  return res;
};
