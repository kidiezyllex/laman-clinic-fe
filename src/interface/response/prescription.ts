export interface IPrescriptionMedication {
  medicationId: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface IPrescription {
  _id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  medications: IPrescriptionMedication[];
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetPrescriptionsResponse {
  message: string;
  data: IPrescription[];
}

export interface IGetPrescriptionByIdResponse {
  message: string;
  data: IPrescription;
}

export interface ICreatePrescriptionResponse {
  message: string;
  data: IPrescription;
}

export interface IUpdatePrescriptionResponse {
  message: string;
  data: IPrescription;
}

export interface IDeletePrescriptionResponse {
  message: string;
}
