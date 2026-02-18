import * as XLSX from 'xlsx';
import type { StudentMeta } from '../types';

/**
 * 학생정보 Excel 파일을 파싱하여 학번을 키로 하는 studentIndex를 생성합니다.
 * @param file Excel 파일 객체
 * @returns Map 형태의 studentIndex (Record<string, StudentMeta>)
 */
export async function parseStudentExcel(file: File): Promise<Record<string, StudentMeta>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // 엑셀 데이터를 JSON 배열로 변환
        const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];
        const studentIndex: Record<string, StudentMeta> = {};

        jsonData.forEach((row) => {
          const studentId = row['학번']?.toString().trim();
          if (!studentId) return;

          studentIndex[studentId] = {
            studentId,
            name: row['이름']?.toString().trim() || '',
            admissionYear: parseInt(row['입학연도']?.toString() || '0'),
            studentType: row['학생유형']?.toString().trim() || '',
            ipp: row['IPP이수']?.toString().trim() || 'N',
            semesterCount: parseInt(row['학기차']?.toString() || '0'),
            gradExpectation: row['졸업예정']?.toString().trim() || '',
            languageType: row['어학시험종류']?.toString().trim() || '',
            languageScore: row['어학점수']?.toString().trim() || '',
            thesis: row['졸업논문']?.toString().trim() || 'N',
            exam: row['종합시험']?.toString().trim() || 'N',
            major: row['주전공']?.toString().trim() || '',
            isDeepMajor: row['심화여부']?.toString().trim() || 'N',
            minors: [
              row['복수전공1'],
              row['복수전공2'],
              row['복수전공3'],
              row['복수전공4'],
              row['복수전공5']
            ].filter(Boolean).map(m => m.toString().trim())
          };
        });

        resolve(studentIndex);
      } catch (error) {
        reject(new Error('학생정보 엑셀 파싱 중 오류 발생: ' + error));
      }
    };

    reader.onerror = () => reject(new Error('파일 읽기 오류'));
    reader.readAsArrayBuffer(file);
  });
}
