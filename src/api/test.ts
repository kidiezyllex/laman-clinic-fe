import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Test API functions
export const getTests = async () => {
  const res = await sendGet(`/tests`);
  return res;
};

export const getTestById = async (id: string) => {
  const res = await sendGet(`/tests/${id}`);
  return res;
};

export const getTestsByAppointment = async (appointmentId: string) => {
  const res = await sendGet(`/tests/?appointmentId=${appointmentId}`);
  return res;
};

export const createTest = async (data: any) => {
  const res = await sendPost(`/tests`, data);
  return res;
};

export const updateTest = async (id: string, data: any) => {
  const res = await sendPut(`/tests/${id}`, data);
  return res;
};

export const deleteTest = async (id: string) => {
  const res = await sendDelete(`/tests/${id}`);
  return res;
};

export const checkTests = async (doctorId: string) => {
  const res = await sendGet(`/tests/check/?doctorId=${doctorId}`);
  return res;
};
