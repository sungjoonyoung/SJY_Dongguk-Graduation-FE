import type { StudentRecord, BackendStudentPayload } from '../types';

/**
 * 프론트엔드 학생 레코드에서 개인정보(학번, 이름)를 제거하고
 * 백엔드 분석용 페이로드로 변환합니다.
 * @param students StudentRecord[]
 * @returns BackendStudentPayload[] (익명화된 데이터)
 */
export function transformToBackendPayload(students: StudentRecord[]): BackendStudentPayload[] {
  return students
    .filter(s => s.status === 'normal') // 성적과 매칭이 완료된 정상 학생만 대상
    .map(student => ({
      encryptedId: student.encryptedId, // SHA256 암호화된 키 (매칭용)
      admissionYear: student.admissionYear,
      studentType: student.studentType,
      major: student.major,
      doubleMajors: student.doubleMajors,
      grades: student.grades // 성적 정보 (학수번호, 이수구분, 학점 등)
    }));
}

/**
 * 프론트엔드에서 나중에 결과를 다시 학번/이름과 매칭하기 위해
 * 보관해야 할 매핑 테이블을 생성합니다.
 * @param students StudentRecord[]
 * @returns Record<encryptedId, { studentId, name }>
 */
export function createMappingTable(students: StudentRecord[]): Record<string, { studentId: string, name: string }> {
  const mapping: Record<string, { studentId: string, name: string }> = {};
  
  students.forEach(s => {
    mapping[s.encryptedId] = {
      studentId: s.studentId,
      name: s.name
    };
  });
  
  return mapping;
}
