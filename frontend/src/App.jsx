import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import TaxDashboard from './components/TaxDashboard';
import CategoryChart from './components/CategoryChart';
import CategoryFilter from './components/CategoryFilter';
import TransactionTable from './components/TransactionTable';
import ExportButton from './components/ExportButton';
import { getCategories, recalculateSummary } from './utils/api';

export default function App() {
  const [statementData, setStatementData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  const [warnings, setWarnings] = useState([]);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Load category definitions on mount
  useEffect(() => {
    getCategories()
      .then((catMap) => setCategories(catMap))
      .catch((err) => console.error('Failed to load category definitions:', err));
  }, []);

  const handleUploadComplete = (data) => {
    setStatementData(data);
    setTransactions(data.transactions || []);
    setSummary(data.summary || null);
    setWarnings(data.warnings || []);
    setActiveFilter('all');
  };

  const handleReset = () => {
    setStatementData(null);
    setTransactions([]);
    setSummary(null);
    setWarnings([]);
    setActiveFilter('all');
  };

  const handleTransactionsUpdate = async (updatedTxList) => {
    setTransactions(updatedTxList);
    setIsRecalculating(true);

    try {
      const newSummary = await recalculateSummary(updatedTxList);
      setSummary(newSummary);
    } catch (err) {
      console.error('Recalculation error:', err);
    } finally {
      setIsRecalculating(false);
    }
  };

  const needsReviewCount = transactions.filter((t) => t.needs_review).length;

  // Active category names with at least one transaction
  const activeCategoryNames = React.useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t.category && t.category !== 'Needs Review') {
        set.add(t.category);
      }
    });
    return Array.from(set).sort();
  }, [transactions]);

  return (
    <div className="app-layout">
      {/* Frosted Glass Header */}
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
              <>
                <ExportButton
                  transactions={transactions}
                  defaultFilename={`${statementData.filename || 'statement'}_tax_categorized.csv`}
                />
                <button
                  type="button"
                  className="btn btn-glass"
                  onClick={handleReset}
                  title="Upload a different statement CSV"
                >
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
                  Upload New
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {!statementData ? (
          <FileUpload onUploadComplete={handleUploadComplete} />
        ) : (
          <div>
            {/* Parser Warnings Banner if any */}
            {warnings && warnings.length > 0 && (
              <div className="warning-banner">
                <div>
                  <strong>Parser Notice:</strong> {warnings.join(' • ')}
                </div>
                <button
                  type="button"
                  onClick={() => setWarnings([])}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                  aria-label="Dismiss warning"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Recalculating indicator */}
            {isRecalculating && (
              <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--primary)', marginBottom: '8px' }}>
                Recalculating Schedule C totals...
              </div>
            )}

            {/* Dashboard Metric Cards */}
            <TaxDashboard summary={summary} needsReviewCount={needsReviewCount} />

            {/* Category Chart */}
            {summary?.categories && <CategoryChart categories={summary.categories} />}

            {/* Filter Bar */}
            <CategoryFilter
              categories={activeCategoryNames}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              needsReviewCount={needsReviewCount}
              totalCount={transactions.length}
            />

            {/* Interactive Review Table */}
            <TransactionTable
              transactions={transactions}
              categories={categories}
              filter={activeFilter}
              onTransactionUpdate={handleTransactionsUpdate}
            />
          </div>
        )}
      </main>
    </div>
  );
}
