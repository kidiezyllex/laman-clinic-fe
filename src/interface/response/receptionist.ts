export interface IReceptionist {
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

export interface IGetReceptionistsResponse {
  message: string;
  data: IReceptionist[];
}

export interface IGetReceptionistByIdResponse {
  message: string;
  data: IReceptionist;
}

export interface ICreateReceptionistResponse {
  message: string;
  data: IReceptionist;
}

export interface IUpdateReceptionistResponse {
  message: string;
  data: IReceptionist;
}

export interface IDeleteReceptionistResponse {
  message: string;
}
