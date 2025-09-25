import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deleteMedication,
  getMedicationFluctuations
} from '@/api/medication';
import { 
  IGetMedicationsResponse,
  IGetMedicationByIdResponse,
  ICreateMedicationResponse,
  IUpdateMedicationResponse,
  IDeleteMedicationResponse,
  IMedicationFluctuationsResponse
} from '@/interface/response/medication';
import { 
  ICreateMedicationBody,
  IUpdateMedicationBody
} from '@/interface/request/medication';

export const useGetMedications = () => {
  return useQuery<IGetMedicationsResponse, Error>({
    queryKey: ['medications'],
    queryFn: getMedications,
  });
};

export const useGetMedicationById = (id: string) => {
  return useQuery<IGetMedicationByIdResponse, Error>({
    queryKey: ['medication', id],
    queryFn: () => getMedicationById(id),
    enabled: !!id,
  });
};

export const useGetMedicationFluctuations = () => {
  return useQuery<IMedicationFluctuationsResponse, Error>({
    queryKey: ['medications', 'fluctuations'],
    queryFn: getMedicationFluctuations,
  });
};

export const useCreateMedication = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateMedicationResponse, Error, ICreateMedicationBody>({
    mutationFn: createMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
};

export const useUpdateMedication = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateMedicationResponse, Error, { id: string; data: IUpdateMedicationBody }>({
    mutationFn: ({ id, data }) => updateMedication(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['medication', variables.id] });
    },
  });
};

export const useDeleteMedication = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteMedicationResponse, Error, string>({
    mutationFn: deleteMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
};
