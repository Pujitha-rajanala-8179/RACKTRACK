import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { COLORS, statusOf, fmt } from "../utils/helpers";
import { RackGauge, StatusBadge } from "./RackGauge";

export default function AlertsView({ products }) {
  const needsReorder = products.filter((p) => ["out", "low"].includes(statusOf(p))).sort((a, b) => a.qty - b.qty);
  const overstocked = products.filter((p) => statusOf(p) === "over").sort((a, b) => (b.qty - b.maxLevel) - (a.qty - a.maxLevel));

  return (
    <div className="view">
      <div className="dash-grid">
        <div className="panel">
          <div className="panel__header">
            <h3><AlertTriangle size={15} color={COLORS.low} /> Needs reorder</h3>
          </div>
          {needsReorder.length === 0 ? (
            <p className="empty-note">Nothing is low or out of stock right now.</p>
          ) : (
            <div className="alert-list">
              {needsReorder.map((p) => (
                <div key={p.id} className="alert-row">
                  <div className="alert-row__top">
                    <span className="mono">{p.sku}</span>
                    <StatusBadge status={statusOf(p)} />
                  </div>
                  <div className="alert-row__name">{p.name}</div>
                  <div className="alert-row__meta">{p.location} · {fmt(p.qty)} {p.unit} on hand</div>
                  <RackGauge product={p} compact />
                  <div className="alert-row__suggest">
                    Suggested reorder: <strong className="mono">{fmt(Math.max(p.maxLevel - p.qty, 0))} {p.unit}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel__header">
            <h3><ArrowUpRight size={15} color={COLORS.over} /> Overstocked</h3>
          </div>
          {overstocked.length === 0 ? (
            <p className="empty-note">No products currently exceed their max shelf level.</p>
          ) : (
            <div className="alert-list">
              {overstocked.map((p) => (
                <div key={p.id} className="alert-row">
                  <div className="alert-row__top">
                    <span className="mono">{p.sku}</span>
                    <StatusBadge status={statusOf(p)} />
                  </div>
                  <div className="alert-row__name">{p.name}</div>
                  <div className="alert-row__meta">{p.location} · {fmt(p.qty)} {p.unit} on hand</div>
                  <RackGauge product={p} compact />
                  <div className="alert-row__suggest">
                    {fmt(p.qty - p.maxLevel)} {p.unit} over max — consider redistributing or holding new stock.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
