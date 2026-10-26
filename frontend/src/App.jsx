import React, { useState } from 'react';
import FileUpload from './components/FileUpload';

export default function App() {
  const [statementData, setStatementData] = useState(null);
  const [globalError, setGlobalError] = useState(null);

  const handleUploadComplete = (data) => {
    setStatementData(data);
    setGlobalError(null);
  };

  const handleReset = () => {
    setStatementData(null);
    setGlobalError(null);
  };

  return (
    <div className="app-layout">
      {/* Glass Top Navigation */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand">
            <div className="brand-icon">SC</div>
            <div>
              <div className="brand-title">Statement Categorizer</div>
              <div className="brand-subtitle">IRS Schedule C Deductions • Freelance Tech</div>
            </div>
          </div>

          <div className="header-actions">
            {statementData && (
              <button type="button" className="btn btn-glass btn-sm" onClick={handleReset}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload New Statement
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {!statementData ? (
          <FileUpload
            onUploadComplete={handleUploadComplete}
            onError={(msg) => setGlobalError(msg)}
          />
        ) : (
          <div style={{ maxWidth: '1380px', margin: '32px auto', padding: '0 24px' }}>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <span className="badge badge-verified" style={{ marginBottom: '12px' }}>
                Statement Loaded Successfully
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
                {statementData.filename}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                Successfully categorized {statementData.parsed_count} transactions across IRS Schedule C tax lines.
              </p>
              <div style={{ display: 'inline-flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Gross Revenue: <strong className="mono-num">${statementData.summary?.gross_income?.toLocaleString()}</strong></span>
                <span>•</span>
                <span>Deductible Expenses: <strong className="mono-num">${statementData.summary?.total_deductible_expenses?.toLocaleString()}</strong></span>
                <span>•</span>
                <span>Needs Review: <strong className="mono-num">{statementData.summary?.needs_review_count}</strong></span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
