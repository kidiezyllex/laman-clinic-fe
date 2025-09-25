export interface ICreateTestBody {
  appointmentId: string;
  testTypeId: string;
  patientId: string;
  doctorId: string;
  technicianId: string;
  requestTestId?: string;
  results?: any;
  notes?: string;
  status?: string;
}

export interface IUpdateTestBody {
  appointmentId?: string;
  testTypeId?: string;
  patientId?: string;
  doctorId?: string;
  technicianId?: string;
  requestTestId?: string;
  results?: any;
  notes?: string;
  status?: string;
}
