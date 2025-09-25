export interface ITest {
  _id: string;
  appointmentId: string;
  testTypeId: string;
  patientId: string;
  doctorId: string;
  technicianId: string;
  requestTestId?: string;
  results?: any;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetTestsResponse {
  message: string;
  data: ITest[];
}

export interface IGetTestByIdResponse {
  message: string;
  data: ITest;
}

export interface ICreateTestResponse {
  message: string;
  data: ITest;
}

export interface IUpdateTestResponse {
  message: string;
  data: ITest;
}

export interface IDeleteTestResponse {
  message: string;
}
