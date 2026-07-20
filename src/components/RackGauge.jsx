import { statusOf, STATUS_META } from "../utils/helpers";

// The signature visual: a horizontal shelf/rack gauge with tick marks
// at the reorder point and max level, filled and colored by status.
export function RackGauge({ product, compact }) {
  const status = statusOf(product);
  const meta = STATUS_META[status];
  const scale = Math.max(product.maxLevel * 1.25, product.qty * 1.1, 1);
  const fillPct = Math.min(100, (product.qty / scale) * 100);
  const reorderPct = Math.min(100, (product.reorderPoint / scale) * 100);
  const maxPct = Math.min(100, (product.maxLevel / scale) * 100);

  return (
    <div className={`rack-gauge ${compact ? "rack-gauge--compact" : ""}`}>
      <div className="rack-gauge__track">
        <div
          className="rack-gauge__fill"
          style={{ width: `${fillPct}%`, background: meta.color }}
        />
        <div className="rack-gauge__tick" style={{ left: `${reorderPct}%` }} title="Reorder point" />
        <div className="rack-gauge__tick rack-gauge__tick--max" style={{ left: `${maxPct}%` }} title="Max level" />
      </div>
      {!compact && (
        <div className="rack-gauge__labels">
          <span>0</span>
          <span>reorder {product.reorderPoint}</span>
          <span>max {product.maxLevel}</span>
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  return (
    <span className="badge" style={{ color: meta.color, background: meta.bg, borderColor: meta.color }}>
      {meta.label}
    </span>
  );
}
