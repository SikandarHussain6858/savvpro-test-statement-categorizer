import React from 'react';

export default function TopNavbar({ activeTab = 'Dashboard', onTabChange, onReset, hasData }) {
  const tabs = ['Dashboard', 'Expenses', 'Deductions', 'Schedule C', 'Ledger'];

  return (
    <header className="top-appbar">
      {/* Brand Icon Left */}
      <div className="brand-section">
        <div className="brand-icon-spiral">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            TaxFlow
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
            Schedule C Intelligence
          </div>
        </div>
      </div>

      {/* Center Floating Capsule Menu */}
      <nav className="nav-pill-capsule" aria-label="Main Navigation">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`nav-pill-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange && onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Right Utility Buttons */}
      <div className="topbar-right-utils">
        {hasData && (
          <button
            type="button"
            className="btn-pill-glass"
            onClick={onReset}
            title="Import another CSV statement"
            style={{ marginRight: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload New
          </button>
        )}

        <button type="button" className="icon-btn-circle" title="Search Ledger">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <button type="button" className="icon-btn-circle" title="Notifications" style={{ position: 'relative' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            style={{
              position: 'absolute',
              top: '9px',
              right: '9px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent-red)',
            }}
          />
        </button>

        <div className="avatar-badge-wrap">
          <div className="user-avatar-circle">JH</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}
