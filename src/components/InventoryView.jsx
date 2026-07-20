import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { statusOf, fmt } from "../utils/helpers";
import { RackGauge, StatusBadge } from "./RackGauge";

export default function InventoryView({ products, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const categories = useMemo(() => ["all", ...new Set(products.map((p) => p.category))], [products]);

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    const matchesStatus = status === "all" || statusOf(p) === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="view">
      <div className="toolbar">
        <div className="search-input search-input--wide">
          <Search size={15} />
          <input
            placeholder="Search by name, SKU, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="out">Out of stock</option>
          <option value="low">Low stock</option>
          <option value="healthy">Healthy</option>
          <option value="over">Overstock</option>
        </select>
        <button className="btn btn--primary" onClick={onAdd}><Plus size={15} /> Add product</button>
      </div>

      <div className="panel panel--table">
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Location</th>
              <th>Qty</th>
              <th>Stock level</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="table__empty">No products match these filters.</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="mono">{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td className="mono">{p.location}</td>
                <td className="mono">{fmt(p.qty)} {p.unit}</td>
                <td className="table__gauge"><RackGauge product={p} compact /></td>
                <td><StatusBadge status={statusOf(p)} /></td>
                <td className="table__actions">
                  <button className="icon-btn" onClick={() => onEdit(p)}><Pencil size={14} /></button>
                  <button className="icon-btn icon-btn--danger" onClick={() => onDelete(p.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
