export interface IPharmacist {
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

export interface IGetPharmacistsResponse {
  message: string;
  data: IPharmacist[];
}

export interface IGetPharmacistByIdResponse {
  message: string;
  data: IPharmacist;
}

export interface ICreatePharmacistResponse {
  message: string;
  data: IPharmacist;
}

export interface IUpdatePharmacistResponse {
  message: string;
  data: IPharmacist;
}

export interface IDeletePharmacistResponse {
  message: string;
}
