export interface ICreateTestTypeBody {
  name: string;
  description?: string;
  price: number;
  category?: string;
  preparation?: string;
  duration?: number;
  active?: boolean;
}

export interface IUpdateTestTypeBody {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  preparation?: string;
  duration?: number;
  active?: boolean;
}
