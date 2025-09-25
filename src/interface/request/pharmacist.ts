export interface ICreatePharmacistBody {
  name: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  department?: string;
  active?: boolean;
}

export interface IUpdatePharmacistBody {
  name?: string;
  email?: string;
  password?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  department?: string;
  active?: boolean;
}
