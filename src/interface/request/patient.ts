export interface ICreatePatientBody {
  name: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
  };
  active?: boolean;
}

export interface IUpdatePatientBody {
  name?: string;
  email?: string;
  password?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
  };
  active?: boolean;
}
