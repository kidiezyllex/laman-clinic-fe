export interface ICreatePrescriptionBody {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  medications: Array<{
    medicationId: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }>;
  notes?: string;
  status?: string;
}

export interface IUpdatePrescriptionBody {
  appointmentId?: string;
  patientId?: string;
  doctorId?: string;
  medications?: Array<{
    medicationId: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }>;
  notes?: string;
  status?: string;
}
