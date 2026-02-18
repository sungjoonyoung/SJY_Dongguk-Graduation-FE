import React from 'react';
import { useStore } from './store/useStore';
import { UploadPage } from './pages/UploadPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { PreviewPage } from './pages/PreviewPage';
import './App.css';

const App: React.FC = () => {
  const { step } = useStore();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>동국대학교 졸업심사 시스템 (DGU-GradCheck)</h1>
        <p>성적 및 학생 정보를 통합하여 졸업 여부를 사전에 검증합니다.</p>
      </header>

      <main className="app-main">
        {step === 'upload' && <UploadPage />}
        {step === 'processing' && <ProcessingPage />}
        {step === 'preview' && <PreviewPage />}
      </main>

      <footer className="app-footer">
        &copy; 2026 Dongguk Univ. Graduation Audit System
      </footer>
    </div>
  );
};

export default App;
