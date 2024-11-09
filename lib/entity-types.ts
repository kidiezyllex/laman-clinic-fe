export interface AppointmentByPatient {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDateByPatient: Date;
  specialization: string;
  fullName: string;
  dateOfBirth: Date;
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
  _id: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  schedule?: Schedule[];
  roomNumber?: string;
  specialization?: string;
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
  _id: string;
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
  dateOfBirth?: Date;
  address: string;
}
export interface CompletedAppointment {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  reason: string;
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
  _id: string;
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
  _id: string;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  schedule?: Schedule[];
}
export interface TestType {
  _id: string;
  testName: string;
  description: string;
  price: number;
}
export interface RequestTest {
  _id: string;
  test: TestType[];
  patientId: string;
  doctorId: string;
  reason: string;
  requestDate: Date;
}

export interface LoginResponse {
  status: string;
  message: string;
  data?: {
    id: string;
    role: string;
  };
}

export interface Notification {
  id?: string;
  message?: string;
  createdAt?: Date;
}

export interface User {
  _id: string;
  fullName?: string;
  gender?: string;
  phone?: string;
  email?: string;
  password?: string;
  role?: string;
}
