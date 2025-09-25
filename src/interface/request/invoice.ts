export interface ICreateInvoiceBody {
  patientId: string;
  appointmentId?: string;
  prescriptionId?: string;
  testId?: string;
  amount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  status?: string;
  notes?: string;
}

export interface IUpdateInvoiceBody {
  patientId?: string;
  appointmentId?: string;
  prescriptionId?: string;
  testId?: string;
  amount?: number;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  status?: string;
  notes?: string;
}
