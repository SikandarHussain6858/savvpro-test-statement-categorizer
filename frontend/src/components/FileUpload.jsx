import React, { useState, useRef } from 'react';
import { uploadStatement, loadSampleData } from '../utils/api';

export default function FileUpload({ onUploadComplete, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      const err = 'Please select a valid .csv file format.';
      setLocalError(err);
      if (onError) onError(err);
      return;
    }

    setLocalError(null);
    setIsLoading(true);
    setLoadingAction(`Analyzing ${file.name}...`);

    try {
      const result = await uploadStatement(file);
      setIsLoading(false);
      onUploadComplete(result);
    } catch (err) {
      setIsLoading(false);
      const msg = err.message || 'Failed to upload and process file.';
      setLocalError(msg);
      if (onError) onError(msg);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDemoClick = async (e) => {
    e.stopPropagation();
    setLocalError(null);
    setIsLoading(true);
    setLoadingAction('Loading freelance sample statement (33 transactions)...');

    try {
      const result = await loadSampleData();
      setIsLoading(false);
      onUploadComplete(result);
    } catch (err) {
      setIsLoading(false);
      const msg = err.message || 'Failed to load demo statement.';
      setLocalError(msg);
      if (onError) onError(msg);
    }
  };

  const supportedBanks = [
    'Chase Bank', 'Bank of America', 'Wells Fargo', 'American Express',
    'Capital One', 'Silicon Valley Bank', 'Stripe Payouts', 'Upwork'
  ];

  return (
    <div style={{ maxWidth: '860px', margin: '40px auto 60px', padding: '0 20px' }}>
      {/* Front Page Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--accent-purple-soft)',
            color: 'var(--accent-purple)',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '14px',
          }}
        >
          <span>IRS Schedule C Intelligence Engine</span>
        </div>

        <h1
          style={{
            fontSize: '34px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            marginBottom: '12px',
            lineHeight: 1.2,
          }}
        >
          Automated Bank Statement Categorizer
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-sub)',
            maxWidth: '640px',
            margin: '0 auto 24px',
            lineHeight: 1.6,
          }}
        >
          Instantly classify messy bank and credit card CSVs into audit-proof tax categories.
          Applies the 50% IRS meals rule, isolates non-taxable transfers, and calculates net taxable profit.
        </p>

        {/* 3 Frosted Feature Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
            textAlign: 'left',
            marginBottom: '28px',
          }}
        >
          <div className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>⚡</div>
            <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-main)', marginBottom: '3px' }}>
              100% Deterministic
            </strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Zero AI hallucinations. Governed by 3-tier rules with audit trails.
            </span>
          </div>

          <div className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>🛡️</div>
            <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-main)', marginBottom: '3px' }}>
              IRS Rules Built-In
            </strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Automatic 50% business meal write-offs and refund expense offsets.
            </span>
          </div>

          <div className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>💳</div>
            <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-main)', marginBottom: '3px' }}>
              Multi-Format Parser
            </strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Handles split debit/credit columns, custom delimiters, and raw POS noise.
            </span>
          </div>
        </div>
      </div>

      {/* Main Frosted Dropzone Card */}
      <div
        className={`glass-card dropzone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
        style={{ padding: '42px 28px' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        <div className="dropzone-icon" style={{ background: 'var(--accent-purple-soft)', color: 'var(--accent-purple)' }}>
          {isLoading ? (
            <div className="spinner" style={{ borderTopColor: 'var(--accent-purple)' }} />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
        </div>

        <div className="dropzone-main-text" style={{ fontSize: '16px', fontWeight: 700 }}>
          {isLoading ? loadingAction : 'Drag and drop your statement CSV here'}
        </div>

        <div className="dropzone-sub-text" style={{ fontSize: '13px', marginBottom: '22px' }}>
          {isLoading ? 'Processing transactions through classification rules...' : 'or browse a file from your computer'}
        </div>

        <div className="dropzone-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="btn-pill-primary"
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '10px 24px', fontSize: '14px' }}
          >
            Select CSV File
          </button>
        </div>

        <div className="dropzone-divider">OR</div>

        {/* Prominent Demo Button */}
        <div onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="btn-pill-block"
            disabled={isLoading}
            onClick={handleDemoClick}
            style={{
              maxWidth: '380px',
              margin: '0 auto',
              padding: '12px 20px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#ffffff',
              color: 'var(--accent-purple)',
              borderColor: 'var(--accent-purple-soft)',
            }}
          >
            <span style={{ fontSize: '16px' }}>✨</span>
            <span>Launch Interactive Demo (33 Sample Transactions)</span>
          </button>
        </div>
      </div>

      {localError && (
        <div className="error-banner" style={{ marginTop: '18px' }}>
          <span>⚠️ {localError}</span>
        </div>
      )}

      {/* Supported Bank Formats Footer */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
          Compatible with major business bank & payment exports:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
          {supportedBanks.map((bank) => (
            <span
              key={bank}
              className="pill-badge pill-slate"
              style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(255, 255, 255, 0.7)' }}
            >
              {bank}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
