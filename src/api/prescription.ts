import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Prescription API functions
export const getPrescriptions = async () => {
  const res = await sendGet(`/prescriptions`);
  return res;
};

export const getPrescriptionById = async (id: string) => {
  const res = await sendGet(`/prescriptions/${id}`);
  return res;
};

export const getPrescriptionsByAppointment = async (appointmentId: string) => {
  const res = await sendGet(`/prescriptions/?appointmentId=${appointmentId}`);
  return res;
};

export const createPrescription = async (data: any) => {
  const res = await sendPost(`/prescriptions`, data);
  return res;
};

export const updatePrescription = async (id: string, data: any) => {
  const res = await sendPut(`/prescriptions/${id}`, data);
  return res;
};

export const deletePrescription = async (id: string) => {
  const res = await sendDelete(`/prescriptions/${id}`);
  return res;
};

export const checkPrescriptions = async (doctorId: string) => {
  const res = await sendGet(`/prescriptions/check/?doctorId=${doctorId}`);
  return res;
};
