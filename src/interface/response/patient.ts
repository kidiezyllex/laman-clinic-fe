export interface IPatient {
  _id: string;
  name: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetPatientsResponse {
  message: string;
  data: IPatient[];
}

export interface IGetPatientByIdResponse {
  message: string;
  data: IPatient;
}

export interface ICreatePatientResponse {
  message: string;
  data: IPatient;
}

export interface IUpdatePatientResponse {
  message: string;
  data: IPatient;
}

export interface IDeletePatientResponse {
  message: string;
}
