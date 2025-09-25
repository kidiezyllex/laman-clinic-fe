import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getRequestTests,
  getRequestTestById,
  createRequestTest,
  updateRequestTest,
  deleteRequestTest,
  checkRequestTests
} from '@/api/request-test';
import { 
  IGetRequestTestsResponse,
  IGetRequestTestByIdResponse,
  ICreateRequestTestResponse,
  IUpdateRequestTestResponse,
  IDeleteRequestTestResponse
} from '@/interface/response/request-test';
import { 
  ICreateRequestTestBody,
  IUpdateRequestTestBody
} from '@/interface/request/request-test';

export const useGetRequestTests = () => {
  return useQuery<IGetRequestTestsResponse, Error>({
    queryKey: ['request-tests'],
    queryFn: getRequestTests,
  });
};

export const useGetRequestTestById = (id: string) => {
  return useQuery<IGetRequestTestByIdResponse, Error>({
    queryKey: ['request-test', id],
    queryFn: () => getRequestTestById(id),
    enabled: !!id,
  });
};

export const useCheckRequestTests = (doctorId: string) => {
  return useQuery({
    queryKey: ['request-tests', 'check', doctorId],
    queryFn: () => checkRequestTests(doctorId),
    enabled: !!doctorId,
  });
};

export const useCreateRequestTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateRequestTestResponse, Error, ICreateRequestTestBody>({
    mutationFn: createRequestTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request-tests'] });
    },
  });
};

export const useUpdateRequestTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateRequestTestResponse, Error, { id: string; data: IUpdateRequestTestBody }>({
    mutationFn: ({ id, data }) => updateRequestTest(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['request-tests'] });
      queryClient.invalidateQueries({ queryKey: ['request-test', variables.id] });
    },
  });
};

export const useDeleteRequestTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteRequestTestResponse, Error, string>({
    mutationFn: deleteRequestTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request-tests'] });
    },
  });
};
