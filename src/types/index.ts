/**
 * 성적 엑셀 파일의 개별 행 데이터를 정의하는 인터페이스입니다.
 * ZIP 파일 내 각 학생의 성적 엑셀 시트에서 추출된 로우 데이터 포맷입니다.
 */
export interface GradeRow {
  no: number;                // 순번 (No)
  yearSemester: string;      // 수강 년도 및 학기 (예: 2023년 1학기)
  subjectCode: string;       // 학수번호 (과목 고유 코드)
  classNum: string;          // 분반 번호
  subjectName: string;       // 교과목명
  professor: string;         // 담당 교원 성함
  englishType: string;       // 원어 강의 종류 (영어강의 여부 확인용)
  recognition: string;       // 인정 구분 (본교, 타교 등)
  category: string;          // 이수 구분 (전필, 전선, 공교, 일교 등)
  subCategory: string;       // 이수 구분 영역 (MSC, 핵심교양 영역 등)
  credits: number;           // 해당 과목의 학점 (1, 2, 3 등)
  grade: string;             // 취득 등급 (A+, B0, P 등)
  deleteCategory: string;    // 삭제 구분 (재수강 시 삭제 여부)
  retakeYearSemester?: string; // 재수강한 경우 해당 년도학기
  retakeSubjectCode?: string;  // 재수강한 경우 해당 학수번호
  institutionName?: string;    // 이수 기관명 (교환학생 등 외부 이수 시)
  graduateCategory?: string;   // 대학원 구분 (학석사 연계 등)
}

/**
 * 학생 마스터 정보 엑셀 파일의 포맷을 정의하는 인터페이스입니다.
 * 업로드된 '학생정보 엑셀'에서 추출된 기본 인적 사항 및 학적 정보입니다.
 */
export interface StudentMeta {
  studentId: string;         // 학번 (Key 역할)
  name: string;              // 이름
  admissionYear: number;     // 입학 연도
  studentType: string;       // 학생 유형 (일반, 전과생, 3학년편입, 학석사연계, 재입학 등)
  ipp: string;               // IPP(장기현장실습) 이수 여부 (Y/N)
  semesterCount: number;     // 현재까지 등록한 학기 차수
  gradExpectation: string;   // 졸업 예정 시기 (예: 2025-02)
  languageType: string;      // 어학 시험 종류 (TOEIC, OPIc 등)
  languageScore: string;     // 어학 시험 점수 또는 등급
  thesis: string;            // 졸업 논문 통과 여부 (Y/N)
  exam: string;              // 졸업 종합 시험 통과 여부 (Y/N)
  major: string;             // 주전공 (단과대학 및 학과 정보 포함)
  isDeepMajor: string;       // 전공 심화 이수 여부 (Y/N)
  minors: string[];          // 복수전공/연계전공 리스트 (최대 5개까지 수용)
}

/**
 * 프론트엔드에서 관리하는 최종 통합 학생 레코드 포맷입니다.
 * 마스터 정보(StudentMeta)와 성적 데이터(GradeRow[])가 결합된 형태입니다.
 */
export interface StudentRecord {
  encryptedId: string;       // 학번을 SHA256으로 암호화한 고유 키 (보안용)
  studentId: string;         // 원본 학번 (프론트엔드 관리용)
  name: string;              // 이름 (프론트엔드 관리용)
  admissionYear: number;     // 입학 연도
  studentType: string;       // 학생 유형
  major: string;             // 주전공
  doubleMajors: string[];    // 복수전공 리스트 (단일전공 여부 판단 근거)
  grades: GradeRow[];        // 학생이 이수한 전체 성적 배열
  totalCredits: number;      // 총 이수 학점 합계
  errors: string[];          // 데이터 매칭 또는 파싱 과정에서 발생한 에러 메시지
  status: 'normal' | 'missing_grades' | 'missing_info' | 'parsing_error'; // 매칭 상태
}

/**
 * 백엔드 서버로 전송하기 위한 데이터 페이로드 포맷입니다.
 * 개인 식별 정보(학번, 이름)를 완전히 제외하여 보안을 강화한 익명화 데이터입니다.
 */
export interface BackendStudentPayload {
  encryptedId: string;       // 백엔드 분석 결과와 프론트 데이터를 매칭하기 위한 유일한 키
  admissionYear: number;     // 입학 연도 (졸업 요건 기준점)
  studentType: string;       // 학생 유형 (요건 차등 적용 근거)
  major: string;             // 주전공 (전공 요건 판단 근거)
  doubleMajors: string[];    // 복수전공 리스트 (졸업 요건 변동 근거)
  grades: GradeRow[];        // 전체 이수 성적 (분석의 핵심 데이터)
}

/**
 * 전역 상태 관리(Zustand Store)에서 사용하는 전체 앱 상태 구조입니다.
 */
export interface StoreState {
  step: 'upload' | 'processing' | 'preview'; // 현재 화면 단계 (업로드/처리중/미리보기)
  studentIndex: Record<string, StudentMeta>; // 학번을 키로 하는 마스터 정보 캐시
  students: StudentRecord[];                // 병합 및 가공이 완료된 전체 학생 리스트
  processingProgress: number;               // 현재 처리율 (%)
  totalFiles: number;                       // 분석 대상 총 파일 수
  processedFiles: number;                   // 분석 완료된 파일 수
}
