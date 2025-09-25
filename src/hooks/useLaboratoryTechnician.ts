import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getLaboratoryTechnicians,
  getLaboratoryTechnicianById,
  updateLaboratoryTechnician,
  createLaboratoryTechnician,
  deleteLaboratoryTechnician
} from '@/api/laboratory-technician';
import { 
  IGetLaboratoryTechniciansResponse,
  IGetLaboratoryTechnicianByIdResponse,
  ICreateLaboratoryTechnicianResponse,
  IUpdateLaboratoryTechnicianResponse,
  IDeleteLaboratoryTechnicianResponse
} from '@/interface/response/laboratory-technician';
import { 
  ICreateLaboratoryTechnicianBody,
  IUpdateLaboratoryTechnicianBody
} from '@/interface/request/laboratory-technician';

export const useGetLaboratoryTechnicians = () => {
  return useQuery<IGetLaboratoryTechniciansResponse, Error>({
    queryKey: ['laboratory-technicians'],
    queryFn: getLaboratoryTechnicians,
  });
};

export const useGetLaboratoryTechnicianById = (id: string) => {
  return useQuery<IGetLaboratoryTechnicianByIdResponse, Error>({
    queryKey: ['laboratory-technician', id],
    queryFn: () => getLaboratoryTechnicianById(id),
    enabled: !!id,
  });
};

export const useCreateLaboratoryTechnician = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateLaboratoryTechnicianResponse, Error, ICreateLaboratoryTechnicianBody>({
    mutationFn: createLaboratoryTechnician,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratory-technicians'] });
    },
  });
};

export const useUpdateLaboratoryTechnician = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateLaboratoryTechnicianResponse, Error, { id: string; data: IUpdateLaboratoryTechnicianBody }>({
    mutationFn: ({ id, data }) => updateLaboratoryTechnician(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['laboratory-technicians'] });
      queryClient.invalidateQueries({ queryKey: ['laboratory-technician', variables.id] });
    },
  });
};

export const useDeleteLaboratoryTechnician = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteLaboratoryTechnicianResponse, Error, string>({
    mutationFn: deleteLaboratoryTechnician,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratory-technicians'] });
    },
  });
};
