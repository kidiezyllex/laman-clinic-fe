export interface ICreateAppointmentBody {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  roomNumber: string;
  status?: string;
  notes?: string;
}

export interface IUpdateAppointmentBody {
  patientId?: string;
  doctorId?: string;
  date?: string;
  time?: string;
  roomNumber?: string;
  status?: string;
  notes?: string;
}
