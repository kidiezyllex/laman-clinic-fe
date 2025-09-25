import { sendGet, sendPut, sendPost, sendDelete } from "./axios";

// Invoice API functions
export const getInvoices = async () => {
  const res = await sendGet(`/invoices`);
  return res;
};

export const getInvoiceById = async (id: string) => {
  const res = await sendGet(`/invoices/${id}`);
  return res;
};

export const createInvoice = async (data: any) => {
  const res = await sendPost(`/invoices`, data);
  return res;
};

export const updateInvoice = async (id: string, data: any) => {
  const res = await sendPut(`/invoices/${id}`, data);
  return res;
};

export const deleteInvoice = async (id: string) => {
  const res = await sendDelete(`/invoices/${id}`);
  return res;
};
