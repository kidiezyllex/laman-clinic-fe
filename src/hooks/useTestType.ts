import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTestTypes,
  getTestTypeById,
  createTestType,
  updateTestType,
  deleteTestType
} from '@/api/test-type';
import { 
  IGetTestTypesResponse,
  IGetTestTypeByIdResponse,
  ICreateTestTypeResponse,
  IUpdateTestTypeResponse,
  IDeleteTestTypeResponse
} from '@/interface/response/test-type';
import { 
  ICreateTestTypeBody,
  IUpdateTestTypeBody
} from '@/interface/request/test-type';

export const useGetTestTypes = () => {
  return useQuery<IGetTestTypesResponse, Error>({
    queryKey: ['test-types'],
    queryFn: getTestTypes,
  });
};

export const useGetTestTypeById = (id: string) => {
  return useQuery<IGetTestTypeByIdResponse, Error>({
    queryKey: ['test-type', id],
    queryFn: () => getTestTypeById(id),
    enabled: !!id,
  });
};

export const useCreateTestType = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateTestTypeResponse, Error, ICreateTestTypeBody>({
    mutationFn: createTestType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test-types'] });
    },
  });
};

export const useUpdateTestType = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateTestTypeResponse, Error, { id: string; data: IUpdateTestTypeBody }>({
    mutationFn: ({ id, data }) => updateTestType(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['test-types'] });
      queryClient.invalidateQueries({ queryKey: ['test-type', variables.id] });
    },
  });
};

export const useDeleteTestType = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteTestTypeResponse, Error, string>({
    mutationFn: deleteTestType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test-types'] });
    },
  });
};
