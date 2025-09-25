import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Patient API functions
export const getPatients = async () => {
  const res = await sendGet(`/patients`);
  return res;
};

export const getPatientById = async (id: string) => {
  const res = await sendGet(`/patients/${id}`);
  return res;
};

export const getPatientByEmail = async (email: string) => {
  const res = await sendGet(`/patients/?email=${email}`);
  return res;
};

export const createPatient = async (data: any) => {
  const res = await sendPost(`/patients`, data);
  return res;
};

export const updatePatient = async (id: string, data: any) => {
  const res = await sendPut(`/patients/${id}`, data);
  return res;
};

export const deletePatient = async (id: string) => {
  const res = await sendDelete(`/patients/${id}`);
  return res;
};

export const getPatientByClerk = async (userId: string) => {
  const res = await sendGet(`/patients/clerk/${userId}`);
  return res;
};
