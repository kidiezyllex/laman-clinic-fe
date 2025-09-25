export interface IAppointment {
  _id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  roomNumber: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetAppointmentsResponse {
  message: string;
  data: IAppointment[];
}

export interface IGetAppointmentByIdResponse {
  message: string;
  data: IAppointment;
}

export interface ICreateAppointmentResponse {
  message: string;
  data: IAppointment;
}

export interface IUpdateAppointmentResponse {
  message: string;
  data: IAppointment;
}

export interface IDeleteAppointmentResponse {
  message: string;
}
