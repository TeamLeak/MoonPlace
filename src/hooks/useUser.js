'use client';

import { useAuth } from '@/context/AuthContext';

export const useUser = () => {
  const { user, loading } = useAuth();
  return { data: user, loading };
};
