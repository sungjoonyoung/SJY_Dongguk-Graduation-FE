import type { StudentMeta, StudentRecord, GradeRow } from '../types';
import { ZipService } from './parseZipGrades';
import { encryptId } from './encryptId';

/**
 * 학생 메타정보와 성적 ZIP 파일을 매칭하여 최종 StudentRecord 배열을 생성합니다.
 */
export async function mergeStudents(
  studentIndex: Record<string, StudentMeta>,
  zipFile: File,
  onProgress?: (processed: number, total: number) => void
): Promise<StudentRecord[]> {
  const zipFiles = await ZipService.getFileList(zipFile);
  const zipFileEntries = Object.entries(zipFiles);
  const totalZipFiles = zipFileEntries.length;
  
  const studentRecords: StudentRecord[] = [];
  const processedStudentIds = new Set<string>();

  // 1단계: ZIP 내의 모든 파일을 처리
  for (let i = 0; i < totalZipFiles; i++) {
    const [fileName, zipEntry] = zipFileEntries[i];
    const studentId = ZipService.extractStudentId(fileName);
    
    if (onProgress) onProgress(i + 1, totalZipFiles);

    if (!studentId) {
      // 파일명이 규칙에 맞지 않는 경우
      studentRecords.push(createEmptyRecord('', fileName, 'parsing_error', ['파일명 형식이 올바르지 않습니다.']));
      continue;
    }

    processedStudentIds.add(studentId);
    const meta = studentIndex[studentId];

    try {
      const grades = await ZipService.parseGradeExcel(zipEntry);
      
      if (!meta) {
        // ZIP에는 있으나 메타정보(Excel)에는 없는 학생
        studentRecords.push(createEmptyRecord(studentId, fileName, 'missing_info', ['학생정보(마스터)에 존재하지 않는 학번입니다.'], grades));
      } else {
        // 정상적인 매칭
        studentRecords.push({
          encryptedId: encryptId(studentId),
          studentId,
          name: meta.name,
          admissionYear: meta.admissionYear,
          studentType: meta.studentType,
          major: meta.major,
          doubleMajors: meta.minors || [],
          grades,
          totalCredits: grades.reduce((sum, g) => sum + g.credits, 0),
          errors: [],
          status: 'normal'
        });
      }
    } catch (e) {
      // 엑셀 파싱 오류
      studentRecords.push(createEmptyRecord(studentId, fileName, 'parsing_error', ['성적 엑셀 파일을 파싱하는 중 오류가 발생했습니다.']));
    }
  }

  // 2단계: 메타정보(Excel)에는 있으나 ZIP에는 없는 학생 처리
  Object.keys(studentIndex).forEach((studentId) => {
    if (!processedStudentIds.has(studentId)) {
      const meta = studentIndex[studentId];
      studentRecords.push({
        encryptedId: encryptId(studentId),
        studentId,
        name: meta.name,
        admissionYear: meta.admissionYear,
        studentType: meta.studentType,
        major: meta.major,
        doubleMajors: meta.minors || [],
        grades: [],
        totalCredits: 0,
        errors: ['성적 파일이 ZIP 내에 존재하지 않습니다.'],
        status: 'missing_grades'
      });
    }
  });

  return studentRecords;
}

/**
 * 에러 케이스를 위한 빈 Record 생성 유틸리티
 */
function createEmptyRecord(
  studentId: string, 
  name: string, 
  status: StudentRecord['status'], 
  errors: string[],
  grades: GradeRow[] = []
): StudentRecord {
  return {
    encryptedId: studentId ? encryptId(studentId) : 'unknown',
    studentId: studentId || 'unknown',
    name: name || '알 수 없음',
    admissionYear: 0,
    studentType: '알 수 없음',
    major: '알 수 없음',
    doubleMajors: [],
    grades,
    totalCredits: grades.reduce((sum, g) => sum + g.credits, 0),
    errors,
    status
  };
}
