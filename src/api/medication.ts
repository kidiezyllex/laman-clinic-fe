import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Medication API functions
export const getMedications = async () => {
  const res = await sendGet(`/medications`);
  return res;
};

export const getMedicationById = async (id: string) => {
  const res = await sendGet(`/medications/${id}`);
  return res;
};

export const createMedication = async (data: any) => {
  const res = await sendPost(`/medications`, data);
  return res;
};

export const updateMedication = async (id: string, data: any) => {
  const res = await sendPut(`/medications/${id}`, data);
  return res;
};

export const deleteMedication = async (id: string) => {
  const res = await sendDelete(`/medications/${id}`);
  return res;
};

export const getMedicationFluctuations = async () => {
  const res = await sendGet(`/prescriptions/medication-fluctuations`);
  return res;
};
