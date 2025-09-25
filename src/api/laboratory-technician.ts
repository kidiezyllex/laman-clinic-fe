import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Laboratory Technician API functions
export const getLaboratoryTechnicians = async () => {
  const res = await sendGet(`/laboratory-technicians`);
  return res;
};

export const getLaboratoryTechnicianById = async (id: string) => {
  const res = await sendGet(`/laboratory-technicians/${id}`);
  return res;
};

export const updateLaboratoryTechnician = async (id: string, data: any) => {
  const res = await sendPut(`/laboratory-technicians/${id}`, data);
  return res;
};

export const createLaboratoryTechnician = async (data: any) => {
  const res = await sendPost(`/laboratory-technicians`, data);
  return res;
};

export const deleteLaboratoryTechnician = async (id: string) => {
  const res = await sendDelete(`/laboratory-technicians/${id}`);
  return res;
};
