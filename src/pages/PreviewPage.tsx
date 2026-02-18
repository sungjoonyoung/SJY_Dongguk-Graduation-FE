import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Download, Search, CheckCircle2, FileX, UserMinus, RefreshCcw, ShieldCheck, Database, TableProperties } from 'lucide-react';
import { StudentDetailModal } from '../components/StudentDetailModal';
import { transformToBackendPayload, createMappingTable } from '../services/transformPayload';
import type { StudentRecord } from '../types';

export const PreviewPage: React.FC = () => {
  const { students, studentIndex, reset } = useStore();
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

  // 공통 다운로드 함수
  const downloadJSON = (data: any, fileName: string) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // 1. 전체 통합 데이터 다운로드
  const handleDownloadFullJSON = () => downloadJSON(students, "1_full_student_records.json");

  // 2. 학생 마스터 정보 원본 다운로드
  const handleDownloadMetaJSON = () => downloadJSON(Object.values(studentIndex), "2_original_student_meta.json");

  // 3. 백엔드 전송용 익명화 데이터 다운로드
  const handleDownloadBackendJSON = () => {
    const backendData = transformToBackendPayload(students);
    downloadJSON(backendData, "3_backend_payload_anonymized.json");
  };

  // 4. 암호화 키 매핑 테이블 다운로드
  const handleDownloadMappingJSON = () => {
    const mappingTable = createMappingTable(students);
    downloadJSON(mappingTable, "4_encrypted_id_mapping.json");
  };

  return (
    <div className="preview-page">
      <header className="page-header">
        <div className="title-area">
          <h2>데이터 매칭 현황</h2>
          <p>학생 마스터 정보와 성적 ZIP 파일 간의 매칭 결과를 확인합니다.</p>
        </div>
        <div className="header-actions debug-group">
          <button className="btn-secondary" onClick={reset}>
            <RefreshCcw size={16} /> 다시 업로드
          </button>
          <div className="json-buttons">
            <button className="btn-debug" onClick={handleDownloadMetaJSON} title="마스터 엑셀 정보">
              <TableProperties size={16} /> [1] 마스터 원본
            </button>
            <button className="btn-debug" onClick={handleDownloadFullJSON} title="전체 결과 정보">
              <Database size={16} /> [2] 전체 통합
            </button>
            <button className="btn-secure" onClick={handleDownloadBackendJSON} title="익명화 전송용">
              <ShieldCheck size={16} /> [3] 백엔드용
            </button>
            <button className="btn-debug" onClick={handleDownloadMappingJSON} title="키 매핑 테이블">
              <Download size={16} /> [4] 키 매핑
            </button>
          </div>
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
