import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useGelombangAktif = (jenjang) =>
  useQuery({
    queryKey: ['gelombang', jenjang],
    queryFn: async () => {
      const { data } = await api.get(`/gelombang/${jenjang}`);
      return data.data;
    },
    enabled: !!jenjang,
    staleTime: 5 * 60 * 1000,   // 5 menit
  });
