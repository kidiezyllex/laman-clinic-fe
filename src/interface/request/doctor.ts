export interface ICreateDoctorBody {
  name: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  specialization: string;
  department?: string;
  active?: boolean;
}

export interface IUpdateDoctorBody {
  name?: string;
  email?: string;
  password?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  specialization?: string;
  department?: string;
  active?: boolean;
}

export interface IReExaminationBody {
  appointmentId: string;
  notes: string;
  nextAppointmentDate?: string;
}

export interface ICreateRequestTestBody {
  appointmentId: string;
  testTypeId: string;
  notes?: string;
}

export interface ICompleteAppointmentBody {
  appointmentId: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
}
