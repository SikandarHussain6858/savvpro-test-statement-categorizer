import React, { useState, useMemo } from 'react';
import TransactionRow from './TransactionRow';

export default function TransactionTable({
  transactions = [],
  categories = {},
  filter = 'all',
  onTransactionUpdate,
}) {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [expandedRowId, setExpandedRowId] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 1. Filter transactions
  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    if (filter === 'needs_review') {
      return transactions.filter((t) => t.needs_review);
    }
    return transactions.filter((t) => t.category === filter);
  }, [transactions, filter]);

  // 2. Sort transactions
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'amount') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortField === 'confidence') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortField, sortDirection]);

  const handleSingleUpdate = (updatedTx) => {
    const updatedList = transactions.map((t) => (t.id === updatedTx.id ? updatedTx : t));
    onTransactionUpdate(updatedList);
  };

  const toggleExpand = (txId) => {
    setExpandedRowId((prev) => (prev === txId ? null : txId));
  };

  const getSortIndicator = (field) => {
    if (sortField !== field) return ' ↕';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="glass-panel table-panel">
      <div className="table-header-meta">
        <div>
          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
            Transaction Ledger
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
            Showing {sortedTransactions.length} of {transactions.length} records
          </span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Click row to inspect IRS Schedule C audit rule
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')}>Date{getSortIndicator('date')}</th>
              <th onClick={() => handleSort('clean_merchant')}>Merchant{getSortIndicator('clean_merchant')}</th>
              <th onClick={() => handleSort('amount')}>Amount{getSortIndicator('amount')}</th>
              <th>Direction</th>
              <th onClick={() => handleSort('category')}>Tax Category{getSortIndicator('category')}</th>
              <th onClick={() => handleSort('confidence')}>Confidence{getSortIndicator('confidence')}</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No transactions match the selected filter.
                </td>
              </tr>
            ) : (
              sortedTransactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  categories={categories}
                  onUpdate={handleSingleUpdate}
                  isExpanded={expandedRowId === tx.id}
                  onToggleExpand={() => toggleExpand(tx.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
