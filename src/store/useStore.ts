import { create } from 'zustand';
import type { StudentMeta, StudentRecord } from '../types';

interface StoreState {
  step: 'upload' | 'processing' | 'preview';
  studentIndex: Record<string, StudentMeta>;
  students: StudentRecord[];
  
  // 진행률 관련
  totalFiles: number;
  processedFiles: number;
  
  // 액션
  setStep: (step: 'upload' | 'processing' | 'preview') => void;
  setStudentIndex: (index: Record<string, StudentMeta>) => void;
  setStudents: (students: StudentRecord[]) => void;
  updateProgress: (processed: number, total: number) => void;
  reset: () => void;
}

export const useStore = create<StoreState>((set) => ({
  step: 'upload',
  studentIndex: {},
  students: [],
  totalFiles: 0,
  processedFiles: 0,

  setStep: (step) => set({ step }),
  setStudentIndex: (studentIndex) => set({ studentIndex }),
  setStudents: (students) => set({ students }),
  updateProgress: (processed, total) => set({ processedFiles: processed, totalFiles: total }),
  
  reset: () => set({
    step: 'upload',
    studentIndex: {},
    students: [],
    totalFiles: 0,
    processedFiles: 0
  })
}));
