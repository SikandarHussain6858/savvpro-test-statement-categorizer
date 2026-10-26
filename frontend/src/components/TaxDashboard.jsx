import React from 'react';

export default function TaxDashboard({ summary, needsReviewCount }) {
  if (!summary) return null;

  const totalExpenses = summary.total_expenses || 0;
  const totalDeductible = summary.total_deductible_expenses || 0;
  const taxSavings = summary.estimated_tax_savings || 0;
  const reviewCount = needsReviewCount ?? summary.needs_review_count ?? 0;
  const reviewAmount = summary.needs_review_amount || 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  const isUrgentReview = reviewCount > 5;

  return (
    <section aria-label="Tax Summary Dashboard">
      <div className="metrics-grid">
        {/* Total Expenses */}
        <div className="glass-panel metric-card card-expenses">
          <div className="metric-label">Total Expenses</div>
          <div className="metric-value mono-num">{formatCurrency(totalExpenses)}</div>
          <div className="metric-sub">Net of vendor refunds & credits</div>
        </div>

        {/* Tax Deductible Expenses */}
        <div className="glass-panel metric-card card-deductible">
          <div className="metric-label">Tax Deductible</div>
          <div className="metric-value mono-num">{formatCurrency(totalDeductible)}</div>
          <div className="metric-sub">Verified Schedule C write-offs (meals @ 50%)</div>
        </div>

        {/* Estimated Tax Savings */}
        <div className="glass-panel metric-card card-savings">
          <div className="metric-label">Est. Tax Savings</div>
          <div className="metric-value mono-num">{formatCurrency(taxSavings)}</div>
          <div className="metric-sub">Calculated at 28% self-employed rate</div>
        </div>

        {/* Needs Review Card */}
        <div className={`glass-panel metric-card ${isUrgentReview ? 'card-review-urgent' : 'card-review'}`}>
          <div className="metric-label">Needs Review</div>
          <div className="metric-value mono-num">
            {reviewCount} <span style={{ fontSize: '15px', fontWeight: 500 }}>({formatCurrency(reviewAmount)})</span>
          </div>
          <div className="metric-sub">
            {reviewCount === 0 ? 'All transactions verified' : 'Requires confirmation or manual assignment'}
          </div>
        </div>
      </div>

      {/* Secondary Financial Ledger Info */}
      <div className="sub-metrics-bar">
        <div className="sub-metric-item">
          <span className="sub-metric-dot" style={{ background: 'var(--accent-income)' }} />
          <span>Gross Business Revenue:</span>
          <strong className="mono-num">{formatCurrency(summary.gross_income)}</strong>
        </div>

        <div className="sub-metric-item">
          <span className="sub-metric-dot" style={{ background: 'var(--primary)' }} />
          <span>Net Taxable Profit:</span>
          <strong className="mono-num">{formatCurrency(summary.net_taxable_profit)}</strong>
        </div>

        <div className="sub-metric-item">
          <span className="sub-metric-dot" style={{ background: 'var(--text-muted)' }} />
          <span>Non-Taxable Transfers:</span>
          <strong className="mono-num">{formatCurrency(summary.non_taxable_transfers)}</strong>
        </div>
      </div>
    </section>
  );
}
