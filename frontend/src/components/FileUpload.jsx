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
    setLoadingAction('Loading freelance sample data...');

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

  return (
    <div className="upload-hero">
      <div className="hero-text">
        <span className="hero-badge">IRS Schedule C Categorizer</span>
        <h1 className="hero-title">Automate Statement Deductions</h1>
        <p className="hero-subtitle">
          Import checking or credit card statements to automatically identify deductible
          business software, home office utilities, and travel expenses.
        </p>
      </div>

      <div
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
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
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        <div className="dropzone-icon">
          {isLoading ? (
            <div className="spinner" />
          ) : (
            <svg
              width="24"
              height="24"
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
          )}
        </div>

        <div className="dropzone-main-text">
          {isLoading ? loadingAction : 'Drag and drop your statement CSV here'}
        </div>
        <div className="dropzone-sub-text">
          {isLoading ? 'Running 3-tier tax rules engine...' : 'or click to browse from your computer'}
        </div>

        <div className="dropzone-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="btn btn-primary"
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
          >
            Select CSV File
          </button>
        </div>

        <div className="dropzone-divider">OR</div>

        <div onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="btn btn-glass"
            disabled={isLoading}
            onClick={handleDemoClick}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Explore Interactive Demo (33 Transactions)
          </button>
        </div>
      </div>

      {localError && (
        <div className="error-banner">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{localError}</span>
        </div>
      )}
    </div>
  );
}
