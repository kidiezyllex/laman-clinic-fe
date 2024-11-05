export interface AppointmentByPatient {
  id: String;
  appointmentDateByPatient: Date;
  specialization: String;
  fullName: String;
  dateOfBirth: String;
  gender: String;
  address: String;
  phone: String;
  email: String;
  medicalHistory: Array<String>;
}

export interface Schedule {
  dayOfWeek: String;
  startTime: String;
  endTime: String;
  _id: String;
}
export interface Doctor {
  _id: String;
  numberId?: String;
  fullName?: String;
  dateOfBirth?: Date;
  gender?: String;
  address?: String;
  phone?: String;
  email?: String;
  schedule?: Schedule[];
}
export interface Patient {
  _id?: String;
  fullName?: String;
  dateOfBirth?: Date;
  gender?: String;
  address?: String;
  phone?: String;
  email?: String;
  medicalHistory?: MedicalHistory[];
}

export interface MedicalHistory {
  _id: String;
  disease: String;
  diagnosisDate: String;
  treatment: String;
}

export interface Appointment {
  patientId: Patient;
  doctorId: Doctor;
  appointmentDate: String;
  reason: String;
  specialization: String;
  email: String;
  fullName: String;
  gender: String;
  phone: String;
  medicalHistory: MedicalHistory[];
  priority: boolean;
  dateOfBirth?: Date;
  address: String;
}

export interface MedicationRow {
  id: number;
  medicationName: String;
  dose: String;
  quantity: number;
  instructions: String;
  price: number;
}

export interface Medication {
  medicationName: String;
  dose: String;
  quantity: number;
  price: number;
  instructions: String;
  _id: String;
}

export interface Prescription {
  _id: String;
  patientId: String;
  doctorId: String;
  medications: Medication[];
  dateIssued: Date;
}

export interface PatientPrescriptionInvoiceProps {
  prescription: Prescription;
  newMedication: Medication[];
}

export interface Pharmacist {
  _id: String;
  numberId?: String;
  fullName?: String;
  dateOfBirth?: Date;
  gender?: String;
  address?: String;
  phone?: String;
  email?: String;
  schedule?: Schedule[];
}

export interface Receptionist {
  _id: String;
  numberId?: String;
  fullName?: String;
  dateOfBirth?: Date;
  gender?: String;
  address?: String;
  phone?: String;
  email?: String;
  schedule?: Schedule[];
}
export interface TestType {
  _id: String;
  testName: String;
  description: String;
  price: number;
}
export interface RequestTest {
  _id: String;
  test: TestType[];
  patientId: String;
  doctorId: String;
  reason: String;
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
