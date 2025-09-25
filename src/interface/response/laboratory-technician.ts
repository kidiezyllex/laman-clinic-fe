export interface ILaboratoryTechnician {
  _id: string;
  name: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
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

export interface IGetLaboratoryTechniciansResponse {
  message: string;
  data: ILaboratoryTechnician[];
}

export interface IGetLaboratoryTechnicianByIdResponse {
  message: string;
  data: ILaboratoryTechnician;
}

export interface ICreateLaboratoryTechnicianResponse {
  message: string;
  data: ILaboratoryTechnician;
}

export interface IUpdateLaboratoryTechnicianResponse {
  message: string;
  data: ILaboratoryTechnician;
}

export interface IDeleteLaboratoryTechnicianResponse {
  message: string;
}
