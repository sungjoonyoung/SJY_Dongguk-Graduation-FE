import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Download, Search, AlertTriangle, CheckCircle2, FileX, UserMinus, RefreshCcw, Eye } from 'lucide-react';
import { StudentDetailModal } from '../components/StudentDetailModal';
import type { StudentRecord } from '../types';

export const PreviewPage: React.FC = () => {
  const { students, reset } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // 데이터 매칭 상태 집계
  const stats = {
    total: students.length,
    matched: students.filter(s => s.status === 'normal').length,
    missingGrades: students.filter(s => s.status === 'missing_grades').length,
    missingInfo: students.filter(s => s.status === 'missing_info').length,
    errors: students.filter(s => s.status === 'parsing_error').length,
  };

  const filteredStudents = students.filter(s => 
    s.studentId.includes(searchTerm) || 
    s.name.includes(searchTerm) || 
    s.major.includes(searchTerm)
  );

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "student_matching_results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="preview-page">
      <header className="page-header">
        <div className="title-area">
          <h2>데이터 매칭 현황</h2>
          <p>학생 마스터 정보와 성적 ZIP 파일 간의 매칭 결과를 확인합니다.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={reset}>
            <RefreshCcw size={16} /> 다시 업로드
          </button>
          <button className="btn-primary" onClick={handleDownloadJSON}>
            <Download size={16} /> 결과 JSON 다운로드
          </button>
        </div>
      </header>

      <section className="summary-grid">
        <div className="stat-card">
          <span className="label">전체 학생 명단</span>
          <span className="value">{stats.total}</span>
        </div>
        <div className="stat-card success">
          <span className="label">성상 매칭 (성적 있음)</span>
          <span className="value">{stats.matched}</span>
          <CheckCircle2 size={24} className="stat-icon" />
        </div>
        <div className="stat-card warning">
          <span className="label">성적 파일 누락</span>
          <span className="value">{stats.missingGrades}</span>
          <FileX size={24} className="stat-icon" />
        </div>
        <div className="stat-card error">
          <span className="label">마스터 정보 누락</span>
          <span className="value">{stats.missingInfo}</span>
          <UserMinus size={24} className="stat-icon" />
        </div>
      </section>

      <section className="list-section">
        <div className="table-controls">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="학번, 이름, 전공으로 검색..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="count-info">총 <strong>{filteredStudents.length}</strong>명의 데이터가 표시 중입니다.</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th className="center">No</th>
                <th>매칭 상태</th>
                <th>학번</th>
                <th>이름</th>
                <th>전공</th>
                <th className="center">이수과목수</th>
                <th className="center">상세</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr key={student.studentId}>
                  <td className="center">{idx + 1}</td>
                  <td>
                    <span className={`status-badge ${student.status}`}>
                      {student.status === 'normal' && '매칭 완료'}
                      {student.status === 'missing_grades' && '성적 누락'}
                      {student.status === 'missing_info' && '정보 누락'}
                      {student.status === 'parsing_error' && '분석 오류'}
                    </span>
                  </td>
                  <td className="mono">{student.studentId}</td>
                  <td className="font-bold">{student.name || '-'}</td>
                  <td>{student.major || '-'}</td>
                  <td className="center">{student.grades.length}</td>
                  <td className="center">
                    <button className="btn-view" onClick={() => setSelectedStudent(student)}>
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
};
