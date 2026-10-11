import { useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from './client';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (resumeData: Record<string, unknown>) => {
      // Direct insertion into the resumes table
      const record = await (async () => { const ref = await addDoc(collection(db, 'resumes'), resumeData); const snap = await getDoc(ref); return { id: ref.id, ...snap.data() as any }; })();
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
      const record = await (async () => { const r = doc(db, 'applications', id); await updateDoc(r, { status }); const snap = await getDoc(r); return { id: r.id, ...snap.data() as any }; })();
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};
