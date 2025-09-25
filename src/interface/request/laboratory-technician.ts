export interface ICreateLaboratoryTechnicianBody {
  name: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  department?: string;
  active?: boolean;
}

export interface IUpdateLaboratoryTechnicianBody {
  name?: string;
  email?: string;
  password?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  department?: string;
  active?: boolean;
}
