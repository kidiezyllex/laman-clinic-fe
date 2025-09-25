export interface ITestType {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  preparation?: string;
  duration?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetTestTypesResponse {
  message: string;
  data: ITestType[];
}

export interface IGetTestTypeByIdResponse {
  message: string;
  data: ITestType;
}

export interface ICreateTestTypeResponse {
  message: string;
  data: ITestType;
}

export interface IUpdateTestTypeResponse {
  message: string;
  data: ITestType;
}

export interface IDeleteTestTypeResponse {
  message: string;
}
