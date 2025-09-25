export interface ICreateAdminBody {
  name: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  role?: string;
  department?: string;
  active?: boolean;
}

export interface IUpdateAdminBody {
  name?: string;
  email?: string;
  password?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  role?: string;
  department?: string;
  active?: boolean;
}
