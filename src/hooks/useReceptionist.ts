import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getReceptionists,
  getReceptionistById,
  updateReceptionist,
  createReceptionist,
  deleteReceptionist
} from '@/api/receptionist';
import { 
  IGetReceptionistsResponse,
  IGetReceptionistByIdResponse,
  ICreateReceptionistResponse,
  IUpdateReceptionistResponse,
  IDeleteReceptionistResponse
} from '@/interface/response/receptionist';
import { 
  ICreateReceptionistBody,
  IUpdateReceptionistBody
} from '@/interface/request/receptionist';

export const useGetReceptionists = () => {
  return useQuery<IGetReceptionistsResponse, Error>({
    queryKey: ['receptionists'],
    queryFn: getReceptionists,
  });
};

export const useGetReceptionistById = (id: string) => {
  return useQuery<IGetReceptionistByIdResponse, Error>({
    queryKey: ['receptionist', id],
    queryFn: () => getReceptionistById(id),
    enabled: !!id,
  });
};

export const useCreateReceptionist = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateReceptionistResponse, Error, ICreateReceptionistBody>({
    mutationFn: createReceptionist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receptionists'] });
    },
  });
};

export const useUpdateReceptionist = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateReceptionistResponse, Error, { id: string; data: IUpdateReceptionistBody }>({
    mutationFn: ({ id, data }) => updateReceptionist(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['receptionists'] });
      queryClient.invalidateQueries({ queryKey: ['receptionist', variables.id] });
    },
  });
};

export const useDeleteReceptionist = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteReceptionistResponse, Error, string>({
    mutationFn: deleteReceptionist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receptionists'] });
    },
  });
};
