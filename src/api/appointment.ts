import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Appointment API functions
export const getAppointments = async () => {
  const res = await sendGet(`/appointments`);
  return res;
};

export const getAppointmentsByPatient = async () => {
  const res = await sendGet(`/appointmentsByPatient`);
  return res;
};

export const getAppointmentById = async (id: string) => {
  const res = await sendGet(`/appointments/${id}`);
  return res;
};

export const createAppointment = async (data: any) => {
  const res = await sendPost(`/appointments`, data);
  return res;
};

export const updateAppointment = async (id: string, data: any) => {
  const res = await sendPut(`/appointments/${id}`, data);
  return res;
};

export const deleteAppointment = async (id: string) => {
  const res = await sendDelete(`/appointmentsByPatient/?_id=${id}`);
  return res;
};

export const getAppointmentsByDoctor = async (doctorId: string) => {
  const res = await sendGet(`/doctors/get-appointments/${doctorId}`);
  return res;
};

export const getAppointmentsByRoom = async (roomNumber: string) => {
  const res = await sendGet(`/doctors/get-appointments/${roomNumber}`);
  return res;
};
