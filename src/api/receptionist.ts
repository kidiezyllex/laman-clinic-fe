import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Receptionist API functions
export const getReceptionists = async () => {
  const res = await sendGet(`/receptionists`);
  return res;
};

export const getReceptionistById = async (id: string) => {
  const res = await sendGet(`/receptionists/${id}`);
  return res;
};

export const updateReceptionist = async (id: string, data: any) => {
  const res = await sendPut(`/receptionists/${id}`, data);
  return res;
};

export const createReceptionist = async (data: any) => {
  const res = await sendPost(`/receptionists`, data);
  return res;
};

export const deleteReceptionist = async (id: string) => {
  const res = await sendDelete(`/receptionists/${id}`);
  return res;
};
