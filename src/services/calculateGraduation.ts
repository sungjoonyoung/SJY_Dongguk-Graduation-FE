import type { GradeRow } from '../types';

export interface CreditSummary {
  total: number;
  majorReq: number; // 전공필수
  majorElec: number; // 전공선택
  cultureReq: number; // 교양필수 (공통교양)
  cultureElec: number; // 교양선택 (일반교양)
  mscMath: number; // MSC 수학
  mscScience: number; // MSC 과학
  mscComputer: number; // MSC 전산
  freeElec: number; // 자유선택
  englishCourses: number; // 영어강의 수
  majorEnglish: number; // 전공영어 수
  gpa: number;
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.5, 'A0': 4.0, 'B+': 3.5, 'B0': 3.0, 'C+': 2.5, 'C0': 2.0, 'D+': 1.5, 'D0': 1.0, 'F': 0, 'P': 0, 'NP': 0
};

export function calculateCredits(grades: GradeRow[]): CreditSummary {
  const summary: CreditSummary = {
    total: 0, majorReq: 0, majorElec: 0, cultureReq: 0, cultureElec: 0,
    mscMath: 0, mscScience: 0, mscComputer: 0, freeElec: 0,
    englishCourses: 0, majorEnglish: 0, gpa: 0
  };

  let totalPoints = 0;
  let gpaCredits = 0;

  grades.forEach(grade => {
    const credits = grade.credits;
    summary.total += credits;

    // 이수구분별 분류 (동국대 기준 예시)
    if (grade.category.includes('전공필수') || grade.category === '전필') summary.majorReq += credits;
    else if (grade.category.includes('전공선택') || grade.category === '전선') summary.majorElec += credits;
    else if (grade.category.includes('공통교양') || grade.category === '교필') summary.cultureReq += credits;
    else if (grade.category.includes('일반교양') || grade.category === '교선') summary.cultureElec += credits;
    else if (grade.category.includes('자유선택') || grade.category === '자선') summary.freeElec += credits;

    // MSC 및 기타 분류 (영역명 기준)
    if (grade.subCategory.includes('수학')) summary.mscMath += credits;
    if (grade.subCategory.includes('과학')) summary.mscScience += credits;
    if (grade.subCategory.includes('전산')) summary.mscComputer += credits;

    // 영어강의 카운트
    if (grade.englishType && grade.englishType !== '해당없음') {
      summary.englishCourses += 1;
      if (grade.category.includes('전공')) summary.majorEnglish += 1;
    }

    // GPA 계산 (P/NP 제외)
    if (GRADE_POINTS[grade.grade] !== undefined && !['P', 'NP'].includes(grade.grade)) {
      totalPoints += GRADE_POINTS[grade.grade] * credits;
      gpaCredits += credits;
    }
  });

  summary.gpa = gpaCredits > 0 ? Number((totalPoints / gpaCredits).toFixed(2)) : 0;
  
  return summary;
}
