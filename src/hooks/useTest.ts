import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTests,
  getTestById,
  getTestsByAppointment,
  createTest,
  updateTest,
  deleteTest,
  checkTests
} from '@/api/test';
import { 
  IGetTestsResponse,
  IGetTestByIdResponse,
  ICreateTestResponse,
  IUpdateTestResponse,
  IDeleteTestResponse
} from '@/interface/response/test';
import { 
  ICreateTestBody,
  IUpdateTestBody
} from '@/interface/request/test';

export const useGetTests = () => {
  return useQuery<IGetTestsResponse, Error>({
    queryKey: ['tests'],
    queryFn: getTests,
  });
};

export const useGetTestById = (id: string) => {
  return useQuery<IGetTestByIdResponse, Error>({
    queryKey: ['test', id],
    queryFn: () => getTestById(id),
    enabled: !!id,
  });
};

export const useGetTestsByAppointment = (appointmentId: string) => {
  return useQuery<IGetTestsResponse, Error>({
    queryKey: ['tests', 'appointment', appointmentId],
    queryFn: () => getTestsByAppointment(appointmentId),
    enabled: !!appointmentId,
  });
};

export const useCheckTests = (doctorId: string) => {
  return useQuery({
    queryKey: ['tests', 'check', doctorId],
    queryFn: () => checkTests(doctorId),
    enabled: !!doctorId,
  });
};

export const useCreateTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateTestResponse, Error, ICreateTestBody>({
    mutationFn: createTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
};

export const useUpdateTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateTestResponse, Error, { id: string; data: IUpdateTestBody }>({
    mutationFn: ({ id, data }) => updateTest(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      queryClient.invalidateQueries({ queryKey: ['test', variables.id] });
    },
  });
};

export const useDeleteTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteTestResponse, Error, string>({
    mutationFn: deleteTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
};
