export interface IInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IInvoice {
  _id: string;
  patientId: string;
  appointmentId?: string;
  prescriptionId?: string;
  testId?: string;
  amount: number;
  items: IInvoiceItem[];
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetInvoicesResponse {
  message: string;
  data: IInvoice[];
}

export interface IGetInvoiceByIdResponse {
  message: string;
  data: IInvoice;
}

export interface ICreateInvoiceResponse {
  message: string;
  data: IInvoice;
}

export interface IUpdateInvoiceResponse {
  message: string;
  data: IInvoice;
}

export interface IDeleteInvoiceResponse {
  message: string;
}
