import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Test Type API functions
export const getTestTypes = async () => {
  const res = await sendGet(`/test-types`);
  return res;
};

export const getTestTypeById = async (id: string) => {
  const res = await sendGet(`/test-types/${id}`);
  return res;
};

export const createTestType = async (data: any) => {
  const res = await sendPost(`/test-types`, data);
  return res;
};

export const updateTestType = async (id: string, data: any) => {
  const res = await sendPut(`/test-types/${id}`, data);
  return res;
};

export const deleteTestType = async (id: string) => {
  const res = await sendDelete(`/test-types/${id}`);
  return res;
};
