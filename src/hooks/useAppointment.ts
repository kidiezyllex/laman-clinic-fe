import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAppointments,
  getAppointmentsByPatient,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDoctor,
  getAppointmentsByRoom
} from '@/api/appointment';
import { 
  IGetAppointmentsResponse,
  IGetAppointmentByIdResponse,
  ICreateAppointmentResponse,
  IUpdateAppointmentResponse,
  IDeleteAppointmentResponse
} from '@/interface/response/appointment';
import { 
  ICreateAppointmentBody,
  IUpdateAppointmentBody
} from '@/interface/request/appointment';

export const useGetAppointments = () => {
  return useQuery<IGetAppointmentsResponse, Error>({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  });
};

export const useGetAppointmentsByPatient = () => {
  return useQuery<IGetAppointmentsResponse, Error>({
    queryKey: ['appointments', 'patient'],
    queryFn: getAppointmentsByPatient,
  });
};

export const useGetAppointmentById = (id: string) => {
  return useQuery<IGetAppointmentByIdResponse, Error>({
    queryKey: ['appointment', id],
    queryFn: () => getAppointmentById(id),
    enabled: !!id,
  });
};

export const useGetAppointmentsByDoctor = (doctorId: string) => {
  return useQuery<IGetAppointmentsResponse, Error>({
    queryKey: ['appointments', 'doctor', doctorId],
    queryFn: () => getAppointmentsByDoctor(doctorId),
    enabled: !!doctorId,
  });
};

export const useGetAppointmentsByRoom = (roomNumber: string) => {
  return useQuery<IGetAppointmentsResponse, Error>({
    queryKey: ['appointments', 'room', roomNumber],
    queryFn: () => getAppointmentsByRoom(roomNumber),
    enabled: !!roomNumber,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateAppointmentResponse, Error, ICreateAppointmentBody>({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateAppointmentResponse, Error, { id: string; data: IUpdateAppointmentBody }>({
    mutationFn: ({ id, data }) => updateAppointment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.id] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteAppointmentResponse, Error, string>({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
