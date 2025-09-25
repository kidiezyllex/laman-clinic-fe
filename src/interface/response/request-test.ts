export interface IRequestTest {
  _id: string;
  appointmentId: string;
  testTypeId: string;
  patientId: string;
  doctorId: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetRequestTestsResponse {
  message: string;
  data: IRequestTest[];
}

export interface IGetRequestTestByIdResponse {
  message: string;
  data: IRequestTest;
}

export interface ICreateRequestTestResponse {
  message: string;
  data: IRequestTest;
}

export interface IUpdateRequestTestResponse {
  message: string;
  data: IRequestTest;
}

export interface IDeleteRequestTestResponse {
  message: string;
}
