import { useMemo } from "react";
import {
  Boxes, AlertTriangle, PackageX, PackageMinus, PackagePlus, CheckCircle2, ChevronRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { COLORS, statusOf, fmt } from "../utils/helpers";
import { RackGauge, StatusBadge } from "./RackGauge";

export default function Dashboard({ products, orders, setTab }) {
  const total = products.length;
  const totalUnits = products.reduce((s, p) => s + p.qty, 0);
  const low = products.filter((p) => statusOf(p) === "low");
  const out = products.filter((p) => statusOf(p) === "out");
  const over = products.filter((p) => statusOf(p) === "over");
  const today = new Date().toDateString();
  const ordersToday = orders.filter((o) => new Date(o.date).toDateString() === today);

  const categoryData = useMemo(() => {
    const map = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + p.qty; });
    return Object.entries(map).map(([category, units]) => ({ category, units }));
  }, [products]);

  const critical = [...out, ...low].sort((a, b) => a.qty - b.qty).slice(0, 5);

  const kpis = [
    { label: "Total SKUs", value: fmt(total), icon: Boxes, tone: "ink" },
    { label: "Units in stock", value: fmt(totalUnits), icon: PackagePlus, tone: "ink" },
    { label: "Low stock", value: fmt(low.length), icon: AlertTriangle, tone: "low" },
    { label: "Out of stock", value: fmt(out.length), icon: PackageX, tone: "out" },
    { label: "Overstocked", value: fmt(over.length), icon: PackageMinus, tone: "over" },
    { label: "Orders today", value: fmt(ordersToday.length), icon: CheckCircle2, tone: "good" },
  ];

  return (
    <div className="view">
      <div className="kpi-strip">
        {kpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className={`kpi-card__icon kpi-card__icon--${k.tone}`}><k.icon size={16} /></div>
            <div>
              <div className="kpi-card__value mono">{k.value}</div>
              <div className="kpi-card__label">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="panel">
          <div className="panel__header">
            <h3>Units by category</h3>
          </div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={categoryData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: COLORS.inkSoft, fontFamily: "Inter" }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: COLORS.ink, border: "none", borderRadius: 6, fontSize: 12, fontFamily: "Inter" }}
                  labelStyle={{ color: COLORS.safety, fontWeight: 600 }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="units" fill={COLORS.ink} radius={[3, 3, 0, 0]} maxBarSize={46} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <h3>Needs attention</h3>
            <button className="link-btn" onClick={() => setTab("alerts")}>View all <ChevronRight size={14} /></button>
          </div>
          {critical.length === 0 ? (
            <p className="empty-note">All stock levels are within range. Nothing needs attention right now.</p>
          ) : (
            <div className="attention-list">
              {critical.map((p) => (
                <div key={p.id} className="attention-row">
                  <div className="attention-row__top">
                    <span className="mono attention-row__sku">{p.sku}</span>
                    <StatusBadge status={statusOf(p)} />
                  </div>
                  <div className="attention-row__name">{p.name}</div>
                  <RackGauge product={p} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
