import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const usePendaftaranSaya = () =>
  useQuery({
    queryKey: ['pendaftaran', 'saya'],
    queryFn: async () => {
      const { data } = await api.get('/pendaftaran/saya');
      return data.data;
    },
    staleTime: 30 * 1000,   // 30 detik
    retry: 2,
  });

export const useSubmitPendaftaran = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/pendaftaran/${id}/submit`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pendaftaran'] }),
  });
};
