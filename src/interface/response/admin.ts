export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  role: string;
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

export interface IGetAdminByIdResponse {
  message: string;
  data: IAdmin;
}

export interface ICreateAdminResponse {
  message: string;
  data: IAdmin;
}

export interface IUpdateAdminResponse {
  message: string;
  data: IAdmin;
}

export interface IDeleteAdminResponse {
  message: string;
}
