import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Pharmacist API functions
export const getPharmacists = async () => {
  const res = await sendGet(`/pharmacists`);
  return res;
};

export const getPharmacistById = async (id: string) => {
  const res = await sendGet(`/pharmacists/${id}`);
  return res;
};

export const updatePharmacist = async (id: string, data: any) => {
  const res = await sendPut(`/pharmacists/${id}`, data);
  return res;
};

export const createPharmacist = async (data: any) => {
  const res = await sendPost(`/pharmacists`, data);
  return res;
};

export const deletePharmacist = async (id: string) => {
  const res = await sendDelete(`/pharmacists/${id}`);
  return res;
};
