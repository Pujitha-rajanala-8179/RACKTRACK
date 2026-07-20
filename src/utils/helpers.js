export const COLORS = {
  ink: "#1B2430",
  inkSoft: "#5B6472",
  bg: "#EEF0EA",
  surface: "#FFFFFF",
  surfaceAlt: "#E4E7DF",
  border: "#D6DACF",
  safety: "#FFB800",
  good: "#2F9E44",
  low: "#E8590C",
  out: "#E03131",
  over: "#4263EB",
};

export const STATUS_META = {
  out: { label: "OUT OF STOCK", color: COLORS.out, bg: "rgba(224,49,49,0.10)" },
  low: { label: "LOW STOCK", color: COLORS.low, bg: "rgba(232,89,12,0.10)" },
  healthy: { label: "HEALTHY", color: COLORS.good, bg: "rgba(47,158,68,0.10)" },
  over: { label: "OVERSTOCK", color: COLORS.over, bg: "rgba(66,99,235,0.10)" },
};

export const NAV = [
  { id: "dashboard", label: "Dashboard", num: "01" },
  { id: "inventory", label: "Inventory", num: "02" },
  { id: "orders", label: "Orders", num: "03" },
  { id: "alerts", label: "Alerts", num: "04" },
];

export const UNITS = ["pcs", "box", "pallet", "case", "kg", "roll"];

export function statusOf(p) {
  if (p.qty <= 0) return "out";
  if (p.qty <= p.reorderPoint) return "low";
  if (p.qty > p.maxLevel) return "over";
  return "healthy";
}

export function uid(prefix) {
  return `${prefix}-${Date.now().toString(36).slice(-5)}${Math.floor(Math.random() * 900 + 100)}`;
}

export function fmt(n) {
  return new Intl.NumberFormat("en-US").format(n);
}
