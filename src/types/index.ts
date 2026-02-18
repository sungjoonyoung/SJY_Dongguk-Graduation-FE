export interface GradeRow {
  no: number;
  yearSemester: string; // 년도학기
  subjectCode: string; // 학수번호
  classNum: string; // 분반
  subjectName: string; // 교과목명
  professor: string; // 담당교원
  englishType: string; // 원어강의종류
  recognition: string; // 인정구분
  category: string; // 이수구분
  subCategory: string; // 이수구분영역
  credits: number; // 학점
  grade: string; // 등급
  deleteCategory: string; // 삭제구분
  retakeYearSemester?: string; // 재수강 년도학기
  retakeSubjectCode?: string; // 재수강 학수번호
  institutionName?: string; // 이수기관명
  graduateCategory?: string; // 대학원구분
}

export interface StudentMeta {
  studentId: string; // 학번
  name: string; // 이름
  admissionYear: number; // 입학연도
  studentType: string; // 학생유형 (일반, 전과생, 3학년편입, 학석사연계, 재입학)
  ipp: string; // IPP이수 (Y/N)
  semesterCount: number; // 학기차
  gradExpectation: string; // 졸업예정
  languageType: string; // 어학시험종류
  languageScore: string; // 어학점수
  thesis: string; // 졸업논문 (Y/N)
  exam: string; // 종합시험 (Y/N)
  major: string; // 주전공
  isDeepMajor: string; // 심화여부 (Y/N)
  minors: string[]; // 복수전공1~5
}

export interface StudentRecord {
  encryptedId: string;
  studentId: string;
  name: string;
  admissionYear: number;
  studentType: string;
  major: string;
  grades: GradeRow[];
  totalCredits: number;
  errors: string[];
  status: 'normal' | 'missing_grades' | 'missing_info' | 'parsing_error';
}

export interface StoreState {
  step: 'upload' | 'processing' | 'preview';
  studentIndex: Record<string, StudentMeta>;
  students: StudentRecord[];
  processingProgress: number;
  totalFiles: number;
  processedFiles: number;
}
