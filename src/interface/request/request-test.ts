export interface ICreateRequestTestBody {
  appointmentId: string;
  testTypeId: string;
  patientId: string;
  doctorId: string;
  notes?: string;
  status?: string;
}

export interface IUpdateRequestTestBody {
  appointmentId?: string;
  testTypeId?: string;
  patientId?: string;
  doctorId?: string;
  notes?: string;
  status?: string;
}
