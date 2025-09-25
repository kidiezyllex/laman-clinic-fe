import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPharmacists,
  getPharmacistById,
  updatePharmacist,
  createPharmacist,
  deletePharmacist
} from '@/api/pharmacist';
import { 
  IGetPharmacistsResponse,
  IGetPharmacistByIdResponse,
  ICreatePharmacistResponse,
  IUpdatePharmacistResponse,
  IDeletePharmacistResponse
} from '@/interface/response/pharmacist';
import { 
  ICreatePharmacistBody,
  IUpdatePharmacistBody
} from '@/interface/request/pharmacist';

export const useGetPharmacists = () => {
  return useQuery<IGetPharmacistsResponse, Error>({
    queryKey: ['pharmacists'],
    queryFn: getPharmacists,
  });
};

export const useGetPharmacistById = (id: string) => {
  return useQuery<IGetPharmacistByIdResponse, Error>({
    queryKey: ['pharmacist', id],
    queryFn: () => getPharmacistById(id),
    enabled: !!id,
  });
};

export const useCreatePharmacist = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreatePharmacistResponse, Error, ICreatePharmacistBody>({
    mutationFn: createPharmacist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacists'] });
    },
  });
};

export const useUpdatePharmacist = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdatePharmacistResponse, Error, { id: string; data: IUpdatePharmacistBody }>({
    mutationFn: ({ id, data }) => updatePharmacist(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pharmacists'] });
      queryClient.invalidateQueries({ queryKey: ['pharmacist', variables.id] });
    },
  });
};

export const useDeletePharmacist = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeletePharmacistResponse, Error, string>({
    mutationFn: deletePharmacist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacists'] });
    },
  });
};
