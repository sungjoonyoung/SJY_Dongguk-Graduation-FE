import React from 'react';
import { useStore } from '../store/useStore';
import { Loader2 } from 'lucide-react';

export const ProcessingPage: React.FC = () => {
  const { processedFiles, totalFiles } = useStore();
  const progress = totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;

  return (
    <div className="processing-page">
      <div className="stepper">
        <div className="step done">1. 데이터 업로드</div>
        <div className="step active">2. 분석 진행 중</div>
        <div className="step">3. 결과 미리보기</div>
      </div>

      <div className="processing-card">
        <Loader2 className="spinner" size={48} />
        <h2>데이터를 분석하고 있습니다</h2>
        <p>성적 파일을 해독하여 학생 정보와 매칭 중입니다...</p>

        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-stats">
            <span>{processedFiles} / {totalFiles} 파일 처리 완료</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
