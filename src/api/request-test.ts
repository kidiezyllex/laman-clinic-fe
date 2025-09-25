import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Request Test API functions
export const getRequestTests = async () => {
  const res = await sendGet(`/request-tests`);
  return res;
};

export const getRequestTestById = async (id: string) => {
  const res = await sendGet(`/request-tests/${id}`);
  return res;
};

export const createRequestTest = async (data: any) => {
  const res = await sendPost(`/request-tests`, data);
  return res;
};

export const updateRequestTest = async (id: string, data: any) => {
  const res = await sendPut(`/request-tests/${id}`, data);
  return res;
};

export const deleteRequestTest = async (id: string) => {
  const res = await sendDelete(`/request-tests/${id}`);
  return res;
};

export const checkRequestTests = async (doctorId: string) => {
  const res = await sendGet(`/request-tests/check/?doctorId=${doctorId}`);
  return res;
};
