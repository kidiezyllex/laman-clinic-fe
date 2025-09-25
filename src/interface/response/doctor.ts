export interface IDoctor {
  _id: string;
  name: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  specialization: string;
  department: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  phone?: string;
  schedule?: any[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetDoctorsResponse {
  message: string;
  data: IDoctor[];
}

export interface IGetDoctorByIdResponse {
  message: string;
  data: IDoctor;
}

export interface IGetDoctorSpecializationsResponse {
  message: string;
  data: string[];
}

export interface ICreateDoctorResponse {
  message: string;
  data: IDoctor;
}

export interface IUpdateDoctorResponse {
  message: string;
  data: IDoctor;
}

export interface IDeleteDoctorResponse {
  message: string;
}

export interface IReExaminationResponse {
  message: string;
  data: any;
}

export interface ICreateRequestTestResponse {
  message: string;
  data: any;
}

export interface ICompleteAppointmentResponse {
  message: string;
  data: any;
}
