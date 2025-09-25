import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAdminById,
  updateAdmin,
  createAdmin,
  deleteAdmin
} from '@/api/admin';
import { 
  IGetAdminByIdResponse,
  ICreateAdminResponse,
  IUpdateAdminResponse,
  IDeleteAdminResponse
} from '@/interface/response/admin';
import { 
  ICreateAdminBody,
  IUpdateAdminBody
} from '@/interface/request/admin';

export const useGetAdminById = (id: string) => {
  return useQuery<IGetAdminByIdResponse, Error>({
    queryKey: ['admin', id],
    queryFn: () => getAdminById(id),
    enabled: !!id,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateAdminResponse, Error, ICreateAdminBody>({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateAdminResponse, Error, { id: string; data: IUpdateAdminBody }>({
    mutationFn: ({ id, data }) => updateAdmin(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['admin', variables.id] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteAdminResponse, Error, string>({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};
