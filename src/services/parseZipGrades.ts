import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import type { GradeRow } from '../types';

/**
 * 성적 ZIP 파일 내의 파일들을 처리하기 위한 서비스
 */
export const ZipService = {
  /**
   * ZIP 파일 내에서 "성적정보_{학번}.xlsx" 형식의 파일 목록을 추출합니다.
   * @param zipFile ZIP 파일 객체
   * @returns 파일명과 JSZipObject의 매핑 객체
   */
  async getFileList(zipFile: File): Promise<Record<string, JSZip.JSZipObject>> {
    const zip = await JSZip.loadAsync(zipFile);
    const files: Record<string, JSZip.JSZipObject> = {};
    
    zip.forEach((relativePath, zipEntry) => {
      // "성적정보_학번.xlsx" 형식만 필터링 (정규표현식 사용)
      if (relativePath.includes('성적정보_') && relativePath.endsWith('.xlsx')) {
        files[relativePath] = zipEntry;
      }
    });
    
    return files;
  },

  /**
   * 파일명에서 학번을 추출합니다. (예: "성적정보_20211234.xlsx" -> "20211234")
   * @param fileName 파일 경로 및 이름
   * @returns 추출된 학번
   */
  extractStudentId(fileName: string): string | null {
    // 경로 구분자 제거 후 파일명만 추출
    const baseName = fileName.split('/').pop() || '';
    const match = baseName.match(/성적정보_(\d+)\.xlsx/);
    return match ? match[1] : null;
  },

  /**
   * 특정 ZIP 엔트리(엑셀 파일)를 파싱하여 GradeRow 배열로 반환합니다.
   * @param zipEntry JSZipObject
   * @returns GradeRow[]
   */
  async parseGradeExcel(zipEntry: JSZip.JSZipObject): Promise<GradeRow[]> {
    const data = await zipEntry.async('arraybuffer');
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];
    
    return jsonData.map((row) => ({
      no: parseInt(row['No']?.toString() || '0'),
      yearSemester: row['년도학기']?.toString() || '',
      subjectCode: row['학수번호']?.toString() || '',
      classNum: row['분반']?.toString() || '',
      subjectName: row['교과목명']?.toString() || '',
      professor: row['담당교원']?.toString() || '',
      englishType: row['원어강의종류']?.toString() || '',
      recognition: row['인정구분']?.toString() || '',
      category: row['이수구분']?.toString() || '',
      subCategory: row['이수구분영역']?.toString() || '',
      credits: parseFloat(row['학점']?.toString() || '0'),
      grade: row['등급']?.toString() || '',
      deleteCategory: row['삭제구분']?.toString() || '',
      retakeYearSemester: row['재수강 년도학기']?.toString(),
      retakeSubjectCode: row['재수강 학수번호']?.toString(),
      institutionName: row['이수기관명']?.toString(),
      graduateCategory: row['대학원구분']?.toString(),
    }));
  }
};
