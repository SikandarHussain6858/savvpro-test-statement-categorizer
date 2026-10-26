import React from 'react';

export default function TransactionRow({
  transaction,
  categories = {},
  onUpdate,
  isExpanded,
  onToggleExpand,
}) {
  const {
    id,
    date,
    raw_description,
    clean_merchant,
    amount,
    direction,
    category,
    schedule_c_line,
    deductible_percentage,
    deductible_amount,
    confidence,
    status,
    needs_review,
    review_reason,
    decision_rule,
  } = transaction;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  const getAmountClass = () => {
    switch (direction) {
      case 'INFLOW':
        return 'amt-inflow';
      case 'REFUND':
        return 'amt-refund';
      case 'TRANSFER':
        return 'amt-transfer';
      default:
        return 'amt-outflow';
    }
  };

  const getConfidenceBadge = () => {
    const pct = Math.round((confidence || 0) * 100);
    if (pct >= 85) {
      return <span className="badge badge-verified mono-num">{pct}%</span>;
    }
    if (pct >= 50) {
      return <span className="badge badge-review mono-num">{pct}%</span>;
    }
    return <span className="badge badge-personal mono-num">{pct}%</span>;
  };

  const getStatusBadge = () => {
    if (status === 'AUTO_VERIFIED') {
      return <span className="badge badge-verified">Auto Verified</span>;
    }
    if (status === 'MANUALLY_APPROVED') {
      return <span className="badge badge-verified">Approved</span>;
    }
    if (status === 'PERSONAL') {
      return <span className="badge badge-personal">Personal</span>;
    }
    return <span className="badge badge-review">Needs Review</span>;
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const catInfo = categories[newCategory] || {
      schedule_c_line: 'Pending',
      tax_deductible: false,
      deductible_percentage: 0.0,
    };

    const isDeductible = catInfo.tax_deductible && direction === 'OUTFLOW';
    const newDeductibleAmt = isDeductible
      ? round2(amount * catInfo.deductible_percentage)
      : 0.0;

    onUpdate({
      ...transaction,
      category: newCategory,
      schedule_c_line: catInfo.schedule_c_line,
      tax_deductible: isDeductible,
      deductible_percentage: catInfo.deductible_percentage,
      deductible_amount: newDeductibleAmt,
      needs_review: false,
      status: 'MANUALLY_APPROVED',
    });
  };

  const handleQuickApprove = (e) => {
    e.stopPropagation();
    const catInfo = categories[category] || {
      schedule_c_line: schedule_c_line || 'Pending',
      tax_deductible: true,
      deductible_percentage: deductible_percentage || 1.0,
    };

    const isDeductible = catInfo.tax_deductible && direction === 'OUTFLOW';
    const newDeductibleAmt = isDeductible
      ? round2(amount * catInfo.deductible_percentage)
      : 0.0;

    onUpdate({
      ...transaction,
      needs_review: false,
      status: 'MANUALLY_APPROVED',
      tax_deductible: isDeductible,
      deductible_amount: newDeductibleAmt,
    });
  };

  const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

  return (
    <>
      <tr
        className={`table-row ${needs_review ? 'row-needs-review' : ''}`}
        onClick={onToggleExpand}
      >
        <td className="mono-num" style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>
          {date}
        </td>

        <td title={raw_description}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{clean_merchant}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{id}</div>
        </td>

        <td className="mono-num">
          <span className={getAmountClass()}>
            {direction === 'OUTFLOW' ? '-' : '+'}
            {formatCurrency(amount)}
          </span>
        </td>

        <td>
          <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
            {direction}
          </span>
        </td>

        <td onClick={(e) => needs_review && e.stopPropagation()}>
          {needs_review ? (
            <select
              className="category-select"
              value={category}
              onChange={handleCategoryChange}
              aria-label={`Select category for ${clean_merchant}`}
            >
              {Object.keys(categories).map((catName) => (
                <option key={catName} value={catName}>
                  {catName}
                </option>
              ))}
            </select>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: categories[category]?.color || '#94a3b8',
                }}
              />
              <span style={{ fontWeight: 500 }}>{category}</span>
            </div>
          )}
        </td>

        <td>{getConfidenceBadge()}</td>

        <td>{getStatusBadge()}</td>

        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
          {needs_review ? (
            <button
              type="button"
              className="btn btn-approve"
              onClick={handleQuickApprove}
              title="Confirm classification and approve write-off"
            >
              Approve
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-glass btn-sm"
              onClick={onToggleExpand}
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              {isExpanded ? 'Less' : 'Details'}
            </button>
          )}
        </td>
      </tr>

      {/* Expandable Audit Details Row */}
      {isExpanded && (
        <tr>
          <td colSpan="8" className="row-detail-cell">
            <div className="detail-grid">
              <div className="detail-item">
                <strong>Raw Bank Description</strong>
                <span title={raw_description}>{raw_description}</span>
              </div>

              <div className="detail-item">
                <strong>Schedule C Tax Line</strong>
                <span>{schedule_c_line || 'N/A'}</span>
              </div>

              <div className="detail-item">
                <strong>Deductible Amount</strong>
                <span>
                  {Math.round((deductible_percentage || 0) * 100)}% ({formatCurrency(deductible_amount)})
                </span>
              </div>

              <div className="detail-item">
                <strong>Decision Rule</strong>
                <span>{decision_rule || 'Deterministic rule pattern'}</span>
              </div>

              {review_reason && (
                <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                  <strong style={{ color: 'var(--accent-review)' }}>Review Reason</strong>
                  <span style={{ color: 'var(--accent-review)' }}>{review_reason}</span>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
