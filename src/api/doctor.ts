import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Doctor API functions
export const getDoctors = async () => {
  const res = await sendGet(`/doctors`);
  return res;
};

export const getDoctorById = async (id: string) => {
  const res = await sendGet(`/doctors/${id}`);
  return res;
};

export const getDoctorsBySpecialization = async (specialization: string) => {
  const res = await sendGet(`/doctors?specialization=${specialization}`);
  return res;
};

export const getDoctorSpecializations = async () => {
  const res = await sendGet(`/doctors/specializations`);
  return res;
};

export const updateDoctor = async (id: string, data: any) => {
  const res = await sendPut(`/doctors/${id}`, data);
  return res;
};

export const createDoctor = async (data: any) => {
  const res = await sendPost(`/doctors`, data);
  return res;
};

export const deleteDoctor = async (id: string) => {
  const res = await sendDelete(`/doctors/${id}`);
  return res;
};

export const createReExamination = async (data: any) => {
  const res = await sendPost(`/doctors/reExamination`, data);
  return res;
};

export const createRequestTest = async (data: any) => {
  const res = await sendPost(`/doctors/create-request-test`, data);
  return res;
};

export const completeAppointment = async (data: any) => {
  const res = await sendPost(`/doctors/complete`, data);
  return res;
};

export const checkRequestTests = async (doctorId: string) => {
  const res = await sendGet(`/request-tests/check/?doctorId=${doctorId}`);
  return res;
};

export const checkTests = async (doctorId: string) => {
  const res = await sendGet(`/tests/check/?doctorId=${doctorId}`);
  return res;
};

export const checkPrescriptions = async (doctorId: string) => {
  const res = await sendGet(`/prescriptions/check/?doctorId=${doctorId}`);
  return res;
};
