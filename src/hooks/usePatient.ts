import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPatients,
  getPatientById,
  getPatientByEmail,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientByClerk
} from '@/api/patient';
import { 
  IGetPatientsResponse,
  IGetPatientByIdResponse,
  ICreatePatientResponse,
  IUpdatePatientResponse,
  IDeletePatientResponse
} from '@/interface/response/patient';
import { 
  ICreatePatientBody,
  IUpdatePatientBody
} from '@/interface/request/patient';

export const useGetPatients = () => {
  return useQuery<IGetPatientsResponse, Error>({
    queryKey: ['patients'],
    queryFn: getPatients,
  });
};

export const useGetPatientById = (id: string) => {
  return useQuery<IGetPatientByIdResponse, Error>({
    queryKey: ['patient', id],
    queryFn: () => getPatientById(id),
    enabled: !!id,
  });
};

export const useGetPatientByEmail = (email: string) => {
  return useQuery<IGetPatientByIdResponse, Error>({
    queryKey: ['patient', 'email', email],
    queryFn: () => getPatientByEmail(email),
    enabled: !!email,
  });
};

export const useGetPatientByClerk = (userId: string) => {
  return useQuery<IGetPatientByIdResponse, Error>({
    queryKey: ['patient', 'clerk', userId],
    queryFn: () => getPatientByClerk(userId),
    enabled: !!userId,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreatePatientResponse, Error, ICreatePatientBody>({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdatePatientResponse, Error, { id: string; data: IUpdatePatientBody }>({
    mutationFn: ({ id, data }) => updatePatient(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', variables.id] });
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeletePatientResponse, Error, string>({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
