import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionsByAppointment,
  createPrescription,
  updatePrescription,
  deletePrescription,
  checkPrescriptions
} from '@/api/prescription';
import { 
  IGetPrescriptionsResponse,
  IGetPrescriptionByIdResponse,
  ICreatePrescriptionResponse,
  IUpdatePrescriptionResponse,
  IDeletePrescriptionResponse
} from '@/interface/response/prescription';
import { 
  ICreatePrescriptionBody,
  IUpdatePrescriptionBody
} from '@/interface/request/prescription';

export const useGetPrescriptions = () => {
  return useQuery<IGetPrescriptionsResponse, Error>({
    queryKey: ['prescriptions'],
    queryFn: getPrescriptions,
  });
};

export const useGetPrescriptionById = (id: string) => {
  return useQuery<IGetPrescriptionByIdResponse, Error>({
    queryKey: ['prescription', id],
    queryFn: () => getPrescriptionById(id),
    enabled: !!id,
  });
};

export const useGetPrescriptionsByAppointment = (appointmentId: string) => {
  return useQuery<IGetPrescriptionsResponse, Error>({
    queryKey: ['prescriptions', 'appointment', appointmentId],
    queryFn: () => getPrescriptionsByAppointment(appointmentId),
    enabled: !!appointmentId,
  });
};

export const useCheckPrescriptions = (doctorId: string) => {
  return useQuery({
    queryKey: ['prescriptions', 'check', doctorId],
    queryFn: () => checkPrescriptions(doctorId),
    enabled: !!doctorId,
  });
};

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreatePrescriptionResponse, Error, ICreatePrescriptionBody>({
    mutationFn: createPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
};

export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdatePrescriptionResponse, Error, { id: string; data: IUpdatePrescriptionBody }>({
    mutationFn: ({ id, data }) => updatePrescription(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['prescription', variables.id] });
    },
  });
};

export const useDeletePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeletePrescriptionResponse, Error, string>({
    mutationFn: deletePrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
};
