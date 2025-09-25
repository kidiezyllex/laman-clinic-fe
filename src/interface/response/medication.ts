export interface IMedication {
  _id: string;
  name: string;
  description?: string;
  dosage: string;
  unit: string;
  price: number;
  stock: number;
  category?: string;
  manufacturer?: string;
  expiryDate?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetMedicationsResponse {
  message: string;
  data: IMedication[];
}

export interface IGetMedicationByIdResponse {
  message: string;
  data: IMedication;
}

export interface ICreateMedicationResponse {
  message: string;
  data: IMedication;
}

export interface IUpdateMedicationResponse {
  message: string;
  data: IMedication;
}

export interface IDeleteMedicationResponse {
  message: string;
}

export interface IMedicationFluctuationsResponse {
  message: string;
  data: any;
}
