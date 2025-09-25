export interface ICreateReceptionistBody {
  name: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  department?: string;
  active?: boolean;
}

export interface IUpdateReceptionistBody {
  name?: string;
  email?: string;
  password?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  department?: string;
  active?: boolean;
}
