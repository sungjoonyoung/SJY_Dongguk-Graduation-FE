import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, FileArchive, Upload, Play, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { parseStudentExcel } from '../services/parseStudentExcel';
import { mergeStudents } from '../services/mergeStudents';

export const UploadPage: React.FC = () => {
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const { setStep, setStudentIndex, setStudents, updateProgress } = useStore();

  const handleProcess = async () => {
    if (!studentFile || !zipFile) return;

    setStep('processing');
    try {
      const studentIndex = await parseStudentExcel(studentFile);
      setStudentIndex(studentIndex);

      const students = await mergeStudents(studentIndex, zipFile, (processed, total) => {
        updateProgress(processed, total);
      });

      setStudents(students);
      setStep('preview');
    } catch (error) {
      alert('데이터 처리 중 오류가 발생했습니다: ' + error);
      setStep('upload');
    }
  };

  const studentDropzone = useDropzone({
    onDrop: (files) => setStudentFile(files[0]),
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    multiple: false
  });

  const zipDropzone = useDropzone({
    onDrop: (files) => setZipFile(files[0]),
    accept: { 'application/zip': ['.zip'] },
    multiple: false
  });

  return (
    <div className="upload-page">
      <header className="page-header">
        <h2>데이터 업로드</h2>
        <p>학생 마스터 정보(Excel)와 성적 파일 묶음(ZIP)을 업로드하여 매칭 상태를 확인합니다.</p>
      </header>

      <div className="upload-grid">
        {/* 학생정보 엑셀 업로드 */}
        <div className="upload-card">
          <div className="card-icon"><FileText size={32} /></div>
          <h3>학생 정보 엑셀 (.xlsx)</h3>
          <div {...studentDropzone.getRootProps()} className={`drop-area ${studentFile ? 'success' : ''}`}>
            <input {...studentDropzone.getInputProps()} />
            {studentFile ? (
              <div className="selected-file">
                <CheckCircle size={24} />
                <span>{studentFile.name}</span>
              </div>
            ) : (
              <div className="prompt">
                <Upload size={40} />
                <p>파일을 드래그하거나 클릭하여 선택</p>
              </div>
            )}
          </div>
        </div>

        {/* 성적 ZIP 업로드 */}
        <div className="upload-card">
          <div className="card-icon"><FileArchive size={32} /></div>
          <h3>성적 데이터 압축파일 (.zip)</h3>
          <div {...zipDropzone.getRootProps()} className={`drop-area ${zipFile ? 'success' : ''}`}>
            <input {...zipDropzone.getInputProps()} />
            {zipFile ? (
              <div className="selected-file">
                <CheckCircle size={24} />
                <span>{zipFile.name}</span>
              </div>
            ) : (
              <div className="prompt">
                <Upload size={40} />
                <p>파일을 드래그하거나 클릭하여 선택</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="action-area">
        <button 
          className="btn-start" 
          onClick={handleProcess} 
          disabled={!studentFile || !zipFile}
        >
          <Play size={20} />
          데이터 매칭 분석 시작
        </button>
      </div>
    </div>
  );
};
