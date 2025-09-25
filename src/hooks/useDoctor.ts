import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  getDoctorSpecializations,
  updateDoctor,
  createDoctor,
  deleteDoctor,
  createReExamination,
  createRequestTest,
  completeAppointment,
  checkRequestTests,
  checkTests,
  checkPrescriptions
} from '@/api/doctor';
import { 
  IGetDoctorsResponse,
  IGetDoctorByIdResponse,
  IGetDoctorSpecializationsResponse,
  ICreateDoctorResponse,
  IUpdateDoctorResponse,
  IDeleteDoctorResponse,
  IReExaminationResponse,
  ICreateRequestTestResponse,
  ICompleteAppointmentResponse
} from '@/interface/response/doctor';
import { 
  ICreateDoctorBody,
  IUpdateDoctorBody,
  IReExaminationBody,
  ICreateRequestTestBody,
  ICompleteAppointmentBody
} from '@/interface/request/doctor';

export const useGetDoctors = () => {
  return useQuery<IGetDoctorsResponse, Error>({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  });
};

export const useGetDoctorById = (id: string) => {
  return useQuery<IGetDoctorByIdResponse, Error>({
    queryKey: ['doctor', id],
    queryFn: () => getDoctorById(id),
    enabled: !!id,
  });
};

export const useGetDoctorsBySpecialization = (specialization: string) => {
  return useQuery<IGetDoctorsResponse, Error>({
    queryKey: ['doctors', 'specialization', specialization],
    queryFn: () => getDoctorsBySpecialization(specialization),
    enabled: !!specialization,
  });
};

export const useGetDoctorSpecializations = () => {
  return useQuery<IGetDoctorSpecializationsResponse, Error>({
    queryKey: ['doctors', 'specializations'],
    queryFn: getDoctorSpecializations,
  });
};

export const useCheckRequestTests = (doctorId: string) => {
  return useQuery({
    queryKey: ['request-tests', 'check', doctorId],
    queryFn: () => checkRequestTests(doctorId),
    enabled: !!doctorId,
  });
};

export const useCheckTests = (doctorId: string) => {
  return useQuery({
    queryKey: ['tests', 'check', doctorId],
    queryFn: () => checkTests(doctorId),
    enabled: !!doctorId,
  });
};

export const useCheckPrescriptions = (doctorId: string) => {
  return useQuery({
    queryKey: ['prescriptions', 'check', doctorId],
    queryFn: () => checkPrescriptions(doctorId),
    enabled: !!doctorId,
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateDoctorResponse, Error, ICreateDoctorBody>({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateDoctorResponse, Error, { id: string; data: IUpdateDoctorBody }>({
    mutationFn: ({ id, data }) => updateDoctor(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctor', variables.id] });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteDoctorResponse, Error, string>({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};

export const useCreateReExamination = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IReExaminationResponse, Error, IReExaminationBody>({
    mutationFn: createReExamination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
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

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICompleteAppointmentResponse, Error, ICompleteAppointmentBody>({
    mutationFn: completeAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
