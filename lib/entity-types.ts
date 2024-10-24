export interface AppointmentByPatient {
  id: string;
  appointmentDateByPatient: Date;
  specialization: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  medicalHistory: Array<string>;
}

export interface Schedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  _id: string;
}
export interface Doctor {
  _id: String;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  schedule?: Schedule[];
}
export interface Patient {
  _id?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  medicalHistory?: MedicalHistory[];
}

export interface MedicalHistory {
  _id: string;
  disease: string;
  diagnosisDate: string;
  treatment: string;
}

export interface Appointment {
  patientId: string;
  appointmentDate: string;
  reason: string;
  specialization: string;
  email: string;
  fullName: string;
  gender: string;
  phone: string;
  medicalHistory: MedicalHistory[];
  priority: boolean;
}

export interface MedicationRow {
  id: number;
  medicationName: string;
  dose: string;
  quantity: number;
  instructions: string;
  price: number;
}

export interface Medication {
  medicationName: string;
  dose: string;
  quantity: number;
  price: number;
  instructions: string;
  _id: string;
}

export interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  dateIssued: Date;
}

export interface PatientPrescriptionInvoiceProps {
  prescription: Prescription;
  newMedication: Medication[];
}

export interface Pharmacist {
  _id: String;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  schedule?: Schedule[];
}

export interface Receptionist {
  _id: String;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  schedule?: Schedule[];
}
