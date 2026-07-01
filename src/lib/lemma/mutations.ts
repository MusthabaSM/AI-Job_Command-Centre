import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lemmaClient } from './client';

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (resumeData: Record<string, unknown>) => {
      // Direct insertion into the resumes table
      const record = await lemmaClient.records.create('resumes', resumeData);
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const record = await lemmaClient.records.update('applications', id, { status });
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};
