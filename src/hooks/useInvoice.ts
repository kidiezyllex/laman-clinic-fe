import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
} from '@/api/invoice';
import { 
  IGetInvoicesResponse,
  IGetInvoiceByIdResponse,
  ICreateInvoiceResponse,
  IUpdateInvoiceResponse,
  IDeleteInvoiceResponse
} from '@/interface/response/invoice';
import { 
  ICreateInvoiceBody,
  IUpdateInvoiceBody
} from '@/interface/request/invoice';

export const useGetInvoices = () => {
  return useQuery<IGetInvoicesResponse, Error>({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  });
};

export const useGetInvoiceById = (id: string) => {
  return useQuery<IGetInvoiceByIdResponse, Error>({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateInvoiceResponse, Error, ICreateInvoiceBody>({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateInvoiceResponse, Error, { id: string; data: IUpdateInvoiceBody }>({
    mutationFn: ({ id, data }) => updateInvoice(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteInvoiceResponse, Error, string>({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};
