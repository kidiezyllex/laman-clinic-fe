export interface ICreateMedicationBody {
  name: string;
  description?: string;
  dosage: string;
  unit: string;
  price: number;
  stock: number;
  category?: string;
  manufacturer?: string;
  expiryDate?: string;
  active?: boolean;
}

export interface IUpdateMedicationBody {
  name?: string;
  description?: string;
  dosage?: string;
  unit?: string;
  price?: number;
  stock?: number;
  category?: string;
  manufacturer?: string;
  expiryDate?: string;
  active?: boolean;
}
