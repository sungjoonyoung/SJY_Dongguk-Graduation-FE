import React from 'react';
import { X, FileDown, User, BarChart3, ListChecks, Award } from 'lucide-react';
import type { StudentRecord } from '../types';
import { calculateCredits } from '../services/calculateGraduation';

interface Props {
  student: StudentRecord;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<Props> = ({ student, onClose }) => {
  const summary = calculateCredits(student.grades);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <div className="header-left">
            <button className="btn-back" onClick={onClose}>← 전체 목록으로 돌아가기</button>
            <div className="student-info-section">
              <div className="avatar">
                <User size={32} />
              </div>
              <div className="meta">
                <h2>{student.name || '미등록'}</h2>
                <div className="badges">
                  <span className={`badge-status ${student.status}`}>
                    {student.status === 'normal' && '매칭 완료'}
                    {student.status === 'missing_grades' && '성적 누락'}
                    {student.status === 'missing_info' && '정보 누락'}
                  </span>
                  <span className="badge-id">학번: {student.studentId} · {student.admissionYear}학번</span>
                  <span className="badge-major">전공: {student.major || '-'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button className="btn-close" onClick={onClose}><X size={24} /></button>
          </div>
        </header>

        <div className="modal-body">
          <section className="data-summary">
            <h3><BarChart3 size={18} /> 업로드된 성적 데이터 요약</h3>
            <div className="summary-grid-simple">
              <div className="summary-card">
                <span className="label">총 이수학점</span>
                <span className="value">{summary.total}</span>
              </div>
              <div className="summary-card">
                <span className="label">이수 과목 수</span>
                <span className="value">{student.grades.length}</span>
              </div>
              <div className="summary-card">
                <span className="label">평균 GPA</span>
                <span className="value">{summary.gpa}</span>
              </div>
              <div className="summary-card highlight">
                <span className="label">영어강의 수</span>
                <span className="value">{summary.englishCourses}</span>
              </div>
            </div>
          </section>

          <section className="grades-list-section">
            <h3><Award size={18} /> 전체 이수 과목 목록</h3>
            <div className="table-container-compact">
              <table>
                <thead>
                  <tr>
                    <th>학수번호</th>
                    <th>교과목명</th>
                    <th>학점</th>
                    <th>등급</th>
                    <th>이수구분</th>
                    <th>이수영역</th>
                  </tr>
                </thead>
                <tbody>
                  {student.grades.length > 0 ? (
                    student.grades.map((grade, idx) => (
                      <tr key={idx}>
                        <td className="mono">{grade.subjectCode}</td>
                        <td className="subject-name">{grade.subjectName}</td>
                        <td className="center">{grade.credits}</td>
                        <td className="center mono">{grade.grade}</td>
                        <td>{grade.category}</td>
                        <td>{grade.subCategory}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="empty-message">데이터가 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
