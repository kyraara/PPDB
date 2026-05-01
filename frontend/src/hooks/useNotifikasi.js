import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useNotifikasi = () =>
  useQuery({
    queryKey: ['notifikasi'],
    queryFn: async () => {
      const { data } = await api.get('/notifikasi/saya');
      return data.data;
    },
    refetchInterval: 60 * 1000,   // polling tiap 1 menit
  });
